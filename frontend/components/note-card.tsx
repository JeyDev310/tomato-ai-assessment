"use client"

import { Trash2, Edit2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface NoteCardProps {
  id: number
  title: string
  content: string
  tags: string[]
  createdAt: string
  onEdit: () => void
  onDelete: () => void
  isDeleting?: boolean
}

export default function NoteCard({ id, title, content, tags, createdAt, onEdit, onDelete, isDeleting }: NoteCardProps) {
  return (
    <div className="bg-card border border-border rounded-2xl p-5 hover:border-primary/50 transition-colors flex flex-col h-full">
      <div className="flex-1 mb-4">
        <h3 className="text-lg font-semibold text-foreground mb-3 line-clamp-2">{title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-4 mb-4">{content}</p>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-block px-2.5 py-1 bg-primary/10 text-primary text-xs rounded-full font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="border-t border-border pt-4 mt-4">
        <p className="text-xs text-muted-foreground mb-3">{new Date(createdAt).toLocaleDateString()}</p>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={onEdit}
            className="flex-1 flex items-center justify-center gap-2 bg-transparent"
          >
            <Edit2 size={16} />
            Edit
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={onDelete}
            disabled={isDeleting}
            className="flex-1 flex items-center justify-center gap-2"
          >
            <Trash2 size={16} />
            Delete
          </Button>
        </div>
      </div>
    </div>
  )
}
