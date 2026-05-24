ALTER TABLE sellers ADD COLUMN IF NOT EXISTS owner_subject TEXT UNIQUE;
CREATE INDEX IF NOT EXISTS idx_sellers_owner_subject ON sellers(owner_subject);
