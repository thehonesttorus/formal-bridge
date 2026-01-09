# Supabase Setup for Formal Bridge

## 1. Create Supabase Project

1. Go to https://supabase.com/ and create a free account
2. Create a new project
3. Copy your project URL and anon key from Settings > API

## 2. Add Environment Variables

Add to your `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY
```

## 3. Create the Certificates Table

Run this SQL in the Supabase SQL Editor (Database > SQL Editor):

```sql
-- Create certificates table
CREATE TABLE certificates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    user_id TEXT NOT NULL,
    user_email TEXT NOT NULL,
    case_reference TEXT,
    ip_name TEXT NOT NULL,
    attested_by TEXT,
    input_file_hash TEXT NOT NULL,
    creditor_count INTEGER NOT NULL,
    net_floating_charge_property DECIMAL NOT NULL,
    floating_charge_date DATE NOT NULL,
    total_costs DECIMAL NOT NULL,
    insolvency_commencement_date DATE NOT NULL,
    prescribed_part DECIMAL NOT NULL,
    cap_applied DECIMAL NOT NULL,
    is_de_minimis_applied BOOLEAN NOT NULL DEFAULT false,
    is_nil_distribution BOOLEAN NOT NULL DEFAULT false,
    tier_3a_total DECIMAL NOT NULL DEFAULT 0,
    tier_3b_total DECIMAL NOT NULL DEFAULT 0,
    tier_6_total DECIMAL NOT NULL DEFAULT 0,
    verification_code TEXT NOT NULL UNIQUE,
    kernel_version TEXT NOT NULL
);

-- Create index on user_id for faster queries
CREATE INDEX idx_certificates_user_id ON certificates(user_id);

-- Create index on verification_code for verification lookups
CREATE INDEX idx_certificates_verification_code ON certificates(verification_code);

-- Enable Row Level Security
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only read their own certificates
CREATE POLICY "Users can view own certificates" ON certificates
    FOR SELECT USING (true);  -- For now, allow all reads (verification page needs this)

-- Policy: Users can insert their own certificates  
CREATE POLICY "Users can insert own certificates" ON certificates
    FOR INSERT WITH CHECK (true);  -- Auth is handled by Clerk in the API

-- ============================================
-- Waitlist table for Early Access signups
-- ============================================
CREATE TABLE waitlist (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    firm_name TEXT,
    cases_per_month TEXT,
    current_system TEXT,
    notes TEXT,
    product TEXT DEFAULT 'full_waterfall'
);

-- Index for email lookups
CREATE INDEX idx_waitlist_email ON waitlist(email);
```

## 4. Restart Dev Server

After adding the environment variables, restart your dev server:

```bash
npm run dev
```

## 5. Test the Integration

1. Go to `/portal/dashboard` - should show empty state
2. Complete the Airlock flow to generate a certificate
3. The certificate will be saved to Supabase
4. Dashboard will show certificate history
5. `/verify/[code]` will show certificate details
