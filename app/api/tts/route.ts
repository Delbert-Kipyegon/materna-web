import { NextRequest, NextResponse } from 'next/server';
import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js';

const elevenlabs = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY,
});

// Type guard to check if error has a message property
function isErrorWithMessage(error: unknown): error is { message: string } {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as { message: unknown }).message === 'string'
  );
}

export async function POST(req: NextRequest) {
  console.log('=== TTS API Route Called ===');
  console.log('Timestamp:', new Date().toISOString());
  console.log('ElevenLabs API Key exists:', !!process.env.ELEVENLABS_API_KEY);

  try {
    const body = await req.json();
    console.log('TTS Request body:', {
      text: body.text ? `${body.text.substring(0, 50)}...` : 'MISSING',
      voiceId: body.voiceId || 'NOT PROVIDED',
      messageId: body.messageId || 'NOT PROVIDED'
    });

    const { text, voiceId, messageId, voiceSettings } = body;

    // Validate input
    if (!text || typeof text !== 'string') {
      console.error('Validation failed: Invalid or missing text');
      return NextResponse.json({ error: 'Invalid or missing text' }, { status: 400 });
    }

    if (!process.env.ELEVENLABS_API_KEY) {
      console.error('Configuration error: ElevenLabs API key is not set');
      return NextResponse.json({ error: 'ElevenLabs API key not configured' }, { status: 500 });
    }

    // Clean text for better TTS
    const cleanedText = cleanTextForTTS(text);
    
    // Limit text length to prevent extremely long requests
    if (cleanedText.length > 5000) {
      console.warn('Text too long, truncating to 5000 characters');
      const truncatedText = cleanedText.substring(0, 4950) + '...';
      return await generateSpeech(truncatedText, voiceId, messageId, voiceSettings);
    }

    return await generateSpeech(cleanedText, voiceId, messageId, voiceSettings);

  } catch (error) {
    console.error('=== ERROR IN TTS API ROUTE ===');
    console.error('Error occurred:', error);

    // Handle JSON parsing errors
    if (error instanceof SyntaxError) {
      console.error('JSON parsing error - invalid request body');
      return NextResponse.json({
        error: 'Invalid JSON in request body'
      }, { status: 400 });
    }

    // Handle ElevenLabs API errors using type guard
    if (isErrorWithMessage(error)) {
      console.error('ElevenLabs API Error:', error.message);
      
      // Handle specific ElevenLabs errors
      if (error.message.includes('quota')) {
        return NextResponse.json({
          error: 'Voice generation quota exceeded. Please try again later.'
        }, { status: 429 });
      }
      
      if (error.message.includes('voice_id')) {
        return NextResponse.json({
          error: 'Invalid voice ID provided'
        }, { status: 400 });
      }
      
      if (error.message.includes('rate_limit') || error.message.includes('too many requests')) {
        return NextResponse.json({
          error: 'Rate limit exceeded. Please wait a moment before trying again.'
        }, { status: 429 });
      }
      
      return NextResponse.json({
        error: `ElevenLabs API Error: ${error.message}`
      }, { status: 500 });
    }

    // Generic error handler
    return NextResponse.json({
      error: 'Failed to generate speech',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

// Separate function to handle speech generation
async function generateSpeech(
  text: string, 
  voiceId: string | undefined, 
  messageId: string | undefined, 
  voiceSettings: any
) {
  console.log('Making ElevenLabs TTS API call...');
  console.log('Voice ID:', voiceId || 'JBFqnCBsd6RMkjVDRZzb');
  console.log('Text length:', text.length);

  const audio = await elevenlabs.textToSpeech.convert(
    voiceId || 'JBFqnCBsd6RMkjVDRZzb', // Default voice ID
    {
      text: text,
      modelId: 'eleven_multilingual_v2',
      outputFormat: 'mp3_44100_128',
      voiceSettings: voiceSettings || {
        stability: 0.5,
        similarityBoost: 0.75,
        style: 0.0,
        speakerBoost: true
      }
    }
  );

  console.log('ElevenLabs TTS API call successful');

  // Convert audio stream to buffer with better error handling
  const chunks: Uint8Array[] = [];
  const reader = audio.getReader();
  
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (value) { // Check if value exists
        chunks.push(value);
      }
    }
  } catch (streamError) {
    console.error('Error reading audio stream:', streamError);
    throw new Error('Failed to read audio stream from ElevenLabs');
  } finally {
    reader.releaseLock();
  }

  if (chunks.length === 0) {
    throw new Error('No audio data received from ElevenLabs');
  }

  // Combine all chunks into a single buffer
  const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
  const audioBuffer = new Uint8Array(totalLength);
  let offset = 0;
  
  for (const chunk of chunks) {
    audioBuffer.set(chunk, offset);
    offset += chunk.length;
  }

  console.log('Audio buffer created, size:', audioBuffer.length);

  // Return audio as base64
  const base64Audio = Buffer.from(audioBuffer).toString('base64');
  
  return NextResponse.json({ 
    audioData: base64Audio,
    contentType: 'audio/mpeg',
    messageId: messageId,
    textLength: text.length,
    audioSize: audioBuffer.length
  });
}

// GET handler for testing and getting available voices
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const action = searchParams.get('action');

  if (action === 'voices') {
    try {
      if (!process.env.ELEVENLABS_API_KEY) {
        return NextResponse.json({ error: 'ElevenLabs API key not configured' }, { status: 500 });
      }

      console.log('Fetching voices from ElevenLabs...');
      const voices = await elevenlabs.voices.getAll();
      console.log(`Found ${voices.voices.length} voices`);
      
      return NextResponse.json({
        voices: voices.voices.map(voice => ({
          voice_id: voice.voice_id,
          name: voice.name,
          category: voice.category,
          description: voice.description,
          preview_url: voice.preview_url
        }))
      });
    } catch (error) {
      console.error('Error fetching voices:', error);
      return NextResponse.json({
        error: 'Failed to fetch voices',
        details: error instanceof Error ? error.message : String(error)
      }, { status: 500 });
    }
  }

  // Health check endpoint
  return NextResponse.json({
    status: 'healthy',
    message: 'TTS API endpoint is working',
    timestamp: new Date().toISOString(),
    hasApiKey: !!process.env.ELEVENLABS_API_KEY,
    endpoints: {
      tts: 'POST /',
      voices: 'GET /?action=voices',
      health: 'GET /'
    }
  });
}

// Helper function to clean text for better TTS
function cleanTextForTTS(text: string): string {
  return text
    // Remove markdown formatting
    .replace(/\*\*(.*?)\*\*/g, '$1') 
    .replace(/\*(.*?)\*/g, '$1') 
    .replace(/`(.*?)`/g, '$1') 
    .replace(/```[\s\S]*?```/g, '[Code block]') 
    .replace(/#{1,6}\s/g, '') 
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
    
    // Clean up excessive punctuation and formatting
    .replace(/\n{3,}/g, '\n\n') 
    .replace(/\.{3,}/g, '...') 
    .replace(/!{2,}/g, '!') 
    .replace(/\?{2,}/g, '?') 
    

    .replace(/&/g, 'and')
    .replace(/@/g, 'at')
    .replace(/#/g, 'number')
    .replace(/\$/g, 'dollar')
    .replace(/%/g, 'percent')
    

    .replace(/[^\w\s.,!?;:'"()\-]/g, '') 
    

    .replace(/\s+/g, ' ')
    .trim();
}