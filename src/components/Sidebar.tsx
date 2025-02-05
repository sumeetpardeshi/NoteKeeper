import { FC } from 'react'
import { Button } from './ui/button'
import { Tag } from 'lucide-react'

interface SidebarProps {
  allTags: string[]
  selectedTag: string | null
  onTagSelect: (tag: string | null) => void
  noteColors: Array<{ value: string; label: string }>
  selectedColor: string | null
  onColorSelect: (color: string | null) => void
}

const Sidebar: FC<SidebarProps> = ({ 
  allTags,
  selectedTag,
  onTagSelect,
  noteColors,
  selectedColor,
  onColorSelect
}) => {
  return (
    <div className="hidden md:block w-64 h-screen bg-white border-r p-4 fixed left-0 top-14 overflow-y-auto">
      {/* Colors Section */}
      <div className="mb-8">
        <h3 className="text-sm font-medium text-gray-500 mb-3">COLORS</h3>
        <div className="space-y-2">
          <Button
            variant={selectedColor === null ? "secondary" : "ghost"}
            size="sm"
            onClick={() => onColorSelect(null)}
            className="w-full justify-start"
          >
            All Colors
          </Button>
          {noteColors.map(({ value, label }) => (
            <Button
              key={value}
              variant={selectedColor === value ? "secondary" : "ghost"}
              size="sm"
              onClick={() => onColorSelect(value)}
              className="w-full justify-start gap-2"
            >
              <div className={`w-4 h-4 rounded-full ${value} border border-gray-300`} />
              {label}
            </Button>
          ))}
        </div>
      </div>

      {/* Tags Section */}
      <div>
        <h3 className="text-sm font-medium text-gray-500 mb-3">TAGS</h3>
        <div className="space-y-2">
          <Button
            variant={selectedTag === null ? "secondary" : "ghost"}
            size="sm"
            onClick={() => onTagSelect(null)}
            className="w-full justify-start"
          >
            All Tags
          </Button>
          {allTags.map(tag => (
            <Button
              key={tag}
              variant={selectedTag === tag ? "secondary" : "ghost"}
              size="sm"
              onClick={() => onTagSelect(tag)}
              className="w-full justify-start gap-2"
            >
              <Tag className="w-4 h-4" />
              {tag}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Sidebar 