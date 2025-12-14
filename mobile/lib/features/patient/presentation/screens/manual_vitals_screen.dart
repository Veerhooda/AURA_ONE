import 'package:flutter/material.dart';
import 'package:flutter/cupertino.dart';
import 'dart:ui' as ui;
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_typography.dart';
import '../../../../services/api_service.dart';

class ManualVitalsScreen extends StatefulWidget {
  const ManualVitalsScreen({super.key});

  @override
  State<ManualVitalsScreen> createState() => _ManualVitalsScreenState();
}

class _ManualVitalsScreenState extends State<ManualVitalsScreen> {
  final TextEditingController _hrController = TextEditingController();
  final TextEditingController _spo2Controller = TextEditingController();
  final TextEditingController _tempController = TextEditingController();
  final TextEditingController _bpSysController = TextEditingController();
  final TextEditingController _bpDiaController = TextEditingController();
  final TextEditingController _weightController = TextEditingController();
  bool _isSubmitting = false;

  Future<void> _submitVitals() async {
    final patientId = await ApiService().getPatientId();
    if (patientId == null) return;

    setState(() => _isSubmitting = true);

    try {
      // Submit each vital if entered
      if (_hrController.text.isNotEmpty) {
        await ApiService().addManualVital(
          patientId: patientId,
          type: 'heart_rate',
          value: double.parse(_hrController.text),
          unit: 'bpm',
        );
      }

      if (_spo2Controller.text.isNotEmpty) {
        await ApiService().addManualVital(
          patientId: patientId,
          type: 'spo2',
          value: double.parse(_spo2Controller.text),
          unit: '%',
        );
      }

      if (_tempController.text.isNotEmpty) {
        await ApiService().addManualVital(
          patientId: patientId,
          type: 'temperature',
          value: double.parse(_tempController.text),
          unit: '°F',
        );
      }

      if (_bpSysController.text.isNotEmpty && _bpDiaController.text.isNotEmpty) {
        await ApiService().addManualVital(
          patientId: patientId,
          type: 'blood_pressure_systolic',
          value: double.parse(_bpSysController.text),
          unit: 'mmHg',
        );
        await ApiService().addManualVital(
          patientId: patientId,
          type: 'blood_pressure_diastolic',
          value: double.parse(_bpDiaController.text),
          unit: 'mmHg',
        );
      }

      if (_weightController.text.isNotEmpty) {
        await ApiService().addManualVital(
          patientId: patientId,
          type: 'weight',
          value: double.parse(_weightController.text),
          unit: 'kg',
        );
      }

      if (mounted) {
        Navigator.pop(context);
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text("Vitals recorded successfully!")),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text("Error: $e")),
        );
      }
    } finally {
      if (mounted) setState(() => _isSubmitting = false);
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
                      Text("Log Vitals", style: AppTypography.headlineMedium.copyWith(color: Colors.white, fontWeight: FontWeight.bold)),
                    ],
                  ),
                ),

                // Content
                Expanded(
                  child: ListView(
                    padding: const EdgeInsets.all(20),
                    children: [
                      Text("Enter your current vital signs", style: const TextStyle(color: Colors.white54, fontSize: 14)),
                      const SizedBox(height: 24),

                      _buildVitalInput(
                        controller: _hrController,
                        label: "Heart Rate",
                        unit: "bpm",
                        icon: CupertinoIcons.heart_fill,
                        color: AppColors.error,
                        hint: "e.g., 72",
                      ),

                      const SizedBox(height: 16),

                      _buildVitalInput(
                        controller: _spo2Controller,
                        label: "Oxygen Level (SpO2)",
                        unit: "%",
                        icon: CupertinoIcons.drop_fill,
                        color: AppColors.info,
                        hint: "e.g., 98",
                      ),

                      const SizedBox(height: 16),

                      _buildVitalInput(
                        controller: _tempController,
                        label: "Temperature",
                        unit: "°F",
                        icon: CupertinoIcons.thermometer,
                        color: AppColors.warning,
                        hint: "e.g., 98.6",
                      ),

                      const SizedBox(height: 16),

                      _buildBloodPressureInput(),

                      const SizedBox(height: 16),

                      _buildVitalInput(
                        controller: _weightController,
                        label: "Weight",
                        unit: "kg",
                        icon: CupertinoIcons.graph_square_fill,
                        color: AppColors.success,
                        hint: "e.g., 70",
                      ),

                      const SizedBox(height: 32),

                      // Submit Button
                      SizedBox(
                        width: double.infinity,
                        height: 56,
                        child: ElevatedButton(
                          onPressed: _isSubmitting ? null : _submitVitals,
                          style: ElevatedButton.styleFrom(
                            backgroundColor: AppColors.primary,
                            foregroundColor: Colors.white,
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                          ),
                          child: _isSubmitting
                              ? const CupertinoActivityIndicator(color: Colors.white)
                              : const Text("Save Vitals", style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
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

  Widget _buildVitalInput({
    required TextEditingController controller,
    required String label,
    required String unit,
    required IconData icon,
    required Color color,
    required String hint,
  }) {
    return ClipRRect(
      borderRadius: BorderRadius.circular(16),
      child: BackdropFilter(
        filter: ui.ImageFilter.blur(sigmaX: 10, sigmaY: 10),
        child: Container(
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            color: Colors.white.withOpacity(0.05),
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: Colors.white.withOpacity(0.1)),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(8),
                    decoration: BoxDecoration(
                      color: color.withOpacity(0.2),
                      shape: BoxShape.circle,
                    ),
                    child: Icon(icon, color: color, size: 20),
                  ),
                  const SizedBox(width: 12),
                  Text(label, style: AppTypography.titleMedium.copyWith(color: Colors.white)),
                ],
              ),
              const SizedBox(height: 12),
              TextField(
                controller: controller,
                keyboardType: const TextInputType.numberWithOptions(decimal: true),
                style: const TextStyle(color: Colors.white, fontSize: 18),
                decoration: InputDecoration(
                  hintText: hint,
                  suffixText: unit,
                  suffixStyle: const TextStyle(color: Colors.white54),
                  hintStyle: const TextStyle(color: Colors.white38),
                  border: InputBorder.none,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildBloodPressureInput() {
    return ClipRRect(
      borderRadius: BorderRadius.circular(16),
      child: BackdropFilter(
        filter: ui.ImageFilter.blur(sigmaX: 10, sigmaY: 10),
        child: Container(
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            color: Colors.white.withOpacity(0.05),
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: Colors.white.withOpacity(0.1)),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(8),
                    decoration: BoxDecoration(
                      color: AppColors.accent.withOpacity(0.2),
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(CupertinoIcons.waveform_path_ecg, color: AppColors.accent, size: 20),
                  ),
                  const SizedBox(width: 12),
                  Text("Blood Pressure", style: AppTypography.titleMedium.copyWith(color: Colors.white)),
                ],
              ),
              const SizedBox(height: 12),
              Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: _bpSysController,
                      keyboardType: const TextInputType.numberWithOptions(decimal: true),
                      style: const TextStyle(color: Colors.white, fontSize: 18),
                      decoration: const InputDecoration(
                        hintText: "120",
                        hintStyle: TextStyle(color: Colors.white38),
                        border: InputBorder.none,
                        labelText: "Systolic",
                        labelStyle: TextStyle(color: Colors.white54, fontSize: 12),
                      ),
                    ),
                  ),
                  const Text(" / ", style: TextStyle(color: Colors.white54, fontSize: 20)),
                  Expanded(
                    child: TextField(
                      controller: _bpDiaController,
                      keyboardType: const TextInputType.numberWithOptions(decimal: true),
                      style: const TextStyle(color: Colors.white, fontSize: 18),
                      decoration: const InputDecoration(
                        hintText: "80",
                        hintStyle: TextStyle(color: Colors.white38),
                        border: InputBorder.none,
                        labelText: "Diastolic",
                        labelStyle: TextStyle(color: Colors.white54, fontSize: 12),
                      ),
                    ),
                  ),
                  const SizedBox(width: 8),
                  const Text("mmHg", style: TextStyle(color: Colors.white54)),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  @override
  void dispose() {
    _hrController.dispose();
    _spo2Controller.dispose();
    _tempController.dispose();
    _bpSysController.dispose();
    _bpDiaController.dispose();
    _weightController.dispose();
    super.dispose();
  }
}
