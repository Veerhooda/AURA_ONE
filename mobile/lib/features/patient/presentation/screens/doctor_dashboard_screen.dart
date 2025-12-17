import 'package:flutter/material.dart';
import 'package:flutter/cupertino.dart';
import 'package:go_router/go_router.dart';
import 'dart:ui' as ui;
import 'dart:async';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_typography.dart';
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
  StreamSubscription? _vitalsSub;
  late AnimationController _bgController;
  late Animation<Color?> _bgAnimation;

  @override
  void initState() {
    super.initState();
    _loadPatients();
    
    // Ambient Background Animation
    _bgController = AnimationController(vsync: this, duration: const Duration(seconds: 10))..repeat(reverse: true);
    _bgAnimation = ColorTween(begin: const Color(0xFF0F172A), end: const Color(0xFF1E293B)).animate(_bgController);

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
    _bgController.dispose();
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

  int get _criticalCount {
    return _patients.where((p) {
       final id = p['id'];
       final live = _liveVitals[id];
       final status = p['status'];
       return status == 'Critical' || (live != null && (live['hr'] > 120 || live['spo2'] < 90));
    }).length;
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _bgAnimation,
      builder: (context, child) {
        return Scaffold(
          backgroundColor: _bgAnimation.value,
          body: Stack(
            children: [
               // Background Ambient Glows
               Positioned(top: -100, right: -100, child: _buildGlowOrb(AppColors.primary.withOpacity(0.15))),
               Positioned(bottom: -100, left: -100, child: _buildGlowOrb(AppColors.accent.withOpacity(0.1))),

               CustomScrollView(
                 slivers: [
                   _buildSliverAppBar(),
                   _buildSummaryHeader(),
                   _buildSliverSearch(),
                   _buildPatientList(),
                 ],
               ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildGlowOrb(Color color) {
    return Container(
      width: 300,
      height: 300,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        color: color,
        boxShadow: [BoxShadow(color: color, blurRadius: 100, spreadRadius: 50)],
      ),
    );
  }

  Widget _buildSliverAppBar() {
    return SliverAppBar(
      expandedHeight: 120,
      backgroundColor: Colors.transparent,
      floating: false,
      pinned: true,
      flexibleSpace: FlexibleSpaceBar(
        titlePadding: const EdgeInsets.only(left: 20, bottom: 16),
        title: Text(
          "Doctor's Station",
          style: AppTypography.headlineMedium.copyWith(color: Colors.white, fontWeight: FontWeight.bold),
        ),
        background: Container(color: Colors.black.withOpacity(0.6)),
      ),
      actions: [
        IconButton(
            icon: const Icon(Icons.person, color: Colors.white70),
            onPressed: () => context.push('/doctor/profile/1'), // TODO: replace with actual doctor ID
          ),
        const SizedBox(width: 10),
        IconButton(
          icon: const Icon(CupertinoIcons.bell_fill, color: Colors.white70),
          onPressed: () {}, // Future Notification Center
        ),
        const SizedBox(width: 10),
      ],
    );
  }

  Widget _buildSummaryHeader() {
    return SliverToBoxAdapter(
      child: Padding(
        padding: const EdgeInsets.fromLTRB(20, 20, 20, 10),
        child: Row(
          children: [
            _buildSummaryCard("Patients", "${_patients.length}", CupertinoIcons.person_2_fill, AppColors.primary),
            const SizedBox(width: 12),
            _buildSummaryCard("Critical", "$_criticalCount", CupertinoIcons.exclamationmark_triangle_fill, AppColors.error),
          ],
        ),
      ),
    );
  }

  Widget _buildSummaryCard(String title, String count, IconData icon, Color color) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: color.withOpacity(0.1),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: color.withOpacity(0.2)),
        ),
        child: Row(
          children: [
            Icon(icon, color: color, size: 24),
            const SizedBox(width: 12),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(count, style: title == "Critical" && int.parse(count) > 0 
                    ? TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: color, shadows: [Shadow(color: color, blurRadius: 10)])
                    : TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: Colors.white)),
                Text(title, style: TextStyle(fontSize: 12, color: Colors.white60)),
              ],
            )
          ],
        ),
      ),
    );
  }

  Widget _buildSliverSearch() {
    return SliverPersistentHeader(
      pinned: true,
      delegate: _SliverSearchDelegate(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            height: 44, // Fixed height for alignment
                decoration: BoxDecoration(
                  color: Colors.white.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: Colors.white.withOpacity(0.15)),
                ),
                child: Row(
                  children: [
                    const Icon(CupertinoIcons.search, color: Colors.white54, size: 20),
                    const SizedBox(width: 12),
                    Expanded(
                      child: TextField(
                        controller: _searchController,
                        style: const TextStyle(color: Colors.white),
                        decoration: const InputDecoration(
                          hintText: "Search Patient ID...",
                          hintStyle: TextStyle(color: Colors.white70),
                          border: InputBorder.none,
                          enabledBorder: InputBorder.none,
                          focusedBorder: InputBorder.none,
                          errorBorder: InputBorder.none,
                          disabledBorder: InputBorder.none,
                          filled: false,
                          fillColor: Colors.transparent,
                          isDense: true,
                          contentPadding: EdgeInsets.zero,
                        ),
                        onSubmitted: _navigateToPatient,
                      ),
                    ),
                  ],
                ),
              ),
            ),
      ),
    );
  }

  Widget _buildPatientList() {
    if (_isLoading) {
      return const SliverFillRemaining(child: Center(child: CupertinoActivityIndicator(color: AppColors.primary)));
    }
    if (_patients.isEmpty) {
      return SliverFillRemaining(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
             Icon(CupertinoIcons.person_3, size: 60, color: Colors.white10),
             SizedBox(height: 16),
             Text("No active patients", style: TextStyle(color: Colors.white30))
          ],
        )
      );
    }
    return SliverList(
      delegate: SliverChildBuilderDelegate(
        (context, index) {
          final p = _patients[index];
          final id = p['id'] ?? 0;
          final name = p['user']?['name'] ?? 'Unknown Patient';
          final ward = p['ward'] ?? 'General'; 
          final status = p['status'] ?? 'Discharged';
          
          final live = _liveVitals[id];
          final hr = live != null ? live['hr']?.toString() : (p['current_state']?['heart_rate']?.toString() ?? "--");
          final spo2 = live != null ? (live['spo2'] as num?)?.toInt().toString() : "--";
          final isCritical = status == 'Critical' || (live != null && (live['hr'] > 120 || live['spo2'] < 90));

          return _buildGlassPatientCard(
            id: id, 
            name: name, 
            ward: ward, 
            status: status, 
            hr: hr ?? "--", 
            spo2: spo2 ?? "--", 
            isCritical: isCritical
          );
        },
        childCount: _patients.length,
      ),
    );
  }

  Widget _buildGlassPatientCard({
    required int id,
    required String name,
    required String ward,
    required String status,
    required String hr,
    required String spo2,
    required bool isCritical,
  }) {
    Color statusColor;
    if (isCritical) statusColor = AppColors.error;
    else if (status == 'Admitted') statusColor = AppColors.warning;
    else statusColor = AppColors.success;

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
      child: GestureDetector(
        onTap: () async {
          await context.push('/doctor/monitor/$id');
          _loadPatients();
        },
        child: Container(
          decoration: BoxDecoration(
            color: Colors.black.withOpacity(0.3),
            borderRadius: BorderRadius.circular(24),
            border: Border.all(color: Colors.white.withOpacity(0.1)),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.2),
                blurRadius: 10,
                offset: const Offset(0, 4),
              )
            ]
          ),
              child: Stack(
                children: [
                  if (isCritical)
                    Positioned(
                      right: -30, top: -30,
                      child: Container(
                        width: 100, height: 100,
                        decoration: BoxDecoration(
                          color: AppColors.error.withOpacity(0.15), 
                          shape: BoxShape.circle,
                          boxShadow: [
                             BoxShadow(color: AppColors.error.withOpacity(0.3), blurRadius: 30, spreadRadius: 5)
                          ],
                        ),
                      ),
                    ),

                  Padding(
                    padding: const EdgeInsets.all(20),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Container(
                              padding: const EdgeInsets.all(12),
                              decoration: BoxDecoration(
                                color: statusColor.withOpacity(0.2),
                                shape: BoxShape.circle,
                              ),
                              child: Icon(CupertinoIcons.person_fill, color: statusColor, size: 20),
                            ),
                            const SizedBox(width: 16),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(name, style: AppTypography.titleMedium.copyWith(color: Colors.white, fontSize: 18)),
                                  const SizedBox(height: 4),
                                  Text("Ward $ward • ID #$id", style: TextStyle(color: Colors.white.withOpacity(0.5), fontSize: 13)),
                                ],
                              ),
                            ),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                              decoration: BoxDecoration(
                                color: statusColor.withOpacity(0.1),
                                borderRadius: BorderRadius.circular(20),
                                border: Border.all(color: statusColor.withOpacity(0.3)),
                              ),
                              child: Text(
                                isCritical ? "CRITICAL" : status.toUpperCase(),
                                style: TextStyle(color: statusColor, fontWeight: FontWeight.bold, fontSize: 10),
                              ),
                            )
                          ],
                        ),
                        const SizedBox(height: 20),
                        Divider(color: Colors.white.withOpacity(0.1), height: 1),
                        const SizedBox(height: 16),
                        
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceAround,
                          children: [
                            _buildVitalStat("Heart Rate", hr.contains("bpm") ? hr : "$hr bpm", CupertinoIcons.heart_fill, isCritical ? AppColors.error : AppColors.success),
                            Container(width: 1, height: 30, color: Colors.white.withOpacity(0.1)),
                            _buildVitalStat("SpO2", spo2.contains("%") ? spo2 : "$spo2 %", CupertinoIcons.drop_fill, AppColors.info),
                          ],
                        )
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
        );
  }

  Widget _buildVitalStat(String label, String value, IconData icon, Color color) {
    // Robust parsing
    String mainVal = value;
    String subVal = "";
    if (value.contains(' ')) {
      final parts = value.split(' ');
      mainVal = parts[0];
      subVal = parts.length > 1 ? parts[1] : '';
    }

    return Column(
      children: [
        Row(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.baseline,
          textBaseline: TextBaseline.alphabetic,
          children: [
            Text(mainVal, style: TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold, shadows: [
               Shadow(color: color.withOpacity(0.5), blurRadius: 10)
            ])),
            const SizedBox(width: 4),
            Text(subVal, style: TextStyle(color: Colors.white54, fontSize: 12)),
          ],
        ),
        const SizedBox(height: 4),
        Row(
          children: [
            Icon(icon, size: 10, color: color),
            const SizedBox(width: 4),
            Text(label, style: TextStyle(color: Colors.white38, fontSize: 11)),
          ],
        )
      ],
    );
  }
}

class _SliverSearchDelegate extends SliverPersistentHeaderDelegate {
  final Widget child;
  _SliverSearchDelegate({required this.child});
  @override
  double get minExtent => 64;
  @override
  double get maxExtent => 64;
  @override
  Widget build(BuildContext context, double shrinkOffset, bool overlapsContent) => child;
  @override
  bool shouldRebuild(covariant _SliverSearchDelegate oldDelegate) => false;
}
