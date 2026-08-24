@echo off
echo ========================================
echo   DigiTrack Frontend (React + Vite)
echo ========================================
echo.
echo Starting frontend server on port 5173...
echo Frontend will be available at: http://localhost:5173
echo.
echo IMPORTANT: Make sure backend is running on port 3000!
echo.
echo Press Ctrl+C to stop the server
echo.

cd /d "%~dp0\frontend"
npm run dev

pause
