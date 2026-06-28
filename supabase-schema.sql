-- ============================================================
-- SCHOOL GRIEVANCE DESK - Database Schema
-- Run this in your Supabase SQL Editor
-- ============================================================

CREATE TABLE grievances (
  id BIGSERIAL PRIMARY KEY,
  ticket_id TEXT UNIQUE NOT NULL DEFAULT '',
  student_name TEXT NOT NULL,
  roll_number TEXT NOT NULL,
  class_division TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN (
    'academic', 'administration', 'facilities',
    'examination', 'hostel', 'transport', 'other'
  )),
  description TEXT NOT NULL,
  contact TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN (
    'pending', 'under_review', 'resolved'
  )),
  admin_notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION generate_ticket_id()
RETURNS TRIGGER AS $$
BEGIN
  NEW.ticket_id := 'GRV-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(NEXTVAL('grievances_id_seq')::TEXT, 5, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_ticket_id
  BEFORE INSERT ON grievances
  FOR EACH ROW
  EXECUTE FUNCTION generate_ticket_id();

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON grievances
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

ALTER TABLE grievances ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert grievances"
  ON grievances FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anyone can view grievances"
  ON grievances FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Admins can update grievances"
  ON grievances FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);
