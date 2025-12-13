import 'package:flutter/material.dart';
import 'package:flutter/cupertino.dart';
import 'dart:math' as math;
import '../theme/app_colors.dart';

class AuraAssistantButton extends StatefulWidget {
  final VoidCallback onPressed;

  const AuraAssistantButton({super.key, required this.onPressed});

  @override
  State<AuraAssistantButton> createState() => _AuraAssistantButtonState();
}

class _AuraAssistantButtonState extends State<AuraAssistantButton> with SingleTickerProviderStateMixin {
  late AnimationController _controller;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 4),
    )..repeat(reverse: true);
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _controller,
      builder: (context, child) {
        return Container(
          width: 72, 
          height: 72,
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            gradient: LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: [
                AppColors.primary,
                AppColors.accent,
              ],
              transform: GradientRotation(_controller.value * 2 * math.pi),
            ),
            boxShadow: [
              BoxShadow(
                color: AppColors.primary.withOpacity(0.4 + (_controller.value * 0.2)), // Pulsing shadow
                blurRadius: 20 + (_controller.value * 10),
                spreadRadius: 2,
                offset: const Offset(0, 5),
              ),
              BoxShadow(
                color: AppColors.accent.withOpacity(0.3),
                blurRadius: 30,
                spreadRadius: -5,
                offset: const Offset(0, 10),
              )
            ],
          ),
          child: FloatingActionButton(
            onPressed: widget.onPressed,
            elevation: 0,
            backgroundColor: Colors.transparent, // Let gradient show through
            shape: const CircleBorder(),
            child: const Icon(CupertinoIcons.sparkles, color: Colors.white, size: 32),
          ),
        );
      },
    );
  }
}
