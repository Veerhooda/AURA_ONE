import 'package:flutter/material.dart';
import 'package:flutter/cupertino.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_typography.dart';

class VisionStubScreen extends StatefulWidget {
  final String mode; // 'medication' or 'pain'

  const VisionStubScreen({super.key, required this.mode});

  @override
  State<VisionStubScreen> createState() => _VisionStubScreenState();
}

class _VisionStubScreenState extends State<VisionStubScreen> {
  bool _isAnalyzing = false;
  String? _result;

  void _analyze() async {
    setState(() {
      _isAnalyzing = true;
      _result = null;
    });

    // Simulate API delay
    await Future.delayed(const Duration(seconds: 2));

    // Stubs for now since we can't really upload images from a simulator easily without file picker
    // In real app: await ApiService().detectPain(...)
    
    setState(() {
      _isAnalyzing = false;
      if (widget.mode == 'medication') {
        _result = "Identified: Metformin 500mg\nConfidence: 98%\nDosage: 1 Tablet twice daily";
      } else {
        _result = "Pain Level: 2 (Mild)\nEmotion: Neutral\nRecommendation: Monitor";
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      appBar: AppBar(
        title: Text(widget.mode == 'medication' ? "Medication Scanner" : "Pain Detector"),
        backgroundColor: Colors.transparent,
        iconTheme: const IconThemeData(color: Colors.white),
      ),
      body: Column(
        children: [
          // Camera Viewfinder Stub
          Expanded(
            child: Container(
              margin: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.grey[900],
                borderRadius: BorderRadius.circular(24),
                border: Border.all(color: AppColors.primary, width: 2),
              ),
              child: Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(CupertinoIcons.camera_viewfinder, size: 64, color: AppColors.primary.withOpacity(0.5)),
                    const SizedBox(height: 16),
                    Text("Point camera at subject", style: AppTypography.bodyMedium),
                  ],
                ),
              ),
            ),
          ),
          
          // Result Panel
          if (_result != null)
            Container(
              padding: const EdgeInsets.all(24),
              width: double.infinity,
              color: AppColors.surface,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text("Analysis Result", style: AppTypography.titleMedium.copyWith(color: AppColors.textSecondary)),
                  const SizedBox(height: 8),
                  Text(_result!, style: AppTypography.headlineMedium.copyWith(fontSize: 20)),
                ],
              ),
            ),

          // Action Button
          Padding(
            padding: const EdgeInsets.all(24.0),
            child: SizedBox(
               width: double.infinity,
               child: ElevatedButton(
                 onPressed: _isAnalyzing ? null : _analyze,
                 style: ElevatedButton.styleFrom(
                   backgroundColor: AppColors.primary,
                   padding: const EdgeInsets.symmetric(vertical: 20),
                   shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                 ),
                 child: _isAnalyzing 
                   ? const CircularProgressIndicator(color: Colors.white)
                   : Text("Capture & Analyze", style: AppTypography.titleLarge.copyWith(color: Colors.black)),
               ),
            ),
          ),
        ],
      ),
    );
  }
}
