import { FC, useState, KeyboardEvent, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Note } from '@/types/note'
import { X, Tag } from 'lucide-react'

interface NoteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (note: Partial<Note>) => void
  note?: Note
}

const colors = [
  'bg-white',
  'bg-red-200',
  'bg-yellow-200',
  'bg-green-200',
  'bg-blue-200',
  'bg-purple-200'
]

const NoteDialog: FC<NoteDialogProps> = ({ open, onOpenChange, onSave, note }) => {
  const [title, setTitle] = useState(note?.title || '')
  const [content, setContent] = useState(note?.content.join('\n') || '')
  const [color, setColor] = useState(note?.color || 'bg-white')
  const [tags, setTags] = useState<string[]>(note?.tags || [])
  const [newTag, setNewTag] = useState('')

  useEffect(() => {
    if (note) {
      setTitle(note.title)
      setContent(note.content.join('\n'))
      setColor(note.color)
      setTags(note.tags)
    } else {
      setTitle('')
      setContent('')
      setColor('bg-white')
      setTags([])
    }
    setNewTag('')
  }, [note])

  const handleSave = () => {
    if (title.trim() || content.trim()) {
      onSave({
        title: title.trim() || 'Untitled',
        content: content.split('\n').filter(line => line.trim() !== ''),
        color,
        tags
      })
      onOpenChange(false)
    } else {
      onOpenChange(false)
    }
  }

  const handleChange = (field: 'title' | 'content' | 'color' | 'tags', value: any) => {
    switch (field) {
      case 'title':
        setTitle(value)
        break
      case 'content':
        setContent(value)
        break
      case 'color':
        setColor(value)
        break
      case 'tags':
        setTags(value)
        break
    }
  }

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      handleChange('tags', [...tags, newTag.trim()])
      setNewTag('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    handleChange('tags', tags.filter(tag => tag !== tagToRemove))
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddTag()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>
            <Input
              value={title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Title"
              className="text-xl border-none bg-transparent focus-visible:ring-0 p-0"
            />
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <textarea
            placeholder="Take a note..."
            value={content}
            onChange={(e) => handleChange('content', e.target.value)}
            className="w-full min-h-[200px] p-2 bg-transparent border-none resize-none focus:outline-none"
          />
          <div className="space-y-2">
            <div className="flex gap-2">
              <Input
                placeholder="Add tag..."
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1"
              />
              <Button onClick={handleAddTag} size="sm">
                <Tag className="w-4 h-4 mr-2" />
                Add
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 rounded-full text-sm bg-black/10 flex items-center gap-1"
                  >
                    {tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="hover:text-red-500"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="flex justify-between items-center">
            <div className="flex gap-1">
              {colors.map((c) => (
                <button
                  key={c}
                  onClick={() => handleChange('color', c)}
                  className={`w-6 h-6 rounded-full ${c} border border-gray-300 ${
                    color === c ? 'ring-2 ring-blue-500' : ''
                  }`}
                />
              ))}
            </div>
            <Button onClick={handleSave}>Save</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default NoteDialog 