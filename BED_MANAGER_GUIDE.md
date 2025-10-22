# 🛏️ Bed Manager - Sistem Pemesanan Bed Seperti Kursi Bioskop

## Overview

Sistem **Bed Manager** adalah fitur baru yang memungkinkan visualisasi dan manajemen bed hemodialisis dengan tampilan seperti pemilihan kursi bioskop. Fitur ini memudahkan staff untuk melihat ketersediaan bed secara real-time dan assign pasien ke bed yang tersedia.

## Fitur Utama

### 1. ✨ Visual Cinema-Style
- **Tampilan grid bed** seperti seat selection di aplikasi bioskop
- **Color-coded status**:
  - 🟢 **Hijau** = Bed tersedia
  - 🔴 **Merah** = Bed terisi
  - 🔵 **Biru** = Bed dipilih
- **Animasi smooth** saat hover dan select
- **Patient initial** ditampilkan di bed yang terisi

### 2. 🎯 Konfigurasi Bed
- **Total:** 12 bed
- **Layout:** 3 ruangan × 4 bed per ruangan
- **Ruangan:**
  - Ruang 1: Bed 1-4
  - Ruang 2: Bed 5-8
  - Ruang 3: Bed 9-12

### 3. 📅 Filter & Real-time
- **Filter tanggal** - Pilih tanggal untuk melihat status bed
- **Filter shift** - 4 shift (Pagi, Siang, Sore, Malam)
- **Auto-refresh** - Update otomatis setiap 10 detik
- **Manual refresh** - Tombol refresh untuk update langsung

### 4. 🔄 Booking System
- **Klik bed kosong** untuk assign pasien
- **Modal popup** dengan dropdown pasien
- **Satu klik assign** langsung membuat jadwal
- **Integrasi schedule** - Otomatis tersinkron dengan jadwal manual

## Cara Menggunakan

### 1. Akses Halaman Bed Manager

```
Dashboard → Navigasi → 🛏️ Bed Manager
```

### 2. Pilih Tanggal dan Shift

1. **Pilih tanggal** dari date picker
2. **Pilih shift** dengan klik tombol shift:
   - 🌸 **Pagi** (07:00-11:00) - Pink
   - 🟣 **Siang** (11:00-15:00) - Purple
   - 🔵 **Sore** (15:00-19:00) - Blue
   - 🟢 **Malam** (19:00-23:00) - Green

### 3. Lihat Status Bed

- **Bed hijau** = Tersedia untuk booking
- **Bed merah** = Sudah terisi pasien
- **Klik bed merah** untuk lihat info pasien yang menggunakan

### 4. Assign Pasien ke Bed

1. **Klik bed hijau** yang tersedia
2. **Modal popup** akan muncul
3. **Pilih pasien** dari dropdown
4. **Klik "✓ Assign Pasien"**
5. **Konfirmasi** - Jadwal otomatis dibuat!

### 5. Monitoring Real-time

- **Stats card** di bawah menampilkan:
  - Total Bed: 12
  - Tersedia: X bed (warna hijau)
  - Terisi: X bed (warna merah)
  - Shift: Nama shift aktif
- **Auto-refresh** setiap 10 detik
- **Perubahan langsung** saat ada booking baru

## Struktur File

### Frontend
```
frontend/src/pages/
  ├── BedManager.jsx      # Komponen utama
  └── BedManager.css      # Styling cinema-style
```

### Backend
```
backend/
  ├── server.js                    # Route /api/beds/status
  └── config/supabase.js           # Fungsi getBedStatus()
```

## API Endpoints

### GET `/api/beds/status`

**Query Parameters:**
- `date` - Format: YYYY-MM-DD
- `shift` - Values: pagi | siang | sore | malam

**Response:**
```json
{
  "date": "2025-10-23",
  "shift": "pagi",
  "beds": [
    {
      "bedNumber": 1,
      "room": 1,
      "status": "available",
      "patient": null,
      "schedule": null
    },
    {
      "bedNumber": 2,
      "room": 1,
      "status": "occupied",
      "patient": {
        "id": "uuid",
        "nama": "John Doe",
        "no_rekam_medis": "RM001"
      },
      "schedule": { ... }
    }
  ],
  "totalBeds": 12,
  "availableBeds": 8,
  "occupiedBeds": 4
}
```

## Logika Bed Assignment

### Matching Schedule ke Bed

```javascript
// Bed number dari mesin_dialisis
mesin_dialisis: "Bed 5"  // → bedNumber: 5

// Room dari ruangan
ruangan: "Ruang 2"  // → room: 2
```

### Shift Time Ranges

```javascript
{
  pagi:  { start: '07:00', end: '11:00' },
  siang: { start: '11:00', end: '15:00' },
  sore:  { start: '15:00', end: '19:00' },
  malam: { start: '19:00', end: '23:00' }
}
```

## Keunggulan Sistem

### 1. 🎨 User Experience
- **Intuitive** - Seperti booking kursi bioskop yang familiar
- **Visual clarity** - Status bed jelas dengan warna
- **Responsive** - Bekerja di desktop dan mobile
- **Fast interaction** - Klik langsung assign

