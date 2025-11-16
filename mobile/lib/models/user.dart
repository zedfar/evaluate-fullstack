import 'package:equatable/equatable.dart';
import 'package:json_annotation/json_annotation.dart';

part 'user.g.dart';

@JsonSerializable()
class User extends Equatable {
  final String id;
  final String email;
  final String username;
  @JsonKey(name: 'full_name')
  final String fullName;
  @JsonKey(name: 'role_id')
  final String? roleId;
  final Role? role;
  @JsonKey(name: 'is_active')
  final bool? isActive;
  @JsonKey(name: 'created_at')
  final String? createdAt;
  @JsonKey(name: 'updated_at')
  final String? updatedAt;

  const User({
    required this.id,
    required this.email,
    required this.username,
    required this.fullName,
    this.roleId,
    this.role,
    this.isActive,
    this.createdAt,
    this.updatedAt,
  });

  factory User.fromJson(Map<String, dynamic> json) => _$UserFromJson(json);

  Map<String, dynamic> toJson() => _$UserToJson(this);

  @override
  List<Object?> get props => [
        id,
        email,
        username,
        fullName,
        roleId,
        role,
        isActive,
        createdAt,
        updatedAt,
      ];

  User copyWith({
    String? id,
    String? email,
    String? username,
    String? fullName,
    String? roleId,
    Role? role,
    bool? isActive,
    String? createdAt,
    String? updatedAt,
  }) {
    return User(
      id: id ?? this.id,
      email: email ?? this.email,
      username: username ?? this.username,
      fullName: fullName ?? this.fullName,
      roleId: roleId ?? this.roleId,
      role: role ?? this.role,
      isActive: isActive ?? this.isActive,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }
}

@JsonSerializable()
class Role extends Equatable {
  final String id;
  final String name;
  final String? description;
  @JsonKey(name: 'created_at')
  final String? createdAt;
  @JsonKey(name: 'updated_at')
  final String? updatedAt;

  const Role({
    required this.id,
    required this.name,
    this.description,
    this.createdAt,
    this.updatedAt,
  });

  factory Role.fromJson(Map<String, dynamic> json) => _$RoleFromJson(json);

  Map<String, dynamic> toJson() => _$RoleToJson(this);

  @override
  List<Object?> get props => [id, name, description, createdAt, updatedAt];
}

@JsonSerializable()
class LoginCredentials {
  final String username;
  final String password;

  const LoginCredentials({
    required this.username,
    required this.password,
  });

  Map<String, dynamic> toJson() => _$LoginCredentialsToJson(this);
}

@JsonSerializable()
class RegisterData {
  final String email;
  final String username;
  final String password;
  @JsonKey(name: 'full_name')
  final String fullName;

  const RegisterData({
    required this.email,
    required this.username,
    required this.password,
    required this.fullName,
  });

  Map<String, dynamic> toJson() => _$RegisterDataToJson(this);
}

@JsonSerializable()
class AuthResponse {
  @JsonKey(name: 'access_token')
  final String accessToken;
  @JsonKey(name: 'refresh_token')
  final String? refreshToken;  // Nullable because API might not return it
  @JsonKey(name: 'token_type')
  final String? tokenType;      // Optional field from API
  final User metadata;

  const AuthResponse({
    required this.accessToken,
    this.refreshToken,
    this.tokenType,
    required this.metadata,
  });

  factory AuthResponse.fromJson(Map<String, dynamic> json) =>
      _$AuthResponseFromJson(json);

  Map<String, dynamic> toJson() => _$AuthResponseToJson(this);
}
