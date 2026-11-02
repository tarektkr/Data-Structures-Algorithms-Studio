@echo off
title Robert Lafore Studio - Data Structures and Algorithms

echo =====================================================================
echo    Starting Robert Lafore Interactive Studio (React + Vite)
echo =====================================================================
echo.

:: 1. Check for Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR]: Node.js was not found on your computer!
    echo.
    echo Please download and install Node.js (LTS version) from the official website:
    echo https://nodejs.org/
    echo.
    echo After installation, restart this file (start.bat).
    echo.
    pause
    exit /b 1
)

echo [OK] Node.js found successfully.
node -v
echo.

:: 2. Check for node_modules
if not exist "node_modules" (
    echo [!] Installing packages for the first time (npm install --legacy-peer-deps)...
    echo Please wait a moment...
    call npm install --legacy-peer-deps
    if %errorlevel% neq 0 (
        echo [ERROR]: Failed to install packages. Please check your internet connection.
        pause
        exit /b 1
    )
    echo [OK] Packages installed successfully.
    echo.
)

:: 3. Start dev server and open browser
echo =====================================================================
echo   Starting local dev server on: http://localhost:3000
echo =====================================================================
echo.
echo You can stop the server at any time by pressing Ctrl + C
echo.

start "" http://localhost:3000
call npm run dev

pause