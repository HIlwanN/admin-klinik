# 🔧 Fix Error Data Pasien Meninggal

## ❌ **Masalah:**
Error "Unexpected token '<', "<!DOCTYPE "... is not valid JSON" ketika menambah data pasien meninggal.

## 🔍 **Penyebab:**
1. **Tabel `deceased_patients` belum dibuat** di Supabase
2. **Backend mengembalikan HTML** bukan JSON karena routing issue

## ✅ **Solusi:**

### **1. Buat Tabel di Supabase**

1. **Buka Supabase Dashboard** → **SQL Editor**
2. **Copy dan paste script berikut:**

```sql
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
```

3. **Klik "Run"** untuk menjalankan script

### **2. Restart Backend**

```bash
# Stop backend (Ctrl+C)
# Restart backend
cd backend
npm start
```

### **3. Test Fitur**

1. **Buka** `http://localhost:5173`
2. **Login** dengan admin credentials
3. **Klik** "Data Pasien" → Tab "🕊️ Data Meninggal"
4. **Klik** "+ Tambah Data Meninggal"
5. **Isi form** dan klik "Simpan"

## 🎯 **Hasil:**
- ✅ Tabel `deceased_patients` dibuat di Supabase
- ✅ Backend API endpoints berfungsi
- ✅ Frontend form berfungsi
- ✅ Data tersimpan dengan benar

## 📋 **API Endpoints yang Tersedia:**
- `GET /api/deceased-patients` - Ambil semua data
- `POST /api/deceased-patients` - Tambah data baru
- `PUT /api/deceased-patients/:id` - Update data
- `DELETE /api/deceased-patients/:id` - Hapus data

## 🔧 **Troubleshooting:**

**Jika masih error:**
1. **Cek Supabase Dashboard** → Tables → Pastikan `deceased_patients` ada
2. **Cek Browser Console** untuk error details
3. **Cek Network Tab** untuk melihat request/response
4. **Restart backend** jika perlu

**Jika tabel sudah ada tapi masih error:**
1. **Cek RLS policies** di Supabase
2. **Cek API key** di `.env` file
3. **Cek network connection** ke Supabase
