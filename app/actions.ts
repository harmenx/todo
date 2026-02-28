"use server"

import { createClient } from "@/lib/supabase/server"
import type { OwnerKey } from "@/lib/constants"

export async function fetchTodos() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("todos")
    .select("*")
    .order("created_at", { ascending: true })

  if (error) {
    console.log("[v0] Error fetching todos:", error)
    return []
  }

  return data ?? []
}

export async function addTodo(owner: OwnerKey, title: string) {
  const supabase = await createClient()

  console.log("[v0] Adding todo:", { owner, title })

  const { data, error } = await supabase
    .from("todos")
    .insert({
      owner,
      title,
      is_complete: false,
    })
    .select()
    .single()

  if (error) {
    console.log("[v0] Error adding todo:", error)
    throw new Error(error.message)
  }

  console.log("[v0] Todo added successfully:", data)
  return data
}

export async function updateTodo(
  id: string,
  updates: {
    title?: string
    is_complete?: boolean
    started_at?: string | null
    finished_at?: string | null
  },
) {
  const supabase = await createClient()

  console.log("[v0] Updating todo:", { id, updates })

  const { data, error } = await supabase
    .from("todos")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    console.log("[v0] Error updating todo:", error)
    throw new Error(error.message)
  }

  console.log("[v0] Todo updated successfully:", data)
  return data
}

export async function deleteTodo(id: string) {
  const supabase = await createClient()

  console.log("[v0] Deleting todo:", id)

  const { error } = await supabase.from("todos").delete().eq("id", id)

  if (error) {
    console.log("[v0] Error deleting todo:", error)
    throw new Error(error.message)
  }

  console.log("[v0] Todo deleted successfully")
}

export async function clearAllTodos(owner: OwnerKey) {
  const supabase = await createClient()

  console.log("[v0] Clearing all todos for:", owner)

  const { error } = await supabase.from("todos").delete().eq("owner", owner)

  if (error) {
    console.log("[v0] Error clearing todos:", error)
    throw new Error(error.message)
  }

  console.log("[v0] Todos cleared successfully")
}
