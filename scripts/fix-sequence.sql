-- Fix the primary key sequence for client_logos table
-- This happens when data is inserted with explicit IDs, causing the sequence to fall behind

-- Check current sequence value
SELECT currval('client_logos_id_seq') as current_value;

-- Check max ID in table
SELECT MAX(id) as max_id FROM client_logos;

-- Reset the sequence to the correct value (max ID + 1)
-- This ensures new inserts won't conflict with existing IDs
SELECT setval('client_logos_id_seq', (SELECT COALESCE(MAX(id), 0) + 1 FROM client_logos), false);

-- Verify the fix
SELECT currval('client_logos_id_seq') as new_sequence_value;
