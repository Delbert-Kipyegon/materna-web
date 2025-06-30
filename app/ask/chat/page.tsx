"use client";

import React from 'react';
import Layout from '../../components/Layout';
import ChatInterface from '../../components/ChatInterface';

const ChatPage = () => {
  const character = {
    id: 'maya',
    name: 'Maya',
    avatar: '',
    specialty: 'Materna AI',
    description: 'Materna AI is here to assist you.',
  };

  return (
    <Layout>
      <ChatInterface character={character} />
    </Layout>
  );
};

export default ChatPage;