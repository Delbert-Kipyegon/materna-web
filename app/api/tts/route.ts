import { NextRequest, NextResponse } from 'next/server'
import { generateSpeech, isElevenLabsConfigured } from '@/app/lib/elevenlabs'

const MAX_TEXT_LENGTH = 2000

export async function GET() {
  return NextResponse.json({ 
    available: isElevenLabsConfigured(),
    message: isElevenLabsConfigured() 
      ? 'ElevenLabs TTS service is available' 
      : 'ElevenLabs TTS service is not configured. Add ELEVENLABS_API_KEY to environment variables.'
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { text, contentType = 'affirmations' } = body

    // Validate input
    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Text is required and must be a string' },
        { status: 400 }
      )
    }

    if (text.length > MAX_TEXT_LENGTH) {
      return NextResponse.json(
        { error: `Text must be ${MAX_TEXT_LENGTH} characters or less` },
        { status: 400 }
      )
    }

    if (!isElevenLabsConfigured()) {
      return NextResponse.json(
        { error: 'ElevenLabs API not configured' },
        { status: 503 }
      )
    }

    // Generate speech using ElevenLabs
    const audioBuffer = await generateSpeech(text, contentType)

    // Return audio data
    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioBuffer.byteLength.toString(),
      },
    })

  } catch (error) {
    console.error('TTS generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate speech' },
      { status: 500 }
    )
  }
} 