import type { Character } from "../types";
import { ClinicianCard } from "./ClinicianCard";

export function CliniciansGrid({
  characters,
  conversationLoadingId,
  onStart,
}: {
  characters: Character[];
  conversationLoadingId: string | null;
  onStart: (c: Character) => void;
}) {
  if (characters.length === 0) {
    return (
      <div className="col-span-full rounded-2xl border border-dashed border-zinc-200 bg-zinc-50/50 py-16 text-center">
        <p className="mb-1 font-medium text-zinc-700">No clinicians available</p>
        <p className="text-sm text-zinc-500">
          Check your Tavus API key and persona configuration.
        </p>
      </div>
    );
  }

  return (
    <>
      {characters.map((character) => (
        <ClinicianCard
          key={character.id}
          character={character}
          busy={conversationLoadingId === character.id}
          onStart={onStart}
        />
      ))}
    </>
  );
}
