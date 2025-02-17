@echo off
:loop
node index.js
timeout /t 5 /nobreak >nul
goto loop