import { app, BrowserWindow, ipcMain } from 'electron';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { spawn } from 'child_process';
import http from 'http';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let mainWindow;
let backendProcess;
const isDev = process.env.NODE_ENV === 'development';
const PORT = 3000;
const FRONTEND_PORT = 5173;

// Check if server is ready
function checkServer(url, maxRetries = 30, interval = 1000) {
  return new Promise((resolve) => {
    let retries = 0;
    
    const check = () => {
      http.get(url, (res) => {
        if (res.statusCode === 200) {
          console.log(`✓ Server ready at ${url}`);
          resolve(true);
        } else {
          retry();
        }
      }).on('error', () => {
        retry();
      });
    };
    
    const retry = () => {
      retries++;
      if (retries < maxRetries) {
        console.log(`Waiting for server... (${retries}/${maxRetries})`);
        setTimeout(check, interval);
      } else {
        console.error(`✗ Server not ready after ${maxRetries} attempts`);
        resolve(false);
      }
    };
    
    check();
  });
}

// Start backend server
function startBackend() {
  console.log('Starting backend server...');
  console.log('📁 Resources path:', process.resourcesPath);
  console.log('📁 __dirname:', __dirname);
  
  // Path to backend directory and server file
  const backendDir = isDev 
    ? join(__dirname, '../backend')
    : join(process.resourcesPath, 'backend');
  
  const backendPath = join(backendDir, 'server.js');
  
  console.log('📁 Backend directory:', backendDir);
  console.log('📁 Backend server.js:', backendPath);
  
  // Check if backend directory exists
  if (!fs.existsSync(backendDir)) {
    console.error('❌ Backend directory not found:', backendDir);
    return;
  }
  
  if (!fs.existsSync(backendPath)) {
    console.error('❌ Backend server.js not found:', backendPath);
    return;
  }
  
  console.log('✓ Backend files found, starting server...');
  
  // Try to load .env file from backend directory
  let envVars = { ...process.env };
  const envPath = join(backendDir, '.env');
  
  if (fs.existsSync(envPath)) {
    console.log('📄 Loading .env from:', envPath);
    try {
      const envContent = fs.readFileSync(envPath, 'utf-8');
      envContent.split('\n').forEach(line => {
        line = line.trim();
        if (line && !line.startsWith('#') && line.includes('=')) {
          const [key, ...valueParts] = line.split('=');
          const value = valueParts.join('=').trim();
          if (key && value) {
            envVars[key.trim()] = value;
          }
        }
      });
      console.log('✓ Environment variables loaded from .env');
      
      // Validate critical ENV variables
      console.log('🔍 Validating environment variables...');
      const requiredEnvVars = ['SUPABASE_URL', 'SUPABASE_ANON_KEY', 'JWT_SECRET'];
      const missing = [];
      requiredEnvVars.forEach(key => {
        if (!envVars[key] || envVars[key].trim() === '') {
          missing.push(key);
        } else {
          console.log(`   ✓ ${key}: Set (${envVars[key].substring(0, 20)}...)`);
        }
      });
      
      if (missing.length > 0) {
        console.error('❌ Missing required environment variables:', missing.join(', '));
        console.error('   Please check your .env file');
        return; // Don't start backend if critical ENV missing
      }
      
      // Check SERVICE_ROLE_KEY (preferred but not required)
      if (!envVars['SUPABASE_SERVICE_ROLE_KEY']) {
        console.warn('⚠️ SUPABASE_SERVICE_ROLE_KEY not set, using ANON_KEY (may have RLS issues)');
      } else {
        console.log('   ✓ SUPABASE_SERVICE_ROLE_KEY: Set');
      }
    } catch (error) {
      console.error('⚠️ Failed to read .env file:', error.message);
      console.error('   Backend will not start without .env file');
      return;
    }
  } else {
    console.error('❌ .env file not found at:', envPath);
    console.error('   Backend requires .env file to connect to Supabase');
    console.error('   Expected path:', envPath);
    
    // List files in backend directory for debugging
    try {
      const files = fs.readdirSync(backendDir);
      console.log('   Files found in backend directory:', files.slice(0, 10).join(', '));
    } catch (e) {
      console.error('   Cannot list files in backend directory');
    }
    
    return; // Don't start backend without .env
  }
  
  // Check if node_modules exists
  const nodeModulesPath = join(backendDir, 'node_modules');
  if (!fs.existsSync(nodeModulesPath)) {
    console.error('❌ Backend node_modules not found at:', nodeModulesPath);
    console.error('   Backend dependencies are not installed');
    console.error('   Please run: npm ci --prefix backend --omit=dev');
    return;
  } else {
    console.log('✓ Backend node_modules found');
  }

  // Use Electron's embedded Node runtime to run backend (no external Node required)
  const nodeBinary = process.execPath;
  console.log('🚀 Starting backend process...');
  console.log('   Node binary:', nodeBinary);
  console.log('   Backend path:', backendPath);
  console.log('   Working directory:', backendDir);
  
  backendProcess = spawn(nodeBinary, [backendPath], {
    cwd: backendDir,
    env: {
      ...envVars,
      ELECTRON_RUN_AS_NODE: '1',
      PORT: PORT.toString(),
      ELECTRON_APP: 'true',
      NODE_ENV: 'production',
      // Set database path to user data directory
      DB_PATH: join(app.getPath('userData'), 'hospital.db')
    },
    stdio: ['pipe', 'pipe', 'pipe'] // Capture output for better logging
  });

  // Log backend stdout
  backendProcess.stdout.on('data', (data) => {
    const output = data.toString().trim();
    if (output) {
      console.log('[Backend]', output);
    }
  });

  // Log backend stderr
  backendProcess.stderr.on('data', (data) => {
    const output = data.toString().trim();
    if (output) {
      console.error('[Backend Error]', output);
    }
  });

  backendProcess.on('error', (err) => {
    console.error('❌ Failed to start backend:', err);
    console.error('Error details:', err.message);
    console.error('Error code:', err.code);
    console.error('Stack:', err.stack);
  });

  backendProcess.on('close', (code, signal) => {
    if (code !== null) {
      console.log(`⚠️ Backend process exited with code ${code}`);
      if (code !== 0) {
        console.error('   Backend crashed or failed to start properly');
      }
    } else {
      console.log(`⚠️ Backend process killed with signal ${signal}`);
    }
  });
  
  backendProcess.on('spawn', () => {
    console.log('✓ Backend process spawned successfully');
    console.log('   Waiting for backend to initialize...');
  });
}

