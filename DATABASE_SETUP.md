# Database Setup for Materna AI

This guide explains how to set up MongoDB for the affirmations feature.

## Environment Variables

Create a `.env.local` file in the root directory and add your MongoDB connection string and ElevenLabs API key:

```bash
# MongoDB Database Connection
# For local MongoDB
DATABASE_URL="mongodb://localhost:27017/materna"

# For MongoDB Atlas (cloud)
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/materna?retryWrites=true&w=majority"

# ElevenLabs Text-to-Speech API
# Get your API key from: https://elevenlabs.io/app/settings/api-keys
ELEVENLABS_API_KEY="your_elevenlabs_api_key_here"
```

## MongoDB Options

### Option 1: Local MongoDB

1. Install MongoDB locally: https://www.mongodb.com/docs/manual/installation/
2. Start MongoDB service
3. Use connection string: `mongodb://localhost:27017/materna`

### Option 2: MongoDB Atlas (Cloud)

1. Create a free account at https://www.mongodb.com/atlas
2. Create a new cluster
3. Get your connection string
4. Add your IP address to the whitelist
5. Create a database user

## ElevenLabs Text-to-Speech Setup

### Getting Started with ElevenLabs

1. **Create Account**: Sign up at https://elevenlabs.io
2. **Get API Key**: 
   - Go to Settings → API Keys
   - Create a new API key
   - Copy the key to your `.env.local` file

### Voice Configuration

The application uses predefined voice settings:

- **Affirmations**: Bella (calm, soothing female voice)
  - Voice ID: `EXAVITQu4vr4xnSDxMaL`
  - Optimized for emotional support content

- **Tips**: Adam (clear, informative male voice)  
  - Voice ID: `pNInz6obpgDQGcFmaJgB`
  - Optimized for educational content

### API Limits & Costs

- **Free Tier**: 10,000 characters per month
- **Text Limit**: 2,000 characters per request (app-enforced)
- **Output Format**: MP3, 44.1kHz, 128kbps

## Seeding the Database

After setting up your DATABASE_URL, you can seed the database with initial affirmations:

### Method 1: Using npm script (Direct)
```bash
npm run seed
```

### Method 2: Using API endpoint (Server must be running)
```bash
# Start the development server first
npm run dev

# Then in another terminal
npm run seed:api
```

### Method 3: Using API in browser
1. Start the development server: `npm run dev`
2. Navigate to: `http://localhost:3000/api/affirmations/seed`
3. Use POST method (you can use Postman or similar tools)

## Verify Setup

### Database Verification
Check if the database is properly seeded by visiting:
- GET: `http://localhost:3000/api/affirmations/seed` (Check status)
- GET: `http://localhost:3000/api/affirmations` (Get all affirmations)
- GET: `http://localhost:3000/api/affirmations?random=true` (Get random affirmation)

### TTS Verification
Check if Text-to-Speech is properly configured:
- GET: `http://localhost:3000/api/tts` (Check TTS configuration status)
- Visit `/affirmations` page and click "Listen" button
- Visit `/tips` page and click "Play Voice" button

### TTS API Testing
Test TTS functionality directly:
```bash
curl -X POST http://localhost:3000/api/tts \
  -H "Content-Type: application/json" \
  -d '{"text": "Hello, this is a test", "voice_type": "affirmations"}'
```

## Database Schema

### Collection: `affirmations`

The `affirmations` collection stores all affirmation data with the following structure:

```typescript
{
  _id: ObjectId,          // MongoDB auto-generated ID
  text: string,           // The affirmation text (max 500 chars)
  category: string,       // 'confidence' | 'strength' | 'love' | 'peace'
  isActive: boolean,      // Whether the affirmation is active (default: true)
  createdAt: Date,        // Auto-generated timestamp
  updatedAt: Date         // Auto-generated timestamp
}
```

### Database Structure
- **Database Name**: `materna`
- **Collection Name**: `affirmations`
- **Indexes**: 
  - `{ category: 1, isActive: 1 }` - For filtering by category and active status
  - `{ createdAt: -1 }` - For sorting by creation date

## Troubleshooting

### Database Issues
1. **Connection Issues**: Make sure your DATABASE_URL is correct and MongoDB is running
2. **Authentication Issues**: For Atlas, verify your username/password and IP whitelist
3. **Seeding Issues**: Check if affirmations already exist in the database
4. **API Issues**: Ensure the development server is running on port 3000

### TTS Issues
1. **TTS Not Working**: 
   - Verify ELEVENLABS_API_KEY is set in `.env.local`
   - Check API key validity at ElevenLabs dashboard
   - Ensure you have remaining character quota

2. **Voice Playback Issues**:
   - Check browser audio permissions
   - Try a different browser or incognito mode
   - Verify internet connection for API calls

3. **API Errors**:
   - Check browser dev tools console for error messages
   - Verify API endpoint: `GET /api/tts` returns `configured: true`
   - Check ElevenLabs API status at https://status.elevenlabs.io

4. **Performance Issues**:
   - Long text (>500 chars) may take 3-10 seconds to generate
   - Consider breaking long content into smaller chunks
   - Check network speed and ElevenLabs server response times

## Sample Data

The seed script includes 25 affirmations across 4 categories:
- **Confidence**: 6 affirmations
- **Strength**: 5 affirmations  
- **Love**: 5 affirmations
- **Peace**: 5 affirmations
- **Mixed**: 4 additional affirmations

Each affirmation is designed to provide emotional support and encouragement for expectant mothers. 