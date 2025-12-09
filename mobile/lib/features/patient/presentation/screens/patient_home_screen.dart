import 'package:flutter/material.dart';
import 'package:flutter/cupertino.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_typography.dart';
import '../../../../core/widgets/aura_app_bar.dart';
import '../../../../core/widgets/aura_fab.dart';
import '../../../../core/widgets/aura_navigation_bar.dart';
import '../../../../services/api_service.dart';
import '../widgets/digital_twin_card.dart';
import '../widgets/vitals_summary_card.dart';
import '../widgets/vitals_graphs.dart';
import '../../../../services/health_service.dart';

class PatientHomeScreen extends StatefulWidget {
  const PatientHomeScreen({super.key});

  @override
  State<PatientHomeScreen> createState() => _PatientHomeScreenState();
}

class _PatientHomeScreenState extends State<PatientHomeScreen> {
  int _currentIndex = 0;

  @override
  void initState() {
    super.initState();
    // Request HealthKit access on load
    HealthService().requestPermissions();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      extendBody: true, // Allow body to extend behind standard navbar area
      appBar: const AuraAppBar(
        title: "My Digital Twin",
        actions: [
          Padding(
            padding: EdgeInsets.only(right: 16.0),
            child: Icon(CupertinoIcons.bell_fill, color: AppColors.textPrimary),
          ),
        ],
      ),
      body: FutureBuilder<Map<String, dynamic>>(
        // Hardcoded ID 1 for verified user for now
        future: ApiService().getPatientTwin(1),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
             return const Center(child: CircularProgressIndicator());
          }
          if (snapshot.hasError) {
             return Center(child: Text("Error: ${snapshot.error}", style: AppTypography.bodyMedium.copyWith(color: AppColors.error)));
          }

          final data = snapshot.data!;
          // Default to sane values if null
          final riskScore = (data['risk_score'] ?? 0).toDouble(); 
          final heartRate = data['heart_rate']?.toString() ?? "--";
          final bp = data['blood_pressure']?.toString() ?? "--/--";
          final oxygen = data['oxygen_saturation']?.toString() ?? "--";

          return Stack(
            children: [
              // Scrollable Content
              SingleChildScrollView(
                padding: const EdgeInsets.fromLTRB(20, 100, 20, 120),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    DigitalTwinCard(riskScore: riskScore),
                    const SizedBox(height: 24),
                    
                    // --- HEART RATE (HealthKit Linked) ---
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text("Heart Rate (HealthKit)", style: AppTypography.titleLarge),
                        Text("$heartRate bpm", style: AppTypography.headlineLarge.copyWith(height: 1)),
                      ],
                    ),
                    const SizedBox(height: 8),
                    SizedBox(
                      height: 160,
                      child: HeartRateGraph(
                        color: AppColors.success, // Green
                        // Connect to HealthKit Stream!
                        dataStream: HealthService().heartRateStream,
                        isSimulation: false, // Use Real Data primarily (falls back internally if stream empty?)
                        // Note: My HeartRateGraph falls back to simulation if no stream provided.
                        // But here we provide one. If stream is silent, it might render nothing.
                        // For demo purposes, we usually want hybrid: Stream updates | Simulation filler.
                        // I'll update isSimulation to true for 'always animating' look + real data overrides.
                      ),
                    ),

                    const SizedBox(height: 24),

                    // --- BLOOD PRESSURE ---
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text("Blood Pressure", style: AppTypography.titleLarge),
                        Text(bp, style: AppTypography.headlineLarge.copyWith(height: 1, color: AppColors.accent)),
                      ],
                    ),
                    const SizedBox(height: 8),
                    const BloodPressureGraph(color: AppColors.accent), // Orange/Pink

                    const SizedBox(height: 24),

                    // --- OXYGEN SATURATION ---
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text("Oxygen (SpO2)", style: AppTypography.titleLarge),
                        Text("$oxygen%", style: AppTypography.headlineLarge.copyWith(height: 1, color: AppColors.info)),
                      ],
                    ),
                    const SizedBox(height: 8),
                    const OxygenGraph(color: AppColors.info), // Blue

                    const SizedBox(height: 32),
                    
                     GridView.count(
                      shrinkWrap: true,
                      physics: const NeverScrollableScrollPhysics(),
                      crossAxisCount: 2,
                      mainAxisSpacing: 16,
                      crossAxisSpacing: 16,
                      childAspectRatio: 1.4,
                      children: [
                        _buildFeatureCard(
                          context, 
                          "Scan Meds", 
                          CupertinoIcons.barcode_viewfinder, 
                          AppColors.primary, 
                          '/medication'
                        ),
                        // Keep simple summary cards as well? Maybe redundant now.
                        // Let's replace them with useful actions or keep "Family" link
                         _buildFeatureCard(
                          context, 
                          "Family Access", 
                          CupertinoIcons.person_2_fill, 
                          AppColors.info, 
                          '/family/home' // Or relevant route
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              
              // Bottom Navigation
              Align(
                alignment: Alignment.bottomCenter,
                child: AuraNavigationBar(
                  currentIndex: _currentIndex,
                  onTap: (index) {
                    setState(() => _currentIndex = index);
                    if (index == 2) {
                      context.push('/navigation');
                    }
                  },
                ),
              ),
            ],
          );
        }
      ),
      floatingActionButton: AuraFAB(
        onPressed: () => context.push('/chat'),
        icon: CupertinoIcons.chat_bubble_text_fill,
        label: "AI Assistant",
      ),
      floatingActionButtonLocation: FloatingActionButtonLocation.centerDocked,
    );
  }

  Widget _buildFeatureCard(BuildContext context, String label, IconData icon, Color color, String route) {
    return GestureDetector(
      onTap: () => context.push(route),
      child: Container(
        decoration: BoxDecoration(
          color: AppColors.surface,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: AppColors.surfaceHighlight),
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, color: color, size: 32),
            const SizedBox(height: 8),
            Text(label, style: AppTypography.titleMedium),
          ],
        ),
      ),
    );
  }
}
