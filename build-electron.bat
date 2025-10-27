@echo off
echo ========================================
echo Admin Klinik - Building Desktop Application
echo ========================================
echo.

echo Step 1: Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo Dependencies installation failed!
    pause
    exit /b %errorlevel%
)

echo.
echo Step 2: Installing backend dependencies...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo Backend dependencies installation failed!
    pause
    exit /b %errorlevel%
)
cd ..

echo.
echo Step 3: Building frontend...
call npm run build
if %errorlevel% neq 0 (
    echo Frontend build failed!
    pause
    exit /b %errorlevel%
)

echo.
echo Step 4: Building Electron application...
call npm run electron:build:win
if %errorlevel% neq 0 (
    echo Electron build failed!
    pause
    exit /b %errorlevel%
)

echo.
echo ========================================
echo Build Complete!
echo ========================================
echo.
echo Installer created in: dist-electron\
echo.
dir dist-electron\*.exe
echo.
echo You can now distribute this .exe file!
echo.
pause
