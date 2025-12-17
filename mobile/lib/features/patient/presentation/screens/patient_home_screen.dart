import 'package:flutter/material.dart';
import 'package:flutter/cupertino.dart';
import 'package:go_router/go_router.dart';
import 'dart:ui' as ui;
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_typography.dart';
import '../../../../core/widgets/aura_app_bar.dart';
import '../../../../core/widgets/aura_fab.dart';
import '../../../../core/widgets/aura_navigation_bar.dart';
import '../../../../core/widgets/aura_assistant_button.dart';
import '../../../../services/api_service.dart';
import '../../../../services/socket_service.dart';
import '../../../../features/navigation/presentation/screens/navigation_map_screen.dart';
import '../screens/update_profile_screen.dart';
import '../screens/medication_screen.dart';
import '../screens/patient_history_screen.dart';
import '../screens/profile_screen.dart';
import '../widgets/vitals_card.dart';
import '../widgets/vitals_graphs.dart';
import '../../../chat/presentation/screens/chat_screen.dart';
import 'appointments_screen.dart';
import 'manual_vitals_screen.dart';
import '../widgets/recovery_graph_card.dart';

class PatientHomeScreen extends StatefulWidget {
  const PatientHomeScreen({super.key});

  @override
  State<PatientHomeScreen> createState() => _PatientHomeScreenState();
}

class _PatientHomeScreenState extends State<PatientHomeScreen> with TickerProviderStateMixin {
  int _currentIndex = 0;
  String _mrn = "";
  String _greeting = "My Health Hub";
  late AnimationController _bgController;
  late Animation<Color?> _bgAnimation;
  Future<Map<String, dynamic>>? _patientDataFuture;
  int? _patientId;

  @override
  void initState() {
    super.initState();
    _loadUserData();
    _refreshData();
    
    // Ambient Background Animation
    _bgController = AnimationController(vsync: this, duration: const Duration(seconds: 15))..repeat(reverse: true);
    _bgAnimation = ColorTween(begin: const Color(0xFF0F172A), end: const Color(0xFF1E293B)).animate(_bgController);
  }

  @override
  void dispose() {
    _bgController.dispose();
    super.dispose();
  }

  void _refreshData() {
    setState(() {
      _patientDataFuture = _fetchPatientData();
    });
  }

  Future<void> _loadUserData() async {
    final name = await ApiService().getUserName();
    final mrn = await ApiService().getPatientMRN();
    if (mounted) {
       setState(() {
         if (name != null) _greeting = "Hi, $name";
         if (mrn != null) _mrn = mrn;
       });
       
       final id = await ApiService().getPatientId();
       if (id != null) {
          _patientId = id;
          SocketService().subscribePatient(id);
       }
    }
  }

