'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import type { AuthChangeEvent, Session, User } from '@supabase/supabase-js'
import { createBrowserSupabaseClient } from '@/lib/supabase/client'

const supabaseConfigured =
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

export default function AuthMenu() {
  const [user, setUser] = useState<User | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const supabase = createBrowserSupabaseClient()
    if (!supabase) {
      setReady(true)
      return
    }
    void supabase.auth.getUser().then(({ data }: { data: { user: User | null } }) => {
      setUser(data.user)
      setReady(true)
    })
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event: AuthChangeEvent, session: Session | null) => {
        setUser(session?.user ?? null)
      }
    )
    return () => subscription.unsubscribe()
  }, [])

  if (!ready) {
    return <div className="h-9 w-20 rounded-full bg-zinc-100 animate-pulse shrink-0" />
  }

  if (!supabaseConfigured) {
    return (
      <span className="text-[10px] text-zinc-400 max-w-[100px] text-right leading-tight hidden sm:block">
        Add NEXT_PUBLIC_SUPABASE_* for auth
      </span>
    )
  }

  if (!user) {
    return (
      <Link
        href="/auth/login"
        className="shrink-0 rounded-full border border-violet-200 bg-violet-50 px-4 py-2 text-xs font-semibold text-violet-800 hover:bg-violet-100 transition-colors"
      >
        Sign in
      </Link>
    )
  }

  return (
    <div className="flex items-center gap-2 shrink-0">
      <span className="hidden sm:block max-w-[140px] truncate text-xs text-zinc-600" title={user.email}>
        {user.email}
      </span>
      <button
        type="button"
        onClick={async () => {
          const supabase = createBrowserSupabaseClient()
          await supabase?.auth.signOut()
          window.location.href = '/'
        }}
        className="rounded-full border border-zinc-200 bg-white px-3 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors"
      >
        Sign out
      </button>
    </div>
  )
}
