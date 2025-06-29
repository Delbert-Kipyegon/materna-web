import { NextRequest, NextResponse } from 'next/server'
import connectDB from '../../lib/mongodb'
import Affirmation from '../../models/Affirmation'

// GET /api/affirmations - Get affirmations
export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const random = searchParams.get('random')

    let query: any = { isActive: true }
    
    if (category && category !== 'all') {
      query.category = category
    }

    if (random === 'true') {
      // Get a random affirmation
      const count = await Affirmation.countDocuments(query)
      const randomIndex = Math.floor(Math.random() * count)
      const affirmation = await Affirmation.findOne(query).skip(randomIndex)
      
      return NextResponse.json({ 
        success: true, 
        data: affirmation 
      })
    }

    // Get all affirmations matching query
    const affirmations = await Affirmation.find(query).sort({ createdAt: -1 })
    
    return NextResponse.json({ 
      success: true, 
      data: affirmations,
      count: affirmations.length 
    })

  } catch (error) {
    console.error('Error fetching affirmations:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch affirmations' },
      { status: 500 }
    )
  }
}

// POST /api/affirmations - Create new affirmation
export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const body = await request.json()
    const { text, category } = body

    if (!text || !category) {
      return NextResponse.json(
        { success: false, error: 'Text and category are required' },
        { status: 400 }
      )
    }

    const affirmation = await Affirmation.create({
      text,
      category,
      isActive: true
    })

    return NextResponse.json({ 
      success: true, 
      data: affirmation 
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating affirmation:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create affirmation' },
      { status: 500 }
    )
  }
} 