"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Trash2, Play, Square, Pencil, Check, X } from "lucide-react"
import { updateTodo, deleteTodo } from "@/app/actions"
import type { Todo } from "@/lib/types"

interface TodoItemProps {
  todo: Todo
  onTodoChanged: () => void
}

export function TodoItem({ todo, onTodoChanged }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedTitle, setEditedTitle] = useState(todo.title)
  const [isRunning, setIsRunning] = useState(false)
  const [elapsedTime, setElapsedTime] = useState(0)

  useEffect(() => {
    if (todo.started_at && !todo.finished_at) {
      setIsRunning(true)
      const startTime = new Date(todo.started_at).getTime()

      const interval = setInterval(() => {
        const now = Date.now()
        setElapsedTime(Math.floor((now - startTime) / 1000))
      }, 1000)

      return () => clearInterval(interval)
    } else if (todo.started_at && todo.finished_at) {
      setIsRunning(false)
      const startTime = new Date(todo.started_at).getTime()
      const finishTime = new Date(todo.finished_at).getTime()
      setElapsedTime(Math.floor((finishTime - startTime) / 1000))
    } else {
      setIsRunning(false)
      setElapsedTime(0)
    }
  }, [todo.started_at, todo.finished_at])

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleToggleTimer = async () => {
    try {
      if (isRunning) {
        await updateTodo(todo.id, { finished_at: new Date().toISOString() })
      } else {
        await updateTodo(todo.id, { started_at: new Date().toISOString(), finished_at: null })
      }
      onTodoChanged()
    } catch (error) {
      console.error("[v0] Error toggling timer:", error)
    }
  }

  const handleToggleComplete = async (checked: boolean) => {
    try {
      await updateTodo(todo.id, { is_complete: checked })
      onTodoChanged()
    } catch (error) {
      console.error("[v0] Error toggling complete:", error)
    }
  }

  const handleSaveEdit = async () => {
    if (editedTitle.trim()) {
      try {
        await updateTodo(todo.id, { title: editedTitle })
        setIsEditing(false)
        onTodoChanged()
      } catch (error) {
        console.error("[v0] Error saving edit:", error)
      }
    }
  }

  const handleDelete = async () => {
    try {
      await deleteTodo(todo.id)
      onTodoChanged()
    } catch (error) {
      console.error("[v0] Error deleting todo:", error)
    }
  }

  return (
    <div className="flex items-center gap-3 p-4 rounded-lg border bg-card hover:shadow-sm transition-shadow">
      <Checkbox checked={todo.is_complete} onCheckedChange={handleToggleComplete} />

      <div className="flex-1 min-w-0">
        {isEditing ? (
          <Input
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSaveEdit()
              if (e.key === "Escape") {
                setIsEditing(false)
                setEditedTitle(todo.title)
              }
            }}
            className="h-8"
            autoFocus
          />
        ) : (
          <p className={`text-sm ${todo.is_complete ? "line-through text-muted-foreground" : ""}`}>{todo.title}</p>
        )}

        <p className="text-xs text-muted-foreground mt-1 font-mono">{formatTime(elapsedTime)}</p>
      </div>

      <div className="flex items-center gap-1">
        {isEditing ? (
          <>
            <Button size="icon" variant="ghost" onClick={handleSaveEdit}>
              <Check className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => {
                setIsEditing(false)
                setEditedTitle(todo.title)
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <>
            <Button
              size="icon"
              variant="ghost"
              onClick={handleToggleTimer}
              className={isRunning ? "text-red-500" : "text-green-500"}
            >
              {isRunning ? <Square className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <Button size="icon" variant="ghost" onClick={() => setIsEditing(true)}>
              <Pencil className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="ghost" onClick={handleDelete} className="text-destructive">
              <Trash2 className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
