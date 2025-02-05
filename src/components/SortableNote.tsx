import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import Note from "./Note"
import { Note as NoteType } from "@/types/note"
import { GripVertical } from "lucide-react"

interface SortableNoteProps {
  note: NoteType
  onDelete: (e: React.MouseEvent) => void
  onEdit: () => void
}

export function SortableNote({ note, onDelete, onEdit }: SortableNoteProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: note.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const handleClick = (e: React.MouseEvent) => {
    // If it's a click on the delete button or drag handle, don't trigger edit
    if ((e.target as HTMLElement).closest('button')) {
      return
    }
    
    // Only trigger edit if we're not dragging
    if (!isDragging) {
      onEdit()
    }
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="break-inside-avoid mb-4 group"
    >
      <div onClick={handleClick} className="cursor-pointer relative">
        {/* Drag Handle */}
        <button
          {...attributes}
          {...listeners}
          className="absolute left-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-black/5 rounded cursor-move"
        >
          <GripVertical className="w-4 h-4 text-gray-500" />
        </button>
        
        <Note
          title={note.title}
          content={note.content}
          color={note.color}
          tags={note.tags}
          onDelete={onDelete}
        />
      </div>
    </div>
  )
} 