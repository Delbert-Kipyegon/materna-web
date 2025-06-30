import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  console.log('=== API Route Called ===');
  console.log('Timestamp:', new Date().toISOString());
  console.log('API Key exists:', !!process.env.OPENAI_API_KEY);
  console.log('API Key prefix:', process.env.OPENAI_API_KEY?.substring(0, 12) + '...');

  try {
    // Parse and log request body
    const body = await req.json();
    console.log('Request body received:', {
      prompt: body.prompt ? `${body.prompt.substring(0, 50)}...` : 'MISSING',
      model: body.model || 'NOT PROVIDED',
      characterName: body.characterName || 'MISSING'
    });

    const { prompt, model, characterName } = body;

    // Validate input
    if (!prompt || typeof prompt !== 'string') {
      console.error('Validation failed: Invalid or missing prompt');
      return NextResponse.json({ error: 'Invalid or missing prompt' }, { status: 400 });
    }
    
    if (!characterName || typeof characterName !== 'string') {
      console.error('Validation failed: Invalid or missing characterName');
      return NextResponse.json({ error: 'Invalid or missing characterName' }, { status: 400 });
    }

    if (!process.env.OPENAI_API_KEY) {
      console.error('Configuration error: OpenAI API key is not set');
      return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 500 });
    }

    console.log('Making OpenAI API call...');
    console.log('Model:', model || 'gpt-4');
    console.log('Character:', characterName);

    const response = await openai.chat.completions.create({
      model: model || 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are ${characterName}, a compassionate and knowledgeable maternal healthcare assistant. Your role is to provide accurate, empathetic, and professional guidance to users seeking advice on maternal health, pregnancy, and childcare.`,
        },
        { role: 'user', content: prompt },
      ],
      max_tokens: 1000, // Add reasonable limit
      temperature: 0.7, // Add temperature for consistency
    });

    console.log('OpenAI API call successful');
    console.log('Response choices length:', response.choices?.length || 0);

    if (!response.choices || response.choices.length === 0) {
      console.error('No choices returned from OpenAI');
      throw new Error('No choices returned from OpenAI');
    }

    const reply = response.choices[0].message?.content || 'Sorry, I could not generate a response.';
    console.log('Reply generated, length:', reply.length);
    console.log('Reply preview:', reply.substring(0, 100) + '...');

    return NextResponse.json({ reply });

  } catch (error) {
    console.error('=== ERROR IN API ROUTE ===');
    console.error('Error occurred:', error);

    // Handle JSON parsing errors
    if (error instanceof SyntaxError) {
      console.error('JSON parsing error - invalid request body');
      return NextResponse.json({
        error: 'Invalid JSON in request body'
      }, { status: 400 });
    }

    // Handle OpenAI API errors
    if (error && typeof error === 'object' && 'error' in error) {
      const openAIError = error as any;
      console.error('OpenAI API Error Details:', {
        status: openAIError.status,
        type: openAIError.error?.type,
        code: openAIError.error?.code,
        message: openAIError.error?.message
      });

      // Handle specific OpenAI error types
      if (openAIError.error?.type === 'insufficient_quota') {
        return NextResponse.json({
          error: 'OpenAI API quota exceeded. Please check your billing.'
        }, { status: 429 });
      }

      if (openAIError.error?.type === 'invalid_request_error') {
        return NextResponse.json({
          error: `Invalid request: ${openAIError.error.message}`
        }, { status: 400 });
      }

      return NextResponse.json({
        error: `OpenAI API Error: ${openAIError.error?.message || 'Unknown API error'}`
      }, { status: openAIError.status || 500 });
    }

    // Handle network/connection errors
    if (error instanceof Error) {
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack?.split('\n').slice(0, 5).join('\n')
      });

      if (error.message.includes('fetch')) {
        return NextResponse.json({
          error: 'Network error connecting to OpenAI. Please try again.'
        }, { status: 503 });
      }
    }

    // Generic error handler
    return NextResponse.json({
      error: 'Failed to fetch response from OpenAI',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

// Add a GET handler for testing
export async function GET() {
  return NextResponse.json({
    message: 'LLM API endpoint is working',
    timestamp: new Date().toISOString(),
    hasApiKey: !!process.env.OPENAI_API_KEY
  });
}