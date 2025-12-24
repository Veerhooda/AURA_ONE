import 'package:flutter/material.dart';

class AppColors {
  // Primary Brand Colors (Medical/Trust/Calm)
  static const Color primary = Color(0xFF00BFA5); // Medical Teal / Mint
  static const Color primaryDark = Color(0xFF008E76);
  static const Color primaryLight = Color(0xFF5DF2D6);

  // Secondary/Accent Colors
  static const Color accent = Color(0xFF536DFE); // Soft Indigo
  static const Color accentDark = Color(0xFF1C32A0);

  // Neutral / Surface Colors (Dark Mode focused)
  static const Color background = Color(0xFF121212);
  static const Color surface = Color(0xFF1E1E1E);
  static const Color surfaceHighlight = Color(0xFF2C2C2C);
  static const Color cardSurface = Color(0xFF1E1E1E);
  
  // Text Colors
  static const Color textPrimary = Color(0xFFFFFFFF);
  static const Color textSecondary = Color(0xFFB0B0B0);
  static const Color textHint = Color(0xFF6C6C6C);

  // Status Colors
  static const Color success = Color(0xFF00E676);
  static const Color warning = Color(0xFFFFAB40);
  static const Color error = Color(0xFFFF5252);
  static const Color info = Color(0xFF40C4FF);

  // Glassmorphism overlays
  static Color glassWhite = Colors.white.withOpacity(0.1);
  static Color glassBlack = Colors.black.withOpacity(0.2);
}
