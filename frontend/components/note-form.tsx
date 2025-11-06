"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface NoteFormProps {
  onSubmit: (title: string, content: string, tags: string[]) => void
}

export default function NoteForm({ onSubmit }: NoteFormProps) {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [tagInput, setTagInput] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !content.trim()) return

    setLoading(true)
    const tags = tagInput
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0)

    try {
      await onSubmit(title, content, tags)
      setTitle("")
      setContent("")
      setTagInput("")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your note here..."
          required
          className="w-full p-3 border border-border rounded-md bg-input text-foreground placeholder-muted-foreground min-h-24"
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

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Creating..." : "Create Note"}
      </Button>
    </form>
  )
}
