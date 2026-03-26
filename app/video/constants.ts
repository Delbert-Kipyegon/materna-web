/** Personas shown on the video visit page (Tavus dashboard). */
export const PERSONA_IDS = [
  "pdeff538e07a",
  "p6e066bd54ce",
  "pb7b753e8162",
  "p601b954420d",
  "p5d11710002a",
] as const;

/**
 * Values are Tavus `properties.language` strings (lowercase names per API examples).
 * Swahili/Estonian may require persona STT / Tavus account settings — see Tavus language docs.
 */
export const CONVERSATION_LANGUAGES: { value: string; label: string; hint?: string }[] = [
  { value: "multilingual", label: "Multilingual", hint: "Auto-detect (recommended)" },
  { value: "english", label: "English" },
  { value: "french", label: "French" },
  { value: "spanish", label: "Spanish" },
  { value: "swahili", label: "Swahili", hint: "Confirm STT in Tavus persona" },
  { value: "estonian", label: "Estonian", hint: "Confirm STT in Tavus persona" },
];
