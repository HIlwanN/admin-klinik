# Fitur: Bed Kosong Setelah Jadwal Completed

## 📋 Overview

Sistem sekarang memiliki fitur untuk **menandai jadwal sebagai selesai (completed)**. Setelah jadwal ditandai completed, **bed akan otomatis kosong** dan tersedia untuk pasien lain.

---

## ✨ Fitur Baru

### 1. **Auto-Hide Completed Schedules**
- Bed Manager hanya menampilkan jadwal dengan status `scheduled` atau `in-progress`
- Jadwal dengan status `completed` atau `cancelled` **tidak ditampilkan**
- Bed otomatis hijau (available) setelah jadwal completed

### 2. **Mark as Completed**
- Klik bed yang terisi (merah) → muncul konfirmasi
- Klik **OK** → jadwal selesai, bed kosong
- Klik **Cancel** → tutup dialog

### 3. **Status Jadwal**
Ada 4 status jadwal:
- `scheduled` - Dijadwalkan (default saat baru dibuat)
- `in-progress` - Sedang berlangsung
- `completed` - Selesai ✅
- `cancelled` - Dibatalkan

---

## 🎯 Cara Menggunakan

### Skenario 1: Pasien Selesai Hemodialisa

1. **Buka Bed Manager**
2. **Pilih tanggal & shift** yang sesuai
3. **Klik bed merah** (yang ada pasien)
4. **Dialog muncul:**
   ```
   Bed 1 - Ruang 1
   Pasien: John Doe
   No. RM: RM001
   
   Klik OK untuk SELESAI (complete), atau CANCEL untuk tutup.
   ```
5. **Klik OK**
6. **Bed berubah hijau** (tersedia) ✅
7. **Alert muncul:** "✅ Jadwal selesai! Bed sekarang tersedia."

### Skenario 2: Assign Pasien Baru ke Bed yang Baru Kosong

1. **Setelah bed kosong**, klik bed hijau
2. **Pilih pasien baru**
3. **Assign** → bed terisi lagi

---

## 🔧 Technical Details

### Backend Changes

#### 1. New Function: `updateScheduleStatus()`
```javascript
// File: backend/config/supabase.js
async updateScheduleStatus(scheduleId, status) {
  // Update status di database
  // Log perubahan
  // Return updated schedule
}
```

#### 2. New API Endpoint
```
PATCH /api/schedules/:id/status
Body: { status: 'completed' }
```

#### 3. Updated Query: `getBedStatus()`
```javascript
// Hanya ambil jadwal aktif
.in('status', ['scheduled', 'in-progress'])
// Exclude 'completed' dan 'cancelled'
```

### Frontend Changes

#### 1. New Function: `handleCompleteSchedule()`
```javascript
// File: frontend/src/pages/BedManager.jsx
const handleCompleteSchedule = async (scheduleId) => {
  // Call API untuk update status
  // Refresh bed status
  // Show success alert
}
```

#### 2. Updated: `handleBedClick()`
```javascript
// Klik bed terisi → show dialog dengan opsi complete
// Klik OK → mark as completed
// Klik Cancel → tutup dialog
```

---

## 📊 Database Schema

### Table: `schedules`

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| patient_id | UUID | Foreign key ke patients |
| tanggal | DATE | Tanggal jadwal |
| status | TEXT | **Status jadwal** (scheduled/in-progress/completed/cancelled) |
| mesin_dialisis | TEXT | Bed number (e.g., "Bed 1") |
| ruangan | TEXT | Room number (e.g., "Ruang 1") |

### Status Flow

```
scheduled → in-progress → completed
            ↓
         cancelled
```

---

## 🎨 UI/UX Flow

### Before Complete
```
┌──────────┐
│ Bed 1    │
│   🔴     │  ← Merah (occupied)
│   J      │  ← Initial pasien
└──────────┘
```

**Klik bed** → Dialog:
```
┌────────────────────────────┐
│ Bed 1 - Ruang 1           │
│ Pasien: John Doe          │
│ No. RM: RM001             │
│                           │
│ Klik OK untuk SELESAI     │
│                           │
│   [OK]      [Cancel]      │
└────────────────────────────┘
```

