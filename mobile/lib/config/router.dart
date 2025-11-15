import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../providers/auth_provider.dart';
import '../screens/auth/login_page.dart';
import '../screens/auth/register_page.dart';
import '../screens/user/home_page.dart';
import '../screens/user/products_page.dart';
import '../screens/user/product_detail_page.dart';
import '../screens/admin/dashboard_page.dart';
import '../screens/admin/users_page.dart';

// GoRouter provider with proper refresh mechanism
final routerProvider = Provider<GoRouter>((ref) {
  // Watch auth state to rebuild router when it changes
  final authState = ref.watch(authProvider);

  return GoRouter(
    initialLocation: '/login',
    debugLogDiagnostics: true, // Enable debug logging
    redirect: (context, state) {
      final isAuthenticated = authState.isAuthenticated;
      final isLoading = authState.isLoading;
      final isAdmin = authState.isAdmin;
      final isLoginRoute = state.matchedLocation == '/login';
      final isRegisterRoute = state.matchedLocation == '/register';
      final isAdminRoute = state.matchedLocation.startsWith('/admin');

      print('🔄 Router redirect - Auth: $isAuthenticated, Loading: $isLoading, Admin: $isAdmin, Route: ${state.matchedLocation}');

      // Wait for auth to load
      if (isLoading) {
        print('⏳ Still loading...');
        return null;
      }

      // Redirect authenticated users away from login/register
      if (isAuthenticated && (isLoginRoute || isRegisterRoute)) {
        final target = isAdmin ? '/admin/dashboard' : '/home';
        print('✅ Redirecting authenticated user to: $target');
        return target;
      }

      // Redirect non-authenticated users to login
      if (!isAuthenticated && !isLoginRoute && !isRegisterRoute) {
        print('🔐 Redirecting unauthenticated user to login');
        return '/login';
      }

      // Redirect non-admin users away from admin routes
      if (isAuthenticated && isAdminRoute && !isAdmin) {
        print('⛔ Redirecting non-admin from admin route to /home');
        return '/home';
      }

      print('➡️ No redirect needed');
      return null;
    },
    routes: [
      // Auth Routes
      GoRoute(
        path: '/login',
        builder: (context, state) => const LoginPage(),
      ),
      GoRoute(
        path: '/register',
        builder: (context, state) => const RegisterPage(),
      ),

      // User Routes
      GoRoute(
        path: '/home',
        builder: (context, state) => const HomePage(),
      ),
      GoRoute(
        path: '/products',
        builder: (context, state) => const ProductsPage(),
      ),
      GoRoute(
        path: '/products/:id',
        builder: (context, state) {
          final id = state.pathParameters['id']!;
          return ProductDetailPage(productId: id);
        },
      ),

      // Admin Routes
      GoRoute(
        path: '/admin/dashboard',
        builder: (context, state) => const DashboardPage(),
      ),
      GoRoute(
        path: '/admin/users',
        builder: (context, state) => const UsersPage(),
      ),
    ],
  );
});
