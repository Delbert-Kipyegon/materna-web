'use client'

import { useState, useRef, useCallback } from 'react'

interface TTSFallbackState {
  isPlaying: boolean
  isLoading: boolean
  error: string | null
  isSupported: boolean
}

export const useTTSFallback = () => {
  const [state, setState] = useState<TTSFallbackState>({
    isPlaying: false,
    isLoading: false,
    error: null,
    isSupported: typeof window !== 'undefined' && 'speechSynthesis' in window
  })

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)
  const currentTextRef = useRef<string>('')

  // Get appropriate voice for content type
  const getVoice = useCallback((voiceType?: 'affirmations' | 'tips') => {
    if (!state.isSupported) return null

    const voices = speechSynthesis.getVoices()
    
    if (voiceType === 'affirmations') {
      // Prefer female voices for affirmations
      return voices.find(voice => 
        voice.name.toLowerCase().includes('female') ||
        voice.name.toLowerCase().includes('woman') ||
        voice.gender === 'female'
      ) || voices.find(voice => voice.default) || voices[0]
    } else {
      // Prefer male voices for tips, or default
      return voices.find(voice => 
        voice.name.toLowerCase().includes('male') ||
        voice.name.toLowerCase().includes('man') ||
        voice.gender === 'male'
      ) || voices.find(voice => voice.default) || voices[0]
    }
  }, [state.isSupported])

  // Speak using Web Speech API
  const speak = useCallback(async (text: string, options: { voice_type?: 'affirmations' | 'tips' } = {}) => {
    if (!state.isSupported) {
      setState(prev => ({ ...prev, error: 'Speech synthesis not supported in this browser' }))
      return
    }

    if (!text.trim()) {
      setState(prev => ({ ...prev, error: 'No text provided' }))
      return
    }

    // Stop any current speech
    speechSynthesis.cancel()

    setState(prev => ({ 
      ...prev, 
      isLoading: true, 
      error: null, 
      isPlaying: false 
    }))

    currentTextRef.current = text

    try {
      const utterance = new SpeechSynthesisUtterance(text)
      utteranceRef.current = utterance

      // Configure voice
      const voice = getVoice(options.voice_type)
      if (voice) {
        utterance.voice = voice
      }

      // Configure speech parameters
      if (options.voice_type === 'affirmations') {
        utterance.rate = 0.8  // Slower for affirmations
        utterance.pitch = 1.1 // Slightly higher pitch
        utterance.volume = 0.9
      } else {
        utterance.rate = 0.9  // Normal speed for tips
        utterance.pitch = 1.0
        utterance.volume = 0.9
      }

      // Set up event listeners
      utterance.onstart = () => {
        setState(prev => ({ ...prev, isPlaying: true, isLoading: false }))
      }

      utterance.onend = () => {
        setState(prev => ({ ...prev, isPlaying: false }))
        utteranceRef.current = null
      }

      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event)
        setState(prev => ({ 
          ...prev, 
          error: 'Speech synthesis failed', 
          isLoading: false, 
          isPlaying: false 
        }))
        utteranceRef.current = null
      }

      utterance.onpause = () => {
        setState(prev => ({ ...prev, isPlaying: false }))
      }

      utterance.onresume = () => {
        setState(prev => ({ ...prev, isPlaying: true }))
      }

      // Start speaking
      speechSynthesis.speak(utterance)

    } catch (error) {
      console.error('TTS Fallback Error:', error)
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Failed to generate speech',
        isLoading: false,
        isPlaying: false
      }))
    }
  }, [state.isSupported, getVoice])

  // Stop current speech
  const stop = useCallback(() => {
    speechSynthesis.cancel()
    setState(prev => ({ ...prev, isPlaying: false }))
    utteranceRef.current = null
  }, [])

  // Pause current speech
  const pause = useCallback(() => {
    if (speechSynthesis.speaking && !speechSynthesis.paused) {
      speechSynthesis.pause()
    }
  }, [])

  // Resume paused speech
  const resume = useCallback(() => {
    if (speechSynthesis.paused) {
      speechSynthesis.resume()
    }
  }, [])

  return {
    // State
    isPlaying: state.isPlaying,
    isLoading: state.isLoading,
    error: state.error,
    isSupported: state.isSupported,
    currentText: currentTextRef.current,
    
    // Actions
    speak,
    stop,
    pause,
    resume
  }
} 