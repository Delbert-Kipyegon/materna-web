import { NextRequest, NextResponse } from 'next/server'
import connectDB from '../../../lib/mongodb'
import Affirmation from '../../../models/Affirmation'

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

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    // Check if affirmations already exist
    const existingCount = await Affirmation.countDocuments()
    
    if (existingCount > 0) {
      return NextResponse.json({
        success: false,
        message: `Database already has ${existingCount} affirmations. Clear the database first if you want to reseed.`,
        existingCount
      }, { status: 400 })
    }

    // Insert seed data
    const createdAffirmations = await Affirmation.insertMany(seedAffirmations)

    return NextResponse.json({
      success: true,
      message: `Successfully seeded ${createdAffirmations.length} affirmations`,
      data: {
        count: createdAffirmations.length,
        categories: {
          confidence: createdAffirmations.filter(a => a.category === 'confidence').length,
          strength: createdAffirmations.filter(a => a.category === 'strength').length,
          love: createdAffirmations.filter(a => a.category === 'love').length,
          peace: createdAffirmations.filter(a => a.category === 'peace').length,
        }
      }
    }, { status: 201 })

  } catch (error) {
    console.error('Error seeding affirmations:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to seed affirmations' },
      { status: 500 }
    )
  }
}

// GET method to check seed status
export async function GET() {
  try {
    await connectDB()
    
    const totalCount = await Affirmation.countDocuments()
    const categoryCounts = await Affirmation.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ])

    return NextResponse.json({
      success: true,
      data: {
        totalCount,
        categoryCounts: categoryCounts.reduce((acc, item) => {
          acc[item._id] = item.count
          return acc
        }, {}),
        seeded: totalCount > 0
      }
    })

  } catch (error) {
    console.error('Error checking seed status:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to check seed status' },
      { status: 500 }
    )
  }
} 