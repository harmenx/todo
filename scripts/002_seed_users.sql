-- Create fixed users for Harmen and Leila in the database
INSERT INTO users (id, animal_icon) 
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'quokka'),
  ('00000000-0000-0000-0000-000000000002', 'capybara')
ON CONFLICT (id) DO NOTHING;
