import { User, Video } from "lucide-react";
import type { Character } from "../types";
import { SpecialtyIcon } from "./SpecialtyIcon";

export function ClinicianCard({
  character,
  busy,
  onStart,
}: {
  character: Character;
  busy: boolean;
  onStart: (c: Character) => void;
}) {
  return (
    <div className="group rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm shadow-zinc-900/[0.04] transition-all duration-300 hover:border-violet-200/80 hover:shadow-md">
      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 shadow-inner ring-4 ring-white">
          {character.avatar ? (
            <img
              src={character.avatar}
              alt={character.name}
              className="h-full w-full rounded-2xl object-cover"
            />
          ) : (
            <User className="h-7 w-7 text-white" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center justify-between gap-2">
            <h3 className="truncate text-base font-semibold text-zinc-900">
              {character.name}
            </h3>
            <SpecialtyIcon specialty={character.specialty} />
          </div>
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-violet-600">
            {character.specialty}
          </p>
          <p className="line-clamp-2 text-sm leading-relaxed text-zinc-600">
            {character.description}
          </p>
          {character.id.startsWith("demo-") && (
            <span className="mt-2 inline-block rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-900">
              Demo
            </span>
          )}
        </div>
      </div>
      <div className="mt-5 border-t border-zinc-100 pt-5">
        <button
          type="button"
          onClick={() => onStart(character)}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-900 py-3 px-4 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={busy}
        >
          {busy ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Connecting…
            </>
          ) : (
            <>
              <Video className="h-4 w-4" />
              Start video
            </>
          )}
        </button>
      </div>
    </div>
  );
}
