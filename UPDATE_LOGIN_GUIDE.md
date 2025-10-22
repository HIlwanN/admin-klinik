# Update Login - 2 Admin User

## 📋 Informasi User Baru

Sistem sekarang hanya memiliki **2 admin user** dengan credential berikut:

### User 1
- **Email**: `admin1@hemodialisa.com`
- **Username**: `admin1`
- **Password**: `admin123`
- **Nama**: Admin Satu
- **Role**: admin
- **Shift**: Pagi

### User 2
- **Email**: `admin2@hemodialisa.com`
- **Username**: `admin2`
- **Password**: `admin123`
- **Nama**: Admin Dua
- **Role**: admin
- **Shift**: Siang

---

## 🚀 Cara Update Database Supabase

### Step 1: Buka Supabase Dashboard

1. Login ke [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Pilih project **AdminRS**
3. Klik **SQL Editor** di sidebar kiri

### Step 2: Jalankan SQL Script

1. Klik **New Query**
2. Copy semua isi file `update-users-2-admin.sql`
3. Paste ke SQL Editor
4. Klik **Run** (atau tekan F5)

### Step 3: Verifikasi

Setelah berhasil, Anda akan melihat hasil query:

```
id                                   | username | email                      | full_name   | role  | shift | is_active | created_at
-------------------------------------|----------|----------------------------|-------------|-------|-------|-----------|------------
uuid-random-1                        | admin1   | admin1@hemodialisa.com     | Admin Satu  | admin | pagi  | true      | timestamp
uuid-random-2                        | admin2   | admin2@hemodialisa.com     | Admin Dua   | admin | siang | true      | timestamp
```

---

## 🧪 Cara Test Login

### Option 1: Quick Login

1. **Buka aplikasi** di browser
2. **Klik tombol** "🔐 Login ke Sistem"
3. **Pilih user** dari list:
   - Admin Satu (admin1)
   - Admin Dua (admin2)
4. **Masukkan password**: `admin123`
5. **Klik Login**

### Option 2: Manual Login (jika ada)

1. **Email**: `admin1@hemodialisa.com` atau `admin2@hemodialisa.com`
2. **Password**: `admin123`
3. **Submit**

---

## 📝 Catatan Penting

### Password Hash

Password `admin123` sudah di-hash menggunakan **bcrypt** dengan salt rounds 10:
```
$2b$10$jAQoDTRwKuK6ORnmpHWAROjSV0.93rsdkjh7YlISUbT/VzpE5Dz.m
```

### Security

⚠️ **PENTING**: Password `admin123` hanya untuk **development/testing**.

Untuk **production**, sebaiknya:
1. Ganti password dengan yang lebih kuat
2. Gunakan password yang berbeda untuk setiap user
3. Implementasi password reset feature
4. Tambahkan 2FA (Two-Factor Authentication)

### Generate Password Hash Baru

Jika ingin ganti password di masa depan:

1. **Edit file** `backend/generate-admin-hash.js`:
   ```javascript
   const password = 'PASSWORD_BARU_ANDA';
   ```

2. **Run script**:
   ```bash
   cd backend
   node generate-admin-hash.js
   ```

3. **Copy hash** yang dihasilkan
4. **Update database** dengan hash baru

---

## 🔧 Troubleshooting

### Login Gagal

**Problem**: Password salah

**Solution**:
1. Pastikan password **persis** `admin123` (case-sensitive)
2. Check apakah SQL script sudah dijalankan
3. Verify di Supabase table `users` - check kolom `password_hash`

### User Tidak Muncul di Quick Login

**Problem**: List kosong

**Solution**:
1. Check console browser (F12) untuk error
2. Pastikan backend running di `http://localhost:3000`
3. Check API endpoint `/api/users` - harus return 2 users
4. Restart backend jika perlu

### Error "User not found"

**Problem**: Database belum update

**Solution**:
1. Jalankan SQL script di Supabase
2. Refresh halaman login
3. Clear browser cache

---

## 📊 Database Schema

Table: `users`

| Column        | Type      | Description                    |
|---------------|-----------|--------------------------------|
| id            | UUID      | Primary key (auto-generated)   |
| username      | TEXT      | Username untuk login           |
| email         | TEXT      | Email address (unique)         |
| password_hash | TEXT      | Bcrypt hash dari password      |
| full_name     | TEXT      | Nama lengkap user              |
| role          | TEXT      | Role: admin, perawat, dll      |
| shift         | TEXT      | Shift kerja: pagi, siang, dll  |
| is_active     | BOOLEAN   | Status aktif user              |
| created_at    | TIMESTAMP | Waktu user dibuat              |
| updated_at    | TIMESTAMP | Waktu terakhir update          |

---

## 🎯 Best Practices

### 1. User Management

- ✅ Gunakan email sebagai primary identifier
- ✅ Username harus unique
- ✅ Password selalu di-hash (never store plain text)
- ✅ Implement role-based access control (RBAC)

### 2. Authentication

- ✅ Validate password strength
- ✅ Implement rate limiting (prevent brute force)
- ✅ Use JWT tokens dengan expiry
- ✅ Refresh tokens untuk long sessions

### 3. Security

- ✅ HTTPS only in production
- ✅ Secure password reset flow
- ✅ Audit log untuk login attempts
- ✅ Multi-factor authentication (MFA)

---

## 📂 Files Modified

- ✅ `update-users-2-admin.sql` - SQL script untuk update users
- ✅ `backend/generate-admin-hash.js` - Script generate password hash
- ✅ `UPDATE_LOGIN_GUIDE.md` - Dokumentasi ini

---

## 📞 Support

Jika ada masalah atau pertanyaan:

1. Check dokumentasi ini terlebih dahulu
2. Check console browser untuk error
3. Check backend logs
4. Verify database di Supabase

---

**Last Updated**: 22 Oktober 2025

**Status**: ✅ Ready untuk digunakan

