-- Migration to store Onda property static content
CREATE TABLE IF NOT EXISTS onda_properties (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    address TEXT,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    star_rating INTEGER,
    thumbnail_url TEXT,
    images TEXT[] DEFAULT '{}',
    amenities TEXT[] DEFAULT '{}',
    description TEXT,
    status TEXT,
    last_synced_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE onda_properties ENABLE ROW LEVEL SECURITY;

-- Allow public read access to properties
CREATE POLICY "Allow public read access to onda_properties"
ON onda_properties
FOR SELECT
TO public
USING (true);

-- Allow service role full access
CREATE POLICY "Allow service role full access to onda_properties"
ON onda_properties
USING (true)
WITH CHECK (true);
