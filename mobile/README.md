# Dev Mobile Products - Flutter App

Aplikasi mobile Flutter untuk manajemen produk, dibangun berdasarkan aplikasi web yang ada di folder `../web`.

## Fitur Utama

### Authentication
- ✅ Login dengan username dan password
- ✅ Register user baru
- ✅ JWT-based authentication dengan token refresh
- ✅ Secure token storage menggunakan flutter_secure_storage
- ✅ Role-based access control (Admin & User)

### User Features
- ✅ Home page dengan featured products
- ✅ Product catalog dengan filtering, sorting, dan pagination
- ✅ Search products (debounced)
- ✅ Filter by category
- ✅ Sort by name, price, stock, created date
- ✅ Product detail page dengan informasi lengkap
- ✅ Quantity selector
- ✅ Stock status indicator

### Admin Features
- ✅ Product management dashboard
- ✅ Product CRUD operations (Create, Read, Update, Delete)
- ✅ Advanced filtering dan sorting
- ✅ User management
- ✅ Toggle user active/inactive status
- ✅ Pagination untuk semua list

## Teknologi yang Digunakan

- **Flutter SDK**: Framework untuk mobile development
- **Riverpod**: State management
- **Dio**: HTTP client untuk API calls
- **GoRouter**: Navigation dan routing
- **flutter_secure_storage**: Secure storage untuk tokens
- **json_annotation**: JSON serialization
- **intl**: Formatting (currency, date)

## Struktur Project

```
mobile/
├── lib/
│   ├── config/
│   │   ├── app_config.dart          # Konfigurasi aplikasi
│   │   └── router.dart               # Routing dan navigation guards
│   ├── models/
│   │   ├── user.dart                 # User, Role, Auth models
│   │   ├── product.dart              # Product, Category models
│   │   └── api_response.dart         # API response models
│   ├── services/
│   │   ├── api_service.dart          # Base API service dengan Dio
│   │   ├── auth_service.dart         # Authentication API
│   │   ├── product_service.dart      # Product API
│   │   ├── user_service.dart         # User API
│   │   └── category_service.dart     # Category API
│   ├── providers/
│   │   ├── auth_provider.dart        # Authentication state
│   │   ├── product_provider.dart     # Product state
│   │   └── user_provider.dart        # User state
│   ├── screens/
│   │   ├── auth/
│   │   │   ├── login_page.dart       # Login screen
│   │   │   └── register_page.dart    # Register screen
│   │   ├── user/
│   │   │   ├── home_page.dart        # User home dengan featured products
│   │   │   ├── products_page.dart    # Product catalog
│   │   │   └── product_detail_page.dart  # Product detail
│   │   └── admin/
│   │       ├── dashboard_page.dart   # Admin product management
│   │       └── users_page.dart       # Admin user management
│   ├── widgets/
│   │   └── product_card.dart         # Reusable product card
│   ├── utils/
│   │   └── storage_utils.dart        # Storage utilities
│   └── main.dart                      # Entry point
├── pubspec.yaml                       # Dependencies
└── README.md                          # Dokumentasi
```

## Setup dan Instalasi

### Prerequisites

1. **Flutter SDK** (versi 3.0.0 atau lebih baru)
   ```bash
   # Verifikasi instalasi Flutter
   flutter doctor
   ```

2. **Android Studio** atau **VS Code** dengan Flutter plugin

3. **Emulator/Device**
   - Android emulator atau physical device
   - iOS simulator atau physical device (untuk macOS)

### Langkah Instalasi

1. **Clone repository** (jika belum)
   ```bash
   git clone <repository-url>
   cd evaluate-fullstack/mobile
   ```

2. **Install dependencies**
   ```bash
   flutter pub get
   ```

3. **Generate kode untuk JSON serialization**
   ```bash
   flutter pub run build_runner build --delete-conflicting-outputs
   ```

4. **Konfigurasi API URL**

   Edit file `lib/config/app_config.dart`:
   ```dart
   // Untuk development (local)
   static const String apiBaseUrl = 'http://localhost:8000/api/v1';

   // Atau gunakan IP komputer Anda jika testing di physical device
   static const String apiBaseUrl = 'http://192.168.1.X:8000/api/v1';

   // Untuk staging/production
   static const bool useStaging = true;  // atau false untuk production
   ```

5. **Run aplikasi**
   ```bash
   # Jalankan di debug mode
   flutter run

   # Atau pilih device spesifik
   flutter run -d <device-id>

   # List available devices
   flutter devices
   ```

## Konfigurasi Backend

Pastikan backend API sudah berjalan. Lihat dokumentasi di folder `../web` atau `../backend`.

### Development dengan Local Backend

1. Start backend server di `http://localhost:8000`

2. Jika testing di physical device Android, gunakan IP komputer:
   ```dart
   // lib/config/app_config.dart
   static const String apiBaseUrl = 'http://192.168.1.100:8000/api/v1';
   ```

3. Untuk iOS simulator, gunakan:
   ```dart
   static const String apiBaseUrl = 'http://localhost:8000/api/v1';
   ```

### Development dengan Remote Backend

Gunakan staging atau production URL yang sudah tersedia:
```dart
// lib/config/app_config.dart
static const bool useStaging = true;
```

## Testing

### Login Credentials

Gunakan credentials yang sama dengan web app:

