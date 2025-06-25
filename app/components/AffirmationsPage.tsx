'use client'

import React, { useState } from 'react'
import { Volume2, Save, Heart, RefreshCw } from 'lucide-react'
import { useAppStore } from '../store/useAppStore'
import { affirmations } from '../data/mockData'
import Card from './Card'
import Button from './Button'
import PrimeBadge from './PrimeBadge'
import Layout from './Layout'

const AffirmationsPage: React.FC = () => {
  const { addNote, isPrime } = useAppStore()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [savedAffirmations, setSavedAffirmations] = useState<Set<string>>(new Set())

  const currentAffirmation = affirmations[currentIndex]

  const handleSaveAffirmation = () => {
    addNote({
      content: currentAffirmation.text,
      type: 'affirmation'
    })
    setSavedAffirmations(prev => new Set(prev).add(currentAffirmation.id))
  }

  const handleNewAffirmation = () => {
    const nextIndex = (currentIndex + 1) % affirmations.length
    setCurrentIndex(nextIndex)
  }

  const playVoice = () => {
    alert('Voice affirmation would play via ElevenLabs API here')
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
                <Button size="sm" variant="outline" onClick={playVoice} icon={Volume2}>
                  Listen
                </Button>
                <Button 
                  size="sm" 
                  variant={savedAffirmations.has(currentAffirmation.id) ? 'primary' : 'outline'} 
                  onClick={handleSaveAffirmation} 
                  icon={Save}
                >
                  {savedAffirmations.has(currentAffirmation.id) ? 'Saved' : 'Save'}
                </Button>
                <Button size="sm" variant="outline" onClick={handleNewAffirmation} icon={RefreshCw}>
                  New One
                </Button>
              </div>
            </div>
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