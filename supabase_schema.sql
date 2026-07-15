-- Supabase Database Schema for VPANSAK Studio Website Services & Support

-- 1. Create website_services table
CREATE TABLE IF NOT EXISTS website_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id TEXT UNIQUE NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT,
  customer_mobile TEXT NOT NULL,
  customer_whatsapp TEXT,
  customer_address TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL DEFAULT 'Uttar Pradesh',
  preferred_contact_method TEXT NOT NULL DEFAULT 'WhatsApp',
  business_name TEXT NOT NULL,
  website_category TEXT NOT NULL,
  business_description TEXT NOT NULL,
  business_location TEXT,
  existing_website_status TEXT NOT NULL DEFAULT 'No existing website',
  existing_website_url TEXT,
  existing_website_issues TEXT,
  website_requirements TEXT NOT NULL,
  required_pages TEXT[] DEFAULT '{}',
  required_features TEXT[] DEFAULT '{}',
  website_style TEXT NOT NULL DEFAULT 'Not Decided',
  preferred_colours TEXT,
  domain_status TEXT NOT NULL DEFAULT 'Domain not decided',
  domain_name TEXT,
  hosting_status TEXT NOT NULL DEFAULT 'Hosting not decided',
  hosting_provider TEXT,
  project_status TEXT NOT NULL DEFAULT 'New Request',
  public_status_note TEXT,
  private_admin_note TEXT,
  project_price NUMERIC NOT NULL DEFAULT 0,
  advance_required NUMERIC NOT NULL DEFAULT 0,
  amount_received NUMERIC NOT NULL DEFAULT 0,
  remaining_balance NUMERIC NOT NULL DEFAULT 0,
  payment_status TEXT NOT NULL DEFAULT 'Pending',
  payment_method TEXT NOT NULL DEFAULT 'Not Decided',
  transaction_id TEXT,
  payment_received_date DATE,
  payment_notes TEXT,
  launch_status TEXT NOT NULL DEFAULT 'Not Launched',
  live_website_url TEXT,
  launch_date DATE,
  support_start_date DATE,
  support_end_date DATE,
  support_status TEXT NOT NULL DEFAULT 'Not Started',
  archived BOOLEAN NOT NULL DEFAULT false,
  is_draft BOOLEAN NOT NULL DEFAULT false,
  checklist JSONB NOT NULL DEFAULT '{}'::jsonb,
  documents JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID
);

-- 2. Create website_support_requests table
CREATE TABLE IF NOT EXISTS website_support_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id TEXT NOT NULL REFERENCES website_services(service_id) ON DELETE CASCADE,
  request_date DATE NOT NULL DEFAULT CURRENT_DATE,
  request_text TEXT NOT NULL,
  request_type TEXT NOT NULL,
  priority TEXT NOT NULL DEFAULT 'Normal',
  request_status TEXT NOT NULL DEFAULT 'Received',
  public_update TEXT,
  private_admin_note TEXT,
  admin_response TEXT,
  completion_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 3. Create activity_logs table for audit trail
CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id TEXT NOT NULL REFERENCES website_services(service_id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  previous_value TEXT,
  new_value TEXT,
  admin_email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 4. Create studio_settings table
CREATE TABLE IF NOT EXISTS studio_settings (
  id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  hide_payments_publicly BOOLEAN NOT NULL DEFAULT false,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_by UUID
);

-- Insert default settings row if it doesn't exist
INSERT INTO studio_settings (id, hide_payments_publicly)
VALUES (1, false)
ON CONFLICT (id) DO NOTHING;

-- 5. Indexes for fast searches and querying
CREATE INDEX IF NOT EXISTS idx_services_service_id ON website_services(service_id);
CREATE INDEX IF NOT EXISTS idx_services_customer_email ON website_services(customer_email);
CREATE INDEX IF NOT EXISTS idx_services_customer_mobile ON website_services(customer_mobile);
CREATE INDEX IF NOT EXISTS idx_services_business_name ON website_services(business_name);
CREATE INDEX IF NOT EXISTS idx_services_project_status ON website_services(project_status);
CREATE INDEX IF NOT EXISTS idx_services_payment_status ON website_services(payment_status);
CREATE INDEX IF NOT EXISTS idx_services_support_end_date ON website_services(support_end_date);
CREATE INDEX IF NOT EXISTS idx_support_requests_service_id ON website_support_requests(service_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_service_id ON activity_logs(service_id);

-- 6. Enable Row Level Security (RLS)
ALTER TABLE website_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE website_support_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE studio_settings ENABLE ROW LEVEL SECURITY;

-- 7. RLS Policies
-- Only the owner (aloksingh84959@gmail.com) can access/modify tables.
-- The policy checks the current JWT email claim inside Supabase.

CREATE POLICY admin_all_services ON website_services
  FOR ALL TO authenticated
  USING (auth.jwt() ->> 'email' = 'aloksingh84959@gmail.com')
  WITH CHECK (auth.jwt() ->> 'email' = 'aloksingh84959@gmail.com');

CREATE POLICY admin_all_support ON website_support_requests
  FOR ALL TO authenticated
  USING (auth.jwt() ->> 'email' = 'aloksingh84959@gmail.com')
  WITH CHECK (auth.jwt() ->> 'email' = 'aloksingh84959@gmail.com');

CREATE POLICY admin_all_activity ON activity_logs
  FOR ALL TO authenticated
  USING (auth.jwt() ->> 'email' = 'aloksingh84959@gmail.com')
  WITH CHECK (auth.jwt() ->> 'email' = 'aloksingh84959@gmail.com');

CREATE POLICY admin_all_settings ON studio_settings
  FOR ALL TO authenticated
  USING (auth.jwt() ->> 'email' = 'aloksingh84959@gmail.com')
  WITH CHECK (auth.jwt() ->> 'email' = 'aloksingh84959@gmail.com');

-- 8. RPC Functions for Secure Public Access (SECURITY DEFINER bypasses RLS)

-- RPC to track service publicly
CREATE OR REPLACE FUNCTION get_public_service_tracking(p_service_id text)
RETURNS TABLE (
  service_id TEXT,
  customer_first_name TEXT,
  masked_email TEXT,
  masked_mobile TEXT,
  business_name TEXT,
  website_category TEXT,
  project_status TEXT,
  public_status_note TEXT,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE,
  launch_status TEXT,
  live_website_url TEXT,
  launch_date DATE,
  support_start_date DATE,
  support_end_date DATE,
  support_status TEXT,
  payment_status TEXT,
  project_price NUMERIC,
  amount_received NUMERIC,
  remaining_balance NUMERIC,
  hide_payments_publicly BOOLEAN
) SECURITY DEFINER AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.service_id,
    split_part(s.customer_name, ' ', 1) as customer_first_name,
    CASE 
      WHEN s.customer_email IS NULL OR s.customer_email = '' THEN ''
      ELSE 
        substring(s.customer_email from 1 for 1) || '****' || 
        substring(s.customer_email from position('@' in s.customer_email))
    END as masked_email,
    CASE 
      WHEN length(s.customer_mobile) >= 4 THEN 
        repeat('*', length(s.customer_mobile) - 4) || substring(s.customer_mobile from length(s.customer_mobile) - 3)
      ELSE s.customer_mobile
    END as masked_mobile,
    s.business_name,
    s.website_category,
    s.project_status,
    s.public_status_note,
    s.created_at,
    s.updated_at,
    s.launch_status,
    s.live_website_url,
    s.launch_date,
    s.support_start_date,
    s.support_end_date,
    s.support_status,
    s.payment_status,
    s.project_price,
    s.amount_received,
    s.remaining_balance,
    COALESCE((SELECT gs.hide_payments_publicly FROM studio_settings gs LIMIT 1), false) as hide_payments_publicly
  FROM website_services s
  WHERE s.service_id = UPPER(TRIM(p_service_id)) AND s.archived = false;
END;
$$ LANGUAGE plpgsql;

-- RPC to get support requests publicly
CREATE OR REPLACE FUNCTION get_public_support_requests(p_service_id text)
RETURNS TABLE (
  request_date DATE,
  request_text TEXT,
  request_type TEXT,
  priority TEXT,
  request_status TEXT,
  admin_response TEXT,
  completion_date DATE,
  created_at TIMESTAMP WITH TIME ZONE
) SECURITY DEFINER AS $$
BEGIN
  RETURN QUERY
  SELECT 
    r.request_date,
    r.request_text,
    r.request_type,
    r.priority,
    r.request_status,
    r.admin_response,
    r.completion_date,
    r.created_at
  FROM website_support_requests r
  WHERE r.service_id = UPPER(TRIM(p_service_id))
  ORDER BY r.created_at DESC;
END;
$$ LANGUAGE plpgsql;
