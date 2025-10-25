# 🔧 Fix RLS Policy Error - Data Pasien Meninggal

## ❌ **Error:**
```
Gagal menyimpan data pasien meninggal: new row violates row-level security policy for table "deceased_patients"
```

## 🔍 **Penyebab:**
**Row Level Security (RLS) policy** di Supabase memblokir operasi insert karena:
1. **RLS policy** tidak mengizinkan operasi dari backend API
2. **Authentication context** tidak sesuai dengan policy
3. **Policy** hanya mengizinkan operasi dari authenticated users, bukan service role

## ✅ **Solusi:**

### **1. Update RLS Policy di Supabase**

1. **Buka Supabase Dashboard** → **SQL Editor**
2. **Copy dan paste script berikut:**

```sql
-- Drop existing policy
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON deceased_patients;

-- Create new policy that allows service role access
CREATE POLICY "Allow service role operations" ON deceased_patients
    FOR ALL USING (
        auth.role() = 'authenticated' OR 
        auth.role() = 'service_role' OR
        auth.uid() IS NOT NULL
    );

-- Alternative: Disable RLS temporarily for testing
-- ALTER TABLE deceased_patients DISABLE ROW LEVEL SECURITY;
```

3. **Klik "Run"** untuk menjalankan script

### **2. Alternative: Disable RLS (Recommended untuk Development)**

Jika masih error, disable RLS sementara:

```sql
-- Disable RLS for deceased_patients table
ALTER TABLE deceased_patients DISABLE ROW LEVEL SECURITY;
```

### **3. Test Fitur**

1. **Refresh browser** (F5)
2. **Klik** "Data Pasien" → Tab "🕊️ Data Meninggal"
3. **Klik** "+ Tambah Data Meninggal"
4. **Isi form** dan klik "Simpan"

## 🔧 **Troubleshooting:**

### **Jika masih error:**

#### **Option 1: Check Supabase Auth Settings**
1. **Buka Supabase Dashboard** → **Authentication** → **Settings**
2. **Pastikan** "Enable email confirmations" = OFF (untuk development)
3. **Pastikan** "Enable phone confirmations" = OFF

#### **Option 2: Use Service Role Key**
1. **Buka Supabase Dashboard** → **Settings** → **API**
2. **Copy "service_role" key** (bukan anon key)
3. **Update** `.env` file di backend:
   ```
   SUPABASE_ANON_KEY=your_service_role_key_here
   ```

#### **Option 3: Check Table Permissions**
1. **Buka Supabase Dashboard** → **Table Editor** → **deceased_patients**
2. **Pastikan** tabel sudah dibuat dengan benar
3. **Check** apakah ada data di tabel

### **4. Verify Fix**

Test dengan curl:
```bash
# Test endpoint
curl -X GET http://localhost:3000/api/deceased-patients \
  -H "Authorization: Bearer test"
```

## 📋 **RLS Policy Options:**

### **Option A: Allow All (Development)**
```sql
ALTER TABLE deceased_patients DISABLE ROW LEVEL SECURITY;
```

### **Option B: Allow Service Role**
```sql
CREATE POLICY "Allow service role" ON deceased_patients
    FOR ALL USING (auth.role() = 'service_role');
```

### **Option C: Allow Authenticated Users**
```sql
CREATE POLICY "Allow authenticated users" ON deceased_patients
    FOR ALL USING (auth.role() = 'authenticated');
```

## 🎯 **Hasil Setelah Fix:**
- ✅ **RLS policy** tidak memblokir operasi
- ✅ **Data tersimpan** dengan benar
- ✅ **Form berfungsi** normal
- ✅ **CRUD operations** lengkap

## ⚠️ **Security Note:**
Untuk production, gunakan RLS policy yang lebih ketat:
```sql
-- Production policy
CREATE POLICY "Allow authenticated users only" ON deceased_patients
    FOR ALL USING (auth.uid() IS NOT NULL);
```



