"use client";

import { useState } from "react";
import Layout from "../components/Layout";
import { apiFetch } from "../lib/api";
import { CliniciansGrid } from "./components/CliniciansGrid";
import { LanguageSelector } from "./components/LanguageSelector";
import { VideoCallModal } from "./components/VideoCallModal";
import { VideoErrorBanner } from "./components/VideoErrorBanner";
import { VideoLoading } from "./components/VideoLoading";
import { PERSONA_IDS } from "./constants";
import { useClinicians } from "./hooks/useClinicians";
import type { Character, IConversation } from "./types";

async function createConversationRequest(
  personaId: string,
  replicaId: string | undefined,
  language: string
): Promise<IConversation> {
  const payload: Record<string, string> = {
    persona_id: personaId,
    language,
  };
  if (replicaId?.trim()) {
    payload.replica_id = replicaId.trim();
  }
  const response = await apiFetch("/api/tavus/conversations", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const responseText = await response.text();
  if (!response.ok) {
    let errorData: { message?: string; error?: string };
    try {
      errorData = JSON.parse(responseText);
    } catch {
      errorData = { message: responseText };
    }
    if (response.status === 401) {
      throw new Error(
        "Sign in required to start a video visit. Use Sign in in the header."
      );
    }
    throw new Error(
      `HTTP error! status: ${response.status} - ${errorData.error || errorData.message || responseText}`
    );
  }
  return JSON.parse(responseText) as IConversation;
}

async function endConversationRequest(conversationId: string) {
  const response = await apiFetch(
    `/api/tavus/conversations/${encodeURIComponent(conversationId)}/end`,
    {
      method: "POST",
    }
  );
  if (!response.ok) {
    await response.text();
    throw new Error("Failed to end conversation");
  }
}

const VideoPage = () => {
  const { characters, loading, error } = useClinicians(PERSONA_IDS);
  const [conversationLanguage, setConversationLanguage] =
    useState("multilingual");
  const [conversationLoading, setConversationLoading] = useState<string | null>(
    null
  );
  const [activeConversation, setActiveConversation] =
    useState<IConversation | null>(null);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(
    null
  );

  const handleCharacterClick = async (character: Character) => {
    try {
      setConversationLoading(character.id);
      setSelectedCharacter(character);

      if (!character.id) {
        throw new Error("Character ID is missing");
      }

      if (character.id.startsWith("demo-")) {
        alert(
          `Demo character: ${character.name}\nDemo mode - Tavus CVI integration would work with real persona IDs.`
        );
        return;
      }

      const conversation = await createConversationRequest(
        character.id,
        character.replica_id,
        conversationLanguage
      );
      setActiveConversation(conversation);
      setShowVideoModal(true);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error occurred";
      alert(
        `Failed to start video conversation: ${errorMessage}\n\nCheck materna-api is running, TAVUS_API_KEY is set on the server, and the persona exists in Tavus.`
      );
    } finally {
      setConversationLoading(null);
    }
  };

  const closeVideoModal = async () => {
    const conversationId = activeConversation?.conversation_id;

    if (conversationId) {
      try {
        await endConversationRequest(conversationId);
      } catch (e) {
        console.warn("Error ending conversation (may already be ended):", e);
      }
    }

    setShowVideoModal(false);
    setActiveConversation(null);
    setSelectedCharacter(null);
  };

  return (
    <Layout>
      <div className="mx-auto max-w-5xl py-10 lg:py-14">
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm shadow-zinc-900/5 lg:p-10">
          <p className="mb-3 text-center text-xs font-semibold uppercase tracking-[0.2em] text-violet-600/90">
            Video visit
          </p>
          <h1 className="mb-3 text-center text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl lg:text-5xl">
            Talk with your care team
          </h1>
          <p className="mx-auto mb-8 max-w-lg text-center text-base leading-relaxed text-zinc-600 lg:text-lg">
            Secure Tavus CVI sessions. Choose a language, then start a visit.
          </p>

          {loading ? (
            <VideoLoading />
          ) : (
            <>
              {error && (
                <VideoErrorBanner
                  message={error}
                  onRetry={() => window.location.reload()}
                />
              )}

              <div className="mb-8">
                <LanguageSelector
                  id="cvi-session-language"
                  value={conversationLanguage}
                  onChange={setConversationLanguage}
                />
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                <CliniciansGrid
                  characters={characters}
                  conversationLoadingId={conversationLoading}
                  onStart={handleCharacterClick}
                />
              </div>
            </>
          )}
        </div>
      </div>

      <VideoCallModal
        open={showVideoModal}
        activeConversation={activeConversation}
        selectedCharacter={selectedCharacter}
        onClose={closeVideoModal}
      />
    </Layout>
  );
};

export default VideoPage;
