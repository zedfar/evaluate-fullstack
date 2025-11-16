# Cara Menjalankan Project Secara Lokal

Dokumen ini berisi langkah lengkap menjalankan:

1. **Frontend** – Vite React (Web)
2. **Backend** – Python FastAPI (API Server)
3. **Mobile** – Flutter (iOS/Android/Web)

---

## 📋 Prerequisites

Pastikan sudah terinstall:
- **Node.js** (v18+) dan npm
- **Python** (3.11+)
- **Conda** (untuk Python virtual environment)
- **Flutter** (3.0+)
- **PostgreSQL** (untuk database)
- **Android Studio** / **Xcode** (untuk mobile development)

---

## 1️⃣ Frontend – Vite React

### Masuk ke Direktori Web

```bash
cd web
```

### Install Dependencies

```bash
npm install
```

### Jalankan Development Server

```bash
npm run dev
```

Aplikasi akan berjalan di: **http://localhost:5173**

### Build Production (opsional)

```bash
npm run build
```

---

## 2️⃣ Backend – Python FastAPI

### Masuk ke Direktori Backend

```bash
cd backend
```

### 1. Buat & Aktifkan Virtual Environment (Conda)

Buat environment:

```bash
conda create -n fastapi-env python=3.11 -y
```

Aktifkan:

```bash
conda activate fastapi-env
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Setup Database

Pastikan PostgreSQL sudah berjalan, lalu buat database:

```bash
# Login ke PostgreSQL
psql -U postgres

# Buat database
CREATE DATABASE products_db;

# Keluar
\q
```

### 4. Setup Environment Variables

Buat file `.env` di folder `backend/`:

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/products_db
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### 5. Jalankan Backend

Menggunakan run.py:

```bash
python run.py
```

Atau menggunakan Uvicorn langsung:

```bash
uvicorn app.main:app --reload
```

Backend akan berjalan di: **http://localhost:8000**

API Docs: **http://localhost:8000/docs**

---

## 3️⃣ Mobile – Flutter

### Masuk ke Direktori Mobile

```bash
cd mobile
```

### 1. Install Dependencies

```bash
flutter pub get
```

### 2. Generate JSON Serialization Code (PENTING!)

**⚠️ WAJIB** dijalankan setelah install atau setiap kali model berubah:

```bash
flutter pub run build_runner build --delete-conflicting-outputs
```

Atau gunakan watch mode (auto-regenerate saat file berubah):

```bash
flutter pub run build_runner watch --delete-conflicting-outputs
```

### 3. Konfigurasi API URL

Edit `lib/config/app_config.dart`:

**Untuk Development (Local Backend):**
```dart
// Android Emulator
static const String apiBaseUrl = 'http://10.0.2.2:8000/api/v1';

// iOS Simulator
static const String apiBaseUrl = 'http://localhost:8000/api/v1';

// Physical Device (ganti dengan IP komputer Anda)
static const String apiBaseUrl = 'http://192.168.X.X:8000/api/v1';
```

**Untuk Production (sudah default):**
```dart
static const String apiBaseUrl = 'https://dev-svc-products.vercel.app/api/v1';
```

### 4. Jalankan Aplikasi

#### Option A: Web Browser (Chrome)
```bash
flutter run -d chrome
```

#### Option B: Android Emulator
```bash
# Pastikan emulator sudah running
flutter emulators --launch <emulator_id>

# Atau buka dari Android Studio, lalu:
flutter run
```

#### Option C: iOS Simulator (Mac only)
```bash
open -a Simulator

# Tunggu simulator terbuka, lalu:
flutter run
```

#### Option D: Physical Device
```bash
# Connect device via USB dan enable USB debugging
# Pastikan device terdeteksi:
flutter devices

# Run:
flutter run
```

### 5. Troubleshooting

Jika mengalami error, lihat:
- **`mobile/TROUBLESHOOTING.md`** - Panduan lengkap troubleshooting
- **`mobile/NULL_SAFETY_FIXES.md`** - Fix untuk error null safety

**Common Issues:**

❌ **Error: "type 'Null' is not a subtype of type 'String'"**
```bash
# Regenerate JSON code
flutter pub run build_runner build --delete-conflicting-outputs

# Hot Restart (tekan R, bukan r)
```

❌ **Error: Build runner conflict**
```bash
flutter clean
flutter pub get
flutter pub run build_runner build --delete-conflicting-outputs
```

---

## 🎯 Credentials untuk Testing

### Admin Account
- Username: `admin`
- Password: `admin123`

### User Account
- Username: `user`
- Password: `user123`

---

## 🌐 URLs - Production (Live Demo)

Jika tidak ingin run local, gunakan production URLs:

- **Web App**: https://dev-web-products.vercel.app/
- **API Backend**: https://dev-svc-products.vercel.app/api/v1
- **API Docs**: https://dev-svc-products.vercel.app/docs

Mobile app sudah dikonfigurasi untuk menggunakan production API secara default.

---

## 📚 Dokumentasi Tambahan

- **`README.md`** - Overview project dan features
- **`mobile/README.md`** - Mobile app specific guide
- **`mobile/TROUBLESHOOTING.md`** - Mobile troubleshooting
- **`mobile/NULL_SAFETY_FIXES.md`** - Null safety fixes
- **`backend/PRODUCTS_API_FEATURES.md`** - Products API documentation
- **`backend/USERS_API_FEATURES.md`** - Users API documentation

---

## 🚀 Quick Start (All in One)

### Terminal 1 - Backend
```bash
cd backend
conda activate fastapi-env
python run.py
```

### Terminal 2 - Frontend
```bash
cd web
npm run dev
```

### Terminal 3 - Mobile
```bash
cd mobile
flutter pub run build_runner build --delete-conflicting-outputs
flutter run -d chrome
```

---

## ✅ Checklist

Sebelum run, pastikan:

- [ ] PostgreSQL sudah running
- [ ] Database `products_db` sudah dibuat
- [ ] File `.env` sudah dikonfigurasi di backend
- [ ] Dependencies sudah diinstall (npm, pip, flutter pub get)
- [ ] Build runner sudah dijalankan untuk mobile
- [ ] Emulator/simulator sudah running (untuk mobile)

---

## 🆘 Butuh Bantuan?

Jika masih error:
1. Cek file `TROUBLESHOOTING.md` di folder mobile
2. Cek logs di console/terminal
3. Pastikan semua dependencies sudah terinstall
4. Coba clean install ulang

---
