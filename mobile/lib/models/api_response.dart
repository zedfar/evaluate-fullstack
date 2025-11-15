import 'package:json_annotation/json_annotation.dart';

part 'api_response.g.dart';

@JsonSerializable(genericArgumentFactories: true)
class PaginatedResponse<T> {
  final List<T> data;
  final Metadata metadata;

  const PaginatedResponse({
    required this.data,
    required this.metadata,
  });

  factory PaginatedResponse.fromJson(
    Map<String, dynamic> json,
    T Function(Object? json) fromJsonT,
  ) =>
      _$PaginatedResponseFromJson(json, fromJsonT);

  Map<String, dynamic> toJson(Object Function(T value) toJsonT) =>
      _$PaginatedResponseToJson(this, toJsonT);
}

@JsonSerializable()
class Metadata {
  final int total;
  final int skip;
  final int limit;
  final int page;
  @JsonKey(name: 'total_pages')
  final int totalPages;

  const Metadata({
    required this.total,
    required this.skip,
    required this.limit,
    required this.page,
    required this.totalPages,
  });

  factory Metadata.fromJson(Map<String, dynamic> json) =>
      _$MetadataFromJson(json);

  Map<String, dynamic> toJson() => _$MetadataToJson(this);
}

@JsonSerializable(genericArgumentFactories: true)
class ApiResponse<T> {
  final T data;
  final String? message;

  const ApiResponse({
    required this.data,
    this.message,
  });

  factory ApiResponse.fromJson(
    Map<String, dynamic> json,
    T Function(Object? json) fromJsonT,
  ) =>
      _$ApiResponseFromJson(json, fromJsonT);

  Map<String, dynamic> toJson(Object Function(T value) toJsonT) =>
      _$ApiResponseToJson(this, toJsonT);
}

class ApiError {
  final String message;
  final int? statusCode;
  final Map<String, dynamic>? errors;

  const ApiError({
    required this.message,
    this.statusCode,
    this.errors,
  });

  @override
  String toString() => 'ApiError: $message (statusCode: $statusCode)';
}
