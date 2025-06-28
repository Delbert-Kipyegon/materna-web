"use client";

import React, { useState } from 'react';

const ChatInterface = ({ character }: { character: string }) => {
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
  const [input, setInput] = useState('');

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);

    // Simulate LLM response (replace with actual API call)
    const response = await fetch('/api/llm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ character, message: input }),
    });
    const data = await response.json();

    const botMessage = { sender: 'bot', text: data.reply };
    setMessages((prev) => [...prev, botMessage]);
    setInput('');
  };

  return (
    <div>
      <h2>Chat with {character}</h2>
      <div>
        {messages.map((msg, index) => (
          <p key={index} style={{ textAlign: msg.sender === 'user' ? 'right' : 'left' }}>
            <strong>{msg.sender}:</strong> {msg.text}
          </p>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your message..."
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default ChatInterface;
