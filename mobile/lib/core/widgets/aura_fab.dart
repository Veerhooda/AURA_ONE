import 'package:flutter/material.dart';
import 'package:flutter/cupertino.dart';
import '../theme/app_colors.dart';
import '../theme/app_typography.dart';

class AuraFAB extends StatelessWidget {
  final VoidCallback onPressed;
  final IconData icon;
  final String? label;
  final bool isLoading;
  final Color? backgroundColor;
  final Object? heroTag;

  const AuraFAB({
    super.key,
    required this.onPressed,
    this.icon = CupertinoIcons.mic, // Default to mic for backward compat if needed, but usually explicit
    this.label,
    this.isLoading = false,
    this.backgroundColor,
    this.heroTag,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(label != null ? 30 : 50),
        boxShadow: [
          BoxShadow(
            color: (backgroundColor ?? AppColors.primary).withOpacity(0.4),
            blurRadius: 15,
            spreadRadius: 2,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: label != null
          ? FloatingActionButton.extended(
              heroTag: heroTag,
              onPressed: onPressed,
              backgroundColor: backgroundColor ?? AppColors.primary,
              icon: isLoading 
                ? const CupertinoActivityIndicator(color: Colors.white)
                : Icon(icon, color: Colors.black),
              label: Text(
                label!, 
                style: AppTypography.titleMedium.copyWith(color: Colors.black, fontWeight: FontWeight.bold)
              ),
            )
          : FloatingActionButton(
              heroTag: heroTag,
              onPressed: onPressed,
              backgroundColor: backgroundColor ?? AppColors.primary,
              child: isLoading
                  ? const CupertinoActivityIndicator(color: Colors.white)
                  : Icon(icon, color: Colors.black, size: 28),
            ),
    );
  }
}
