@echo off
cd "C:\xampp"
start xampp_stop.exe

:LOOP
PSLIST xampp_stop.exe >nul 2>&1
IF ERRORLEVEL 1 (
  GOTO CONTINUE
) ELSE (
  ECHO xampp_stop is still running
  SLEEP 2
  GOTO LOOP
)

:CONTINUE

start xampp_start.exe
cd "C:\Program Files\Google\Chrome\Application"
start chrome.exe --chrome-frame --kiosk http://localhost/kibucam