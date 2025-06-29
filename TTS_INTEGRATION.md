# ElevenLabs Text-to-Speech Integration

This document provides comprehensive details about the ElevenLabs TTS integration in Materna AI.

## Architecture Overview

```
┌─────────────────┐    ┌──────────────┐    ┌─────────────────┐
│  React Components │    │   TTS Hook   │    │   TTS API Route │
│  (Affirmations,   │────│   useTTS()   │────│   /api/tts      │
│   Tips Pages)     │    │              │    │                 │
└─────────────────┘    └──────────────┘    └─────────────────┘
                                                      │
                                                      ▼
                                            ┌─────────────────┐
                                            │  ElevenLabs API │
                                            │   Service       │
                                            └─────────────────┘
```

## File Structure

```
app/
├── lib/
│   └── elevenlabs.ts          # ElevenLabs service utilities
├── hooks/
│   └── useTTS.ts              # React hook for TTS functionality
├── api/
│   └── tts/
│       └── route.ts           # API endpoints for TTS
└── components/
    ├── AffirmationsPage.tsx   # Affirmations with TTS
    └── TipsPage.tsx           # Tips with TTS
```

## Core Components

### 1. ElevenLabs Service (`app/lib/elevenlabs.ts`)

**Purpose**: Handles direct communication with ElevenLabs API

**Key Features**:
- API client initialization
- Voice configuration presets
- Speech generation
- Error handling

**Voice Presets**:
```typescript
VOICE_SETTINGS = {
  affirmations: {
    voice_id: 'EXAVITQu4vr4xnSDxMaL', // Bella - calming
    stability: 0.75,
    similarity_boost: 0.75,
    style: 0.5,
    use_speaker_boost: true
  },
  tips: {
    voice_id: 'pNInz6obpgDQGcFmaJgB', // Adam - informative
    stability: 0.8,
    similarity_boost: 0.7,
    style: 0.3,
    use_speaker_boost: true
  }
}
```

### 2. TTS Hook (`app/hooks/useTTS.ts`)

**Purpose**: React hook providing TTS functionality to components

**State Management**:
- `isPlaying`: Boolean indicating if audio is currently playing
- `isLoading`: Boolean for TTS generation/loading state
- `error`: Error message string or null
- `isConfigured`: Boolean indicating if ElevenLabs is properly configured

**Methods**:
- `speak(text, options)`: Generate and play speech
- `stop()`: Stop current playback
- `pause()`: Pause current playback
- `resume()`: Resume paused playback
- `checkConfiguration()`: Verify TTS setup

### 3. API Routes (`app/api/tts/route.ts`)

**POST /api/tts**
- Generates speech from text using ElevenLabs
- Returns base64-encoded MP3 audio
- Validates text length (max 2000 chars)
- Handles voice configuration

**GET /api/tts**
- Returns TTS configuration status
- Provides supported voice types
- Shows API limits and format info

## Usage Examples

### Basic TTS in Component

```typescript
import { useTTS } from '../hooks/useTTS'

function MyComponent() {
  const { speak, isPlaying, isLoading, error } = useTTS()

  const handleSpeak = async () => {
    await speak("Hello, this is a test message", { 
      voice_type: 'affirmations' 
    })
  }

  return (
    <button 
      onClick={handleSpeak} 
      disabled={isLoading}
    >
      {isLoading ? 'Loading...' : isPlaying ? 'Pause' : 'Speak'}
    </button>
  )
}
```

### Custom Voice Settings

```typescript
await speak("Custom message", {
  voice_id: "custom_voice_id",
  stability: 0.8,
  similarity_boost: 0.7,
  style: 0.4,
  use_speaker_boost: false
})
```

## API Reference

### POST /api/tts

**Request Body**:
```typescript
{
  text: string,                    // Required: Text to convert to speech
  voice_type?: 'affirmations' | 'tips',  // Optional: Preset voice type
  voice_id?: string,               // Optional: Custom voice ID
  stability?: number,              // Optional: 0.0-1.0
  similarity_boost?: number,       // Optional: 0.0-1.0
  style?: number,                  // Optional: 0.0-1.0
  use_speaker_boost?: boolean      // Optional: Enable speaker boost
}
```

**Response (Success)**:
```typescript
{
  success: true,
  data: {
    audio: string,                 // Base64-encoded MP3
    format: "mp3",
    text: string,                  // Processed text
    voice_type: string             // Voice type used
  }
}
```

**Response (Error)**:
```typescript
{
  success: false,
  error: string                    // Error description
}
```

### GET /api/tts

