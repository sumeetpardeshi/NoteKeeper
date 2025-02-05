import { FC } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Trash2, Tag } from 'lucide-react'

interface NoteProps {
  title: string
  content: string[]
  color: string
  tags: string[]
  onDelete?: (e: React.MouseEvent) => void
}

const Note: FC<NoteProps> = ({ title, content, color, tags, onDelete }) => {
  return (
    <Card className={`${color} hover:shadow-lg transition-shadow group touch-none`}>
      <CardHeader className="flex flex-row items-start justify-between pt-8">
        <div className="space-y-2">
          <CardTitle className="text-lg">{title}</CardTitle>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-0.5 rounded-full text-xs bg-black/10 flex items-center gap-1"
                >
                  <Tag className="w-3 h-3" />
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
        {onDelete && (
          <button
            onClick={onDelete}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-black/5 rounded"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </CardHeader>
      <CardContent>
        <ul className="list-none space-y-1">
          {content.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

export default Note 