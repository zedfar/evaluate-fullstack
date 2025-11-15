import 'package:dio/dio.dart';
import 'package:logger/logger.dart';
import '../config/app_config.dart';
import '../models/api_response.dart';
import '../utils/storage_utils.dart';

class ApiService {
  static final ApiService _instance = ApiService._internal();
  factory ApiService() => _instance;

  late final Dio _dio;
  final Logger _logger = Logger();
  final StorageUtils _storage = StorageUtils();

  ApiService._internal() {
    _dio = Dio(
      BaseOptions(
        baseUrl: AppConfig.currentApiUrl,
        connectTimeout: const Duration(milliseconds: AppConfig.connectionTimeout),
        receiveTimeout: const Duration(milliseconds: AppConfig.receiveTimeout),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      ),
    );

    _setupInterceptors();
  }

  void _setupInterceptors() {
    _dio.interceptors.add(
      InterceptorsWrapper(
        onRequest: (options, handler) async {
          // Add auth token to all requests
          final token = await _storage.getAccessToken();
          if (token != null) {
            options.headers['Authorization'] = 'Bearer $token';
          }

          _logger.d('REQUEST[${options.method}] => PATH: ${options.path}');
          return handler.next(options);
        },
        onResponse: (response, handler) {
          _logger.d(
              'RESPONSE[${response.statusCode}] => PATH: ${response.requestOptions.path}');
          return handler.next(response);
        },
        onError: (error, handler) async {
          _logger.e(
            'ERROR[${error.response?.statusCode}] => PATH: ${error.requestOptions.path}',
            error: error,
          );

          // Handle 401 Unauthorized - Token expired
          if (error.response?.statusCode == 401 &&
              AppConfig.useRefreshToken) {
            try {
              // Attempt to refresh the token
              final newToken = await _refreshToken();
              if (newToken != null) {
                // Retry the original request with new token
                error.requestOptions.headers['Authorization'] =
                    'Bearer $newToken';
                final response = await _dio.fetch(error.requestOptions);
                return handler.resolve(response);
              }
            } catch (e) {
              _logger.e('Token refresh failed', error: e);
              // Clear auth and force logout
              await _storage.clearAll();
            }
          }

          return handler.next(error);
        },
      ),
    );

    // Add logging interceptor for debugging
    if (AppConfig.currentApiUrl == AppConfig.apiBaseUrl) {
      _dio.interceptors.add(LogInterceptor(
        requestBody: true,
        responseBody: true,
        logPrint: (obj) => _logger.d(obj),
      ));
    }
  }

  Future<String?> _refreshToken() async {
    try {
      final refreshToken = await _storage.getRefreshToken();
      if (refreshToken == null) return null;

      final response = await _dio.post(
        '/auth/refresh',
        data: {'refresh_token': refreshToken},
      );

      final newAccessToken = response.data['access_token'] as String?;
      if (newAccessToken != null) {
        await _storage.saveAccessToken(newAccessToken);
        return newAccessToken;
      }
    } catch (e) {
      _logger.e('Failed to refresh token', error: e);
    }
    return null;
  }

  // Generic GET request
  Future<T> get<T>(
    String path, {
    Map<String, dynamic>? queryParameters,
    Options? options,
    CancelToken? cancelToken,
  }) async {
    try {
      final response = await _dio.get<T>(
        path,
        queryParameters: queryParameters,
        options: options,
        cancelToken: cancelToken,
      );
      return response.data as T;
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  // Generic POST request
  Future<T> post<T>(
    String path, {
    dynamic data,
    Map<String, dynamic>? queryParameters,
    Options? options,
    CancelToken? cancelToken,
  }) async {
    try {
      final response = await _dio.post<T>(
        path,
        data: data,
        queryParameters: queryParameters,
        options: options,
        cancelToken: cancelToken,
      );
      return response.data as T;
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  // Generic PUT request
  Future<T> put<T>(
    String path, {
    dynamic data,
    Map<String, dynamic>? queryParameters,
    Options? options,
    CancelToken? cancelToken,
  }) async {
    try {
      final response = await _dio.put<T>(
        path,
        data: data,
        queryParameters: queryParameters,
        options: options,
        cancelToken: cancelToken,
      );
      return response.data as T;
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  // Generic PATCH request
  Future<T> patch<T>(
    String path, {
    dynamic data,
    Map<String, dynamic>? queryParameters,
    Options? options,
    CancelToken? cancelToken,
  }) async {
    try {
      final response = await _dio.patch<T>(
        path,
        data: data,
        queryParameters: queryParameters,
        options: options,
        cancelToken: cancelToken,
      );
      return response.data as T;
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  // Generic DELETE request
  Future<T> delete<T>(
    String path, {
    dynamic data,
    Map<String, dynamic>? queryParameters,
    Options? options,
    CancelToken? cancelToken,
  }) async {
    try {
      final response = await _dio.delete<T>(
        path,
        data: data,
        queryParameters: queryParameters,
        options: options,
        cancelToken: cancelToken,
      );
      return response.data as T;
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  ApiError _handleError(DioException error) {
    String message = 'An unexpected error occurred';
    int? statusCode;
    Map<String, dynamic>? errors;

    if (error.response != null) {
      statusCode = error.response!.statusCode;
      final data = error.response!.data;

      if (data is Map<String, dynamic>) {
        message = data['message'] ?? data['detail'] ?? message;
        errors = data['errors'] as Map<String, dynamic>?;
      } else if (data is String) {
        message = data;
      }
    } else {
      switch (error.type) {
        case DioExceptionType.connectionTimeout:
        case DioExceptionType.sendTimeout:
        case DioExceptionType.receiveTimeout:
          message = 'Connection timeout. Please try again.';
          break;
        case DioExceptionType.connectionError:
          message = 'No internet connection. Please check your network.';
          break;
        case DioExceptionType.cancel:
          message = 'Request was cancelled';
          break;
        default:
          message = error.message ?? message;
      }
    }

    return ApiError(
      message: message,
      statusCode: statusCode,
      errors: errors,
    );
  }

  // POST with FormData (for login)
  Future<T> postFormData<T>(
    String path, {
    required Map<String, dynamic> data,
    Options? options,
    CancelToken? cancelToken,
  }) async {
    try {
      final formData = FormData.fromMap(data);
      final response = await _dio.post<T>(
        path,
        data: formData,
        options: options,
        cancelToken: cancelToken,
      );
      return response.data as T;
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }
}
