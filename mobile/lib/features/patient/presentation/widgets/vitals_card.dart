import 'package:flutter/material.dart';
import 'dart:ui' as ui;
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_typography.dart';

class VitalsCard extends StatelessWidget {
  final String title;
  final String value;
  final String? unit;
  final IconData? icon;
  final Color color;
  final Widget? graph;
  final Widget? action;

  const VitalsCard({
    super.key,
    required this.title,
    required this.value,
    this.unit,
    this.icon,
    required this.color,
    this.graph,
    this.action,
  });

  @override
  Widget build(BuildContext context) {
    return ClipRRect(
      borderRadius: BorderRadius.circular(24),
      child: BackdropFilter(
        filter: ui.ImageFilter.blur(sigmaX: 10, sigmaY: 10),
        child: Container(
          margin: const EdgeInsets.only(bottom: 24),
          decoration: BoxDecoration(
            color: Colors.white.withOpacity(0.05),
            borderRadius: BorderRadius.circular(24),
            border: Border.all(color: Colors.white.withOpacity(0.08), width: 1),
            boxShadow: [
              BoxShadow(
                color: color.withOpacity(0.05),
                blurRadius: 20,
                offset: const Offset(0, 4),
              ),
            ],
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Header
              Padding(
                padding: const EdgeInsets.fromLTRB(20, 20, 20, 10),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Row(
                      children: [
                        if (icon != null) ...[
                          Container(
                            padding: const EdgeInsets.all(8),
                            decoration: BoxDecoration(
                              color: color.withOpacity(0.2),
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: Icon(icon, color: color, size: 16),
                          ),
                          const SizedBox(width: 12),
                        ],
                        Text(title, style: AppTypography.titleMedium.copyWith(color: Colors.white70)),
                      ],
                    ),
                    if (action != null) action!,
                  ],
                ),
              ),
        
              // Value
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 20),
                child: FittedBox(
                  fit: BoxFit.scaleDown,
                  alignment: Alignment.centerLeft,
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.baseline,
                    textBaseline: TextBaseline.alphabetic,
                    children: [
                      Text(
                        value,
                        style: AppTypography.headlineLarge.copyWith(
                          fontSize: 42, 
                          color: Colors.white,
                          fontWeight: FontWeight.bold,
                          shadows: [Shadow(color: color.withOpacity(0.5), blurRadius: 15)]
                        ),
                      ),
                      if (unit != null) ...[
                        const SizedBox(width: 6),
                        Text(unit!, style: AppTypography.titleMedium.copyWith(color: Colors.white54)),
                      ],
                    ],
                  ),
                ),
              ),
        
              const SizedBox(height: 16),
        
              // Graph
              if (graph != null)
                ClipRRect(
                  borderRadius: const BorderRadius.vertical(bottom: Radius.circular(24)),
                  child: Container(
                    decoration: BoxDecoration(
                      border: Border(top: BorderSide(color: Colors.white.withOpacity(0.05)))
                    ),
                    child: graph
                  ),
                ),
            ],
          ),
        ),
      ),
    );
  }
}
