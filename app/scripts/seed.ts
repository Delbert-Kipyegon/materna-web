// Run this script to seed the database with affirmations
// Usage: npx tsx app/scripts/seed.ts

import mongoose from 'mongoose'

const MONGODB_URI = process.env.DATABASE_URL || 'mongodb://localhost:27017/materna'

const seedAffirmations = [
  // Confidence affirmations
  {
    text: "You are enough, mama. Your body is doing miraculous work.",
    category: "confidence"
  },
  {
    text: "Trust your instincts - you already know how to be a wonderful mother.",
    category: "confidence"
  },
  {
    text: "You are exactly where you need to be in this moment of your journey.",
    category: "confidence"
  },
  {
    text: "Your body knows how to grow and birth your baby perfectly.",
    category: "confidence"
  },
  {
    text: "You are brave, capable, and ready for this beautiful challenge.",
    category: "confidence"
  },

  // Strength affirmations
  {
    text: "Each day, you grow stronger and more prepared for motherhood.",
    category: "strength"
  },
  {
    text: "You have the inner strength to handle whatever comes your way.",
    category: "strength"
  },
  {
    text: "Your resilience is powerful and will carry you through this journey.",
    category: "strength"
  },
  {
    text: "You are creating life with grace and determination.",
    category: "strength"
  },
  {
    text: "Every challenge makes you stronger and more prepared.",
    category: "strength"
  },

  // Love affirmations
  {
    text: "Your love for your baby is already infinite and beautiful.",
    category: "love"
  },
  {
    text: "You and your baby are connected by an unbreakable bond of love.",
    category: "love"
  },
  {
    text: "Your heart is expanding with more love than you ever imagined possible.",
    category: "love"
  },
  {
    text: "You are surrounded by love and support on this journey.",
    category: "love"
  },
  {
    text: "Your baby is already so loved and wanted.",
    category: "love"
  },

  // Peace affirmations
  {
    text: "Take a deep breath. You and your baby are safe and loved.",
    category: "peace"
  },
  {
    text: "Peace flows through you and surrounds your growing baby.",
    category: "peace"
  },
  {
    text: "You release all worries and embrace the present moment.",
    category: "peace"
  },
  {
    text: "Calm and serenity fill your mind, body, and spirit.",
    category: "peace"
  },
  {
    text: "You trust in the natural process of pregnancy and birth.",
    category: "peace"
  },

  // Additional mixed affirmations
  {
    text: "Your body is wise and knows exactly what to do.",
    category: "confidence"
  },
  {
    text: "You are creating a miracle with every breath you take.",
    category: "strength"
  },
  {
    text: "Your baby feels your love and excitement already.",
    category: "love"
  },
  {
    text: "Rest when you need to. Your body is working hard for you.",
    category: "peace"
  },
  {
    text: "You are becoming the mother your baby needs.",
    category: "confidence"
  }
]

const AffirmationSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, 'Affirmation text is required'],
    trim: true,
    maxlength: [500, 'Affirmation text cannot exceed 500 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['confidence', 'strength', 'love', 'peace'],
    default: 'confidence'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  collection: 'affirmations'
})

const Affirmation = mongoose.models.Affirmation || mongoose.model('Affirmation', AffirmationSchema)

async function seedDatabase() {
  try {
    console.log('Connecting to MongoDB...')
    await mongoose.connect(MONGODB_URI)
    console.log('Connected to MongoDB successfully!')

    // Check if affirmations already exist
    const existingCount = await Affirmation.countDocuments()
    
    if (existingCount > 0) {
      console.log(`Database already has ${existingCount} affirmations.`)
      console.log('Do you want to clear and reseed? (This will delete existing data)')
      process.exit(0)
    }

    console.log('Seeding affirmations...')
    const createdAffirmations = await Affirmation.insertMany(seedAffirmations)

    console.log(`✅ Successfully seeded ${createdAffirmations.length} affirmations`)
    
    // Show category breakdown
    const categories = createdAffirmations.reduce((acc, affirmation) => {
      acc[affirmation.category] = (acc[affirmation.category] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    console.log('Category breakdown:')
    Object.entries(categories).forEach(([category, count]) => {
      console.log(`  ${category}: ${count} affirmations`)
    })

  } catch (error) {
    console.error('Error seeding database:', error)
  } finally {
    await mongoose.disconnect()
    console.log('Disconnected from MongoDB')
  }
}

if (require.main === module) {
  seedDatabase()
}

export { seedDatabase } 