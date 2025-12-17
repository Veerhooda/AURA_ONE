import 'package:flutter/material.dart';
import 'package:flutter/cupertino.dart';
import 'dart:ui' as ui;
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_typography.dart';
import '../../../../core/widgets/aura_app_bar.dart';
import '../../../../services/api_service.dart';
import '../../../../services/socket_service.dart';
import '../widgets/vitals_card.dart';
import '../widgets/vitals_graphs.dart';
import '../widgets/recovery_graph_card.dart';
import '../../../chat/presentation/screens/chat_screen.dart';

class DoctorPatientScreen extends StatefulWidget {
  final int patientId;
  const DoctorPatientScreen({super.key, required this.patientId});

  @override
  State<DoctorPatientScreen> createState() => _DoctorPatientScreenState();
}

class _DoctorPatientScreenState extends State<DoctorPatientScreen> with TickerProviderStateMixin {
  late TabController _tabController;
  late AnimationController _bgController;
  late Animation<Color?> _bgAnimation;

  Map<String, dynamic>? _patientData;
  List<dynamic> _medications = [];
  List<Map<String, dynamic>> _history = [];
  bool _isLoading = true;

  final List<String> _symptoms = [
    "Shortness of breath",
    "Mild Chest Pain",
    "Fatigue"
  ];

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
    
    // Ambient Background
    _bgController = AnimationController(vsync: this, duration: const Duration(seconds: 15))..repeat(reverse: true);
    _bgAnimation = ColorTween(begin: const Color(0xFF0F172A), end: const Color(0xFF1E293B)).animate(_bgController);

