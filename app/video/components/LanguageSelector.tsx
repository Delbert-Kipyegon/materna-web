import { CONVERSATION_LANGUAGES } from "../constants";

export function LanguageSelector({
  id,
  value,
  onChange,
}: {
  id: string;
  value: string;
  onChange: (lang: string) => void;
}) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-zinc-50/80 px-4 py-3">
      <label htmlFor={id} className="block text-xs font-medium text-zinc-600">
        Session language
      </label>
      <p className="mt-0.5 text-[11px] leading-relaxed text-zinc-500">
        Sent to Tavus as <span className="font-mono text-zinc-600">properties.language</span>
        . Closed captions follow Tavus CVI when enabled on the API. Voice providers (e.g.
        ElevenLabs) are configured in the Tavus persona, not in this app.
      </p>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none ring-violet-500/30 focus:border-violet-400 focus:ring-2"
      >
        {CONVERSATION_LANGUAGES.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
            {opt.hint ? ` — ${opt.hint}` : ""}
          </option>
        ))}
      </select>
    </div>
  );
}
