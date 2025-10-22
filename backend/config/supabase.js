import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'your-anon-key';

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

// Database helper functions
export const db = {
  // ==================== PATIENTS ====================
  
  async getPatients() {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching patients:', error);
      throw error;
    }
    return data;
  },

  async getPatient(id) {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching patient:', error);
      throw error;
    }
    return data;
  },

  async createPatient(patientData, userId) {
    const { data, error } = await supabase
      .from('patients')
      .insert({
        ...patientData,
        created_by: userId,
        updated_by: userId
      })
      .select('*')
      .single();
    
    if (error) {
      console.error('Error creating patient:', error);
      throw error;
    }
    return data;
  },

  async updatePatient(patientId, patientData, userId) {
    const { data, error } = await supabase
      .from('patients')
      .update({
        ...patientData,
        updated_by: userId,
        updated_at: new Date().toISOString()
      })
      .eq('id', patientId)
      .select('*')
      .single();
    
    if (error) {
      console.error('Error updating patient:', error);
      throw error;
    }
    return data;
  },

  async deletePatient(patientId) {
    const { error } = await supabase
      .from('patients')
      .delete()
      .eq('id', patientId);
    
    if (error) {
      console.error('Error deleting patient:', error);
      throw error;
    }
    return { success: true };
  },

  // ==================== SCHEDULES ====================

  async getSchedules() {
    const { data, error } = await supabase
      .from('schedules')
      .select(`
        *,
        patient:patients(nama, no_rekam_medis)
      `)
      .order('tanggal', { ascending: false });
    
    if (error) {
      console.error('Error fetching schedules:', error);
      throw error;
    }
    return data;
  },

  async getSchedule(id) {
    const { data, error } = await supabase
      .from('schedules')
      .select(`
        *,
        patient:patients(nama, no_rekam_medis)
      `)
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching schedule:', error);
      throw error;
    }
    return data;
  },

  async getSchedulesByPatient(patientId) {
    const { data, error } = await supabase
      .from('schedules')
      .select(`
        *,
        patient:patients(nama, no_rekam_medis)
      `)
      .eq('patient_id', patientId)
      .order('tanggal', { ascending: false });
    
    if (error) {
      console.error('Error fetching patient schedules:', error);
      throw error;
    }
    return data;
  },

  async createSchedule(scheduleData, userId) {
    const { data, error } = await supabase
      .from('schedules')
      .insert({
        ...scheduleData,
        created_by: userId,
        updated_by: userId
      })
      .select(`
        *,
        patient:patients(nama, no_rekam_medis)
      `)
      .single();
    
    if (error) {
      console.error('Error creating schedule:', error);
      throw error;
    }
    return data;
  },

  async updateSchedule(scheduleId, scheduleData, userId) {
    const { data, error } = await supabase
      .from('schedules')
      .update({
        ...scheduleData,
        updated_by: userId,
        updated_at: new Date().toISOString()
      })
      .eq('id', scheduleId)
      .select(`
        *,
        patient:patients(nama, no_rekam_medis)
      `)
      .single();
    
    if (error) {
      console.error('Error updating schedule:', error);
      throw error;
    }
    return data;
  },

  async deleteSchedule(scheduleId) {
    const { error } = await supabase
      .from('schedules')
      .delete()
      .eq('id', scheduleId);
    
    if (error) {
      console.error('Error deleting schedule:', error);
      throw error;
    }
    return { success: true };
  },

  // ==================== AUTO-SCHEDULER FUNCTIONS ====================

  async getScheduleGrid() {
    try {
      const { data: schedules, error } = await supabase
        .from('schedules')
        .select(`
          *,
          patient:patients(nama, no_rekam_medis)
        `)
        .order('tanggal', { ascending: false });
      
      if (error) throw error;
      
      console.log(`📊 Total schedules from DB: ${schedules?.length || 0}`);
      
      // Organize schedules into a grid format
      const grid = {};
      const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
      
      schedules.forEach(schedule => {
        // Parse date safely to avoid timezone issues
        const [year, month, day] = schedule.tanggal.split('-').map(Number);
        const date = new Date(year, month - 1, day); // month is 0-indexed
        const dayIndex = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
        
        // Skip Sunday (dayIndex 0)
        if (dayIndex === 0) {
          console.log(`  ⚠️ Skipping Sunday schedule for ${schedule.patient?.nama}`);
          return;
        }
        
        // Map to Indonesian day names: 1=Senin, 2=Selasa, ..., 6=Sabtu
        const dayName = days[dayIndex - 1];
        
        // Determine shift based on waktu_mulai
        const hour = parseInt(schedule.waktu_mulai.split(':')[0]);
        let shift = 'pagi';
        if (hour >= 11 && hour < 15) shift = 'siang';
        else if (hour >= 15 && hour < 19) shift = 'sore';
        else if (hour >= 19) shift = 'malam';
        
        const key = `${dayName}-${shift}`;
        
        if (!grid[key]) {
          grid[key] = [];
        }
        
        grid[key].push({
          patient_name: schedule.patient?.nama || 'Unknown',
          no_rekam_medis: schedule.patient?.no_rekam_medis || '',
          waktu_mulai: schedule.waktu_mulai,
          waktu_selesai: schedule.waktu_selesai,
          ruangan: schedule.ruangan,
          mesin_dialisis: schedule.mesin_dialisis
        });
        
        console.log(`  ✅ Added to ${key}: ${schedule.patient?.nama} (date: ${schedule.tanggal}, dayIndex: ${dayIndex}, dayName: ${dayName})`);
      });
      
      console.log(`📋 Grid keys created:`, Object.keys(grid));
      console.log(`📊 Total slots filled:`, Object.values(grid).reduce((sum, arr) => sum + arr.length, 0));
      
      return grid;
    } catch (error) {
      console.error('Error getting schedule grid:', error);
      throw error;
    }
  },

  async autoGenerateSchedules(params) {
    try {
      const { startDate, endDate, shift, maxPatientsPerShift } = params;
      
      // Get all patients
      const { data: patients, error: patientsError } = await supabase
        .from('patients')
        .select('*')
        .order('created_at', { ascending: true });
      
      if (patientsError) throw patientsError;
      
      if (!patients || patients.length === 0) {
        throw new Error('No patients available for scheduling');
      }
      
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      const shifts = [
        { id: 'pagi', waktu_mulai: '07:00', waktu_selesai: '11:00' },
        { id: 'siang', waktu_mulai: '11:00', waktu_selesai: '15:00' },
        { id: 'sore', waktu_mulai: '15:00', waktu_selesai: '19:00' },
        { id: 'malam', waktu_mulai: '19:00', waktu_selesai: '23:00' }
      ];
      
      const shiftsToUse = shift === 'all' 
        ? shifts 
        : shifts.filter(s => s.id === shift);
      
      const schedules = [];
      let patientIndex = 0;
      
      // Loop through dates
      for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
        const dayOfWeek = date.getDay();
        
        // Skip Sundays (0 = Sunday)
        if (dayOfWeek === 0) continue;
        
        const dateStr = date.toISOString().split('T')[0];
        
        // Loop through shifts
        for (const shiftInfo of shiftsToUse) {
          // Assign patients to this shift
          for (let i = 0; i < maxPatientsPerShift && patientIndex < patients.length; i++) {
            const patient = patients[patientIndex];
            
            schedules.push({
              patient_id: patient.id,
              tanggal: dateStr,
              waktu_mulai: shiftInfo.waktu_mulai,
              waktu_selesai: shiftInfo.waktu_selesai,
              ruangan: `Ruang ${Math.floor(i / 2) + 1}`,
              mesin_dialisis: `Mesin ${(i % 3) + 1}`,
              perawat: `Perawat ${(i % 5) + 1}`,
              status: 'scheduled',
              catatan: 'Auto-generated schedule'
            });
            
            patientIndex++;
          }
          
          // Reset to beginning if we've scheduled all patients
          if (patientIndex >= patients.length) {
            patientIndex = 0;
          }
        }
      }
      
      // Batch insert schedules
      const { data: createdSchedules, error: insertError } = await supabase
        .from('schedules')
        .insert(schedules)
        .select();
      
      if (insertError) throw insertError;
      
      return {
        success: true,
        totalSchedules: createdSchedules.length,
        schedules: createdSchedules
      };
    } catch (error) {
      console.error('Error auto-generating schedules:', error);
      throw error;
    }
  },

  async clearAllSchedules() {
    try {
      // First, get count of schedules to delete
      const { count: beforeCount } = await supabase
        .from('schedules')
        .select('*', { count: 'exact', head: true });
      
      console.log(`🗑️ Attempting to delete ${beforeCount} schedules...`);
      
      // Delete all schedules - for UUID columns, use NOT IS NULL instead of numeric comparison
      const { data, error } = await supabase
        .from('schedules')
        .delete()
        .not('id', 'is', null)  // ✅ Works with UUID columns
        .select();
      
      if (error) {
        console.error('❌ Delete error:', error);
        throw error;
      }
      
      console.log(`✅ Successfully deleted ${data?.length || 0} schedules`);
      
      return { success: true, message: 'All schedules cleared', deletedCount: data?.length || 0 };
    } catch (error) {
      console.error('Error clearing schedules:', error);
      throw error;
    }
  },

  // ==================== BED MANAGEMENT FUNCTIONS ====================

  async updateScheduleStatus(scheduleId, status) {
    try {
      const { data, error } = await supabase
        .from('schedules')
        .update({ 
          status: status,
          updated_at: new Date().toISOString()
        })
        .eq('id', scheduleId)
        .select()
        .single();
      
      if (error) throw error;
      
      console.log(`✅ Schedule ${scheduleId} status updated to: ${status}`);
      return data;
    } catch (error) {
      console.error('Error updating schedule status:', error);
      throw error;
    }
  },

  async getBedStatus(date, shift) {
    try {
      // Define shift time ranges
      const shiftTimes = {
        pagi: { start: '07:00', end: '11:00' },
        siang: { start: '11:00', end: '15:00' },
        sore: { start: '15:00', end: '19:00' },
        malam: { start: '19:00', end: '23:00' }
      };

      const shiftTime = shiftTimes[shift];
      if (!shiftTime) {
        throw new Error('Invalid shift');
      }

      // Get schedules for the specific date and shift
      // Only show active schedules (not completed or cancelled)
      const { data: schedules, error } = await supabase
        .from('schedules')
        .select(`
          *,
          patient:patients(id, nama, no_rekam_medis)
        `)
        .eq('tanggal', date)
        .gte('waktu_mulai', shiftTime.start)
        .lt('waktu_mulai', shiftTime.end)
        .in('status', ['scheduled', 'in-progress']); // Exclude 'completed' and 'cancelled'

      if (error) throw error;

      // Initialize 12 beds (3 rooms x 4 beds each)
      const totalBeds = 12;
      const bedsPerRoom = 4;
      const beds = [];

      for (let i = 0; i < totalBeds; i++) {
        const bedNumber = i + 1;
        const room = Math.floor(i / bedsPerRoom) + 1;
        
        // Find schedule for this specific bed - prioritize mesin_dialisis exact match
        const schedule = schedules?.find(s => {
          // First priority: exact bed number match
          if (s.mesin_dialisis === `Bed ${bedNumber}`) {
            return true;
          }
          
          // Second priority: match bed number AND room number
          if (s.mesin_dialisis === `Bed ${bedNumber}` && s.ruangan === `Ruang ${room}`) {
            return true;
          }
          
          return false;
        });

        beds.push({
          bedNumber,
          room,
          status: schedule ? 'occupied' : 'available',
          patient: schedule?.patient || null,
          schedule: schedule || null
        });
      }

      return {
        date,
        shift,
        beds,
        totalBeds,
        availableBeds: beds.filter(b => b.status === 'available').length,
        occupiedBeds: beds.filter(b => b.status === 'occupied').length
      };
    } catch (error) {
      console.error('Error getting bed status:', error);
      throw error;
    }
  },

  // ==================== USERS ====================

  async getAllUsers() {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('is_active', true)
      .order('full_name');
    
    if (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
    return data;
  },

  async getUserById(id) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
    return data;
  },

  async getUserByUsername(username) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .eq('is_active', true)
      .single();
    
    if (error) {
      console.error('Error fetching user by username:', error);
      return null; // Return null instead of throwing error
    }
    return data;
  },

  async getUserByEmail(email) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .eq('is_active', true)
      .single();
    
    if (error) {
      console.error('Error fetching user by email:', error);
      return null; // Return null instead of throwing error
    }
    return data;
  },

  async createUser(userData) {
    const { data, error } = await supabase
      .from('users')
      .insert(userData)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating user:', error);
      throw error;
    }
    return data;
  },

  async updateUser(userId, userData) {
    const { data, error } = await supabase
      .from('users')
      .update(userData)
      .eq('id', userId)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating user:', error);
      throw error;
    }
    return data;
  },

  async deleteUser(userId) {
    const { error } = await supabase
      .from('users')
      .update({ is_active: false })
      .eq('id', userId);
    
    if (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
    return { success: true };
  },

  // ==================== SESSIONS ====================

  async createSession(userId, stationId, sessionToken, ipAddress, userAgent) {
    const { data, error } = await supabase
      .from('active_sessions')
      .insert({
        user_id: userId,
        station_id: stationId,
        session_token: sessionToken,
        ip_address: ipAddress,
        user_agent: userAgent
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating session:', error);
      throw error;
    }
    return data;
  },

  async getSessionByToken(sessionToken) {
    const { data, error } = await supabase
      .from('active_sessions')
      .select(`
        *,
        user:users(id, username, full_name, role, shift)
      `)
      .eq('session_token', sessionToken)
      .eq('is_active', true)
      .single();
    
    if (error) {
      console.error('Error fetching session:', error);
      throw error;
    }
    return data;
  },

  async updateSessionActivity(sessionToken) {
    const { error } = await supabase
      .from('active_sessions')
      .update({ last_activity: new Date().toISOString() })
      .eq('session_token', sessionToken);
    
    if (error) {
      console.error('Error updating session activity:', error);
      throw error;
    }
  },

  async endSession(sessionToken) {
    const { error } = await supabase
      .from('active_sessions')
      .update({ is_active: false })
      .eq('session_token', sessionToken);
    
    if (error) {
      console.error('Error ending session:', error);
      throw error;
    }
  },

  async endAllUserSessions(userId) {
    const { error } = await supabase
      .from('active_sessions')
      .update({ is_active: false })
      .eq('user_id', userId);
    
    if (error) {
      console.error('Error ending all user sessions:', error);
      throw error;
    }
  },

  // ==================== AUDIT LOG ====================

  async logAudit(userId, stationId, action, tableName, recordId, oldValues, newValues, description) {
    const { error } = await supabase
      .from('audit_log')
      .insert({
        user_id: userId,
        station_id: stationId,
        action,
        table_name: tableName,
        record_id: recordId,
        old_values: oldValues ? JSON.stringify(oldValues) : null,
        new_values: newValues ? JSON.stringify(newValues) : null,
        description
      });
    
    if (error) {
      console.error('Error logging audit:', error);
      throw error;
    }
  },

  async getAuditLog(limit = 50) {
    const { data, error } = await supabase
      .from('audit_log')
      .select(`
        *,
        user:users(full_name, username, role)
      `)
      .order('timestamp', { ascending: false })
      .limit(limit);
    
    if (error) {
      console.error('Error fetching audit log:', error);
      throw error;
    }
    return data;
  },

  // ==================== STATIONS ====================

  async getStationInfo(stationId) {
    const { data, error } = await supabase
      .from('stations')
      .select(`
        *,
        current_user:users(full_name, username, role)
      `)
      .eq('id', stationId)
      .single();
    
    if (error) {
      console.error('Error fetching station info:', error);
      throw error;
    }
    return data;
  },

  async updateStationStatus(stationId, isOnline, currentUserId = null) {
    const { error } = await supabase
      .from('stations')
      .update({
        is_online: isOnline,
        current_user_id: currentUserId,
        last_heartbeat: new Date().toISOString()
      })
      .eq('id', stationId);
    
    if (error) {
      console.error('Error updating station status:', error);
      throw error;
    }
  },

  // ==================== REAL-TIME ====================

  subscribeToPatients(callback) {
    return supabase
      .channel('patients-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'patients' },
        callback
      )
      .subscribe();
  },

  subscribeToSchedules(callback) {
    return supabase
      .channel('schedules-changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'schedules' },
        callback
      )
      .subscribe();
  },

  subscribeToAuditLog(callback) {
    return supabase
      .channel('audit-changes')
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'audit_log' },
        callback
      )
      .subscribe();
  },

  // ==================== HEALTH CHECK ====================

  async healthCheck() {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('count')
        .limit(1);
      
      if (error) throw error;
      return { healthy: true, timestamp: new Date().toISOString() };
    } catch (error) {
      return { healthy: false, error: error.message };
    }
  }
};

export default db;
