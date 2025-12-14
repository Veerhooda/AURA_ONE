import 'package:flutter/material.dart';
import 'package:flutter/cupertino.dart';
import 'dart:ui' as ui;
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_typography.dart';
import '../../../../services/api_service.dart';

class BookAppointmentScreen extends StatefulWidget {
  const BookAppointmentScreen({super.key});

  @override
  State<BookAppointmentScreen> createState() => _BookAppointmentScreenState();
}

class _BookAppointmentScreenState extends State<BookAppointmentScreen> {
  List<Map<String, dynamic>> _doctors = [];
  int? _selectedDoctorId;
  DateTime? _selectedDate;
  String? _selectedTimeSlot;
  String _appointmentType = 'consultation';
  final TextEditingController _notesController = TextEditingController();
  bool _isLoading = false;

  @override
  void initState() {
    super.initState();
    _loadDoctors();
  }

  Future<void> _loadDoctors() async {
    final doctors = await ApiService().getAllDoctors();
    if (mounted) {
      setState(() {
        _doctors = doctors.cast<Map<String, dynamic>>();
      });
    }
  }

  Future<void> _bookAppointment() async {
    if (_selectedDoctorId == null || _selectedDate == null || _selectedTimeSlot == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Please select doctor, date, and time")),
      );
      return;
    }

    setState(() => _isLoading = true);

