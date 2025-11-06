"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"

interface NoteModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (title: string, content: string, tags: string[]) => void
  initialNote: {
    id: number
    title: string
    content: string
    tags: string[],
    created_at: string
  } | null
  isLoading?: boolean
}

export default function NoteModal({ isOpen, onClose, onSubmit, initialNote, isLoading = false }: NoteModalProps) {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [tagInput, setTagInput] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    if (initialNote) {
      setTitle(initialNote.title)
      setContent(initialNote.content)
      setTagInput(initialNote.tags.join(", "))
    } else {
      setTitle("")
      setContent("")
      setTagInput("")
    }
    setError("")
  }, [initialNote, isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!title.trim()) {
      setError("Title is required")
      return
    }
    if (!content.trim()) {
      setError("Content is required")
      return
    }

    const tags = tagInput
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0)

    onSubmit(title, content, tags)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background border border-border rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">{initialNote ? "Edit Note" : "Create New Note"}</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Close"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <div className="p-3 bg-destructive/10 text-destructive rounded-md text-sm">{error}</div>}

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Title</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Note title"
              required
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Content</label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your note here..."
              required
              className="w-full p-3 border border-border rounded-md text-foreground placeholder-muted-foreground min-h-32 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Tags (comma-separated)</label>
            <Input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="e.g., work, important, urgent"
              className="w-full"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? "Saving..." : initialNote ? "Update" : "Create"}
            </Button>
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
