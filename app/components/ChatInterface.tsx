"use client";

import React, { useState, useEffect, useRef } from 'react';
import { User, Send, Paperclip, RotateCcw, Trash2, Volume2, VolumeX, Settings } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  id?: string;
}

interface Character {
  id: string;
  name: string;
  avatar: string;
  specialty: string;
  description: string;
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  onSendMessage: (message: string) => void;
  onClearMessages: () => void;
  onRetryMessage: () => void;
  // TTS-related props
  audioEnabled?: boolean;
  setAudioEnabled?: (enabled: boolean) => void;
  voices?: any[];
  selectedVoice?: string;
  setSelectedVoice?: (voiceId: string) => void;
  playingMessageId?: string | null;
  ttsLoading?: Set<string>;
  onToggleAudio?: (messageId: string, text: string) => void;
}

const ChatInterface = ({ character }: { character: Character }) => {
  const [input, setInput] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const messageEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [character.messages]);

  const sendMessage = async () => {
    console.log('=== ChatInterface sendMessage called ===');
    console.log('Input:', input);
    console.log('Is loading:', character.isLoading);
    
    if (!input.trim() || character.isLoading) {
      console.log('Early return - empty input or loading');
      return;
    }

    character.onSendMessage(input);
    setInput('');
  };

  const retryLastMessage = () => {
    character.onRetryMessage();
    setInput('');
  };

  const clearChat = () => {
    character.onClearMessages();
    setInput('');
  };

  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // Convert messages to the format expected by the original component
  const convertedMessages = character.messages.map(msg => ({
    sender: msg.role === 'user' ? 'user' : 'bot',
    text: msg.content,
    timestamp: msg.timestamp,
    id: msg.id
  }));

  return (
    <div className="flex flex-col h-[80vh] max-w-full mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between bg-gradient-to-r from-blue-500 to-indigo-500 p-4">
        <div className="flex items-center">
          {character.avatar ? (
            <img src={character.avatar} alt={character.name} className="w-16 h-16 rounded-full border-2 border-white" />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-400 to-indigo-400 flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
          )}
          <div className="ml-4 text-white">
            <h2 className="text-xl font-bold">{character.name}</h2>
            <p className="text-sm opacity-90">{character.specialty}</p>
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="flex items-center space-x-2">
          {/* TTS Controls */}
          {character.audioEnabled !== undefined && (
            <>
              <button
                onClick={() => character.setAudioEnabled?.(!character.audioEnabled)}
                className={`p-2 rounded-lg transition-colors ${
                  character.audioEnabled 
                    ? 'text-white hover:bg-white hover:bg-opacity-20' 
                    : 'text-white opacity-50 hover:bg-white hover:bg-opacity-20'
                }`}
                title={character.audioEnabled ? 'Disable auto-speech' : 'Enable auto-speech'}
              >
                {character.audioEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              </button>
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                title="Voice settings"
              >
                <Settings className="w-5 h-5" />
              </button>
            </>
          )}
          
          {character.error && (
            <button 
              onClick={retryLastMessage}
              className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
              title="Retry last message"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          )}
          {convertedMessages.length > 0 && (
            <button 
              onClick={clearChat}
              className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
              title="Clear chat"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Voice Settings Panel */}
      {showSettings && character.voices && (
        <div className="bg-white border-b px-4 py-3">
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700">Voice:</label>
            <select
              value={character.selectedVoice || '54aMY52sJqjoIoZwarYW'}
              onChange={(e) => character.setSelectedVoice?.(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm"
            >
              <option value="54aMY52sJqjoIoZwarYW">Default Voice</option>
              {character.voices.map(voice => (
                <option key={voice.voice_id} value={voice.voice_id}>
                  {voice.name} ({voice.category})
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
        {convertedMessages.length === 0 && (
          <div className="text-center py-8">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 max-w-md mx-auto">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Welcome to {character.name}
              </h3>
              <p className="text-gray-600 text-sm mb-4">{character.description}</p>
              <p className="text-gray-500 text-xs">
                Start by asking a question about maternal health, pregnancy, or childcare.
              </p>
            </div>
          </div>
        )}

        {convertedMessages.map((msg, index) => (
          <div key={index} className={`mb-4 flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`${
              msg.sender === 'user' 
                ? 'bg-blue-500 text-white' 
                : 'bg-white text-gray-800 border border-gray-200'
            } p-3 rounded-lg max-w-xs lg:max-w-md shadow-sm`}>
              <div className="flex items-center justify-between mb-1">
                <strong className="text-sm">
                  {msg.sender === 'user' ? 'You' : character.name}
                </strong>
                <div className="flex items-center space-x-2">
                  <span className={`text-xs ${
                    msg.sender === 'user' ? 'text-blue-100' : 'text-gray-400'
                  }`}>
                    {formatTime(msg.timestamp)}
                  </span>
                  {/* TTS Button for bot messages */}
                  {msg.sender === 'bot' && character.onToggleAudio && msg.id && (
                    <button
                      onClick={() => character.onToggleAudio?.(msg.id!, msg.text)}
                      disabled={character.ttsLoading?.has(msg.id) || false}
                      className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                      title="Play/Stop audio"
                    >
                      {character.ttsLoading?.has(msg.id) ? (
                        <div className="animate-spin w-3 h-3 border border-gray-300 border-t-gray-600 rounded-full"></div>
                      ) : character.playingMessageId === msg.id ? (
                        <VolumeX className="w-3 h-3" />
                      ) : (
                        <Volume2 className="w-3 h-3" />
                      )}
                    </button>
                  )}
                </div>
              </div>
              <div className="whitespace-pre-wrap text-sm">{msg.text}</div>
            </div>
          </div>
        ))}

        {/* Loading indicator */}
        {character.isLoading && (
          <div className="mb-4 flex justify-start">
            <div className="bg-white text-gray-800 border border-gray-200 p-3 rounded-lg max-w-xs shadow-sm">
              <div className="flex items-center space-x-2">
                <strong className="text-sm">{character.name}:</strong>
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error indicator */}
        {character.error && (
          <div className="mb-4 flex justify-center">
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 max-w-md">
              <p className="text-red-700 text-sm mb-2">
                Connection error: {character.error}
              </p>
              <button
                onClick={retryLastMessage}
                className="text-xs bg-red-100 hover:bg-red-200 text-red-700 px-2 py-1 rounded transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        <div ref={messageEndRef} />
      </div>

      {/* Input area */}
      <div className="flex items-center border-t border-gray-200 p-2">
        <button 
          className="p-2 text-gray-500 hover:text-gray-700 transition-colors" 
          aria-label="Attach a file"
          disabled={character.isLoading}
        >
          <Paperclip className="w-5 h-5" />
        </button>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleInputKeyDown}
          placeholder={character.isLoading ? "Waiting for response..." : `Ask ${character.name} about maternal health...`}
          className="flex-1 p-2 mx-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
          disabled={character.isLoading}
        />
        <button 
          onClick={sendMessage} 
          disabled={!input.trim() || character.isLoading}
          className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center min-w-[40px]" 
          aria-label="Send message"
        >
          {character.isLoading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <Send className="w-5 h-5" />
          )}
        </button>
      </div>
    </div>
  );
};

export default ChatInterface;