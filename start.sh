#!/bin/bash

echo "========================================"
echo "  ANILEGEON - Bitta Portda Ishga Tushirish"
echo "========================================"
echo ""

echo "[1/3] Frontend build qilinmoqda..."
cd frontend
npm run build
if [ $? -ne 0 ]; then
    echo "XATO: Frontend build muvaffaqiyatsiz!"
    exit 1
fi

echo ""
echo "[2/3] Fayllar backend/public ga ko'chirilmoqda..."
cd ..
rm -rf backend/public
cp -r frontend/dist backend/public
if [ $? -ne 0 ]; then
    echo "XATO: Fayllar ko'chirilmadi!"
    exit 1
fi

echo ""
echo "[3/3] Backend ishga tushirilmoqda..."
cd backend
echo ""
echo "========================================"
echo "  Tayyor! Brauzerni oching:"
echo "  http://localhost:5000"
echo "========================================"
echo ""
npm start
