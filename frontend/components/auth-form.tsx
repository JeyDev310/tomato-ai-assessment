"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

interface AuthFormProps {
  onAuth: (token: string) => void
}

type AuthError = Record<string, string[]>

export default function AuthForm({ onAuth }: AuthFormProps) {
  const [isLogin, setIsLogin] = useState(true)
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<AuthError | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const endpoint = isLogin ? "login/" : "register/"
      const response = await fetch(`${API_BASE_URL}/auth/${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email: !isLogin ? email : undefined,
          password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data)
        return
      }

      if (data.access) {
        onAuth(data.access)
      }
    } catch (err) {
      setError({ "error" : ["Connection error. Make sure the backend is running."]})
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 bg-card border border-border">
        <h1 className="text-3xl font-bold mb-2 text-foreground">Notes Manager</h1>
        <p className="text-muted-foreground mb-6">{isLogin ? "Sign in to your account" : "Create a new account"}</p>

        {error && (
          <div className="mb-4 p-3 bg-destructive/10 text-destructive rounded border border-destructive/20">
            {Object.entries(error).map(([field, messages]) => (
              <div key={field}>
                <strong className="capitalize">{field}:</strong>
                {messages.map((msg, index) => (
                  <p className="text-red-600 text-sm" key={index}>{msg}</p>
                ))}
              </div>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Username</label>
            <Input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="username"
              required
              className="w-full"
            />
          </div>
          {
            !isLogin && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="w-full"
                />
              </div>
            )
          }

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Password</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full"
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Loading..." : isLogin ? "Sign In" : "Sign Up"}
          </Button>
        </form>

        <button
          onClick={() => {
            setIsLogin(!isLogin)
            setError(null)
          }}
          className="w-full mt-4 text-sm text-muted-foreground hover:text-foreground"
        >
          {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
        </button>
      </Card>
    </div>
  )
}
