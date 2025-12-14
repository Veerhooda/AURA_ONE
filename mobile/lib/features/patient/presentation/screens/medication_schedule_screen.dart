import 'package:flutter/material.dart';
import 'package:flutter/cupertino.dart';
import 'dart:ui' as ui;
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_typography.dart';
import '../../../../services/api_service.dart';
import '../../../../services/notification_service.dart';
import 'package:shared_preferences/shared_preferences.dart';

class MedicationScheduleScreen extends StatefulWidget {
  const MedicationScheduleScreen({super.key});

  @override
  State<MedicationScheduleScreen> createState() => _MedicationScheduleScreenState();
}

class _MedicationScheduleScreenState extends State<MedicationScheduleScreen> {
  List<Map<String, dynamic>> _medications = [];
  Map<int, TimeOfDay?> _scheduledTimes = {};
  Map<int, bool> _remindersEnabled = {};
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadMedications();
    _loadSchedules();
  }

  Future<void> _loadMedications() async {
    final patientId = await ApiService().getPatientId();
    if (patientId != null) {
      final meds = await ApiService().getPatientMedications(patientId);
      if (mounted) {
        setState(() {
          _medications = meds.cast<Map<String, dynamic>>();
          _isLoading = false;
        });
      }
    }
  }

  Future<void> _loadSchedules() async {
    final prefs = await SharedPreferences.getInstance();
    for (var med in _medications) {
      final id = med['id'] as int;
      final timeStr = prefs.getString('med_time_$id');
      final enabled = prefs.getBool('med_reminder_$id') ?? false;
      
      if (timeStr != null) {
        final parts = timeStr.split(':');
        _scheduledTimes[id] = TimeOfDay(hour: int.parse(parts[0]), minute: int.parse(parts[1]));
      }
      _remindersEnabled[id] = enabled;
    }
    if (mounted) setState(() {});
  }

  Future<void> _setReminderTime(int medId, String medName, String dosage) async {
    final currentTime = _scheduledTimes[medId] ?? TimeOfDay.now();
    
    final pickedTime = await showTimePicker(
      context: context,
      initialTime: currentTime,
      builder: (context, child) {
        return Theme(
          data: ThemeData.dark().copyWith(
            colorScheme: ColorScheme.dark(
              primary: AppColors.primary,
              surface: const Color(0xFF1E293B),
            ),
          ),
          child: child!,
        );
      },
    );

    if (pickedTime != null) {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('med_time_$medId', '${pickedTime.hour}:${pickedTime.minute}');
      
      setState(() {
        _scheduledTimes[medId] = pickedTime;
      });

      // Schedule notification if enabled
      if (_remindersEnabled[medId] == true) {
        final now = DateTime.now();
        final scheduledDateTime = DateTime(
          now.year, now.month, now.day,
          pickedTime.hour, pickedTime.minute,
        );
        
        await NotificationService().scheduleMedicationReminder(
          id: medId,
          medicationName: medName,
          dosage: dosage,
          scheduledTime: scheduledDateTime,
        );

        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('Reminder set for ${pickedTime.format(context)}')),
          );
        }
      }
    }
  }

  Future<void> _toggleReminder(int medId, String medName, String dosage) async {
    final newState = !(_remindersEnabled[medId] ?? false);
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool('med_reminder_$medId', newState);

    setState(() {
      _remindersEnabled[medId] = newState;
    });

    if (newState && _scheduledTimes[medId] != null) {
      // Enable reminder
      final time = _scheduledTimes[medId]!;
      final now = DateTime.now();
      final scheduledDateTime = DateTime(
        now.year, now.month, now.day,
        time.hour, time.minute,
      );
      
      await NotificationService().scheduleMedicationReminder(
        id: medId,
        medicationName: medName,
        dosage: dosage,
        scheduledTime: scheduledDateTime,
      );
    } else {
      // Disable reminder
      await NotificationService().cancelReminder(medId);
    }
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
              crossAxisAlignment: CrossAxisAlignment.start,
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
                      Text("Medication Schedule", 
                          style: AppTypography.headlineMedium.copyWith(color: Colors.white, fontWeight: FontWeight.bold)),
                    ],
                  ),
                ),

                // Content
                Expanded(
                  child: _isLoading
                      ? const Center(child: CupertinoActivityIndicator(color: AppColors.primary))
                      : _medications.isEmpty
                          ? Center(child: Text("No medications prescribed", style: TextStyle(color: Colors.white38)))
                          : ListView.builder(
                              padding: const EdgeInsets.all(20),
                              itemCount: _medications.length,
                              itemBuilder: (context, index) {
                                final med = _medications[index];
                                return _buildMedicationCard(med);
                              },
                            ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildMedicationCard(Map<String, dynamic> med) {
    final medId = med['id'] as int;
    final name = med['name'] ?? 'Medication';
    final dosage = med['dosage'] ?? 'As prescribed';
    final scheduledTime = _scheduledTimes[medId];
    final reminderEnabled = _remindersEnabled[medId] ?? false;

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
                      child: const Icon(CupertinoIcons.doc_fill, color: AppColors.primary, size: 24),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(name, style: AppTypography.titleMedium.copyWith(color: Colors.white, fontWeight: FontWeight.bold)),
                          Text(dosage, style: const TextStyle(color: Colors.white54, fontSize: 12)),
                        ],
                      ),
                    ),
                  ],
                ),
                
                const SizedBox(height: 16),
                const Divider(color: Colors.white10),
                const SizedBox(height: 16),

                // Time Picker
                Row(
                  children: [
                    const Icon(CupertinoIcons.clock, color: Colors.white54, size: 20),
                    const SizedBox(width: 8),
                    Text("Schedule:", style: TextStyle(color: Colors.white70)),
                    const Spacer(),
                    GestureDetector(
                      onTap: () => _setReminderTime(medId, name, dosage),
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                        decoration: BoxDecoration(
                          color: AppColors.primary.withOpacity(0.2),
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: AppColors.primary.withOpacity(0.5)),
                        ),
                        child: Text(
                          scheduledTime != null ? scheduledTime.format(context) : 'Set Time',
                          style: const TextStyle(color: AppColors.primary, fontWeight: FontWeight.bold),
                        ),
                      ),
                    ),
                  ],
                ),

                const SizedBox(height: 12),

                // Reminder Toggle
                Row(
                  children: [
                    const Icon(CupertinoIcons.bell_fill, color: Colors.white54, size: 20),
                    const SizedBox(width: 8),
                    Text("Daily Reminder:", style: TextStyle(color: Colors.white70)),
                    const Spacer(),
                    CupertinoSwitch(
                      value: reminderEnabled,
                      activeColor: AppColors.primary,
                      onChanged: scheduledTime != null 
                          ? (val) => _toggleReminder(medId, name, dosage)
                          : null,
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
