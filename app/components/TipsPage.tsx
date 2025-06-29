'use client'

import React, { useState, useEffect } from 'react'
import { Volume2, Save, ThumbsUp, ThumbsDown, RefreshCw, Sparkles, Loader2, VolumeX, Pause } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useAppStore } from '../store/useAppStore'
import { useTTS } from '../hooks/useTTS'
import { dailyTips } from '../data/mockData'
import Card from './Card'
import Button from './Button'
import PrimeBadge from './PrimeBadge'
import Layout from './Layout'

const TipsPage: React.FC = () => {
  const router = useRouter()
  const { addNote } = useAppStore()
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
    checkConfiguration
  } = useTTS()
  const [currentTipIndex, setCurrentTipIndex] = useState(0)
  const [feedback, setFeedback] = useState<{ [key: string]: 'helpful' | 'not-helpful' }>({})

  const currentTip = dailyTips[currentTipIndex]

  const handleFeedback = (tipId: string, type: 'helpful' | 'not-helpful') => {
    setFeedback(prev => ({ ...prev, [tipId]: type }))
  }

  const handleSaveTip = () => {
    addNote({
      content: `${currentTip.title}: ${currentTip.content}`,
      type: 'tip'
    })
  }

  const handleNewTip = () => {
    const nextIndex = (currentTipIndex + 1) % dailyTips.length
    setCurrentTipIndex(nextIndex)
  }

  // Check TTS configuration on mount
  useEffect(() => {
    checkConfiguration()
  }, [checkConfiguration])

  const handleVoicePlay = async () => {
    if (!currentTip) return

    const tipText = `${currentTip.title}. ${currentTip.content}`

    if (isPlaying) {
      pause()
    } else if (ttsConfigured || fallbackSupported) {
      await speak(tipText, { voice_type: 'tips' })
    } else {
      alert('Text-to-speech is not supported in this browser.')
    }
  }

  const handleVoiceStop = () => {
    stop()
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      health: 'from-green-500 to-emerald-500',
      nutrition: 'from-orange-500 to-red-500',
      wellness: 'from-purple-500 to-pink-500',
      preparation: 'from-blue-500 to-indigo-500'
    }
    return colors[category as keyof typeof colors] || 'from-gray-500 to-gray-600'
  }

  return (
    <Layout>
      <div className="max-w-md mx-auto px-4 space-y-6">
        <div className="text-center py-4">
          <h1 className="text-2xl font-bold text-primary-900 mb-2">Daily Tips</h1>
          <p className="text-primary-600">Helpful guidance for your pregnancy journey</p>
        </div>

        {/* Current Tip */}
        <Card isPrime={currentTip.isPrime}>
          <div className="p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-3">
                  <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${getCategoryColor(currentTip.category)} text-white text-sm font-medium`}>
                    {currentTip.category}
                  </div>
                  {currentTip.isPrime && <PrimeBadge />}
                </div>
                <h2 className="text-xl font-bold text-primary-900 mb-3">
                  {currentTip.title}
                </h2>
              </div>
            </div>
            
            <p className="text-primary-700 leading-relaxed">
              {currentTip.content}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2 pt-4 border-t border-primary-100">
              <div className="flex space-x-1">
                <Button 
                  size="sm" 
                  variant={isPlaying ? "primary" : "outline"} 
                  onClick={handleVoicePlay}
                  disabled={ttsLoading || !currentTip}
                  icon={ttsLoading ? Loader2 : isPlaying ? Pause : (!ttsConfigured && !fallbackSupported) ? VolumeX : Volume2}
                >
                  {ttsLoading ? 'Loading...' : isPlaying ? 'Pause' : (!ttsConfigured && !fallbackSupported) ? 'No Voice' : 'Play Voice'}
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
              <Button size="sm" variant="outline" onClick={handleSaveTip} icon={Save}>
                Save Tip
              </Button>
              <Button size="sm" variant="outline" onClick={handleNewTip} icon={RefreshCw}>
                New Tip
              </Button>
            </div>
            
            {/* TTS Error Display */}
            {ttsError && (
              <div className="mt-2">
                <p className="text-sm text-red-600 bg-red-50 px-3 py-1 rounded-full text-center">
                  {ttsError}
                </p>
              </div>
            )}
            
            {/* TTS Status */}
            {usingFallback && fallbackSupported && (
              <div className="mt-2">
                <p className="text-xs text-blue-600 bg-blue-50 px-3 py-1 rounded-full text-center">
                  Using browser voice (Web Speech API)
                </p>
              </div>
            )}
            {ttsConfigured === false && !fallbackSupported && (
              <div className="mt-2">
                <p className="text-xs text-orange-600 bg-orange-50 px-3 py-1 rounded-full text-center">
                  Voice not supported in this browser.
                </p>
              </div>
            )}

            {/* Feedback */}
            <div className="pt-4 border-t border-primary-100">
              <p className="text-sm text-primary-600 mb-3">Was this tip helpful?</p>
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant={feedback[currentTip.id] === 'helpful' ? 'primary' : 'ghost'}
                  onClick={() => handleFeedback(currentTip.id, 'helpful')}
                  icon={ThumbsUp}
                >
                  Yes
                </Button>
                <Button
                  size="sm"
                  variant={feedback[currentTip.id] === 'not-helpful' ? 'primary' : 'ghost'}
                  onClick={() => handleFeedback(currentTip.id, 'not-helpful')}
                  icon={ThumbsDown}
                >
                  No
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Affirmations CTA */}
        <Card className="bg-gradient-to-r from-pink-50 to-purple-50 border-pink-200">
          <div className="p-6 text-center">
            <Sparkles className="w-8 h-8 text-pink-500 mx-auto mb-3" />
            <h3 className="font-semibold text-pink-900 mb-2">Need an Affirmation?</h3>
            <p className="text-pink-700 mb-4 text-sm">
              Get personalized affirmations to boost your confidence
            </p>
            <Button
              variant="secondary"
              onClick={() => router.push('/affirmations')}
              className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
            >
              Get Affirmation
            </Button>
          </div>
        </Card>

        {/* Tips Categories */}
        <Card>
          <div className="p-6">
            <h3 className="font-semibold text-primary-900 mb-4">Tip Categories</h3>
            <div className="grid grid-cols-2 gap-3">
              {['health', 'nutrition', 'wellness', 'preparation'].map((category) => (
                <div key={category} className="text-center">
                  <div className={`w-12 h-12 mx-auto mb-2 rounded-full bg-gradient-to-r ${getCategoryColor(category)} flex items-center justify-center`}>
                    <span className="text-white font-bold text-lg capitalize">
                      {category[0].toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm text-primary-600 capitalize">{category}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  )
}

export default TipsPage