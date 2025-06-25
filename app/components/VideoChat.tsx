'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Video, VideoOff, Mic, MicOff, Phone, PhoneOff, Loader2, AlertCircle } from 'lucide-react'
import Button from './Button'
import Card from './Card'

interface VideoChatProps {
  onClose?: () => void
  className?: string
}

declare global {
  interface Window {
    Daily: any
  }
}

const VideoChat: React.FC<VideoChatProps> = ({ onClose, className = '' }) => {
  const [isConnecting, setIsConnecting] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoEnabled, setIsVideoEnabled] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [personaId, setPersonaId] = useState<string | null>(null)
  const [dailyRoomUrl, setDailyRoomUrl] = useState<string | null>(null)
  const [connectionStep, setConnectionStep] = useState<string>('')
  const videoContainerRef = useRef<HTMLDivElement>(null)
  const userVideoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const dailyCallRef = useRef<any>(null)
  const [dailyLoaded, setDailyLoaded] = useState(false)
  const [sdkLoadingAttempts, setSdkLoadingAttempts] = useState(0)

  // Tavus API configuration
  const TAVUS_API_KEY = process.env.TAVUS_API_KEY || ''
  const REPLICA_ID = process.env.TAVUS_REPLICA_ID || ''
  
  const hasValidKeys = TAVUS_API_KEY && 
                      REPLICA_ID && 
                      TAVUS_API_KEY !== 'your_tavus_api_key_here' && 
                      REPLICA_ID !== 'your_replica_id_here'

  const getApiKeyErrorMessage = () => {
    const missing = []
    if (!TAVUS_API_KEY || TAVUS_API_KEY === 'your_tavus_api_key_here') {
      missing.push('TAVUS_API_KEY')
    }
    if (!REPLICA_ID || REPLICA_ID === 'your_replica_id_here') {
      missing.push('TAVUS_REPLICA_ID')
    }
    
    if (missing.length > 0) {
      return `Missing or invalid API configuration: ${missing.join(', ')}. Please check your .env file and ensure all Tavus API keys are properly configured.`
    }
    return null
  }

  // Enhanced Daily.co SDK readiness check
  const isDailySDKReady = () => {
    return typeof window !== 'undefined' && 
           window.Daily && 
           typeof window.Daily.createFrame === 'function' &&
           typeof window.Daily.version === 'string'
  }

  // Load Daily.co SDK dynamically
  const loadDailySDK = () => {
    return new Promise<void>((resolve, reject) => {
      if (typeof window === 'undefined') {
        reject(new Error('Window not available'))
        return
      }

      // Check if already loaded
      if (isDailySDKReady()) {
        resolve()
        return
      }

      // Check if script tag already exists
      const existingScript = document.querySelector('script[src*="daily.co"]')
      if (existingScript) {
        // Script exists but SDK not ready, wait for it
        const checkReady = () => {
          if (isDailySDKReady()) {
            resolve()
          } else {
            setTimeout(checkReady, 100)
          }
        }
        checkReady()
        return
      }

      // Create and load the script
      const script = document.createElement('script')
      script.src = 'https://unpkg.com/@daily-co/daily-js@latest/dist/daily-iframe.js'
      script.async = true
      
      script.onload = () => {
        // Wait a bit for the SDK to initialize
        const checkReady = () => {
          if (isDailySDKReady()) {
            resolve()
          } else {
            setTimeout(checkReady, 100)
          }
        }
        checkReady()
      }
      
      script.onerror = () => {
        reject(new Error('Failed to load Daily.co SDK'))
      }
      
      document.head.appendChild(script)
    })
  }

  useEffect(() => {
    let mounted = true
    
    const initializeSDK = async () => {
      try {
        setSdkLoadingAttempts(prev => prev + 1)
        await loadDailySDK()
        
        if (mounted) {
          setDailyLoaded(true)
          setError(null)
        }
      } catch (error) {
        console.error('Failed to load Daily.co SDK:', error)
        
        if (mounted) {
          if (sdkLoadingAttempts < 3) {
            // Retry loading after a delay
            setTimeout(() => {
              if (mounted) {
                initializeSDK()
              }
            }, 2000)
          } else {
            setError('Failed to load video calling SDK. Please refresh the page and try again.')
          }
        }
      }
    }

    initializeSDK()

    return () => {
      mounted = false
      
      // Cleanup on unmount
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
        streamRef.current = null
      }
      if (dailyCallRef.current) {
        try {
          dailyCallRef.current.destroy()
        } catch (e) {
          console.error('Error destroying Daily call:', e)
        }
        dailyCallRef.current = null
      }
    }
  }, [sdkLoadingAttempts])

  // Step 1: Create or get a Persona
  const createTavusPersona = async () => {
    if (!hasValidKeys) {
      const errorMsg = getApiKeyErrorMessage()
      throw new Error(errorMsg || 'Tavus API keys not configured')
    }

    setConnectionStep('Setting up Maya\'s personality...')

    try {
      // First, try to list existing personas to see if we already have one
      const listResponse = await fetch('https://tavusapi.com/v2/personas', {
        method: 'GET',
        headers: {
          'x-api-key': TAVUS_API_KEY,
          'Content-Type': 'application/json',
        }
      })

      if (listResponse.ok) {
        const personas = await listResponse.json()
        const existingPersona = personas.data?.find((p: any) => 
          p.name === 'Maya Maternal Assistant' || 
          p.persona_name === 'Maya Maternal Assistant'
        )
        
        if (existingPersona) {
          console.log('Using existing persona:', existingPersona.persona_id)
          return existingPersona.persona_id
        }
      }

      // Create new persona if none exists
      const createResponse = await fetch('https://tavusapi.com/v2/personas', {
        method: 'POST',
        headers: {
          'x-api-key': TAVUS_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          persona_name: 'Maya Maternal Assistant',
          system_prompt: `You are Maya, a warm, experienced, and compassionate maternal health assistant. You are an AI designed to provide caring, supportive guidance to expectant and new mothers.

Key characteristics:
- Speak naturally and warmly, as if you're a trusted friend who happens to be a healthcare professional
- Always prioritize the mother's emotional wellbeing alongside physical health guidance
- Keep responses conversational, encouraging, and personalized
- Use inclusive language and be culturally sensitive
- Provide evidence-based information while being empathetic
- Always recommend consulting healthcare providers for medical concerns
- Be patient and understanding of pregnancy anxieties and concerns

Your role is to:
- Answer pregnancy and maternal health questions
- Provide emotional support and encouragement
- Share helpful tips for pregnancy wellness
- Guide mothers through common pregnancy experiences
- Celebrate milestones and achievements
- Offer reassurance during challenging times

Remember: You are not a replacement for medical care, but a supportive companion on the motherhood journey.`,
          context: 'maternal_health_support',
          persona_type: 'chat',
          layers: {
            llm: {
              model: 'gpt-4',
              system_prompt: 'You are Maya, a maternal health assistant. Be warm, supportive, and knowledgeable.',
              temperature: 0.7,
              max_tokens: 150
            },
            tts: {
              voice_id: 'female_warm_caring',
              stability: 0.8,
              similarity_boost: 0.8,
              style: 0.2,
              use_speaker_boost: true
            }
          }
        })
      })

      if (!createResponse.ok) {
        const errorData = await createResponse.json().catch(() => ({}))
        throw new Error(`Failed to create persona: ${errorData.message || createResponse.statusText}`)
      }

      const personaData = await createResponse.json()
      console.log('Created new persona:', personaData.persona_id)
      return personaData.persona_id

    } catch (error) {
      console.error('Error with persona:', error)
      throw error
    }
  }

  // Step 2: Create a Conversation
  const createTavusConversation = async (personaId: string) => {
    setConnectionStep('Creating conversation with Maya...')

    const response = await fetch('https://tavusapi.com/v2/conversations', {
      method: 'POST',
      headers: {
        'x-api-key': TAVUS_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        replica_id: REPLICA_ID,
        persona_id: personaId,
        conversation_name: 'Maternal Health Consultation',
        conversational_context: 'This is a supportive consultation session between Maya, an AI maternal health assistant, and an expectant or new mother seeking guidance and support.',
        custom_greeting: 'Hello beautiful mama! I\'m Maya, your personal maternal health assistant. I\'m so excited to be here with you today. How are you feeling, and what can I help you with on your pregnancy journey?',
        properties: {
          max_call_duration: 1800, // 30 minutes
          participant_left_timeout: 60,
          participant_absent_timeout: 120,
          enable_recording: false,
          enable_transcription: false,
          enable_closed_captions: true,
          apply_greenscreen: false,
          language: 'english'
        }
      })
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(`Failed to create conversation: ${errorData.message || response.statusText}`)
    }

    return await response.json()
  }

  // Step 3: Initialize Daily.co call with Tavus room
  const initializeDailyCall = async (conversationUrl: string) => {
    if (!isDailySDKReady()) {
      throw new Error('Daily.co SDK not ready')
    }

    setConnectionStep('Initializing video interface...')

    try {
      // Create the Daily call frame
      const callFrame = window.Daily.createFrame(videoContainerRef.current, {
        iframeStyle: {
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          border: 'none',
          borderRadius: '0.75rem'
        },
        showLeaveButton: false,
        showFullscreenButton: false,
        showLocalVideo: false, // We handle user video separately
        showParticipantsBar: false,
        activeSpeakerMode: true,
        theme: {
          colors: {
            accent: '#8b5cf6',
            accentText: '#ffffff',
            background: '#000000',
            backgroundAccent: '#1f2937',
            baseText: '#ffffff',
            border: '#374151',
            mainAreaBg: '#000000',
            mainAreaBgAccent: '#111827',
            mainAreaText: '#ffffff',
            supportiveText: '#9ca3af'
          }
        }
      })

      dailyCallRef.current = callFrame

      // Set up event listeners before joining
      callFrame.on('loading', () => {
        setConnectionStep('Loading video interface...')
      })

      callFrame.on('loaded', () => {
        setConnectionStep('Connecting to Maya...')
      })

      callFrame.on('joined-meeting', (event: any) => {
        console.log('Successfully joined meeting:', event)
        setConnectionStep('Connected! Maya will join shortly...')
        setTimeout(() => {
          setConnectionStep('')
          setIsConnecting(false)
          setIsConnected(true)
        }, 2000)
      })

      callFrame.on('participant-joined', (event: any) => {
        console.log('Participant joined:', event.participant)
        if (event.participant.user_name?.includes('Tavus') || 
            event.participant.user_name?.includes('Maya') ||
            event.participant.user_id?.includes('replica')) {
          setConnectionStep('Maya has joined the call! 👋')
          setTimeout(() => setConnectionStep(''), 3000)
        }
      })

      callFrame.on('participant-left', (event: any) => {
        console.log('Participant left:', event.participant)
        if (event.participant.user_name?.includes('Tavus') || 
            event.participant.user_name?.includes('Maya')) {
          setConnectionStep('Maya has left the call')
        }
      })

      callFrame.on('left-meeting', (event: any) => {
        console.log('Left meeting:', event)
        setIsConnected(false)
        if (onClose) onClose()
      })

      callFrame.on('error', (error: any) => {
        console.error('Daily call error:', error)
        let errorMessage = 'Video call error occurred'
        
        if (error.errorMsg) {
          if (error.errorMsg.includes('refused to connect')) {
            errorMessage = 'Unable to connect to video service. This may be due to network restrictions or firewall settings.'
          } else if (error.errorMsg.includes('permission')) {
            errorMessage = 'Camera or microphone permission denied. Please allow access and try again.'
          } else if (error.errorMsg.includes('not found') || error.errorMsg.includes('invalid')) {
            errorMessage = 'Invalid video room. Please try starting a new conversation.'
          } else {
            errorMessage = `Connection error: ${error.errorMsg}`
          }
        }
        
        setError(errorMessage)
        setIsConnecting(false)
        setConnectionStep('')
      })

      callFrame.on('camera-error', (error: any) => {
        console.error('Camera error:', error)
        setError('Camera access error. Please check your camera permissions.')
      })

      callFrame.on('network-quality-change', (event: any) => {
        if (event.quality === 'low') {
          console.warn('Low network quality detected')
        }
      })

      // Join the call with retry logic
      let joinAttempts = 0
      const maxJoinAttempts = 3
      
      const attemptJoin = async () => {
        try {
          joinAttempts++
          setConnectionStep(`Joining video call (attempt ${joinAttempts}/${maxJoinAttempts})...`)
          
          await callFrame.join({ 
            url: conversationUrl,
            userName: 'Expecting Mother',
            userData: {
              userType: 'patient',
              sessionType: 'maternal_consultation',
              timestamp: new Date().toISOString()
            }
          })
        } catch (joinError: any) {
          console.error(`Join attempt ${joinAttempts} failed:`, joinError)
          
          if (joinAttempts < maxJoinAttempts) {
            setConnectionStep(`Retrying connection in 2 seconds...`)
            setTimeout(attemptJoin, 2000)
          } else {
            throw new Error(`Failed to join call after ${maxJoinAttempts} attempts: ${joinError.message || 'Unknown error'}`)
          }
        }
      }

      await attemptJoin()

    } catch (error) {
      console.error('Error initializing Daily call:', error)
      throw error
    }
  }

  const startVideoChat = async () => {
    setIsConnecting(true)
    setError(null)
    setConnectionStep('Starting...')
    
    try {
      // Double-check SDK readiness
      if (!isDailySDKReady()) {
        throw new Error('Video SDK not ready. Please wait a moment and try again.')
      }

      // Check API keys first
      if (!hasValidKeys) {
        const errorMsg = getApiKeyErrorMessage()
        throw new Error(errorMsg || 'API configuration incomplete')
      }

      setConnectionStep('Requesting camera access...')
      
      // Get user media first
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        }, 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      })
      
      streamRef.current = stream
      
      if (userVideoRef.current) {
        userVideoRef.current.srcObject = stream
      }

      if (hasValidKeys) {
        // Step 1: Create or get persona
        const personaId = await createTavusPersona()
        setPersonaId(personaId)

        // Step 2: Create Tavus conversation
        const conversationData = await createTavusConversation(personaId)
        setConversationId(conversationData.conversation_id)
        setDailyRoomUrl(conversationData.conversation_url)

        console.log('Conversation created:', {
          id: conversationData.conversation_id,
          url: conversationData.conversation_url,
          status: conversationData.status
        })

        // Step 3: Initialize Daily.co call
        await initializeDailyCall(conversationData.conversation_url)
      } else {
        // Demo mode - simulate connection
        setConnectionStep('Demo mode - simulating connection...')
        setTimeout(() => {
          setConnectionStep('')
          setIsConnecting(false)
          setIsConnected(true)
        }, 2000)
      }

    } catch (error: any) {
      console.error('Error starting video chat:', error)
      setIsConnecting(false)
      setConnectionStep('')
      
      let errorMessage = 'Unable to start video chat.'
      
      if (error instanceof Error) {
        if (error.message.includes('Permission denied') || error.message.includes('NotAllowedError')) {
          errorMessage = 'Camera or microphone access denied. Please allow permissions and try again.'
        } else if (error.message.includes('NotFoundError')) {
          errorMessage = 'No camera or microphone found. Please check your devices and try again.'
        } else if (error.message.includes('refused to connect')) {
          errorMessage = 'Connection blocked by network or firewall. Please check your network settings or try a different connection.'
        } else if (error.message.includes('API') || error.message.includes('persona') || error.message.includes('conversation')) {
          errorMessage = error.message
        } else if (error.message.includes('SDK not ready')) {
          errorMessage = 'Video SDK is still loading. Please wait a moment and try again.'
        } else {
          errorMessage = `Connection error: ${error.message}`
        }
      }
      
      setError(errorMessage)
    }
  }

  const endVideoChat = async () => {
    try {
      setConnectionStep('Ending call...')

      // Leave Daily call first
      if (dailyCallRef.current) {
        try {
          await dailyCallRef.current.leave()
          dailyCallRef.current.destroy()
        } catch (e) {
          console.warn('Failed to properly leave Daily call:', e)
        }
        dailyCallRef.current = null
      }

      // End Tavus conversation
      if (conversationId && hasValidKeys) {
        try {
          await fetch(`https://tavusapi.com/v2/conversations/${conversationId}/end`, {
            method: 'POST',
            headers: {
              'x-api-key': TAVUS_API_KEY,
            }
          })
        } catch (e) {
          console.warn('Failed to end Tavus conversation:', e)
        }
      }

      // Stop local stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
        streamRef.current = null
      }

      setIsConnected(false)
      setConversationId(null)
      setPersonaId(null)
      setDailyRoomUrl(null)
      setConnectionStep('')
      
      if (onClose) {
        onClose()
      }
    } catch (error) {
      console.error('Error ending video chat:', error)
      // Still close the interface even if cleanup fails
      setIsConnected(false)
      setConnectionStep('')
      if (onClose) onClose()
    }
  }

  const toggleMute = () => {
    if (dailyCallRef.current) {
      const currentMuteState = dailyCallRef.current.localAudio()
      dailyCallRef.current.setLocalAudio(!currentMuteState)
      setIsMuted(!currentMuteState)
    } else if (streamRef.current) {
      const audioTrack = streamRef.current.getAudioTracks()[0]
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled
        setIsMuted(!audioTrack.enabled)
      }
    }
  }

  const toggleVideo = () => {
    if (dailyCallRef.current) {
      const currentVideoState = dailyCallRef.current.localVideo()
      dailyCallRef.current.setLocalVideo(!currentVideoState)
      setIsVideoEnabled(!currentVideoState)
    } else if (streamRef.current) {
      const videoTrack = streamRef.current.getVideoTracks()[0]
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled
        setIsVideoEnabled(videoTrack.enabled)
      }
    }
  }

  // Error state
  if (error) {
    return (
      <Card className={`bg-red-50 border-red-200 ${className}`}>
        <div className="p-6 lg:p-8 text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
          <div>
            <h3 className="text-lg font-semibold text-red-800 mb-2">Connection Error</h3>
            <p className="text-red-700 text-sm leading-relaxed mb-4">{error}</p>
            {!hasValidKeys && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-4">
                <p className="text-yellow-800 text-xs">
                  <strong>Configuration Required:</strong> Please set up your Tavus API keys in the .env file:
                  <br />• TAVUS_API_KEY (from Tavus dashboard)
                  <br />• TAVUS_REPLICA_ID (create or choose a replica)
                </p>
              </div>
            )}
            {error.includes('network') || error.includes('firewall') && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
                <p className="text-blue-800 text-xs">
                  <strong>Network Troubleshooting:</strong>
                  <br />• Try a different network connection
                  <br />• Disable VPN if active
                  <br />• Check firewall settings
                  <br />• Contact your network administrator
                </p>
              </div>
            )}
          </div>
          <div className="flex space-x-3 justify-center">
            <Button onClick={startVideoChat} variant="outline" disabled={!dailyLoaded}>
              Try Again
            </Button>
            <Button onClick={onClose} variant="ghost">
              Close
            </Button>
          </div>
        </div>
      </Card>
    )
  }

  if (!isConnected && !isConnecting) {
    return (
      <Card className={`bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200 ${className}`}>
        <div className="p-6 lg:p-8 text-center space-y-6">
          <div className="w-20 h-20 mx-auto bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <Video className="w-10 h-10 text-white" />
          </div>
          
          <div>
            <h3 className="text-xl lg:text-2xl font-bold text-purple-900 mb-3">
              Video Chat with Maya
            </h3>
            <p className="text-purple-700 lg:text-lg leading-relaxed">
              Connect face-to-face with Maya, your AI maternal health assistant. 
              Experience natural conversation with lifelike video interaction powered by Tavus.
            </p>
          </div>

          <div className="space-y-3 text-sm lg:text-base text-purple-600">
            <div className="flex items-center justify-center space-x-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span>Lifelike AI video conversation</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span>Real-time maternal guidance</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span>Natural voice interaction</span>
            </div>
          </div>

          <Button
            onClick={startVideoChat}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            icon={Video}
            disabled={!dailyLoaded}
          >
            {dailyLoaded ? 'Start Video Chat' : 'Loading Video SDK...'}
          </Button>

          <div className="text-xs text-purple-500 space-y-1">
            <p>Camera and microphone access required</p>
            {!dailyLoaded && (
              <p className="text-orange-600">⏳ Loading video calling SDK...</p>
            )}
            {!hasValidKeys && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-4">
                <p className="text-yellow-700 text-xs">
                  ⚠️ <strong>API Configuration Required:</strong> Configure Tavus API keys in .env file for full experience
                  <br />Missing: {getApiKeyErrorMessage()?.split(': ')[1] || 'API keys'}
                </p>
              </div>
            )}
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className={`bg-black overflow-hidden ${className}`}>
      <div className="relative aspect-video">
        {/* Video Container */}
        <div className="absolute inset-0">
          {isConnecting ? (
            <div className="flex items-center justify-center h-full bg-gradient-to-br from-purple-900 to-pink-900">
              <div className="text-center text-white space-y-4">
                <Loader2 className="w-12 h-12 mx-auto animate-spin" />
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    {connectionStep || 'Connecting to Maya...'}
                  </h3>
                  <p className="text-purple-200">Please wait while we set up your video chat</p>
                </div>
              </div>
            </div>
          ) : hasValidKeys ? (
            // Tavus CVI Container - This will contain the actual AI video
            <div 
              ref={videoContainerRef}
              className="w-full h-full bg-black rounded-lg overflow-hidden"
            />
          ) : (
            // Demo fallback
            <div className="w-full h-full bg-gradient-to-br from-purple-800 to-pink-800 flex items-center justify-center">
              <div className="text-center text-white">
                <div className="w-32 h-32 mx-auto mb-4 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                  <span className="text-4xl">👩‍⚕️</span>
                </div>
                <h3 className="text-2xl font-semibold mb-2">Maya</h3>
                <p className="text-purple-200">Your Maternal Health Assistant</p>
                <p className="text-yellow-300 text-sm mt-2">Demo Mode - Configure API keys for full experience</p>
              </div>
            </div>
          )}

          {/* User Video (Picture-in-Picture) */}
          <div className="absolute top-4 right-4 w-32 h-24 bg-gray-900 rounded-lg overflow-hidden border-2 border-white/20">
            <video
              ref={userVideoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover"
            />
            {!isVideoEnabled && (
              <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                <VideoOff className="w-6 h-6 text-gray-400" />
              </div>
            )}
          </div>

          {/* Connection Status */}
          <div className="absolute top-4 left-4 flex items-center space-x-2 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-white text-sm">
              {hasValidKeys ? 'Connected to Maya' : 'Demo Mode'}
            </span>
          </div>

          {/* Connection Step Indicator */}
          {connectionStep && (
            <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-black/70 backdrop-blur-sm rounded-lg px-4 py-2">
              <span className="text-white text-sm">{connectionStep}</span>
            </div>
          )}
        </div>

        {/* Controls */}
        {isConnected && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-4">
            <button
              onClick={toggleMute}
              className={`p-3 rounded-full transition-colors ${
                isMuted 
                  ? 'bg-red-500 hover:bg-red-600' 
                  : 'bg-white/20 hover:bg-white/30 backdrop-blur-sm'
              }`}
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? (
                <MicOff className="w-5 h-5 text-white" />
              ) : (
                <Mic className="w-5 h-5 text-white" />
              )}
            </button>

            <button
              onClick={toggleVideo}
              className={`p-3 rounded-full transition-colors ${
                !isVideoEnabled 
                  ? 'bg-red-500 hover:bg-red-600' 
                  : 'bg-white/20 hover:bg-white/30 backdrop-blur-sm'
              }`}
              title={isVideoEnabled ? 'Turn off camera' : 'Turn on camera'}
            >
              {isVideoEnabled ? (
                <Video className="w-5 h-5 text-white" />
              ) : (
                <VideoOff className="w-5 h-5 text-white" />
              )}
            </button>

            <button
              onClick={endVideoChat}
              className="p-3 bg-red-500 hover:bg-red-600 rounded-full transition-colors"
              title="End call"
            >
              <PhoneOff className="w-5 h-5 text-white" />
            </button>
          </div>
        )}
      </div>

      {/* Chat Info */}
      {isConnected && (
        <div className="p-4 bg-white border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-gray-900">Video Chat with Maya</h4>
              <p className="text-sm text-gray-600">
                AI Maternal Health Assistant {!hasValidKeys ? '(Demo Mode)' : ''}
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Status</div>
              <div className="text-sm text-green-600 font-medium">
                {hasValidKeys ? 'Live' : 'Demo'}
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  )
}

export default VideoChat