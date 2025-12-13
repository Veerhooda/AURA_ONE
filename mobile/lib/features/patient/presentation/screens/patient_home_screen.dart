import 'package:flutter/material.dart';
import 'package:flutter/cupertino.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_typography.dart';
import '../../../../core/widgets/aura_app_bar.dart';
import '../../../../core/widgets/aura_fab.dart';
import '../../../../core/widgets/aura_navigation_bar.dart';
import '../../../../core/widgets/aura_assistant_button.dart';
import '../../../../services/api_service.dart';
import '../../../../features/navigation/presentation/screens/navigation_map_screen.dart';
import '../screens/update_profile_screen.dart';
import '../screens/medication_screen.dart';
import '../screens/patient_history_screen.dart';
import '../screens/profile_screen.dart';



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

  Future<Map<String, dynamic>> _fetchPatientData() async {
    final id = await ApiService().getPatientId();
    if (id != null) {
      return await ApiService().getPatientTwin(id);
    }
    return {};
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      extendBody: true,
      // Only show top App Bar for Dashboard and Profile, hide for Map/Meds if they have their own
      appBar: _currentIndex == 0 
          ? AuraAppBar(
              title: _greeting,
              actions: [
                Padding(
                  padding: const EdgeInsets.only(right: 16.0),
                  child: Icon(CupertinoIcons.bell_fill, color: AppColors.textPrimary),
                ),
              ],
            ) 
          : null,
      body: Stack(
        children: [
          // CONTENT LAYER
          IndexedStack(
            index: _currentIndex,
            children: [
              _buildDashboard(),     // 0: Home
              const MedicationScreen(), // 1: Vitals/Meds (Reusing Meds screen for tab)
              const NavigationMapScreen(), // 2: Map
              const ProfileScreen(), // 3: Profile (New read-first screen)
            ],
          ),
          
          // BOTTOM NAVIGATION
          Align(
            alignment: Alignment.bottomCenter,
            child: AuraNavigationBar(
              currentIndex: _currentIndex,
              onTap: (index) {
                setState(() => _currentIndex = index);
              },
            ),
          ),
        ],
      ),
      floatingActionButton: Container(
        height: 75, 
        width: 75,
        margin: const EdgeInsets.only(top: 35), // Adjusted for new notch depth
        child: AuraAssistantButton(
          onPressed: () => context.push('/chat'),
        ),
      ),
      floatingActionButtonLocation: FloatingActionButtonLocation.centerDocked,
    );
  }

  // --- DASHBOARD WIDGET ---
  Widget _buildDashboard() {
    return FutureBuilder<Map<String, dynamic>>(
      future: _fetchPatientData(), 
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
           return const Center(child: CircularProgressIndicator());
        }
        
        final data = snapshot.data ?? {};
        final status = data['status'] ?? "Unknown"; 
        final room = data['metadata'] != null 
            ? "Room ${data['metadata']['bed']} - ${data['metadata']['ward']}" 
            : "Room --";
        final medsTaken = 2; // Mock
        final medsTotal = 4;

        return RefreshIndicator(
          onRefresh: () async {
            setState(() {});
          },
          child: SingleChildScrollView(
            physics: const AlwaysScrollableScrollPhysics(),
            padding: const EdgeInsets.fromLTRB(20, 20, 20, 120), // Adjusted top padding since safe area handles it differently
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                if (_mrn.isNotEmpty) ...[
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                    decoration: BoxDecoration(
                      color: AppColors.primary.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(color: AppColors.primary.withOpacity(0.2)),
                    ),
                    child: Text(
                      "ID: $_mrn", 
                      style: AppTypography.bodyMedium.copyWith(color: AppColors.primary, fontWeight: FontWeight.w600),
                    ),
                  ),
                  const SizedBox(height: 20),
                ],

                // --- 1. HOSPITAL STATUS CARD ---
                Container(
                  padding: const EdgeInsets.all(24),
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      colors: [AppColors.primary, AppColors.primaryDark], // Cleaner gradient
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                    ),
                    borderRadius: BorderRadius.circular(24),
                    boxShadow: [
                       BoxShadow(color: AppColors.primary.withOpacity(0.4), blurRadius: 20, offset: const Offset(0, 10)),
                    ]
                  ),
                  child: Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: Colors.white.withOpacity(0.2),
                          shape: BoxShape.circle,
                          border: Border.all(color: Colors.white.withOpacity(0.3), width: 1),
                        ),
                        child: const Icon(CupertinoIcons.bed_double_fill, color: Colors.white, size: 30),
                      ),
                      const SizedBox(width: 20),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              "Current Status", 
                              style: AppTypography.bodyMedium.copyWith(color: Colors.white70),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              status, 
                              style: AppTypography.headlineLarge.copyWith(color: Colors.white, fontSize: 26),
                            ),
                            const SizedBox(height: 4),
                            Row(
                              children: [
                                const Icon(CupertinoIcons.location_solid, color: Colors.white70, size: 14),
                                const SizedBox(width: 4),
                                Flexible(
                                  child: Text(
                                    room, 
                                    style: AppTypography.titleMedium.copyWith(color: Colors.white.withOpacity(0.9)),
                                    overflow: TextOverflow.ellipsis,
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 24),

                // --- 2. MEDICATION PROGRESS ---
                _buildSectionHeader("Medication Tracker", "See all", () => setState(() => _currentIndex = 1)),
                const SizedBox(height: 16),
                Container(
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    color: AppColors.surface,
                    borderRadius: BorderRadius.circular(24),
                    border: Border.all(color: AppColors.surfaceHighlight),
                    boxShadow: [
                      BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 15, offset: const Offset(0, 5)),
                    ],
                  ),
                  child: Column(
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text("Daily Progress", style: AppTypography.bodyMedium),
                              const SizedBox(height: 4),
                              Text("$medsTaken of $medsTotal", style: AppTypography.titleLarge.copyWith(color: AppColors.textPrimary)),
                            ],
                          ),
                          Stack(
                            alignment: Alignment.center,
                            children: [
                               SizedBox(
                                 width: 50, height: 50,
                                 child: CircularProgressIndicator(
                                   value: medsTaken / medsTotal,
                                   backgroundColor: AppColors.surfaceHighlight,
                                   valueColor: const AlwaysStoppedAnimation(AppColors.primary),
                                   strokeWidth: 5,
                                 ),
                               ),
                               Text("${(medsTaken/medsTotal*100).toInt()}%", style: AppTypography.labelSmall.copyWith(fontWeight: FontWeight.bold)),
                            ],
                          )
                        ],
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 30),

                // --- 3. VITALS (Redesigned) ---
                _buildSectionHeader("Latest Vitals", null, null),
                const SizedBox(height: 16),
                Row(
                  children: [
                    Expanded(child: _buildStaticVitalCard("Heart Rate", "${data['current_state']?['heart_rate'] ?? '--'}", "bpm", CupertinoIcons.heart_fill, AppColors.error)),
                    const SizedBox(width: 16),
                    Expanded(child: _buildStaticVitalCard("Oxygen Level", "${(data['current_state']?['spo2'] as num?)?.toInt() ?? '--'}", "%", CupertinoIcons.drop_fill, AppColors.info)),
                  ],
                ),
                
                const SizedBox(height: 30),

                // --- 4. QUICK ACTIONS ---
                Text("Quick Actions", style: AppTypography.titleLarge.copyWith(fontWeight: FontWeight.bold)),
                const SizedBox(height: 16),
                GridView.count(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  crossAxisCount: 2,
                  mainAxisSpacing: 16,
                  crossAxisSpacing: 16,
                  childAspectRatio: 1.4,
                  children: [
                    _buildActionCard("Report Pain", CupertinoIcons.exclamationmark_bubble_fill, AppColors.error, () => context.push('/patient/pain')),
                    _buildActionCard("Find Way", CupertinoIcons.map_fill, AppColors.accent, () => setState(() => _currentIndex = 2)),
                    _buildActionCard("My History", CupertinoIcons.time_solid, AppColors.primary, () => Navigator.push(context, MaterialPageRoute(builder: (_) => const PatientHistoryScreen()))),
                    _buildActionCard("Family", CupertinoIcons.person_2_fill, AppColors.success, () => context.push('/family/home')),
                  ],
                ),
              ],
            ),
          ),
        );
      }
    );
  }

  Widget _buildSectionHeader(String title, String? action, VoidCallback? onTap) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(title, style: AppTypography.titleLarge.copyWith(fontWeight: FontWeight.bold, fontSize: 18)),
        if (action != null)
          GestureDetector(
            onTap: onTap,
            child: Text(action, style: AppTypography.bodyMedium.copyWith(color: AppColors.primary)),
          )
      ],
    );
  }

  Widget _buildStaticVitalCard(String title, String value, String unit, IconData icon, Color color) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: AppColors.surfaceHighlight),
        boxShadow: [
          BoxShadow(color: color.withOpacity(0.05), blurRadius: 15, offset: const Offset(0, 5)),
        ]
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(color: color.withOpacity(0.1), shape: BoxShape.circle),
            child: Icon(icon, color: color, size: 20),
          ),
          const SizedBox(height: 16),
          Row(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Text(value, style: AppTypography.headlineMedium.copyWith(fontSize: 28, fontWeight: FontWeight.bold)),
              const SizedBox(width: 4),
              Padding(
                padding: const EdgeInsets.only(bottom: 4),
                child: Text(unit, style: AppTypography.bodySmall.copyWith(color: AppColors.textSecondary)),
              ),
            ],
          ),
          const SizedBox(height: 4),
          Text(title, style: AppTypography.bodySmall.copyWith(color: AppColors.textSecondary)),
        ],
      ),
    );
  }

  Widget _buildActionCard(String title, IconData icon, Color color, VoidCallback onTap) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        decoration: BoxDecoration(
          color: AppColors.surface,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: AppColors.surfaceHighlight),
           boxShadow: [
              BoxShadow(color: Colors.black.withOpacity(0.03), blurRadius: 10, offset: const Offset(0, 4)),
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
