-- Create table for deceased hemodialysis patients
CREATE TABLE IF NOT EXISTS deceased_patients (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nama_pasien VARCHAR(255) NOT NULL,
    tanggal_meninggal DATE NOT NULL,
    no_handphone VARCHAR(20),
    alamat TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_deceased_patients_tanggal ON deceased_patients(tanggal_meninggal);
CREATE INDEX IF NOT EXISTS idx_deceased_patients_nama ON deceased_patients(nama_pasien);

-- Add RLS (Row Level Security) policies
ALTER TABLE deceased_patients ENABLE ROW LEVEL SECURITY;

-- Policy to allow all operations for authenticated users
CREATE POLICY "Allow all operations for authenticated users" ON deceased_patients
    FOR ALL USING (auth.role() = 'authenticated');



