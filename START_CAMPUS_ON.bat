@echo off
title CampusOn - Intelligent Campus Operating System (MITS Gwalior)
color 0E

echo ==============================================================================
echo       CAMPUSON - AN AI ^& IOT-POWERED INTELLIGENT CAMPUS OPERATING SYSTEM
echo      Madhav Institute of Technology ^& Science, Gwalior (Centre for IoT)
echo ==============================================================================
echo.
echo Starting CampusOn Services...
echo.

:: 1. Start Python FastAPI Backend Server
echo [1/3] Starting FastAPI Backend on http://127.0.0.1:8000 ...
start "CampusOn Backend (FastAPI)" /min cmd /c "cd /d "%~dp0backend" && "C:\Users\admin\python311\python.exe" -m uvicorn main:app --host 127.0.0.1 --port 8000"

:: 2. Start React + Vite Frontend Server
echo [2/3] Starting React + Vite Frontend on http://127.0.0.1:5173 ...
start "CampusOn Frontend (Vite)" /min cmd /c "cd /d "%~dp0frontend" && npm run dev -- --host 127.0.0.1 --port 5173"

:: 3. Wait 3 seconds and launch browser
echo [3/3] Opening CampusOn Dashboard in your browser...
timeout /t 3 /nobreak > nul
start http://127.0.0.1:5173/

echo.
echo ==============================================================================
echo [SUCCESS] CampusOn is running!
echo.
echo   * Web Dashboard:  http://127.0.0.1:5173/
echo   * API Docs:       http://127.0.0.1:8000/docs
echo.
echo Leave this window open while demonstrating. Press any key to stop all services.
echo ==============================================================================
pause > nul

:: Cleanly terminate background processes
taskkill /FI "WINDOWTITLE eq CampusOn Backend*" /F > nul 2>&1
taskkill /FI "WINDOWTITLE eq CampusOn Frontend*" /F > nul 2>&1
echo Services stopped. Goodbye!
