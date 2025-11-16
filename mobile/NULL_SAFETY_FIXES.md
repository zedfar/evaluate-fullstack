# Null Safety Fixes - Mobile Models

## Overview
Model di mobile sudah disesuaikan dengan response API backend berdasarkan dokumentasi di:
- `backend/PRODUCTS_API_FEATURES.md`
- `backend/USERS_API_FEATURES.md`

## ✅ Perubahan yang Dilakukan

### 1. Model Product (`lib/models/product.dart`)

**Fields yang dibuat nullable:**
- `createdBy` (String? - API TIDAK mengirim field ini)
- `createdAt` (String? - selalu dikirim tapi dibuat nullable untuk safety)
- `updatedAt` (String? - selalu dikirim tapi dibuat nullable untuk safety)

### 1.1 Model ProductCreator (`lib/models/product.dart`)

**⚠️ FIX CRITICAL: Fields yang dibuat nullable:**
- `email` (String? - **API TIDAK mengirim field ini!**) ⬅️ **INI PENYEBAB ERROR**

Response API hanya mengirim:
```json
"creator": {
    "id": "...",
    "username": "admin"
    // ❌ TIDAK ADA EMAIL
}
```

**Fields yang sudah nullable sejak awal:**
- `description` ✅
- `stockStatus` ✅ (selalu dikirim API tapi nullable untuk safety)
- `imageUrl` ✅
- `category` ✅
- `creator` ✅

### 2. Model Category (`lib/models/product.dart`)

**Fields yang dibuat nullable:**
- `createdBy` (String? - tidak selalu ada di nested response)
- `createdAt` (String? - tidak selalu ada di nested response)
- `updatedAt` (String? - tidak selalu ada di nested response)

**Fields yang sudah nullable:**
- `description` ✅

### 3. Model User (`lib/models/user.dart`)

**Sudah benar! Tidak perlu perubahan.**

Fields nullable yang sudah sesuai dengan API:
- `roleId` ✅
- `role` ✅
- `isActive` ✅
- `createdAt` ✅
- `updatedAt` ✅

### 4. Model Role (`lib/models/user.dart`)

**Sudah benar! Tidak perlu perubahan.**

Fields nullable yang sudah sesuai:
- `description` ✅ (bisa null sesuai API docs)
- `createdAt` ✅
- `updatedAt` ✅

## 🔧 Langkah yang Harus Dilakukan User

### 1. Regenerate JSON Serialization Code

Jalankan command ini di terminal:

```bash
cd mobile
flutter pub run build_runner build --delete-conflicting-outputs
```

**Penting!** Command ini HARUS dijalankan setiap kali model berubah.

### 2. Hot Restart (BUKAN Hot Reload)

Setelah regenerate code, lakukan **Hot Restart**:

```bash
# Stop app dan restart
flutter run

# Atau tekan 'R' (huruf besar) di terminal
```

**⚠️ Hot Reload (r kecil) tidak cukup!** Harus Hot Restart (R besar).

## 📋 Mapping Model ke API Response

### Product API Response
```json
{
  "id": "...",                      // String (required)
  "name": "Gaming Laptop",          // String (required)
  "description": "...",             // String? (nullable)
  "price": 15000000,                // double (required)
  "stock": 5,                       // int (required)
  "low_stock_threshold": 10,        // int (required)
  "stock_status": "yellow",         // String? (selalu ada tapi nullable)
  "image_url": "https://...",       // String? (nullable)
  "category_id": "...",             // String (required)
  "category": {...},                // Category? (nullable)
  "creator": {...},                 // ProductCreator? (nullable)
  "created_by": "...",              // String? (nullable) ⬅️ FIXED
  "created_at": "2025-01-15...",    // String? (nullable) ⬅️ FIXED
  "updated_at": "2025-01-15..."     // String? (nullable) ⬅️ FIXED
}
```

### User API Response
```json
{
  "id": "...",                      // String (required)
  "username": "johndoe",            // String (required)
  "email": "john@example.com",      // String (required)
  "full_name": "John Doe",          // String (required)
  "is_active": true,                // bool? (nullable) ✅
  "role_id": "...",                 // String? (nullable) ✅
  "role": {...},                    // Role? (nullable) ✅
  "created_at": "2025-01-15...",    // String? (nullable) ✅
  "updated_at": "2025-01-15..."     // String? (nullable) ✅
}
```

