import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import db from './config/supabase.js';

// Load environment variables
dotenv.config();

// Create Supabase client
// Use service role key for backend operations to bypass RLS
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY
);

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production';
const JWT_EXPIRES_IN = '24h';

// Authentication middleware
export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }
  
  jwt.verify(token, JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    
    try {
      // Verify session is still active
      const session = await db.getSessionByToken(decoded.sessionToken);
      if (!session || !session.is_active) {
        return res.status(403).json({ error: 'Session expired' });
      }
      
      req.user = {
        userId: decoded.userId,
        username: decoded.username,
        role: decoded.role,
        sessionToken: decoded.sessionToken
      };
      next();
    } catch (error) {
      console.error('Session verification error:', error);
      return res.status(403).json({ error: 'Session verification failed' });
    }
  });
}

// Login endpoint
export async function loginUser(req, res) {
  try {
    const { username, email, password, station_id, ip_address, user_agent } = req.body;
    
    if ((!username && !email) || !password) {
      return res.status(400).json({ error: 'Email/Username and password required' });
    }
    
    // Get user from database - support both username and email
    let user;
    if (email) {
      user = await db.getUserByEmail(email);
    } else {
      user = await db.getUserByUsername(username);
    }
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Verify password
    const validPassword = await bcrypt.compare(password, user.password_hash);
    
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // End any existing sessions for this user
    await db.endAllUserSessions(user.id);
    
    // Generate session token
    const sessionToken = generateSessionToken();
    
    // Create new session
    await db.createSession(user.id, station_id, sessionToken, ip_address, user_agent);
    
    // Update user login info
    await db.updateUser(user.id, {
      last_login: new Date().toISOString(),
      login_count: user.login_count + 1
    });
    
    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        username: user.username, 
        role: user.role,
        sessionToken: sessionToken
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );
    
    // Log the login
    await db.logAudit(
      user.id, 
      station_id, 
      'login', 
      'users', 
      user.id, 
      null, 
      null, 
      `User logged in from station ${station_id}`
    );
    
    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        full_name: user.full_name,
        role: user.role,
        shift: user.shift
      },
      session: {
        token: sessionToken,
        station_id: station_id
      }
    });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Logout endpoint
export async function logoutUser(req, res) {
  try {
    const { station_id } = req.body;
    const { sessionToken } = req.user;
    
    // End session
    await db.endSession(sessionToken);
    
    // Log the logout
    await db.logAudit(
      req.user.userId,
      station_id,
      'logout',
      'users',
      req.user.userId,
      null,
      null,
      `User logged out from station ${station_id}`
    );
    
    res.json({ message: 'Logged out successfully' });
    
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Session heartbeat
export async function sessionHeartbeat(req, res) {
  try {
    const { sessionToken } = req.user;
    
    // Update session activity
    await db.updateSessionActivity(sessionToken);
    
    res.json({ success: true, timestamp: new Date().toISOString() });
    
  } catch (error) {
    console.error('Heartbeat error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Get current user info
export async function getCurrentUser(req, res) {
  try {
    const user = await db.getUserById(req.user.userId);
    
    res.json({
      id: user.id,
      username: user.username,
      full_name: user.full_name,
      role: user.role,
      shift: user.shift,
      last_login: user.last_login,
      login_count: user.login_count
    });
    
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Get recent users for quick login
export async function getRecentUsers(req, res) {
  try {
    // Since no sessions exist yet, return all active users for quick login
    const { data, error } = await supabase
      .from('users')
      .select('id, username, full_name, role, last_login')
      .eq('is_active', true)
      .order('last_login', { ascending: false, nullsLast: true })
      .limit(10);
    
    if (error) throw error;
    
    res.json(data || []);
    
  } catch (error) {
    console.error('Get recent users error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Get all users (for user management)
export async function getAllUsers(req, res) {
  try {
    const users = await db.getAllUsers();
    res.json(users);
    
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Create new user
export async function createUser(req, res) {
  try {
    const { username, password, full_name, role, shift, phone, email } = req.body;
    
    // Check if username already exists
    const existingUser = await db.getUserByUsername(username);
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }
    
    // Hash password
    const password_hash = await bcrypt.hash(password, 10);
    
    // Create user
    const user = await db.createUser({
      username,
      password_hash,
      full_name,
      role: role || 'staff',
      shift: shift || 'all',
      phone,
      email,
      is_active: true
    });
    
    // Log the creation
    await db.logAudit(
      req.user.userId,
      req.body.station_id || 'unknown',
      'create',
      'users',
      user.id,
      null,
      user,
      `Created user: ${user.full_name} (${user.username})`
    );
    
    res.status(201).json({
      id: user.id,
      username: user.username,
      full_name: user.full_name,
      role: user.role,
      shift: user.shift,
      created_at: user.created_at
    });
    
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Update user
export async function updateUser(req, res) {
  try {
    const { id } = req.params;
    const { full_name, role, shift, phone, email, is_active } = req.body;
    
    // Get old user data for audit
    const oldUser = await db.getUserById(id);
    
    // Update user
    const updatedUser = await db.updateUser(id, {
      full_name,
      role,
      shift,
      phone,
      email,
      is_active
    });
    
    // Log the update
    await db.logAudit(
      req.user.userId,
      req.body.station_id || 'unknown',
      'update',
      'users',
      id,
      oldUser,
      updatedUser,
      `Updated user: ${updatedUser.full_name}`
    );
    
    res.json({
      id: updatedUser.id,
      username: updatedUser.username,
      full_name: updatedUser.full_name,
      role: updatedUser.role,
      shift: updatedUser.shift,
      is_active: updatedUser.is_active
    });
    
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Delete user (soft delete)
export async function deleteUser(req, res) {
  try {
    const { id } = req.params;
    
    // Get user data for audit
    const user = await db.getUserById(id);
    
    // Soft delete user
    await db.deleteUser(id);
    
    // Log the deletion
    await db.logAudit(
      req.user.userId,
      req.body.station_id || 'unknown',
      'delete',
      'users',
      id,
      user,
      null,
      `Deleted user: ${user.full_name} (${user.username})`
    );
    
    res.json({ message: 'User deleted successfully' });
    
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Helper function to generate session token
function generateSessionToken() {
  return 'sess_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
}

// Helper function to get client IP
export function getClientIP(req) {
  return req.headers['x-forwarded-for'] || 
         req.connection.remoteAddress || 
         req.socket.remoteAddress ||
         (req.connection.socket ? req.connection.socket.remoteAddress : null);
}

// Helper function to get user agent
export function getUserAgent(req) {
  return req.headers['user-agent'] || 'Unknown';
}