    try {
      final patientId = await ApiService().getPatientId();
      if (patientId != null) {
        await ApiService().bookAppointment(
          patientId: patientId,
          doctorId: _selectedDoctorId!,
          dateTime: _selectedTimeSlot!,
          type: _appointmentType,
          notes: _notesController.text.isEmpty ? null : _notesController.text,
        );

        if (mounted) {
          Navigator.pop(context);
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text("Appointment booked successfully!")),
          );
        }
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text("Error: $e")),
        );
      }
    } finally {
      if (mounted) setState(() => _isLoading = false);
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
                      Text("Book Appointment", style: AppTypography.headlineMedium.copyWith(color: Colors.white, fontWeight: FontWeight.bold)),
                    ],
                  ),
                ),

                // Content
                Expanded(
                  child: ListView(
                    padding: const EdgeInsets.all(20),
                    children: [
                      // Doctor Selection
                      _buildSectionTitle("Select Doctor"),
                      const SizedBox(height: 12),
                      _buildGlassDropdown(
                        value: _selectedDoctorId,
                        items: _doctors.map((doctor) => DropdownMenuItem<int>(
                          value: doctor['id'],
                          child: Text("${doctor['name']} - ${doctor['specialty']}", style: const TextStyle(color: Colors.white)),
                        )).toList(),
                        onChanged: (val) => setState(() => _selectedDoctorId = val),
                        hint: "Choose a doctor",
                      ),

                      const SizedBox(height: 24),

                      // Date Selection
                      _buildSectionTitle("Select Date"),
                      const SizedBox(height: 12),
                      _buildGlassButton(
                        label: _selectedDate != null 
                            ? "${_selectedDate!.day}/${_selectedDate!.month}/${_selectedDate!.year}"
                            : "Pick a date",
                        icon: CupertinoIcons.calendar,
                        onTap: () async {
                          final date = await showDatePicker(
                            context: context,
                            initialDate: DateTime.now(),
                            firstDate: DateTime.now(),
                            lastDate: DateTime.now().add(const Duration(days: 90)),
                            builder: (context, child) {
                              return Theme(
                                data: ThemeData.dark().copyWith(
                                  colorScheme: ColorScheme.dark(primary: AppColors.primary),
                                ),
                                child: child!,
                              );
                            },
                          );
                          if (date != null) {
                            setState(() {
                              _selectedDate = date;
                              _selectedTimeSlot = null;
                            });
                          }
                        },
                      ),

                      const SizedBox(height: 24),

                      // Time Slot (only if date selected)
                      if (_selectedDate != null && _selectedDoctorId != null) ...[
                        _buildSectionTitle("Select Time"),
                        const SizedBox(height: 12),
                        _buildTimeSlotSelector(),
                        const SizedBox(height: 24),
                      ],

                      // Appointment Type
                      _buildSectionTitle("Appointment Type"),
                      const SizedBox(height: 12),
                      _buildTypeChips(),

                      const SizedBox(height: 24),

                      // Notes
                      _buildSectionTitle("Notes (Optional)"),
                      const SizedBox(height: 12),
                      _buildNotesField(),

                      const SizedBox(height: 32),

                      // Book Button
                      SizedBox(
                        width: double.infinity,
                        height: 56,
                        child: ElevatedButton(
                          onPressed: _isLoading ? null : _bookAppointment,
                          style: ElevatedButton.styleFrom(
                            backgroundColor: AppColors.primary,
                            foregroundColor: Colors.white,
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                          ),
                          child: _isLoading 
                              ? const CupertinoActivityIndicator(color: Colors.white)
                              : const Text("Book Appointment", style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSectionTitle(String title) {
    return Text(title, style: AppTypography.titleMedium.copyWith(color: Colors.white, fontWeight: FontWeight.bold));
  }

  Widget _buildGlassDropdown({
    required int? value,
    required List<DropdownMenuItem<int>> items,
    required ValueChanged<int?> onChanged,
    required String hint,
  }) {
    return ClipRRect(
      borderRadius: BorderRadius.circular(16),
      child: BackdropFilter(
        filter: ui.ImageFilter.blur(sigmaX: 10, sigmaY: 10),
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 16),
          decoration: BoxDecoration(
            color: Colors.white.withOpacity(0.05),
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: Colors.white.withOpacity(0.1)),
          ),
          child: DropdownButtonHideUnderline(
            child: DropdownButton<int>(
              value: value,
              items: items,
              onChanged: onChanged,
              isExpanded: true,
              hint: Text(hint, style: const TextStyle(color: Colors.white38)),
              dropdownColor: const Color(0xFF1E293B),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildGlassButton({required String label, required IconData icon, required VoidCallback onTap}) {
    return GestureDetector(
      onTap: onTap,
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
            child: Row(
              children: [
                Icon(icon, color: AppColors.primary),
                const SizedBox(width: 12),
                Text(label, style: const TextStyle(color: Colors.white)),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildTimeSlotSelector() {
    // Mock time slots (9 AM - 5 PM)
    final slots = List.generate(8, (i) {
      final hour = 9 + i;
      final DateTime slotTime = DateTime(_selectedDate!.year, _selectedDate!.month, _selectedDate!.day, hour);
      return slotTime.toIso8601String();
    });

    return Wrap(
      spacing: 12,
      runSpacing: 12,
      children: slots.map((slot) {
        final time = DateTime.parse(slot);
        final isSelected = _selectedTimeSlot == slot;
        return GestureDetector(
          onTap: () => setState(() => _selectedTimeSlot = slot),
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
            decoration: BoxDecoration(
              color: isSelected ? AppColors.primary.withOpacity(0.3) : Colors.white.withOpacity(0.05),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: isSelected ? AppColors.primary : Colors.white.withOpacity(0.1)),
            ),
            child: Text(
              "${time.hour}:00",
              style: TextStyle(color: isSelected ? AppColors.primary : Colors.white70, fontWeight: FontWeight.bold),
            ),
          ),
        );
      }).toList(),
    );
  }

  Widget _buildTypeChips() {
    final types = ['consultation', 'follow-up', 'emergency'];
    return Wrap(
      spacing: 12,
      children: types.map((type) {
        final isSelected = _appointmentType == type;
        return GestureDetector(
          onTap: () => setState(() => _appointmentType = type),
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
            decoration: BoxDecoration(
              color: isSelected ? AppColors.primary.withOpacity(0.3) : Colors.white.withOpacity(0.05),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: isSelected ? AppColors.primary : Colors.white.withOpacity(0.1)),
            ),
            child: Text(
              type.toUpperCase(),
              style: TextStyle(color: isSelected ? AppColors.primary : Colors.white70, fontSize: 12, fontWeight: FontWeight.bold),
            ),
          ),
        );
      }).toList(),
    );
  }

  Widget _buildNotesField() {
    return ClipRRect(
      borderRadius: BorderRadius.circular(16),
      child: BackdropFilter(
        filter: ui.ImageFilter.blur(sigmaX: 10, sigmaY: 10),
        child: Container(
          decoration: BoxDecoration(
            color: Colors.white.withOpacity(0.05),
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: Colors.white.withOpacity(0.1)),
          ),
          child: TextField(
            controller: _notesController,
            maxLines: 3,
            style: const TextStyle(color: Colors.white),
            decoration: const InputDecoration(
              hintText: "Any specific concerns or symptoms...",
              hintStyle: TextStyle(color: Colors.white38),
              border: InputBorder.none,
              contentPadding: EdgeInsets.all(16),
            ),
          ),
        ),
      ),
    );
  }

  @override
  void dispose() {
    _notesController.dispose();
    super.dispose();
  }
}