**Admin Account:**
- Username: `admin`
- Password: `admin123`

**User Account:**
- Username: `user`
- Password: `user123`

Atau register account baru melalui halaman register.

## API Integration

Aplikasi ini menggunakan API yang sama dengan web app dengan endpoint:

```
POST   /auth/login              - Login
POST   /auth/register           - Register
GET    /auth/me                 - Get current user
POST   /auth/logout             - Logout
POST   /auth/refresh            - Refresh token

GET    /products                - Get all products (dengan filtering)
GET    /products/:id            - Get product by ID
POST   /products                - Create product (admin)
PUT    /products/:id            - Update product (admin)
DELETE /products/:id            - Delete product (admin)

GET    /users                   - Get all users (admin)
GET    /users/:id               - Get user by ID (admin)
POST   /users                   - Create user (admin)
PUT    /users/:id               - Update user (admin)
DELETE /users/:id               - Delete user (admin)

GET    /categories              - Get all categories
GET    /roles                   - Get all roles
```

## Fitur yang Sudah Diimplementasi

### ✅ Authentication
- [x] Login page dengan form validation
- [x] Register page dengan form validation
- [x] Token storage dengan flutter_secure_storage
- [x] Auto token refresh pada 401 response
- [x] Route guards berdasarkan authentication status
- [x] Role-based navigation (admin vs user)

### ✅ User Features
- [x] Home page dengan hero section
- [x] Featured products (8 items)
- [x] Search bar dengan debounce
- [x] Product catalog dengan grid view
- [x] Filter by category
- [x] Sort by multiple fields
- [x] Pagination
- [x] Product detail page
- [x] Quantity selector
- [x] Stock status indicator
- [x] Currency formatting (IDR)

### ✅ Admin Features
- [x] Product management dashboard
- [x] Product list dengan filtering
- [x] Search products (debounced)
- [x] Filter by category
- [x] Sort by name, price, stock, date
- [x] Pagination controls
- [x] Delete product dengan confirmation
- [x] Stock status visualization
- [x] User management page
- [x] User list dengan filtering
- [x] Toggle active/inactive status
- [x] Delete user dengan confirmation

## Build untuk Production

### Android APK

```bash
# Build APK
flutter build apk --release

# Build APK split per ABI (smaller size)
flutter build apk --split-per-abi --release

# Output: build/app/outputs/flutter-apk/app-release.apk
```

### Android App Bundle (untuk Google Play)

```bash
flutter build appbundle --release

# Output: build/app/outputs/bundle/release/app-release.aab
```

### iOS

```bash
flutter build ios --release

# Atau buka di Xcode
open ios/Runner.xcworkspace
```

## Troubleshooting

### 1. Error "Connection refused"

**Problem**: Tidak bisa connect ke backend API

**Solution**:
- Pastikan backend sudah running
- Cek API URL di `lib/config/app_config.dart`
- Jika testing di physical device, gunakan IP address komputer, bukan `localhost`
- Pastikan firewall tidak memblokir koneksi

### 2. Error "HandshakeException: Handshake error"

**Problem**: SSL certificate error (pada production/staging)

**Solution**:
- Pastikan URL menggunakan `https://` untuk production
- Cek apakah SSL certificate valid

### 3. Build runner errors

**Problem**: Error saat generate kode JSON serialization

**Solution**:
```bash
# Clean dan rebuild
flutter clean
flutter pub get
flutter pub run build_runner build --delete-conflicting-outputs
```

### 4. Token expired errors

**Problem**: Token expired dan tidak auto-refresh

**Solution**:
- Cek konfigurasi `useRefreshToken` di `app_config.dart`
- Pastikan refresh token endpoint berfungsi
- Clear app data dan login ulang

## Development Tips

### Hot Reload vs Hot Restart

- **Hot Reload** (`r` di terminal): Untuk perubahan UI
- **Hot Restart** (`R` di terminal): Untuk perubahan state/logic
- **Full Restart**: Stop dan run ulang untuk perubahan major

### Debug Mode

```bash
# Run dengan verbose logging
flutter run -v

# Run dengan device logs
flutter logs
```

### Performance

```bash
# Check app performance
flutter run --profile

# Build mode untuk testing performance
flutter build apk --release
```

## Perbedaan dengan Web App

1. **Navigation**: Menggunakan go_router instead of react-router
2. **State Management**: Riverpod instead of Zustand + TanStack Query
3. **HTTP Client**: Dio instead of Axios
4. **Storage**: flutter_secure_storage instead of localStorage
5. **UI Framework**: Material Design widgets instead of React + TailwindCSS

## Fitur yang Bisa Ditambahkan

- [ ] Product create/edit forms (admin)
- [ ] User create/edit forms (admin)
- [ ] Category management
- [ ] Role management
- [ ] Image upload untuk products
- [ ] Shopping cart functionality
- [ ] Order management
- [ ] Push notifications
- [ ] Offline mode dengan local database
- [ ] Biometric authentication
- [ ] Dark mode
- [ ] Multi-language support

## Kontribusi

Jika ingin menambahkan fitur atau fix bugs:

1. Buat branch baru
2. Implementasi perubahan
3. Test di emulator dan physical device
4. Submit pull request

## Lisensi

Sesuai dengan lisensi project utama.

## Kontak

Untuk pertanyaan atau issues, silakan buka issue di repository atau hubungi maintainer.
