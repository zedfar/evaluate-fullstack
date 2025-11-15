# Dev Products - Full Stack Product Management System

Full-stack application untuk manajemen produk dengan authentication, role-based access control, dan UI multi-platform (Web & Mobile). Sistem ini menyediakan fitur lengkap untuk admin mengelola produk dan user untuk menjelajahi katalog produk.

## 🚀 Quick Access

> **Live Demo:** [Web App](https://dev-web-products.vercel.app/) | [API Docs](https://dev-svc-products.vercel.app/docs)
>

## 📋 Overview

Project ini terdiri dari 3 komponen utama:

```
evaluate-fullstack/
├── backend/     # FastAPI REST API Server
├── web/         # React SPA (Single Page Application)
└── mobile/      # Flutter Mobile App (Android & iOS)
```

### 🎯 Tujuan Project

Membangun sistem manajemen produk full-stack yang mencakup:
- ✅ RESTful API backend dengan FastAPI
- ✅ Modern web interface dengan React + TailwindCSS
- ✅ Cross-platform mobile app dengan Flutter
- ✅ Authentication & Authorization (JWT)
- ✅ Role-based access control (Admin & User)
- ✅ CRUD operations untuk produk dan user
- ✅ Advanced filtering, sorting, dan pagination

---

## 🌐 Live Demo

Aplikasi sudah di-deploy dan bisa diakses secara online:

### 🖥️ Web Application
**🔗 URL:** [https://dev-web-products.vercel.app/](https://dev-web-products.vercel.app/)

**Try it now!** Login dengan credentials berikut:


### 📚 API Documentation
**🔗 Interactive Docs:** [https://dev-svc-products.vercel.app/docs](https://dev-svc-products.vercel.app/docs#/)


Explore dan test semua API endpoints dengan Swagger UI.

**API Base URL:** `https://dev-svc-products.vercel.app/api/v1`

### 📱 Mobile App
Flutter mobile app bisa di-build sendiri (lihat [Mobile Documentation](./mobile/README.md)).

**✅ App sudah dikonfigurasi untuk connect ke production API** - Langsung `flutter run` dan bisa login!

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Clients                               │
│  ┌──────────────────┐           ┌──────────────────┐        │
│  │   React Web App  │           │  Flutter Mobile  │        │
│  │   (Port 5093)    │           │   Android/iOS    │        │
│  └────────┬─────────┘           └─────────┬────────┘        │
│           │                               │                  │
│           └───────────────┬───────────────┘                  │
│                           │                                  │
│                           ▼                                  │
│           ┌───────────────────────────────┐                  │
│           │     FastAPI Backend           │                  │
│           │     (Port 8000)               │                  │
│           │   REST API + JWT Auth         │                  │
│           └───────────────┬───────────────┘                  │
│                           │                                  │
│                           ▼                                  │
│           ┌───────────────────────────────┐                  │
│           │   PostgreSQL Database         │                  │
│           │   (Users, Products, etc)      │                  │
│           └───────────────────────────────┘                  │
└─────────────────────────────────────────────────────────────┘
```

---

## 📦 Tech Stack

### Backend (FastAPI)
| Technology | Version | Purpose |
|-----------|---------|---------|
| Python | 3.11+ | Programming language |
| FastAPI | 0.115+ | Web framework |
| SQLAlchemy | 2.0+ | ORM |
| PostgreSQL | 15+ | Database |
| Alembic | 1.14+ | Database migrations |
| Pydantic | 2.0+ | Data validation |
| PyJWT | 2.9+ | JWT authentication |
| Passlib | 1.7+ | Password hashing |
| Uvicorn | 0.32+ | ASGI server |

**[📖 Backend Documentation →](./backend/README.md)**

### Web Frontend (React)
| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 19.1.0 | UI library |
| TypeScript | 5.9.3 | Type safety |
| Vite | 7.2.2 | Build tool |
| TailwindCSS | 3.4.13 | Styling |
| Zustand | 5.0.0 | State management (auth) |
| TanStack Query | 5.51.0 | Server state |
| React Router | 7.9.5 | Routing |
| Axios | 1.7.2 | HTTP client |
| React Hook Form | 7.66.0 | Form handling |

**[📖 Web Documentation →](./web/README.md)**

### Mobile App (Flutter)
| Technology | Version | Purpose |
|-----------|---------|---------|
| Flutter | 3.0+ | Mobile framework |
| Dart | 3.0+ | Programming language |
| Riverpod | 2.5.1 | State management |
| Dio | 5.4.0 | HTTP client |
| GoRouter | 13.0.0 | Navigation |
| flutter_secure_storage | 9.0.0 | Secure token storage |
| json_annotation | 4.8.1 | JSON serialization |
| intl | 0.19.0 | Formatting |

**[📖 Mobile Documentation →](./mobile/README.md)**

---

## 🎨 Features

### 🔐 Authentication & Authorization

**Login & Registration**
- JWT-based authentication dengan access & refresh tokens
- Secure password hashing (bcrypt)
- Role-based access control (Admin & User)
- Protected routes/screens
- Auto token refresh on expiration

**User Roles:**
- **Admin**: Full access (product management, user management)
- **User**: Limited access (view products, catalog browsing)

### 👥 User Management (Admin Only)

- ✅ View all users dengan pagination
- ✅ Create new users dengan role assignment
- ✅ Edit user details (username, email, full name, role)
- ✅ Delete users dengan confirmation
- ✅ Toggle user active/inactive status
- ✅ Search users by username, email, or full name
- ✅ Sort by username, email, full name, created date

### 📦 Product Management

**Admin Features:**
- ✅ Create products dengan form validation
- ✅ Read product list dengan pagination
- ✅ Update product details (name, description, price, stock, category)
- ✅ Delete products dengan confirmation
- ✅ Update stock levels
- ✅ Stock status indicators (low stock alerts)
- ✅ Advanced filtering:
  - Search by product name (debounced 500ms)
  - Filter by category
  - Sort by: name, price, stock, status, created date
  - Order: ascending/descending
- ✅ Pagination dengan customizable page size

**User Features:**
- ✅ Home page dengan featured products
- ✅ Product catalog dengan grid view
- ✅ Search products (debounced)
- ✅ Filter by category
- ✅ Sort by multiple fields
- ✅ Product detail page dengan:
  - Full product information
  - Price display (formatted IDR)
  - Stock availability
  - Quantity selector
  - Add to cart button (UI)
  - Creator information

### 🏷️ Category Management

- ✅ CRUD operations untuk categories
- ✅ Assign products to categories
- ✅ Filter products by category

### 📊 Data Features

**Pagination:**
- Customizable page sizes (5, 10, 25, 50 untuk admin; 12 untuk user)
- Server-side pagination untuk performance
- Page navigation controls
- Total count display

**Filtering & Sorting:**
- Multi-field filtering
- Debounced search input (500ms)
- Ascending/descending sort order
- Persistent filter state

---

## 🚀 Quick Start

### Prerequisites

**Backend:**
- Python 3.11+
- PostgreSQL 15+
- pip atau uv

**Web:**
- Node.js 18+
- npm atau pnpm

**Mobile:**
- Flutter SDK 3.0+
- Android Studio / Xcode
- Android Emulator / iOS Simulator

### Installation & Setup

#### 1️⃣ Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Setup database
# Edit .env file dengan database credentials
cp .env.example .env

# Run migrations
alembic upgrade head

# Seed initial data (optional)
python -m app.db.init_db

# Start server
uvicorn app.main:app --reload --port 8000
```

**Backend akan berjalan di: http://localhost:8000**
- API Docs: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

#### 2️⃣ Web Frontend Setup

```bash
cd web

# Install dependencies
npm install

# Setup environment
cp .env.example .env.development

# Start development server
npm run dev
```

**Web app akan berjalan di: http://localhost:5093**

#### 3️⃣ Mobile App Setup

```bash
cd mobile

# Install dependencies
flutter pub get

# Generate JSON serialization code
flutter pub run build_runner build --delete-conflicting-outputs

# Run app (default menggunakan production API)
flutter run
```

**📱 Mobile app sudah dikonfigurasi untuk connect ke production API:**
- Default: `https://dev-svc-products.vercel.app/api/v1`

**Untuk local development, edit** `lib/config/app_config.dart`:
```dart
// Change apiBaseUrl to:
static const String apiBaseUrl = 'http://localhost:8000/api/v1';        // Emulator
// OR
static const String apiBaseUrl = 'http://192.168.X.X:8000/api/v1';     // Physical device
```

---

## 🔑 Default Credentials

Setelah seeding database, gunakan credentials berikut:

### Admin Account
```
Username: admin
Password: admin123
```
**Access:** Product Management + User Management + All Features

### User Account
```
Username: user
Password: user123
```
**Access:** Product Catalog + Home Page

**Atau register account baru melalui halaman register!**

---

## 📡 API Documentation

### Base URL

- **Development:** `http://localhost:8000/api/v1`
- **Staging:** `https://dev-svc-products.vercel.app/api/v1`
- **Production:** `https://dev-svc-products.vercel.app/api/v1`

### Main Endpoints

#### Authentication
```
POST   /auth/login              Login dengan username & password
POST   /auth/register           Register user baru
GET    /auth/me                 Get current user info
POST   /auth/logout             Logout
POST   /auth/refresh            Refresh access token
```

#### Products
```
GET    /products                List products (dengan filtering & pagination)
GET    /products/{id}           Get product by ID
POST   /products                Create product (admin only)
PUT    /products/{id}           Update product (admin only)
DELETE /products/{id}           Delete product (admin only)
```

#### Users
```
GET    /users                   List users (admin only)
GET    /users/{id}              Get user by ID (admin only)
POST   /users                   Create user (admin only)
PUT    /users/{id}              Update user (admin only)
DELETE /users/{id}              Delete user (admin only)
```

#### Categories
```
GET    /categories              List categories
GET    /categories/{id}         Get category by ID
POST   /categories              Create category (admin only)
PUT    /categories/{id}         Update category (admin only)
DELETE /categories/{id}         Delete category (admin only)
```

#### Roles
```
GET    /roles                   List roles
GET    /roles/{id}              Get role by ID
POST   /roles                   Create role (admin only)
PUT    /roles/{id}              Update role (admin only)
DELETE /roles/{id}              Delete role (admin only)
```

**Full API Documentation:** http://localhost:8000/docs (saat backend running)

---

## 🗂️ Project Structure

```
evaluate-fullstack/
│
├── backend/                    # FastAPI Backend
│   ├── app/
│   │   ├── api/               # API endpoints
│   │   │   ├── v1/
│   │   │   │   ├── auth.py    # Authentication endpoints
│   │   │   │   ├── products.py # Product endpoints
│   │   │   │   ├── users.py   # User endpoints
│   │   │   │   ├── categories.py
│   │   │   │   └── roles.py
│   │   ├── core/              # Core configurations
│   │   │   ├── config.py      # App settings
│   │   │   └── security.py    # JWT & password handling
│   │   ├── db/                # Database
│   │   │   ├── session.py     # DB session
│   │   │   └── base.py        # Base model
│   │   ├── models/            # SQLAlchemy models
│   │   │   ├── user.py
│   │   │   ├── product.py
│   │   │   ├── category.py
│   │   │   └── role.py
│   │   ├── schemas/           # Pydantic schemas
│   │   └── services/          # Business logic
│   ├── alembic/               # Database migrations
│   ├── requirements.txt       # Python dependencies
│   └── README.md
│
├── web/                       # React Frontend
│   ├── src/
│   │   ├── pages/            # Page components
│   │   │   ├── auth/         # Login, Register
│   │   │   └── protected/    # Protected pages
│   │   │       ├── admin/    # Admin pages
│   │   │       └── view/     # User pages
│   │   ├── components/       # Reusable components
│   │   │   ├── products/
│   │   │   ├── users/
│   │   │   └── ui/
│   │   ├── services/         # API services
│   │   ├── store/            # Zustand stores
│   │   ├── routes/           # Router config
│   │   ├── types/            # TypeScript types
│   │   └── utils/            # Utilities
│   ├── package.json
│   └── README.md
│
└── mobile/                    # Flutter Mobile App
    ├── lib/
    │   ├── config/           # App configuration
    │   │   ├── app_config.dart
    │   │   └── router.dart
    │   ├── models/           # Data models
    │   │   ├── user.dart
    │   │   ├── product.dart
    │   │   └── api_response.dart
    │   ├── services/         # API services
    │   │   ├── api_service.dart
    │   │   ├── auth_service.dart
    │   │   ├── product_service.dart
    │   │   └── user_service.dart
    │   ├── providers/        # Riverpod providers
    │   │   ├── auth_provider.dart
    │   │   ├── product_provider.dart
    │   │   └── user_provider.dart
    │   ├── screens/          # UI screens
    │   │   ├── auth/         # Login, Register
    │   │   ├── user/         # User screens
    │   │   └── admin/        # Admin screens
    │   ├── widgets/          # Reusable widgets
    │   └── utils/            # Utilities
    ├── pubspec.yaml
    └── README.md
```

---

## 🎯 Use Cases

### Admin Workflow

1. **Login** dengan admin credentials
2. **Manage Products:**
   - Create new products dengan category
   - Update stock levels
   - Set low stock thresholds
   - Delete discontinued products
   - Filter dan search untuk quick access
3. **Manage Users:**
   - Create user accounts dengan roles
   - Edit user information
   - Activate/deactivate users
   - Monitor user list
4. **View Analytics:**
   - Total products
   - Stock status overview
   - User count

### User Workflow

1. **Register/Login** untuk akses catalog
2. **Browse Products:**
   - View featured products di homepage
   - Search by product name
   - Filter by category
   - Sort by price, name, atau date
3. **View Product Details:**
   - Check stock availability
   - View pricing
   - See product description
   - Select quantity
4. **Shopping** (UI ready untuk cart implementation)

---

## 🔄 Development Workflow

### Backend Development

```bash
# Start backend dengan auto-reload
uvicorn app.main:app --reload --port 8000

# Create new migration
alembic revision --autogenerate -m "description"

# Apply migrations
alembic upgrade head

# Rollback migration
alembic downgrade -1

# Run tests
pytest
```

### Web Development

```bash
# Development mode dengan HMR
npm run dev

# Type checking
npm run type-check

# Linting
npm run lint

# Build for production
npm run build

# Preview production build
npm run preview
```

### Mobile Development

```bash
# Run on specific device
flutter run -d <device-id>

# List devices
flutter devices

# Hot reload
# Press 'r' in terminal

# Hot restart
# Press 'R' in terminal

# Generate code
flutter pub run build_runner build --delete-conflicting-outputs

# Build APK
flutter build apk --release

# Build iOS
flutter build ios --release
```

---

## 🌐 Deployment

### Backend Deployment

**Options:**
- Railway
- Render
- Heroku
- DigitalOcean
- AWS EC2

**Environment Variables Required:**
```env
DATABASE_URL=postgresql://user:pass@host:5432/dbname
SECRET_KEY=your-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7
```

### Web Deployment

**Current:** Vercel
- Auto-deploy dari Git repository
- Environment variables di Vercel dashboard
- Custom domain support

**Alternatives:** Netlify, Cloudflare Pages, AWS S3 + CloudFront

### Mobile Deployment

**Android:**
```bash
flutter build appbundle --release
# Upload ke Google Play Console
```

**iOS:**
```bash
flutter build ios --release
# Upload via Xcode ke App Store Connect
```

---

## 🧪 Testing

### Backend Tests
```bash
pytest
pytest --cov=app tests/
```

### Web Tests
```bash
npm run test
npm run test:coverage
```

### Mobile Tests
```bash
flutter test
flutter test --coverage
```

---

## 📝 Environment Variables

### Backend (.env)
```env
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/dev_products

# JWT
SECRET_KEY=your-super-secret-key-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# CORS
ALLOWED_ORIGINS=http://localhost:5093,http://localhost:3000
```

### Web (.env.development)
```env
VITE_APP_NAME=Dev Web Products
VITE_API_BASE_URL=http://localhost:8000
VITE_MOCK_API=false
```

### Mobile (lib/config/app_config.dart)
```dart
static const String apiBaseUrl = 'http://localhost:8000/api/v1';
static const bool useStaging = false;
static const bool useProduction = false;
```

---

## 🐛 Troubleshooting

### Backend Issues

**Database Connection Error:**
```bash
# Check PostgreSQL is running
sudo service postgresql status

# Check DATABASE_URL in .env
cat .env | grep DATABASE_URL
```

**Migration Issues:**
```bash
# Reset database
alembic downgrade base
alembic upgrade head
```

### Web Issues

**CORS Error:**
- Check backend ALLOWED_ORIGINS includes web URL
- Verify API base URL di .env.development

**Build Errors:**
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

### Mobile Issues

**Connection Refused:**
- Use computer IP address, not localhost (for physical device)
- Check firewall settings
- Ensure backend is running

**Build Runner Issues:**
```bash
flutter clean
flutter pub get
flutter pub run build_runner build --delete-conflicting-outputs
```

---

## 📚 Learning Resources

### Backend (FastAPI)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [SQLAlchemy Documentation](https://docs.sqlalchemy.org/)
- [Pydantic Documentation](https://docs.pydantic.dev/)

### Web (React)
- [React Documentation](https://react.dev/)
- [TailwindCSS Documentation](https://tailwindcss.com/)
- [TanStack Query Documentation](https://tanstack.com/query/latest)
- [Zustand Documentation](https://zustand-demo.pmnd.rs/)

### Mobile (Flutter)
- [Flutter Documentation](https://docs.flutter.dev/)
- [Riverpod Documentation](https://riverpod.dev/)
- [Dio Documentation](https://pub.dev/packages/dio)
- [GoRouter Documentation](https://pub.dev/packages/go_router)

---

## 🤝 Contributing

Contributions are welcome! Untuk berkontribusi:

1. Fork repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Authors

- Backend: FastAPI + PostgreSQL
- Web: React + TypeScript + TailwindCSS
- Mobile: Flutter + Dart

---

## 🎓 Project Purpose

Project ini dibuat untuk evaluasi full-stack development dengan fokus pada:
- ✅ Clean architecture
- ✅ Type safety (TypeScript + Pydantic)
- ✅ Modern development practices
- ✅ API design best practices
- ✅ Cross-platform development
- ✅ Authentication & Authorization
- ✅ State management patterns

---

## 📞 Support

Jika ada pertanyaan atau issues:
- Open issue di repository
- Check dokumentasi masing-masing folder
- Review API documentation di `/docs`

---

**Happy Coding! 🚀**
