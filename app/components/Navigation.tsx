'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Calendar, Video, UserCircle } from 'lucide-react'
import { useAppStore } from '../store/useAppStore'
import { translations } from '../data/mockData'

function Navigation() {
  const { language } = useAppStore()
  const pathname = usePathname()
  const t = translations[language]

  const navItems = [
    { href: '/', icon: Home, label: t.home },
    { href: '/tracker', icon: Calendar, label: t.tracker },
    { href: '/video', icon: Video, label: t.video },
    { href: '/profile', icon: UserCircle, label: t.profile },
  ]

  return (
    <>
      <nav className="hidden lg:block rounded-2xl border border-zinc-200/80 bg-white/80 p-3 shadow-sm shadow-zinc-900/[0.04] backdrop-blur-xl">
        <div className="space-y-1">
          {navItems.map(({ href, icon: Icon, label }) => {
            const active = pathname === href
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                  active
                    ? 'bg-zinc-900 text-white shadow-md'
                    : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
                }`}
              >
                <Icon className="h-[18px] w-[18px] shrink-0 opacity-90" />
                <span>{label}</span>
              </Link>
            )
          })}
        </div>
      </nav>

      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-zinc-200/80 bg-white/95 backdrop-blur-xl pb-[env(safe-area-inset-bottom)]">
        <div className="mx-auto flex max-w-md items-stretch justify-around px-2 py-2">
          {navItems.map(({ href, icon: Icon, label }) => {
            const active = pathname === href
            return (
              <Link
                key={href}
                href={href}
                className={`flex min-w-[4.5rem] flex-col items-center gap-1 rounded-xl px-3 py-2 text-xs font-medium transition-colors ${
                  active ? 'text-violet-600' : 'text-zinc-500'
                }`}
              >
                <Icon className={`h-5 w-5 ${active ? 'text-violet-600' : ''}`} />
                {label}
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}

export default Navigation
