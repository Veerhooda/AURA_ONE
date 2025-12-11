import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_typography.dart';
import '../../../../services/api_service.dart';

class SignUpScreen extends ConsumerStatefulWidget {
  const SignUpScreen({super.key});

  @override
  ConsumerState<SignUpScreen> createState() => _SignUpScreenState();
}

class _SignUpScreenState extends ConsumerState<SignUpScreen> {
  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _weightController = TextEditingController();
  final _symptomsController = TextEditingController();
  String _selectedStatus = 'Admitted';
  final _formKey = GlobalKey<FormState>();
  bool _isLoading = false;

  Future<void> _handleRegister() async {
    if (_formKey.currentState!.validate()) {
      setState(() => _isLoading = true);
      
      try {
        await ApiService().register(
          _nameController.text.trim(),
          _emailController.text.trim(), 
          _passwordController.text.trim(),
          weight: _weightController.text.trim(),
          status: _selectedStatus,
          symptoms: _symptomsController.text.trim(),
        );
        
        if (mounted) {
           ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Account Created! Please Login.'),
              backgroundColor: AppColors.success,
              behavior: SnackBarBehavior.floating,
            )
          );
          context.pop(); // Go back to Login
        }
      } catch (e) {
        if (mounted) {
          setState(() => _isLoading = false);
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text('Registration Failed: $e'),
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
        title: const Text("Create Account"),
        backgroundColor: Colors.transparent,
        leading: BackButton(color: AppColors.textPrimary),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24.0),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Text('Join AURA ONE', style: AppTypography.headlineLarge),
              const SizedBox(height: 8),
              Text(
                'Your secure, blockchain-verified health identity starts here.', 
                style: AppTypography.bodyLarge.copyWith(color: AppColors.textSecondary)
              ),
              const SizedBox(height: 32),
              
              TextFormField(
                controller: _nameController,
                decoration: const InputDecoration(
                  labelText: 'Full Name',
                  prefixIcon: Icon(Icons.person_outline),
                ),
                style: AppTypography.bodyLarge,
                validator: (value) => value!.isEmpty ? 'Please enter name' : null,
              ),
              const SizedBox(height: 16),
              
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
                validator: (value) => value!.length < 6 ? 'Password too short' : null,
              ),
              
              const SizedBox(height: 16),
              
              Row(
                children: [
                  Expanded(
                    child: TextFormField(
                      controller: _weightController,
                      decoration: const InputDecoration(
                        labelText: 'Weight (kg)',
                        prefixIcon: Icon(Icons.monitor_weight_outlined),
                      ),
                      style: AppTypography.bodyLarge,
                      keyboardType: TextInputType.number,
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: DropdownButtonFormField<String>(
                      value: _selectedStatus,
                      isExpanded: true,
                      decoration: const InputDecoration(
                        labelText: 'Status',
                        prefixIcon: Icon(Icons.local_hospital_outlined),
                      ),
                      dropdownColor: AppColors.surface,
                      items: ['Admitted', 'Critical', 'Discharged', 'Observation']
                          .map((s) => DropdownMenuItem(value: s, child: Text(s, style: AppTypography.bodyLarge)))
                          .toList(),
                      onChanged: (val) => setState(() => _selectedStatus = val!),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              
              TextFormField(
                controller: _symptomsController,
                decoration: const InputDecoration(
                  labelText: 'Current Symptoms',
                  prefixIcon: Icon(Icons.sick_outlined),
                ),
                style: AppTypography.bodyLarge,
                maxLines: 2,
              ),

              const SizedBox(height: 32),
              ElevatedButton(
                onPressed: _isLoading ? null : _handleRegister,
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
                  : Text('Create AURA ID', style: AppTypography.titleMedium.copyWith(color: Colors.black)),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
