# 🔧 Fix CRUD Error - Supabase Query Syntax

## ❌ **Error Yang Terjadi**

```
Gagal menyimpan data pasien: "failed to parse select parameter (*)"
(line 1, column 3)
```

## 🔍 **Penyebab Error**

Ada **koma berlebih** di query Supabase `.select()`:

```javascript
// ❌ SALAH - Ada koma setelah *
.select(`
  *,
`)

// ❌ SALAH - Ada koma di akhir
.select(`
  *,
  patient:patients(nama, no_rekam_medis),
`)
```

Supabase **tidak bisa parse** syntax seperti ini karena koma trailing tidak valid.

## ✅ **Perbaikan**

File: `backend/config/supabase.js`

### **1. getPatients() - Fixed**
```javascript
// Sebelum:
.select(`
  *,
`)

// Sesudah:
.select('*')
```

### **2. getPatient() - Fixed**
```javascript
// Sebelum:
.select(`
  *,
`)

// Sesudah:
.select('*')
```

### **3. createPatient() - Fixed**
```javascript
// Sebelum:
.select(`
  *,
`)

// Sesudah:
.select('*')
```

### **4. updatePatient() - Fixed**
```javascript
// Sebelum:
.select(`
  *,
`)

// Sesudah:
.select('*')
```

### **5. createSchedule() - Fixed**
```javascript
// Sebelum:
.select(`
  *,
  patient:patients(nama, no_rekam_medis),
`)

// Sesudah:
.select(`
  *,
  patient:patients(nama, no_rekam_medis)
`)
```

### **6. updateSchedule() - Fixed**
```javascript
// Sebelum:
.select(`
  *,
  patient:patients(nama, no_rekam_medis),
`)

// Sesudah:
.select(`
  *,
  patient:patients(nama, no_rekam_medis)
`)
```

## 🚀 **Cara Test Setelah Fix**

### **1. Restart Backend**
```bash
# Stop backend (Ctrl+C)
# Start lagi
cd backend
npm start
```

### **2. Test Tambah Pasien**
```
1. Buka: http://localhost:5173
2. Login
3. Klik "Data Pasien"
4. Klik "+ Tambah Pasien"
5. Isi form:
   - Nama: Test Pasien
   - No. RM: RM999
   - Tanggal Lahir: 1990-01-01
   - Jenis Kelamin: Laki-laki
   - (isi yang lain)
6. Klik "Simpan"
```

**Expected:**
- ✅ Alert: "Data pasien berhasil disimpan"
- ✅ Pasien muncul di tabel
- ✅ Tidak ada error

### **3. Test Edit Pasien**
```
1. Klik tombol "Edit" di pasien
2. Ubah data
3. Klik "Update"
```

**Expected:**
- ✅ Data berubah
- ✅ Tidak ada error

### **4. Test Tambah Jadwal**
```
1. Klik "Jadwal Manual"
2. Klik "+ Tambah Jadwal"
3. Pilih pasien
4. Isi data jadwal
5. Klik "Simpan"
```

**Expected:**
- ✅ Jadwal tersimpan
- ✅ Nama pasien muncul
- ✅ Tidak ada error

## 📊 **Test di Supabase Dashboard**

```
1. Buka Supabase Dashboard
2. Klik "Table Editor"
3. Pilih tabel "patients"
4. Lihat data baru ada
```

## 🎯 **Summary**

### **Root Cause:**
- Koma trailing di Supabase `.select()` query
- Syntax: `*,` atau `field,` di akhir tidak valid

### **Solution:**
- Hapus koma trailing
- Gunakan `.select('*')` untuk single field
- Gunakan `.select('*, field1, field2')` tanpa koma di akhir

### **Files Changed:**
- `backend/config/supabase.js`

### **Functions Fixed:**
- ✅ getPatients()
- ✅ getPatient()
- ✅ createPatient()
- ✅ updatePatient()
- ✅ createSchedule()
- ✅ updateSchedule()

## ✅ **Checklist Setelah Fix**

```bash
✅ Backend restarted
✅ Tambah pasien works
✅ Edit pasien works
✅ Hapus pasien works
✅ Tambah jadwal works
✅ Nama pasien muncul di jadwal
✅ No error di console
```

---

**Status: ✅ FIXED!**

Sekarang CRUD operations berfungsi normal dengan Supabase!

