import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_typography.dart';
import '../../../../services/api_service.dart';

class UpdateProfileScreen extends StatefulWidget {
  final String? initialWeight;
  final String? initialStatus;
  final String? initialSymptoms;

  const UpdateProfileScreen({
    super.key,
    this.initialWeight,
    this.initialStatus,
    this.initialSymptoms,
  });

  @override
  State<UpdateProfileScreen> createState() => _UpdateProfileScreenState();
}

class _UpdateProfileScreenState extends State<UpdateProfileScreen> {
  late TextEditingController _weightController;
  late TextEditingController _symptomsController;
  late String _selectedStatus; // Removed default initialization here
  bool _isLoading = false;
  final _formKey = GlobalKey<FormState>();

  @override
  void initState() {
    super.initState();
    _weightController = TextEditingController(text: widget.initialWeight);
    _symptomsController = TextEditingController(text: widget.initialSymptoms);
    _selectedStatus = widget.initialStatus ?? 'Admitted';
    
    // Ensure status is valid
    if (!['Admitted', 'Critical', 'Discharged', 'Observation'].contains(_selectedStatus)) {
      _selectedStatus = 'Admitted';
    }
  }

  Future<void> _handleSubmit() async {
    if (_formKey.currentState!.validate()) {
      setState(() => _isLoading = true);
      try {
        await ApiService().updateProfile(
          weight: _weightController.text.trim(),
          status: _selectedStatus,
          symptoms: _symptomsController.text.trim(),
        );

        if (mounted) {
           setState(() => _isLoading = false);
           ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text("Profile Updated Successfully!"),
              backgroundColor: AppColors.success,
            )
           );
           if (Navigator.canPop(context)) {
             Navigator.pop(context);
           }
        }
      } catch (e) {
        if (mounted) {
          setState(() => _isLoading = false);
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text("Update Failed: $e"),
              backgroundColor: AppColors.error,
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
        title: const Text("Complete Your Profile"),
        centerTitle: true,
        automaticallyImplyLeading: false, // Force them to complete it
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                "Welcome back!", 
                style: AppTypography.headlineMedium
              ),
              const SizedBox(height: 8),
              Text(
                "We need a few more details to set up your personal health dashboard.",
                style: AppTypography.bodyLarge.copyWith(color: AppColors.textSecondary),
              ),
              const SizedBox(height: 32),

              TextFormField(
                controller: _weightController,
                decoration: const InputDecoration(
                  labelText: 'Weight (kg)',
                  prefixIcon: Icon(Icons.monitor_weight_outlined),
                ),
                keyboardType: TextInputType.number,
                validator: (val) => val!.isEmpty ? 'Required' : null,
              ),
              const SizedBox(height: 24),

              DropdownButtonFormField<String>(
                value: _selectedStatus,
                isExpanded: true,
                decoration: const InputDecoration(
                  labelText: 'Current Status',
                  prefixIcon: Icon(Icons.local_hospital_outlined),
                ),
                items: ['Admitted', 'Critical', 'Discharged', 'Observation']
                    .map((s) => DropdownMenuItem(value: s, child: Text(s)))
                    .toList(),
                onChanged: (val) => setState(() => _selectedStatus = val!),
              ),
              const SizedBox(height: 24),

              TextFormField(
                controller: _symptomsController,
                decoration: const InputDecoration(
                  labelText: 'Current Symptoms',
                  prefixIcon: Icon(Icons.sick_outlined),
                ),
                maxLines: 2,
                validator: (val) => val!.isEmpty ? 'Required' : null,
              ),

              const SizedBox(height: 48),

              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: _isLoading ? null : _handleSubmit,
                  style: ElevatedButton.styleFrom(
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    backgroundColor: AppColors.primary,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12))
                  ),
                  child: _isLoading 
                    ? const SizedBox(height: 24, width: 24, child: CircularProgressIndicator(color: Colors.white))
                    : const Text("Save & Continue", style: TextStyle(fontSize: 18, color: Colors.black)),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
