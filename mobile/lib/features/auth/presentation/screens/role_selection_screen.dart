```
import 'package:flutter/material.dart';
import 'package:flutter/cupertino.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_typography.dart';
import '../../../../core/widgets/aura_app_bar.dart';

class RoleSelectionScreen extends StatelessWidget {
  const RoleSelectionScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        children: [
          // Background Gradient
          Container(
            decoration: const BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [
                  Color(0xFF0F2027),
                  Color(0xFF203A43),
                  Color(0xFF2C5364),
                ],
              ),
            ),
          ),
          SafeArea(
            child: Padding(
              padding: const EdgeInsets.all(24.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  const SizedBox(height: 48),
                  Text(
                    'Welcome to\nAURA ONE',
                    style: AppTypography.headlineLarge,
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 16),
                  Text(
                    'The Future of Hospital Care',
                    style: AppTypography.bodyLarge.copyWith(color: AppColors.textSecondary),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 64),
                  _buildRoleCard(
                    context,
                    title: 'I am a Patient',
                    icon: CupertinoIcons.person_circle_fill,
                    color: AppColors.primary,
                    route: '/login',
                    role: 'PATIENT',
                  ),
                  const SizedBox(height: 16),
                  _buildRoleCard(
                    context,
                    title: 'I am a Doctor / Nurse',
                    icon: CupertinoIcons.heart_circle_fill,
                    color: AppColors.accent,
                    route: '/login',
                    role: 'DOCTOR',
                  ),
                  const SizedBox(height: 16),
                  _buildRoleCard(
                    context,
                    title: 'I am a Family Member',
                    icon: CupertinoIcons.person_2_fill,
                    color: AppColors.info,
                    route: '/login',
                    role: 'FAMILY',
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildRoleCard(
    BuildContext context, {
    required String title,
    required IconData icon,
    required Color color,
    required String route,
    required String role,
  }) {
    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: () => context.push(route, extra: role),
        borderRadius: BorderRadius.circular(16),
        child: Container(
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            color: AppColors.surface.withOpacity(0.6),
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: AppColors.surfaceHighlight),
          ),
          child: Row(
            children: [
              Icon(icon, size: 40, color: color),
              const SizedBox(width: 16),
              Text(
                title,
                style: AppTypography.titleMedium,
              ),
              const Spacer(),
              const Icon(CupertinoIcons.chevron_right, color: AppColors.textSecondary),
            ],
          ),
        ),
      ),
    );
  }
}
