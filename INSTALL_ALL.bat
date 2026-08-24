@echo off
echo ========================================
echo   DigiTrack - Install All Dependencies
echo ========================================
echo.
echo This will install dependencies for both frontend and backend...
echo.

cd /d "%~dp0"

echo [1/2] Installing Backend Dependencies...
echo.
cd backend
call npm install
cd ..

echo.
echo [2/2] Installing Frontend Dependencies...
echo.
cd frontend
call npm install
cd ..

echo.
echo ========================================
echo   Installation Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Configure backend/.env file (add JWT_SECRET and optional GEMINI_API_KEY)
echo 2. Double-click START_BOTH.bat to start both servers
echo 3. Open http://localhost:5173 in your browser
echo.

pause
