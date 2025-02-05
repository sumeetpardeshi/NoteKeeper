export interface Note {
  id: string
  title: string
  content: string[]
  color: string
  createdAt: number
  tags: string[]
}

export interface Label {
  id: string
  name: string
} 