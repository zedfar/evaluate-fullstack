class AppConfig {
  static const String appName = 'Dev Mobile Products';

  // API Configuration
  static const String apiBaseUrl = 'https://dev-svc-products.vercel.app/api/v1';

  // Staging API URL
  static const String apiStagingUrl = 'https://dev-svc-products.vercel.app/api/v1';

  // Production API URL
  static const String apiProductionUrl = 'https://dev-svc-products.vercel.app/api/v1';

  // Use this to switch between environments
  static const bool useStaging = false;
  static const bool useProduction = false;

  static String get currentApiUrl {
    if (useProduction) return apiProductionUrl;
    if (useStaging) return apiStagingUrl;
    return apiBaseUrl;
  }

  // Storage Keys
  static const String accessTokenKey = 'access_token';
  static const String refreshTokenKey = 'refresh_token';
  static const String userDataKey = 'user_data';

  // Pagination
  static const int defaultPageSize = 12;
  static const int adminPageSize = 10;

  // Request Timeout
  static const int connectionTimeout = 30000; // 30 seconds
  static const int receiveTimeout = 30000; // 30 seconds

  // Token Refresh
  static const bool useRefreshToken = true;

  // Debounce Duration
  static const int searchDebounceDuration = 500; // milliseconds
}
