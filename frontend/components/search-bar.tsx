"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface SearchBarProps {
  onSearch: (value: string, type: "keyword" | "tag") => void
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [searchValue, setSearchValue] = useState("")
  const [searchType, setSearchType] = useState<"keyword" | "tag">("keyword")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(searchValue, searchType)
  }

  const handleClear = () => {
    setSearchValue("")
    onSearch("", searchType)
  }

  return (
    <form onSubmit={handleSearch} className="space-y-4">
      <div className="flex gap-2">
        <Button
          type="button"
          variant={searchType === "keyword" ? "default" : "outline"}
          onClick={() => setSearchType("keyword")}
        >
          Keyword
        </Button>
        <Button
          type="button"
          variant={searchType === "tag" ? "default" : "outline"}
          onClick={() => setSearchType("tag")}
        >
          Tag
        </Button>
      </div>

      <div className="flex gap-2">
        <Input
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder={searchType === "keyword" ? "Search by title or content..." : "Search by tag..."}
          className="flex-1"
        />
        <Button type="submit">Search</Button>
        <Button type="button" variant="outline" onClick={handleClear}>
          Clear
        </Button>
      </div>
    </form>
  )
}
