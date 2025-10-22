@echo off
echo ========================================
echo Admin Klinik - Desktop App Installer
echo ========================================
echo.

echo [1/4] Installing root dependencies...
call npm install
if %errorlevel% neq 0 (
    echo Error installing root dependencies!
    pause
    exit /b %errorlevel%
)

echo.
echo [2/4] Installing backend dependencies...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo Error installing backend dependencies!
    cd ..
    pause
    exit /b %errorlevel%
)
cd ..

echo.
echo [3/4] Installing frontend dependencies...
cd frontend
call npm install
if %errorlevel% neq 0 (
    echo Error installing frontend dependencies!
    cd ..
    pause
    exit /b %errorlevel%
)
cd ..

echo.
echo [4/4] Installing Electron dependencies...
call npm run postinstall
if %errorlevel% neq 0 (
    echo Warning: Electron dependencies installation failed!
)

echo.
echo ========================================
echo Installation Complete! 
echo ========================================
echo.
echo Next steps:
echo   1. Run development mode: npm run dev
echo   2. Build for Windows:    npm run electron:build:win
echo.
echo For more info, read DESKTOP_APP.md
echo.
pause

