# Components Documentation

Dokumentasi lengkap untuk semua reusable components di aplikasi.

## Struktur Folder

```
components/
├── ui/                 # Base UI components (reusable)
│   ├── Modal.tsx
│   ├── SuccessModal.tsx
│   ├── LayoutHeader.tsx
│   └── index.ts
├── products/          # Product-specific components
│   ├── ProductFormModal.tsx
│   └── index.ts
└── README.md
```

## UI Components

### Modal

Base modal component yang dapat digunakan untuk semua jenis modal dialog.

**Props:**
- `isOpen: boolean` - Kontrol visibility modal
- `onClose: () => void` - Callback saat modal ditutup
- `title?: string` - Judul modal (optional)
- `subtitle?: string` - Subtitle/deskripsi di bawah title (optional)
- `children: ReactNode` - Konten modal
- `maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'` - Ukuran maksimal modal (default: '2xl')
- `showCloseButton?: boolean` - Tampilkan tombol close (default: true)

**Contoh Penggunaan:**
```tsx
import { Modal } from '@/components/ui';

<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Custom Modal"
  subtitle="This is a subtitle"
  maxWidth="lg"
>
  <div className="p-6">
    Your content here
  </div>
</Modal>
```

### SuccessModal

Modal untuk menampilkan notifikasi sukses setelah operasi berhasil.

**Props:**
- `isOpen: boolean` - Kontrol visibility modal
- `onClose: () => void` - Callback saat modal ditutup
- `title?: string` - Judul success (default: "Berhasil Ditambah!")
- `message?: string` - Pesan success (default: "Produk baru berhasil disimpan...")
- `buttonText?: string` - Text pada button (default: "Tutup")

**Contoh Penggunaan:**
```tsx
import { SuccessModal } from '@/components/ui';

<SuccessModal
  isOpen={showSuccess}
  onClose={() => setShowSuccess(false)}
  title="Data Tersimpan!"
  message="Data berhasil disimpan ke database."
  buttonText="OK"
/>
```

## Product Components

### ProductFormModal

Modal form untuk menambah produk baru. Component ini sudah include:
- Form validation
- Category loading dari API
- Image upload area
- Submit handling
- Error handling

**Props:**
- `isOpen: boolean` - Kontrol visibility modal
- `onClose: () => void` - Callback saat modal ditutup
- `onSuccess: () => void` - Callback saat produk berhasil ditambahkan

**Contoh Penggunaan:**
```tsx
import { ProductFormModal } from '@/components/products';

<ProductFormModal
  isOpen={showAddModal}
  onClose={() => setShowAddModal(false)}
  onSuccess={() => {
    // Refresh data, show success modal, etc
    loadProducts();
    setShowSuccessModal(true);
  }}
/>
```

## Best Practices

### 1. Component Organization
- **ui/**: Letakkan base components yang reusable untuk seluruh aplikasi
- **[feature]/**: Letakkan components yang spesifik untuk feature tertentu (products, users, etc)

### 2. Export Pattern
Selalu gunakan index.ts untuk export components:
```ts
// components/ui/index.ts
export { Modal } from './Modal';
export { SuccessModal } from './SuccessModal';
```

Import dengan pattern:
```tsx
// ✅ Good
import { Modal, SuccessModal } from '@/components/ui';

// ❌ Avoid
import { Modal } from '@/components/ui/Modal';
```

### 3. Props Interface
Selalu define interface untuk props dengan nama yang jelas:
```tsx
interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}
```

### 4. Naming Convention
- **Component files**: PascalCase (e.g., `ProductFormModal.tsx`)
- **Props interface**: `[ComponentName]Props`
- **State variables**: camelCase (e.g., `isOpen`, `formData`)

### 5. Component Composition
Gunakan composition untuk membuat complex components:
```tsx
// ProductFormModal menggunakan Modal sebagai base
<Modal isOpen={isOpen} onClose={onClose}>
  <form>...</form>
</Modal>
```

## Scalability Guidelines

### Menambah Component Baru

1. **Tentukan lokasi**:
   - Jika reusable untuk seluruh app → `ui/`
   - Jika specific untuk feature → `[feature]/`

2. **Buat component file**:
   ```tsx
   // components/ui/NewComponent.tsx
   interface NewComponentProps {
     // props definition
   }

   export const NewComponent = (props: NewComponentProps) => {
     // component logic
   };
   ```

3. **Update index.ts**:
   ```ts
   export { NewComponent } from './NewComponent';
   ```

4. **Dokumentasi**:
   Update README.md dengan contoh penggunaan

### Refactoring Existing Components

Ketika component di page mulai complex:
1. Extract menjadi separate component
2. Pindahkan business logic ke component
3. Expose API yang clear via props
4. Test component secara isolated

## Maintenance

- Review components secara berkala untuk optimization
- Gunakan React DevTools untuk profiling
- Keep components focused (Single Responsibility)
- Document complex logic dengan comments

## Resources

- [React Component Patterns](https://react.dev/learn/thinking-in-react)
- [TypeScript Best Practices](https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html)
