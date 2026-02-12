@echo off
echo ========================================
echo   ANILEGEON - Bitta Portda Ishga Tushirish
echo ========================================
echo.

echo [1/3] Frontend build qilinmoqda...
cd frontend
call npm run build
if errorlevel 1 (
    echo XATO: Frontend build muvaffaqiyatsiz!
    pause
    exit /b 1
)

echo.
echo [2/3] Fayllar backend/public ga ko'chirilmoqda...
cd ..
if exist backend\public rmdir /s /q backend\public
xcopy /E /I /Y frontend\dist backend\public > nul
if errorlevel 1 (
    echo XATO: Fayllar ko'chirilmadi!
    pause
    exit /b 1
)

echo.
echo [3/3] Backend ishga tushirilmoqda...
cd backend
echo.
echo ========================================
echo   Tayyor! Brauzerni oching:
echo   http://localhost:5000
echo ========================================
echo.
call npm start
