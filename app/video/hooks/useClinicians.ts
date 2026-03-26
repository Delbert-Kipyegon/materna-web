import { useEffect, useState } from "react";
import { apiFetch, getApiBaseUrl } from "../../lib/api";
import type { Character } from "../types";

export function useClinicians(personaIds: readonly string[]) {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const base = getApiBaseUrl();
    if (!base) {
      setError(
        "NEXT_PUBLIC_API_URL is not set. Configure it to your deployed materna-api URL."
      );
      setLoading(false);
      return;
    }

    const load = async () => {
      try {
        setLoading(true);
        const res = await apiFetch("/api/tavus/clinicians", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ persona_ids: [...personaIds] }),
        });
        const json = await res.json().catch(() => ({}));
        if (!res.ok) {
          if (res.status === 401) {
            throw new Error(
              "Sign in required (header → Sign in). For local dev without Supabase, set SKIP_AUTH=true on materna-api only."
            );
          }
          throw new Error(
            typeof json.error === "string"
              ? json.error
              : `Failed to load clinicians (${res.status})`
          );
        }
        if (!json.success || !Array.isArray(json.characters)) {
          throw new Error(json.error || "Unexpected response from API");
        }
        setCharacters(json.characters as Character[]);
        setError(null);
      } catch (e) {
        setCharacters([]);
        setError(
          e instanceof Error ? e.message : "Could not load clinicians."
        );
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [personaIds.join(",")]);

  return { characters, loading, error };
}
