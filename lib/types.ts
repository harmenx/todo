export interface Todo {
  id: string
  owner: "harmen" | "leila" | "chiante"
  title: string
  is_complete: boolean
  started_at: string | null
  finished_at: string | null
  created_at: string
  updated_at: string
}
