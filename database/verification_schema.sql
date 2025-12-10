-- Add columns to users table for verification
ALTER TABLE users ADD COLUMN IF NOT EXISTS country VARCHAR(2) DEFAULT 'KE';
ALTER TABLE users ADD COLUMN IF NOT EXISTS id_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS id_verification_status VARCHAR(20) DEFAULT 'pending';
ALTER TABLE users ADD COLUMN IF NOT EXISTS location_verified BOOLEAN DEFAULT FALSE;

-- Document uploads table
CREATE TABLE IF NOT EXISTS document_uploads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    document_type VARCHAR(50) NOT NULL,
    file_url TEXT NOT NULL,
    file_name VARCHAR(255),
    verification_status VARCHAR(20) DEFAULT 'pending',
    verified_at TIMESTAMP WITH TIME ZONE,
    rejected_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ID verification attempts table
CREATE TABLE IF NOT EXISTS id_verification_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    id_number VARCHAR(50) NOT NULL,
    country VARCHAR(2) NOT NULL,
    verification_method VARCHAR(50),
    status VARCHAR(20) DEFAULT 'pending',
    response_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Location verification table
CREATE TABLE IF NOT EXISTS location_verifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    ip_address VARCHAR(45),
    country_code VARCHAR(2),
    country_name VARCHAR(100),
    city VARCHAR(100),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_document_uploads_user_id ON document_uploads(user_id);
CREATE INDEX IF NOT EXISTS idx_id_verification_attempts_user_id ON id_verification_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_location_verifications_user_id ON location_verifications(user_id);

-- Triggers
CREATE TRIGGER update_document_uploads_updated_at BEFORE UPDATE ON document_uploads
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
