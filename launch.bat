@echo off
echo Killing existing Node processes...
taskkill /f /im node.exe >nul 2>&1

echo Starting development server...
cd /d "%~dp0"
start "Dev Server" powershell -NoExit -Command "npm run dev"

echo Waiting for server to start...
timeout /t 5 /nobreak >nul

echo Creating tunnel...
start "Tunnel" powershell -NoExit -Command "npx localtunnel --port 3000"

echo Launch complete. Check the windows for URLs.
pause 