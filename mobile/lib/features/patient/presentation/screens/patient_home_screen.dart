import 'package:flutter/material.dart';
import 'package:flutter/cupertino.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_typography.dart';
import '../../../../core/widgets/aura_app_bar.dart';
import '../../../../core/widgets/aura_fab.dart';
import '../../../../core/widgets/aura_navigation_bar.dart';
import '../../../../services/api_service.dart';

class PatientHomeScreen extends StatefulWidget {
  const PatientHomeScreen({super.key});

  @override
  State<PatientHomeScreen> createState() => _PatientHomeScreenState();
}

class _PatientHomeScreenState extends State<PatientHomeScreen> {
  int _currentIndex = 0;
  String _mrn = "";
  String _greeting = "My Health Hub";

  @override
  void initState() {
    super.initState();
    _loadUserData();
  }

  Future<void> _loadUserData() async {
    final name = await ApiService().getUserName();
    final mrn = await ApiService().getPatientMRN();
    if (mounted) {
       setState(() {
         if (name != null) _greeting = "Hi, $name";
         if (mrn != null) _mrn = mrn;
       });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      extendBody: true,
      appBar: AuraAppBar(
        title: _greeting,
        actions: [
          Padding(
            padding: EdgeInsets.only(right: 16.0),
            child: Icon(CupertinoIcons.bell_fill, color: AppColors.textPrimary),
          ),
        ],
      ),
      body: FutureBuilder<Map<String, dynamic>>(
        future: ApiService().getPatientTwin(1), // Hardcoded ID 1 for patient view
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
             return const Center(child: CircularProgressIndicator());
          }
          
          final data = snapshot.data ?? {};
          final status = "Admitted"; // Mock status for demo
          final room = "Room 302 - General Ward";
          final medsTaken = 2; // Mock
          final medsTotal = 4;

          return Stack(
            children: [
              RefreshIndicator(
                onRefresh: () async {
                  setState(() {}); // Triggers rebuild of FutureBuilder
                },
                child: SingleChildScrollView(
                  physics: const AlwaysScrollableScrollPhysics(),
                  padding: const EdgeInsets.fromLTRB(20, 100, 20, 120),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      if (_mrn.isNotEmpty) ...[
                        Text(
                          "Patient ID: $_mrn", 
                          style: AppTypography.bodyLarge.copyWith(color: AppColors.primary, fontWeight: FontWeight.bold)
                        ),
                        const SizedBox(height: 16),
                      ],
                      // --- 1. HOSPITAL STATUS CARD ---
                      Container(
                        padding: const EdgeInsets.all(24),
                        decoration: BoxDecoration(
                          gradient: LinearGradient(
                            colors: [AppColors.primary.withOpacity(0.8), AppColors.primaryDark],
                            begin: Alignment.topLeft,
                            end: Alignment.bottomRight,
                          ),
                          borderRadius: BorderRadius.circular(24),
                          boxShadow: [
                             BoxShadow(color: AppColors.primary.withOpacity(0.3), blurRadius: 15, offset: const Offset(0, 8)),
                          ]
                        ),
                        child: Row(
                          children: [
                            Container(
                              padding: const EdgeInsets.all(12),
                              decoration: BoxDecoration(
                                color: Colors.white.withOpacity(0.2),
                                shape: BoxShape.circle
                              ),
                              child: const Icon(CupertinoIcons.bed_double_fill, color: Colors.white, size: 32),
                            ),
                            const SizedBox(width: 16),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    "Current Status", 
                                    style: AppTypography.bodyMedium.copyWith(
                                      color: Colors.white70,
                                      fontSize: 13,
                                    ),
                                  ),
                                  const SizedBox(height: 4),
                                  Text(
                                    status, 
                                    style: AppTypography.headlineMedium.copyWith(
                                      color: Colors.white,
                                      fontWeight: FontWeight.bold,
                                      fontSize: 24,
                                    ),
                                  ),
                                  const SizedBox(height: 2),
                                  Text(
                                    room, 
                                    style: AppTypography.titleMedium.copyWith(
                                      color: Colors.white.withOpacity(0.9),
                                      fontSize: 14,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 24),

                      // --- 2. MEDICATION TRACKER ---
                      Text(
                        "Today's Medications", 
                        style: AppTypography.titleLarge.copyWith(
                          fontWeight: FontWeight.bold,
                          fontSize: 20,
                        ),
                      ),
                      const SizedBox(height: 12),
                      Container(
                        padding: const EdgeInsets.all(20),
                        decoration: BoxDecoration(
                          color: AppColors.surface,
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(color: Colors.white.withOpacity(0.05)),
                          boxShadow: [
                            BoxShadow(
                              color: Colors.black.withOpacity(0.2),
                              blurRadius: 10,
                              offset: const Offset(0, 4),
                            ),
                          ],
                        ),
                        child: Column(
                          children: [
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Text("$medsTaken of $medsTotal Taken", style: AppTypography.titleMedium),
                                Text("${(medsTaken/medsTotal*100).toInt()}%", style: AppTypography.titleMedium.copyWith(color: AppColors.primary)),
                              ],
                            ),
                            const SizedBox(height: 12),
                            ClipRRect(
                              borderRadius: BorderRadius.circular(10),
                              child: LinearProgressIndicator(
                                value: medsTaken / medsTotal,
                                backgroundColor: AppColors.surfaceHighlight,
                                valueColor: const AlwaysStoppedAnimation(AppColors.primary),
                                minHeight: 12,
                              ),
                            ),
                            const SizedBox(height: 16),
                            SizedBox(
                              width: double.infinity,
                              child: OutlinedButton(
                                onPressed: () => context.push('/medication'), 
                                style: OutlinedButton.styleFrom(
                                  side: const BorderSide(color: AppColors.primary),
                                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                                  padding: const EdgeInsets.symmetric(vertical: 12)
                                ),
                                child: Text("View Schedule", style: AppTypography.titleMedium.copyWith(color: AppColors.primary))
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 24),

                      // --- 3. STATIC VITALS (SNAPSHOT) ---
                      Text(
                        "Latest Vitals Snapshot", 
                        style: AppTypography.titleLarge.copyWith(
                          fontWeight: FontWeight.bold,
                          fontSize: 20,
                        ),
                      ),
                      const SizedBox(height: 12),
                      Row(
                        children: [
                          Expanded(child: _buildStaticVitalCard("Heart Rate", "${data['current_state']?['heart_rate'] ?? '--'} bpm", CupertinoIcons.heart_fill, AppColors.success)),
                          const SizedBox(width: 12),
                          Expanded(child: _buildStaticVitalCard("Oxygen", "${(data['current_state']?['spo2'] as num?)?.toInt() ?? '--'} %", CupertinoIcons.drop_fill, AppColors.info)),
                        ],
                      ),
                      
                      const SizedBox(height: 24),

                      // --- 4. ACTION GRID ---
                      Text("Quick Actions", style: AppTypography.titleLarge),
                      const SizedBox(height: 12),
                      GridView.count(
                        shrinkWrap: true,
                        physics: const NeverScrollableScrollPhysics(),
                        crossAxisCount: 2,
                        mainAxisSpacing: 12,
                        crossAxisSpacing: 12,
                        childAspectRatio: 1.5,
                        children: [
                          _buildActionCard(context, "Report Pain", CupertinoIcons.exclamationmark_bubble_fill, AppColors.error, () => context.push('/patient/pain')),
                          _buildActionCard(context, "Hospital Map", CupertinoIcons.map_fill, AppColors.accent, () => context.push('/navigation')),
                          _buildActionCard(context, "My History", CupertinoIcons.time, AppColors.textSecondary, () {}),
                          _buildActionCard(context, "Family Access", CupertinoIcons.person_2_fill, AppColors.info, () => context.push('/family/home')),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
              
              // Bottom Navigation
              Align(
                alignment: Alignment.bottomCenter,
                child: AuraNavigationBar(
                  currentIndex: _currentIndex,
                  onTap: (index) {
                    setState(() => _currentIndex = index);
                    if (index == 2) context.push('/navigation');
                  },
                ),
              ),
            ],
          );
        }
      ),
      floatingActionButton: AuraFAB(
        onPressed: () => context.push('/chat'),
        icon: CupertinoIcons.chat_bubble_2_fill,
      ),
      floatingActionButtonLocation: FloatingActionButtonLocation.centerDocked,
    );
  }

  Widget _buildStaticVitalCard(String title, String value, IconData icon, Color color) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.surfaceHighlight),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, color: color, size: 24),
          const SizedBox(height: 12),
          Text(value, style: AppTypography.headlineMedium.copyWith(fontSize: 24)),
          Text(title, style: AppTypography.bodyMedium),
        ],
      ),
    );
  }

  Widget _buildActionCard(BuildContext context, String title, IconData icon, Color color, VoidCallback onTap) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        decoration: BoxDecoration(
          color: AppColors.surface,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: Colors.white.withOpacity(0.05)),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.2),
              blurRadius: 10,
              offset: const Offset(0, 4),
            )
          ]
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: color.withOpacity(0.1),
                shape: BoxShape.circle,
              ),
              child: Icon(icon, color: color, size: 24),
            ),
            const SizedBox(height: 12),
            Text(
              title, 
              style: AppTypography.titleMedium.copyWith(fontSize: 14),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }
}
