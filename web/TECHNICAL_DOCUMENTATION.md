# Technical Documentation - Dev Web Products

## 1. Ringkasan Project

**Dev Web Products** adalah aplikasi web fullstack berbasis React yang menyediakan sistem manajemen produk dengan fitur autentikasi, otorisasi berbasis role, dan operasi CRUD lengkap untuk produk, user, kategori, dan role.

### Tipe Aplikasi
- **Frontend**: React Single Page Application (SPA)
- **Backend Integration**: RESTful API consumer
- **Architecture**: Client-side rendered dengan API integration

---

## 2. Technology Stack

### Frontend Core
| Teknologi | Versi | Fungsi |
|-----------|-------|--------|
| **React** | 19.1.0 | Library UI utama dengan fitur terbaru |
| **TypeScript** | 5.9.3 | Type safety dan better developer experience |
| **Vite (Rolldown)** | 7.2.2 | Build tool dan dev server yang ultra-cepat |

### UI & Styling
| Teknologi | Versi | Fungsi |
|-----------|-------|--------|
| **TailwindCSS** | 3.4.13 | Utility-first CSS framework |
| **@tailwindcss/forms** | - | Plugin untuk styling form |
| **@tailwindcss/typography** | - | Plugin untuk typography |
| **Lucide React** | 0.546.0 | Icon library modern |

### State Management
| Teknologi | Versi | Fungsi |
|-----------|-------|--------|
| **Zustand** | 5.0.0 | Global state management (auth state) |
| **TanStack Query** | 5.51.0 | Server state management, caching, data synchronization |
| **TanStack Query Devtools** | - | Development tools untuk debugging queries |

### Routing & Forms
| Teknologi | Versi | Fungsi |
|-----------|-------|--------|
| **React Router DOM** | 7.9.5 | Client-side routing dengan nested routes |
| **React Hook Form** | 7.66.0 | Form validation dan handling yang performant |

### HTTP & Utilities
| Teknologi | Versi | Fungsi |
|-----------|-------|--------|
| **Axios** | 1.7.2 | HTTP client dengan interceptors |
| **React Hot Toast** | 2.5.1 | Toast notifications untuk user feedback |

### Development Tools
- **ESLint 9.39.1** - Code linting
- **TypeScript ESLint** - TypeScript-specific linting
- **Prettier** - Code formatting
- **PostCSS + Autoprefixer** - CSS processing

---

## 3. Struktur Project

