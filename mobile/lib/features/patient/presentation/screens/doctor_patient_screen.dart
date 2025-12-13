import 'package:flutter/material.dart';
import 'package:flutter/cupertino.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_typography.dart';
import '../../../../core/widgets/aura_app_bar.dart';
import '../../../../services/api_service.dart';
import '../../../../services/socket_service.dart';
import '../widgets/vitals_card.dart';
import '../widgets/vitals_graphs.dart';

class DoctorPatientScreen extends StatefulWidget {
  final int patientId;
  const DoctorPatientScreen({super.key, required this.patientId});

  @override
  State<DoctorPatientScreen> createState() => _DoctorPatientScreenState();
}

class _DoctorPatientScreenState extends State<DoctorPatientScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;
  Map<String, dynamic>? _patientData;
  List<dynamic> _medications = [];
  bool _isLoading = true;

  List<Map<String, dynamic>> _history = [];

  final List<String> _symptoms = [
    "Shortness of breath",
    "Mild Chest Pain",
    "Fatigue"
  ];

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
    _loadData();
    
    // Connect to live stream immediately
    SocketService().subscribePatient(widget.patientId);
  }

  Future<void> _loadData() async {
    setState(() {
      _isLoading = true;
      _history = []; // Clear previous history
    });
    
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
      print('Error loading patient data: $e');
      if (mounted) {
        setState(() {
          _isLoading = false;
          _history = [];
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return const Scaffold(
        appBar: AuraAppBar(title: "Patient Details"),
        body: Center(child: CupertinoActivityIndicator(radius: 16)),
      );
    }

    if (_patientData == null) {
       return const Scaffold(
        appBar: AuraAppBar(title: "Patient Details"),
        body: Center(child: Text("Patient not found.")),
      );
    }

    // Determine status from backend data
    String status = _patientData!['status'] ?? "Discharged";
    bool isAdmitted = status == "Admitted";
    Color statusColor = isAdmitted ? AppColors.error : AppColors.success;
    
    // Extract patient name from metadata
    final patientName = _patientData!['metadata']?['name'] ?? "Unknown Patient";

    return Scaffold(
      appBar: AuraAppBar(title: patientName),
      body: RefreshIndicator(
        onRefresh: _loadData,
        child: NestedScrollView(
          physics: const AlwaysScrollableScrollPhysics(), 
          headerSliverBuilder: (context, _) => [
             SliverToBoxAdapter(
               child: _buildHeader(status, statusColor),
             ),
             SliverPersistentHeader(
               pinned: true,
               delegate: _SliverAppBarDelegate(
                 TabBar(
                   controller: _tabController,
                   labelColor: AppColors.primary,
                   unselectedLabelColor: AppColors.textSecondary,
                   indicatorColor: AppColors.primary,
                   tabs: const [
                     Tab(text: "Overview"),
                     Tab(text: "Meds"),
                     Tab(text: "History"),
                   ],
                 ),
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
      ),
    );
  }

  // --- ACTIONS ---

  Future<void> _toggleStatus() async {
    // Current simulated logic: if ID=1 it's admitted.
    // New Logic: Toggle state locally + Backend Call
    if (_patientData == null) return;
    
    // Check current status string or use our bool
    bool currentAdmitted = _patientData!['status'] == 'Admitted'; 
    String newStatus = currentAdmitted ? 'Discharged' : 'Admitted';
    
    try {
      await ApiService().updatePatientStatus(widget.patientId, newStatus);
      setState(() {
         _patientData!['status'] = newStatus;
      });
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text("Patient $newStatus")));
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text("Failed to update status")));
    }
  }

  void _showAddMedicationDialog() {
    final nameCtrl = TextEditingController();
    final dosageCtrl = TextEditingController();

    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text("Prescribe Medication"),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(controller: nameCtrl, decoration: const InputDecoration(labelText: "Medication Name")),
            TextField(controller: dosageCtrl, decoration: const InputDecoration(labelText: "Dosage (e.g. 10mg)")),
          ],
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context), child: const Text("Cancel")),
          ElevatedButton(
            onPressed: () async {
              if (nameCtrl.text.isNotEmpty) {
                try {
                   await ApiService().addMedication(widget.patientId, nameCtrl.text, dosageCtrl.text);
                   Navigator.pop(context);
                   _loadData(); // Refresh list
                } catch (e) {
                   ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text("Failed to add medication")));
                }
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
        title: const Text("Add Medical Note"),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(
              controller: titleCtrl, 
              decoration: const InputDecoration(
                labelText: "Title (e.g., Diagnosis, Lab Result)",
                hintText: "Enter record type"
              ),
            ),
            const SizedBox(height: 12),
            TextField(
              controller: noteCtrl, 
              decoration: const InputDecoration(
                labelText: "Details",
                hintText: "Enter medical observations"
              ),
              maxLines: 3,
            ),
          ],
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context), child: const Text("Cancel")),
          ElevatedButton(
            onPressed: () async {
              if (titleCtrl.text.isNotEmpty && noteCtrl.text.isNotEmpty) {
                try {
                   final fullNote = "${titleCtrl.text}: ${noteCtrl.text}";
                   await ApiService().addHistory(widget.patientId, fullNote);
                   Navigator.pop(context);
                   // Reload data to get the updated history from backend
                   _loadData();
                   ScaffoldMessenger.of(context).showSnackBar(
                     const SnackBar(
                       content: Text("Medical note saved successfully"),
                       backgroundColor: Colors.green,
                     )
                   );
                } catch (e) {
                   ScaffoldMessenger.of(context).showSnackBar(
                     const SnackBar(content: Text("Failed to save note"))
                   );
                }
              }
            }, 
            child: const Text("Save Record")
          )
        ],
      )
    );
  }

   Widget _buildHeader(String status, Color color) {
    bool isAdmitted = status == 'Admitted';
    
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
          colors: [
            AppColors.surface,
            AppColors.background,
          ],
        ),
        border: const Border(bottom: BorderSide(color: AppColors.surfaceHighlight, width: 1)),
      ),
      child: Column(
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(3),
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  gradient: LinearGradient(
                    colors: [AppColors.primary, AppColors.primaryLight],
                  ),
                ),
                child: CircleAvatar(
                  radius: 32,
                  backgroundColor: AppColors.surface,
                  child: const Icon(CupertinoIcons.person_fill, size: 32, color: AppColors.primary),
                ),
              ),
              const SizedBox(width: 20),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(_patientData!['metadata']?['name'] ?? "Unknown", style: AppTypography.headlineMedium),
                    const SizedBox(height: 4),
                    Row(
                      children: [
                        _buildBadge(status, color),
                        const SizedBox(width: 12),
                        Text("ID: #${widget.patientId}", style: AppTypography.bodyMedium),
                      ],
                    ),
                  ],
                ),
              ),
              // Status Toggle Button
              IconButton( // Use a distinct button or switch
                icon: Icon(
                  isAdmitted ? CupertinoIcons.checkmark_circle_fill : CupertinoIcons.circle,
                  color: isAdmitted ? AppColors.success : AppColors.textSecondary,
                  size: 32,
                ),
                onPressed: _toggleStatus,
                tooltip: "Toggle Admission Status",
              )
            ],
          ),
          const SizedBox(height: 24),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
              _buildStatItem("Age", "42"), // Mock
              _buildStatItem("Weight", "78 kg"),
              _buildStatItem("Blood", "O+"),
              _buildStatItem("Ward", "General"),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildStatItem(String label, String value) {
    return Column(
      children: [
        Text(
          value, 
          style: AppTypography.titleLarge.copyWith(
            fontWeight: FontWeight.bold,
            fontSize: 20,
          ),
        ),
        const SizedBox(height: 4),
        Text(
          label, 
          style: AppTypography.bodySmall.copyWith(
            color: AppColors.textSecondary,
            fontSize: 12,
          ),
        ),
      ],
    );
  }

  Widget _buildBadge(String text, Color color) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: color),
      ),
      child: Text(text, style: AppTypography.labelSmall.copyWith(color: color, fontWeight: FontWeight.bold)),
    );
  }

  // --- TABS ---

  Widget _buildOverviewTab(bool showLiveVitals) {
    if (!showLiveVitals) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(CupertinoIcons.bed_double_fill, size: 64, color: AppColors.textSecondary.withOpacity(0.5)),
            const SizedBox(height: 16),
            Text("Patient Not Admitted", style: AppTypography.titleLarge.copyWith(color: AppColors.textSecondary)),
            const SizedBox(height: 8),
            Text("Live vitals monitoring is inactive.", style: AppTypography.bodyMedium),
          ],
        ),
      );
    }

    // Extract real pain data
    final painLevel = _patientData?['current_state']?['pain_level'];
    final painTime = _patientData?['current_state']?['pain_reported_at'];
    
    // If pain level is null or 0, we can assume no pain reported or resolved
    final hasPain = painLevel != null && painLevel > 0;

    return ListView(
      padding: const EdgeInsets.all(20),
      children: [
        // Real Pain Alert
        if (hasPain)
          Container(
            margin: const EdgeInsets.only(bottom: 20),
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
               color: AppColors.error.withOpacity(0.1),
               borderRadius: BorderRadius.circular(16),
               border: Border.all(color: AppColors.error),
            ),
            child: Row(
              children: [
                 const Icon(CupertinoIcons.exclamationmark_triangle_fill, color: AppColors.error),
                 const SizedBox(width: 16),
                 Expanded(
                   child: Column(
                     crossAxisAlignment: CrossAxisAlignment.start,
                     children: [
                       Text("Patient Reported Pain", style: AppTypography.titleMedium.copyWith(color: AppColors.error)),
                       const SizedBox(height: 4),
                       Row(
                         children: [
                           Text("Severity: ", style: AppTypography.bodyMedium),
                           Text("$painLevel/10", style: AppTypography.titleMedium.copyWith(color: AppColors.error, fontWeight: FontWeight.bold)),
                         ],
                       ),
                       if (painTime != null)
                        Text("Timestamp: $painTime", style: AppTypography.bodySmall),
                     ],
                   ),
                 ),
                 TextButton(
                   onPressed: () {
                     // Could implement 'Resolve' logic here to set pain to 0
                   },
                   child: Text("Ack", style: AppTypography.labelLarge.copyWith(color: AppColors.error)),
                 )
              ],
            ),
          )
        else
           Container(
             margin: const EdgeInsets.only(bottom: 20),
             padding: const EdgeInsets.all(16),
             decoration: BoxDecoration(
               color: AppColors.success.withOpacity(0.1),
               borderRadius: BorderRadius.circular(16),
               border: Border.all(color: AppColors.success),
             ),
             child: Row(
               children: [
                 const Icon(CupertinoIcons.checkmark_shield_fill, color: AppColors.success),
                 const SizedBox(width: 16),
                 Text("No active pain reported.", style: AppTypography.bodyMedium.copyWith(color: AppColors.success)),
               ],
             ),
           ),

        Text("Current Symptoms", style: AppTypography.titleMedium),
        const SizedBox(height: 12),
        Wrap(
          spacing: 8,
          children: _symptoms.map((s) => Chip(
            label: Text(s), 
            backgroundColor: AppColors.surfaceHighlight, 
            labelStyle: AppTypography.bodySmall
          )).toList(),
        ),
        const SizedBox(height: 24),
        
        Text("Live Vitals Monitor", style: AppTypography.titleMedium.copyWith(color: AppColors.error)),
        const SizedBox(height: 16),

        // LIVE HEART RATE
        StreamBuilder<int>(
          initialData: (_patientData?['current_state']?['heart_rate'] as num?)?.toInt(),
          stream: SocketService().vitalsStream
            .where((d) => d['patientId'] == widget.patientId)
            .map((d) => d['hr'] as int? ?? 0)
            .distinct(),
          builder: (context, snap) {
              final val = (snap.data != null && snap.data! > 0) ? snap.data.toString() : "--";
              return VitalsCard(
                title: "Heart Rate",
                value: val,
                unit: "bpm",
                icon: CupertinoIcons.heart_fill,
                color: AppColors.success,
                graph: SizedBox(
                   height: 120,
                   child: HeartRateGraph(
                     color: AppColors.success,
                     waveStream: SocketService().vitalsStream
                       .where((d) => d['patientId'] == widget.patientId)
                       .map((d) => (d['ecg'] as num?)?.toDouble() ?? 0.0),
                   ),
                ),
              );
          },
        ),

        // LIVE BLOOD PRESSURE
        StreamBuilder<String>(
          initialData: () {
             final raw = _patientData?['current_state']?['blood_pressure'];
             if (raw is Map) {
               return raw['value']?.toString() ?? raw.toString(); 
             }
             return raw?.toString();
          }(),
          stream: SocketService().vitalsStream
            .where((d) => d['patientId'] == widget.patientId)
            .map((d) => d['bp'] as String? ?? "--/--")
            .distinct(),
          builder: (context, snap) {
              final val = snap.data ?? "--/--";
              return VitalsCard(
                title: "Blood Pressure",
                value: val,
                unit: "mmHg",
                icon: CupertinoIcons.heart_circle_fill,
                color: AppColors.warning,
                graph: SizedBox(
                   height: 120,
                   child: BloodPressureGraph(
                     color: AppColors.warning,
                   ),
                ),
              );
          },
        ),

        // LIVE SpO2
        StreamBuilder<int>(
          initialData: (_patientData?['current_state']?['spo2'] as num?)?.toInt(),
          stream: SocketService().vitalsStream
            .where((d) => d['patientId'] == widget.patientId)
            .map((d) => (d['spo2'] as num?)?.toInt() ?? 0)
            .distinct(),
          builder: (context, snap) {
              final val = (snap.data != null && snap.data! > 0) ? snap.data.toString() : "--";
              return VitalsCard(
                title: "Oxygen Saturation",
                value: val,
                unit: "%",
                icon: CupertinoIcons.drop_fill,
                color: AppColors.info,
                graph: SizedBox(
                   height: 120,
                   child: OxygenGraph(
                     color: AppColors.info,
                     waveStream: SocketService().vitalsStream
                       .where((d) => d['patientId'] == widget.patientId)
                       .map((d) => (d['spo2_wave'] as num?)?.toDouble() ?? 0.0),
                   ),
                ),
              );
          },
        ),
      ],
    );
  }

  Widget _buildMedsTab() {
    return Stack(
      children: [
        if (_medications.isEmpty)
          Center(child: Text("No active medications.", style: AppTypography.bodyMedium))
        else
          ListView.builder(
            padding: const EdgeInsets.all(20),
            itemCount: _medications.length,
            itemBuilder: (context, index) {
              final med = _medications[index];
              return Card(
                child: ListTile(
                  leading: CircleAvatar(backgroundColor: AppColors.primary.withOpacity(0.1), child: const Icon(CupertinoIcons.capsule_fill, color: AppColors.primary)),
                  title: Text(med['name'] ?? "Medication", style: AppTypography.titleMedium),
                  subtitle: Text(med['dosage'] ?? "1 pill daily", style: AppTypography.bodyMedium),
                ),
              );
            },
          ),
        Positioned(
          bottom: 24,
          right: 24,
          child: FloatingActionButton.extended(
            heroTag: "addMed",
            onPressed: _showAddMedicationDialog,
            backgroundColor: AppColors.primary,
            icon: const Icon(Icons.add),
            label: const Text("Prescribe"),
          ),
        )
      ],
    );
  }

  Widget _buildHistoryTab() {
    return Stack(
      children: [
        _history.isEmpty
          ? Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(CupertinoIcons.doc_text_search, size: 48, color: AppColors.textSecondary.withOpacity(0.5)),
                  const SizedBox(height: 16),
                  Text(
                    "No medical history found",
                    style: AppTypography.bodyLarge.copyWith(color: AppColors.textSecondary),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    "Add a new record to get started",
                    style: AppTypography.bodyMedium.copyWith(color: AppColors.textSecondary.withOpacity(0.7)),
                  ),
                ],
              ),
            )
          : ListView.builder(
              padding: const EdgeInsets.all(20),
              itemCount: _history.length,
              itemBuilder: (context, index) {
                final item = _history[index];
                return Padding(
                  padding: const EdgeInsets.only(bottom: 16),
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Column(
                        children: [
                          Container(
                            width: 12,
                            height: 12,
                            decoration: BoxDecoration(
                              color: AppColors.primary,
                              shape: BoxShape.circle,
                              border: Border.all(color: AppColors.surface, width: 2),
                              boxShadow: [BoxShadow(color: AppColors.primary.withOpacity(0.4), blurRadius: 8)]
                            ),
                          ),
                          Container(
                            width: 2,
                            height: 60,
                            color: AppColors.surfaceHighlight,
                          )
                        ],
                      ),
                      const SizedBox(width: 16),
                      Expanded(
                        child: Container(
                          padding: const EdgeInsets.all(16),
                          decoration: BoxDecoration(
                            color: AppColors.surface,
                            borderRadius: BorderRadius.circular(16),
                            border: Border.all(color: AppColors.surfaceHighlight),
                          ),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                children: [
                                  Text(
                                    item['type'] ?? 'General',
                                    style: AppTypography.titleMedium.copyWith(fontSize: 16, color: AppColors.primary),
                                  ),
                                  Text(
                                    item['date'] ?? '',
                                    style: AppTypography.bodySmall.copyWith(color: AppColors.textSecondary),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 8),
                              Text(
                                item['note'] ?? '',
                                style: AppTypography.bodyMedium.copyWith(height: 1.5),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ],
                  ),
                );
              },
            ),
        Positioned(
          bottom: 24,
          right: 24,
          child: FloatingActionButton.extended(
            heroTag: "addHistory",
            onPressed: _showAddHistoryDialog,
            backgroundColor: AppColors.accent,
            icon: const Icon(Icons.edit_note),
            label: const Text("Add Note"),
          ),
        )
      ],
    );
  }
}

class _SliverAppBarDelegate extends SliverPersistentHeaderDelegate {
  final TabBar _tabBar;
  _SliverAppBarDelegate(this._tabBar);

  @override
  double get minExtent => _tabBar.preferredSize.height + 16;
  @override
  double get maxExtent => _tabBar.preferredSize.height + 16;

  @override
  Widget build(BuildContext context, double shrinkOffset, bool overlapsContent) {
    return Container(
      color: AppColors.background,
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: Container(
        decoration: BoxDecoration(
          color: AppColors.surface,
          borderRadius: BorderRadius.circular(12),
        ),
        child: _tabBar,
      )
    );
  }

  @override
  bool shouldRebuild(_SliverAppBarDelegate oldDelegate) => false;
}
