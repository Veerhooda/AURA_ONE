import 'package:flutter/material.dart';
import 'package:flutter/cupertino.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_typography.dart';
import '../../../../core/widgets/aura_app_bar.dart';
import '../../../../core/widgets/aura_fab.dart';

class MedicationScreen extends StatefulWidget {
  const MedicationScreen({super.key});

  @override
  State<MedicationScreen> createState() => _MedicationScreenState();
}

class _MedicationScreenState extends State<MedicationScreen> {
  // Stub data until we hook up ApiService
  final List<Map<String, dynamic>> _medications = [
    {
      "name": "Lisinopril",
      "dosage": "10mg",
      "frequency": "Daily",
      "nextDose": "8:00 AM",
      "icon": CupertinoIcons.capsule_fill,
      "color": AppColors.primary
    },
    {
      "name": "Metformin",
      "dosage": "500mg",
      "frequency": "Twice Daily",
      "nextDose": "12:00 PM",
      "icon": CupertinoIcons.circle_grid_hex_fill,
      "color": AppColors.accent
    }
  ];

  void _scanMedication() {
    // Simulate AI Scan
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      builder: (context) => Container(
        height: 300,
        decoration: BoxDecoration(
          color: AppColors.surface,
          borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
          border: Border.all(color: AppColors.surfaceHighlight),
        ),
        padding: const EdgeInsets.all(24),
        child: Column(
          children: [
            const Icon(CupertinoIcons.barcode_viewfinder, size: 48, color: AppColors.primary),
            const SizedBox(height: 16),
            Text("Scanning Label...", style: AppTypography.titleLarge),
            const SizedBox(height: 24),
            const LinearProgressIndicator(color: AppColors.primary, backgroundColor: AppColors.background),
            const SizedBox(height: 24),
            ElevatedButton(
              onPressed: () {
                Navigator.pop(context);
                _showInteractionWarning("Warfarin");
              },
              child: const Text("Simulate Detection: Warfarin"),
            )
          ],
        ),
      ),
    );
  }

  void _showInteractionWarning(String medName) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: AppColors.surface,
        title: Row(
          children: [
            const Icon(CupertinoIcons.exclamationmark_triangle_fill, color: AppColors.warning),
            const SizedBox(width: 8),
            Text("Interaction Alert", style: AppTypography.titleMedium.copyWith(color: AppColors.warning)),
          ],
        ),
        content: Text(
          "Warning: $medName may interact with your existing prescription of Aspirin.\n\nRisk: Increased bleeding.",
          style: AppTypography.bodyMedium,
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: Text("Cancel", style: TextStyle(color: AppColors.textSecondary)),
          ),
          ElevatedButton(
            onPressed: () {
              setState(() {
                _medications.add({
                  "name": medName,
                  "dosage": "5mg",
                  "frequency": "Daily",
                  "nextDose": "6:00 PM",
                  "icon": CupertinoIcons.bandage_fill,
                  "color": AppColors.error
                });
              });
              Navigator.pop(context);
            },
            style: ElevatedButton.styleFrom(backgroundColor: AppColors.warning),
            child: const Text("Add Anyway", style: TextStyle(color: Colors.black)),
          )
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: const AuraAppBar(title: "Medi-Space"),
      body: ListView.separated(
        padding: const EdgeInsets.fromLTRB(20, 20, 20, 100), // Added bottom padding for nav bar
        itemCount: _medications.length,
        separatorBuilder: (c,i) => const SizedBox(height: 16),
        itemBuilder: (context, index) {
          final med = _medications[index];
          return Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: AppColors.surface, // Upgraded from background
              borderRadius: BorderRadius.circular(24), // More rounded
              border: Border.all(color: AppColors.surfaceHighlight.withOpacity(0.5)),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.3),
                  blurRadius: 15,
                  offset: const Offset(0, 5),
                )
              ]
            ),
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: (med['color'] as Color).withOpacity(0.15),
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: (med['color'] as Color).withOpacity(0.3))
                  ),
                  child: Icon(med['icon'], color: (med['color'] as Color), size: 28),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(med['name'], style: AppTypography.titleMedium.copyWith(letterSpacing: 0.5)),
                      const SizedBox(height: 4),
                      Text("${med['dosage']} • ${med['frequency']}", style: AppTypography.bodyMedium.copyWith(color: AppColors.textSecondary)),
                    ],
                  ),
                ),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: [
                    Text("Next Dose", style: AppTypography.labelSmall.copyWith(color: AppColors.textSecondary)),
                    const SizedBox(height: 4),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                      decoration: BoxDecoration(
                        color: AppColors.success.withOpacity(0.1),
                        borderRadius: BorderRadius.circular(8)
                      ),
                      child: Text(
                        med['nextDose'], 
                        style: AppTypography.titleSmall.copyWith(color: AppColors.success)
                      ),
                    ),
                  ],
                )
              ],
            ),
          );
        },
      ),
      floatingActionButton: Padding(
        padding: const EdgeInsets.only(bottom: 100),
        child: AuraFAB(
          heroTag: "medication_add_fab",
          onPressed: _scanMedication,
          icon: CupertinoIcons.add,
          label: "Add Med",
        ),
      ),
    );
  }
}