```
web-fullstack-initial/
├── docs/                          # Dokumentasi project
│   ├── API_TROUBLESHOOTING.md    # Panduan debugging API
│   └── ENVIRONMENT_SETUP.md       # Konfigurasi environment
│
├── public/                        # Static assets
├── server/                        # Backend-related files
│   └── db.json                   # Mock database
│
├── src/
│   ├── assets/                   # Images, fonts, static files
│   │   └── source/
│   │
│   ├── components/               # Reusable UI components
│   │   ├── products/            # Product-specific components
│   │   │   ├── ProductFormModal.tsx      # Modal untuk create/edit product
│   │   │   ├── ProductDetailModal.tsx    # Modal detail product
│   │   │   ├── UpdateStockModal.tsx      # Modal update stock
│   │   │   └── index.ts
│   │   ├── users/               # User management components
│   │   │   ├── UserFormModal.tsx         # Modal untuk create/edit user
│   │   │   ├── UserDetailModal.tsx       # Modal detail user
│   │   │   └── index.ts
│   │   └── ui/                  # Generic UI components
│   │       ├── LayoutHeader.tsx          # Header layout
│   │       ├── Modal.tsx                 # Base modal component
│   │       ├── SuccessModal.tsx          # Success confirmation modal
│   │       └── index.ts
│   │
│   ├── contexts/                 # React context providers
│   │   └── QueryProvider.tsx    # TanStack Query provider
│   │
│   ├── hooks/                    # Custom React hooks
│   │   ├── useSSE.ts            # Server-Sent Events hook
│   │   └── useSSEPost.ts        # SSE dengan POST support
│   │
│   ├── pages/                    # Page components
│   │   ├── auth/                # Halaman autentikasi
│   │   │   ├── LoginPage.tsx
│   │   │   └── RegisterPage.tsx
│   │   ├── protected/           # Protected routes
│   │   │   ├── admin/          # Halaman khusus admin
│   │   │   │   ├── DashboardPage.tsx    # Product management dashboard
│   │   │   │   ├── UserPage.tsx         # User management
│   │   │   │   └── TestPage.tsx
│   │   │   └── view/           # Halaman untuk user biasa
│   │   │       ├── HomePage.tsx
│   │   │       ├── HomePageV2.tsx       # Product catalog
│   │   │       ├── ProductPage.tsx      # Semua produk
│   │   │       └── ProductDetail.tsx    # Detail produk
│   │   └── NotFoundPage.tsx     # 404 page
│   │
│   ├── routes/                   # Konfigurasi routing
│   │   ├── AppRoutes.tsx        # Definisi route utama
│   │   ├── ProtectedRoute.tsx   # Auth guard component
│   │   └── PublicRoute.tsx      # Public route wrapper
│   │
│   ├── services/                 # API service layer
│   │   ├── api.ts              # Axios instance & interceptors
│   │   ├── authService.ts      # Authentication API calls
│   │   ├── productService.ts   # Product CRUD operations
│   │   ├── userService.ts      # User management API
│   │   ├── categoryService.ts  # Category API
│   │   ├── roleService.ts      # Role management API
│   │   └── mockApi/            # Mock API implementation
│   │       └── index.ts
│   │
│   ├── store/                    # Zustand state stores
│   │   └── auth.ts             # Authentication state management
│   │
│   ├── types/                    # TypeScript type definitions
│   │   ├── api.types.ts        # Generic API types
│   │   ├── auth.types.ts       # Auth & User types
│   │   ├── product.types.ts    # Product models
│   │   ├── user.types.ts       # User models
│   │   ├── category.types.ts   # Category models
│   │   └── role.types.ts       # Role models
│   │
│   ├── utils/                    # Utility functions
│   │   ├── constants.ts        # App configuration constants
│   │   └── storage.ts          # Local storage utilities
│   │
│   ├── App.tsx                   # Root component
│   ├── main.tsx                  # Application entry point
│   └── index.css                 # Global styles
│
├── .env.example                  # Environment template
├── .env.development              # Development config
├── .env.staging                  # Staging config
├── .env.production               # Production config
├── index.html                    # HTML entry point
├── package.json                  # Dependencies & scripts
├── tsconfig.json                 # TypeScript configuration
├── tailwind.config.js            # Tailwind CSS configuration
├── vite.config.ts                # Vite build configuration
└── vercel.json                   # Vercel deployment config
```

---

## 4. Fitur-Fitur Utama

### A. Authentication & Authorization

#### Login/Register System
- Form login dengan username dan password (FormData)
- Form registrasi untuk user baru
- JWT token authentication (access token + refresh token)
- Persistent session menggunakan Zustand persist middleware
- Auto token refresh menggunakan Axios interceptors

#### Role-based Access Control
- **Admin**: Akses penuh ke dashboard, manajemen produk, user, kategori, dan role
- **User**: Akses ke halaman katalog produk dan detail produk
- Route guards untuk melindungi halaman berdasarkan authentication dan role

#### Token Management
- Access token disimpan di Zustand store
- Refresh token untuk perpanjangan session otomatis
- Auto-logout saat token expired
- Request interceptor menambahkan Authorization header otomatis

### B. Product Management (Admin)

#### CRUD Operations
- **Create**: Tambah produk baru dengan form validation
- **Read**: Lihat daftar produk dengan detail lengkap
- **Update**: Edit informasi produk
- **Delete**: Hapus produk dengan konfirmasi

#### Advanced Filtering & Sorting
- **Search**: Cari produk berdasarkan nama (debounced 500ms)
- **Filter**: Filter berdasarkan kategori
- **Sort**: Urutkan berdasarkan:
  - Nama produk
  - Stock
  - Harga
  - Status
  - Tanggal dibuat
- **Order**: Ascending atau descending

#### Pagination
- Server-side pagination
- Configurable page size: 5, 10, 25, 50 items
- Navigasi halaman dengan prev/next
- Total count dan current page indicator

