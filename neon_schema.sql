-- ==============================================================================
-- Pushkala Organic Dairy Farm — Neon Serverless PostgreSQL Database Schema
-- Run this SQL in your Neon Console (Neon Dashboard -> SQL Editor)
-- ==============================================================================

-- 1. Create site_settings table
CREATE TABLE IF NOT EXISTS site_settings (
    id TEXT PRIMARY KEY DEFAULT 'general',
    primary_phone TEXT NOT NULL DEFAULT '9742216162',
    secondary_phone TEXT NOT NULL DEFAULT '7204726665',
    fssai_no TEXT NOT NULL DEFAULT '21226007000022',
    address TEXT NOT NULL DEFAULT 'World School, Hulimangala, Jigani Hobli, Bangalore – 560105',
    prices JSONB NOT NULL DEFAULT '{"a1": 65, "a2": 120, "buffalo": 120, "paneer": 120}'::jsonb,
    ghee_products JSONB DEFAULT '[]'::jsonb,
    images JSONB DEFAULT '{}'::jsonb,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 2. Insert initial default record if not present
INSERT INTO site_settings (
    id,
    primary_phone,
    secondary_phone,
    fssai_no,
    address,
    prices,
    updated_at
) VALUES (
    'general',
    '9742216162',
    '7204726665',
    '21226007000022',
    'World School, Hulimangala, Jigani Hobli, Bangalore – 560105',
    '{"a1": 65, "a2": 120, "buffalo": 120, "paneer": 120}'::jsonb,
    CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    primary_phone = EXCLUDED.primary_phone,
    updated_at = CURRENT_TIMESTAMP;

-- 3. Verify record
SELECT id, primary_phone, secondary_phone, updated_at FROM site_settings;