// Stop backend server
function stopBackend() {
  if (backendProcess) {
    console.log('Stopping backend server...');
    backendProcess.kill();
    backendProcess = null;
  }
}

async function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1024,
    minHeight: 768,
    show: false, // Don't show until ready
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: join(__dirname, 'preload.js')
    },
    icon: join(__dirname, '../frontend/public/icon.png'), // Optional: Add app icon
    title: 'Sistem Manajemen Pasien Cuci Darah',
    backgroundColor: '#f5f7fa'
  });

  // Remove menu bar
  mainWindow.setMenuBarVisibility(false);

  // Show loading message
  const loadingHTML = `
    <html>
      <head>
        <style>
          body { 
            margin: 0; 
            padding: 0; 
            display: flex; 
            justify-content: center; 
            align-items: center; 
            height: 100vh; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            color: white;
          }
          .loader {
            text-align: center;
          }
          .spinner {
            border: 4px solid rgba(255,255,255,0.3);
            border-top: 4px solid white;
            border-radius: 50%;
            width: 50px;
            height: 50px;
            animation: spin 1s linear infinite;
            margin: 0 auto 20px;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          h2 { margin: 0 0 10px; }
          p { opacity: 0.9; }
        </style>
      </head>
      <body>
        <div class="loader">
          <div class="spinner"></div>
          <h2>Admin Klinik</h2>
          <p>Loading application...</p>
          <p style="font-size: 14px; margin-top: 10px;">Please wait while we start the server</p>
        </div>
      </body>
    </html>
  `;

  mainWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(loadingHTML)}`);
  mainWindow.show();

  // Load the app
  if (isDev) {
    console.log('Development mode - waiting for Vite server...');
    
    // Check if Vite dev server is ready
    const viteReady = await checkServer(`http://localhost:${FRONTEND_PORT}`, 30, 1000);
    
    if (viteReady) {
      console.log('Loading from Vite dev server...');
      await mainWindow.loadURL(`http://localhost:${FRONTEND_PORT}`);
      mainWindow.webContents.openDevTools();
    } else {
      // Vite server not running, show error
      const errorHTML = `
        <html>
          <head>
            <style>
              body { 
                margin: 0; 
                padding: 40px; 
                background: #f5f7fa;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
              }
              .error {
                max-width: 600px;
                margin: 0 auto;
                background: white;
                padding: 30px;
                border-radius: 10px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
              }
              h1 { color: #e74c3c; margin-top: 0; }
              .steps { background: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0; }
              .steps ol { margin: 10px 0; padding-left: 20px; }
              .steps li { margin: 10px 0; }
              code { background: #2c3e50; color: #ecf0f1; padding: 2px 6px; border-radius: 3px; }
              .note { background: #fff3cd; padding: 15px; border-radius: 5px; border-left: 4px solid #ffc107; }
            </style>
          </head>
          <body>
            <div class="error">
              <h1>⚠️ Frontend Server Not Running</h1>
              <p>Aplikasi tidak bisa dimuat karena Vite development server belum berjalan.</p>
              
              <div class="steps">
                <h3>Cara Memperbaiki:</h3>
                <ol>
                  <li><strong>Tutup aplikasi ini</strong></li>
                  <li><strong>Buka terminal</strong> di folder project</li>
                  <li><strong>Jalankan:</strong> <code>npm run dev</code></li>
                  <li>Tunggu sampai selesai, aplikasi akan terbuka otomatis</li>
                </ol>
              </div>

              <div class="note">
                <strong>💡 Tip:</strong> Gunakan script <code>run-dev.bat</code> untuk menjalankan semua service sekaligus.
              </div>
            </div>
          </body>
        </html>
      `;
      mainWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(errorHTML)}`);
    }
  } else {
    // Production: Load from backend server (backend serves static files)
    console.log('Production mode - loading from backend server...');
    
    // Get backend paths for error display
    const backendDir = isDev 
      ? join(__dirname, '../backend')
      : join(process.resourcesPath, 'backend');
    const backendPath = join(backendDir, 'server.js');
    
    // Wait for backend with longer timeout and better error reporting
    console.log('Waiting for backend to start...');
    const backendReady = await checkServer(`http://localhost:${PORT}/api/health`, 120, 1000); // 120 seconds timeout
    
    if (!backendReady) {
      console.error('❌ Backend not ready after 120 attempts');
      
      // Collect backend errors if any
      let backendErrorLog = '';
      if (backendProcess && backendProcess.stderr) {
        // Errors already logged to console, but we can show a summary
        backendErrorLog = 'Backend process may have crashed. Check console logs for details.';
      }
      
      // Check if backend process is still running
      const isRunning = backendProcess && !backendProcess.killed;
      
      // Show detailed error
      const errorHTML = `
        <html>
          <head>
            <style>
              body { 
                margin: 0; 
                padding: 40px; 
                background: #f5f7fa;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
              }
              .error {
                max-width: 600px;
                margin: 0 auto;
                background: white;
                padding: 30px;
                border-radius: 10px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
              }
              h1 { color: #e74c3c; margin-top: 0; }
              code { background: #2c3e50; color: #ecf0f1; padding: 2px 6px; border-radius: 3px; }
              .note { background: #ffe6e6; padding: 15px; border-radius: 5px; margin-top: 20px; border-left: 4px solid #e74c3c; }
              .paths { background: #f8f9fa; padding: 15px; border-radius: 5px; margin-top: 20px; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="error">
              <h1>⚠️ Backend Server Failed to Start</h1>
              <p>Backend tidak dapat dimulai setelah 120 detik.</p>
              
              <div class="note">
                <strong>Detail Teknis:</strong>
                <ul>
                  <li>Port: ${PORT}</li>
                  <li>Resources path: ${process.resourcesPath || 'unknown'}</li>
                  <li>Backend dir: ${backendDir}</li>
                  <li>Backend path: ${backendPath}</li>
                  <li>Backend process running: ${isRunning ? 'Yes' : 'No'}</li>
                  <li>Node modules: ${fs.existsSync(join(backendDir, 'node_modules')) ? 'Found' : 'NOT FOUND'}</li>
                  <li>.env file: ${fs.existsSync(join(backendDir, '.env')) ? 'Found' : 'NOT FOUND'}</li>
                </ul>
                ${backendErrorLog ? `<p style="color: #e74c3c; margin-top: 10px;"><strong>Error:</strong> ${backendErrorLog}</p>` : ''}
              </div>
              
              <div class="paths">
                <strong>Penyebab Umum:</strong>
                <ol>
                  <li><strong>node_modules tidak ter-copy:</strong> Pastikan build script menjalankan <code>npm ci --prefix backend --omit=dev</code></li>
                  <li><strong>.env file tidak ada:</strong> Pastikan file <code>backend/.env</code> ada sebelum build</li>
                  <li><strong>Backend crash:</strong> Buka Developer Tools (F12) untuk melihat log error detail</li>
                </ol>
                <p style="margin-top: 15px;"><strong>Solusi:</strong></p>
                <ol>
                  <li>Buka Developer Tools (F12) dan cek tab Console untuk error detail</li>
                  <li>Pastikan build ulang dengan: <code>npm run electron:build:win</code></li>
                  <li>Pastikan <code>backend/.env</code> ada dan valid</li>
                  <li>Restart aplikasi</li>
                </ol>
              </div>
            </div>
          </body>
        </html>
      `;
      mainWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(errorHTML)}`);
      return;
    }
    
    try {
      // Load from backend server which serves static frontend files
      console.log('✓ Backend ready, loading frontend...');
      await mainWindow.loadURL(`http://localhost:${PORT}/`);
    } catch (error) {
      console.error('Failed to load frontend from backend:', error);
      
      const errorHTML = `
        <html>
          <head>
            <style>
              body { 
                margin: 0; 
                padding: 40px; 
                background: #f5f7fa;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
              }
              .error {
                max-width: 600px;
                margin: 0 auto;
                background: white;
                padding: 30px;
                border-radius: 10px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
              }
              h1 { color: #e74c3c; margin-top: 0; }
              code { background: #2c3e50; color: #ecf0f1; padding: 2px 6px; border-radius: 3px; }
              .note { background: #fff3cd; padding: 15px; border-radius: 5px; margin-top: 20px; }
            </style>
          </head>
          <body>
            <div class="error">
              <h1>⚠️ Frontend Build Not Found</h1>
              <p>Aplikasi tidak dapat menemukan file build frontend.</p>
              <p>Silakan build aplikasi terlebih dahulu dengan menjalankan:</p>
              <p><code>npm run build</code></p>
              <div class="note">
                <strong>Error:</strong> ${error.message}
              </div>
            </div>
          </body>
        </html>
      `;
      mainWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(errorHTML)}`);
    }
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Handle external links
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    require('electron').shell.openExternal(url);
    return { action: 'deny' };
  });

  // Handle loading errors
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error('Failed to load:', errorCode, errorDescription);
  });
}

// App lifecycle
app.whenReady().then(async () => {
  console.log('='.repeat(50));
  console.log('Admin Klinik - Starting Application');
  console.log('='.repeat(50));
  
  // Start backend first (only in production mode)
  if (!isDev) {
    console.log('Starting backend server...');
    startBackend();
    
    // Wait a bit for backend to initialize
    await new Promise(resolve => setTimeout(resolve, 2000));
  } else {
    console.log('Development mode - backend should be running separately');
  }

  // Create window (will check servers inside)
  await createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
  
  console.log('='.repeat(50));
  console.log('Application Ready');
  console.log('='.repeat(50));
});

app.on('window-all-closed', () => {
  stopBackend();
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  stopBackend();
});

// IPC handlers
ipcMain.handle('get-app-version', () => {
  return app.getVersion();
});

ipcMain.handle('get-app-path', (event, name) => {
  return app.getPath(name);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
});

console.log('Electron app started');
console.log('User data path:', app.getPath('userData'));

