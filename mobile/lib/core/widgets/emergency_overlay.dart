import 'package:flutter/material.dart';
import 'package:flutter/cupertino.dart';
import 'dart:ui';
import 'package:audioplayers/audioplayers.dart';
import '../../../../services/socket_service.dart';

class EmergencyOverlay extends StatefulWidget {
  final Widget child;
  const EmergencyOverlay({super.key, required this.child});

  @override
  State<EmergencyOverlay> createState() => _EmergencyOverlayState();
}

class _EmergencyOverlayState extends State<EmergencyOverlay> {
  // Emergency State
  bool _isEmergencyActive = false;
  String _emergencyRoom = "";
  final AudioPlayer _player = AudioPlayer();

  @override
  void initState() {
    super.initState();
    // Listen to emergency stream
    SocketService().emergencyStream.listen((data) {
      if (mounted) {
        _triggerEmergency(data['room'] ?? "Unknown");
      }
    });
  }

  void _triggerEmergency(String room) async {
    setState(() {
      _isEmergencyActive = true;
      _emergencyRoom = room;
    });

    // Play loop alarm using a web source for immediate testing
    try {
      _player.setReleaseMode(ReleaseMode.loop);
      // Using a generic medical alarm sound URL
      await _player.play(UrlSource('https://assets.mixkit.co/active_storage/sfx/995/995-preview.mp3'));
    } catch (e) {
      print("Error playing alarm sound: $e");
    }
  }

  void _dismiss() {
    setState(() {
      _isEmergencyActive = false;
    });
    _player.stop();
  }

  @override
  void dispose() {
    _player.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        widget.child,
        
        // The Overlay
        if (_isEmergencyActive)
          Positioned(
            top: 60,
            left: 20,
            right: 20,
            child: Material(
              color: Colors.transparent,
              child: ClipRRect(
                borderRadius: BorderRadius.circular(50), // Pill shape
                child: BackdropFilter(
                  filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
                    decoration: BoxDecoration(
                      color: const Color(0xFFFF3B30).withOpacity(0.9), // iOS Red
                      borderRadius: BorderRadius.circular(50),
                      boxShadow: [
                         BoxShadow(
                           color: Colors.red.withOpacity(0.4),
                           blurRadius: 20,
                           spreadRadius: 2,
                           offset: const Offset(0, 8),
                         )
                      ]
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Row(
                          children: [
                            Container(
                               padding: const EdgeInsets.all(8),
                               decoration: const BoxDecoration(color: Colors.white, shape: BoxShape.circle),
                               child: const Icon(CupertinoIcons.exclamationmark_triangle_fill, color: Color(0xFFFF3B30), size: 20),
                            ),
                            const SizedBox(width: 16),
                            Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                const Text("EMERGENCY", style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 12, letterSpacing: 1.2)),
                                Text("Room $_emergencyRoom - CRITICAL", style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16)),
                              ],
                            ),
                          ],
                        ),
                        // Dismiss Button
                        IconButton(
                          onPressed: _dismiss,
                          icon: const Icon(CupertinoIcons.xmark_circle_fill, color: Colors.white, size: 28),
                        )
                      ],
                    ),
                  ),
                ),
              ),
            ),
          ),
      ],
    );
  }
}
