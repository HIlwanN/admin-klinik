@echo off
echo ========================================
echo Admin Klinik - Starting Development Mode
echo ========================================
echo.
echo Checking dependencies...
echo.

REM Check if node_modules exists
if not exist "node_modules\" (
    echo [ERROR] Dependencies not installed!
    echo Please run install.bat first
    echo.
    pause
    exit /b 1
)

if not exist "backend\node_modules\" (
    echo [ERROR] Backend dependencies not installed!
    echo Please run install.bat first
    echo.
    pause
    exit /b 1
)

if not exist "frontend\node_modules\" (
    echo [ERROR] Frontend dependencies not installed!
    echo Please run install.bat first
    echo.
    pause
    exit /b 1
)

echo Dependencies OK!
echo.
echo ========================================
echo Starting all services...
echo ========================================
echo.
echo This will start:
echo   1. Backend API (port 3000)
echo   2. Frontend Dev Server (port 5173)
echo   3. Electron App
echo.
echo Press Ctrl+C to stop all processes
echo.
echo ========================================
echo.

npm run dev

