"use client";

import Layout from '../../components/Layout';
import { useRouter } from 'next/navigation';
import { User, Stethoscope, Heart, Brain, Eye, Smile, AlertCircle, RefreshCw, Video, MessageCircle, X } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';

// TypeScript Interfaces
interface Persona {
  persona_id: string;
  persona_name: string;
  system_prompt: string;
  default_replica_id: string;
  context?: string;
  created_at: string;
  updated_at: string;
}

interface Character {
  id: string;
  name: string;
  avatar: string;
  specialty: string;
  description: string;
  replica_id: string;
}

interface DebugInfo {
  apiKey: boolean;
  responses: Array<{
    personaId: string;
    status: number;
    success: boolean;
    data?: any;
    error?: string;
  }>;
}

interface IConversation {
  conversation_id: string;
  conversation_url?: string;
  status: string;
  created_at?: string;
}

// Main VideoPage Component
const VideoPage = () => {
  const router = useRouter();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<DebugInfo>({ apiKey: false, responses: [] });
  const [conversationLoading, setConversationLoading] = useState<string | null>(null);
  const [activeConversation, setActiveConversation] = useState<IConversation | null>(null);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const tavusRef = useRef<any>(null);

  // Pre-defined persona IDs
  const PERSONA_IDS = [
    "pdeff538e07a", "p6e066bd54ce", "pb7b753e8162", "p601b954420d"
  ];

  // Ensure API key is configured
  const apiKey = process.env.NEXT_PUBLIC_TAVUS_API_KEY;
  if (!apiKey) {
    setError('Tavus API key is not configured. Please add NEXT_PUBLIC_TAVUS_API_KEY to your environment variables.');
    setLoading(false);
    return;
  }

  // Fetch and transform personas
  useEffect(() => {
    const fetchPersonas = async () => {
      try {
        setLoading(true);

        const debugResponses: DebugInfo['responses'] = [];

        // Fetch each persona individually with detailed logging
        const personaPromises = PERSONA_IDS.map(async (personaId, index) => {
          try {
            const response = await fetch(`https://tavusapi.com/v2/personas/${personaId}`, {
              method: 'GET',
              headers: {
                'x-api-key': apiKey!,
                'Content-Type': 'application/json',
              },
            });

            const responseText = await response.text();
            let data;
            try {
              data = JSON.parse(responseText);
            } catch (parseError) {
              debugResponses.push({
                personaId,
                status: response.status,
                success: false,
                error: `JSON parse error: ${parseError}`
              });
              return null;
            }

            debugResponses.push({
              personaId,
              status: response.status,
              success: response.ok,
              data: data,
              error: response.ok ? undefined : `HTTP ${response.status}`
            });

            if (!response.ok) {
              return null;
            }

            // Transform persona data
            let personaData = null;
            if (data.data && Array.isArray(data.data) && data.data.length > 0) {
              personaData = data.data[0];
            } else if (data.data && !Array.isArray(data.data)) {
              personaData = data.data;
            } else if (data.persona_id) {
              personaData = data;
            }

            return personaData;
          } catch (error) {
            debugResponses.push({
              personaId,
              status: 0,
              success: false,
              error: `Network error: ${error}`
            });
            return null;
          }
        });

        const personas = await Promise.all(personaPromises);
        const validPersonas = personas.filter((persona): persona is Persona => persona !== null);

        setDebugInfo({
          apiKey: true,
          responses: debugResponses
        });

        if (validPersonas.length === 0) {
          throw new Error(`No valid personas found. Check debug info below.`);
        }

        const transformedCharacters: Character[] = validPersonas.map((persona) => ({
          id: persona.persona_id,
          name: persona.persona_name || 'Health Professional',
          avatar: '',
          specialty: extractSpecialtyFromPrompt(persona.system_prompt),
          description: extractDescriptionFromPrompt(persona.system_prompt),
          replica_id: persona.default_replica_id || '',
        }));

        setCharacters(transformedCharacters);
        setError(null);
      } catch (error) {
        setCharacters([]);
        setError(error instanceof Error ? error.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchPersonas();
  }, [apiKey]);

  // Conversation API functions
  const createConversation = async (personaId: string): Promise<IConversation> => {
    const response = await fetch("https://tavusapi.com/v2/conversations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey!,
      },
      body: JSON.stringify({
        persona_id: personaId,
        callback_url: `${window.location.origin}/api/tavus/callback`,
        properties: {
          max_call_duration: 3600,
          participant_left_timeout: 60,
          recording_enabled: false,
        }
      }),
    });

    if (!response?.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
    }
    
    return response.json();
  };

  const endConversation = async (conversationId: string) => {
    const response = await fetch(
      `https://tavusapi.com/v2/conversations/${conversationId}/end`,
      {
        method: "POST",
        headers: {
          "x-api-key": apiKey!,
        },
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error("Failed to end conversation");
    }
  };

  // Load Tavus SDK dynamically
  const loadTavusSDK = () => {
    return new Promise((resolve, reject) => {
      if (window.Tavus) {
        resolve(window.Tavus);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://vids.tavusapi.com/v2/tavus.js';
      script.onload = () => resolve(window.Tavus);
      script.onerror = () => reject(new Error('Failed to load Tavus SDK'));
      document.head.appendChild(script);
    });
  };

  // Initialize Tavus CVI
  const initializeTavusCVI = async (conversation: IConversation) => {
    await loadTavusSDK();

    if (!window.Tavus) {
      throw new Error('Tavus SDK not available');
    }

    if (!videoContainerRef.current) {
      throw new Error('Video container ref not found');
    }

    videoContainerRef.current.innerHTML = '';

    const tavusContainer = document.createElement('div');
    tavusContainer.id = 'tavus-container';
    tavusContainer.style.width = '100%';
    tavusContainer.style.height = '600px';
    tavusContainer.style.borderRadius = '12px';
    tavusContainer.style.overflow = 'hidden';
    videoContainerRef.current.appendChild(tavusContainer);

    const tavusInstance = new window.Tavus({
      conversationId: conversation.conversation_id,
      container: tavusContainer,
      onReady: () => console.log('Tavus CVI ready'),
      onError: (error: any) => console.error('Tavus CVI error:', error),
      onConversationEnd: () => closeVideoModal(),
      theme: {
        primaryColor: '#3b82f6',
        backgroundColor: '#ffffff',
      },
      controls: {
        mute: true,
        camera: true,
        endCall: true,
      }
    });

    tavusRef.current = tavusInstance;
  };

  // Helper functions
  const extractSpecialtyFromPrompt = (systemPrompt: string): string => {
    if (!systemPrompt) return 'Health Professional';
    
    const prompt = systemPrompt.toLowerCase();
    
    if (prompt.includes('cardiologist') || prompt.includes('heart')) return 'Cardiologist';
    if (prompt.includes('pediatrician') || prompt.includes('children')) return 'Pediatrician';
    if (prompt.includes('dermatologist') || prompt.includes('skin')) return 'Dermatologist';
    if (prompt.includes('neurologist') || prompt.includes('brain') || prompt.includes('nervous')) return 'Neurologist';
    if (prompt.includes('therapist') || prompt.includes('counselor') || prompt.includes('mental health')) return 'Mental Health Counselor';
    if (prompt.includes('psychologist') || prompt.includes('psychology')) return 'Psychologist';
    if (prompt.includes('psychiatrist')) return 'Psychiatrist';
    if (prompt.includes('orthopedic') || prompt.includes('bones')) return 'Orthopedic Specialist';
    if (prompt.includes('ophthalmologist') || prompt.includes('eye')) return 'Eye Specialist';
    if (prompt.includes('dentist') || prompt.includes('dental')) return 'Dentist';
    if (prompt.includes('nurse') || prompt.includes('nursing')) return 'Registered Nurse';
    if (prompt.includes('general practitioner') || prompt.includes('family medicine')) return 'General Practitioner';
    if (prompt.includes('doctor') || prompt.includes('physician')) return 'General Practitioner';
    
    return 'Health Professional';
  };

  const extractDescriptionFromPrompt = (systemPrompt: string): string => {
    if (!systemPrompt) return 'Dedicated healthcare professional ready to help';
    
    const firstSentence = systemPrompt.split('.')[0];
    if (firstSentence.length > 150) {
      return firstSentence.substring(0, 147) + '...';
    }
    return firstSentence + '.';
  };

  const getSpecialtyIcon = (specialty: string) => {
    if (specialty.includes('Cardiologist') || specialty.includes('Heart')) return <Heart className="w-6 h-6 text-red-500" />;
    if (specialty.includes('Mental Health') || specialty.includes('Psychologist') || specialty.includes('Psychiatrist')) return <Brain className="w-6 h-6 text-purple-500" />;
    if (specialty.includes('Eye') || specialty.includes('Ophthalmologist')) return <Eye className="w-6 h-6 text-blue-500" />;
    if (specialty.includes('General') || specialty.includes('Family')) return <Stethoscope className="w-6 h-6 text-green-500" />;
    if (specialty.includes('Pediatrician')) return <Smile className="w-6 h-6 text-yellow-500" />;
    return <User className="w-6 h-6 text-gray-500" />;
  };

  const handleCharacterClick = async (character: Character) => {
    try {
      setConversationLoading(character.id);
      setSelectedCharacter(character);
      
      if (!character.id) {
        throw new Error('Character ID is missing');
      }

      if (character.id.startsWith('demo-')) {
        alert(`Demo character: ${character.name}\nDemo mode - Tavus CVI integration would work with real persona IDs.`);
        return;
      }

      const conversation = await createConversation(character.id);
      setActiveConversation(conversation);
      setShowVideoModal(true);

      setTimeout(async () => {
        try {
          await initializeTavusCVI(conversation);
        } catch (error) {
          alert(`Failed to initialize video interface: ${error instanceof Error ? error.message : 'Unknown error'}`);
          closeVideoModal();
        }
      }, 100);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      alert(`Failed to start video conversation: ${errorMessage}\n\nPlease check:\n• Your Tavus API key and permissions\n• That the persona exists and is active\n• Your internet connection\n• Console for detailed error logs`);
    } finally {
      setConversationLoading(null);
    }
  };

  const closeVideoModal = async () => {
    if (activeConversation?.conversation_id) {
      try {
        await endConversation(activeConversation.conversation_id);
      } catch (error) {
        console.error('Error ending conversation:', error);
      }
    }

    if (tavusRef.current) {
      try {
        tavusRef.current.destroy();
        tavusRef.current = null;
      } catch (error) {
        console.error('Error destroying Tavus instance:', error);
      }
    }

    if (videoContainerRef.current) {
      videoContainerRef.current.innerHTML = '';
    }

    setShowVideoModal(false);
    setActiveConversation(null);
    setSelectedCharacter(null);
  };

  const retryFetch = () => {
    setError(null);
    setLoading(true);
    window.location.reload();
  };

  if (loading) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto py-8 lg:py-16">
          <h1 className="text-3xl lg:text-5xl font-bold text-primary-900 mb-6 text-center">
            Connect with Health Professionals
          </h1>
          <div className="flex justify-center items-center min-h-[200px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <span className="ml-3 text-gray-600">Loading personas...</span>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-8 lg:py-16">
        <h1 className="text-3xl lg:text-5xl font-bold text-primary-900 mb-6 text-center">
          Connect with Health Professionals
        </h1>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            <div className="flex items-start justify-between">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 mr-2" />
                <div>
                  <p className="font-semibold">Error loading personas:</p>
                  <p className="text-sm">{error}</p>
                  <p className="text-sm mt-2">Check the debug information below and browser console for details.</p>
                </div>
              </div>
              <button
                onClick={retryFetch}
                className="ml-4 p-2 bg-red-200 hover:bg-red-300 rounded-lg transition-colors"
                title="Retry loading personas"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        <div className="mb-6 p-4 bg-gray-100 border border-gray-300 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            Debug Information
          </h3>
          <div className="space-y-2 text-sm">
            <p><strong>API Key Present:</strong> <span className={debugInfo.apiKey ? 'text-green-600' : 'text-red-600'}>{debugInfo.apiKey ? '✅ Yes' : '❌ No'}</span></p>
            <p><strong>Persona IDs Configured:</strong> {PERSONA_IDS.length}</p>
            <p><strong>Characters Loaded:</strong> {characters.length}</p>
            <p><strong>API Responses:</strong></p>
            <div className="ml-4 space-y-1">
              {debugInfo.responses.map((response, index) => (
                <div key={index} className="text-xs">
                  <span className="font-mono">{response.personaId}</span>: 
                  <span className={response.success ? 'text-green-600 ml-1' : 'text-red-600 ml-1'}>
                    {response.success ? `✅ ${response.status}` : `❌ ${response.error}`}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <p className="text-xs text-gray-600 mt-2">💡 Check your browser console (F12) for detailed logs</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {characters.length > 0 ? (
            characters.map((character) => (
              <div
                key={character.id}
                className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 border border-gray-100 hover:border-blue-200"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center flex-shrink-0">
                    {character.avatar ? (
                      <img 
                        src={character.avatar} 
                        alt={character.name} 
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-8 h-8 text-white" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-bold text-primary-900 truncate">{character.name}</h3>
                      {getSpecialtyIcon(character.specialty)}
                    </div>
                    <p className="text-sm font-medium text-blue-600 mb-2">{character.specialty}</p>
                    <p className="text-sm text-gray-600 line-clamp-2">{character.description}</p>
                    {character.id.startsWith('demo-') && (
                      <span className="inline-block mt-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">
                        Demo Data
                      </span>
                    )}
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <button 
                    onClick={() => handleCharacterClick(character)}
                    className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium py-2 px-4 rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    disabled={conversationLoading === character.id}
                  >
                    {conversationLoading === character.id ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                        Starting Video Chat...
                      </>
                    ) : (
                      <>
                        <Video className="w-4 h-4 mr-2" />
                        Start Video Conversation
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-600 mb-2">No health professionals available at the moment.</p>
              <p className="text-sm text-gray-500">Please check the debug information above.</p>
            </div>
          )}
        </div>

        {/* Video Modal */}
        {showVideoModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center space-x-3">
                  <Video className="w-6 h-6 text-blue-600" />
                  <div>
                    <h2 className="text-xl font-semibold">
                      Video Conversation with {selectedCharacter?.name}
                    </h2>
                    {selectedCharacter && (
                      <p className="text-sm text-gray-600">{selectedCharacter.specialty}</p>
                    )}
                    {activeConversation && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-sm rounded">
                        {activeConversation.status}
                      </span>
                    )}
                  </div>
                  {activeConversation && (
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-sm rounded">
                      {activeConversation.status}
                    </span>
                  )}
                </div>
                <button
                  onClick={closeVideoModal}
                  className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
                  title="End conversation and close"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-4">
                <div 
                  ref={videoContainerRef}
                  className="w-full min-h-[500px] bg-gray-100 rounded-lg flex items-center justify-center"
                >
                  <div className="text-center text-gray-500">
                    <MessageCircle className="w-12 h-12 mx-auto mb-4" />
                    <p>Initializing video conversation...</p>
                    <p className="text-sm mt-2">Please allow camera and microphone access</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Setup Instructions */}
        <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-3">Tavus CVI Integration Setup:</h3>
          <div className="space-y-2 text-sm text-blue-800">
            <p><strong>1. API Key:</strong> Ensure NEXT_PUBLIC_TAVUS_API_KEY in .env.local</p>
            <p><strong>2. Permissions:</strong> Your Tavus API key needs conversation creation permissions</p>
            <p><strong>3. Personas:</strong> Verify personas exist and are active in Tavus dashboard</p>
            <p><strong>4. SDK:</strong> Tavus JavaScript SDK will be loaded automatically</p>
            <p><strong>5. Browser Permissions:</strong> Users need to grant camera/microphone access</p>
            <p><strong>6. Callback URL:</strong> Optional webhook endpoint at /api/tavus/callback</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

// Add TypeScript declarations for window.Tavus
declare global {
  interface Window {
    Tavus: any;
  }
}

export default VideoPage;