"use client"

import NoteCard from "@/components/note-card"

interface Note {
  id: number
  title: string
  content: string
  tags: string[]
  created_at: string
}

interface NotesListProps {
  notes: Note[]
  onEdit: (note: Note) => void
  onDelete: (id: number) => void
  isDeletingId?: number
}

export default function NotesList({ notes, onEdit, onDelete, isDeletingId }: NotesListProps) {
  if (notes.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">No notes yet. Create one to get started!</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {notes.map((note) => (
        <NoteCard
          key={note.id}
          id={note.id}
          title={note.title}
          content={note.content}
          tags={note.tags}
          createdAt={note.created_at}
          onEdit={() => onEdit(note)}
          onDelete={() => onDelete(note.id)}
          isDeleting={isDeletingId === note.id}
        />
      ))}
    </div>
  )
}
