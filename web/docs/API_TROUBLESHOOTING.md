# API Troubleshooting Guide

## ❌ Masalah: Request Selalu Pending Lalu Canceled

### 🔍 Penyebab Utama

#### 1. React StrictMode Double Mounting (Development Mode)

React StrictMode akan mount component 2x di development untuk mendeteksi side effects:

```
Component Mount 1  → API Call (Pending)
Component Unmount  → API Call Canceled ❌
Component Mount 2  → API Call (Pending)
```

**Solusi:**
Gunakan AbortController untuk cleanup yang proper.

#### 2. BASE_URL Configuration Error

**❌ Salah:**
```ts
const BASE_URL = import.meta.env.API_BASE_URL || "http://localhost:8000" || "https://api.com";
// Ini selalu fallback ke "http://localhost:8000"
```

**✅ Benar:**
```ts
const BASE_URL = import.meta.env.API_BASE_URL || "https://api.com";
```

#### 3. Missing Cleanup Function

Jika tidak ada cleanup, request akan tetap berjalan setelah component unmount, menyebabkan:
- Memory leaks
- State updates on unmounted component
- Multiple concurrent requests

---

## ✅ Solusi Lengkap

### 1. Implement AbortController di useEffect

**Pattern yang Benar:**

```tsx
useEffect(() => {
  const abortController = new AbortController();

  const fetchData = async () => {
    try {
      const response = await api.get('/endpoint', {
        signal: abortController.signal
      });
      setData(response);
    } catch (err: any) {
      // Ignore abort errors
      if (err.name === 'CanceledError' || err.name === 'AbortError') {
        console.log('Request cancelled');
        return;
      }
      console.error('Error:', err);
    }
  };

  fetchData();

  // Cleanup: cancel request on unmount
  return () => {
    abortController.abort();
  };
}, []);
```

### 2. Service Layer Support

Service harus menerima AxiosRequestConfig untuk support signal:

```ts
// productService.ts
async getAll(params?: ProductQueryParams, config?: AxiosRequestConfig): Promise<Product[]> {
  const client = API_CONFIG.MOCK_API ? mockApi : api;
  return await client.get<Product[]>("/products", { params, ...config });
}
```

### 3. Component Implementation

```tsx
const DashboardPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async (signal?: AbortSignal) => {
    try {
      const response = await productService.getAll(
        undefined,
        { signal } // Pass signal to axios
      );
      setData(response);
    } catch (err: any) {
      if (err.name === 'CanceledError' || err.name === 'AbortError') {
        return; // Ignore cancel errors
      }
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    fetchData(controller.signal);

    return () => controller.abort();
  }, []);

  return (/* JSX */);
};
```

---

## 🚫 Anti-Patterns (Jangan Lakukan Ini)

### ❌ Tidak Ada Cleanup

```tsx
// BAD: Request tetap berjalan setelah unmount
useEffect(() => {
  fetchData();
}, []);
```

### ❌ Multiple useEffect Tanpa Dependencies

```tsx
// BAD: Infinite loop
useEffect(() => {
  fetchData();
  setData(newData); // Causes re-render
}); // No dependency array
```

### ❌ Ignore Cancel Errors

```tsx
// BAD: Semua error di-log, termasuk abort
catch (err) {
  console.error('Error:', err); // Akan log abort error juga
}
```

---

## 🎯 Best Practices

### 1. Selalu Gunakan Cleanup Function

```tsx
useEffect(() => {
  const controller = new AbortController();

  // Your async code here

  return () => controller.abort();
}, [dependencies]);
```

### 2. Handle Abort Errors Secara Explicit

```tsx
catch (err: any) {
  if (err.name === 'CanceledError' || err.name === 'AbortError') {
    return; // Silent fail for aborts
  }
  // Handle real errors
  handleError(err);
}
```

### 3. Set Dependencies dengan Benar

```tsx
// ✅ Fetch on mount only
useEffect(() => {
  fetchData();
}, []);

// ✅ Fetch when filter changes
useEffect(() => {
  fetchData(filter);
}, [filter]);

// ❌ Missing dependency
useEffect(() => {
  fetchData(filter); // filter should be in deps
}, []);
```

