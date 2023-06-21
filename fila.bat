@echo off
:loop
node fila.js
timeout /t 20 /nobreak >nul
goto loop
