"use client";

import React, { useState } from 'react';
import TavusVideo from '../../components/TavusVideo'; // Corrected path for TavusVideo
import ChatInterface from '../../components/ChatInterface'; // Corrected path for ChatInterface
import Layout from '../components/Layout'; // Corrected path for Layout
import { useRouter } from 'next/navigation';
import { MessageCircle, Video } from 'lucide-react';

const AskPage = () => {
  const [mode, setMode] = useState<'chat' | 'video'>('chat');
  const [character, setCharacter] = useState<'doctor' | 'nurse' | 'nutritionist' | 'maternityNurse'>('doctor');
  const router = useRouter();

  return (
    <Layout>
      <div className="space-y-8 lg:space-y-12">
        {/* Hero Section */}
        <div className="text-center py-8 lg:py-16">
          <div className="w-20 h-20 lg:w-32 lg:h-32 mx-auto mb-6 bg-gradient-to-br from-primary-500 to-coral-500 rounded-full flex items-center justify-center">
            <span className="text-white text-2xl lg:text-4xl font-bold">A</span>
          </div>
          <h1 className="text-3xl lg:text-5xl xl:text-6xl font-bold text-primary-900 mb-4 lg:mb-6">
            Ask Materna AI
          </h1>
          <p className="text-lg lg:text-xl xl:text-2xl text-primary-600 max-w-2xl mx-auto">
            Choose between Chat or Video to get the support you need.
          </p>
        </div>

        {/* Options Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Chat Option */}
          <div
            className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg cursor-pointer flex items-center space-x-4"
            onClick={() => router.push('/ask/chat')}
          >
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
              <MessageCircle className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-primary-900">Chat</h3>
              <p className="text-primary-600">Interact with our AI-powered chat interface.</p>
            </div>
          </div>

          {/* Video Option */}
          <div
            className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg cursor-pointer flex items-center space-x-4"
            onClick={() => router.push('/ask/video')}
          >
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-green-500 to-teal-500 flex items-center justify-center">
              <Video className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-primary-900">Video</h3>
              <p className="text-primary-600">Connect with health professionals via video.</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AskPage;
