"use client";

import React, { useState, useEffect, useRef } from 'react';
import { User, Send, Paperclip, RotateCcw, Trash2 } from 'lucide-react';

interface ChatMessage {
  sender: string;
  text: string;
  timestamp: string;
}

interface Character {
  id: string;
  name: string;
  avatar: string;
  specialty: string;
  description: string;
}

const ChatInterface = ({ character }: { character: Character }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messageEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const sendMessage = async () => {
    console.log('=== ChatInterface sendMessage called ===');
    console.log('Input:', input);
    console.log('Is loading:', isLoading);
    
    if (!input.trim() || isLoading) {
      console.log('Early return - empty input or loading');
      return;
    }

    const userMessage: ChatMessage = { 
      sender: 'user', 
      text: input,
      timestamp: new Date().toISOString()
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      console.log('Making API call...');
      // Call the OpenAI API via your backend
      const response = await fetch('/api/llm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: input, 
          model: 'gpt-4',
          characterName: character.name
        }),
      });

      console.log('Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('API response data:', data);

      // FIXED: Check for data.reply directly (removed success check)
      if (data.reply) {
        const botMessage: ChatMessage = { 
          sender: 'bot', 
          text: data.reply,
          timestamp: new Date().toISOString()
        };
        setMessages((prev) => [...prev, botMessage]);
        console.log('Bot message added successfully');
      } else {
        console.error('No reply in response:', data);
        throw new Error(data.error || 'No reply received from API');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setError(errorMessage);
      
      const botErrorMessage: ChatMessage = { 
        sender: 'bot', 
        text: 'I apologize, but I encountered an error while processing your message. Please try again in a moment.',
        timestamp: new Date().toISOString()
      };
      setMessages((prev) => [...prev, botErrorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const retryLastMessage = () => {
    if (messages.length >= 2) {
      const lastUserMessage = messages
        .slice()
        .reverse()
        .find(msg => msg.sender === 'user');
      
      if (lastUserMessage) {
        // Remove the last bot message (error message)
        setMessages(prev => {
          const lastBotIndex = prev.map(msg => msg.sender).lastIndexOf('bot');
          if (lastBotIndex > -1) {
            return prev.slice(0, lastBotIndex);
          }
          return prev;
        });
        
        setInput(lastUserMessage.text);
        setError(null);
      }
    }
  };

  const clearChat = () => {
    setMessages([]);
    setError(null);
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
          {error && (
            <button 
              onClick={retryLastMessage}
              className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
              title="Retry last message"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          )}
          {messages.length > 0 && (
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

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
        {messages.length === 0 && (
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

        {messages.map((msg, index) => (
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
                <span className={`text-xs ${
                  msg.sender === 'user' ? 'text-blue-100' : 'text-gray-400'
                }`}>
                  {formatTime(msg.timestamp)}
                </span>
              </div>
              <div className="whitespace-pre-wrap text-sm">{msg.text}</div>
            </div>
          </div>
        ))}

        {/* Loading indicator */}
        {isLoading && (
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
        {error && (
          <div className="mb-4 flex justify-center">
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 max-w-md">
              <p className="text-red-700 text-sm mb-2">
                Connection error: {error}
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
          disabled={isLoading}
        >
          <Paperclip className="w-5 h-5" />
        </button>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleInputKeyDown}
          placeholder={isLoading ? "Waiting for response..." : `Ask ${character.name} about maternal health...`}
          className="flex-1 p-2 mx-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
          disabled={isLoading}
        />
        <button 
          onClick={sendMessage} 
          disabled={!input.trim() || isLoading}
          className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center min-w-[40px]" 
          aria-label="Send message"
        >
          {isLoading ? (
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