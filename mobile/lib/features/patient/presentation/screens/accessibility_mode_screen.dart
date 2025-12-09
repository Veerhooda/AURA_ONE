import 'package:flutter/material.dart';
import 'package:flutter/cupertino.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_typography.dart';
import '../../../../core/widgets/aura_app_bar.dart';
import '../../../../core/widgets/aura_fab.dart';

class AccessibilityModeScreen extends StatefulWidget {
  const AccessibilityModeScreen({super.key});

  @override
  State<AccessibilityModeScreen> createState() => _AccessibilityModeScreenState();
}

class _AccessibilityModeScreenState extends State<AccessibilityModeScreen> {
  String _lastCommand = "Tap microphone to speak";
  bool _isListening = false;

  void _listen() {
    setState(() {
      _isListening = true;
      _lastCommand = "Listening...";
    });
    
    // Simulate voice processing delay
    Future.delayed(const Duration(seconds: 2), () {
      if (mounted) {
        setState(() {
          _isListening = false;
          _lastCommand = "I heard: 'Where is the bathroom?'\nGuidance: Walk forward 10 steps.";
        });
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    // High Contrast Theme Override
    return Scaffold(
      backgroundColor: Colors.black,
      appBar: AuraAppBar(
        title: Text("Blind Assist Mode", style: GoogleFonts.outfit(fontSize: 28, fontWeight: FontWeight.bold, color: Colors.yellow)),
        backgroundColor: Colors.black,
        iconTheme: const IconThemeData(color: Colors.yellow),
      ),
      body: Padding(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          children: [
            Expanded(
              child: Center(
                child: Text(
                  _lastCommand,
                  style: GoogleFonts.outfit(
                    fontSize: 32,
                    fontWeight: FontWeight.bold,
                    color: Colors.yellow,
                    height: 1.4,
                  ),
                  textAlign: TextAlign.center,
                ),
              ),
            ),
            const SizedBox(height: 32),
            GestureDetector(
              onTap: _listen,
              child: Container(
                width: double.infinity,
                height: 200,
                decoration: BoxDecoration(
                  color: Colors.yellow,
                  borderRadius: BorderRadius.circular(24),
                ),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(
                      _isListening ? CupertinoIcons.mic_fill : CupertinoIcons.mic,
                      size: 64,
                      color: Colors.black,
                    ),
                    const SizedBox(height: 16),
                    Text(
                      _isListening ? "Listening..." : "Tap to Speak",
                      style: GoogleFonts.outfit(
                        fontSize: 28,
                        fontWeight: FontWeight.w900,
                        color: Colors.black,
                      ),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 48),
          ],
        ),
      ),
    );
  }
}


