import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:flutter/cupertino.dart';
import '../theme/app_colors.dart';

class AuraNavigationBar extends StatelessWidget {
  final int currentIndex;
  final Function(int) onTap;

  const AuraNavigationBar({
    super.key,
    required this.currentIndex,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return ClipRRect(
      child: BackdropFilter(
        filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
        child: Container(
          height: 80,
          color: AppColors.background.withOpacity(0.8),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
              _buildTab(0, CupertinoIcons.house_fill, "Home"),
              _buildTab(1, CupertinoIcons.heart_fill, "Vitals"),
              const SizedBox(width: 48), // Space for FAB
              _buildTab(2, CupertinoIcons.map_fill, "Map"),
              _buildTab(3, CupertinoIcons.person_fill, "Profile"),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildTab(int index, IconData icon, String label) {
    final bool isSelected = currentIndex == index;
    return GestureDetector(
      onTap: () => onTap(index),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            icon,
            color: isSelected ? AppColors.primary : AppColors.textSecondary,
            size: 28,
          ),
          const SizedBox(height: 4),
          Text(
            label,
            style: TextStyle(
              color: isSelected ? AppColors.primary : AppColors.textSecondary,
              fontSize: 12,
              fontWeight: isSelected ? FontWeight.w600 : FontWeight.normal,
            ),
          ),
        ],
      ),
    );
  }
}
