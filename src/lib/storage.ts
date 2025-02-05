import { Note } from '@/types/note'

const STORAGE_KEY = 'keep_notes'

const defaultNotes: Note[] = [
  {
    id: '1',
    title: 'Welcome to Keep Clone',
    content: ['Click the "Take a note..." button to create a new note', 'Notes are automatically saved to your browser'],
    color: 'bg-yellow-200',
    createdAt: Date.now(),
    tags: ['welcome', 'tutorial']
  },
  {
    id: '2',
    title: 'Sample Note',
    content: ['You can edit notes', 'Delete notes', 'Change note color', 'Add tags'],
    color: 'bg-green-200',
    createdAt: Date.now(),
    tags: ['sample']
  }
]

export const getStoredNotes = (): Note[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) {
      console.log('No stored notes found, returning defaults')
      return defaultNotes
    }
    const parsed = JSON.parse(stored)
    console.log('Loaded notes from storage:', parsed)
    return parsed
  } catch (error) {
    console.error('Error loading notes from storage:', error)
    return defaultNotes
  }
}

export const saveNotes = (notes: Note[]) => {
  try {
    console.log('Saving notes to storage:', notes)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes))
  } catch (error) {
    console.error('Error saving notes to storage:', error)
  }
} 