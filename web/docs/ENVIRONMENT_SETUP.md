# Environment Setup Guide

Panduan lengkap untuk setup environment variables di aplikasi ini.

## 📋 Overview

Aplikasi ini menggunakan **Vite** untuk build tool, dan Vite memiliki cara khusus untuk handle environment variables:

1. ✅ **Environment variables harus dimulai dengan prefix `VITE_`** untuk dapat diakses di client-side
2. ✅ File `.env.[mode]` akan otomatis di-load sesuai dengan mode yang dijalankan
3. ✅ File `.env` sebagai fallback default untuk semua mode

---

## 🗂️ File Environment

```
.env                  # Default fallback (digunakan di semua mode)
.env.development      # Development mode (npm run dev)
.env.staging          # Staging mode (npm run build:staging)
.env.production       # Production mode (npm run build)
.env.example          # Template untuk developer (tidak di-commit)
```

---

## 🔐 Environment Variables

### Available Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_APP_NAME` | Nama aplikasi | Dev Web Products |
| `VITE_API_BASE_URL` | Base URL API server (tanpa /api/v1/) | http://localhost:8000 |
| `VITE_MOCK_API` | Use mock data instead of real API | false |

---

## ⚙️ Setup untuk Development

### 1. Buat file `.env.development`

```env
# Development Environment
VITE_APP_NAME=Dev Web Products (Local)
VITE_API_BASE_URL=http://localhost:8000
VITE_MOCK_API=false
```

### 2. Jalankan development server

```bash
npm run dev
```

Ini akan:
- Load file `.env.development`
- Connect ke API di `http://localhost:8000`
- Mode: `development`

### 3. Verify Configuration

Saat development, console akan menampilkan:

```
🔧 Environment Config: {
  MODE: 'development',
  APP_NAME: 'Dev Web Products (Local)',
  BASE_URL: 'http://localhost:8000',
  MOCK_API: false
}
```

---

## 🌐 Setup untuk Production

### 1. Buat file `.env.production`

```env
# Production Environment
VITE_APP_NAME=Dev Web Products
VITE_API_BASE_URL=https://dev-svc-products.vercel.app
VITE_MOCK_API=false
```

### 2. Build untuk production

```bash
npm run build
# atau
npm run build:production
```

Ini akan:
- Load file `.env.production`
- Connect ke API production
- Mode: `production`
- Output: `dist/` folder

---

## 🧪 Setup untuk Staging

### 1. Buat file `.env.staging`

```env
# Staging Environment
VITE_APP_NAME=Dev Web Products (Staging)
VITE_API_BASE_URL=https://staging-svc-products.vercel.app
VITE_MOCK_API=false
```

### 2. Build untuk staging

```bash
npm run build:staging
```

Ini akan:
- Load file `.env.staging`
- Connect ke API staging
- Mode: `staging`

---

## 📝 NPM Scripts Reference

```bash
# Development (uses .env.development)
npm run dev

# Build Production (uses .env.production)
npm run build
npm run build:production

# Build Staging (uses .env.staging)
npm run build:staging

# Preview built app
npm run preview
npm run preview:staging
```

---

## 🔍 Debugging Environment

### Check loaded environment variables

Di development mode, buka browser console dan jalankan:

```js
// Check all VITE_ variables
console.log(import.meta.env);

// Check specific variable
console.log(import.meta.env.VITE_API_BASE_URL);

// Check mode
console.log(import.meta.env.MODE);
```

### Common Issues

#### ❌ Variable tidak terbaca (undefined)

**Problem:**
```js
console.log(import.meta.env.API_BASE_URL); // undefined
```

**Solution:**
Variable harus dimulai dengan `VITE_` prefix:
```js
console.log(import.meta.env.VITE_API_BASE_URL); // ✅ works
```

#### ❌ .env file tidak terbaca

**Troubleshooting:**

1. **Restart dev server** - Vite harus di-restart untuk load .env changes
   ```bash
   # Stop server (Ctrl+C)
   npm run dev
   ```

2. **Check file name** - Pastikan nama file exact match:
   - ✅ `.env.development`
   - ❌ `.env.dev`
   - ❌ `env.development`

3. **Check file location** - Harus di root folder project:
   ```
   dev-web-products/
   ├── .env.development  ← Here
   ├── package.json
   └── src/
   ```

#### ❌ Still using fallback URL

**Problem:**
Console shows fallback URL instead of localhost.

**Check:**

1. Verify `.env.development` exists dan berisi:
   ```env
   VITE_API_BASE_URL=http://localhost:8000
   ```

2. Verify constants.ts menggunakan `VITE_` prefix:
   ```ts
   const BASE_URL = import.meta.env.VITE_API_BASE_URL || "fallback";
   ```

3. Restart server:
   ```bash
   npm run dev
   ```

---

## 🔒 Security Best Practices

### ⚠️ NEVER commit sensitive data

**Add to `.gitignore`:**
```gitignore
.env
.env.local
.env.*.local
```

**Safe to commit:**
```
.env.example       ✅ Template only
.env.development   ✅ Localhost config
.env.staging       ✅ Non-sensitive staging URL
.env.production    ✅ Public production URL
```

### 🚫 Don't put secrets in VITE_ variables

Vite variables are **bundled into the client code** and visible to users!

**❌ BAD:**
```env
VITE_API_SECRET_KEY=super-secret-key  # Exposed to client!
```

**✅ GOOD:**
```env
VITE_API_BASE_URL=https://api.example.com  # OK, it's public
```

---

## 🎯 Environment Priority

Vite loads environment files in this order (later overrides earlier):

```
.env                    # Loaded in all cases
.env.local              # Loaded in all cases, ignored by git
.env.[mode]             # Only loaded in specified mode
.env.[mode].local       # Only loaded in specified mode, ignored by git
```

**Example for `npm run dev`:**
```
.env                    # ← Loaded first
.env.local              # ← Overrides .env
.env.development        # ← Overrides .env.local
.env.development.local  # ← Final override (highest priority)
```

---

## 🧰 Useful Commands

### Quick Setup from Template

```bash
# Copy template for development
cp .env.example .env.development

# Edit the file
nano .env.development
# or
code .env.development
```

### Check which file is loaded

```bash
# Show current mode
npm run dev -- --debug
```

### Test different environments locally

```bash
# Test with staging config
npm run build:staging
npm run preview:staging

# Test with production config
npm run build:production
npm run preview
```

---

## 📚 Additional Resources

- [Vite Environment Variables Guide](https://vite.dev/guide/env-and-mode.html)
- [Vite Modes](https://vite.dev/guide/env-and-mode.html#modes)
- [Environment Variables Best Practices](https://12factor.net/config)

---

## ✅ Checklist

Setup checklist untuk new developers:

- [ ] Copy `.env.example` to `.env.development`
- [ ] Update `VITE_API_BASE_URL` ke localhost backend URL
- [ ] Verify backend server is running di URL yang sama
- [ ] Run `npm run dev`
- [ ] Check browser console untuk environment config log
- [ ] Test API calls dan verify hitting localhost

---

## 🆘 Need Help?

Jika masih ada masalah:

1. Check browser console untuk config log
2. Verify .env file name dan location
3. Restart dev server
4. Clear browser cache
5. Check Network tab untuk verify API calls ke URL yang benar

Jika masih error, check `docs/API_TROUBLESHOOTING.md` untuk debugging tips.
