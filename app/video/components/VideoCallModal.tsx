import { MessageCircle, Video, X } from "lucide-react";
import { useLayoutEffect, useRef, useState } from "react";
import type { Character, IConversation } from "../types";

export function VideoCallModal({
  open,
  activeConversation,
  selectedCharacter,
  onClose,
}: {
  open: boolean;
  activeConversation: IConversation | null;
  selectedCharacter: Character | null;
  onClose: () => void | Promise<void>;
}) {
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const loadingOverlayRef = useRef<HTMLDivElement>(null);
  const tavusRef = useRef<{ destroy: () => void } | null>(null);
  const [embedError, setEmbedError] = useState<string | null>(null);

  const destroyTavusIframe = () => {
    if (tavusRef.current) {
      try {
        tavusRef.current.destroy();
      } catch (e) {
        console.warn("Tavus iframe cleanup:", e);
      }
      tavusRef.current = null;
    }
    if (videoContainerRef.current) {
      videoContainerRef.current.innerHTML = "";
    }
  };

  const mountTavusIframe = (
    conversation: IConversation,
    container: HTMLDivElement
  ) => {
    destroyTavusIframe();

    const overlay = loadingOverlayRef.current;
    if (overlay) {
      overlay.style.visibility = "visible";
    }

    const conversationUrl =
      conversation.conversation_url ||
      `https://tavus.daily.co/${conversation.conversation_id}`;

    const iframe = document.createElement("iframe");
    iframe.src = conversationUrl;
    iframe.style.width = "100%";
    iframe.style.height = "100%";
    iframe.style.minHeight = "520px";
    iframe.style.border = "none";
    iframe.style.borderRadius = "12px";
    iframe.allow =
      "camera; microphone; fullscreen; display-capture; autoplay";
    iframe.setAttribute("allowfullscreen", "true");
    iframe.title = "Tavus Video Conversation";

    iframe.onload = () => {
      if (loadingOverlayRef.current) {
        loadingOverlayRef.current.style.visibility = "hidden";
      }
    };
    iframe.onerror = () => {
      console.error("Tavus iframe failed to load");
    };

    container.appendChild(iframe);

    tavusRef.current = {
      destroy: () => {
        if (iframe.parentNode) {
          iframe.parentNode.removeChild(iframe);
        }
      },
    };
  };

  useLayoutEffect(() => {
    if (!open || !activeConversation) {
      setEmbedError(null);
      return;
    }

    const container = videoContainerRef.current;
    if (!container) {
      setEmbedError("Video area not ready. Close and try again.");
      return;
    }

    setEmbedError(null);
    mountTavusIframe(activeConversation, container);

    return () => {
      destroyTavusIframe();
    };
  }, [
    open,
    activeConversation?.conversation_id,
    activeConversation?.conversation_url,
  ]);

  if (!open || !activeConversation) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 p-4 backdrop-blur-sm">
      <div className="max-h-[92vh] w-full max-w-4xl overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl shadow-zinc-900/10">
        <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
              <Video className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <h2 className="truncate text-lg font-semibold tracking-tight text-zinc-900">
                {selectedCharacter?.name}
              </h2>
              {selectedCharacter && (
                <p className="truncate text-sm text-zinc-500">
                  {selectedCharacter.specialty}
                </p>
              )}
              <span className="mt-1 inline-block rounded-md border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-800">
                {activeConversation.status}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => void onClose()}
            className="rounded-xl p-2 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700"
            title="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="space-y-3 bg-zinc-50 p-4">
          {embedError && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
              <p className="font-medium">{embedError}</p>
              {activeConversation.conversation_url && (
                <a
                  href={activeConversation.conversation_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block font-medium text-amber-900 underline"
                >
                  Open call in a new tab
                </a>
              )}
            </div>
          )}
          <div className="relative w-full min-h-[min(70vh,520px)] overflow-hidden rounded-xl bg-zinc-950 ring-1 ring-zinc-800">
            <div
              ref={videoContainerRef}
              className="absolute inset-0 h-full min-h-[min(70vh,520px)] w-full"
            />
            {!embedError && (
              <div
                ref={loadingOverlayRef}
                className="pointer-events-none absolute inset-0 z-[1] flex flex-col items-center justify-center px-6 text-center text-zinc-400"
              >
                <MessageCircle className="mx-auto mb-3 h-10 w-10 opacity-80" />
                <p className="text-sm font-medium text-zinc-300">
                  Starting session…
                </p>
                <p className="mt-2 text-xs text-zinc-500">
                  Allow camera and microphone when prompted
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
