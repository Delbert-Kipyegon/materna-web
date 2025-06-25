'use client'

import React, { useState } from 'react'
import { Plus, Pin, Trash2, Search, Filter, Edit3 } from 'lucide-react'
import { useAppStore } from '../store/useAppStore'
import { Note } from '../types'
import Card from './Card'
import Button from './Button'
import Layout from './Layout'

const NotesPage: React.FC = () => {
  const { savedNotes, addNote, removeNote, togglePinNote } = useAppStore()
  const [showAddForm, setShowAddForm] = useState(false)
  const [newNoteContent, setNewNoteContent] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'tip' | 'affirmation' | 'milestone' | 'custom'>('all')

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault()
    if (newNoteContent.trim()) {
      addNote({
        content: newNoteContent.trim(),
        type: 'custom'
      })
      setNewNoteContent('')
      setShowAddForm(false)
    }
  }

  const filteredNotes = savedNotes
    .filter(note => 
      (filterType === 'all' || note.type === filterType) &&
      note.content.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1
      if (!a.isPinned && b.isPinned) return 1
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })

  const getTypeEmoji = (type: Note['type']) => {
    const emojis = {
      tip: '💡',
      affirmation: '✨',
      milestone: '📅',
      custom: '📝'
    }
    return emojis[type]
  }

  const getTypeColor = (type: Note['type']) => {
    const colors = {
      tip: 'bg-yellow-100 text-yellow-800',
      affirmation: 'bg-pink-100 text-pink-800',
      milestone: 'bg-blue-100 text-blue-800',
      custom: 'bg-green-100 text-green-800'
    }
    return colors[type]
  }

  return (
    <Layout>
      <div className="max-w-md mx-auto px-4 space-y-6">
        <div className="text-center py-4">
          <h1 className="text-2xl font-bold text-primary-900 mb-2">My Notes</h1>
          <p className="text-primary-600">Your saved tips, affirmations, and thoughts</p>
        </div>

        {/* Search and Filter */}
        <Card>
          <div className="p-4 space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search notes..."
                className="w-full pl-10 pr-4 py-2 border border-primary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="w-full p-2 border border-primary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Notes</option>
              <option value="tip">Tips</option>
              <option value="affirmation">Affirmations</option>
              <option value="milestone">Milestones</option>
              <option value="custom">Custom Notes</option>
            </select>
          </div>
        </Card>

        {/* Add Note Button */}
        <Button
          onClick={() => setShowAddForm(true)}
          className="w-full"
          icon={Plus}
        >
          Add New Note
        </Button>

        {/* Add Note Form */}
        {showAddForm && (
          <Card>
            <form onSubmit={handleAddNote} className="p-6 space-y-4">
              <h3 className="font-semibold text-primary-900 flex items-center">
                <Edit3 className="w-5 h-5 mr-2" />
                Add Custom Note
              </h3>
              <textarea
                value={newNoteContent}
                onChange={(e) => setNewNoteContent(e.target.value)}
                placeholder="Write your note here..."
                className="w-full p-3 border border-primary-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                rows={4}
              />
              <div className="flex space-x-3">
                <Button type="submit" disabled={!newNoteContent.trim()}>
                  Save Note
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setShowAddForm(false)
                    setNewNoteContent('')
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Notes List */}
        {filteredNotes.length === 0 ? (
          <Card>
            <div className="p-8 text-center">
              <div className="text-4xl mb-3">📝</div>
              <h3 className="font-semibold text-primary-900 mb-2">No Notes Yet</h3>
              <p className="text-primary-600 text-sm">
                Start saving tips, affirmations, and thoughts to see them here.
              </p>
            </div>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredNotes.map((note) => (
              <Card key={note.id} className={note.isPinned ? 'ring-2 ring-yellow-400/30' : ''}>
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{getTypeEmoji(note.type)}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(note.type)}`}>
                        {note.type}
                      </span>
                      {note.isPinned && (
                        <Pin className="w-4 h-4 text-yellow-500 fill-current" />
                      )}
                    </div>
                    <div className="flex space-x-1">
                      <button
                        onClick={() => togglePinNote(note.id)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          note.isPinned 
                            ? 'text-yellow-600 bg-yellow-100 hover:bg-yellow-200' 
                            : 'text-gray-400 hover:text-yellow-600 hover:bg-yellow-50'
                        }`}
                      >
                        <Pin className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => removeNote(note.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <p className="text-primary-700 text-sm leading-relaxed mb-3 whitespace-pre-wrap">
                    {note.content}
                  </p>
                  
                  <div className="text-xs text-primary-500">
                    {new Date(note.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Stats */}
        {savedNotes.length > 0 && (
          <Card className="bg-gradient-to-r from-primary-50 to-coral-50">
            <div className="p-4 text-center">
              <div className="text-lg font-bold text-primary-600 mb-1">
                {savedNotes.length} Total Notes
              </div>
              <div className="text-sm text-primary-500">
                {savedNotes.filter(n => n.isPinned).length} pinned • {savedNotes.filter(n => n.type === 'custom').length} custom
              </div>
            </div>
          </Card>
        )}
      </div>
    </Layout>
  )
}

export default NotesPage