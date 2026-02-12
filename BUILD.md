# Anilegeon - Production Build & Deployment

## 🚀 Bitta portda ishlatish (Production Mode)

### 1️⃣ Frontend Build Qilish
```bash
cd frontend
npm run build
```

### 2️⃣ Build fayllarni Backend'ga Ko'chirish
```bash
cd ..
npm run copy-build
```

### 3️⃣ Faqat Backend'ni Ishga Tushirish  
```bash
cd backend
npm start
```

Endi **faqat backend** ishga tushadi va frontend'ni ham `http://localhost:5000` da serve qiladi! ✅

---

## Development Mode (Ikki port)

Agar development qilmoqchi bo'lsangiz:

```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend  
cd frontend
npm run dev
```

- Backend: `http://localhost:5000`
- Frontend: `http://localhost:5173`

---

## Automation Script (Root papkadan)

**Production build:**
```bash
npm run build    # Frontend build + backend'ga copy
npm start        # Backend ishga tushadi
```

**Development:**
```bash
npm run dev      # Ikkisini birdan ishga tushiradi
```

---

## Til Almashtirishni Test Qilish

1. Brauzerni oching: `http://localhost:5000`
2. Hard refresh: `Ctrl + Shift + R`
3. Navbar'da globus belgisini (🌐) bosing
4. Tilni tanlang: UZ 🇺🇿 / RU 🇷🇺 / EN 🇬🇧

---

## ⚙️ Texnik Tafsilotlar

- **Backend**: Express server (port 5000)
- **Frontend**: React + Vite (build → static files)
- **Static Files**: `backend/public/` papkasida
- **Til Switching**: `i18next` + localStorage

✅ Tayyor!
