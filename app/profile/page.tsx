"use client";

import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { apiFetch, getApiBaseUrl } from "../lib/api";

interface MeUser {
  id: string;
  email: string | null;
}

interface CallRecord {
  id: string;
  conversation_id: string;
  persona_id: string | null;
  replica_id: string | null;
  conversation_url: string | null;
  status: string;
  shutdown_reason: string | null;
  transcript: unknown;
  perception_analysis: unknown;
  sync_error: string | null;
  created_at: string;
  ended_at: string | null;
}

function formatJson(value: unknown): string {
  if (value === null || value === undefined) return "—";
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

function statusStyles(status: string) {
  switch (status) {
    case "completed":
      return "bg-emerald-50 text-emerald-800 border-emerald-200";
    case "active":
      return "bg-sky-50 text-sky-800 border-sky-200";
    case "ended_sync_failed":
      return "bg-amber-50 text-amber-900 border-amber-200";
    default:
      return "bg-zinc-100 text-zinc-700 border-zinc-200";
  }
}

export default function ProfilePage() {
  const [user, setUser] = useState<MeUser | null>(null);
  const [records, setRecords] = useState<CallRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const base = getApiBaseUrl();
    if (!base) {
      setError("API URL is not configured.");
      setLoading(false);
      return;
    }

    void (async () => {
      try {
        const res = await apiFetch("/api/me");
        const json = (await res.json().catch(() => ({}))) as {
          error?: string;
          user?: MeUser | null;
          records?: CallRecord[];
        };
        if (!res.ok) {
          throw new Error(
            typeof json.error === "string" ? json.error : `Error ${res.status}`
          );
        }
        setUser(json.user ?? null);
        setRecords(Array.isArray(json.records) ? json.records : []);
        setError(null);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Could not load profile.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="max-w-3xl mx-auto py-14 px-4">
          <div className="h-8 w-48 bg-zinc-200 rounded-lg animate-pulse mb-8 mx-auto" />
          <div className="h-40 rounded-2xl bg-zinc-100 animate-pulse" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto py-10 lg:py-14 px-4 pb-28 lg:pb-14">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-violet-600/90 mb-2">
          Your account
        </p>
        <h1 className="text-3xl font-semibold text-zinc-900 text-center mb-2 tracking-tight">
          Profile
        </h1>
        {user?.email && (
          <p className="text-center text-zinc-600 text-sm mb-10">{user.email}</p>
        )}
        {!user?.email && user?.id && (
          <p className="text-center text-zinc-500 text-xs mb-10 font-mono break-all px-2">
            User ID: {user.id}
          </p>
        )}

        {error && (
          <div className="mb-8 p-4 rounded-2xl bg-red-50 border border-red-100 text-red-800 text-sm">
            {error}
          </div>
        )}

        <h2 className="text-lg font-semibold text-zinc-900 mb-4">Video visits</h2>
        <p className="text-sm text-zinc-500 mb-6 leading-relaxed">
          Call details, transcripts, and perception data from your Tavus sessions (saved when you
          end a visit).
        </p>

        {records.length === 0 ? (
          <p className="text-zinc-500 text-sm rounded-2xl border border-dashed border-zinc-200 bg-zinc-50/50 px-6 py-12 text-center leading-relaxed">
            No video sessions saved yet. After a visit, transcripts and analysis appear here.
          </p>
        ) : (
          <ul className="space-y-6">
            {records.map((r) => (
              <li
                key={r.id}
                className="rounded-2xl border border-zinc-200/80 bg-white shadow-sm shadow-zinc-900/[0.03] overflow-hidden"
              >
                <div className="px-5 py-4 border-b border-zinc-100 flex flex-wrap items-center justify-between gap-3">
                  <div className="min-w-0">
                    <time
                      className="text-sm font-medium text-zinc-900"
                      dateTime={r.created_at}
                    >
                      {new Date(r.created_at).toLocaleString()}
                    </time>
                    <p className="text-xs text-zinc-500 mt-1 font-mono break-all">
                      {r.conversation_id}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 text-xs font-semibold uppercase tracking-wide px-2.5 py-1 rounded-lg border ${statusStyles(r.status)}`}
                  >
                    {r.status.replace(/_/g, " ")}
                  </span>
                </div>
                <div className="px-5 py-4 space-y-3 text-sm">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-zinc-600">
                    <p>
                      <span className="text-zinc-400 font-medium uppercase text-[10px] tracking-wider block mb-0.5">
                        Persona
                      </span>
                      <span className="font-mono text-xs">{r.persona_id ?? "—"}</span>
                    </p>
                    <p>
                      <span className="text-zinc-400 font-medium uppercase text-[10px] tracking-wider block mb-0.5">
                        Replica
                      </span>
                      <span className="font-mono text-xs">{r.replica_id ?? "—"}</span>
                    </p>
                    {r.conversation_url && (
                      <p className="sm:col-span-2">
                        <span className="text-zinc-400 font-medium uppercase text-[10px] tracking-wider block mb-0.5">
                          Join URL
                        </span>
                        <a
                          href={r.conversation_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-violet-600 text-xs break-all hover:underline"
                        >
                          {r.conversation_url}
                        </a>
                      </p>
                    )}
                    {r.ended_at && (
                      <p className="sm:col-span-2">
                        <span className="text-zinc-400 font-medium uppercase text-[10px] tracking-wider block mb-0.5">
                          Ended
                        </span>
                        {new Date(r.ended_at).toLocaleString()}
                      </p>
                    )}
                    {r.shutdown_reason && (
                      <p className="sm:col-span-2">
                        <span className="text-zinc-400 font-medium uppercase text-[10px] tracking-wider block mb-0.5">
                          Shutdown reason
                        </span>
                        {r.shutdown_reason}
                      </p>
                    )}
                    {r.sync_error && (
                      <p className="sm:col-span-2 text-amber-800 bg-amber-50 rounded-lg px-3 py-2 text-xs border border-amber-100">
                        <strong>Sync note:</strong> {r.sync_error}
                      </p>
                    )}
                  </div>

                  <details className="group">
                    <summary className="cursor-pointer text-violet-700 font-medium text-sm hover:underline list-none flex items-center gap-2 [&::-webkit-details-marker]:hidden">
                      <span className="select-none">Transcript</span>
                    </summary>
                    <pre className="mt-2 text-xs bg-zinc-950 text-zinc-100 rounded-xl p-4 overflow-x-auto max-h-72 overflow-y-auto whitespace-pre-wrap break-words">
                      {formatJson(r.transcript)}
                    </pre>
                  </details>

                  <details className="group">
                    <summary className="cursor-pointer text-violet-700 font-medium text-sm hover:underline list-none flex items-center gap-2 [&::-webkit-details-marker]:hidden">
                      <span className="select-none">Perception analysis</span>
                    </summary>
                    <pre className="mt-2 text-xs bg-zinc-900 text-zinc-100 rounded-xl p-4 overflow-x-auto max-h-72 overflow-y-auto whitespace-pre-wrap break-words">
                      {formatJson(r.perception_analysis)}
                    </pre>
                  </details>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Layout>
  );
}
