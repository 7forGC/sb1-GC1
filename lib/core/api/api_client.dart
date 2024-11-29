import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:cz_flow/core/error/exceptions.dart';
import 'package:cz_flow/app/constants/app_constants.dart';

class ApiClient {
  final http.Client _client;
  String? _authToken;

  ApiClient({http.Client? client}) : _client = client ?? http.Client();

  void setAuthToken(String token) {
    _authToken = token;
  }

  Map<String, String> get _headers {
    final headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    if (_authToken != null) {
      headers['Authorization'] = 'Bearer $_authToken';
    }

    return headers;
  }

  Future<dynamic> get(String endpoint) async {
    try {
      final response = await _client.get(
        Uri.parse('${AppConstants.baseUrl}$endpoint'),
        headers: _headers,
      );
      return _handleResponse(response);
    } catch (e) {
      throw NetworkException('Failed to connect to the server');
    }
  }

  Future<dynamic> post(String endpoint, {Map<String, dynamic>? body}) async {
    try {
      final response = await _client.post(
        Uri.parse('${AppConstants.baseUrl}$endpoint'),
        headers: _headers,
        body: body != null ? json.encode(body) : null,
      );
      return _handleResponse(response);
    } catch (e) {
      throw NetworkException('Failed to connect to the server');
    }
  }

  Future<dynamic> put(String endpoint, {Map<String, dynamic>? body}) async {
    try {
      final response = await _client.put(
        Uri.parse('${AppConstants.baseUrl}$endpoint'),
        headers: _headers,
        body: body != null ? json.encode(body) : null,
      );
      return _handleResponse(response);
    } catch (e) {
      throw NetworkException('Failed to connect to the server');
    }
  }

  Future<dynamic> delete(String endpoint) async {
    try {
      final response = await _client.delete(
        Uri.parse('${AppConstants.baseUrl}$endpoint'),
        headers: _headers,
      );
      return _handleResponse(response);
    } catch (e) {
      throw NetworkException('Failed to connect to the server');
    }
  }

  dynamic _handleResponse(http.Response response) {
    switch (response.statusCode) {
      case 200:
      case 201:
        return json.decode(response.body);
      case 400:
        throw BadRequestException(json.decode(response.body)['message']);
      case 401:
        throw UnauthorizedException('Unauthorized access');
      case 403:
        throw ForbiddenException('Access forbidden');
      case 404:
        throw NotFoundException('Resource not found');
      case 409:
        throw ConflictException(json.decode(response.body)['message']);
      case 422:
        throw ValidationException(json.decode(response.body)['errors']);
      case 500:
      default:
        throw ServerException('Server error occurred');
    }
  }
}