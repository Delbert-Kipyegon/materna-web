import { createBrowserSupabaseClient } from '@/lib/supabase/client'

/**
 * materna-api base URL (no trailing slash), e.g. http://localhost:4000
 *
 * In development, defaults to http://localhost:4000 if NEXT_PUBLIC_API_URL is unset.
 * In production, set NEXT_PUBLIC_API_URL to your deployed API.
 */
export function getApiBaseUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') ?? ''
  if (fromEnv) return fromEnv
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:4000'
  }
  return ''
}

export function apiUrl(path: string): string {
  const base = getApiBaseUrl()
  const p = path.startsWith('/') ? path : `/${path}`
  return `${base}${p}`
}

/**
 * Browser-only: attaches Supabase `Authorization: Bearer` when the user is signed in.
 * Use for materna-api routes that require auth (e.g. Tavus). When Supabase env is missing,
 * calls behave like plain fetch (pair with SKIP_AUTH on the API in local dev).
 */
export async function apiFetch(path: string, init?: RequestInit): Promise<Response> {
  const headers = new Headers(init?.headers)
  const supabase = createBrowserSupabaseClient()
  if (supabase) {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (session?.access_token) {
      headers.set('Authorization', `Bearer ${session.access_token}`)
    }
  }
  return fetch(apiUrl(path), { ...init, headers })
}
