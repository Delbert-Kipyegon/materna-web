import mongoose, { Document, Schema } from 'mongoose'

export interface IAffirmation extends Document {
  text: string
  category: 'confidence' | 'strength' | 'love' | 'peace'
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

const AffirmationSchema: Schema = new Schema({
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

// Add indexes for better query performance
AffirmationSchema.index({ category: 1, isActive: 1 })
AffirmationSchema.index({ createdAt: -1 })

export default mongoose.models.Affirmation || mongoose.model<IAffirmation>('Affirmation', AffirmationSchema) 