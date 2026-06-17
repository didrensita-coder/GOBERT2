@echo off
title Iniciador del Sistema Gobert2 - Edge Limpio
color 0A

echo ========================================
echo   Iniciando Sistema Gobert2
echo ========================================
echo.

echo [1/3] Iniciando Backend Django...
cd /d "C:\Users\ingeniera didren\Desktop\gobert2\backend"
start "Backend Django" cmd /k "python manage.py runserver"

timeout /t 3 /nobreak >nul

echo [2/3] Iniciando Frontend...
cd /d "C:\Users\ingeniera didren\Desktop\gobert2\frontend"
start "Frontend" cmd /k "npm run dev"

timeout /t 5 /nobreak >nul

echo [3/3] Abriendo Edge SIN sesion guardada...
REM Eliminar el localStorage especificamente para localhost
start msedge --new-window --guest http://localhost:3000

echo.
echo ========================================
echo   SISTEMA INICIADO
echo ========================================
echo.
echo ✅ Backend: http://localhost:8000
echo ✅ Frontend: http://localhost:3000
echo.
echo 💡 Se abrio en modo invitado (sin sesiones guardadas)
echo 💡 Inicia sesion y esta vez SI se guardara
echo 💡 La proxima vez usa el script normal
echo.
pause