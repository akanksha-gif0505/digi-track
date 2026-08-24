@echo off
echo ========================================
echo   DigiTrack - Starting Both Servers
echo ========================================
echo.
echo Starting Backend and Frontend...
echo.
echo Backend will run on: http://localhost:3000
echo Frontend will run on: http://localhost:5173
echo.
echo Two terminal windows will open.
echo Close this window won't stop the servers.
echo.

start "DigiTrack Backend" cmd /k "cd /d %~dp0\backend && npm run dev"
timeout /t 3 /nobreak >nul
start "DigiTrack Frontend" cmd /k "cd /d %~dp0\frontend && npm run dev"

echo.
echo Both servers starting...
echo Check the opened terminal windows for status.
echo.
echo Backend: http://localhost:3000/api/health
echo Frontend: http://localhost:5173
echo.

pause
