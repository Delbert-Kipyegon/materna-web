'use client'

import React from 'react'
import { Globe } from 'lucide-react'
import { useAppStore } from '../store/useAppStore'
import { translations } from '../data/mockData'

const Header: React.FC = () => {
  const { language, setLanguage } = useAppStore()

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'sw' : 'en')
  }

  const t = translations[language]

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-primary-100">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-primary-500 to-coral-500 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-lg lg:text-xl">M</span>
          </div>
          <div>
            <span className="font-bold text-xl lg:text-2xl text-primary-900">Materna AI</span>
            <div className="hidden lg:block text-sm text-primary-600">Your Trusted Voice in Motherhood</div>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Desktop Stats */}
          <div className="hidden xl:flex items-center space-x-6 text-sm">
            <div className="text-center">
              <div className="font-bold text-primary-600">10k+</div>
              <div className="text-primary-500">Mothers</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-coral-600">24/7</div>
              <div className="text-coral-500">Support</div>
            </div>
          </div>
          
          <button
            onClick={toggleLanguage}
            className="flex items-center space-x-2 px-3 py-2 lg:px-4 lg:py-2 rounded-full bg-primary-100 hover:bg-primary-200 transition-colors"
            aria-label="Toggle language"
          >
            <Globe className="w-4 h-4 text-primary-600" />
            <span className="text-sm font-medium text-primary-700 uppercase">
              {language}
            </span>
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header