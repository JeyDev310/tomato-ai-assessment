"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import NoteModal from "@/components/note-modal"
import NotesList from "@/components/notes-list"
import SearchBar from "@/components/search-bar"
import AuthForm from "@/components/auth-form"
import { DeleteConfirmationModal } from "@/components/delete-confirmation-modal"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

interface Note {
  id: number
  title: string
  content: string
  tags: string[]
  created_at: string
}

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [token, setToken] = useState<string | null>(null)
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingNote, setEditingNote] = useState<Note | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeletingId, setIsDeletingId] = useState<number | null>(null)
  const [searchValue, setSearchValue] = useState("")
  const [searchType, setSearchType] = useState<"keyword" | "tag">("keyword")
  const [error, setError] = useState("")
  const [isConfirm, setIsConfirm] = useState(false)


  useEffect(() => {
    const storedToken = localStorage.getItem("auth_token")
    if (storedToken) {
      setToken(storedToken)
      setIsAuthenticated(true)
      fetchNotes(storedToken)
    }
  }, [])

  useEffect(() => {

    const storedToken = localStorage.getItem("auth_token")
    if (storedToken) {
      fetchNotes(storedToken);
    }

  }, [searchValue, searchType])

  const fetchNotes = async (authToken: string) => {
    setLoading(true)
    setError("")
    try {
      let endpoint = `${API_BASE_URL}/notes/search`;
      if (searchValue) {
        endpoint = endpoint + (searchType == "keyword" ? `?q=${searchValue}` : `?tag=${searchValue}`);
      }

      const response = await fetch(endpoint, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      })
      if (response.ok) {
        const data = await response.json()
        setNotes(data)
      } else {
        console.error("Failed to fetch notes:", response.status)
        setError("Failed to fetch notes")
      }
    } catch (error) {
      console.error("Error fetching notes:", error)
      setError("Error fetching notes")
    } finally {
      setLoading(false)
    }
  }

  const handleAuth = (newToken: string) => {
    setToken(newToken)
    setIsAuthenticated(true)
    localStorage.setItem("auth_token", newToken)
    fetchNotes(newToken)
  }

  const handleLogout = () => {
    setToken(null)
    setIsAuthenticated(false)
    setNotes([])
    localStorage.removeItem("auth_token")
  }

  const handleSubmitNote = async (title: string, content: string, tags: string[]) => {
    if (!token) return

    setIsSubmitting(true)
    setError("")
    try {
      const url = editingNote ? `${API_BASE_URL}/notes/${editingNote.id}/` : `${API_BASE_URL}/notes/`
      const method = editingNote ? "PATCH" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          content,
          tags,
        }),
      })

      if (response.ok) {
        const responseData = await response.json()
        console.log("Note saved successfully:", responseData)
        await fetchNotes(token)
        setIsModalOpen(false)
        setEditingNote(null)
      } else {
        const errorData = await response.json()
        console.error("Failed to save note:", response.status, errorData)
        setError("Failed to save note")
      }
    } catch (error) {
      console.error("Error saving note:", error)
      setError("Error saving note")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteNote = async () => {
    if (!token) return

    setError("")
    try {
      console.log("Deleting note:", isDeletingId)
      const response = await fetch(`${API_BASE_URL}/notes/${isDeletingId}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        console.log("Note deleted successfully")
        await fetchNotes(token)
      } else {
        console.error("Failed to delete note:", response.status)
        setError("Failed to delete note")
      }
    } catch (error) {
      console.error("Error deleting note:", error)
      setError("Error deleting note")
    } finally {
      setIsDeletingId(null)
    }
  }

  const handleSearch = (value: string, type: "keyword" | "tag") => {
    setSearchValue(value)
    setSearchType(type)
  }

  if (!isAuthenticated) {
    return <AuthForm onAuth={handleAuth} />
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">My Notes</h1>
            <p className="text-muted-foreground">Organize your thoughts with tags and search</p>
          </div>
          <div className="flex gap-3">
            <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
              <Plus size={20} />
              New Note
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>

        {error && <div className="mb-6 p-4 bg-destructive/10 text-destructive rounded-md">{error}</div>}

        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4 text-foreground">Search Notes</h2>
          <SearchBar onSearch={handleSearch} />
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-6 text-foreground">
            {notes.length} Note{notes.length !== 1 ? "s" : ""}
          </h2>
          {loading ? (
            <p className="text-muted-foreground">Loading notes...</p>
          ) : notes.length === 0 && searchValue ? (
            <p className="text-muted-foreground">No notes match your search.</p>
          ) : notes.length === 0 ? (
            <p className="text-muted-foreground">No notes yet. Create one to get started!</p>
          ) : (
            <NotesList
              notes={notes}
              onEdit={(note) => {
                setEditingNote(note)
                setIsModalOpen(true)
              }}
              onDelete={(noteId) => {
                setIsConfirm(true)
                setIsDeletingId(noteId)
              }}
              isDeletingId={isDeletingId ?? undefined}
            />
          )}
        </div>

        <NoteModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setEditingNote(null)
          }}
          onSubmit={handleSubmitNote}
          initialNote={editingNote}
          isLoading={isSubmitting}
        />
        <DeleteConfirmationModal
          open={isConfirm}
          setOpen={setIsConfirm}
          onConfirm={handleDeleteNote}
          onCancel={() => setIsDeletingId(null)}
        />
      </div>
    </main>
  )
}
