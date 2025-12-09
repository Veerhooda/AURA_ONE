import 'package:flutter/material.dart';
import 'package:flutter/cupertino.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_typography.dart';
import '../../../../core/widgets/aura_app_bar.dart';
import '../../../../services/api_service.dart';

class DoctorDashboardScreen extends StatelessWidget {
  const DoctorDashboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: const AuraAppBar(title: "Doctor's Station"),
      body: FutureBuilder<List<dynamic>>(
        future: ApiService().getPatients(),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
             return const Center(child: CircularProgressIndicator());
          }
          if (snapshot.hasError) {
             return Center(child: Text("Error: ${snapshot.error}", style: AppTypography.bodyMedium.copyWith(color: AppColors.error)));
          }

          final patients = snapshot.data ?? [];
          
          if (patients.isEmpty) {
             return Center(child: Text("No patients found.", style: AppTypography.bodyLarge));
          }

          return ListView.separated(
            padding: const EdgeInsets.all(20),
            itemCount: patients.length,
            separatorBuilder: (c, i) => const SizedBox(height: 16),
            itemBuilder: (context, index) {
              final p = patients[index];
              // Map backend fields to UI, handling potential missing values
              final name = p['name'] ?? 'Unknown Patient';
              final ward = p['ward'] ?? 'General'; 
              
              // Backend might return latest vitals, let's assume risk_score exists or default to 0
              final risk = (p['risk_score'] ?? 0).toDouble(); 
              final isCritical = risk > 70;
              final status = isCritical ? 'Critical' : 'Stable';
              
              return Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: AppColors.surface,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(
                    color: isCritical ? AppColors.error : AppColors.surfaceHighlight,
                    width: isCritical ? 2 : 1
                  ),
                ),
                child: Row(
                  children: [
                     CircleAvatar(
                       backgroundColor: isCritical ? AppColors.error.withOpacity(0.2) : AppColors.primary.withOpacity(0.2),
                       child: Icon(
                         CupertinoIcons.person_fill, 
                         color: isCritical ? AppColors.error : AppColors.primary
                       ),
                     ),
                     const SizedBox(width: 16),
                     Expanded(
                       child: Column(
                         crossAxisAlignment: CrossAxisAlignment.start,
                         children: [
                           Text(name, style: AppTypography.titleMedium),
                           Text("Ward: $ward  •  Status: $status", style: AppTypography.bodyMedium),
                         ],
                       ),
                     ),
                     if (isCritical)
                       const Icon(CupertinoIcons.exclamationmark_triangle_fill, color: AppColors.error)
                     else
                       const Icon(CupertinoIcons.chevron_right, color: AppColors.textSecondary)
                  ],
                ),
              );
            },
          );
        }
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () => context.push('/ai/pain'),
        backgroundColor: AppColors.accent,
        icon: const Icon(CupertinoIcons.camera_viewfinder),
        label: const Text("Assess Pain"),
      ),
    );
  }
}
