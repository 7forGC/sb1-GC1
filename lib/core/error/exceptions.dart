class NetworkException implements Exception {
  final String message;
  NetworkException(this.message);
}

class ServerException implements Exception {
  final String message;
  ServerException(this.message);
}

class BadRequestException implements Exception {
  final String message;
  BadRequestException(this.message);
}

class UnauthorizedException implements Exception {
  final String message;
  UnauthorizedException(this.message);
}

class ForbiddenException implements Exception {
  final String message;
  ForbiddenException(this.message);
}

class NotFoundException implements Exception {
  final String message;
  NotFoundException(this.message);
}

class ConflictException implements Exception {
  final String message;
  ConflictException(this.message);
}

class ValidationException implements Exception {
  final Map<String, dynamic> errors;
  ValidationException(this.errors);
}

class CacheException implements Exception {
  final String message;
  CacheException(this.message);
}