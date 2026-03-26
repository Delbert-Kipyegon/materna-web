"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { safeInternalPath } from "@/lib/safeRedirectPath";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const err = new URLSearchParams(window.location.search).get("error");
    if (err) {
      setMessage("Could not complete sign-in.");
    }
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const supabase = createBrowserSupabaseClient();
      if (!supabase) {
        setMessage("Supabase is not configured (NEXT_PUBLIC_SUPABASE_* env vars).");
        return;
      }
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error) {
        setMessage(error.message);
        return;
      }
      const nextRaw = new URLSearchParams(window.location.search).get("next");
      const next = safeInternalPath(nextRaw, "/video");
      router.push(next);
      router.refresh();
    } catch {
      setMessage("Sign-in failed. Check Supabase env vars on the web app.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout>
      <div className="mx-auto max-w-md py-16 px-4">
        <h1 className="text-2xl font-semibold text-zinc-900 mb-2">Sign in</h1>
        <p className="text-sm text-zinc-600 mb-8">
          Video visits require an account. Use email and password from your
          Supabase project (enable Email provider in Authentication → Providers).
        </p>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-zinc-500 mb-1.5">
              Email
            </label>
            <input
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-zinc-500 mb-1.5">
              Password
            </label>
            <input
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400"
            />
          </div>
          {message && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
              {message}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-zinc-900 text-white font-medium py-3 text-sm hover:bg-zinc-800 disabled:opacity-50"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-zinc-600">
          No account?{" "}
          <Link href="/auth/sign-up" className="text-violet-600 font-medium hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </Layout>
  );
}
