'use client'

import React, { useState, useEffect } from 'react'
import { Volume2, Save, Heart, RefreshCw, Loader2, VolumeX, Pause, Play } from 'lucide-react'
import { useAppStore } from '../store/useAppStore'
import { useAffirmations } from '../hooks/useAffirmations'
import { useTTS } from '../hooks/useTTS'
import Card from './Card'
import Button from './Button'
import PrimeBadge from './PrimeBadge'
import Layout from './Layout'

const AffirmationsPage: React.FC = () => {
  const { addNote, isPrime } = useAppStore()
  const { 
    currentAffirmation, 
    loading, 
    error, 
    fetchRandomAffirmation, 
    nextAffirmation 
  } = useAffirmations()
  const {
    isPlaying,
    isLoading: ttsLoading,
    error: ttsError,
    isConfigured: ttsConfigured,
    usingFallback,
    fallbackSupported,
    speak,
    stop,
    pause,
    resume,
    checkConfiguration
  } = useTTS()
  const [savedAffirmations, setSavedAffirmations] = useState<Set<string>>(new Set())

  const handleSaveAffirmation = () => {
    if (currentAffirmation) {
      addNote({
        content: currentAffirmation.text,
        type: 'affirmation'
      })
      const id = currentAffirmation.id || currentAffirmation._id
      if (id) {
        setSavedAffirmations(prev => new Set(prev).add(id))
      }
    }
  }

  const handleNewAffirmation = () => {
    fetchRandomAffirmation()
  }

  // Check TTS configuration on mount
  useEffect(() => {
    checkConfiguration()
  }, [checkConfiguration])

  const handleVoicePlay = async () => {
    if (!currentAffirmation) return

    if (isPlaying) {
      pause()
    } else if (ttsConfigured || fallbackSupported) {
      await speak(currentAffirmation.text, { voice_type: 'affirmations' })
    } else {
      alert('Text-to-speech is not supported in this browser.')
    }
  }

  const handleVoiceStop = () => {
    stop()
  }

  const getCategoryEmoji = (category: string) => {
    const emojis = {
      confidence: '💪',
      strength: '🌟',
      love: '💝',
      peace: '🕊️'
    }
    return emojis[category as keyof typeof emojis] || '✨'
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      confidence: 'from-blue-500 to-indigo-500',
      strength: 'from-purple-500 to-pink-500',
      love: 'from-pink-500 to-rose-500',
      peace: 'from-green-500 to-teal-500'
    }
    return colors[category as keyof typeof colors] || 'from-gray-500 to-gray-600'
  }

  if (!isPrime) {
    return (
      <Layout>
        <div className="max-w-md mx-auto px-4 space-y-6">
          <div className="text-center py-4">
            <h1 className="text-2xl font-bold text-primary-900 mb-2">Affirmations</h1>
            <PrimeBadge size="md" className="mb-4" />
          </div>

          <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
            <div className="p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-xl font-bold text-yellow-800 mb-2">Premium Feature</h2>
              <p className="text-yellow-700 mb-6">
                Personalized affirmations are available with Materna Prime. Boost your confidence with daily positive messages.
              </p>
              <Button
                variant="secondary"
                className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
              >
                Upgrade to Prime
              </Button>
            </div>
          </Card>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="max-w-md mx-auto px-4 space-y-6">
        <div className="text-center py-4">
          <h1 className="text-2xl font-bold text-primary-900 mb-2">Daily Affirmations</h1>
          <div className="flex items-center justify-center space-x-2">
            <PrimeBadge />
            <p className="text-primary-600">Personalized for you</p>
          </div>
        </div>

        {/* Current Affirmation */}
        <Card className="bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 border-pink-200">
          <div className="p-8 text-center space-y-6">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-primary-500 mb-4" />
                <p className="text-primary-600">Loading your affirmation...</p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-8">
                <p className="text-red-600 mb-4">Error: {error}</p>
                <Button size="sm" variant="outline" onClick={() => fetchRandomAffirmation()}>
                  Try Again
                </Button>
              </div>
            ) : currentAffirmation ? (
              <>
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-2xl">{getCategoryEmoji(currentAffirmation.category)}</span>
                  <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${getCategoryColor(currentAffirmation.category)} text-white text-sm font-medium capitalize`}>
                    {currentAffirmation.category}
                  </div>
                </div>

                <blockquote className="text-xl font-medium text-primary-800 italic leading-relaxed">
                  "{currentAffirmation.text}"
                </blockquote>

                <div className="pt-4">
                  <div className="flex justify-center space-x-3 mb-4">
                    <div className="flex space-x-1">
                      <Button 
                        size="sm" 
                        variant={isPlaying ? "primary" : "outline"} 
                        onClick={handleVoicePlay}
                        disabled={ttsLoading || !currentAffirmation}
                        icon={ttsLoading ? Loader2 : isPlaying ? Pause : (!ttsConfigured && !fallbackSupported) ? VolumeX : Volume2}
                      >
                        {ttsLoading ? 'Loading...' : isPlaying ? 'Pause' : (!ttsConfigured && !fallbackSupported) ? 'No Voice' : 'Listen'}
                      </Button>
                      {isPlaying && (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={handleVoiceStop}
                          icon={VolumeX}
                        >
                          Stop
                        </Button>
                      )}
                    </div>
                    <Button 
                      size="sm" 
                      variant={savedAffirmations.has(currentAffirmation.id || currentAffirmation._id || '') ? 'primary' : 'outline'} 
                      onClick={handleSaveAffirmation} 
                      icon={Save}
                    >
                      {savedAffirmations.has(currentAffirmation.id || currentAffirmation._id || '') ? 'Saved' : 'Save'}
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={handleNewAffirmation} 
                      icon={RefreshCw}
                      disabled={loading}
                    >
                      New One
                    </Button>
                  </div>
                  
                  {/* TTS Error Display */}
                  {ttsError && (
                    <div className="mt-2 text-center">
                      <p className="text-sm text-red-600 bg-red-50 px-3 py-1 rounded-full">
                        {ttsError}
                      </p>
                    </div>
                  )}
                  
                  {/* TTS Status */}
                  {usingFallback && fallbackSupported && (
                    <div className="mt-2 text-center">
                      <p className="text-xs text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                        Using browser voice (Web Speech API)
                      </p>
                    </div>
                  )}
                  {ttsConfigured === false && !fallbackSupported && (
                    <div className="mt-2 text-center">
                      <p className="text-xs text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
                        Voice not supported in this browser.
                      </p>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="py-8">
                <p className="text-primary-600 mb-4">No affirmations available</p>
                <Button size="sm" variant="outline" onClick={() => fetchRandomAffirmation()}>
                  Load Affirmation
                </Button>
              </div>
            )}
          </div>
        </Card>

        {/* Affirmation Categories */}
        <Card>
          <div className="p-6">
            <h3 className="font-semibold text-primary-900 mb-4 text-center">Categories</h3>
            <div className="grid grid-cols-2 gap-4">
              {['confidence', 'strength', 'love', 'peace'].map((category) => (
                <div key={category} className="text-center">
                  <div className={`w-12 h-12 mx-auto mb-2 rounded-full bg-gradient-to-r ${getCategoryColor(category)} flex items-center justify-center`}>
                    <span className="text-xl">{getCategoryEmoji(category)}</span>
                  </div>
                  <span className="text-sm text-primary-600 capitalize font-medium">{category}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Breathing Exercise */}
        <Card className="bg-gradient-to-r from-green-50 to-teal-50 border-green-200">
          <div className="p-6 text-center">
            <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center animate-pulse-soft">
              <span className="text-white text-xl">🫁</span>
            </div>
            <h3 className="font-semibold text-green-900 mb-2">Take a Moment</h3>
            <p className="text-green-700 text-sm">
              Breathe deeply while reading your affirmation. Inhale confidence, exhale doubt.
            </p>
          </div>
        </Card>
      </div>
    </Layout>
  )
}

export default AffirmationsPage