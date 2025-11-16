# Troubleshooting Guide - Flutter Mobile App

## ❌ Error: "type 'Null' is not a subtype of type 'String'"

### Symptoms
```
❌ Login failed: TypeError: null: type 'Null' is not a subtype of type 'String'
🔄 Router redirect - Auth: false, Loading: false, Admin: false, Route: /login
```

Login API returns 200 OK but app shows error and doesn't navigate.

### Root Cause
Model fields are defined as non-nullable (`String`) but API response contains null values for some fields like `created_at`, `updated_at`, `role_id`, etc.

### Solution

**1. Update has been made to models:**
- `lib/models/user.dart` - Made `roleId`, `isActive`, `createdAt`, `updatedAt` nullable
- `lib/models/product.dart` - Already has nullable fields

**2. Regenerate JSON serialization code:**

```bash
cd mobile
flutter pub run build_runner build --delete-conflicting-outputs
```

This will regenerate all `.g.dart` files to match the updated models.

**3. Hot Restart (NOT hot reload):**

```bash
# Stop the app and restart
flutter run

# Or press 'R' in terminal (capital R for restart)
```

**4. Try login again**

Use credentials:
- Admin: `admin` / `admin123`
- User: `user` / `user123`

### Expected Output (Success)
```
🔐 Login attempt for username: admin
📤 Sending login request...
✅ Login API success, got token and user: admin
📦 Raw user data: {...}
👤 User role: Admin
🔑 Role ID: xxx-xxx-xxx
💾 Saving auth data to storage...
✅ Saved auth data to storage
✨ Auth state updated - isAuthenticated: true, isAdmin: true
🔄 Router redirect - Auth: true, Loading: false, Admin: true, Route: /login
✅ Redirecting authenticated user to: /admin/dashboard
```

### If Still Getting Errors

**Check the detailed error log:**

Look for the stack trace in console. It will show exactly which field is causing the null issue.

**Example:**
```
📍 Stack trace: #0  User.fromJson (package:mobile/models/user.g.dart:15:23)
```

**Verify API Response:**

Check if API is returning the expected format:

```bash
curl -X POST https://dev-svc-products.vercel.app/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

Expected response:
```json
{
  "access_token": "eyJ...",
  "refresh_token": "eyJ...",
  "metadata": {
    "id": "...",
    "email": "admin@example.com",
    "username": "admin",
    "full_name": "Administrator",
    "role_id": "...",
    "role": {
      "id": "...",
      "name": "Admin",
      "description": null,
      "created_at": "...",
      "updated_at": "..."
    },
    "is_active": true,
    "created_at": "...",
    "updated_at": "..."
  }
}
```

**If any field is missing or null**, that field should be nullable in the model.

---

## 🔄 Router Not Redirecting After Login

### Symptoms
- Login successful (200 OK)
- Auth state updated correctly
- But stays on login page

### Solution

Already fixed! The router now properly watches auth state changes:

```dart
// lib/config/router.dart
final routerProvider = Provider<GoRouter>((ref) {
  final authState = ref.watch(authProvider); // This triggers rebuild

  return GoRouter(
    redirect: (context, state) {
      // Auto-redirect based on auth state
      if (isAuthenticated && isLoginRoute) {
        return isAdmin ? '/admin/dashboard' : '/home';
      }
      ...
    },
  );
});
```

---

## 🌐 Connection Refused Error

### Symptoms
```
DioException: Connection refused
```

### Solutions

**For Android Emulator:**
```dart
// lib/config/app_config.dart
static const String apiBaseUrl = 'http://10.0.2.2:8000/api/v1';
```

**For iOS Simulator:**
```dart
static const String apiBaseUrl = 'http://localhost:8000/api/v1';
```

**For Physical Device:**
```dart
static const String apiBaseUrl = 'http://192.168.X.X:8000/api/v1';
// Replace X.X with your computer's IP address
```

**Using Production API (Current Default):**
```dart
static const String apiBaseUrl = 'https://dev-svc-products.vercel.app/api/v1';
```

---

## 📦 Build Runner Issues

### Clean and Rebuild

```bash
# Clean project
flutter clean

# Get dependencies
flutter pub get

# Generate code
flutter pub run build_runner build --delete-conflicting-outputs

# Run app
flutter run
```

### Watch Mode (for development)

```bash
flutter pub run build_runner watch --delete-conflicting-outputs
```

This will auto-regenerate `.g.dart` files when you modify models.

---

## 🔍 Debug Mode

### Enable Verbose Logging

The app already has detailed logging. Check your console for:

```
🔐 Login attempt
📤 Sending login request
✅ Login API success
📦 Raw user data
👤 User role
🔑 Role ID
💾 Saving auth data
✨ Auth state updated
🔄 Router redirect
```

### Check Auth State

Add this to see current auth state:

```dart
// In any widget
final authState = ref.watch(authProvider);
print('Current Auth State:');
print('- isAuthenticated: ${authState.isAuthenticated}');
print('- isLoading: ${authState.isLoading}');
print('- isAdmin: ${authState.isAdmin}');
print('- user: ${authState.user?.username}');
print('- error: ${authState.error}');
```

---

## 🆘 Common Issues Checklist

- [ ] Run `flutter pub get` after changing dependencies
- [ ] Run `build_runner` after changing models
- [ ] Use **Hot Restart** (R) not Hot Reload (r) after model changes
- [ ] Check API URL in `app_config.dart`
- [ ] Verify API is accessible (test in browser/Postman)
- [ ] Check credentials are correct
- [ ] Clear app data if tokens are corrupted
- [ ] Check console logs for detailed errors

---

## 🧹 Complete Reset

If all else fails, do a complete reset:

```bash
cd mobile

# 1. Clean everything
flutter clean
rm -rf .dart_tool
rm -rf build

# 2. Get dependencies
flutter pub get

# 3. Generate code
flutter pub run build_runner build --delete-conflicting-outputs

# 4. Run app
flutter run

# 5. Clear app data on device
# Android: Settings > Apps > [App Name] > Storage > Clear Data
# iOS: Uninstall and reinstall app
```

---

## 📞 Still Having Issues?

1. Check the main README.md for setup instructions
2. Verify backend API is running and accessible
3. Test API endpoints with Postman/curl
4. Check Flutter Doctor: `flutter doctor -v`
5. Check Dart/Flutter version compatibility

---

**Happy Debugging! 🐛🔨**
