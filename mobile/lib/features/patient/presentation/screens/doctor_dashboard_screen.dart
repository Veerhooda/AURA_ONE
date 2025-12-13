import 'package:flutter/material.dart';
import 'package:flutter/cupertino.dart';
import 'package:go_router/go_router.dart';
import 'dart:async';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_typography.dart';
import '../../../../core/widgets/aura_app_bar.dart';
import '../../../../services/api_service.dart';
import '../../../../services/socket_service.dart';

class DoctorDashboardScreen extends StatefulWidget {
  const DoctorDashboardScreen({super.key});

  @override
  State<DoctorDashboardScreen> createState() => _DoctorDashboardScreenState();
}

class _DoctorDashboardScreenState extends State<DoctorDashboardScreen> with TickerProviderStateMixin {
  final TextEditingController _searchController = TextEditingController();
  List<dynamic> _patients = [];
  Map<int, Map<String, dynamic>> _liveVitals = {};
  bool _isLoading = true;
  bool _isRefreshing = false;
  StreamSubscription? _vitalsSub;

  @override
  void initState() {
    super.initState();
    _loadPatients();
    _vitalsSub = SocketService().vitalsStream.listen((data) {
      if (mounted && data['patientId'] != null) {
        setState(() {
          _liveVitals[data['patientId']] = data;
        });
      }
    });
  }

  @override
  void dispose() {
    _vitalsSub?.cancel();
    super.dispose();
  }

