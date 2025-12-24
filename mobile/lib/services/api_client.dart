import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

/**
 * Finding #2: HTTP Interceptor for Automatic Token Refresh
 * Intercepts 401 responses, refreshes token, retries original request
 */
class ApiClient {
  final http.Client _client = http.Client();
  final _storage = const FlutterSecureStorage();
  
  // Finding #2: Mutex to prevent parallel refresh storms
  bool _isRefreshing = false;
  List<Function> _refreshQueue = [];

  Future<http.Response> get(String url, {Map<String, String>? headers}) async {
    return _requestWithRetry(() => _client.get(Uri.parse(url), headers: headers));
  }

  Future<http.Response> post(String url, {Map<String, String>? headers, dynamic body}) async {
    return _requestWithRetry(() => _client.post(
      Uri.parse(url),
      headers: headers,
      body: body,
    ));
  }

  Future<http.Response> patch(String url, {Map<String, String>? headers, dynamic body}) async {
    return _requestWithRetry(() => _client.patch(
      Uri.parse(url),
      headers: headers,
      body: body,
    ));
  }

  /**
   * Finding #2: Request with automatic retry on 401
   */
  Future<http.Response> _requestWithRetry(Future<http.Response> Function() request) async {
    final response = await request();

    // Finding #2: Handle 401 - Token expired
    if (response.statusCode == 401) {
      // Try to refresh token
      final refreshed = await _refreshToken();

      if (refreshed) {
        // Retry original request with new token
        return await request();
      } else {
        // Refresh failed - hard logout
        await _handleLogout();
        throw Exception('Session expired. Please login again.');
      }
    }

    return response;
  }

  /**
   * Finding #2: Refresh access token
   * Returns true if successful, false if refresh token expired
   */
  Future<bool> _refreshToken() async {
    // Finding #2: Mutex - prevent parallel refresh
    if (_isRefreshing) {
      // Wait for ongoing refresh to complete
      final completer = Completer<bool>();
      _refreshQueue.add(() => completer.complete(true));
      return completer.future;
    }

    _isRefreshing = true;

    try {
      final refreshToken = await _storage.read(key: 'refresh_token');

      if (refreshToken == null) {
        return false;
      }

      final response = await _client.post(
        Uri.parse('${await _getBaseUrl()}/auth/refresh'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'refresh_token': refreshToken}),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        
        // Store new access token
        await _storage.write(key: 'jwt_token', value: data['access_token']);
        
        // Process queued requests
        for (final callback in _refreshQueue) {
          callback();
        }
        _refreshQueue.clear();
        
        return true;
      } else {
        // Refresh token expired
        return false;
      }
    } catch (e) {
      print('Token refresh failed: $e');
      return false;
    } finally {
      _isRefreshing = false;
    }
  }

  /**
   * Finding #2: Hard logout on refresh failure
   */
  Future<void> _handleLogout() async {
    await _storage.deleteAll();
    // TODO: Navigate to login screen
  }

  Future<String> _getBaseUrl() async {
    // Get from environment or config
    return 'http://localhost:3001';
  }
}
