import 'package:flutter/material.dart';
import 'package:flutter/cupertino.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_typography.dart';
import '../../../../core/widgets/aura_app_bar.dart';
import '../../../../services/api_service.dart';

class DoctorDashboardScreen extends StatefulWidget {
  const DoctorDashboardScreen({super.key});

  @override
  State<DoctorDashboardScreen> createState() => _DoctorDashboardScreenState();
}

class _DoctorDashboardScreenState extends State<DoctorDashboardScreen> {
  final TextEditingController _searchController = TextEditingController();

  void _navigateToPatient(String idStr) {
    if (idStr.isEmpty) return;
    final id = int.tryParse(idStr);
    if (id != null) {
      context.push('/doctor/monitor/$id');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: const AuraAppBar(title: "Doctor's Station"),
      body: Column(
        children: [
          // Search Header
          Padding(
            padding: const EdgeInsets.all(20),
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _searchController,
                    keyboardType: TextInputType.number,
                    decoration: const InputDecoration(
                      hintText: "Enter Patient ID (e.g. 1)",
                      prefixIcon: Icon(CupertinoIcons.search),
                    ),
                    onSubmitted: _navigateToPatient,
                  ),
                ),
                const SizedBox(width: 12),
                FloatingActionButton(
                  mini: true,
                  heroTag: "searchBtn",
                  onPressed: () => _navigateToPatient(_searchController.text),
                  backgroundColor: AppColors.primary,
                  child: const Icon(CupertinoIcons.arrow_right, color: Colors.black),
                ),
              ],
            ),
          ),
          
          Expanded(
            child: FutureBuilder<List<dynamic>>(
              future: ApiService().getPatients(),
              builder: (context, snapshot) {
                if (snapshot.connectionState == ConnectionState.waiting) {
                   return const Center(child: CircularProgressIndicator());
                }
                final patients = snapshot.data ?? [];
                
                if (patients.isEmpty) {
                   return Center(child: Text("No patients found.", style: AppTypography.bodyLarge));
                }
      
                return ListView.separated(
                  padding: const EdgeInsets.symmetric(horizontal: 20),
                  itemCount: patients.length,
                  separatorBuilder: (c, i) => const SizedBox(height: 16),
                  itemBuilder: (context, index) {
                    final p = patients[index];
                    final id = p['id'] ?? 0;
                    final name = p['user']?['name'] ?? 'Unknown Patient';
                    final ward = p['ward'] ?? 'General'; 
                    final risk = (p['risk_score'] ?? 0).toDouble(); 
                    final isCritical = risk > 70;
                    
                    return GestureDetector(
                      onTap: () => context.push('/doctor/monitor/$id'),
                      child: Container(
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
                                   Text("ID: #$id • $ward", style: AppTypography.bodyMedium),
                                 ],
                               ),
                             ),
                             const Icon(CupertinoIcons.chevron_right, color: AppColors.textSecondary)
                          ],
                        ),
                      ),
                    );
                  },
                );
              }
            ),
          ),
        ],
      ),
    );
  }
}
