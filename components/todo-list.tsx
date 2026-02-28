"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { TodoItem } from "@/components/todo-item"
import { Plus, Trash2, Loader2 } from "lucide-react"
import { addTodo, clearAllTodos } from "@/app/actions"
import type { Todo } from "@/lib/types"
import type { OwnerKey } from "@/lib/constants"

interface TodoListProps {
  owner: OwnerKey
  title: string
  todos: Todo[]
  icon: string
  onTodoChanged: () => void
}

export function TodoList({ owner, title, todos, icon, onTodoChanged }: TodoListProps) {
  const [newTodo, setNewTodo] = useState("")
  const [isAdding, setIsAdding] = useState(false)
  const [isClearing, setIsClearing] = useState(false)

  // Count tasks completed today (in NZ timezone)
  const getNZDate = () => {
    const now = new Date()
    return new Date(now.toLocaleString("en-US", { timeZone: "Pacific/Auckland" })).toDateString()
  }

  const todayNZ = getNZDate()
  const completedToday = todos.filter((todo) => {
    if (!todo.is_complete || !todo.finished_at) return false
    const finishedDate = new Date(
      new Date(todo.finished_at).toLocaleString("en-US", { timeZone: "Pacific/Auckland" })
    ).toDateString()
    return finishedDate === todayNZ
  }).length

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTodo.trim()) return

    setIsAdding(true)
    const todoText = newTodo
    setNewTodo("")

    try {
      await addTodo(owner, todoText)
      onTodoChanged()
    } catch (error) {
      console.error("[v0] Error adding todo:", error)
      setNewTodo(todoText)
    } finally {
      setIsAdding(false)
    }
  }

  const handleClearAll = async () => {
    if (!confirm(`Are you sure you want to clear all tasks for ${title}?`)) return

    setIsClearing(true)

    try {
      await clearAllTodos(owner)
      onTodoChanged()
    } catch (error) {
      console.error("[v0] Error clearing todos:", error)
    } finally {
      setIsClearing(false)
    }
  }

  return (
    <Card className="p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <span className="text-4xl">{icon}</span>
          <h2 className="text-2xl font-bold">{title}</h2>
        </div>
      </div>

      <form onSubmit={handleAddTodo} className="mb-6">
        <div className="flex gap-2">
          <Input
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Add a new task..."
            disabled={isAdding}
            className="flex-1"
          />
          <Button type="submit" disabled={isAdding || !newTodo.trim()} size="icon">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        {isAdding && (
          <div className="flex items-center justify-center gap-2 mt-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Loading...</span>
          </div>
        )}
      </form>

      <div className="flex-1 space-y-3 overflow-auto mb-6">
        {todos.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No tasks yet. Add one to get started!</p>
        ) : (
          todos.map((todo) => (
            <TodoItem key={todo.id} todo={todo} onTodoChanged={onTodoChanged} />
          ))
        )}
      </div>

      <div className="pt-4 border-t space-y-3">
        <p className="text-center text-sm text-muted-foreground">
          {"You've done "}
          <span className="font-bold text-foreground">{completedToday}</span>
          {" "}
          {completedToday === 1 ? "task" : "tasks"}
          {" today"}
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={handleClearAll}
          disabled={isClearing || todos.length === 0}
          className="w-full text-destructive hover:text-destructive bg-transparent"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Clear All Tasks
        </Button>
      </div>
    </Card>
  )
}
