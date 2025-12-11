import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_typography.dart';
import '../../../../services/api_service.dart';

class LoginScreen extends ConsumerStatefulWidget {
  final String role;
  const LoginScreen({super.key, required this.role});

  @override
  ConsumerState<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends ConsumerState<LoginScreen> {
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _formKey = GlobalKey<FormState>();
  bool _isLoading = false;

  Future<void> _handleLogin() async {
    if (_formKey.currentState!.validate()) {
      setState(() => _isLoading = true);
      
      try {
        final data = await ApiService().login(
          _emailController.text.trim(), 
          _passwordController.text.trim()
        );
        
        if (mounted) {
          setState(() => _isLoading = false); 
          
          final userRole = data['user'] != null ? data['user']['role'] : null;
          
          if (userRole == 'PATIENT') {
             // Check if profile is complete (defaults to true if key missing)
             final bool isComplete = data['isProfileComplete'] ?? true;
             
             if (!isComplete) {
               context.go('/update-profile');
             } else {
               context.go('/patient/home');
             }
          } else if (userRole == 'DOCTOR') { 
             context.go('/doctor/home');
          } else if (userRole == 'FAMILY') { 
             context.go('/family/home'); 
          } else {
             // Fallback or error if role is unexpected
             ScaffoldMessenger.of(context).showSnackBar(
               SnackBar(
                 content: Text('Login Failed: Unknown role received ($userRole).'),
                 backgroundColor: AppColors.error,
                 behavior: SnackBarBehavior.floating,
               )
             );
          }
        }
      } catch (e) {
        if (mounted) {
          setState(() => _isLoading = false);
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text('Login Failed: ${e.toString().replaceAll("Exception:", "")}'),
              backgroundColor: AppColors.error,
              behavior: SnackBarBehavior.floating,
            )
          );
        }
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("${widget.role[0].toUpperCase()}${widget.role.substring(1).toLowerCase()} Login"),
        backgroundColor: Colors.transparent,
        leading: BackButton(color: AppColors.textPrimary),
      ),
      body: Padding(
        padding: const EdgeInsets.all(24.0),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Text('Welcome Back', style: AppTypography.headlineLarge),
              const SizedBox(height: 8),
              Text(
                'Sign in to access your dashboard', 
                style: AppTypography.bodyLarge.copyWith(color: AppColors.textSecondary)
              ),
              const SizedBox(height: 48),
              TextFormField(
                controller: _emailController,
                decoration: const InputDecoration(
                  labelText: 'Email',
                  prefixIcon: Icon(Icons.email_outlined),
                ),
                style: AppTypography.bodyLarge,
                keyboardType: TextInputType.emailAddress,
                validator: (value) => value!.isEmpty ? 'Please enter email' : null,
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _passwordController,
                decoration: const InputDecoration(
                  labelText: 'Password',
                  prefixIcon: Icon(Icons.lock_outline),
                ),
                obscureText: true,
                style: AppTypography.bodyLarge,
                validator: (value) => value!.isEmpty ? 'Please enter password' : null,
              ),
              const SizedBox(height: 32),
              ElevatedButton(
                onPressed: _isLoading ? null : _handleLogin,
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.primary,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  elevation: 4,
                  shadowColor: AppColors.primary.withOpacity(0.4),
                ),
                child: _isLoading 
                  ? const SizedBox(
                      height: 24, 
                      width: 24, 
                      child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2)
                    )
                  : Text('Sign In', style: AppTypography.titleMedium.copyWith(color: Colors.black)),
              ),
              const SizedBox(height: 24),
              if (widget.role == 'PATIENT')
                Center(
                  child: TextButton(
                    onPressed: () => context.push('/signup'),
                    child: RichText(
                      text: TextSpan(
                        text: "New to AURA? ",
                        style: AppTypography.bodyMedium.copyWith(color: AppColors.textSecondary),
                        children: [
                          TextSpan(
                            text: "Create Account",
                            style: AppTypography.bodyMedium.copyWith(
                              color: AppColors.primary, 
                              fontWeight: FontWeight.bold
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
            ],
          ),
        ),
      ),
    );
  }
}
