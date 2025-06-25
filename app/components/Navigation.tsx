'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, MessageCircle, Calendar, Lightbulb, Sparkles, Crown, BookOpen } from 'lucide-react'
import { useAppStore } from '../store/useAppStore'
import { translations } from '../data/mockData'

const Navigation: React.FC = () => {
  const { language } = useAppStore()
  const pathname = usePathname()
  const t = translations[language]

  const navItems = [
    { href: '/', icon: Home, label: t.home },
    { href: '/ask', icon: MessageCircle, label: t.ask },
    { href: '/tracker', icon: Calendar, label: t.tracker },
    { href: '/tips', icon: Lightbulb, label: t.tips },
    { href: '/affirmations', icon: Sparkles, label: t.affirmations },
    { href: '/prime', icon: Crown, label: t.prime },
    { href: '/notes', icon: BookOpen, label: t.notes },
  ]

  return (
    <>
      {/* Desktop Sidebar Navigation */}
      <nav className="hidden lg:block bg-white rounded-2xl shadow-sm border border-primary-100 p-6">
        <div className="space-y-2">
          {navItems.map(({ href, icon: Icon, label }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 ${
                pathname === href
                  ? 'text-primary-600 bg-primary-50 shadow-sm border border-primary-200'
                  : 'text-gray-600 hover:text-primary-600 hover:bg-primary-25'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{label}</span>
            </Link>
          ))}
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-primary-100 z-50">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-around py-2">
            {navItems.map(({ href, icon: Icon, label }) => (
              <Link
                key={href}
                href={href}
                className={`flex flex-col items-center space-y-1 p-2 rounded-lg transition-colors ${
                  pathname === href
                    ? 'text-primary-600 bg-primary-50'
                    : 'text-gray-500 hover:text-primary-500 hover:bg-primary-25'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs font-medium">{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </>
  )
}

export default Navigation