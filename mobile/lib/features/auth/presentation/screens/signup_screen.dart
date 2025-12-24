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
  final _specialtyController = TextEditingController();
  final _wardController = TextEditingController();
  String _selectedStatus = 'Admitted';
  String _selectedRole = 'PATIENT';

  String _formatRole(String role) {
    if (role == 'PATIENT') return 'Patient';
    if (role == 'DOCTOR') return 'Doctor';
    if (role == 'NURSE') return 'Nurse';
    return role;
  }
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
          role: _selectedRole,
          weight: _selectedRole == 'PATIENT' ? _weightController.text.trim() : null,
          status: _selectedRole == 'PATIENT' ? _selectedStatus : null,
          symptoms: _selectedRole == 'PATIENT' ? _symptomsController.text.trim() : null,
          specialty: _selectedRole == 'DOCTOR' ? _specialtyController.text.trim() : null,
          ward: _selectedRole == 'NURSE' ? _wardController.text.trim() : null,
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
              
              const SizedBox(height: 16),
              
              // Role Selection
              DropdownButtonFormField<String>(
                value: _selectedRole,
                decoration: const InputDecoration(
                  labelText: 'I am a...',
                  prefixIcon: Icon(Icons.badge_outlined),
                ),
                dropdownColor: AppColors.surface,
                items: ['PATIENT', 'DOCTOR', 'NURSE']
                    .map((role) => DropdownMenuItem(value: role, child: Text(_formatRole(role), style: AppTypography.bodyLarge)))
                    .toList(),
                onChanged: (val) => setState(() => _selectedRole = val!),
              ),
              const SizedBox(height: 16),

              // Patient Specific Fields
              if (_selectedRole == 'PATIENT') ...[
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
              ],

              // Doctor Specific Fields
              if (_selectedRole == 'DOCTOR') ...[
                TextFormField(
                  controller: _specialtyController,
                  decoration: const InputDecoration(
                    labelText: 'Specialty',
                    prefixIcon: Icon(Icons.medical_services_outlined),
                    hintText: 'e.g. Cardiology, Neurology',
                  ),
                  style: AppTypography.bodyLarge,
                  validator: (val) => val!.isEmpty ? 'Please enter specialty' : null,
                ),
              ],

              // Nurse Specific Fields
              if (_selectedRole == 'NURSE') ...[
                TextFormField(
                  controller: _wardController,
                  decoration: const InputDecoration(
                    labelText: 'Assigned Ward',
                    prefixIcon: Icon(Icons.meeting_room_outlined),
                    hintText: 'e.g. ICU, General Ward A',
                  ),
                  style: AppTypography.bodyLarge,
                  validator: (val) => val!.isEmpty ? 'Please enter ward' : null,
                ),
              ],

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
