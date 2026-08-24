@echo off
echo ========================================
echo   DigiTrack Backend API Server
echo ========================================
echo.
echo Starting backend server on port 3000...
echo API will be available at: http://localhost:3000/api/v1
echo Health check: http://localhost:3000/api/health
echo.
echo Press Ctrl+C to stop the server
echo.

cd /d "%~dp0\backend"
npm run dev

pause
