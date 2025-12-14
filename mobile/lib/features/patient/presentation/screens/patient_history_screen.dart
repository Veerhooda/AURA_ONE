import 'package:flutter/material.dart';
import 'package:flutter/cupertino.dart';
import 'dart:ui' as ui;
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_typography.dart';
import '../../../../core/widgets/aura_app_bar.dart';
import '../../../../services/api_service.dart';

class PatientHistoryScreen extends StatefulWidget {
  const PatientHistoryScreen({super.key});

  @override
  State<PatientHistoryScreen> createState() => _PatientHistoryScreenState();
}

class _PatientHistoryScreenState extends State<PatientHistoryScreen> {
  List<Map<String, dynamic>> _history = [];
  List<Map<String, dynamic>> _reports = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    final patientId = await ApiService().getPatientId();
    if (patientId == null) {
      setState(() => _isLoading = false);
      return;
    }

    try {
      final historyFuture = ApiService().getPatientHistory(patientId);
      final reportsFuture = ApiService().getPatientReports(patientId);
      
      final results = await Future.wait([historyFuture, reportsFuture]);
      
      if (mounted) {
        setState(() {
          _history = (results[0] as List).cast<Map<String, dynamic>>();
          _reports = (results[1] as List).cast<Map<String, dynamic>>();
          _isLoading = false;
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() => _isLoading = false);
        // Silently fail or show error
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
      length: 2,
      child: Scaffold(
        extendBodyBehindAppBar: true,
        body: Stack(
          children: [
             // Background Gradient
            Container(
              decoration: const BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: [Color(0xFF0F172A), Color(0xFF1E293B), Color(0xFF0F172A)],
                ),
              ),
            ),
            
            // Content
            SafeArea(
              child: Column(
                children: [
                  AuraAppBar(
                    title: "Medical Records", 
                    showBack: true, 
                    backgroundColor: Colors.transparent,
                  ),
                  
                  // Glass Tab Bar
                  Container(
                    margin: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
                    decoration: BoxDecoration(
                      color: Colors.white.withOpacity(0.05),
                      borderRadius: BorderRadius.circular(25),
                      border: Border.all(color: Colors.white.withOpacity(0.1)),
                    ),
                    child: TabBar(
                      indicator: BoxDecoration(
                        color: AppColors.primary.withOpacity(0.8),
                        borderRadius: BorderRadius.circular(25),
                        boxShadow: [BoxShadow(color: AppColors.primary.withOpacity(0.4), blurRadius: 10)]
                      ),
                      indicatorSize: TabBarIndicatorSize.tab,
                      labelColor: Colors.white,
                      unselectedLabelColor: Colors.white54,
                      dividerColor: Colors.transparent,
                      tabs: const [
                        Tab(text: "Timeline"),
                        Tab(text: "Reports"),
                      ],
                    ),
                  ),

                  Expanded(
                    child: _isLoading 
                      ? const Center(child: CupertinoActivityIndicator(color: AppColors.primary))
                      : TabBarView(
                          children: [
                            _buildTimelineTab(),
                            _buildReportsTab(),
                          ],
                        ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTimelineTab() {
    if (_history.isEmpty) return _buildEmptyState("No medical history found", CupertinoIcons.doc_text_search);
    
    return ListView.builder(
      padding: const EdgeInsets.all(20),
      itemCount: _history.length,
      itemBuilder: (context, index) {
        final item = _history[index];
        return _buildHistoryCard(item, index == _history.length - 1);
      },
    );
  }

  Widget _buildReportsTab() {
    if (_reports.isEmpty) return _buildEmptyState("No reports uploaded", CupertinoIcons.folder);

    return GridView.builder(
      padding: const EdgeInsets.all(20),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        crossAxisSpacing: 16,
        mainAxisSpacing: 16,
        childAspectRatio: 0.85,
      ),
      itemCount: _reports.length,
      itemBuilder: (context, index) => _buildReportCard(_reports[index]),
    );
  }

  Widget _buildEmptyState(String msg, IconData icon) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              color: Colors.white.withOpacity(0.05),
              shape: BoxShape.circle,
              border: Border.all(color: Colors.white.withOpacity(0.1)),
            ),
            child: Icon(icon, size: 48, color: Colors.white38),
          ),
          const SizedBox(height: 16),
          Text(msg, style: AppTypography.titleLarge.copyWith(color: Colors.white54)),
        ],
      ),
    );
  }

  Widget _buildHistoryCard(Map<String, dynamic> item, bool isLast) {
    return IntrinsicHeight(
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Column(
            children: [
              Container(
                width: 12, height: 12,
                decoration: const BoxDecoration(color: AppColors.primary, shape: BoxShape.circle, boxShadow: [BoxShadow(color: AppColors.primary, blurRadius: 5)]),
              ),
              if (!isLast)
                Expanded(child: Container(width: 2, color: Colors.white10))
            ],
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Padding(
              padding: const EdgeInsets.only(bottom: 24),
              child: ClipRRect(
                borderRadius: BorderRadius.circular(16),
                child: BackdropFilter(
                  filter: ui.ImageFilter.blur(sigmaX: 10, sigmaY: 10),
                  child: Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: Colors.white.withOpacity(0.05),
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: Colors.white.withOpacity(0.1)),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(item['type'] ?? "Note", style: AppTypography.titleMedium.copyWith(color: AppColors.primary, fontWeight: FontWeight.bold)),
                            Text(item['date'] ?? "", style: AppTypography.bodySmall.copyWith(color: Colors.white38)),
                          ],
                        ),
                        const SizedBox(height: 8),
                        Text(item['note'] ?? "", style: AppTypography.bodyMedium.copyWith(color: Colors.white70)),
                      ],
                    ),
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildReportCard(Map<String, dynamic> report) {
    final isPdf = report['type'] == 'PDF';
    final isImage = report['type'] == 'IMAGE';
    final icon = isPdf ? CupertinoIcons.doc_fill : (isImage ? CupertinoIcons.photo_fill : CupertinoIcons.doc);
    final color = isPdf ? AppColors.error : (isImage ? AppColors.accent : AppColors.primary);

    return GestureDetector(
      onTap: () {
        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text("Opening report...")));
      },
      child: ClipRRect(
        borderRadius: BorderRadius.circular(20),
        child: BackdropFilter(
          filter: ui.ImageFilter.blur(sigmaX: 5, sigmaY: 5),
          child: Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.white.withOpacity(0.05),
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: Colors.white.withOpacity(0.1)),
            ),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: color.withOpacity(0.15),
                    shape: BoxShape.circle,
                  ),
                  child: Icon(icon, color: color, size: 32),
                ),
                const SizedBox(height: 12),
                Text(report['name'] ?? "File", 
                   style: AppTypography.bodyMedium.copyWith(color: Colors.white, fontWeight: FontWeight.bold),
                   textAlign: TextAlign.center,
                   maxLines: 2,
                   overflow: TextOverflow.ellipsis,
                ),
                const SizedBox(height: 4),
                Text(report['size'] ?? "Unknown size", style: const TextStyle(color: Colors.white38, fontSize: 10)),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