### Role Response (Nested in User)
```json
{
  "id": "...",                      // String (required)
  "name": "admin",                  // String (required)
  "description": "Administrator",   // String? (nullable) ✅
  "created_at": "2025-01-15...",    // String? (nullable) ✅
  "updated_at": "2025-01-15..."     // String? (nullable) ✅
}
```

## ⚠️ Error yang Sudah Diperbaiki

### Error 1: "type 'Null' is not a subtype of type 'String'" di Product
**Penyebab:** Field `createdAt`, `updatedAt`, `createdBy` di Product model tidak nullable tapi API tidak selalu mengirim field ini.

**Fix:** Dibuat nullable (String? dan constructor parameter optional)

### Error 1.1: "type 'Null' is not a subtype of type 'String'" di ProductCreator
**⚠️ CRITICAL ERROR**

**Penyebab:** Field `email` di ProductCreator model adalah required (String) tapi **API TIDAK pernah mengirim field ini!**

API Response:
```json
"creator": {
    "id": "...",
    "username": "admin"
    // ❌ NO EMAIL FIELD
}
```

**Fix:** Dibuat nullable `email: String?` dan optional di constructor

### Error 2: "type 'Null' is not a subtype of type 'String'" di Category
**Penyebab:** Field `createdAt`, `updatedAt`, `createdBy` di Category model tidak nullable.

**Fix:** Dibuat nullable

### Error 3: "bool? can't be assigned to bool" di UsersPage
**Penyebab:** Menggunakan `user.isActive` langsung tanpa handle null.

**Fix:** Sudah diperbaiki dengan `user.isActive ?? false` di 6 lokasi.

## 🧪 Testing

Setelah regenerate code, test dengan:

1. **Login** dengan user admin dan user biasa
2. **Fetch products** di home page
3. **Fetch users** di admin page
4. **Search products** dengan berbagai filter
5. **Pagination** di product list dan user list

## 📝 Catatan Penting

### Kapan Harus Regenerate Code?

Regenerate code **SETIAP** kali:
- ✅ Mengubah field di model (@JsonSerializable class)
- ✅ Menambah/menghapus field
- ✅ Mengubah tipe field (misal dari String ke String?)
- ✅ Mengubah @JsonKey annotation

### Best Practice

1. **Selalu gunakan nullable untuk optional fields**
   ```dart
   final String? description;  // ✅ Good
   final String description;   // ❌ Bad jika bisa null dari API
   ```

2. **Handle null di UI dengan ?? operator**
   ```dart
   Text(product.description ?? 'No description')  // ✅ Good
   Text(product.description)                       // ❌ Error jika null
   ```

3. **Check null sebelum access nested objects**
   ```dart
   product.category?.name ?? 'No category'  // ✅ Good
   product.category.name                     // ❌ Error jika category null
   ```

## 🎯 Hasil Akhir

Setelah fixes ini, aplikasi mobile akan:
- ✅ **Tidak ada lagi error "Null is not subtype of String"**
- ✅ **Login berhasil tanpa crash**
- ✅ **Fetch products berhasil dengan semua field**
- ✅ **Fetch users berhasil di admin page**
- ✅ **Handle semua kasus null dari API dengan aman**

## 🔗 Files yang Diubah

1. ✅ `mobile/lib/models/product.dart` - Product, Category, dan ProductCreator
2. ✅ `mobile/lib/models/user.dart` - User dan Role (sudah benar sebelumnya)
3. ✅ `mobile/lib/screens/admin/users_page.dart` - Handle isActive nullable
4. ✅ `mobile/lib/widgets/product_card.dart` - Handle nullable fields
5. ✅ `mobile/lib/screens/user/product_detail_page.dart` - Handle creator.email nullable

## 📚 Referensi

- Backend API Docs: `backend/PRODUCTS_API_FEATURES.md`
- Backend API Docs: `backend/USERS_API_FEATURES.md`
- Troubleshooting: `mobile/TROUBLESHOOTING.md`
