#!/bin/bash

echo "========================================"
echo "Admin Klinik - Desktop App Installer"
echo "========================================"
echo ""

echo "[1/4] Installing root dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "Error installing root dependencies!"
    exit 1
fi

echo ""
echo "[2/4] Installing backend dependencies..."
cd backend
npm install
if [ $? -ne 0 ]; then
    echo "Error installing backend dependencies!"
    cd ..
    exit 1
fi
cd ..

echo ""
echo "[3/4] Installing frontend dependencies..."
cd frontend
npm install
if [ $? -ne 0 ]; then
    echo "Error installing frontend dependencies!"
    cd ..
    exit 1
fi
cd ..

echo ""
echo "[4/4] Installing Electron dependencies..."
npm run postinstall
if [ $? -ne 0 ]; then
    echo "Warning: Electron dependencies installation failed!"
fi

echo ""
echo "========================================"
echo "Installation Complete!"
echo "========================================"
echo ""
echo "Next steps:"
echo "  1. Run development mode: npm run dev"
echo "  2. Build for your OS:"
echo "     - macOS:  npm run electron:build:mac"
echo "     - Linux:  npm run electron:build:linux"
echo ""
echo "For more info, read DESKTOP_APP.md"
echo ""

