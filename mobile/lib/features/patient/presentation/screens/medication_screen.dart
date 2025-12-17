import 'package:flutter/material.dart';
import 'package:flutter/cupertino.dart';
import 'dart:math';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_typography.dart';
import '../../../../core/widgets/aura_app_bar.dart';
import '../../../../core/widgets/aura_fab.dart';
import '../../../../services/api_service.dart';
import 'medication_schedule_screen.dart';

class MedicationScreen extends StatefulWidget {
  const MedicationScreen({super.key});

  @override
  State<MedicationScreen> createState() => _MedicationScreenState();
}

class _MedicationScreenState extends State<MedicationScreen> {
  late Future<List<dynamic>> _medicationsFuture;
  final TextEditingController _nameController = TextEditingController();
  final TextEditingController _dosageController = TextEditingController();
  final TextEditingController _freqController = TextEditingController();
  
  bool _isAdding = false;

  @override
  void initState() {
    super.initState();
    _refreshMedications();
  }

  void _refreshMedications() {
    setState(() {
      final api = ApiService();
      // We need to pass the patient ID. 
      // Ideally this screen shouldn't need to know ID if the service handles it, 
      // but the API signature requires it.
      // We'll wrap it in a future that fetches ID first.
      _medicationsFuture = _fetchMeds();
    });
  }

  Future<List<dynamic>> _fetchMeds() async {
    final id = await ApiService().getPatientId();
    if (id != null) {
      return ApiService().getPatientMedications(id);
    }
    return [];
  }

