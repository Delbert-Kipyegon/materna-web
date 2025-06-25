'use client'

import React, { useState } from 'react'
import { Send, Mic, Volume2, Heart, RefreshCw, Save, ThumbsUp, ThumbsDown, Video } from 'lucide-react'
import { useAppStore } from '../store/useAppStore'
import Card from './Card'
import Button from './Button'
import VideoChat from './VideoChat'
import PrimeBadge from './PrimeBadge'
import Layout from './Layout'

const AskPage: React.FC = () => {
  const [question, setQuestion] = useState('')
  const [response, setResponse] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [feedback, setFeedback] = useState<'helpful' | 'not-helpful' | null>(null)
  const [showVideoChat, setShowVideoChat] = useState(false)
  const { addNote, isPrime } = useAppStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!question.trim()) return

    setIsLoading(true)
    setResponse('')
    
    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "During pregnancy, it's normal to experience various changes in your body. I recommend staying hydrated, getting adequate rest, and maintaining regular prenatal checkups with your healthcare provider. For specific symptoms, it's always best to consult with your doctor or midwife who can provide personalized advice based on your medical history.",
        "Nutrition plays a crucial role in your baby's development. Focus on eating a balanced diet rich in folate, iron, calcium, and protein. Consider taking prenatal vitamins as recommended by your healthcare provider. Avoid raw fish, unpasteurized dairy, and limit caffeine intake.",
        "Gentle exercise during pregnancy can be beneficial for both you and your baby. Walking, swimming, and prenatal yoga are generally safe options. However, always consult with your healthcare provider before starting any new exercise routine during pregnancy.",
        "It's completely normal to feel anxious during pregnancy. Try relaxation techniques like deep breathing, meditation, or prenatal massage. Don't hesitate to talk to your healthcare provider about your concerns - they're there to support you throughout your journey."
      ]
      const randomResponse = responses[Math.floor(Math.random() * responses.length)]
      setResponse(randomResponse)
      setIsLoading(false)
    }, 2000)
  }

  const handleFeedback = (type: 'helpful' | 'not-helpful') => {
    setFeedback(type)
  }

  const handleSaveToNotes = () => {
    if (response) {
      addNote({
        content: `Q: ${question}\nA: ${response}`,
        type: 'custom'
      })
    }
  }

  const playVoice = () => {
    alert('Voice playback would integrate with ElevenLabs API here')
  }

  if (showVideoChat) {
    return (
      <Layout>
        <div className="space-y-6 lg:space-y-8">
          <div className="text-center py-4">
            <h1 className="text-2xl lg:text-4xl font-bold text-primary-900 mb-2">Video Chat</h1>
            <p className="text-primary-600 lg:text-lg">Face-to-face guidance with Maya</p>
          </div>
          
          <VideoChat onClose={() => setShowVideoChat(false)} />
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="space-y-6 lg:space-y-8">
        <div className="text-center py-4 lg:py-8">
          <h1 className="text-2xl lg:text-4xl font-bold text-primary-900 mb-2">Ask a Question</h1>
          <p className="text-primary-600 lg:text-lg">Get AI-powered answers to your pregnancy questions</p>
        </div>

        {/* Video Chat CTA */}
        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <div className="p-6 lg:p-8 lg:flex lg:items-center lg:justify-between">
            <div className="text-center lg:text-left mb-4 lg:mb-0">
              <div className="flex items-center justify-center lg:justify-start space-x-2 mb-2">
                <Video className="w-6 h-6 text-purple-600" />
                <h3 className="font-semibold text-purple-900 lg:text-lg">Try Video Chat with Maya</h3>
                <PrimeBadge />
              </div>
              <p className="text-purple-700">
                Get personalized guidance through face-to-face conversation with your AI maternal health assistant
              </p>
            </div>
            <Button
              onClick={() => setShowVideoChat(true)}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              icon={Video}
            >
              Start Video Chat
            </Button>
          </div>
        </Card>

        <div className="lg:grid lg:grid-cols-2 lg:gap-8 space-y-6 lg:space-y-0">
          {/* Question Input */}
          <div className="lg:order-1">
            <Card>
              <form onSubmit={handleSubmit} className="p-6 lg:p-8 space-y-6">
                <div className="relative">
                  <textarea
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Ask me anything about pregnancy, nutrition, or baby care..."
                    className="w-full p-4 lg:p-6 border border-primary-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base lg:text-lg"
                    rows={6}
                  />
                  <button
                    type="button"
                    className="absolute bottom-4 right-4 p-3 text-primary-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                    aria-label="Voice input"
                  >
                    <Mic className="w-5 h-5" />
                  </button>
                </div>
                
                <Button 
                  type="submit" 
                  disabled={!question.trim() || isLoading} 
                  className="w-full lg:text-lg lg:py-4" 
                  icon={Send}
                >
                  {isLoading ? 'Getting Answer...' : 'Ask Question'}
                </Button>
              </form>
            </Card>
          </div>

          {/* Response */}
          <div className="lg:order-2">
            {(response || isLoading) && (
              <Card className="lg:h-full">
                <div className="p-6 lg:p-8 space-y-6 lg:h-full lg:flex lg:flex-col">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-coral-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">AI</span>
                    </div>
                    <span className="font-semibold text-primary-900 lg:text-lg">Materna AI</span>
                  </div>
                  
                  {isLoading ? (
                    <div className="flex items-center space-x-3 text-primary-600 lg:justify-center lg:flex-1">
                      <div className="animate-spin w-6 h-6 border-2 border-primary-300 border-t-primary-600 rounded-full"></div>
                      <span className="lg:text-lg">Thinking...</span>
                    </div>
                  ) : (
                    <div className="lg:flex-1 lg:flex lg:flex-col">
                      <p className="text-primary-800 leading-relaxed lg:text-lg lg:flex-1">{response}</p>
                      
                      <div className="space-y-6 pt-6 border-t border-primary-100">
                        <div className="flex flex-wrap gap-3">
                          <Button size="sm" variant="outline" onClick={playVoice} icon={Volume2}>
                            Play Voice
                          </Button>
                          <Button size="sm" variant="outline" onClick={handleSaveToNotes} icon={Save}>
                            Save
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => setResponse('')} icon={RefreshCw}>
                            Ask Again
                          </Button>
                        </div>

                        <div>
                          <p className="text-sm lg:text-base text-primary-600 mb-3 flex items-center">
                            <Heart className="w-4 h-4 mr-2" />
                            Was this helpful?
                          </p>
                          <div className="flex space-x-3">
                            <Button
                              size="sm"
                              variant={feedback === 'helpful' ? 'primary' : 'ghost'}
                              onClick={() => handleFeedback('helpful')}
                              icon={ThumbsUp}
                            >
                              Yes
                            </Button>
                            <Button
                              size="sm"
                              variant={feedback === 'not-helpful' ? 'primary' : 'ghost'}
                              onClick={() => handleFeedback('not-helpful')}
                              icon={ThumbsDown}
                            >
                              No
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            )}
          </div>
        </div>

        {/* Tips Section */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <div className="p-6 lg:p-8">
            <div className="lg:flex lg:items-center lg:justify-between">
              <div className="text-center lg:text-left mb-4 lg:mb-0">
                <h3 className="font-semibold text-blue-900 mb-2 lg:text-lg">💡 Pro Tips for Better Answers</h3>
                <div className="space-y-2 text-sm lg:text-base text-blue-700">
                  <p>• Be specific about your symptoms or concerns</p>
                  <p>• Mention your pregnancy week if relevant</p>
                  <p>• Include any relevant medical history</p>
                </div>
              </div>
              <div className="hidden lg:block w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-3xl">💡</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  )
}

export default AskPage