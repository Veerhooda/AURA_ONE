import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:flutter/cupertino.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_typography.dart';
import '../../../../core/widgets/aura_app_bar.dart';
import '../../../../core/widgets/aura_fab.dart';
import '../../../../services/api_service.dart';
import 'update_profile_screen.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> with TickerProviderStateMixin {
  bool _isLoading = true;
  Map<String, dynamic> _patientData = {};
  
  late AnimationController _breathingController;
  late Animation<Color?> _topColorAnim;
  late Animation<Color?> _bottomColorAnim;
  late AnimationController _fadeController;
  late Animation<double> _fadeAnimation;

  @override
  void initState() {
    super.initState();
    // 1. Breathing Background Gradient
    _breathingController = AnimationController(
      vsync: this, 
      duration: const Duration(seconds: 8)
    )..repeat(reverse: true);

    _topColorAnim = ColorTween(
      begin: const Color(0xFF0D1B2A), // Deep Night Blue
      end: const Color(0xFF2E1C38),   // Deep Plum
    ).animate(_breathingController);
    
    _bottomColorAnim = ColorTween(
      begin: const Color(0xFF1B263B), // Dark Slate
      end: const Color(0xFF0F1C36),   // Night Blue
    ).animate(_breathingController);

    // 2. Initial Fade In
    _fadeController = AnimationController(
       vsync: this,
       duration: const Duration(milliseconds: 1000),
    );
    _fadeAnimation = CurvedAnimation(parent: _fadeController, curve: Curves.easeOut);

    _fetchProfile();
    _fadeController.forward();
  }

  @override
  void dispose() {
    _breathingController.dispose();
    _fadeController.dispose();
    super.dispose();
  }

  Future<void> _fetchProfile() async {
    // Keep loading true initially, but for refreshes we might want to just silent update
    // For now, let's just fetch.
    final id = await ApiService().getPatientId();
    if (id != null) {
      final data = await ApiService().getPatientTwin(id);
      if (mounted) {
        setState(() {
          _patientData = data;
          _isLoading = false;
        });
      }
    } else {
       if (mounted) setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return const Scaffold(
        backgroundColor: AppColors.background,
        body: Center(child: CupertinoActivityIndicator(color: AppColors.primary, radius: 15))
      );
    }

    final metadata = _patientData['metadata'] ?? {};
    final name = metadata['name'] ?? 'User';
    final mrn = metadata['mrn'] ?? '--';
    final weight = metadata['weight'] ?? '70 kg';
    final symptoms = metadata['symptoms'] ?? 'None';
    final status = _patientData['status'] ?? 'Stable';

    return Scaffold(
      extendBodyBehindAppBar: true,
      body: Stack(
        children: [
          // 1. ANIMATED BACKGROUND
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
                      Colors.black,
                    ],
                  ),
                ),
              );
            },
          ),
          
          // 2. AMBIENT GLOWS
          Positioned(
            top: -100,
            right: -100,
            child: Container(
              width: 300,
              height: 300,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                gradient: RadialGradient(
                  colors: [AppColors.primary.withOpacity(0.15), Colors.transparent]
                )
              ),
            ),
          ),
          
          // 3. CONTENT
          SafeArea(
            child: RefreshIndicator(
              onRefresh: _fetchProfile,
              color: AppColors.primary,
              child: FadeTransition(
                opacity: _fadeAnimation,
                child: SingleChildScrollView(
                  physics: const AlwaysScrollableScrollPhysics(),
                  padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                  child: Column(
                    children: [
                      const SizedBox(height: 10),
                      // AVATAR
                      Container(
                        padding: const EdgeInsets.all(3),
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          gradient: LinearGradient(
                            colors: [AppColors.primary, AppColors.accent],
                            begin: Alignment.topLeft,
                            end: Alignment.bottomRight
                          ),
                          boxShadow: [
                            BoxShadow(
                              color: AppColors.primary.withOpacity(0.4),
                              blurRadius: 20, 
                              spreadRadius: 2
                            )
                          ]
                        ),
                        child: const CircleAvatar(
                          radius: 54,
                          backgroundColor: Color(0xFF1E1E1E), // Dark background for avatar
                          child: Icon(CupertinoIcons.person_fill, size: 50, color: Colors.white),
                        ),
                      ),
                      const SizedBox(height: 20),
                      
                      // NAME & ID
                      Text(
                        name, 
                        style: AppTypography.headlineMedium.copyWith(
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
                          letterSpacing: 0.5
                        )
                      ),
                      const SizedBox(height: 6),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                        decoration: BoxDecoration(
                          color: Colors.white.withOpacity(0.1),
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(color: Colors.white.withOpacity(0.1))
                        ),
                        child: Text(
                          "MRN: $mrn", 
                          style: AppTypography.labelSmall.copyWith(
                            color: AppColors.primaryLight, 
                            fontWeight: FontWeight.w600,
                            letterSpacing: 1
                          )
                        ),
                      ),
                      
                      const SizedBox(height: 40),

                      // STATS GRID
                      Row(
                        children: [
                          Expanded(
                            child: _buildGlassCard(
                              title: "Status", 
                              value: status, 
                              icon: CupertinoIcons.heart_circle_fill, 
                              iconColor: _getStatusColor(status),
                              delay: 200
                            )
                          ),
                          const SizedBox(width: 16),
                          Expanded(
                            child: _buildGlassCard(
                              title: "Weight", 
                              value: weight, 
                              icon: Icons.monitor_weight_outlined, 
                              iconColor: AppColors.info,
                              delay: 300
                            )
                          ),
                        ],
                      ),
                      const SizedBox(height: 16),
                      // Full Width Card
                      _buildGlassCard(
                        title: "Current Symptoms", 
                        value: symptoms, 
                        icon: CupertinoIcons.bandage_fill, 
                        iconColor: AppColors.error,
                        isFullWidth: true,
                        delay: 400
                      ),

                      const SizedBox(height: 40),
                      
                      // ACTION BUTTONS
                      _buildActionButton(
                        context,
                        label: "Edit Profile Details",
                        icon: Icons.edit_outlined,
                        color: AppColors.primary,
                        onPressed: () => Navigator.push(
                          context, 
                          MaterialPageRoute(builder: (_) => UpdateProfileScreen(
                            initialWeight: weight,
                            initialStatus: status,
                            initialSymptoms: symptoms,
                          ))
                        ).then((_) => _fetchProfile()),
                      ),
                      
                      const SizedBox(height: 100), // Bottom padding for nav bar
                    ],
                  ),
                ),
              ),
            ),
          ),
          
          // 4. SIGN OUT BUTTON (Top Right)
          Positioned(
            top: 50,
            right: 20,
            child: IconButton(
              onPressed: () => context.go('/'),
              icon: Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: Colors.white.withOpacity(0.1),
                  shape: BoxShape.circle,
                ),
                child: const Icon(Icons.logout, color: Colors.white, size: 20),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Color _getStatusColor(String status) {
    switch (status.toLowerCase()) {
      case 'critical': return AppColors.error;
      case 'admitted': return AppColors.warning;
      case 'discharged': return Colors.white60;
      default: return AppColors.success;
    }
  }

  Widget _buildGlassCard({
    required String title, 
    required String value, 
    required IconData icon, 
    required Color iconColor,
    bool isFullWidth = false,
    int delay = 0,
  }) {
    return TweenAnimationBuilder<double>(
      tween: Tween(begin: 0.0, end: 1.0),
      duration: Duration(milliseconds: 800 + delay),
      curve: Curves.easeOutCubic,
      builder: (context, val, child) {
        return Transform.translate(
          offset: Offset(0, 20 * (1 - val)),
          child: Opacity(opacity: val, child: child),
        );
      },
      child: ClipRRect(
        borderRadius: BorderRadius.circular(24),
        child: BackdropFilter(
          filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
          child: Container(
            width: isFullWidth ? double.infinity : null,
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: Colors.white.withOpacity(0.08), // Subtle glass 
              borderRadius: BorderRadius.circular(24),
              border: Border.all(color: Colors.white.withOpacity(0.1)),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.1),
                  blurRadius: 10,
                  offset: const Offset(0, 5),
                )
              ]
            ),
            child: Column(
              crossAxisAlignment: isFullWidth ? CrossAxisAlignment.start : CrossAxisAlignment.center,
              children: [
                if (isFullWidth) ...[
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(8),
                        decoration: BoxDecoration(
                          color: iconColor.withOpacity(0.2), 
                          borderRadius: BorderRadius.circular(12)
                        ),
                        child: Icon(icon, color: iconColor, size: 20),
                      ),
                      const SizedBox(width: 12),
                      Text(title, style: AppTypography.bodySmall.copyWith(color: Colors.white60)),
                    ],
                  ),
                  const SizedBox(height: 12),
                  Text(
                    value, 
                    style: AppTypography.titleMedium.copyWith(color: Colors.white, fontWeight: FontWeight.w600)
                  ),
                ] else ...[
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: iconColor.withOpacity(0.15), 
                      shape: BoxShape.circle
                    ),
                    child: Icon(icon, color: iconColor, size: 28),
                  ),
                  const SizedBox(height: 12),
                  Text(
                    value, 
                    style: AppTypography.titleLarge.copyWith(color: Colors.white, fontWeight: FontWeight.bold), 
                    textAlign: TextAlign.center
                  ),
                  const SizedBox(height: 4),
                  Text(title, style: AppTypography.bodySmall.copyWith(color: Colors.white54)),
                ]
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildActionButton(BuildContext context, {required String label, required IconData icon, required Color color, required VoidCallback onPressed}) {
    return Container(
      width: double.infinity,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: color.withOpacity(0.3),
            blurRadius: 20, 
            offset: const Offset(0, 5)
          )
        ]
      ),
      child: ElevatedButton.icon(
        onPressed: onPressed,
        icon: Icon(icon, color: Colors.black),
        label: Text(label, style: const TextStyle(color: Colors.black, fontSize: 16, fontWeight: FontWeight.bold)),
        style: ElevatedButton.styleFrom(
          backgroundColor: color, // Use the vibrant color
          foregroundColor: Colors.black,
          padding: const EdgeInsets.symmetric(vertical: 18),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
          elevation: 0, // Shadow handled by container
        ),
      ),
    );
  }
}
