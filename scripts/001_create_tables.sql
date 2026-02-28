-- Create users table to store user preferences
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  animal_icon TEXT NOT NULL CHECK (animal_icon IN ('capybara', 'quokka')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create todos table for both Harmen and Leila
CREATE TABLE IF NOT EXISTS todos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  owner TEXT NOT NULL CHECK (owner IN ('harmen', 'leila')),
  title TEXT NOT NULL,
  is_complete BOOLEAN DEFAULT FALSE,
  started_at TIMESTAMP WITH TIME ZONE,
  finished_at TIMESTAMP WITH TIME ZONE,
  completed_today BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_todos_owner ON todos(owner);
CREATE INDEX IF NOT EXISTS idx_todos_user_id ON todos(user_id);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Users can insert their own profile" ON users
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view all profiles" ON users
  FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" ON users
  FOR UPDATE USING (true);

-- Create policies for todos table
CREATE POLICY "Anyone can view todos" ON todos
  FOR SELECT USING (true);

CREATE POLICY "Anyone can insert todos" ON todos
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update todos" ON todos
  FOR UPDATE USING (true);

CREATE POLICY "Anyone can delete todos" ON todos
  FOR DELETE USING (true);
