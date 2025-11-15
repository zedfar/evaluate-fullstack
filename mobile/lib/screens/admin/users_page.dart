import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../providers/user_provider.dart';
import '../../config/app_config.dart';

class UsersPage extends ConsumerStatefulWidget {
  const UsersPage({super.key});

  @override
  ConsumerState<UsersPage> createState() => _UsersPageState();
}

class _UsersPageState extends ConsumerState<UsersPage> {
  final _searchController = TextEditingController();
  String? _sortBy = 'created_at';
  String? _order = 'desc';
  int _currentPage = 1;
  final int _pageSize = AppConfig.adminPageSize;

  @override
  void initState() {
    super.initState();
    Future.microtask(() => _fetchUsers());
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  void _fetchUsers() {
    final skip = (_currentPage - 1) * _pageSize;
    ref.read(userListProvider.notifier).fetchUsers(
          search: _searchController.text.isEmpty ? null : _searchController.text,
          sortBy: _sortBy,
          order: _order,
          skip: skip,
          limit: _pageSize,
        );
  }

  Future<void> _deleteUser(String id, String username) async {
    final confirm = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Delete User'),
        content: Text('Are you sure you want to delete "$username"?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(false),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () => Navigator.of(context).pop(true),
            style: TextButton.styleFrom(foregroundColor: Colors.red),
            child: const Text('Delete'),
          ),
        ],
      ),
    );

    if (confirm == true && mounted) {
      try {
        await ref.read(userListProvider.notifier).deleteUser(id);
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('User deleted successfully'),
              backgroundColor: Colors.green,
            ),
          );
          _fetchUsers();
        }
      } catch (e) {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text('Failed to delete user: $e'),
              backgroundColor: Colors.red,
            ),
          );
        }
      }
    }
  }

  Future<void> _toggleActiveStatus(String id, bool currentStatus) async {
    try {
      await ref.read(userListProvider.notifier).toggleActiveStatus(id, !currentStatus);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(
              currentStatus ? 'User deactivated' : 'User activated',
            ),
            backgroundColor: Colors.green,
          ),
        );
        _fetchUsers();
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Failed to update user: $e'),
            backgroundColor: Colors.red,
          ),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final userState = ref.watch(userListProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('User Management'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => context.go('/admin/dashboard'),
        ),
      ),
      body: Column(
        children: [
          // Filters
          Container(
            padding: const EdgeInsets.all(16),
            color: Colors.grey[100],
            child: Column(
              children: [
                // Search
                TextField(
                  controller: _searchController,
                  decoration: const InputDecoration(
                    hintText: 'Search users...',
                    prefixIcon: Icon(Icons.search),
                  ),
                  onSubmitted: (_) {
                    _currentPage = 1;
                    _fetchUsers();
                  },
                ),
                const SizedBox(height: 12),

                // Sort
                Row(
                  children: [
                    Expanded(
                      child: DropdownButtonFormField<String>(
                        value: _sortBy,
                        decoration: const InputDecoration(
                          labelText: 'Sort By',
                          isDense: true,
                        ),
                        items: const [
                          DropdownMenuItem(
                              value: 'username', child: Text('Username')),
                          DropdownMenuItem(value: 'email', child: Text('Email')),
                          DropdownMenuItem(
                              value: 'full_name', child: Text('Full Name')),
                          DropdownMenuItem(
                              value: 'created_at', child: Text('Date Created')),
                        ],
                        onChanged: (value) {
                          setState(() {
                            _sortBy = value;
                            _currentPage = 1;
                          });
                          _fetchUsers();
                        },
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: DropdownButtonFormField<String>(
                        value: _order,
                        decoration: const InputDecoration(
                          labelText: 'Order',
                          isDense: true,
                        ),
                        items: const [
                          DropdownMenuItem(value: 'asc', child: Text('Ascending')),
                          DropdownMenuItem(
                              value: 'desc', child: Text('Descending')),
                        ],
                        onChanged: (value) {
                          setState(() {
                            _order = value;
                            _currentPage = 1;
                          });
                          _fetchUsers();
                        },
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),

          // Users List
          Expanded(
            child: userState.isLoading
                ? const Center(child: CircularProgressIndicator())
                : userState.error != null
                    ? Center(child: Text(userState.error!))
                    : userState.users.isEmpty
                        ? const Center(child: Text('No users found'))
                        : RefreshIndicator(
                            onRefresh: () async => _fetchUsers(),
                            child: ListView.builder(
                              itemCount: userState.users.length,
                              itemBuilder: (context, index) {
                                final user = userState.users[index];

                                return Card(
                                  margin: const EdgeInsets.symmetric(
                                    horizontal: 16,
                                    vertical: 8,
                                  ),
                                  child: ListTile(
                                    leading: CircleAvatar(
                                      backgroundColor: user.isActive
                                          ? Colors.blue
                                          : Colors.grey,
                                      child: Text(
                                        user.username[0].toUpperCase(),
                                        style: const TextStyle(color: Colors.white),
                                      ),
                                    ),
                                    title: Text(
                                      user.fullName,
                                      style: const TextStyle(
                                        fontWeight: FontWeight.bold,
                                      ),
                                    ),
                                    subtitle: Column(
                                      crossAxisAlignment:
                                          CrossAxisAlignment.start,
                                      children: [
                                        Text('@${user.username}'),
                                        Text(
                                          user.email,
                                          style: TextStyle(
                                            fontSize: 12,
                                            color: Colors.grey[600],
                                          ),
                                        ),
                                        Row(
                                          children: [
                                            Container(
                                              padding: const EdgeInsets.symmetric(
                                                horizontal: 8,
                                                vertical: 2,
                                              ),
                                              decoration: BoxDecoration(
                                                color: user.role != null
                                                    ? Colors.purple[100]
                                                    : Colors.grey[200],
                                                borderRadius:
                                                    BorderRadius.circular(4),
                                              ),
                                              child: Text(
                                                user.role?.name ?? 'No Role',
                                                style: TextStyle(
                                                  fontSize: 11,
                                                  color: user.role != null
                                                      ? Colors.purple[900]
                                                      : Colors.grey[700],
                                                ),
                                              ),
                                            ),
                                            const SizedBox(width: 8),
                                            Container(
                                              padding: const EdgeInsets.symmetric(
                                                horizontal: 8,
                                                vertical: 2,
                                              ),
                                              decoration: BoxDecoration(
                                                color: user.isActive
                                                    ? Colors.green[100]
                                                    : Colors.red[100],
                                                borderRadius:
                                                    BorderRadius.circular(4),
                                              ),
                                              child: Text(
                                                user.isActive
                                                    ? 'Active'
                                                    : 'Inactive',
                                                style: TextStyle(
                                                  fontSize: 11,
                                                  color: user.isActive
                                                      ? Colors.green[900]
                                                      : Colors.red[900],
                                                ),
                                              ),
                                            ),
                                          ],
                                        ),
                                      ],
                                    ),
                                    trailing: PopupMenuButton(
                                      itemBuilder: (context) => [
                                        PopupMenuItem(
                                          value: 'toggle',
                                          child: Text(user.isActive
                                              ? 'Deactivate'
                                              : 'Activate'),
                                        ),
                                        const PopupMenuItem(
                                          value: 'edit',
                                          child: Text('Edit'),
                                        ),
                                        const PopupMenuItem(
                                          value: 'delete',
                                          child: Text('Delete'),
                                        ),
                                      ],
                                      onSelected: (value) {
                                        if (value == 'toggle') {
                                          _toggleActiveStatus(
                                              user.id, user.isActive);
                                        } else if (value == 'delete') {
                                          _deleteUser(user.id, user.username);
                                        }
                                      },
                                    ),
                                  ),
                                );
                              },
                            ),
                          ),
          ),

          // Pagination
          if (userState.metadata != null)
            Container(
              padding: const EdgeInsets.all(16),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text('Total: ${userState.metadata!.total}'),
                  Row(
                    children: [
                      IconButton(
                        icon: const Icon(Icons.chevron_left),
                        onPressed: _currentPage > 1
                            ? () {
                                setState(() => _currentPage--);
                                _fetchUsers();
                              }
                            : null,
                      ),
                      Text(
                          'Page $_currentPage of ${userState.metadata!.totalPages}'),
                      IconButton(
                        icon: const Icon(Icons.chevron_right),
                        onPressed: _currentPage < userState.metadata!.totalPages
                            ? () {
                                setState(() => _currentPage++);
                                _fetchUsers();
                              }
                            : null,
                      ),
                    ],
                  ),
                ],
              ),
            ),
        ],
      ),
    );
  }
}
