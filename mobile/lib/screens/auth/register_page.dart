import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../providers/auth_provider.dart';

class RegisterPage extends ConsumerStatefulWidget {
  const RegisterPage({super.key});

  @override
  ConsumerState<RegisterPage> createState() => _RegisterPageState();
}

class _RegisterPageState extends ConsumerState<RegisterPage> {
  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController();
  final _usernameController = TextEditingController();
  final _fullNameController = TextEditingController();
  final _passwordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();
  bool _obscurePassword = true;
  bool _obscureConfirmPassword = true;

  @override
  void dispose() {
    _emailController.dispose();
    _usernameController.dispose();
    _fullNameController.dispose();
    _passwordController.dispose();
    _confirmPasswordController.dispose();
    super.dispose();
  }

  Future<void> _handleRegister() async {
    if (!_formKey.currentState!.validate()) return;

    final email = _emailController.text.trim();
    final username = _usernameController.text.trim();
    final fullName = _fullNameController.text.trim();
    final password = _passwordController.text;

    final success = await ref.read(authProvider.notifier).register(
          email: email,
          username: username,
          password: password,
          fullName: fullName,
        );

    if (!mounted) return;

    if (!success) {
      final error = ref.read(authProvider).error;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(error ?? 'Registration failed. Please try again.'),
          backgroundColor: Colors.red,
        ),
      );
    }
    // Router will auto-redirect based on auth state
  }

  @override
  Widget build(BuildContext context) {
    final authState = ref.watch(authProvider);

    return Scaffold(
      body: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [
              Colors.grey[50]!,
              Colors.grey[100]!,
            ],
          ),
        ),
        child: Stack(
          children: [
            // Background image with overlay (optional)
            Positioned.fill(
              child: Opacity(
                opacity: 0.1,
                child: Image.network(
                  'https://lh3.googleusercontent.com/aida-public/AB6AXuBolW05KuiQUudy1GrmMmLs9JyPT9wB_vGSYwHRn11osVC2Pcs45k97SqNjnxmJ89BY83SJuMPojhGM8OgFx6mYV55K6IrMWXtVdeCnw33KG0i5TNbaso24umSZBrqqMNnZqO-YBkdag7qwuShaXq8cXgNrObScW952Dge4FgQZZa49ZELhud-ikBZSvL_xFjiNR0mvcUOKIfWjUn2yhrCulaoYUYead3MZBmyMudTd1TaNFLxoC-GVuDkw1UCZei4SDH9jV1egZ4U',
                  fit: BoxFit.cover,
                  errorBuilder: (context, error, stackTrace) => const SizedBox(),
                ),
              ),
            ),

            // Content
            SafeArea(
              child: Center(
                child: SingleChildScrollView(
                  padding: const EdgeInsets.all(24.0),
                  child: Container(
                    constraints: const BoxConstraints(maxWidth: 400),
                    child: Card(
                      elevation: 8,
                      shadowColor: Colors.black.withOpacity(0.3),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: Padding(
                        padding: const EdgeInsets.all(32.0),
                        child: Form(
                          key: _formKey,
                          child: Column(
                            mainAxisSize: MainAxisSize.min,
                            crossAxisAlignment: CrossAxisAlignment.stretch,
                            children: [
                              // Logo/Title with gradient
                              ShaderMask(
                                shaderCallback: (bounds) => const LinearGradient(
                                  colors: [
                                    Color(0xFFD97706), // amber-600
                                    Color(0xFF92400E), // amber-800
                                  ],
                                ).createShader(bounds),
                                child: const Text(
                                  'LOQO',
                                  textAlign: TextAlign.center,
                                  style: TextStyle(
                                    fontSize: 56,
                                    fontWeight: FontWeight.bold,
                                    color: Colors.white,
                                  ),
                                ),
                              ),
                              const SizedBox(height: 8),
                              Text(
                                'Create your account',
                                textAlign: TextAlign.center,
                                style: TextStyle(
                                  color: Colors.grey[600],
                                  fontSize: 14,
                                ),
                              ),
                              const SizedBox(height: 32),

                              // Email Field
                              _buildFormField(
                                label: 'Email',
                                hint: 'Enter your email',
                                controller: _emailController,
                                keyboardType: TextInputType.emailAddress,
                                textInputAction: TextInputAction.next,
                                enabled: !authState.isLoading,
                                validator: (value) {
                                  if (value == null || value.isEmpty) {
                                    return 'Email is required';
                                  }
                                  if (!value.contains('@')) {
                                    return 'Please enter a valid email';
                                  }
                                  return null;
                                },
                              ),
                              const SizedBox(height: 16),

                              // Username Field
                              _buildFormField(
                                label: 'Username',
                                hint: 'Enter your username',
                                controller: _usernameController,
                                textInputAction: TextInputAction.next,
                                enabled: !authState.isLoading,
                                validator: (value) {
                                  if (value == null || value.isEmpty) {
                                    return 'Username is required';
                                  }
                                  if (value.length < 3) {
                                    return 'Username must be at least 3 characters';
                                  }
                                  return null;
                                },
                              ),
                              const SizedBox(height: 16),

                              // Full Name Field
                              _buildFormField(
                                label: 'Full Name',
                                hint: 'Enter your full name',
                                controller: _fullNameController,
                                textInputAction: TextInputAction.next,
                                enabled: !authState.isLoading,
                                validator: (value) {
                                  if (value == null || value.isEmpty) {
                                    return 'Full name is required';
                                  }
                                  return null;
                                },
                              ),
                              const SizedBox(height: 16),

                              // Password Field
                              _buildFormField(
                                label: 'Password',
                                hint: 'Enter your password',
                                controller: _passwordController,
                                obscureText: _obscurePassword,
                                textInputAction: TextInputAction.next,
                                enabled: !authState.isLoading,
                                suffixIcon: IconButton(
                                  icon: Icon(
                                    _obscurePassword
                                        ? Icons.visibility_outlined
                                        : Icons.visibility_off_outlined,
                                    color: Colors.grey[400],
                                  ),
                                  onPressed: () {
                                    setState(() {
                                      _obscurePassword = !_obscurePassword;
                                    });
                                  },
                                ),
                                validator: (value) {
                                  if (value == null || value.isEmpty) {
                                    return 'Password is required';
                                  }
                                  if (value.length < 6) {
                                    return 'Password must be at least 6 characters';
                                  }
                                  return null;
                                },
                              ),
                              const SizedBox(height: 16),

                              // Confirm Password Field
                              _buildFormField(
                                label: 'Confirm Password',
                                hint: 'Confirm your password',
                                controller: _confirmPasswordController,
                                obscureText: _obscureConfirmPassword,
                                textInputAction: TextInputAction.done,
                                enabled: !authState.isLoading,
                                onFieldSubmitted: (_) => _handleRegister(),
                                suffixIcon: IconButton(
                                  icon: Icon(
                                    _obscureConfirmPassword
                                        ? Icons.visibility_outlined
                                        : Icons.visibility_off_outlined,
                                    color: Colors.grey[400],
                                  ),
                                  onPressed: () {
                                    setState(() {
                                      _obscureConfirmPassword =
                                          !_obscureConfirmPassword;
                                    });
                                  },
                                ),
                                validator: (value) {
                                  if (value == null || value.isEmpty) {
                                    return 'Please confirm your password';
                                  }
                                  if (value != _passwordController.text) {
                                    return 'Passwords do not match';
                                  }
                                  return null;
                                },
                              ),
                              const SizedBox(height: 28),

                              // Register Button with gradient
                              Container(
                                decoration: BoxDecoration(
                                  gradient: const LinearGradient(
                                    colors: [
                                      Color(0xFFD97706), // amber-600
                                      Color(0xFFB45309), // amber-700
                                    ],
                                  ),
                                  borderRadius: BorderRadius.circular(12),
                                  boxShadow: [
                                    BoxShadow(
                                      color: const Color(0xFFD97706).withOpacity(0.3),
                                      blurRadius: 12,
                                      offset: const Offset(0, 4),
                                    ),
                                  ],
                                ),
                                child: ElevatedButton(
                                  onPressed:
                                      authState.isLoading ? null : _handleRegister,
                                  style: ElevatedButton.styleFrom(
                                    backgroundColor: Colors.transparent,
                                    shadowColor: Colors.transparent,
                                    padding: const EdgeInsets.symmetric(vertical: 16),
                                    shape: RoundedRectangleBorder(
                                      borderRadius: BorderRadius.circular(12),
                                    ),
                                  ),
                                  child: authState.isLoading
                                      ? const Row(
                                          mainAxisAlignment: MainAxisAlignment.center,
                                          children: [
                                            SizedBox(
                                              height: 20,
                                              width: 20,
                                              child: CircularProgressIndicator(
                                                strokeWidth: 2,
                                                valueColor:
                                                    AlwaysStoppedAnimation<Color>(
                                                        Colors.white),
                                              ),
                                            ),
                                            SizedBox(width: 12),
                                            Text(
                                              'Creating account...',
                                              style: TextStyle(
                                                color: Colors.white,
                                                fontSize: 16,
                                                fontWeight: FontWeight.w600,
                                              ),
                                            ),
                                          ],
                                        )
                                      : const Row(
                                          mainAxisAlignment: MainAxisAlignment.center,
                                          children: [
                                            Icon(Icons.person_add, color: Colors.white),
                                            SizedBox(width: 8),
                                            Text(
                                              'Create Account',
                                              style: TextStyle(
                                                color: Colors.white,
                                                fontSize: 16,
                                                fontWeight: FontWeight.w600,
                                              ),
                                            ),
                                          ],
                                        ),
                                ),
                              ),
                              const SizedBox(height: 20),

                              // Login Link
                              Row(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  Text(
                                    'Already have an account? ',
                                    style: TextStyle(
                                      color: Colors.grey[600],
                                      fontSize: 14,
                                    ),
                                  ),
                                  GestureDetector(
                                    onTap: authState.isLoading
                                        ? null
                                        : () => context.go('/login'),
                                    child: const Text(
                                      'Sign in',
                                      style: TextStyle(
                                        color: Color(0xFFD97706),
                                        fontSize: 14,
                                        fontWeight: FontWeight.w600,
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildFormField({
    required String label,
    required String hint,
    required TextEditingController controller,
    bool obscureText = false,
    TextInputType? keyboardType,
    TextInputAction? textInputAction,
    bool enabled = true,
    Widget? suffixIcon,
    void Function(String)? onFieldSubmitted,
    String? Function(String?)? validator,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: TextStyle(
            fontSize: 14,
            fontWeight: FontWeight.w500,
            color: Colors.grey[700],
          ),
        ),
        const SizedBox(height: 8),
        TextFormField(
          controller: controller,
          obscureText: obscureText,
          keyboardType: keyboardType,
          textInputAction: textInputAction,
          enabled: enabled,
          onFieldSubmitted: onFieldSubmitted,
          decoration: InputDecoration(
            hintText: hint,
            filled: true,
            fillColor: Colors.white,
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: BorderSide(color: Colors.grey[300]!),
            ),
            enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: BorderSide(color: Colors.grey[300]!),
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: const BorderSide(
                color: Color(0xFFD97706),
                width: 2,
              ),
            ),
            errorBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: const BorderSide(color: Colors.red),
            ),
            contentPadding: const EdgeInsets.symmetric(
              horizontal: 16,
              vertical: 14,
            ),
            suffixIcon: suffixIcon,
          ),
          validator: validator,
        ),
      ],
    );
  }
}
