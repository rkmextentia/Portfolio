@echo off
title RKMIDIGILABS Services Launcher
echo ======================================================
echo 🚀 Launching RKMIDIGILABS Services...
echo ======================================================
cd /d "%~dp0"
echo 1. Starting Admin API Server on port 4322...
start "RKMIDIGILABS Admin API (Port 4322)" /min cmd /c "node server/admin-api.js"
echo 2. Starting Astro Frontend on port 4321...
start "RKMIDIGILABS Astro Website (Port 4321)" /min cmd /c "npx astro preview --host --port 4321"
timeout /t 3 /nobreak >nul
echo 3. Opening Admin Studio in default browser...
start http://localhost:4321/admin
echo ======================================================
echo ✅ Services active:
echo - Frontend: http://localhost:4321/
echo - Admin Studio: http://localhost:4321/admin/
echo - Admin API Health: http://localhost:4322/api/admin/health
echo ======================================================
pause
