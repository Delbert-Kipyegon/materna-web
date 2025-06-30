import { SpeechSettings } from '@/app/types'

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY

// Initialize ElevenLabs API client lazily
let elevenLabsApi: any = null

// Voice IDs - you can customize these
const VOICES = {
  affirmations: 'EXAVITQu4vr4xnSDxMaL', // Bella - A soothing, female voice perfect for affirmations
  tips: 'pNInz6obpgDQGcFmaJgB' // Adam - A clear, informative male voice ideal for tips
}

async function getElevenLabsApi() {
  if (!ELEVENLABS_API_KEY) {
    throw new Error('ElevenLabs API key not found')
  }

  if (!elevenLabsApi) {
    try {
      const { ElevenLabsClient } = await import('@elevenlabs/elevenlabs-js')
      elevenLabsApi = new ElevenLabsClient({
        apiKey: ELEVENLABS_API_KEY
      })
    } catch (error) {
      console.error('Failed to initialize ElevenLabs API:', error)
      throw new Error('Failed to initialize ElevenLabs API')
    }
  }

  return elevenLabsApi
}

// Default speech settings for different content types
const speechSettings: Record<string, SpeechSettings> = {
  affirmations: {
    stability: 0.5,
    similarityBoost: 0.8,
    style: 0.2,
    useSpeakerBoost: true
  },
  tips: {
    stability: 0.7,
    similarityBoost: 0.7,
    style: 0.1,
    useSpeakerBoost: false
  }
}

export async function generateSpeech(
  text: string, 
  contentType: 'affirmations' | 'tips' = 'affirmations'
): Promise<ArrayBuffer> {
  try {
    const api = await getElevenLabsApi()
    const voiceId = VOICES[contentType]
    const settings = speechSettings[contentType]

    const audio = await api.textToSpeech.convert(voiceId, {
      text,
      modelId: "eleven_multilingual_v2",
      outputFormat: 'mp3_44100_128',
      voiceSettings: {
        stability: settings.stability,
        similarityBoost: settings.similarityBoost,
        style: settings.style,
        speakerBoost: settings.useSpeakerBoost
      }
    })

    // Convert the audio response to ArrayBuffer
    const chunks: Uint8Array[] = []
    const reader = audio.getReader()
    
    try {
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        if (value) {
          chunks.push(value)
        }
      }
    } finally {
      reader.releaseLock()
    }
    
    const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0)
    const result = new Uint8Array(totalLength)
    let offset = 0
    for (const chunk of chunks) {
      result.set(chunk, offset)
      offset += chunk.length
    }
    
    return result.buffer
  } catch (error) {
    console.error('ElevenLabs speech generation failed:', error)
    throw error
  }
}

export async function getAvailableVoices() {
  try {
    const api = await getElevenLabsApi()
    
    if (!api) {
      console.error('ElevenLabs API not available')
      return null
    }

    const voices = await api.voices.getAll()
    return voices.voices || voices
  } catch (error) {
    console.error('Error fetching voices:', error)
    return null
  }
}

export function isElevenLabsConfigured(): boolean {
  return !!ELEVENLABS_API_KEY
} 