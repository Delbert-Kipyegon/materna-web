/**
 * Allow only same-origin paths (no protocol / //evil.com). Mitigates open redirects.
 */
export function safeInternalPath(
  raw: string | null | undefined,
  fallback: string
): string {
  if (raw == null || typeof raw !== 'string') return fallback
  const t = raw.trim()
  if (!t.startsWith('/') || t.startsWith('//')) return fallback
  if (t.includes('://')) return fallback
  return t
}