  Future<void> _loadPatients() async {
    try {
      final patients = await ApiService().getPatients();
      if (mounted) {
        setState(() {
          _patients = patients;
          _isLoading = false;
        });
        // Subscribe to live updates for all visible patients
        for (var p in patients) {
           SocketService().subscribePatient(p['id']);
        }
      }
    } catch (e) {
      if (mounted) setState(() => _isLoading = false);
    }
  }

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
            child: _isLoading 
              ? const Center(child: CircularProgressIndicator())
              : _patients.isEmpty
                ? Center(child: Text("No patients found.", style: AppTypography.bodyLarge))
                : ListView.separated(
                  padding: const EdgeInsets.symmetric(horizontal: 20),
                  itemCount: _patients.length,
                  separatorBuilder: (c, i) => const SizedBox(height: 16),
                  itemBuilder: (context, index) {
                    final p = _patients[index];
                    final id = p['id'] ?? 0;
                    final name = p['user']?['name'] ?? 'Unknown Patient';
                    final ward = p['ward'] ?? 'General'; 
                    final status = p['status'] ?? 'Discharged';
                    
                    // Use live data if available, else static
                    final live = _liveVitals[id];
                    final hr = live != null ? live['hr']?.toString() : (p['current_state']?['heart_rate']?.toString() ?? "--");
                    final spo2 = live != null ? (live['spo2'] as num?)?.toInt().toString() : "--";
                    final isAdmitted = status.toLowerCase() == 'admitted';
                    final isDischarged = status.toLowerCase() == 'discharged';
                    final isCritical = status == 'Critical' || (live != null && (live['hr'] > 120 || live['spo2'] < 90));

                    return _buildPatientCard(
                          id: id,
                          name: name,
                          ward: ward,
                          status: status,
                          hr: hr ?? "--",
                          spo2: spo2 ?? "--",
                          isCritical: isCritical,
                          isAdmitted: isAdmitted,
                          isDischarged: isDischarged,
                        );
                  },
                ),
          ),
        ],
      ),
    );
  }

  Widget _buildPatientCard({
    required int id,
    required String name,
    required String ward,
    required String status,
    required String hr,
    required String spo2,
    required bool isCritical,
    required bool isAdmitted,
    required bool isDischarged,
  }) {
    return GestureDetector(
      onTap: () async {
        await context.push('/doctor/monitor/$id');
        _loadPatients();
      },
      child: Container(
        decoration: BoxDecoration(
          color: AppColors.surface,
          borderRadius: BorderRadius.circular(20),
          boxShadow: [
            BoxShadow(
              color: isCritical ? AppColors.error.withOpacity(0.15) : Colors.black.withOpacity(0.1),
              blurRadius: 12,
              offset: const Offset(0, 4),
            )
          ],
          border: Border.all(
            color: isCritical ? AppColors.error.withOpacity(0.5) : AppColors.surfaceHighlight,
            width: isCritical ? 2 : 1
          ),
        ),
        child: ClipRRect(
          borderRadius: BorderRadius.circular(20),
          child: Stack(
            children: [
              // Subtle background pulse for critical
              if (isCritical)
                Positioned(
                  right: -20,
                  top: -20,
                  child: Container(
                    width: 100,
                    height: 100,
                    decoration: BoxDecoration(
                      color: AppColors.error.withOpacity(0.1),
                      shape: BoxShape.circle,
                      boxShadow: [BoxShadow(color: AppColors.error.withOpacity(0.2), blurRadius: 40)]
                    ),
                  ),
                ),
                
              Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  children: [
                    Row(
                      children: [
                         Container(
                           padding: const EdgeInsets.all(12),
                           decoration: BoxDecoration(
                             color: isCritical ? AppColors.error.withOpacity(0.1) : AppColors.primary.withOpacity(0.1),
                             shape: BoxShape.circle
                           ),
                           child: Icon(
                             isCritical ? CupertinoIcons.exclamationmark_triangle_fill : CupertinoIcons.person_fill, 
                             color: isCritical ? AppColors.error : AppColors.primary,
                             size: 24,
                           ),
                         ),
                         const SizedBox(width: 16),
                         Expanded(
                           child: Column(
                             crossAxisAlignment: CrossAxisAlignment.start,
                             children: [
                               Text(name, style: AppTypography.titleMedium.copyWith(fontSize: 18)),
                               const SizedBox(height: 4),
                               Row(
                                 children: [
                                   Icon(CupertinoIcons.bed_double_fill, size: 14, color: AppColors.textSecondary),
                                   const SizedBox(width: 4),
                                   Flexible(
                                     child: Text(
                                       "Ward: $ward",
                                       style: AppTypography.bodyMedium.copyWith(color: AppColors.textSecondary, fontSize: 13),
                                       overflow: TextOverflow.ellipsis,
                                     ),
                                   ),
                                   const SizedBox(width: 12),
                                   Icon(CupertinoIcons.number, size: 14, color: AppColors.textSecondary),
                                   const SizedBox(width: 4),
                                   Text("ID: $id", style: AppTypography.bodyMedium.copyWith(color: AppColors.textSecondary, fontSize: 13)),
                                 ],
                               ),
                             ],
                           ),
                         ),
                         Container(
                           padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                           decoration: BoxDecoration(
                             color: isCritical ? AppColors.error : (isAdmitted ? AppColors.error : (isDischarged ? AppColors.textSecondary : AppColors.success)),
                             borderRadius: BorderRadius.circular(20)
                           ),
                           child: Text(
                             isCritical ? "CRITICAL" : status.toUpperCase(),
                             style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 10),
                           ),
                         )
                      ],
                    ),
                    const SizedBox(height: 16),
                    // Mini Vitals Preview
                    if (!isDischarged)
                      Container(
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: AppColors.background,
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceAround,
                          children: [
                            _buildMiniVital(CupertinoIcons.heart_fill, hr, "bpm", isCritical ? AppColors.error : AppColors.success),
                            Container(height: 20, width: 1, color: AppColors.surfaceHighlight),
                            _buildMiniVital(CupertinoIcons.drop_fill, spo2, "%", AppColors.info),
                          ],
                        ),
                      )
                    else
                      Container(
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: AppColors.background,
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Center(
                          child: Text(
                            "Patient Discharged",
                            style: AppTypography.bodyMedium.copyWith(color: AppColors.textSecondary),
                          ),
                        ),
                      ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildMiniVital(IconData icon, String value, String unit, Color color) {
    return Row(
      children: [
        Icon(icon, size: 16, color: color),
        const SizedBox(width: 6),
        Text(value, style: AppTypography.titleMedium.copyWith(fontSize: 16)),
        const SizedBox(width: 4),
        Text(unit, style: AppTypography.bodySmall.copyWith(color: AppColors.textSecondary)),
      ],
    );
  }
}
