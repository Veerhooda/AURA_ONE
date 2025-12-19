import 'package:flutter/material.dart';
import 'package:flutter/cupertino.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_typography.dart';
import '../../../../services/api_service.dart';

class CreatePatientDialog extends StatefulWidget {
  final VoidCallback onSuccess;

  const CreatePatientDialog({super.key, required this.onSuccess});

  @override
  State<CreatePatientDialog> createState() => _CreatePatientDialogState();
}

class _CreatePatientDialogState extends State<CreatePatientDialog> with SingleTickerProviderStateMixin {
  late TabController _tabController;
  final _formKey = GlobalKey<FormState>();
  bool _isLoading = false;

  // Form controllers
  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _dobController = TextEditingController();
  final _weightController = TextEditingController();
  final _relationshipController = TextEditingController();
  final _patientIdController = TextEditingController();
  
  String _selectedGender = 'Male';

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    _nameController.dispose();
    _emailController.dispose();
    _passwordController.dispose();
    _dobController.dispose();
    _weightController.dispose();
    _relationshipController.dispose();
    _patientIdController.dispose();
    super.dispose();
  }

  // Generate MRN automatically
  String _generateMRN() {
    final timestamp = DateTime.now().millisecondsSinceEpoch;
    return 'MRN-${timestamp.toString().substring(5)}';
  }

  Future<void> _createNewPatient() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _isLoading = true);

    try {
      await ApiService().createFamilyPatient(
        name: _nameController.text,
        email: _emailController.text,
        password: _passwordController.text,
        mrn: _generateMRN(), // Auto-generate MRN
        dob: _dobController.text,
        gender: _selectedGender,
        weight: _weightController.text.isEmpty ? null : _weightController.text,
        relationship: _relationshipController.text,
      );

      if (mounted) {
        Navigator.pop(context);
        widget.onSuccess();
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: const Row(
              children: [
                Icon(CupertinoIcons.checkmark_circle, color: Colors.white, size: 20),
                SizedBox(width: 12),
                Text('Patient account created successfully!'),
              ],
            ),
            backgroundColor: AppColors.success,
            behavior: SnackBarBehavior.floating,
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
          ),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Error: ${e.toString().split(':').last}'),
            backgroundColor: AppColors.error,
            behavior: SnackBarBehavior.floating,
          ),
        );
      }
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  Future<void> _addExistingPatient() async {
    if (_patientIdController.text.isEmpty || _relationshipController.text.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please fill all fields'), backgroundColor: AppColors.error),
      );
      return;
    }

    setState(() => _isLoading = true);

    try {
      await ApiService().addExistingPatient(
        patientId: int.parse(_patientIdController.text),
        relationship: _relationshipController.text,
      );

      if (mounted) {
        Navigator.pop(context);
        widget.onSuccess();
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Patient added to family!'), backgroundColor: AppColors.success),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error: $e'), backgroundColor: AppColors.error),
        );
      }
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      height: MediaQuery.of(context).size.height * 0.9,
      decoration: const BoxDecoration(
        color: AppColors.background,
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      child: SafeArea(
        top: true,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            // Handle bar
            Container(
              margin: const EdgeInsets.only(top: 12, bottom: 8),
              width: 40,
              height: 4,
              decoration: BoxDecoration(
                color: AppColors.textSecondary.withOpacity(0.3),
                borderRadius: BorderRadius.circular(2),
              ),
            ),

            // Header with close button
            Padding(
              padding: const EdgeInsets.fromLTRB(20, 8, 12, 16),
              child: Row(
                children: [
                  Expanded(
                    child: Text('Add Family Member', style: AppTypography.titleLarge),
                  ),
                  IconButton(
                    onPressed: () => Navigator.pop(context),
                    icon: Container(
                      padding: const EdgeInsets.all(6),
                      decoration: BoxDecoration(
                        color: AppColors.surface,
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: const Icon(CupertinoIcons.xmark, size: 18, color: AppColors.textSecondary),
                    ),
                  ),
                ],
              ),
            ),

            // Tabs - Fixed indicator
            Container(
              height: 48,
              margin: const EdgeInsets.symmetric(horizontal: 20),
              padding: const EdgeInsets.all(4),
              decoration: BoxDecoration(
                color: AppColors.surface,
                borderRadius: BorderRadius.circular(12),
              ),
              child: TabBar(
                controller: _tabController,
                indicatorSize: TabBarIndicatorSize.tab,
                dividerColor: Colors.transparent,
                indicator: BoxDecoration(
                  gradient: const LinearGradient(colors: [AppColors.primary, AppColors.primaryLight]),
                  borderRadius: BorderRadius.circular(10),
                ),
                labelColor: Colors.white,
                labelStyle: const TextStyle(fontWeight: FontWeight.w600, fontSize: 14),
                unselectedLabelColor: AppColors.textSecondary,
                unselectedLabelStyle: const TextStyle(fontWeight: FontWeight.w500, fontSize: 14),
                tabs: const [
                  Tab(text: 'Create New'),
                  Tab(text: 'Add Existing'),
                ],
              ),
            ),

            const SizedBox(height: 16),

            // Tab Content
            Expanded(
              child: TabBarView(
                controller: _tabController,
                children: [
                  _buildCreateForm(),
                  _buildAddExistingForm(),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildCreateForm() {
    return SingleChildScrollView(
      padding: const EdgeInsets.fromLTRB(20, 0, 20, 20),
      child: Form(
        key: _formKey,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Info banner
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: AppColors.info.withOpacity(0.1),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: AppColors.info.withOpacity(0.3)),
              ),
              child: Row(
                children: [
                  const Icon(CupertinoIcons.info_circle, size: 20, color: AppColors.info),
                  const SizedBox(width: 10),
                  Expanded(
                    child: Text(
                      'A Medical Record Number (MRN) will be automatically assigned.',
                      style: AppTypography.bodySmall.copyWith(color: AppColors.info),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),
            
            _buildTextField(_nameController, 'Full Name', CupertinoIcons.person),
            const SizedBox(height: 14),
            _buildTextField(_emailController, 'Email', CupertinoIcons.mail, keyboardType: TextInputType.emailAddress),
            const SizedBox(height: 14),
            _buildTextField(_passwordController, 'Password', CupertinoIcons.lock, obscureText: true),
            const SizedBox(height: 14),
            
            // Date of Birth with date picker
            GestureDetector(
              onTap: () async {
                final date = await showDatePicker(
                  context: context,
                  initialDate: DateTime(1990),
                  firstDate: DateTime(1900),
                  lastDate: DateTime.now(),
                  builder: (context, child) {
                    return Theme(
                      data: ThemeData.dark().copyWith(
                        colorScheme: const ColorScheme.dark(
                          primary: AppColors.primary,
                          surface: AppColors.surface,
                        ),
                      ),
                      child: child!,
                    );
                  },
                );
                if (date != null) {
                  _dobController.text = '${date.year}-${date.month.toString().padLeft(2, '0')}-${date.day.toString().padLeft(2, '0')}';
                  setState(() {});
                }
              },
              child: AbsorbPointer(
                child: _buildTextField(_dobController, 'Date of Birth', CupertinoIcons.calendar),
              ),
            ),
            const SizedBox(height: 14),
            
            // Gender Selector
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
              decoration: BoxDecoration(
                color: AppColors.surface,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: AppColors.surfaceHighlight),
              ),
              child: Row(
                children: [
                  const Icon(CupertinoIcons.person_2, size: 20, color: AppColors.primary),
                  const SizedBox(width: 12),
                  Expanded(
                    child: DropdownButtonHideUnderline(
                      child: DropdownButton<String>(
                        value: _selectedGender,
                        isExpanded: true,
                        dropdownColor: AppColors.surface,
                        icon: const Icon(CupertinoIcons.chevron_down, size: 16, color: AppColors.textSecondary),
                        style: AppTypography.bodyMedium.copyWith(color: AppColors.textPrimary),
                        items: ['Male', 'Female', 'Other'].map((gender) {
                          return DropdownMenuItem(value: gender, child: Text(gender));
                        }).toList(),
                        onChanged: (value) => setState(() => _selectedGender = value!),
                      ),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 14),
            _buildTextField(_weightController, 'Weight (optional)', CupertinoIcons.gauge),
            const SizedBox(height: 14),
            _buildTextField(_relationshipController, 'Your Relationship (e.g., Father)', CupertinoIcons.heart),
            const SizedBox(height: 28),

            // Submit Button
            Container(
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [AppColors.primary, AppColors.accent],
                ),
                borderRadius: BorderRadius.circular(14),
                boxShadow: [
                  BoxShadow(
                    color: AppColors.primary.withOpacity(0.3),
                    blurRadius: 12,
                    offset: const Offset(0, 4),
                  ),
                ],
              ),
              child: ElevatedButton(
                onPressed: _isLoading ? null : _createNewPatient,
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.transparent,
                  shadowColor: Colors.transparent,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                ),
                child: _isLoading
                    ? const SizedBox(height: 20, width: 20, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white))
                    : const Text('Create Patient Account', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
              ),
            ),
            const SizedBox(height: 20),
          ],
        ),
      ),
    );
  }

  Widget _buildAddExistingForm() {
    return SingleChildScrollView(
      padding: const EdgeInsets.fromLTRB(20, 0, 20, 20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // Info
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: AppColors.accent.withOpacity(0.1),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: AppColors.accent.withOpacity(0.3)),
            ),
            child: Row(
              children: [
                const Icon(CupertinoIcons.info_circle, size: 20, color: AppColors.accent),
                const SizedBox(width: 10),
                Expanded(
                  child: Text(
                    'Ask the patient for their ID to link their account.',
                    style: AppTypography.bodySmall.copyWith(color: AppColors.accent),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),
          
          _buildTextField(_patientIdController, 'Patient ID', CupertinoIcons.number, keyboardType: TextInputType.number),
          const SizedBox(height: 14),
          _buildTextField(_relationshipController, 'Your Relationship', CupertinoIcons.heart),
          const SizedBox(height: 28),

          ElevatedButton(
            onPressed: _isLoading ? null : _addExistingPatient,
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.accent,
              padding: const EdgeInsets.symmetric(vertical: 16),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
            ),
            child: _isLoading
                ? const SizedBox(height: 20, width: 20, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white))
                : const Text('Add to Family', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
          ),
        ],
      ),
    );
  }

  Widget _buildTextField(TextEditingController controller, String label, IconData icon, {bool obscureText = false, TextInputType? keyboardType}) {
    return TextFormField(
      controller: controller,
      obscureText: obscureText,
      keyboardType: keyboardType,
      style: AppTypography.bodyMedium.copyWith(color: AppColors.textPrimary),
      decoration: InputDecoration(
        labelText: label,
        labelStyle: AppTypography.bodyMedium.copyWith(color: AppColors.textSecondary),
        floatingLabelStyle: AppTypography.labelSmall.copyWith(color: AppColors.primary),
        prefixIcon: Icon(icon, color: AppColors.primary, size: 20),
        filled: true,
        fillColor: AppColors.surface,
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide(color: AppColors.surfaceHighlight),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide(color: AppColors.surfaceHighlight),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: AppColors.primary, width: 1.5),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: AppColors.error),
        ),
      ),
      validator: obscureText || label.contains('optional') ? null : (value) {
        if (value == null || value.isEmpty) {
          return 'This field is required';
        }
        return null;
      },
    );
  }
}