#### Stock Management
- Update stock functionality
- Stock status indicators:
  - **Red**: Stock di bawah low_stock_threshold
  - **Yellow**: Stock sama dengan low_stock_threshold
  - **Green**: Stock di atas low_stock_threshold
- Visual progress bar untuk stock level

#### Responsive Design
- Mobile-friendly layout
- Tablet optimization
- Desktop full features

### C. Product Catalog (User)

#### Browsing Experience
- Grid view untuk semua produk
- Product cards dengan gambar, nama, harga, stock
- Category filtering
- Search functionality

#### Product Detail
- Halaman detail produk lengkap
- Informasi creator
- Stock availability
- Quantity selector
- Buy button (UI only)

### D. User Management (Admin)

#### User CRUD
- Lihat daftar semua user
- Tambah user baru dengan form
- Edit informasi user
- Delete user dengan konfirmasi

#### User Features
- Role assignment
- Status active/inactive toggle
- Search by username, email, atau nama
- Pagination untuk manage user dalam jumlah besar
- User detail modal

### E. Category Management

#### Category CRUD
- Manage product categories
- Create, read, update, delete categories
- Search categories by name
- Category assignment to products

### F. Role Management

#### Role CRUD
- Define dan manage user roles
- Support untuk admin, user, dan custom roles
- Role assignment to users

### G. Real-time Features

#### Server-Sent Events (SSE)
- Mock implementation untuk real-time updates
- Custom hooks: `useSSE` dan `useSSEPost`
- Toast notifications untuk produk baru (demo)

#### Notifications
- React Hot Toast untuk user feedback
- Success/error notifications
- Loading states

---

## 5. Data Models

### User Model
```typescript
interface User {
  id: string;
  email: string;
  username: string;
  full_name: string;
  role_id: string;
  role?: {
    id: string;
    name: string;
  };
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
```

### Product Model
```typescript
interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  low_stock_threshold: number;
  stock_status?: 'red' | 'yellow' | 'green';
  image_url?: string;
  category_id: string;
  category?: {
    id: string;
    name: string;
    description?: string;
  };
  creator?: {
    id: string;
    username: string;
    email: string;
  };
  created_by: string;
  created_at: string;
  updated_at: string;
}
```

### Category Model
```typescript
interface Category {
  id: string;
  name: string;
  description?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}
```

### Role Model
```typescript
interface Role {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}
```

---

## 6. API Endpoints

### Base URL Configuration
- **Development**: `http://localhost:8000/api/v1/`
- **Staging**: `https://staging-svc-products.vercel.app/api/v1/`
- **Production**: `https://dev-svc-products.vercel.app/api/v1/`

### Authentication Endpoints
```
POST   /auth/login           - Login (FormData: username, password)
POST   /auth/register        - Register user baru
GET    /auth/me              - Get current user info
POST   /auth/logout          - Logout user
POST   /auth/refresh         - Refresh access token
```

### Product Endpoints
```
GET    /products             - Get all products
                               Query: search, category_id, sort_by, order, skip, limit
GET    /products/:id         - Get product by ID
POST   /products             - Create new product
PUT    /products/:id         - Update product
DELETE /products/:id         - Delete product
```

### User Endpoints
```
GET    /users                - Get all users
                               Query: search, sort_by, order, skip, limit
GET    /users/:id            - Get user by ID
POST   /users                - Create new user (admin only)
PUT    /users/:id            - Update user
DELETE /users/:id            - Delete user
```

### Category Endpoints
```
GET    /categories           - Get all categories
                               Query: search, skip, limit
GET    /categories/:id       - Get category by ID
POST   /categories           - Create new category
PUT    /categories/:id       - Update category
DELETE /categories/:id       - Delete category
```

### Role Endpoints
```
GET    /roles                - Get all roles
                               Query: search, skip, limit
GET    /roles/:id            - Get role by ID
POST   /roles                - Create new role
PUT    /roles/:id            - Update role
DELETE /roles/:id            - Delete role
```

---

## 7. Authentication Flow

