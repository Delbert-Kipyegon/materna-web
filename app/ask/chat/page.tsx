'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import Layout from '../../components/Layout';
import ChatInterface from '../../components/ChatInterface';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  id?: string; // Add id for TTS tracking
}

const ChatPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // TTS-related state
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [playingMessageId, setPlayingMessageId] = useState<string | null>(null);
  const [voices, setVoices] = useState<any[]>([]);
  const [selectedVoice, setSelectedVoice] = useState('JBFqnCBsd6RMkjVDRZzb');
  const [ttsLoading, setTtsLoading] = useState(new Set<string>());
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const character = {
    id: 'maya',
    name: 'Maya',
    avatar: '',
    specialty: 'Materna AI',
    description: 'Materna AI is here to assist you with maternal health guidance.',
  };

  // Load available voices on component mount
  useEffect(() => {
    loadVoices();
    
    // Initialize audio element
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.onended = handleAudioEnded;
      audioRef.current.onerror = (e) => {
        console.error('Audio playback error:', e);
        setPlayingMessageId(null);
        setCurrentAudio(null);
      };
    }
  }, []);

  const loadVoices = async () => {
    try {
      const response = await fetch('/api/tts?action=voices');
      if (response.ok) {
        const data = await response.json();
        setVoices(data.voices || []);
      }
    } catch (error) {
      console.error('Failed to load voices:', error);
    }
  };

  const generateAndPlayTTS = async (text: string, messageId: string) => {
    setTtsLoading(prev => new Set([...prev, messageId]));
    
    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text,
          voiceId: selectedVoice,
          messageId: messageId
        }),
      });

      if (!response.ok) {
        throw new Error(`TTS API error: ${response.status}`);
      }

      const data = await response.json();
      
      // Create audio blob and play
      const audioBlob = new Blob(
        [Uint8Array.from(atob(data.audioData), c => c.charCodeAt(0))],
        { type: 'audio/mpeg' }
      );
      
      const audioUrl = URL.createObjectURL(audioBlob);
      
      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        audioRef.current.play();
        setPlayingMessageId(messageId);
        setCurrentAudio(audioRef.current);
      }
      
    } catch (error) {
      console.error('TTS Error:', error);
    } finally {
      setTtsLoading(prev => {
        const newSet = new Set(prev);
        newSet.delete(messageId);
        return newSet;
      });
    }
  };

  const toggleAudio = (messageId: string, text: string) => {
    if (playingMessageId === messageId) {
      // Stop current audio
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
      }
      setPlayingMessageId(null);
      setCurrentAudio(null);
    } else {
      // Generate and play new audio
      generateAndPlayTTS(text, messageId);
    }
  };

  const handleAudioEnded = () => {
    setPlayingMessageId(null);
    setCurrentAudio(null);
  };

  const sendMessage = useCallback(async (inputMessage: string) => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessageId = `user_${Date.now()}`;
    const userMessage: Message = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date().toISOString(),
      id: userMessageId,
    };

    // Add user message immediately
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/llm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: inputMessage,
          model: 'gpt-4', // You can change this to 'gpt-3.5-turbo' for faster responses
          characterName: character.name,
        }),
      });

      const data = await response.json();
      
      // Debug: Log the actual response to see what format we're getting
      console.log('API Response:', data);

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      // Handle different response formats
      let assistantResponse = '';
      let timestamp = new Date().toISOString();

      if (data.success && data.reply) {
        // Expected format: {success: true, reply: "response"}
        assistantResponse = data.reply;
        timestamp = data.timestamp || timestamp;
      } else if (data.reply) {
        // Format without success flag: {reply: "response"}
        assistantResponse = data.reply;
        timestamp = data.timestamp || timestamp;
      } else if (data.message) {
        // Alternative format: {message: "response"}
        assistantResponse = data.message;
        timestamp = data.timestamp || timestamp;
      } else if (data.response) {
        // Another alternative format: {response: "response"}
        assistantResponse = data.response;
        timestamp = data.timestamp || timestamp;
      } else if (data.content) {
        // Another alternative format: {content: "response"}
        assistantResponse = data.content;
        timestamp = data.timestamp || timestamp;
      } else if (typeof data === 'string') {
        // Plain string response
        assistantResponse = data;
      } else if (data.choices && data.choices[0] && data.choices[0].message) {
        // OpenAI API format: {choices: [{message: {content: "response"}}]}
        assistantResponse = data.choices[0].message.content;
      } else {
        console.error('Unexpected response format:', data);
        throw new Error('Invalid response format from API - check console for details');
      }

      if (!assistantResponse || assistantResponse.trim() === '') {
        throw new Error('Empty response received from API');
      }

      const assistantMessageId = `assistant_${Date.now()}`;
      const assistantMessage: Message = {
        role: 'assistant',
        content: assistantResponse,
        timestamp: timestamp,
        id: assistantMessageId,
      };
      setMessages(prev => [...prev, assistantMessage]);
      
      // Auto-play TTS if enabled
      if (audioEnabled) {
        generateAndPlayTTS(assistantResponse, assistantMessageId);
      }

    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setError(errorMessage);
      
      const assistantErrorMessageId = `assistant_error_${Date.now()}`;
      const assistantErrorMessage: Message = {
        role: 'assistant',
        content: 'I apologize, but I encountered an error while processing your message. Please try again in a moment.',
        timestamp: new Date().toISOString(),
        id: assistantErrorMessageId,
      };
      setMessages(prev => [...prev, assistantErrorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, character.name, audioEnabled, selectedVoice]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
    // Stop any playing audio
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }
    setPlayingMessageId(null);
    setCurrentAudio(null);
  }, [currentAudio]);

  const retryLastMessage = useCallback(() => {
    if (messages.length >= 2) {
      const lastUserMessage = messages
        .slice()
        .reverse()
        .find(msg => msg.role === 'user');
      
      if (lastUserMessage) {
        // Remove the last assistant message (which was likely an error)
        setMessages(prev => {
          const lastAssistantIndex = prev.map(msg => msg.role).lastIndexOf('assistant');
          if (lastAssistantIndex > -1) {
            return prev.slice(0, lastAssistantIndex);
          }
          return prev;
        });
        
        // Retry sending the last user message
        sendMessage(lastUserMessage.content);
      }
    }
  }, [messages, sendMessage]);

  // Enhanced character object with additional properties for ChatInterface
  const enhancedCharacter = {
    ...character,
    messages,
    isLoading,
    error,
    onSendMessage: sendMessage,
    onClearMessages: clearMessages,
    onRetryMessage: retryLastMessage,
    // TTS-related props
    audioEnabled,
    setAudioEnabled,
    voices,
    selectedVoice,
    setSelectedVoice,
    playingMessageId,
    ttsLoading,
    onToggleAudio: toggleAudio,
  };

  return (
    <Layout>
      <ChatInterface character={enhancedCharacter} />
    </Layout>
  );
};

export default ChatPage;