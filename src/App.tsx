import { useState, useEffect, SetStateAction } from 'react'
import NoteDialog from './components/NoteDialog'
import Sidebar from './components/Sidebar'
import { Button } from './components/ui/button'
import { Note as NoteType } from './types/note'
import { getStoredNotes, saveNotes } from './lib/storage'
import { StickyNote, UserCircle2 } from 'lucide-react'
import MobileFilters from './components/MobileFilters'
import { DndContext, DragEndEvent, closestCenter } from '@dnd-kit/core'
import { SortableContext, arrayMove, rectSortingStrategy } from '@dnd-kit/sortable'
import { SortableNote } from './components/SortableNote'
import { Input } from './components/ui/input'

function App() {
  const [notes, setNotes] = useState<NoteType[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingNote, setEditingNote] = useState<NoteType | undefined>()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [selectedColor, setSelectedColor] = useState<string | null>(null)

  useEffect(() => {
    console.log('Loading initial notes')
    const storedNotes = getStoredNotes()
    setNotes(storedNotes)
  }, [])

  useEffect(() => {
    if (notes.length > 0) {
      const timeoutId = setTimeout(() => {
        console.log('Saving notes:', notes)
        saveNotes(notes)
      }, 300)
      
      return () => clearTimeout(timeoutId)
    }
  }, [notes])

  const handleCreateNote = (noteData: Partial<NoteType>) => {
    if (!noteData.title && (!noteData.content || noteData.content.length === 0)) {
      return;
    }
    
    const newNote: NoteType = {
      id: Date.now().toString(),
      title: noteData.title || 'Untitled',
      content: noteData.content || [],
      color: noteData.color || 'bg-white',
      createdAt: Date.now(),
      tags: noteData.tags || []
    }

    setNotes(prevNotes => [newNote, ...prevNotes])
    setDialogOpen(false)
  }

  const handleEditNote = (note: NoteType) => {
    setEditingNote(note)
    setDialogOpen(true)
  }

  const handleUpdateNote = (noteData: Partial<NoteType>) => {
    if (!editingNote) return
    
    setNotes(notes.map(note => 
      note.id === editingNote.id 
        ? { ...note, ...noteData }
        : note
    ))
    setEditingNote(undefined)
  }

  const handleDeleteNote = (noteId: string) => {
    setNotes(notes.filter(note => note.id !== noteId))
  }

  const allTags = Array.from(
    new Set(notes.flatMap(note => note.tags))
  ).sort()

  const noteColors = [
    { value: 'bg-white', label: 'White' },
    { value: 'bg-red-200', label: 'Red' },
    { value: 'bg-yellow-200', label: 'Yellow' },
    { value: 'bg-green-200', label: 'Green' },
    { value: 'bg-blue-200', label: 'Blue' },
    { value: 'bg-purple-200', label: 'Purple' }
  ]

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.some(c => c.toLowerCase().includes(searchTerm.toLowerCase())) ||
      note.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesTag = !selectedTag || note.tags.includes(selectedTag)
    const matchesColor = !selectedColor || note.color === selectedColor
    
    return matchesSearch && matchesTag && matchesColor
  })

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      setNotes((notes) => {
        const oldIndex = notes.findIndex((note) => note.id === active.id)
        const newIndex = notes.findIndex((note) => note.id === over.id)

        return arrayMove(notes, oldIndex, newIndex)
      })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="fixed top-0 left-0 right-0 h-14 bg-white border-b flex items-center px-4 z-10">
        <div className="flex-1 w-full flex items-center gap-4">
          <div className="md:hidden">
            <MobileFilters
              allTags={allTags}
              selectedTag={selectedTag}
              onTagSelect={setSelectedTag}
              noteColors={noteColors}
              selectedColor={selectedColor}
              onColorSelect={setSelectedColor}
            />
          </div>

          <div className="flex items-center gap-2 md:ml-4">
            <StickyNote className="h-6 w-6 text-yellow-500" />
            <span className="font-semibold text-lg hidden sm:inline">NoteKeeper</span>
          </div>

          <div className="flex-1 max-w-full ml-10">
            <Input 
              placeholder="Search notes..." 
              value={searchTerm}
              onChange={(e: { target: { value: SetStateAction<string> } }) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-end">
            <Button variant="ghost" size="icon" className="ml-auto">
              <UserCircle2 className="h-6 w-6 text-gray-500" />
            </Button>
          </div>
        </div>
      </header>

      <Sidebar
        allTags={allTags}
        selectedTag={selectedTag}
        onTagSelect={setSelectedTag}
        noteColors={noteColors}
        selectedColor={selectedColor}
        onColorSelect={setSelectedColor}
      />

      <main className="pt-20 px-4 md:ml-64">
        <div className="max-w-6xl mx-auto">
          <Button
            onClick={() => {
              setEditingNote(undefined)
              setDialogOpen(true)
            }}
            className="w-full max-w-3xl mx-auto justify-start text-gray-500 bg-white shadow-sm hover:bg-gray-50 mb-4"
          >
            Take a note...
          </Button>
          
          <DndContext
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-4 [column-fill:_balance] w-full">
              <SortableContext 
                items={filteredNotes.map(note => note.id)} 
                strategy={rectSortingStrategy}
              >
                {filteredNotes.map((note) => (
                  <SortableNote
                    key={note.id}
                    note={note}
                    onEdit={() => handleEditNote(note)}
                    onDelete={(e) => {
                      e.stopPropagation()
                      handleDeleteNote(note.id)
                    }}
                  />
                ))}
              </SortableContext>
            </div>
          </DndContext>
        </div>
      </main>

      <NoteDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={editingNote ? handleUpdateNote : handleCreateNote}
        note={editingNote}
      />
    </div>
  )
}

export default App 