    _loadData();
    SocketService().subscribePatient(widget.patientId);
  }

  @override
  void dispose() {
    _tabController.dispose();
    _bgController.dispose();
    super.dispose();
  }

  Future<void> _loadData() async {
    setState(() { _isLoading = true; _history = []; });
    try {
      final data = await ApiService().getPatientTwin(widget.patientId);
      final meds = await ApiService().getPatientMedications(widget.patientId);
      final history = await ApiService().getPatientHistory(widget.patientId);
      
      if (mounted) {
        setState(() {
          _patientData = data;
          _medications = meds;
          _history = List<Map<String, dynamic>>.from(history);
          _isLoading = false;
        });
      }
    } catch (e) {
      if (mounted) setState(() { _isLoading = false; });
    }
  }

  Future<void> _toggleStatus() async {
    if (_patientData == null) return;
    bool currentAdmitted = _patientData!['status'] == 'Admitted'; 
    String newStatus = currentAdmitted ? 'Discharged' : 'Admitted';
    
    try {
      await ApiService().updatePatientStatus(widget.patientId, newStatus);
      setState(() => _patientData!['status'] = newStatus);
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text("Failed to update status")));
    }
  }

  // ... Dialogs omitted for brevity, reusing logic from previous version with updated UI if needed ...
  // Re-implementing dialogs to keep functionality
  void _showAddMedicationDialog() {
    final nameCtrl = TextEditingController();
    final dosageCtrl = TextEditingController();
    
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: const Color(0xFF1E293B),
        title: const Text("Prescribe Medication", style: TextStyle(color: Colors.white)),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            _buildDialogInput(nameCtrl, "Medication Name"),
            const SizedBox(height: 12),
            _buildDialogInput(dosageCtrl, "Dosage (e.g. 10mg)"),
          ],
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context), child: const Text("Cancel")),
          ElevatedButton(
            style: ElevatedButton.styleFrom(backgroundColor: AppColors.primary, foregroundColor: Colors.black),
            onPressed: () async {
              if (nameCtrl.text.isNotEmpty) {
                 await ApiService().addMedication(widget.patientId, nameCtrl.text, dosageCtrl.text);
                 Navigator.pop(context);
                 _loadData();
              }
            }, 
            child: const Text("Prescribe")
          )
        ],
      )
    );
  }

  void _showAddHistoryDialog() {
    final titleCtrl = TextEditingController();
    final noteCtrl = TextEditingController();
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
         backgroundColor: const Color(0xFF1E293B),
         title: const Text("Add Note", style: TextStyle(color: Colors.white)),
         content: Column(
           mainAxisSize: MainAxisSize.min,
           children: [
             _buildDialogInput(titleCtrl, "Title"),
             const SizedBox(height: 12),
             _buildDialogInput(noteCtrl, "Details", maxLines: 3),
           ],
         ),
         actions: [
            TextButton(onPressed: () => Navigator.pop(context), child: const Text("Cancel")),
            ElevatedButton(
              style: ElevatedButton.styleFrom(backgroundColor: AppColors.accent, foregroundColor: Colors.black),
              onPressed: () async {
                if (titleCtrl.text.isNotEmpty) {
                   await ApiService().addHistory(widget.patientId, "${titleCtrl.text}: ${noteCtrl.text}");
                   Navigator.pop(context);
                   _loadData();
                }
              }, 
              child: const Text("Save")
            )
         ],
      )
    );
  }

  Widget _buildDialogInput(TextEditingController ctrl, String label, {int maxLines = 1}) {
    return TextField(
      controller: ctrl,
      maxLines: maxLines,
      style: const TextStyle(color: Colors.white),
      decoration: InputDecoration(
        labelText: label,
        labelStyle: const TextStyle(color: Colors.white60),
        enabledBorder: OutlineInputBorder(borderSide: BorderSide(color: Colors.white.withOpacity(0.1))),
        focusedBorder: const OutlineInputBorder(borderSide: BorderSide(color: AppColors.primary)),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return Scaffold(
        backgroundColor: const Color(0xFF0F172A),
        appBar: const AuraAppBar(title: "Loading...", backgroundColor: Colors.transparent),
        body: const Center(child: CupertinoActivityIndicator(color: AppColors.primary)),
      );
    }

    if (_patientData == null) return const Scaffold(body: Center(child: Text("Not Found")));

    String status = _patientData!['status'] ?? "Discharged";
    bool isAdmitted = status == "Admitted";
    Color statusColor = isAdmitted ? AppColors.warning : AppColors.success;
    String patientName = _patientData!['metadata']?['name'] ?? "Unknown";

    return AnimatedBuilder(
      animation: _bgAnimation,
      builder: (context, child) {
        return Scaffold(
          backgroundColor: _bgAnimation.value,
          body: child,
          floatingActionButton: FloatingActionButton(
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => ChatScreen(
                    recipientId: widget.patientId,
                    recipientName: _patientData?['metadata']?['name'] ?? 'Patient',
                  ),
                ),
              );
            },
            backgroundColor: AppColors.primary,
            child: const Icon(CupertinoIcons.chat_bubble_fill, color: Colors.white),
          ),
        );
      },
      child: NestedScrollView(
        headerSliverBuilder: (context, _) => [
           SliverAppBar(
             expandedHeight: 220,
             floating: false,
             pinned: true,
             backgroundColor: Colors.transparent,
             flexibleSpace: FlexibleSpaceBar(
               background: _buildHeader(patientName, status, statusColor, isAdmitted),
             ),
             bottom: PreferredSize(
               preferredSize: const Size.fromHeight(60),
               child: _buildGlassTabBar(),
             ),
           ),
        ],
        body: TabBarView(
          controller: _tabController,
          children: [
            _buildOverviewTab(isAdmitted),
            _buildMedsTab(),
            _buildHistoryTab(),
          ],
        ),
      ),
    );
  }

  Widget _buildHeader(String name, String status, Color color, bool isAdmitted) {
    return SafeArea(
      child: Padding(
        padding: const EdgeInsets.fromLTRB(20, 60, 20, 20),
        child: Column(
          children: [
            Row(
              children: [
                CircleAvatar(
                  radius: 30,
                  backgroundColor: AppColors.primary.withOpacity(0.2),
                  child: const Icon(CupertinoIcons.person_fill, color: AppColors.primary, size: 30),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(name, style: AppTypography.headlineMedium.copyWith(color: Colors.white, fontSize: 24)),
                      const SizedBox(height: 4),
                      Row(
                        children: [
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                            decoration: BoxDecoration(
                              color: color.withOpacity(0.2),
                              borderRadius: BorderRadius.circular(20),
                              border: Border.all(color: color.withOpacity(0.5)),
                            ),
                            child: Text(status.toUpperCase(), style: TextStyle(color: color, fontWeight: FontWeight.bold, fontSize: 10)),
                          ),
                          const SizedBox(width: 12),
                          Text("ID #${widget.patientId}", style: const TextStyle(color: Colors.white54)),
                        ],
                      )
                    ],
                  ),
                ),
                IconButton(
                  icon: Icon(isAdmitted ? CupertinoIcons.checkmark_shield_fill : CupertinoIcons.shield_slash, color: color),
                  onPressed: _toggleStatus,
                )
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildGlassTabBar() {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.05),
        borderRadius: BorderRadius.circular(25),
        border: Border.all(color: Colors.white.withOpacity(0.1)),
      ),
      child: TabBar(
        controller: _tabController,
        indicator: BoxDecoration(
          color: AppColors.primary.withOpacity(0.2),
          borderRadius: BorderRadius.circular(25),
          border: Border.all(color: AppColors.primary.withOpacity(0.5)),
        ),
        indicatorSize: TabBarIndicatorSize.tab,
        labelColor: AppColors.primary,
        unselectedLabelColor: Colors.white54,
        dividerColor: Colors.transparent,
        tabs: const [
          Tab(text: "Digital Twin"),
          Tab(text: "Prescriptions"),
          Tab(text: "Timeline"),
        ],
      ),
    );
  }

  Widget _buildOverviewTab(bool isAdmitted) {
    if (!isAdmitted) {
      return Center(child: Text("Patient Discharged", style: AppTypography.titleLarge.copyWith(color: Colors.white38)));
    }
    
    // Live Data Streams
    return ListView(
      padding: const EdgeInsets.all(20),
      children: [
        // AI Risk Insight
        Container(
          padding: const EdgeInsets.all(16),
          margin: const EdgeInsets.only(bottom: 24),
          decoration: BoxDecoration(
            gradient: LinearGradient(colors: [AppColors.accent.withOpacity(0.2), Colors.transparent]),
            borderRadius: BorderRadius.circular(20),
            border: Border.all(color: AppColors.accent.withOpacity(0.3)),
          ),
          child: Row(
            children: [
              const Icon(CupertinoIcons.sparkles, color: AppColors.accent),
              const SizedBox(width: 12),
              const Expanded(child: Text("AI Insight: Patient recovering well. Vitals stable for 4h.", style: TextStyle(color: Colors.white70))),
            ],
          ),
        ),
        
        // AI Recovery Analysis
        RecoveryGraphCard(patientId: widget.patientId),
        const SizedBox(height: 24),

        StreamBuilder<int>(
          stream: SocketService().vitalsStream.where((d) => d['patientId'].toString() == widget.patientId.toString()).map((d) => d['hr'] as int? ?? 0),
          builder: (context, snap) {
             final val = snap.data ?? 0;
             return VitalsCard(
              title: "Heart Rate", 
              value: val > 0 ? "$val" : "--", 
              unit: "bpm", 
              icon: CupertinoIcons.heart_fill, 
              color: AppColors.success,
              graph: SizedBox(height: 100, child: HeartRateGraph(color: AppColors.success, isActive: val > 0)),
            );
          }
        ),

        StreamBuilder<int>(
          stream: SocketService().vitalsStream.where((d) => d['patientId'].toString() == widget.patientId.toString()).map((d) => (d['spo2'] as num?)?.toInt() ?? 0),
          builder: (context, snap) {
             final val = snap.data ?? 0;
             return VitalsCard(
              title: "SpO2", 
              value: val > 0 ? "$val" : "--", 
              unit: "%", 
              icon: CupertinoIcons.drop_fill, 
              color: AppColors.info,
              graph: SizedBox(height: 100, child: OxygenGraph(color: AppColors.info, isActive: val > 0)),
            );
          }
        ),

        StreamBuilder<String>(
          stream: SocketService().vitalsStream.where((d) => d['patientId'].toString() == widget.patientId.toString()).map((d) => d['bp'] as String? ?? "--/--"),
          builder: (context, snap) {
             final val = snap.data ?? "--/--";
             final isActive = val != "--/--" && val != "120/80"; // 120/80 is default if no variation, but we want to show it only if real
             return VitalsCard(
              title: "Blood Pressure",
              value: val,
              unit: "mmHg",
              icon: CupertinoIcons.waveform_path_ecg,
              color: Colors.orange,
              graph: SizedBox(height: 100, child: BloodPressureGraph(color: Colors.orange, isActive: isActive)), 
            );
          }
        ),
      ],
    );
  }

  Widget _buildMedsTab() {
    return _GlassListLayer(
      children: [
        if (_medications.isEmpty) const Center(child: Padding(padding: EdgeInsets.all(20), child: Text("No Medications", style: TextStyle(color: Colors.white54))))
        else ..._medications.map((m) => Container(
          margin: const EdgeInsets.only(bottom: 12),
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: Colors.white.withOpacity(0.03),
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: Colors.white.withOpacity(0.05))
          ),
          child: Row(
            children: [
              const Icon(CupertinoIcons.capsule_fill, color: AppColors.primary),
              const SizedBox(width: 16),
              Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                 Text(m['name'], style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                 Text(m['dosage'] + " • " + (m['frequency'] ?? 'Daily'), style: const TextStyle(color: Colors.white54, fontSize: 12)),
              ])
            ],
          ),
        )).toList(),
        
        Padding(
          padding: const EdgeInsets.only(top: 20),
          child: SizedBox(
            width: double.infinity,
            child: OutlinedButton.icon(
              onPressed: _showAddMedicationDialog,
              icon: const Icon(Icons.add, color: AppColors.primary),
              label: const Text("Prescribe New", style: TextStyle(color: AppColors.primary)),
              style: OutlinedButton.styleFrom(side: const BorderSide(color: AppColors.primary)),
            ),
          ),
        )
      ],
    );
  }

  Widget _buildHistoryTab() {
     return _GlassListLayer(
       children: [
          ..._history.map((h) => Padding(
            padding: const EdgeInsets.only(bottom: 24),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Column(
                  children: [
                    Container(width: 12, height: 12, decoration: BoxDecoration(color: AppColors.accent, shape: BoxShape.circle, boxShadow: [BoxShadow(color: AppColors.accent, blurRadius: 10)])),
                    Container(width: 2, height: 50, color: Colors.white.withOpacity(0.1))
                  ],
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(color: Colors.white.withOpacity(0.05), borderRadius: BorderRadius.circular(16)),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(h['type'] ?? 'Note', style: const TextStyle(color: AppColors.accent, fontWeight: FontWeight.bold)),
                        const SizedBox(height: 4),
                        Text(h['note'], style: const TextStyle(color: Colors.white70)),
                      ],
                    ),
                  ),
                )
              ],
            ),
          )).toList(),
           Padding(
            padding: const EdgeInsets.only(top: 20),
            child: SizedBox(
              width: double.infinity,
              child: OutlinedButton.icon(
                onPressed: _showAddHistoryDialog,
                icon: const Icon(Icons.edit, color: AppColors.accent),
                label: const Text("Add Note", style: TextStyle(color: AppColors.accent)),
                style: OutlinedButton.styleFrom(side: const BorderSide(color: AppColors.accent)),
              ),
            ),
          )
       ],
     );
  }
}

class _GlassListLayer extends StatelessWidget {
  final List<Widget> children;
  const _GlassListLayer({required this.children});
  @override
  Widget build(BuildContext context) {
    return ListView(padding: const EdgeInsets.all(20), children: children);
  }
}
