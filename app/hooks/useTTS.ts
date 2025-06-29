'use client'

import { useState, useRef, useCallback } from 'react'
import { useTTSFallback } from './useTTSFallback'

interface TTSState {
  isPlaying: boolean
  isLoading: boolean
  error: string | null
  isConfigured: boolean | null
}

interface TTSOptions {
  voice_type?: 'affirmations' | 'tips'
  voice_id?: string
  stability?: number
  similarity_boost?: number
  style?: number
  use_speaker_boost?: boolean
}

export const useTTS = () => {
  const [state, setState] = useState<TTSState>({
    isPlaying: false,
    isLoading: false,
    error: null,
    isConfigured: null
  })

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const currentTextRef = useRef<string>('')
  const [useFallback, setUseFallback] = useState(false)
  
  // Fallback TTS using Web Speech API
  const fallbackTTS = useTTSFallback()

  // Check if TTS is configured
  const checkConfiguration = useCallback(async () => {
    try {
      const response = await fetch('/api/tts')
      const result = await response.json()
      
      if (result.success) {
        setState(prev => ({ ...prev, isConfigured: result.data.configured }))
        return result.data.configured
      }
      return false
    } catch (error) {
      console.error('Error checking TTS configuration:', error)
      setState(prev => ({ ...prev, isConfigured: false }))
      return false
    }
  }, [])

  // Generate and play speech
  const speak = useCallback(async (text: string, options: TTSOptions = {}) => {
    if (!text.trim()) {
      setState(prev => ({ ...prev, error: 'No text provided' }))
      return
    }

    // If already using fallback or ElevenLabs is not configured, use fallback directly
    if (useFallback || state.isConfigured === false) {
      await fallbackTTS.speak(text, { voice_type: options.voice_type })
      return
    }

    // Stop any currently playing audio
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }

    setState(prev => ({ 
      ...prev, 
      isLoading: true, 
      error: null, 
      isPlaying: false 
    }))

    currentTextRef.current = text

    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          voice_type: options.voice_type || 'affirmations',
          ...options
        }),
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        // If ElevenLabs fails, fallback to Web Speech API
        console.warn('ElevenLabs TTS failed, falling back to Web Speech API:', result.error)
        setUseFallback(true)
        setState(prev => ({ ...prev, isLoading: false }))
        await fallbackTTS.speak(text, { voice_type: options.voice_type })
        return
      }

      // Create audio blob from base64
      const audioData = atob(result.data.audio)
      const audioArray = new Uint8Array(audioData.length)
      for (let i = 0; i < audioData.length; i++) {
        audioArray[i] = audioData.charCodeAt(i)
      }

      const audioBlob = new Blob([audioArray], { type: 'audio/mpeg' })
      const audioUrl = URL.createObjectURL(audioBlob)

      // Create and configure audio element
      const audio = new Audio(audioUrl)
      audioRef.current = audio

      audio.addEventListener('loadstart', () => {
        setState(prev => ({ ...prev, isLoading: true }))
      })

      audio.addEventListener('canplay', () => {
        setState(prev => ({ ...prev, isLoading: false }))
      })

      audio.addEventListener('play', () => {
        setState(prev => ({ ...prev, isPlaying: true, isLoading: false }))
      })

      audio.addEventListener('pause', () => {
        setState(prev => ({ ...prev, isPlaying: false }))
      })

      audio.addEventListener('ended', () => {
        setState(prev => ({ ...prev, isPlaying: false }))
        URL.revokeObjectURL(audioUrl) // Clean up
      })

      audio.addEventListener('error', (e) => {
        console.error('Audio playback error:', e)
        setState(prev => ({ 
          ...prev, 
          error: 'Failed to play audio', 
          isLoading: false, 
          isPlaying: false 
        }))
        URL.revokeObjectURL(audioUrl) // Clean up
      })

      // Start playback
      await audio.play()

    } catch (error) {
      console.error('TTS Error:', error)
      // On network or other errors, also fallback to Web Speech API
      console.warn('ElevenLabs TTS error, falling back to Web Speech API:', error)
      setUseFallback(true)
      setState(prev => ({ ...prev, isLoading: false }))
      try {
        await fallbackTTS.speak(text, { voice_type: options.voice_type })
      } catch (fallbackError) {
        setState(prev => ({ 
          ...prev, 
          error: 'Both ElevenLabs and Web Speech API failed',
          isLoading: false,
          isPlaying: false
        }))
      }
    }
  }, [useFallback, state.isConfigured, fallbackTTS])

  // Stop current playback
  const stop = useCallback(() => {
    if (useFallback) {
      fallbackTTS.stop()
    } else {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
      }
      setState(prev => ({ ...prev, isPlaying: false }))
    }
  }, [useFallback, fallbackTTS])

  // Pause current playback
  const pause = useCallback(() => {
    if (useFallback) {
      fallbackTTS.pause()
    } else {
      if (audioRef.current && !audioRef.current.paused) {
        audioRef.current.pause()
      }
    }
  }, [useFallback, fallbackTTS])

  // Resume playback
  const resume = useCallback(async () => {
    if (useFallback) {
      fallbackTTS.resume()
    } else {
      if (audioRef.current && audioRef.current.paused) {
        try {
          await audioRef.current.play()
        } catch (error) {
          console.error('Resume error:', error)
          setState(prev => ({ ...prev, error: 'Failed to resume playback' }))
        }
      }
    }
  }, [useFallback, fallbackTTS])

  return {
    // State - use fallback state when using fallback
    isPlaying: useFallback ? fallbackTTS.isPlaying : state.isPlaying,
    isLoading: useFallback ? fallbackTTS.isLoading : state.isLoading,
    error: useFallback ? fallbackTTS.error : state.error,
    isConfigured: useFallback ? fallbackTTS.isSupported : state.isConfigured,
    currentText: useFallback ? fallbackTTS.currentText : currentTextRef.current,
    
    // Actions
    speak,
    stop,
    pause,
    resume,
    checkConfiguration,
    
    // Additional info
    usingFallback: useFallback,
    fallbackSupported: fallbackTTS.isSupported
  }
} 