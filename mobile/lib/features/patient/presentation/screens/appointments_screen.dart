import 'package:flutter/material.dart';
import 'package:flutter/cupertino.dart';
import 'dart:ui' as ui;
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_typography.dart';
import '../../../../services/api_service.dart';
import 'book_appointment_screen.dart';

class AppointmentsScreen extends StatefulWidget {
  const AppointmentsScreen({super.key});

  @override
  State<AppointmentsScreen> createState() => _AppointmentsScreenState();
}

class _AppointmentsScreenState extends State<AppointmentsScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;
  List<Map<String, dynamic>> _appointments = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
    _loadAppointments();
  }

  Future<void> _loadAppointments() async {
    final patientId = await ApiService().getPatientId();
    if (patientId != null) {
      final appointments = await ApiService().getAppointments(patientId);
      if (mounted) {
        setState(() {
          _appointments = appointments.cast<Map<String, dynamic>>();
          _isLoading = false;
        });
      }
    }
  }

  List<Map<String, dynamic>> get _upcomingAppointments {
    final now = DateTime.now();
    return _appointments.where((apt) {
      final dateTime = DateTime.parse(apt['dateTime']);
      return dateTime.isAfter(now) && apt['status'] != 'cancelled';
    }).toList()..sort((a, b) => DateTime.parse(a['dateTime']).compareTo(DateTime.parse(b['dateTime'])));
  }

  List<Map<String, dynamic>> get _pastAppointments {
    final now = DateTime.now();
    return _appointments.where((apt) {
      final dateTime = DateTime.parse(apt['dateTime']);
      return dateTime.isBefore(now) || apt['status'] == 'cancelled' || apt['status'] == 'completed';
    }).toList()..sort((a, b) => DateTime.parse(b['dateTime']).compareTo(DateTime.parse(a['dateTime'])));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      extendBodyBehindAppBar: true,
      body: Stack(
        children: [
          // Background
          Container(
            decoration: const BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [Color(0xFF0F172A), Color(0xFF1E293B), Color(0xFF0F172A)],
              ),
            ),
          ),

          SafeArea(
            child: Column(
              children: [
                // Header
                Padding(
                  padding: const EdgeInsets.all(20),
                  child: Row(
                    children: [
                      IconButton(
                        icon: const Icon(CupertinoIcons.back, color: Colors.white),
                        onPressed: () => Navigator.pop(context),
                      ),
                      const SizedBox(width: 8),
                      Text("Appointments", style: AppTypography.headlineMedium.copyWith(color: Colors.white, fontWeight: FontWeight.bold)),
                    ],
                  ),
                ),

                // Glass Tab Bar
                Container(
                  margin: const EdgeInsets.symmetric(horizontal: 20),
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
                    ),
                    indicatorSize: TabBarIndicatorSize.tab,
                    labelColor: AppColors.primary,
                    unselectedLabelColor: Colors.white54,
                    dividerColor: Colors.transparent,
                    tabs: const [
                      Tab(text: "Upcoming"),
                      Tab(text: "Past"),
                    ],
                  ),
                ),

                const SizedBox(height: 20),

                // Content
                Expanded(
                  child: _isLoading
                      ? const Center(child: CupertinoActivityIndicator(color: AppColors.primary))
                      : TabBarView(
                          controller: _tabController,
                          children: [
                            _buildAppointmentsList(_upcomingAppointments, isUpcoming: true),
                            _buildAppointmentsList(_pastAppointments, isUpcoming: false),
                          ],
                        ),
                ),
              ],
            ),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () async {
          await Navigator.push(
            context,
            MaterialPageRoute(builder: (_) => const BookAppointmentScreen()),
          );
          _loadAppointments();
        },
        backgroundColor: AppColors.primary,
        icon: const Icon(CupertinoIcons.add, color: Colors.white),
        label: const Text("Book", style: TextStyle(color: Colors.white)),
      ),
    );
  }

  Widget _buildAppointmentsList(List<Map<String, dynamic>> appointments, {required bool isUpcoming}) {
    if (appointments.isEmpty) {
      return Center(
        child: Text(
          isUpcoming ? "No upcoming appointments" : "No past appointments",
          style: const TextStyle(color: Colors.white38),
        ),
      );
    }

    return ListView.builder(
      padding: const EdgeInsets.all(20),
      itemCount: appointments.length,
      itemBuilder: (context, index) => _buildAppointmentCard(appointments[index], isUpcoming),
    );
  }

  Widget _buildAppointmentCard(Map<String, dynamic> appointment, bool isUpcoming) {
    final dateTime = DateTime.parse(appointment['dateTime']);
    final doctor = appointment['doctor'];
    final status = appointment['status'];

    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(20),
        child: BackdropFilter(
          filter: ui.ImageFilter.blur(sigmaX: 10, sigmaY: 10),
          child: Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: Colors.white.withOpacity(0.05),
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: Colors.white.withOpacity(0.1)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: AppColors.primary.withOpacity(0.2),
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(CupertinoIcons.person_fill, color: AppColors.primary, size: 24),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(doctor['name'] ?? 'Doctor', 
                              style: AppTypography.titleMedium.copyWith(color: Colors.white, fontWeight: FontWeight.bold)),
                          Text(doctor['specialty'] ?? '', style: const TextStyle(color: Colors.white54, fontSize: 12)),
                        ],
                      ),
                    ),
                    _buildStatusChip(status),
                  ],
                ),
                
                const SizedBox(height: 16),
                const Divider(color: Colors.white10),
                const SizedBox(height: 12),

                Row(
                  children: [
                    const Icon(CupertinoIcons.calendar, color: Colors.white54, size: 16),
                    const SizedBox(width: 8),
                    Text(
                      "${dateTime.day}/${dateTime.month}/${dateTime.year}",
                      style: const TextStyle(color: Colors.white70),
                    ),
                    const SizedBox(width: 20),
                    const Icon(CupertinoIcons.clock, color: Colors.white54, size: 16),
                    const SizedBox(width: 8),
                    Text(
                      "${dateTime.hour}:${dateTime.minute.toString().padLeft(2, '0')}",
                      style: const TextStyle(color: Colors.white70),
                    ),
                  ],
                ),

                if (appointment['notes'] != null) ...[
                  const SizedBox(height: 12),
                  Text(appointment['notes'], style: const TextStyle(color: Colors.white54, fontSize: 12)),
                ],

                if (isUpcoming && status == 'scheduled') ...[
                  const SizedBox(height: 16),
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton(
                      onPressed: () async {
                        await ApiService().cancelAppointment(appointment['id']);
                        _loadAppointments();
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppColors.error,
                        foregroundColor: Colors.white,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      ),
                      child: const Text("Cancel Appointment"),
                    ),
                  ),
                ],
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildStatusChip(String status) {
    Color color;
    switch (status) {
      case 'scheduled':
        color = AppColors.primary;
        break;
      case 'completed':
        color = AppColors.success;
        break;
      case 'cancelled':
        color = AppColors.error;
        break;
      default:
        color = Colors.grey;
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        color: color.withOpacity(0.2),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: color.withOpacity(0.5)),
      ),
      child: Text(
        status.toUpperCase(),
        style: TextStyle(color: color, fontSize: 10, fontWeight: FontWeight.bold),
      ),
    );
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }
}
