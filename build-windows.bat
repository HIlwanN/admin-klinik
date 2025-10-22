@echo off
echo ========================================
echo Admin Klinik - Building Windows Installer
echo ========================================
echo.
echo This will create a Windows installer (.exe)
echo Output location: dist-electron/
echo.
echo Building...
echo.

npm run electron:build:win

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo Build Complete!
    echo ========================================
    echo.
    echo Installer created in: dist-electron/
    echo.
    dir dist-electron\*.exe
    echo.
    echo You can now distribute this .exe file!
    echo.
) else (
    echo.
    echo Build failed! Check the errors above.
    echo.
)

pause

