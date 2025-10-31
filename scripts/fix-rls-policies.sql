-- Fix RLS policies for client_logos table to allow all operations
-- This creates policies that allow public access for all CRUD operations

-- Drop existing policies
DROP POLICY IF EXISTS "Allow public read access" ON client_logos;
DROP POLICY IF EXISTS "Allow all operations" ON client_logos;
DROP POLICY IF EXISTS "Allow authenticated insert/update" ON client_logos;

-- Temporarily disable RLS to test (you can re-enable later if needed)
-- ALTER TABLE client_logos DISABLE ROW LEVEL SECURITY;

-- Or create very permissive policies (recommended for now)

-- Allow anyone to read
CREATE POLICY "Public read access" ON client_logos
  FOR SELECT
  USING (true);

-- Allow anyone to insert
CREATE POLICY "Public insert access" ON client_logos
  FOR INSERT
  WITH CHECK (true);

-- Allow anyone to update
CREATE POLICY "Public update access" ON client_logos
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Allow anyone to delete
CREATE POLICY "Public delete access" ON client_logos
  FOR DELETE
  USING (true);

-- Verify policies are created
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'client_logos';
