import 'dart:convert';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../config/app_config.dart';
import '../models/user.dart';

class StorageUtils {
  static final StorageUtils _instance = StorageUtils._internal();
  factory StorageUtils() => _instance;

  final FlutterSecureStorage _secureStorage = const FlutterSecureStorage(
    aOptions: AndroidOptions(
      encryptedSharedPreferences: true,
    ),
  );

  StorageUtils._internal();

  // Access Token
  Future<void> saveAccessToken(String token) async {
    await _secureStorage.write(key: AppConfig.accessTokenKey, value: token);
  }

  Future<String?> getAccessToken() async {
    return await _secureStorage.read(key: AppConfig.accessTokenKey);
  }

  Future<void> deleteAccessToken() async {
    await _secureStorage.delete(key: AppConfig.accessTokenKey);
  }

  // Refresh Token
  Future<void> saveRefreshToken(String token) async {
    await _secureStorage.write(key: AppConfig.refreshTokenKey, value: token);
  }

  Future<String?> getRefreshToken() async {
    return await _secureStorage.read(key: AppConfig.refreshTokenKey);
  }

  Future<void> deleteRefreshToken() async {
    await _secureStorage.delete(key: AppConfig.refreshTokenKey);
  }

  // User Data
  Future<void> saveUser(User user) async {
    final userJson = jsonEncode(user.toJson());
    await _secureStorage.write(key: AppConfig.userDataKey, value: userJson);
  }

  Future<User?> getUser() async {
    final userJson = await _secureStorage.read(key: AppConfig.userDataKey);
    if (userJson == null) return null;

    try {
      final userMap = jsonDecode(userJson) as Map<String, dynamic>;
      return User.fromJson(userMap);
    } catch (e) {
      return null;
    }
  }

  Future<void> deleteUser() async {
    await _secureStorage.delete(key: AppConfig.userDataKey);
  }

  // Save all auth data at once
  Future<void> saveAuthData({
    required String accessToken,
    required String refreshToken,
    required User user,
  }) async {
    await Future.wait([
      saveAccessToken(accessToken),
      saveRefreshToken(refreshToken),
      saveUser(user),
    ]);
  }

  // Clear all stored data
  Future<void> clearAll() async {
    await _secureStorage.deleteAll();
  }

  // Check if user is authenticated
  Future<bool> isAuthenticated() async {
    final token = await getAccessToken();
    return token != null && token.isNotEmpty;
  }
}
