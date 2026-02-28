"use client"

import { useCallback, useEffect, useState } from "react"
import { TodoList } from "@/components/todo-list"
import { fetchTodos } from "@/app/actions"
import type { Todo } from "@/lib/types"
import { USER_CONFIG, OWNERS } from "@/lib/constants"

export default function HomePage() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [dbReady, setDbReady] = useState(false)

  // Try to bootstrap the database on first load
  useEffect(() => {
    async function initDb() {
      try {
        await fetch("/api/init-db", { method: "POST" })
      } catch (e) {
        console.log("[v0] Init DB call failed (may already exist):", e)
      }
      setDbReady(true)
    }
    initDb()
  }, [])

  const loadTodos = useCallback(async () => {
    try {
      const data = await fetchTodos()
      setTodos(data)
    } catch (error) {
      console.log("[v0] Error fetching todos:", error)
    }
  }, [])

  // Only start polling once DB is ready
  useEffect(() => {
    if (!dbReady) return
    loadTodos()
    const interval = setInterval(loadTodos, 2000)
    return () => clearInterval(interval)
  }, [dbReady, loadTodos])

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 text-balance text-foreground">
            Tootie Task Tracker
          </h1>
          <p className="text-muted-foreground">Time to lock in</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {OWNERS.map((owner) => (
            <TodoList
              key={owner}
              owner={owner}
              title={USER_CONFIG[owner].title}
              todos={todos.filter((t) => t.owner === owner)}
              icon={USER_CONFIG[owner].icon}
              onTodoChanged={loadTodos}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