### 4. Loading States

```tsx
const [loading, setLoading] = useState(true);

const fetchData = async () => {
  setLoading(true);
  try {
    const data = await api.get('/data');
    setData(data);
  } catch (err) {
    // handle error
  } finally {
    setLoading(false); // Always set loading false
  }
};
```

---

## 🔧 Debugging Tips

### 1. Check Network Tab

Di Chrome DevTools Network tab, perhatikan:
- **Pending requests**: Request yang belum selesai
- **Canceled (in red)**: Request yang di-abort
- **Status Code**: 200 = success, 401 = unauthorized, dll

### 2. Enable Axios Interceptor Logging

```ts
// Tambahkan di api.ts untuk debugging
this.api.interceptors.request.use(
  (config) => {
    console.log('🚀 Request:', config.method?.toUpperCase(), config.url);
    return config;
  }
);

this.api.interceptors.response.use(
  (response) => {
    console.log('✅ Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.log('❌ Error:', error.message, error.config?.url);
    return Promise.reject(error);
  }
);
```

### 3. React DevTools Profiler

Gunakan untuk melihat:
- Component re-renders
- Mount/unmount cycles
- Performance bottlenecks

---

## 🌐 Environment Configuration

### .env File

```env
# Development
VITE_API_BASE_URL=http://localhost:8000

# Staging
VITE_API_BASE_URL=https://staging-api.example.com

# Production
VITE_API_BASE_URL=https://api.example.com
```

### constants.ts

```ts
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://fallback-api.com";

export const API_CONFIG = {
  BASE_URL: BASE_URL + '/api/v1/',
  TIMEOUT: 30000, // 30 seconds (adjust based on your needs)
  USE_REFRESH_TOKEN: true,
};
```

---

## 📊 Performance Optimization

### 1. Debounce Search Requests

```tsx
import { debounce } from 'lodash';

const debouncedSearch = debounce(async (query: string) => {
  const results = await api.get(`/search?q=${query}`);
  setResults(results);
}, 300);

useEffect(() => {
  if (searchQuery) {
    debouncedSearch(searchQuery);
  }
  return () => debouncedSearch.cancel();
}, [searchQuery]);
```

### 2. Cache Responses

```tsx
const cache = new Map();

const fetchWithCache = async (url: string) => {
  if (cache.has(url)) {
    return cache.get(url);
  }

  const data = await api.get(url);
  cache.set(url, data);
  return data;
};
```

### 3. React Query (Recommended)

Consider using React Query untuk advanced caching & request management:

```tsx
import { useQuery } from '@tanstack/react-query';

const { data, isLoading, error } = useQuery({
  queryKey: ['products'],
  queryFn: () => productService.getAll(),
  staleTime: 5 * 60 * 1000, // 5 minutes
});
```

---

## 📝 Checklist

- [ ] Implement AbortController di semua useEffect dengan API calls
- [ ] Handle CanceledError/AbortError secara explicit
- [ ] Set proper dependencies di useEffect
- [ ] Configure BASE_URL dengan benar
- [ ] Add loading states
- [ ] Test dengan React StrictMode enabled
- [ ] Check Network tab untuk canceled requests
- [ ] Add error boundaries untuk handle errors gracefully

---

## 🆘 Masih Ada Masalah?

1. **Check BASE_URL**: Console.log `API_CONFIG.BASE_URL` untuk verify
2. **Check Auth Token**: Pastikan token valid dan tidak expired
3. **Check CORS**: Pastikan API server allow your origin
4. **Check Network**: Test API langsung dengan Postman/curl
5. **Check Console**: Look for error messages atau warnings
6. **Disable StrictMode**: Temporary untuk isolate masalah (jangan di production!)

---

## 📚 Resources

- [Axios Cancellation](https://axios-http.com/docs/cancellation)
- [React useEffect Cleanup](https://react.dev/learn/synchronizing-with-effects#step-3-add-cleanup-if-needed)
- [AbortController MDN](https://developer.mozilla.org/en-US/docs/Web/API/AbortController)
- [React StrictMode](https://react.dev/reference/react/StrictMode)
