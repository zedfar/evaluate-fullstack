import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/user.dart';
import '../models/api_response.dart';
import '../services/user_service.dart';

// User list state
class UserListState {
  final List<User> users;
  final Metadata? metadata;
  final bool isLoading;
  final String? error;

  const UserListState({
    this.users = const [],
    this.metadata,
    this.isLoading = false,
    this.error,
  });

  UserListState copyWith({
    List<User>? users,
    Metadata? metadata,
    bool? isLoading,
    String? error,
  }) {
    return UserListState(
      users: users ?? this.users,
      metadata: metadata ?? this.metadata,
      isLoading: isLoading ?? this.isLoading,
      error: error,
    );
  }
}

// User list notifier
class UserListNotifier extends StateNotifier<UserListState> {
  final UserService _userService = UserService();

  UserListNotifier() : super(const UserListState());

  Future<void> fetchUsers({
    String? search,
    String? sortBy,
    String? order,
    int? skip,
    int? limit,
  }) async {
    state = state.copyWith(isLoading: true, error: null);

    try {
      final response = await _userService.getUsers(
        search: search,
        sortBy: sortBy,
        order: order,
        skip: skip,
        limit: limit,
      );

      state = UserListState(
        users: response.data,
        metadata: response.metadata,
        isLoading: false,
      );
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        error: e.toString(),
      );
    }
  }

  Future<void> deleteUser(String id) async {
    try {
      await _userService.deleteUser(id);
      // Remove from local state
      state = state.copyWith(
        users: state.users.where((u) => u.id != id).toList(),
      );
    } catch (e) {
      state = state.copyWith(error: e.toString());
      rethrow;
    }
  }

  Future<void> toggleActiveStatus(String id, bool isActive) async {
    try {
      final updatedUser = await _userService.toggleActiveStatus(id, isActive);
      // Update in local state
      state = state.copyWith(
        users: state.users.map((u) {
          if (u.id == id) {
            return updatedUser;
          }
          return u;
        }).toList(),
      );
    } catch (e) {
      state = state.copyWith(error: e.toString());
      rethrow;
    }
  }
}

// Provider
final userListProvider =
    StateNotifierProvider<UserListNotifier, UserListState>((ref) {
  return UserListNotifier();
});
