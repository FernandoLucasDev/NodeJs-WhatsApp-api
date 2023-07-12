@echo off
:loop
node fila.js
timeout /t 5 /nobreak >nul
goto loop