  Future<Map<String, dynamic>> _fetchPatientData() async {
    final id = await ApiService().getPatientId();
    if (id != null) {
      final twin = await ApiService().getPatientTwin(id);
      final meds = await ApiService().getPatientMedications(id);
      return {
        ...twin,
        'medications': meds,
      };
    }
    return {};
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _bgAnimation,
      builder: (context, child) {
        return Scaffold(
          backgroundColor: _bgAnimation.value,
          extendBody: true,
          body: Stack(
            children: [
              // Ambient Glows
              Positioned(top: -100, right: -100, child: _buildGlowOrb(AppColors.primary.withOpacity(0.15))),
              Positioned(bottom: -100, left: -100, child: _buildGlowOrb(AppColors.accent.withOpacity(0.1))),

              // Content Layer
              IndexedStack(
                index: _currentIndex,
                children: [
                  _buildDashboard(),     // 0: Home
                  const MedicationScreen(), // 1: Meds
                  const NavigationMapScreen(), // 2: Map
                  const ProfileScreen(), // 3: Profile
                ],
              ),
              
              // Bottom Navigation
              Align(
                alignment: Alignment.bottomCenter,
                child: AuraNavigationBar(
                  currentIndex: _currentIndex,
                  onTap: (index) => setState(() => _currentIndex = index),
                ),
              ),
            ],
          ),
          floatingActionButton: Container(
            height: 75, 
            width: 75,
            margin: const EdgeInsets.only(top: 35),
            child: AuraAssistantButton(onPressed: () => context.push('/chat')),
          ),
          floatingActionButtonLocation: FloatingActionButtonLocation.centerDocked,
        );
      },
    );
  }

  Widget _buildGlowOrb(Color color) {
    return Container(
      width: 300, height: 300,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        color: color,
        boxShadow: [BoxShadow(color: color, blurRadius: 100, spreadRadius: 50)],
      ),
    );
  }

  // --- DASHBOARD WIDGET ---
  Widget _buildDashboard() {
    return FutureBuilder<Map<String, dynamic>>(
      future: _patientDataFuture, 
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
           return const Center(child: CupertinoActivityIndicator(color: AppColors.primary));
        }
        
        final data = snapshot.data ?? {};
        final status = data['status'] ?? "Unknown"; 
        final isAdmitted = status  == "Admitted";
        final room = data['metadata'] != null 
            ? "Room ${data['metadata']['bed']} - ${data['metadata']['ward']}" 
            : "Room --";
        
        final meds = (data['medications'] as List?) ?? [];
        final medsTotal = meds.length;
        // Since backend doesn't track specific daily adherence yet, we show 0 or handle it
        final medsTaken = 0; 

        // Vitals Logic
        final hr = (data['current_state']?['heart_rate'] as num?)?.toInt() ?? 0;
        final spo2 = (data['current_state']?['spo2'] as num?)?.toInt() ?? 0;
        final bp = data['current_state']?['blood_pressure']?.toString() ?? "--/--";

        return RefreshIndicator(
          onRefresh: () async {
            _refreshData();
            await _patientDataFuture;
          },
          child: CustomScrollView(
            physics: const BouncingScrollPhysics(parent: AlwaysScrollableScrollPhysics()),
            slivers: [
              // Glass App Bar
              SliverAppBar(
                expandedHeight: 120,
                backgroundColor: Colors.transparent,
                floating: false,
                pinned: true,
                flexibleSpace: FlexibleSpaceBar(
                  titlePadding: const EdgeInsets.only(left: 20, bottom: 16),
                  title: Column(
                    mainAxisSize: MainAxisSize.min,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisAlignment: MainAxisAlignment.end,
                    children: [
                      Text(_greeting, style: AppTypography.headlineMedium.copyWith(color: Colors.white, fontWeight: FontWeight.bold)),
                      if (_mrn.isNotEmpty)
                        Text("ID: $_mrn", style: TextStyle(color: Colors.white54, fontSize: 10)),
                    ],
                  ),
                  background: Container(color: Colors.black.withOpacity(0.6)),
                ),
                actions: [
                  IconButton(
                    icon: const Icon(CupertinoIcons.bell_fill, color: Colors.white70),
                    onPressed: () {},
                  ),
                  const SizedBox(width: 10),
                ],
              ),

              // Content
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.fromLTRB(20, 20, 20, 120),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Status Card
                      _buildGlassStatusCard(status, room, isAdmitted),
                      const SizedBox(height: 24),

                      // Meds Progress
                      _buildSectionHeader("Medication Tracker", "See all", () => setState(() => _currentIndex = 1)),
                      const SizedBox(height: 16),
                      _buildGlassProgressCard(medsTaken, medsTotal),
                      const SizedBox(height: 30),

                      // Vitals
                      _buildSectionHeader("Latest Vitals", null, null),
                      const SizedBox(height: 16),
                      
                      StreamBuilder<Map<String, dynamic>>(
                        stream: SocketService().vitalsStream,
                        builder: (context, snap) {
                          final live = snap.data;
                          final currentHr = live != null ? (live['hr'] as num?)?.toInt() ?? hr : hr;
                          final currentSpo2 = live != null ? (live['spo2'] as num?)?.toInt() ?? spo2 : spo2;
                          final currentBp = live != null ? live['bp']?.toString() ?? bp : bp;
                          
                          return Column(
                            children: [
                              VitalsCard(
                                title: "Heart Rate", 
                                value: currentHr > 0 ? "$currentHr" : "--", 
                                unit: "bpm", 
                                icon: CupertinoIcons.heart_fill, 
                                color: AppColors.error,
                                graph: SizedBox(height: 100, child: HeartRateGraph(color: AppColors.error, isActive: currentHr > 0)),
                              ),
                              VitalsCard(
                                title: "Oxygen Level", 
                                value: currentSpo2 > 0 ? "$currentSpo2" : "--", 
                                unit: "%", 
                                icon: CupertinoIcons.drop_fill, 
                                color: AppColors.info,
                                graph: SizedBox(height: 100, child: OxygenGraph(color: AppColors.info, isActive: currentSpo2 > 0)),
                              ),
                              VitalsCard(
                                title: "Blood Pressure",
                                value: currentBp != "--/--" ? currentBp : "--/--",
                                unit: "mmHg",
                                icon: CupertinoIcons.waveform_path_ecg,
                                color: Colors.orange,
                                graph: SizedBox(height: 100, child: BloodPressureGraph(color: Colors.orange, isActive: currentBp != "--/--" && currentBp != "120/80")), 
                              ),
                            ],
                          );
                        }
                      ),

                      const SizedBox(height: 30),

                      // AI Recovery
                      if (_patientId != null) ...[
                        _buildSectionHeader("AI Recovery Analysis", null, null),
                        const SizedBox(height: 16),
                        RecoveryGraphCard(patientId: _patientId!),
                        const SizedBox(height: 30),
                      ],

                      // Quick Actions
                      Text("Quick Actions", style: AppTypography.titleLarge.copyWith(fontWeight: FontWeight.bold, color: Colors.white)),
                      const SizedBox(height: 16),
                      GridView.count(
                        shrinkWrap: true,
                        physics: const NeverScrollableScrollPhysics(),
                        crossAxisCount: 2,
                        mainAxisSpacing: 16,
                        crossAxisSpacing: 16,
                        childAspectRatio: 1.4,
                        children: [
                          _buildActionCard("Appointments", CupertinoIcons.calendar, AppColors.accent, () {
                            Navigator.push(
                              context,
                              MaterialPageRoute(builder: (_) => const AppointmentsScreen()),
                            );
                          }),
                          _buildActionCard("Contact Doctor", CupertinoIcons.chat_bubble_2_fill, AppColors.primary, () {
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (_) => const ChatScreen(
                                  recipientId: 1, // Mock doctor ID - in production, fetch from patient data
                                  recipientName: "Dr. Smith",
                                ),
                              ),
                            );
                          }),
                          _buildActionCard("Report Pain", CupertinoIcons.exclamationmark_bubble_fill, AppColors.error, () => context.push('/patient/pain')),
                          _buildActionCard("Log Vitals", CupertinoIcons.heart_circle_fill, AppColors.success, () {
                            Navigator.push(
                              context,
                              MaterialPageRoute(builder: (_) => const ManualVitalsScreen()),
                            );
                          }),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        );
      }
    );
  }

  Widget _buildGlassStatusCard(String status, String room, bool isAdmitted) {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: AppColors.primary.withOpacity(0.15),
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: AppColors.primary.withOpacity(0.3)),
        boxShadow: [BoxShadow(color: AppColors.primary.withOpacity(0.1), blurRadius: 20, offset: const Offset(0, 10))],
      ),
          child: Row(
            children: [
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: Colors.white.withOpacity(0.1),
                  shape: BoxShape.circle,
                  border: Border.all(color: Colors.white.withOpacity(0.2)),
                ),
                child: Icon(isAdmitted ? CupertinoIcons.bed_double_fill : CupertinoIcons.house_fill, color: Colors.white, size: 30),
              ),
              const SizedBox(width: 20),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text("Current Status", style: AppTypography.bodyMedium.copyWith(color: Colors.white70)),
                    const SizedBox(height: 4),
                    Text(status, style: AppTypography.headlineLarge.copyWith(color: Colors.white, fontSize: 26)),
                    const SizedBox(height: 4),
                    Row(
                      children: [
                        const Icon(CupertinoIcons.location_solid, color: Colors.white70, size: 14),
                        const SizedBox(width: 4),
                        Flexible(
                          child: Text(room, style: AppTypography.titleMedium.copyWith(color: Colors.white.withOpacity(0.9)), overflow: TextOverflow.ellipsis),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ],
          ),
        );
  }

  Widget _buildGlassProgressCard(int taken, int total) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.black.withOpacity(0.3),
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: Colors.white.withOpacity(0.1)),
      ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text("Daily Progress", style: TextStyle(color: Colors.white70)),
                  const SizedBox(height: 4),
                  Text("$taken of $total", style: AppTypography.titleLarge.copyWith(color: Colors.white)),
                ],
              ),
              Stack(
                alignment: Alignment.center,
                children: [
                   SizedBox(
                     width: 50, height: 50,
                     child: CircularProgressIndicator(
                       value: total > 0 ? taken / total : 0,
                       backgroundColor: Colors.white10,
                       valueColor: const AlwaysStoppedAnimation(AppColors.primary),
                       strokeWidth: 5,
                     ),
                   ),
                   Text("${total > 0 ? (taken/total*100).toInt() : 0}%", style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 10)),
                ],
              )
            ],
          ),
        );
  }

  Widget _buildActionCard(String title, IconData icon, Color color, VoidCallback onTap) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        decoration: BoxDecoration(
          color: Colors.black.withOpacity(0.3),
          borderRadius: BorderRadius.circular(24),
          border: Border.all(color: Colors.white.withOpacity(0.1)),
        ),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(color: color.withOpacity(0.2), shape: BoxShape.circle),
                  child: Icon(icon, color: color, size: 24),
                ),
                const SizedBox(height: 12),
                Text(title, style: AppTypography.titleMedium.copyWith(fontSize: 14, color: Colors.white70), textAlign: TextAlign.center),
              ],
            ),
          ),
      );
  }

  Widget _buildSectionHeader(String title, String? action, VoidCallback? onTap) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(title, style: AppTypography.titleLarge.copyWith(fontWeight: FontWeight.bold, fontSize: 18, color: Colors.white)),
        if (action != null)
          GestureDetector(
            onTap: onTap,
            child: Text(action, style: AppTypography.bodyMedium.copyWith(color: AppColors.primary)),
          )
      ],
    );
  }
}
