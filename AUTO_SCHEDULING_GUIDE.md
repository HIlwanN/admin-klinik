# 🤖 Panduan Sistem Penjadwalan Otomatis

## 📋 Overview

Sistem penjadwalan otomatis ini dirancang untuk **2 device** yang dapat saling berkomunikasi secara real-time, menggantikan sistem manual dengan automated scheduling untuk pasien hemodialisis.

## 🎯 Fitur Utama

### 1. **Auto-Scheduling**
- Penjadwalan otomatis berdasarkan:
  - Tanggal mulai dan tanggal selesai
  - Shift (Pagi, Siang, Sore, Malam)
  - Maksimal pasien per shift
  - Hari kerja (Senin-Sabtu, skip Minggu)

### 2. **Real-Time Sync (2 Devices)**
- Auto-refresh setiap 10 detik
- Perubahan di device 1 langsung terlihat di device 2
- Tidak perlu refresh manual
- Indikator sync aktif

### 3. **Grid View**
- Tampilan seperti tabel manual (seperti gambar yang Anda berikan)
- 6 hari (Senin-Sabtu)
- 4 shift per hari
- Warna berbeda untuk setiap shift

## 🏥 Konfigurasi Shift

| Shift | Waktu | Warna |
|-------|-------|-------|
| PAGI | 07:00 - 11:00 | Merah Muda (#FFE5E5) |
| SIANG | 11:00 - 15:00 | Kuning (#FFFF00) |
| SORE | 15:00 - 19:00 | Hijau Muda (#90EE90) |
| MALAM | 19:00 - 23:00 | Biru Muda (#87CEEB) |

## 🚀 Cara Menggunakan

### Step 1: Akses Halaman Auto-Scheduler
1. Login ke sistem
2. Klik menu **"🤖 Jadwal Otomatis"** di navigation bar
3. Halaman auto-scheduler akan terbuka

### Step 2: Set Parameter Penjadwalan
1. **Tanggal Mulai**: Pilih tanggal mulai penjadwalan
2. **Tanggal Selesai**: Pilih tanggal akhir penjadwalan
3. **Shift**: Pilih shift tertentu atau "Semua Shift"
4. **Max Pasien per Shift**: Tentukan berapa pasien maksimal per shift (1-10)

### Step 3: Generate Jadwal
1. Klik tombol **"🤖 Buat Jadwal Otomatis"**
2. Sistem akan:
   - Mengambil semua data pasien
   - Mendistribusikan pasien ke shift secara otomatis
   - Mengassign ruangan dan mesin dialisis
   - Membuat jadwal untuk semua hari kerja (skip Minggu)
3. Notifikasi sukses akan muncul dengan jumlah jadwal yang dibuat

### Step 4: Review Jadwal
- Jadwal akan ditampilkan dalam grid view
- Setiap sel menunjukkan:
  - Nama pasien
  - No. Rekam Medis
- Warna background menunjukkan shift

### Step 5: Hapus Jadwal (Jika Perlu)
- Klik tombol **"🗑️ Hapus Semua Jadwal"**
- Konfirmasi penghapusan
- Semua jadwal akan dihapus
- Buat jadwal baru dengan parameter yang berbeda

## 🔄 Real-Time Sync (2 Devices)

### Bagaimana Cara Kerja Sync?

1. **Auto-Refresh**
   ```javascript
   // Refresh setiap 10 detik
   setInterval(() => {
     fetchScheduleGrid();
   }, 10000);
   ```

2. **Device 1 membuat jadwal**
   - User di device 1 klik "Buat Jadwal Otomatis"
   - Jadwal tersimpan ke database
   - Grid di device 1 langsung update

3. **Device 2 auto-sync**
   - Dalam 10 detik, device 2 auto-refresh
   - Mengambil data terbaru dari database
   - Grid di device 2 langsung update
   - Tidak perlu refresh manual

### Indikator Sync
- **🔄 Auto-sync aktif** - Badge hijau di header
- Animasi pulse untuk menunjukkan sync berjalan

## 📊 Logika Auto-Assign

### 1. Pengambilan Data Pasien
```javascript
const patients = await db.getPatients();
```

### 2. Loop Tanggal
```javascript
for (let date = startDate; date <= endDate; date++) {
  // Skip Sunday (day 0)
  if (date.getDay() === 0) continue;
  
  // Process each shift
}
```

### 3. Distribusi Pasien
- Pasien didistribusikan secara round-robin
- Setiap shift mendapat max N pasien (sesuai parameter)
- Jika habis, mulai lagi dari pasien pertama

### 4. Auto-Assign Resources
```javascript
ruangan: `Ruang ${Math.floor(i / 2) + 1}`
mesin_dialisis: `Mesin ${(i % 3) + 1}`
perawat: `Perawat ${(i % 5) + 1}`
```

## 🎨 Tampilan Grid

### Format Grid
```
┌──────────┬─────────┬─────────┬─────────┬─────────┬─────────┬─────────┐
│  SHIFT   │  SENIN  │  SELASA │  RABU   │  KAMIS  │  JUMAT  │  SABTU  │
├──────────┼─────────┼─────────┼─────────┼─────────┼─────────┼─────────┤
│   PAGI   │ Patient │ Patient │ Patient │ Patient │ Patient │ Patient │
│ 07-11    │   List  │   List  │   List  │   List  │   List  │   List  │
├──────────┼─────────┼─────────┼─────────┼─────────┼─────────┼─────────┤
│  SIANG   │ Patient │ Patient │ Patient │ Patient │ Patient │ Patient │
│ 11-15    │   List  │   List  │   List  │   List  │   List  │   List  │
├──────────┼─────────┼─────────┼─────────┼─────────┼─────────┼─────────┤
│   SORE   │ Patient │ Patient │ Patient │ Patient │ Patient │ Patient │
│ 15-19    │   List  │   List  │   List  │   List  │   List  │   List  │
├──────────┼─────────┼─────────┼─────────┼─────────┼─────────┼─────────┤
│  MALAM   │ Patient │ Patient │ Patient │ Patient │ Patient │ Patient │
│ 19-23    │   List  │   List  │   List  │   List  │   List  │   List  │
└──────────┴─────────┴─────────┴─────────┴─────────┴─────────┴─────────┘
```

## 🔧 API Endpoints

### 1. Get Schedule Grid
```
GET /api/schedules/grid
Authorization: Bearer <token>

Response:
{
  "Senin-pagi": [
    {
      "patient_name": "John Doe",
      "no_rekam_medis": "RM001",
      "waktu_mulai": "07:00",
      "waktu_selesai": "11:00",
      "ruangan": "Ruang 1",
      "mesin_dialisis": "Mesin 1"
    }
  ],
  "Senin-siang": [...],
  ...
}
```

### 2. Auto-Generate Schedules
```
POST /api/schedules/auto-generate
Authorization: Bearer <token>
Content-Type: application/json

Body:
{
  "startDate": "2024-01-01",
  "endDate": "2024-01-31",
  "shift": "all",
  "maxPatientsPerShift": 3
}

Response:
{
  "success": true,
  "totalSchedules": 240,
  "schedules": [...]
}
```

### 3. Clear All Schedules
```
DELETE /api/schedules/clear
Authorization: Bearer <token>

Response:
{
  "success": true,
  "message": "Deleted 240 schedules"
}
```

## 📱 Setup 2 Devices

### Device 1 (Komputer 1)
1. Buka browser (Chrome/Edge/Firefox)
2. Akses: `http://localhost:5173` (development)
3. Login dengan akun admin
4. Buat jadwal atau edit data

### Device 2 (Komputer 2)
1. Buka browser di komputer yang sama atau komputer lain di jaringan lokal
2. Akses: `http://localhost:5173` (jika sama network)
3. Login dengan akun admin kedua
4. Lihat perubahan real-time dari device 1

### Untuk Production
- Deploy backend ke server (Heroku, Railway, VPS, dll)
- Deploy frontend ke server atau hosting
- Kedua device akses melalui URL yang sama
- Contoh: `https://adminklinik.com`

## 🎯 Best Practices

### 1. Persiapan Data
- Pastikan ada data pasien sebelum auto-schedule
- Minimal 10+ pasien untuk hasil yang baik

### 2. Parameter Scheduling
- **Tanggal**: Pilih range yang reasonable (1 minggu - 1 bulan)
- **Max Pasien**: Sesuaikan dengan kapasitas ruang dialisis
- **Shift**: Pilih shift tertentu jika ada preferensi waktu

### 3. Review dan Adjust
- Review jadwal yang di-generate
- Jika tidak sesuai, hapus dan buat ulang dengan parameter berbeda
- Bisa juga edit manual di halaman "Jadwal Manual"

### 4. Real-Time Collaboration
- Device 1: Admin utama, buat dan manage jadwal
- Device 2: Admin pendukung, monitor dan review
- Kedua device bisa edit, akan sync otomatis

## 🚨 Troubleshooting

### Jadwal tidak muncul
- Cek apakah ada data pasien
- Cek koneksi internet/network
- Refresh halaman (F5)

### Sync tidak berjalan
- Pastikan auto-refresh aktif (badge hijau)
- Cek console browser untuk error
- Refresh halaman

### Error saat generate
- Cek parameter (tanggal valid, max pasien > 0)
- Pastikan ada data pasien
- Cek log di backend console

## 📈 Keuntungan vs Manual

| Fitur | Manual | Otomatis |
|-------|--------|----------|
| Waktu setup | 1-2 jam | 1-2 menit |
| Error manusia | Tinggi | Rendah |
| Konsistensi | Bervariasi | Konsisten |
| Real-time sync | Tidak | Ya |
| Mudah reschedule | Sulit | Mudah |
| Multi-device | Sulit | Ya |

## 🎉 Kesimpulan

Sistem auto-scheduling ini:
- ✅ Menghemat waktu (dari jam menjadi menit)
- ✅ Mengurangi error manusia
- ✅ Support 2 device real-time
- ✅ Tampilan grid sesuai dengan format manual
- ✅ Mudah digunakan dan di-customize

---

**Catatan**: Sistem ini dirancang khusus untuk 2 device dengan real-time sync. Jika butuh lebih banyak device atau fitur tambahan, bisa dikembangkan lebih lanjut.

