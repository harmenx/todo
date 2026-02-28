-- Drop existing tables and start fresh with correct schema
DROP TABLE IF EXISTS todos CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create todos table (no user FK needed - we use owner directly)
CREATE TABLE todos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner TEXT NOT NULL CHECK (owner IN ('harmen', 'leila', 'chiante')),
  title TEXT NOT NULL,
  is_complete BOOLEAN DEFAULT FALSE,
  started_at TIMESTAMP WITH TIME ZONE,
  finished_at TIMESTAMP WITH TIME ZONE,
  completed_today BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create index for faster queries
CREATE INDEX idx_todos_owner ON todos(owner);

-- Enable Row Level Security
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;

-- Create permissive policies
CREATE POLICY "Anyone can view todos" ON todos FOR SELECT USING (true);
CREATE POLICY "Anyone can insert todos" ON todos FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update todos" ON todos FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete todos" ON todos FOR DELETE USING (true);

-- Note: Enable realtime for the todos table via the Supabase dashboard
-- Go to Database > Replication and enable the todos table
