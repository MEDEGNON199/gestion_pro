-- Migration: Add OAuth fields to utilisateurs table
-- Date: 2025-01-23
-- Description: Add provider, provider_id, and avatar fields for OAuth authentication

-- Add OAuth fields if they don't exist
ALTER TABLE utilisateurs 
ADD COLUMN IF NOT EXISTS provider VARCHAR(50),
ADD COLUMN IF NOT EXISTS provider_id VARCHAR(255),
ADD COLUMN IF NOT EXISTS avatar TEXT;

-- Make password nullable for OAuth users
ALTER TABLE utilisateurs 
ALTER COLUMN mot_de_passe DROP NOT NULL;

-- Add index for OAuth lookups
CREATE INDEX IF NOT EXISTS idx_utilisateurs_provider ON utilisateurs(provider, provider_id);
CREATE INDEX IF NOT EXISTS idx_utilisateurs_email ON utilisateurs(email);