### 1. Login Process
```
User Input (username, password)
   ↓
POST /auth/login (FormData)
   ↓
API Response (access_token, refresh_token)
   ↓
Store tokens in Zustand (persisted to localStorage)
   ↓
Fetch user info via GET /auth/me
   ↓
Set isAuthenticated = true
   ↓
Redirect based on role:
  - Admin → /admin/dashboard
  - User → /home
```

### 2. Token Storage
- **Storage**: Zustand store dengan persist middleware
- **Key**: `auth-storage` di localStorage
- **Persisted Fields**: `accessToken`, `refreshToken`, `user`, `isAuthenticated`

### 3. Request Authorization
```
API Request
   ↓
Axios Request Interceptor
   ↓
Add Header: Authorization: Bearer {accessToken}
   ↓
Send Request to API
```

### 4. Token Refresh (Optional)
```
API Response: 401 Unauthorized
   ↓
Check if USE_REFRESH_TOKEN enabled
   ↓
YES:
  POST /auth/refresh with refresh_token
     ↓
  Get new access_token
     ↓
  Update token in store
     ↓
  Retry original request
     ↓
  Return response

NO or Refresh Failed:
  Clear auth state
     ↓
  Redirect to /login
```

### 5. Logout Process
```
User Click Logout
   ↓
POST /auth/logout (optional)
   ↓
Clear auth state from Zustand
   ↓
Remove from localStorage
   ↓
Redirect to /login
```

---

## 8. Route Guards & Authorization

### Protected Route
```typescript
// ProtectedRoute.tsx
- Check isAuthenticated
- If not authenticated → redirect to /login
- If authenticated but no user → fetch via /auth/me
- If user loaded → render children
```

### Public Route
```typescript
// PublicRoute.tsx
- Check isAuthenticated
- If authenticated → redirect to /home or /admin/dashboard
- If not authenticated → render children (login/register page)
```

### Role-based Access
```typescript
Admin Routes (/admin/*):
  - Requires user.role.name === "admin"
  - Non-admin → redirect to /home

User Routes (/home, /products):
  - Available to all authenticated users
```

---

## 9. Environment Configuration

### Environment Files
```
.env.example       - Template untuk setup
.env.development   - Development environment
.env.staging       - Staging environment
.env.production    - Production environment
```

### Key Variables
```env
VITE_APP_NAME=Dev Web Products
VITE_API_BASE_URL=http://localhost:8000
VITE_MOCK_API=false
```

**Important**: Semua client-accessible variables harus prefixed dengan `VITE_`

---

## 10. Build & Development

### Development Server
```bash
npm run dev
```
- Port: 5093
- Auto-open browser
- Hot Module Replacement (HMR)

### Build Commands
```bash
npm run build              # Production build
npm run build:staging      # Staging build
npm run preview            # Preview production build
```

### Code Quality
```bash
npm run lint               # Run ESLint
```

### Vite Configuration
- **Server Port**: 5093
- **Auto Open**: Browser dibuka otomatis
- **Path Alias**: `@` → `/src`
- **Source Maps**: Enabled di development
- **Minification**: Enabled di production

---

## 11. Best Practices & Patterns

### State Management Pattern
- **Global State**: Zustand untuk auth state
- **Server State**: TanStack Query untuk API data (caching, sync, refetch)
- **Local State**: React useState untuk UI state

### API Service Pattern
- Centralized API client (`src/services/api.ts`)
- Service layer abstraction per feature
- Request/Response interceptors untuk token management
- Mock API support untuk development tanpa backend

### Component Organization
- **Feature-based folders**: `components/products`, `components/users`
- **Reusable UI components**: `components/ui`
- **Page components**: Satu file per route di `pages/`

### Error Handling
- API errors ditangkap dan ditampilkan via toast
- Loading states untuk async operations
- 404 page untuk invalid routes
- AbortController untuk prevent memory leaks

### Performance Optimizations
- **Debounced search**: 500ms delay untuk search input
- **Server-side pagination**: Hanya load data yang diperlukan
- **React.StrictMode**: Untuk detect side effects di development
- **Vite HMR**: Fast refresh tanpa full reload

### Security Features
- JWT token authentication
- Request interceptors untuk auth headers
- Protected routes dengan auth guards
- Role-based access control
- Auto-logout on token expiry
- CORS configuration di API

