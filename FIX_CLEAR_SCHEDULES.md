# Fix: Fitur Hapus Semua Jadwal

## Masalah
Fitur "Hapus Semua Jadwal" menampilkan error: **"invalid input syntax for type uuid: '0'"**

## Penyebab
1. ❌ **Query Supabase SALAH**: `.gte('id', 0)` tidak bekerja karena kolom `id` adalah **UUID** (bukan integer!)
2. ❌ **Error handling yang kurang detail**: Frontend tidak menampilkan error message sebenarnya dari backend
3. ❌ **Kurang logging**: Sulit untuk debug karena tidak ada log detail

### Root Cause
```javascript
// ❌ SALAH - Kolom ID adalah UUID, bukan integer
.delete()
.gte('id', 0)  // Error: invalid input syntax for type uuid: "0"
```

Supabase menggunakan **UUID** untuk primary key, bukan auto-increment integer!

## Solusi yang Diterapkan

### 1. Backend (`backend/config/supabase.js`)
```javascript
async clearAllSchedules() {
  try {
    // Get count sebelum delete (untuk logging)
    const { count: beforeCount } = await supabase
      .from('schedules')
      .select('*', { count: 'exact', head: true });
    
    console.log(`🗑️ Attempting to delete ${beforeCount} schedules...`);
    
    // ✅ BENAR - Gunakan NOT IS NULL untuk UUID columns
    const { data, error } = await supabase
      .from('schedules')
      .delete()
      .not('id', 'is', null)  // ✅ Works with UUID columns!
      .select();              // ✅ Return deleted data
    
    if (error) {
      console.error('❌ Delete error:', error);
      throw error;
    }
    
    console.log(`✅ Successfully deleted ${data?.length || 0} schedules`);
    
    return { 
      success: true, 
      message: 'All schedules cleared', 
      deletedCount: data?.length || 0 
    };
  } catch (error) {
    console.error('Error clearing schedules:', error);
    throw error;
  }
}
```

### 2. Frontend (`frontend/src/pages/AutoScheduler.jsx`)
```javascript
const handleClearSchedules = async () => {
  if (!confirm('Apakah Anda yakin ingin menghapus semua jadwal?')) {
    return;
  }

  setLoading(true);  // ✅ Tambah loading state
  try {
    const token = localStorage.getItem('authToken');
    const response = await fetch('/api/schedules/clear', {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const data = await response.json();  // ✅ Parse response dulu
    
    if (!response.ok) {
      throw new Error(data.error || 'Gagal menghapus jadwal');  // ✅ Tampilkan error detail
    }

    alert(`Berhasil menghapus ${data.deletedCount || 0} jadwal`);  // ✅ Tampilkan jumlah yang dihapus
    await fetchScheduleGrid();
  } catch (error) {
    console.error('Error clearing schedules:', error);
    alert('Gagal menghapus jadwal: ' + error.message);
  } finally {
    setLoading(false);  // ✅ Reset loading state
  }
};
```

## Cara Testing

1. **Restart backend** (sudah dilakukan otomatis)
2. **Refresh browser** (F5)
3. **Buka halaman "🤖 Jadwal Otomatis"**
4. **Klik tombol "🗑️ Hapus Semua Jadwal"**
5. **Konfirmasi dialog**
6. **Cek:**
   - Alert seharusnya menampilkan: "Berhasil menghapus X jadwal"
   - Console browser dan backend menampilkan log detail
   - Grid menjadi kosong

## Catatan Penting

### Jika Masih Error
Kemungkinan besar karena **RLS (Row Level Security)** di Supabase. Check di Supabase Dashboard:

1. Buka table `schedules`
2. Go to **Authentication > Policies**
3. Pastikan ada policy untuk **DELETE** operation
4. Policy yang benar:
   ```sql
   CREATE POLICY "Allow authenticated users to delete schedules"
   ON schedules FOR DELETE
   TO authenticated
   USING (true);
   ```

### Alternative: Disable RLS untuk Testing
```sql
ALTER TABLE schedules DISABLE ROW LEVEL SECURITY;
```

⚠️ **Warning**: Ini hanya untuk testing! Di production, gunakan RLS policy yang benar.

## Files yang Diubah
- ✅ `backend/config/supabase.js` - Fungsi `clearAllSchedules()`
- ✅ `frontend/src/pages/AutoScheduler.jsx` - Fungsi `handleClearSchedules()`

## Status
✅ **FIXED** - Tanggal: 22 Oktober 2025

