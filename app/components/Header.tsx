'use client'

import Link from 'next/link'
import { Globe } from 'lucide-react'
import { useAppStore } from '../store/useAppStore'
import { translations } from '../data/mockData'
import AuthMenu from './AuthMenu'

function Header() {
  const { language, setLanguage } = useAppStore()
  const t = translations[language]

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200/60 bg-white/75 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 lg:px-8">
        <Link href="/" className="flex items-center gap-3 min-w-0 group">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-500/25 ring-2 ring-white">
            <span className="text-lg font-bold tracking-tight">M</span>
          </div>
          <div className="min-w-0 text-left">
            <span className="block truncate text-lg font-semibold tracking-tight text-zinc-900 group-hover:text-violet-700 transition-colors">
              Materna
            </span>
            <span className="hidden text-xs text-zinc-500 sm:block truncate">{t.tagline}</span>
          </div>
        </Link>

        <div className="flex items-center gap-2 shrink-0">
          <AuthMenu />
          <button
            type="button"
            onClick={() => setLanguage(language === 'en' ? 'sw' : 'en')}
            className="flex shrink-0 items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-2 text-xs font-semibold uppercase tracking-wider text-zinc-700 shadow-sm hover:border-zinc-300 hover:bg-zinc-50 transition-colors"
            aria-label="Toggle language"
          >
            <Globe className="h-3.5 w-3.5 text-violet-600" />
            {language}
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