### 2. ⚡ Real-time Sync
- **Auto-refresh** setiap 10 detik
- **Live updates** dari database
- **Conflict prevention** - Tidak bisa double-book
- **Instant feedback** - Alert sukses/gagal langsung

### 3. 🔗 Integration
- **Terintegrasi dengan Schedule** - Data tersinkron
- **Terintegrasi dengan Patients** - Dropdown dari database
- **Audit trail** - Semua booking tercatat di schedule
- **Multi-user safe** - RLS Supabase mencegah konflik

### 4. 📊 Analytics
- **Real-time stats** - Lihat utilization rate
- **Per-shift tracking** - Monitor bed usage per shift
- **Historical data** - Akses via jadwal manual

## Customization

### Ubah Jumlah Bed

Edit `BedManager.jsx`:

```javascript
const totalBeds = 12;        // Total bed
const bedsPerRoom = 4;       // Bed per ruangan
const totalRooms = 3;        // Total ruangan
```

Jangan lupa update juga di `backend/config/supabase.js`:

```javascript
const totalBeds = 12;
const bedsPerRoom = 4;
```

### Ubah Warna Shift

Edit `BedManager.jsx`:

```javascript
const shifts = [
  { id: 'pagi', name: 'Pagi', time: '07:00-11:00', color: '#FF69B4' },  // Pink
  { id: 'siang', name: 'Siang', time: '11:00-15:00', color: '#9b59b6' }, // Purple
  { id: 'sore', name: 'Sore', time: '15:00-19:00', color: '#3498db' },   // Blue
  { id: 'malam', name: 'Malam', time: '19:00-23:00', color: '#1abc9c' }  // Green
];
```

### Ubah Interval Auto-refresh

Edit `BedManager.jsx`:

```javascript
const interval = setInterval(() => {
  fetchBedStatus();
}, 10000);  // 10000 = 10 detik, ubah sesuai kebutuhan
```

## Troubleshooting

### Bed Tidak Muncul

**Solusi:**
1. Check console browser (F12)
2. Pastikan backend running di port 3000
3. Pastikan token authentication valid
4. Refresh halaman

### Status Bed Tidak Update

**Solusi:**
1. Klik tombol "🔄 Refresh" manual
2. Pastikan auto-refresh berjalan (check console log)
3. Restart backend jika perlu

### Gagal Assign Pasien

**Solusi:**
1. Pastikan pilih pasien dari dropdown
2. Check RLS policy di Supabase
3. Check console untuk error detail
4. Pastikan bed belum terisi (refresh dulu)

### Bed Merah Padahal Kosong

**Solusi:**
1. Hapus schedule lama dari halaman "Jadwal Manual"
2. Refresh halaman Bed Manager
3. Check database schedules table

## Best Practices

### 1. 📋 Workflow yang Disarankan

1. **Pagi hari:**
   - Buka Bed Manager
   - Pilih tanggal hari ini
   - Review semua shift untuk hari ini
   - Assign pasien yang belum terjadwal

2. **Sebelum shift dimulai:**
   - Double-check bed assignment
   - Pastikan tidak ada konflik
   - Print jadwal jika diperlukan

3. **Saat shift berjalan:**
   - Monitor real-time status
   - Update jika ada perubahan mendadak
   - Catat di sistem untuk audit

### 2. 🎯 Tips Efisiensi

- Gunakan **Jadwal Otomatis** untuk generate bulk schedules
- Gunakan **Bed Manager** untuk fine-tuning dan emergency changes
- Gunakan **Jadwal Manual** untuk lihat timeline lengkap
- Simpan preferensi pasien (bed favorit) di catatan

### 3. ⚠️ Yang Harus Dihindari

- ❌ Jangan double-click saat assign (tunggu loading)
- ❌ Jangan refresh browser saat sedang assign
- ❌ Jangan assign tanpa memilih pasien
- ❌ Jangan lupa sync dengan tim lain

## Changelog

### Version 1.0.0 (22 Oktober 2025)

✨ **Initial Release:**
- Cinema-style bed visualization
- Real-time status tracking
- Quick patient assignment
- Auto-refresh every 10 seconds
- Integration with schedule system
- 12 beds (3 rooms × 4 beds)
- 4 shift support
- Mobile responsive
- Color-coded status
- Stats dashboard

## Future Enhancements

### Planned Features

1. **Drag & Drop** - Assign dengan drag pasien ke bed
2. **Bed Preferences** - Simpan preferensi bed per pasien
3. **Notification** - Alert saat bed hampir penuh
4. **Export** - Export bed status ke Excel/PDF
5. **History** - Lihat riwayat penggunaan bed
6. **Waitlist** - Queue system untuk pasien menunggu
7. **Color themes** - Pilihan warna tema berbeda
8. **Bed notes** - Catatan khusus per bed (maintenance, dll)

### Improvements

- Optimasi query database
- Caching untuk faster load
- Offline mode support
- PWA untuk mobile app
- Voice commands
- Barcode scanning untuk quick assign

## Support

Jika ada pertanyaan atau butuh bantuan:
1. Check dokumentasi ini terlebih dahulu
2. Lihat console browser untuk error detail
3. Check backend logs
4. Contact system administrator

---

**Happy Bed Management!** 🛏️✨

