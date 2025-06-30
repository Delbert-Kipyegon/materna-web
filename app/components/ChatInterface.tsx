"use client";

import React, { useState, useEffect, useRef } from 'react';
import { User, Send, Paperclip } from 'lucide-react';

interface ChatMessage {
  sender: string;
  text: string;
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
  const messageEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);

    // Structured prompt for GPT model
    const prompt = `
      You are ${character.name}, a compassionate and knowledgeable maternal healthcare assistant. Your role is to provide accurate, empathetic, and professional guidance to users seeking advice on maternal health, pregnancy, and childcare.

      **Persona:**
      - Name: ${character.name}
      - Specialty: ${character.specialty}
      - Description: ${character.description}

      **Context:**
      The user is seeking advice or information related to maternal health, pregnancy, or childcare. They may have specific concerns, questions, or need reassurance. Always prioritize empathy, clarity, and professionalism in your responses.

      **Task:**
      - Understand the user's query and provide a clear, concise, and accurate response.
      - If the query is medical in nature, provide general advice and recommend consulting a healthcare provider for personalized care.
      - Offer emotional support and encouragement where appropriate.

      **Exemplar:**
      User: "I'm feeling very anxious about my upcoming delivery. What can I do to prepare?"
      Response: "It's completely normal to feel anxious about delivery. Preparing a birth plan, attending prenatal classes, and discussing your concerns with your healthcare provider can help. Remember, you're not alone, and your care team is there to support you every step of the way."

      **Tone:**
      - Empathetic
      - Reassuring
      - Professional
      - Supportive

      User: ${input}
    `;

    // Simulating LLM response (replace this with your actual API call)
    const response = await fetch('/api/llm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });
    const data = await response.json();

    const botMessage = { sender: 'bot', text: data.reply };
    setMessages((prev) => [...prev, botMessage]);
    setInput('');
  };

  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-[80vh] max-w-full mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="flex items-center bg-gradient-to-r from-blue-500 to-indigo-500 p-4">
        {character.avatar ? (
          <img src={character.avatar} alt={character.name} className="w-16 h-16 rounded-full border-2 border-white" />
        ) : (
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
            <User className="w-8 h-8 text-white" />
          </div>
        )}
        <div className="ml-4 text-white">
          <h2 className="text-xl font-bold">{character.name}</h2>
          <p className="text-sm">{character.specialty}</p>
        </div>
      </div>
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
        {messages.map((msg, index) => (
          <div key={index} className={`mb-4 flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`${msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'} p-3 rounded-lg max-w-xs`}>
              <strong className="block mb-1">{msg.sender === 'user' ? 'You' : character.name}:</strong>
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={messageEndRef} />
      </div>
      <div className="flex items-center border-t border-gray-200 p-2">
        <button className="p-2 text-gray-500 hover:text-gray-700" aria-label="Attach a file">
          <Paperclip className="w-5 h-5" />
        </button>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleInputKeyDown}
          placeholder="Send a message..."
          className="flex-1 p-2 mx-2 border rounded-lg"
        />
        <button onClick={sendMessage} className="p-2 bg-blue-500 text-white rounded-lg" aria-label="Send message">
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default ChatInterface;