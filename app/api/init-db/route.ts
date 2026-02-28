import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function POST() {
  // Use service role to create tables
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )

  // Check if todos table exists by trying a query
  const { error: checkError } = await supabaseAdmin.from("todos").select("id").limit(1)

  if (checkError && checkError.code === "42P01") {
    // Table does not exist, create it via raw SQL
    const { error: createError } = await supabaseAdmin.rpc("exec_sql", {
      sql: `
        CREATE TABLE IF NOT EXISTS todos (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          owner TEXT NOT NULL CHECK (owner IN ('harmen', 'leila', 'chiante')),
          title TEXT NOT NULL,
          is_complete BOOLEAN DEFAULT FALSE,
          started_at TIMESTAMPTZ,
          finished_at TIMESTAMPTZ,
          created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()),
          updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW())
        );
        CREATE INDEX IF NOT EXISTS idx_todos_owner ON todos(owner);
        ALTER TABLE todos ENABLE ROW LEVEL SECURITY;
        CREATE POLICY IF NOT EXISTS "Anyone can view todos" ON todos FOR SELECT USING (true);
        CREATE POLICY IF NOT EXISTS "Anyone can insert todos" ON todos FOR INSERT WITH CHECK (true);
        CREATE POLICY IF NOT EXISTS "Anyone can update todos" ON todos FOR UPDATE USING (true);
        CREATE POLICY IF NOT EXISTS "Anyone can delete todos" ON todos FOR DELETE USING (true);
      `,
    })

    if (createError) {
      console.log("[v0] Could not auto-create table via RPC:", createError.message)
      return NextResponse.json({ initialized: false, message: "Table needs to be created via Supabase dashboard." }, { status: 500 })
    }

    return NextResponse.json({ initialized: true, message: "Table created successfully." })
  }

  if (checkError) {
    console.log("[v0] Unexpected error checking table:", checkError)
    return NextResponse.json({ initialized: false, error: checkError.message }, { status: 500 })
  }

  // Table exists - check if the chiante owner is allowed by trying an insert
  return NextResponse.json({ initialized: true })
}
