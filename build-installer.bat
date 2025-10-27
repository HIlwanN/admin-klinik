@echo off
echo Building Admin Klinik Desktop Installer...
echo.

REM Clean previous build
if exist "dist-electron" (
    echo Cleaning previous build...
    rmdir /s /q "dist-electron" 2>nul
)

REM Build frontend
echo Building frontend...
call npm run build
if %errorlevel% neq 0 (
    echo Frontend build failed!
    pause
    exit /b 1
)

REM Install backend dependencies
echo Installing backend dependencies...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo Backend install failed!
    pause
    exit /b 1
)
cd ..

REM Build Electron app
echo Building Electron app...
call npx electron-builder --win --config.nsis.oneClick=false --config.nsis.allowToChangeInstallationDirectory=true
if %errorlevel% neq 0 (
    echo Electron build failed!
    pause
    exit /b 1
)

echo.
echo Build complete! Check dist-electron\ folder
pause
