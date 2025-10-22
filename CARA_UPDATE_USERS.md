# Cara Update User di Supabase

## 🐛 Error yang Terjadi

```
ERROR: 42601: syntax error at or near ")"
LINE 18: ) VALUES
```

**Penyebab:** Script SQL mencoba insert kolom `id`, `created_at`, `updated_at` yang seharusnya auto-generated oleh Supabase.

## ✅ Solusi

Gunakan file **`update-users-2-admin-fixed.sql`** yang sudah diperbaiki.

---

## 📝 Langkah-langkah Update

### Cara 1: Menggunakan SQL Script (Recommended)

1. **Buka Supabase Dashboard**
   - Login ke https://supabase.com/dashboard
   - Pilih project `AdminRS`

2. **Buka SQL Editor**
   - Klik **"SQL Editor"** di sidebar kiri
   - Klik **"New Query"**

3. **Copy & Paste Script**
   - Buka file `update-users-2-admin-fixed.sql`
   - Copy semua isinya
   - Paste ke SQL Editor

4. **Run Query**
   - Klik tombol **"Run"** (atau tekan F5)
   - Tunggu beberapa detik

5. **Verifikasi**
   - Scroll ke bawah untuk lihat hasil
   - Seharusnya muncul 2 baris: admin1 dan admin2

---

### Cara 2: Manual Insert (Alternative)

Jika cara 1 masih error, lakukan manual:

#### Step 1: Hapus User Lama

```sql
DELETE FROM users;
```

Klik **Run**.

#### Step 2: Insert Admin 1

```sql
INSERT INTO users (
  username,
  email,
  password_hash,
  full_name,
  role,
  shift,
  is_active
) VALUES (
  'admin1',
  'admin1@hemodialisa.com',
  '$2b$10$jAQoDTRwKuK6ORnmpHWAROjSV0.93rsdkjh7YlISUbT/VzpE5Dz.m',
  'Admin Satu',
  'admin',
  'pagi',
  true
);
```

Klik **Run**.

#### Step 3: Insert Admin 2

```sql
INSERT INTO users (
  username,
  email,
  password_hash,
  full_name,
  role,
  shift,
  is_active
) VALUES (
  'admin2',
  'admin2@hemodialisa.com',
  '$2b$10$jAQoDTRwKuK6ORnmpHWAROjSV0.93rsdkjh7YlISUbT/VzpE5Dz.m',
  'Admin Dua',
  'admin',
  'siang',
  true
);
```

Klik **Run**.

#### Step 4: Verifikasi

```sql
SELECT * FROM users ORDER BY username;
```

Klik **Run**.

---

## 🔍 Troubleshooting

### Error: "column does not exist"

**Solusi:** Check schema table `users`. Mungkin nama kolom berbeda.

Cek schema:
```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'users';
```

### Error: "violates foreign key constraint"

**Solusi:** Hapus data terkait dulu.

```sql
-- Hapus sessions dulu
DELETE FROM active_sessions;

-- Hapus audit log
DELETE FROM audit_log;

-- Baru hapus users
DELETE FROM users;
```

### Error: "password_hash too short"

**Problem:** Password hash salah atau terpotong.

**Solusi:** Pastikan hash lengkap:
```
$2b$10$jAQoDTRwKuK6ORnmpHWAROjSV0.93rsdkjh7YlISUbT/VzpE5Dz.m
```

Harus tepat **60 karakter**.

---

## ✅ Verifikasi Berhasil

Setelah berhasil, Anda akan melihat:

```
| id        | username | email                     | full_name  | role  | shift | is_active |
|-----------|----------|---------------------------|------------|-------|-------|-----------|
| uuid-1    | admin1   | admin1@hemodialisa.com    | Admin Satu | admin | pagi  | true      |
| uuid-2    | admin2   | admin2@hemodialisa.com    | Admin Dua  | admin | siang | true      |
```

---

## 🧪 Test Login

Setelah update berhasil:

1. **Refresh halaman login** (F5)
2. **Masukkan credential:**
   - Email: `admin1@hemodialisa.com`
   - Password: `admin123`
3. **Klik "Login ke Sistem"**
4. **Berhasil!** ✅

---

## 📋 Credential

**Admin 1:**
```
Email: admin1@hemodialisa.com
Password: admin123
```

**Admin 2:**
```
Email: admin2@hemodialisa.com
Password: admin123
```

---

## 🔐 Security Note

⚠️ Password `admin123` hanya untuk **development/testing**.

Untuk production:
1. Ganti dengan password yang kuat
2. Generate hash baru dengan `backend/generate-admin-hash.js`
3. Update di database

---

## 📞 Bantuan

Jika masih error:
1. Screenshot error message
2. Check console browser (F12)
3. Check backend logs
4. Verify table schema di Supabase

---

**Good luck!** 🚀