---

## 12. Application Flow

### Initial Load
```
1. User akses aplikasi
2. Zustand rehydrate auth state dari localStorage
3. Check isAuthenticated:

   YES:
     - Check if user data exists
     - Fetch current user via /auth/me if needed
     - Redirect based on role

   NO:
     - Redirect to /login
```

### Admin Workflow
```
1. Login → Dashboard (/admin/dashboard)
2. View products dengan filtering, sorting, pagination
3. Create/Edit/Delete products via modals
4. Manage stock levels
5. Access user management (/admin/users)
6. Manage categories dan roles
```

### User Workflow
```
1. Login → Home page (/home)
2. Browse product catalog
3. View product details (/products/:id)
4. Select quantity and purchase (UI only)
```

---

## 13. Development Guidelines

### File Naming Conventions
- **Components**: PascalCase (e.g., `ProductFormModal.tsx`)
- **Services**: camelCase (e.g., `authService.ts`)
- **Types**: camelCase dengan `.types.ts` suffix
- **Hooks**: camelCase dengan `use` prefix (e.g., `useSSE.ts`)

### TypeScript Usage
- Full type safety di seluruh codebase
- Interface definitions di folder `types/`
- Generic types untuk API responses
- Type inference dimana memungkinkan

### CSS & Styling
- TailwindCSS utility classes
- Custom colors di `tailwind.config.js`
- No inline styles (gunakan Tailwind)
- Responsive design dengan Tailwind breakpoints

### Code Quality Standards
- ESLint rules enforcement
- Prettier untuk code formatting
- TypeScript strict mode
- React hooks rules

---

## 14. Deployment

### Vercel Deployment
- Configuration via `vercel.json`
- Environment variables di Vercel dashboard
- Automatic deployments dari Git branches
- Preview deployments untuk pull requests

### Production Checklist
- [ ] Set correct `VITE_API_BASE_URL`
- [ ] Disable `VITE_MOCK_API`
- [ ] Build with `npm run build`
- [ ] Test production build dengan `npm run preview`
- [ ] Configure CORS di backend untuk production domain
- [ ] Set up environment variables di hosting platform

---

## 15. Known Limitations & Future Enhancements

### Current Limitations
- Purchase flow hanya UI (belum terintegrasi payment)
- Mock SSE implementation (belum real-time dari backend)
- No image upload functionality (hanya URL input)
- No shopping cart persistence

### Potential Enhancements
- Shopping cart functionality
- Order management system
- Payment gateway integration
- Real-time notifications via WebSocket/SSE
- Image upload with cloud storage
- Export data to CSV/Excel
- Advanced analytics dashboard
- Multi-language support (i18n)

---

## 16. Troubleshooting

### Common Issues

#### 1. API Connection Failed
```
Solution:
- Check VITE_API_BASE_URL di .env file
- Pastikan backend server running
- Check CORS configuration di backend
- Verify network connection
```

#### 2. Token Refresh Not Working
```
Solution:
- Check USE_REFRESH_TOKEN di constants.ts
- Verify refresh token tidak expired
- Check /auth/refresh endpoint di backend
```

#### 3. Route Not Found (404)
```
Solution:
- Check route definitions di AppRoutes.tsx
- Verify URL path benar
- Check Protected/Public route wrappers
```

#### 4. Styling Not Applied
```
Solution:
- Restart Vite dev server
- Check Tailwind configuration
- Verify import order di index.css
- Clear browser cache
```

---

## 17. Resources & Documentation

### Internal Documentation
- `docs/API_TROUBLESHOOTING.md` - API debugging guide
- `docs/ENVIRONMENT_SETUP.md` - Environment setup guide

### External Resources
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)
- [TailwindCSS Docs](https://tailwindcss.com/docs)
- [TanStack Query Docs](https://tanstack.com/query/latest)
- [Zustand Documentation](https://zustand-demo.pmnd.rs/)
- [React Router Docs](https://reactrouter.com/)

---

**Last Updated**: 2025-11-15
**Project Version**: Based on package.json dependencies
**Maintained By**: Development Team
