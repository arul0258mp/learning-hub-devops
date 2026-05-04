@echo off
title Study Bot AI — Starting Server...
echo.
echo  ================================================
echo   Study Bot AI Assistant — Local Server
echo  ================================================
echo.

cd /d "%~dp0"

:: Check if node is installed
where node >nul 2>&1
if %ERRORLEVEL% neq 0 (
  echo ERROR: Node.js is not installed!
  echo Please download it from: https://nodejs.org
  pause
  exit /b 1
)

:: Check if dependencies are installed
if not exist "backend\node_modules" (
  echo Installing backend dependencies...
  cd backend
  call npm install
  cd ..
)

echo Starting server on http://localhost:3001 ...
echo.
echo Press Ctrl+C to stop the server.
echo.
start "" "http://localhost:3001"
node backend\server.js
pause