**Response**:
```typescript
{
  success: true,
  data: {
    configured: boolean,           // Is ElevenLabs configured?
    supported_voice_types: string[],  // Available voice presets
    max_text_length: number,       // Character limit
    output_format: string          // Audio format
  }
}
```

## Error Handling

### Common Error Scenarios

1. **API Key Missing/Invalid**
   - Error: "ElevenLabs API is not configured"
   - Solution: Add valid ELEVENLABS_API_KEY to .env.local

2. **Text Too Long**
   - Error: "Text is too long. Maximum 2000 characters allowed"
   - Solution: Break text into smaller chunks

3. **API Rate Limit**
   - Error: API returns 429 status
   - Solution: Implement retry logic or reduce usage

4. **Network Issues**
   - Error: "Failed to generate speech"
   - Solution: Check internet connection and ElevenLabs status

### Error Handling Best Practices

```typescript
const { speak, error } = useTTS()

const handleSpeak = async () => {
  try {
    await speak(text)
  } catch (err) {
    // Error automatically handled by hook
    console.error('TTS failed:', error)
  }
}

// Display errors to user
{error && (
  <div className="error-message">
    {error}
  </div>
)}
```

## Performance Considerations

### Optimization Strategies

1. **Text Length**: Keep text under 500 characters for faster generation
2. **Caching**: Consider caching frequently used audio clips
3. **Preloading**: Pre-generate common phrases during app initialization
4. **Chunking**: Break long content into smaller, manageable pieces

### Memory Management

- Audio objects are automatically cleaned up after playback
- URL.revokeObjectURL() called to prevent memory leaks
- Only one audio instance active at a time

## Security Considerations

1. **API Key Protection**: Never expose ELEVENLABS_API_KEY in client-side code
2. **Text Validation**: Server-side validation prevents malicious input
3. **Rate Limiting**: Consider implementing app-level rate limiting
4. **Content Filtering**: Validate text content before TTS generation

## Testing

### Manual Testing

1. **Configuration Test**:
   ```bash
   curl http://localhost:3000/api/tts
   ```

2. **Speech Generation Test**:
   ```bash
   curl -X POST http://localhost:3000/api/tts \
     -H "Content-Type: application/json" \
     -d '{"text": "Hello world", "voice_type": "affirmations"}'
   ```

3. **UI Testing**:
   - Visit `/affirmations` and test "Listen" button
   - Visit `/tips` and test "Play Voice" button
   - Test pause/resume functionality
   - Test error states (invalid API key, network issues)

### Automated Testing Considerations

- Mock ElevenLabs API responses for unit tests
- Test error handling scenarios
- Verify audio object cleanup
- Test component state management

## Monitoring & Analytics

### Recommended Metrics

1. **Usage Metrics**:
   - TTS requests per day/user
   - Character usage vs. quota
   - Success/failure rates

2. **Performance Metrics**:
   - Average response time for TTS generation
   - Audio loading/playback times
   - Error rates by type

3. **User Experience**:
   - Play completion rates
   - User interaction patterns (pause/resume usage)
   - Preferred voice types

### Implementation Example

```typescript
// Add to useTTS hook
const speak = useCallback(async (text: string, options: TTSOptions = {}) => {
  // Analytics tracking
  analytics.track('tts_request', {
    textLength: text.length,
    voiceType: options.voice_type,
    timestamp: Date.now()
  })

  try {
    // ... existing speak logic
    
    analytics.track('tts_success', {
      textLength: text.length,
      voiceType: options.voice_type
    })
  } catch (error) {
    analytics.track('tts_error', {
      error: error.message,
      textLength: text.length
    })
  }
}, [])
```

## Future Enhancements

### Planned Features

1. **Voice Selection**: Allow users to choose from available voices
2. **Playback Speed**: Add speed control (0.5x - 2x)
3. **Audio Caching**: Cache generated audio for repeated content
4. **Offline Support**: Store pre-generated audio for key content
5. **Voice Customization**: User-specific voice preferences
6. **Advanced Controls**: Volume, pitch, emphasis settings

### Technical Improvements

1. **Streaming Audio**: Support for real-time streaming TTS
2. **Background Processing**: Queue TTS requests for better UX
3. **Progressive Enhancement**: Graceful fallback when TTS unavailable
4. **Multi-language Support**: Support for different languages/accents
5. **Audio Visualization**: Waveform or progress indicators
6. **Keyboard Shortcuts**: Accessibility improvements with hotkeys

## Conclusion

The ElevenLabs TTS integration provides a robust, user-friendly voice experience for Materna AI users. The modular architecture allows for easy maintenance and future enhancements while ensuring optimal performance and user experience. 