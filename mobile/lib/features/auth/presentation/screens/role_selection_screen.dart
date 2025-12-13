import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:flutter/cupertino.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_typography.dart';

class RoleSelectionScreen extends StatefulWidget {
  const RoleSelectionScreen({super.key});

  @override
  State<RoleSelectionScreen> createState() => _RoleSelectionScreenState();
}

class _RoleSelectionScreenState extends State<RoleSelectionScreen> with TickerProviderStateMixin {
  late AnimationController _fadeController;
  late AnimationController _breathingController;
  late AnimationController _pulseController;
  
  late Animation<double> _fadeAnimation;
  late Animation<Color?> _topColorAnim;
  late Animation<Color?> _bottomColorAnim;
  late Animation<double> _pulseAnimation;

  @override
  void initState() {
    super.initState();
    
    // 1. Initial Fade In
    _fadeController = AnimationController(
       vsync: this,
       duration: const Duration(milliseconds: 1200),
    );
    _fadeAnimation = CurvedAnimation(parent: _fadeController, curve: Curves.easeOut);
    
    // 2. Breathing Background Gradient
    _breathingController = AnimationController(
      vsync: this, 
      duration: const Duration(seconds: 6)
    )..repeat(reverse: true);

    _topColorAnim = ColorTween(
      begin: const Color(0xFF0A1128), 
      end: const Color(0xFF1A237E)
    ).animate(_breathingController);
    
    _bottomColorAnim = ColorTween(
      begin: const Color(0xFF001F54), 
      end: const Color(0xFF311B92)
    ).animate(_breathingController);

    // 3. Logo Pulse
    _pulseController = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 2),
    )..repeat(reverse: true);
    
    _pulseAnimation = Tween<double>(begin: 1.0, end: 1.1).animate(
      CurvedAnimation(parent: _pulseController, curve: Curves.easeInOut)
    );

    _fadeController.forward();
  }

  @override
  void dispose() {
    _fadeController.dispose();
    _breathingController.dispose();
    _pulseController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        children: [
          // ANIMATED BACKGROUND
          AnimatedBuilder(
            animation: _breathingController,
            builder: (context, child) {
              return Container(
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                    colors: [
                      _topColorAnim.value!,
                      _bottomColorAnim.value!,
                      const Color(0xFF000000), // Deep anchor
                    ],
                  ),
                ),
              );
            },
          ),
          
          // AMBIENT GLOW ORBS
          Positioned(
            top: -100,
            right: -100,
            child: FadeTransition(
              opacity: _fadeAnimation,
              child: _buildGlowOrb(AppColors.primary, 300),
            ),
          ),
          Positioned(
            bottom: -150,
            left: -150,
            child: FadeTransition(
              opacity: _fadeAnimation,
              child: _buildGlowOrb(AppColors.accent, 400),
            ),
          ),

          // CONTENT
          SafeArea(
            child: FadeTransition(
              opacity: _fadeAnimation,
              child: SingleChildScrollView(
                padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 12),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    const SizedBox(height: 40),
                    // LOGO AREA
                    Center(
                      child: ScaleTransition(
                        scale: _pulseAnimation,
                        child: Container(
                          width: 100,
                          height: 100,
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                            gradient: LinearGradient(
                              colors: [AppColors.primary, AppColors.primaryLight],
                              begin: Alignment.topLeft,
                              end: Alignment.bottomRight,
                            ),
                            boxShadow: [
                              BoxShadow(
                                color: AppColors.primary.withOpacity(0.5),
                                blurRadius: 30,
                                spreadRadius: 5,
                              )
                            ],
                          ),
                          child: const Icon(
                            CupertinoIcons.heart_fill,
                            size: 50,
                            color: Colors.white,
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(height: 32),
                    
                    // TITLE WITH SHADER
                    ShaderMask(
                      shaderCallback: (bounds) => LinearGradient(
                        colors: [Colors.white, Colors.white.withOpacity(0.8)],
                      ).createShader(bounds),
                      child: Text(
                        'AURA ONE',
                        style: AppTypography.headlineLarge.copyWith(
                          fontSize: 42,
                          fontWeight: FontWeight.bold,
                          letterSpacing: 3,
                          color: Colors.white,
                        ),
                        textAlign: TextAlign.center,
                      ),
                    ),
                    const SizedBox(height: 12),
                    Text(
                      'Advanced Healthcare Intelligence',
                      style: AppTypography.bodyLarge.copyWith(
                        color: Colors.white70,
                        letterSpacing: 1.0,
                        fontWeight: FontWeight.w300,
                      ),
                      textAlign: TextAlign.center,
                    ),
                    
                    const SizedBox(height: 60),
                    
                    Text(
                      'SELECT YOUR ROLE',
                      style: AppTypography.labelSmall.copyWith(
                        color: Colors.white54,
                        letterSpacing: 2.0,
                        fontWeight: FontWeight.bold,
                      ),
                      textAlign: TextAlign.center,
                    ),
                    const SizedBox(height: 24),

                    _buildGlassRoleCard(
                      context,
                      title: 'Patient',
                      subtitle: 'Access your health data & care',
                      icon: CupertinoIcons.person_circle_fill,
                      color: AppColors.primary,
                      route: '/login',
                      role: 'PATIENT',
                      delay: 200,
                    ),
                    const SizedBox(height: 16),
                    _buildGlassRoleCard(
                      context,
                      title: 'Medical Staff',
                      subtitle: 'Monitor patients & manage care',
                      icon: CupertinoIcons.heart_circle_fill,
                      color: AppColors.accent,
                      route: '/login',
                      role: 'DOCTOR',
                      delay: 300,
                    ),
                    const SizedBox(height: 16),
                    _buildGlassRoleCard(
                      context,
                      title: 'Family Member',
                      subtitle: 'Stay connected with loved ones',
                      icon: CupertinoIcons.person_2_fill,
                      color: AppColors.info,
                      route: '/login',
                      role: 'FAMILY',
                      delay: 400,
                    ),
                    
                    const SizedBox(height: 48),
                    
                    // FOOTER
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(Icons.shield_outlined, size: 14, color: Colors.white30),
                        const SizedBox(width: 8),
                        Text(
                          'Secure  •  HIPAA Compliant  •  AI Powered',
                          style: AppTypography.bodySmall.copyWith(
                            color: Colors.white30,
                            fontSize: 12,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 20),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildGlowOrb(Color color, double size) {
    return Container(
      width: size,
      height: size,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        gradient: RadialGradient(
          colors: [
            color.withOpacity(0.2),
            Colors.transparent,
          ],
        ),
      ),
    );
  }

  Widget _buildGlassRoleCard(
    BuildContext context, {
    required String title,
    required String subtitle,
    required IconData icon,
    required Color color,
    required String route,
    required String role,
    required int delay,
  }) {
    return TweenAnimationBuilder<double>(
      tween: Tween(begin: 0.0, end: 1.0),
      duration: Duration(milliseconds: 600 + delay),
      curve: Curves.easeOutCubic,
      builder: (context, value, child) {
        return Transform.translate(
          offset: Offset(0, 30 * (1 - value)),
          child: Opacity(opacity: value, child: child),
        );
      },
      child: _ScaleButton(
        onPressed: () => context.push(route, extra: role),
        child: ClipRRect(
          borderRadius: BorderRadius.circular(24),
          child: BackdropFilter(
            filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
            child: Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: Colors.white.withOpacity(0.1),
                borderRadius: BorderRadius.circular(24),
                border: Border.all(
                  color: Colors.white.withOpacity(0.15),
                  width: 1,
                ),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.05),
                    blurRadius: 20,
                    offset: const Offset(0, 10),
                  ),
                ],
              ),
              child: Row(
                children: [
                  Container(
                    width: 50,
                    height: 50,
                    decoration: BoxDecoration(
                      color: color.withOpacity(0.2),
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: color.withOpacity(0.3)),
                    ),
                    child: Icon(icon, size: 26, color: Colors.white),
                  ),
                  const SizedBox(width: 20),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          title,
                          style: AppTypography.titleMedium.copyWith(
                            fontWeight: FontWeight.bold,
                            fontSize: 18,
                            color: Colors.white,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          subtitle,
                          style: AppTypography.bodySmall.copyWith(
                            color: Colors.white70,
                            fontSize: 13,
                          ),
                        ),
                      ],
                    ),
                  ),
                  Icon(CupertinoIcons.chevron_right, color: Colors.white30, size: 20),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class _ScaleButton extends StatefulWidget {
  final Widget child;
  final VoidCallback onPressed;

  const _ScaleButton({required this.child, required this.onPressed});

  @override
  State<_ScaleButton> createState() => _ScaleButtonState();
}

class _ScaleButtonState extends State<_ScaleButton> with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _scaleAnimation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
       vsync: this, 
       duration: const Duration(milliseconds: 100),
       lowerBound: 0.0,
       upperBound: 0.05,
    );
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTapDown: (_) => _controller.forward(),
      onTapUp: (_) {
        _controller.reverse();
        widget.onPressed();
      },
      onTapCancel: () => _controller.reverse(),
      child: AnimatedBuilder(
        animation: _controller,
        builder: (context, child) {
          return Transform.scale(
            scale: 1.0 - _controller.value,
            child: widget.child,
          );
        },
      ),
    );
  }
}