**Klik OK** → Alert:
```
┌────────────────────────────┐
│ ✅ Jadwal selesai!         │
│ Bed sekarang tersedia.    │
│          [OK]             │
└────────────────────────────┘
```

### After Complete
```
┌──────────┐
│ Bed 1    │
│   🟢     │  ← Hijau (available)
│          │  ← Kosong
└──────────┘
```

---

## 🔍 Monitoring & Tracking

### View Completed Schedules

Di **Jadwal Manual** atau **Dashboard**, Anda masih bisa lihat history jadwal completed.

Query untuk lihat jadwal completed:
```sql
SELECT * FROM schedules 
WHERE status = 'completed' 
ORDER BY tanggal DESC, waktu_mulai DESC;
```

### Statistics

Di Dashboard, Anda bisa track:
- Total jadwal hari ini
- Jadwal completed
- Jadwal in-progress
- Bed utilization rate

---

## 🎯 Best Practices

### 1. Mark as Completed Tepat Waktu
- ✅ Mark completed **setelah pasien selesai** hemodialisa
- ✅ Jangan mark terlalu cepat (pasien masih treatment)
- ✅ Jangan mark terlalu lambat (bed tidak available)

### 2. Workflow yang Disarankan

**Pagi:**
1. Review jadwal hari ini
2. Assign pasien ke bed

**Selama Shift:**
1. Monitor bed real-time
2. Mark completed saat pasien selesai
3. Assign pasien baru ke bed yang kosong

**Akhir Shift:**
1. Pastikan semua jadwal yang selesai sudah di-mark
2. Bed kosong untuk shift berikutnya

### 3. Communication
- Koordinasi dengan perawat
- Update status secara real-time
- Dokumentasi di catatan pasien

---

## 🐛 Troubleshooting

### Bed Tidak Kosong Setelah Mark Completed

**Problem:** Bed masih merah padahal sudah mark completed

**Solution:**
1. Klik **🔄 Refresh** button
2. Atau tunggu auto-refresh (10 detik)
3. Check console browser (F12) untuk error
4. Verify status di database

### Error "Gagal update status"

**Problem:** Error saat mark completed

**Solution:**
1. Check backend running di port 3000
2. Check authentication token valid
3. Check console backend untuk error detail
4. Verify schedule ID exists di database

### Bed Completed Masih Muncul

**Problem:** Bed completed masih ditampilkan

**Solution:**
1. Clear browser cache
2. Restart backend
3. Check query di `getBedStatus()` - harus exclude completed
4. Verify status di database sudah berubah

---

## 📝 Future Enhancements

### Planned Features

1. **In-Progress Status**
   - Button untuk mark as "in-progress"
   - Visual indicator (warna kuning)
   - Track start time

2. **Completion Notes**
   - Add notes saat mark completed
   - Track completion time
   - Nurse signature

3. **Auto-Complete**
   - Auto mark completed setelah waktu selesai
   - Notification untuk confirm
   - Grace period (15 menit)

4. **History View**
   - View all completed schedules
   - Filter by date/patient
   - Export to PDF/Excel

5. **Statistics Dashboard**
   - Completion rate per shift
   - Average treatment time
   - Bed utilization chart

---

## 📚 Related Documentation

- `BED_MANAGER_GUIDE.md` - Panduan Bed Manager
- `backend/config/supabase.js` - Database functions
- `frontend/src/pages/BedManager.jsx` - UI component

---

## ✅ Testing Checklist

- [ ] Mark jadwal as completed
- [ ] Bed berubah hijau (available)
- [ ] Assign pasien baru ke bed yang baru kosong
- [ ] Multiple beds completed di shift yang sama
- [ ] Refresh tetap show status yang benar
- [ ] Auto-refresh (10 detik) update status
- [ ] Error handling works properly

---

## 📞 Support

Jika ada pertanyaan atau issue:
1. Check dokumentasi ini
2. Check console browser (F12)
3. Check backend logs
4. Verify database status

---

**Last Updated:** 22 Oktober 2025

**Status:** ✅ Ready for Production

**Version:** 1.1.0

