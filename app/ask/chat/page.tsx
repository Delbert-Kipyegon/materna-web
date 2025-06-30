"use client";

import React, { useState, useCallback } from 'react';
import Layout from '../../components/Layout';
import ChatInterface from '../../components/ChatInterface';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

const ChatPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const character = {
    id: 'maya',
    name: 'Maya',
    avatar: '',
    specialty: 'Materna AI',
    description: 'Materna AI is here to assist you with maternal health guidance.',
  };

  const sendMessage = useCallback(async (inputMessage: string) => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date().toISOString(),
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

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      // FIXED: Check for data.reply directly (removed success check)
      if (data.reply) {
        const assistantMessage: Message = {
          role: 'assistant',
          content: data.reply,
          timestamp: new Date().toISOString(),
        };
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        throw new Error('No reply received from API');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setError(errorMessage);
      
      const assistantErrorMessage: Message = {
        role: 'assistant',
        content: 'I apologize, but I encountered an error while processing your message. Please try again in a moment.',
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, assistantErrorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, character.name]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

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
  };

  return (
    <Layout>
      <ChatInterface character={enhancedCharacter} />
    </Layout>
  );
};

export default ChatPage;