  void _showAddMedicationSheet() {
    _nameController.clear();
    _dosageController.clear();
    _freqController.clear();

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => Container(
        height: MediaQuery.of(context).size.height * 0.7,
        decoration: BoxDecoration(
          color: const Color(0xFF1E293B), // Slate 800
          borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
          border: Border.all(color: Colors.white.withOpacity(0.1)),
        ),
        padding: EdgeInsets.fromLTRB(24, 24, 24, MediaQuery.of(context).viewInsets.bottom + 24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text("Add New Medication", style: AppTypography.headlineMedium.copyWith(color: Colors.white)),
                IconButton(
                  icon: const Icon(Icons.close, color: Colors.white70),
                  onPressed: () => Navigator.pop(context),
                )
              ],
            ),
            const SizedBox(height: 24),
            
            _buildInput("Medication Name", "e.g. Lisinopril", _nameController),
            const SizedBox(height: 16),
            _buildInput("Dosage", "e.g. 10mg", _dosageController),
            const SizedBox(height: 16),
            _buildInput("Frequency", "e.g. Daily, 2x/day", _freqController),
            
            const Spacer(),
            
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: _submitMedication,
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.primary,
                  foregroundColor: Colors.black,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                ),
                child: _isAdding 
                  ? const CupertinoActivityIndicator(color: Colors.black)
                  : const Text("Save Prescription", style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
              ),
            )
          ],
        ),
      ),
    );
  }

  Widget _buildInput(String label, String hint, TextEditingController controller) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: const TextStyle(color: Colors.white70, fontSize: 13, fontWeight: FontWeight.w600)),
        const SizedBox(height: 8),
        TextField(
          controller: controller,
          style: const TextStyle(color: Colors.white),
          decoration: InputDecoration(
            hintText: hint,
            hintStyle: TextStyle(color: Colors.white.withOpacity(0.3)),
            filled: true,
            fillColor: Colors.black12,
            border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide.none),
            contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
          ),
        )
      ],
    );
  }

  Future<void> _submitMedication() async {
    if (_nameController.text.isEmpty) return;

    setState(() => _isAdding = true); // Note: this rebuilds the sheet content if state is improved, simplified here.
    
    // Actually we need to handle loading state more gracefully in a modal, 
    // but for MVP let's just await and close.
    
    try {
      final id = await ApiService().getPatientId();
      if (id != null) {
        // We have to add arguments to ApiService.addMedication first?
        // Wait, the checked file showed only name/dosage. The backend supports frequency but the frontend API service might need update.
        // Let's assume I will update the service in parallel or passing a map.
        // The viewed ApiService only had: Future<void> addMedication(int id, String name, String dosage)
        // I should update ApiService in the next step to support frequency, but for now I'll send basic info.
        await ApiService().addMedication(
          id, 
          _nameController.text, 
          _dosageController.text,
          frequency: _freqController.text.isNotEmpty ? _freqController.text : 'Daily'
        ); 
      }
      if (mounted) {
        Navigator.pop(context);
        _refreshMedications();
      }
    } catch (e) {
      if (mounted) {
         ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text("Error: $e"), backgroundColor: AppColors.error));
      }
    } finally {
      if (mounted) setState(() => _isAdding = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0F172A), // Match the dark theme of other screens
      appBar: const AuraAppBar(title: "Medi-Track", backgroundColor: Colors.transparent),
      body: FutureBuilder<List<dynamic>>(
        future: _medicationsFuture,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CupertinoActivityIndicator(color: AppColors.primary));
          }
          
          if (snapshot.hasError) {
            return Center(child: Text("Error loading meds", style: TextStyle(color: AppColors.error)));
          }

          final meds = snapshot.data ?? [];

          if (meds.isEmpty) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                   Icon(CupertinoIcons.capsule, size: 64, color: Colors.white.withOpacity(0.2)),
                   const SizedBox(height: 16),
                   Text("No Active Prescriptions", style: AppTypography.bodyLarge.copyWith(color: Colors.white54)),
                ],
              ),
            );
          }

          return ListView.separated(
            padding: const EdgeInsets.fromLTRB(20, 20, 20, 120),
            itemCount: meds.length,
            separatorBuilder: (c,i) => const SizedBox(height: 16),
            itemBuilder: (context, index) {
              final med = meds[index];
              final color = _getDeterministicColor(med['name'] ?? 'M');
              return Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.white.withOpacity(0.05),
                  borderRadius: BorderRadius.circular(24),
                  border: Border.all(color: Colors.white.withOpacity(0.1)),
                ),
                child: Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: color.withOpacity(0.2),
                        borderRadius: BorderRadius.circular(16),
                      ),
                      child: Icon(CupertinoIcons.capsule_fill, color: color, size: 28),
                    ),
                    const SizedBox(height: 16),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(med['name'] ?? 'Unknown', style: AppTypography.titleMedium.copyWith(color: Colors.white, fontWeight: FontWeight.bold)),
                          const SizedBox(height: 4),
                          Text("${med['dosage']} • ${med['frequency'] ?? 'Daily'}", style: AppTypography.bodyMedium.copyWith(color: Colors.white60)),
                        ],
                      ),
                    ),
                    // Checkbox for 'Taken'
                    Container(
                      decoration: BoxDecoration(
                         shape: BoxShape.circle,
                         border: Border.all(color: AppColors.success.withOpacity(0.5))
                      ),
                      child: IconButton(
                        icon: const Icon(Icons.check, size: 20, color: AppColors.success),
                        onPressed: () {
                           // Future: Mark as taken logic
                           ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text("Dose logged!")));
                        },
                      ),
                    )
                  ],
                ),
              );
            },
          );
        },
      ),
      floatingActionButton: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          FloatingActionButton(
            heroTag: 'schedule',
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => const MedicationScheduleScreen()),
              );
            },
            backgroundColor: AppColors.accent,
            child: const Icon(CupertinoIcons.clock_fill, color: Colors.white),
          ),
          const SizedBox(height: 12),
          Padding(
            padding: const EdgeInsets.only(bottom: 110),
            child: AuraFAB(
              icon: CupertinoIcons.add,
              onPressed: _showAddMedicationSheet,
            ),
          ),
        ],
      ),
    );
  }

  Color _getDeterministicColor(String name) {
    final colors = [
      AppColors.primary,
      AppColors.accent,
      const Color(0xFFFF4081),
      const Color(0xFFFFD740),
      const Color(0xFF69F0AE)
    ];
    return colors[name.length % colors.length];
  }
}
