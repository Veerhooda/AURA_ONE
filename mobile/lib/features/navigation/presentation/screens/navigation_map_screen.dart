import 'package:flutter/material.dart';
import 'package:flutter/cupertino.dart';
import 'dart:ui' as ui;
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_typography.dart';
import '../../../../core/widgets/aura_app_bar.dart';
import '../../../../services/api_service.dart';

class NavigationMapScreen extends StatefulWidget {
  const NavigationMapScreen({super.key});

  @override
  State<NavigationMapScreen> createState() => _NavigationMapScreenState();
}

class _NavigationMapScreenState extends State<NavigationMapScreen> with SingleTickerProviderStateMixin {
  List<Map<String, dynamic>> _pathNodes = [];
  bool _isLoading = false;
  late AnimationController _pathController;
  late Animation<double> _pathAnimation;

  // Selected destination for UI feedback
  String _activeRoute = "Select a Destination";

  @override
  void initState() {
    super.initState();
    _pathController = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 2),
    );
    _pathAnimation = CurvedAnimation(parent: _pathController, curve: Curves.easeInOut);
  }

  @override
  void dispose() {
    _pathController.dispose();
    super.dispose();
  }

  void _findPath(int startId, int endId, String routeName) async {
    setState(() {
      _isLoading = true;
      _activeRoute = routeName;
    });
    
    // Reset animation
    _pathController.reset();

    try {
      final result = await ApiService().getNavigationPath(startId, endId);
      if (mounted) {
        setState(() {
          _pathNodes = List<Map<String, dynamic>>.from(result['path']);
          _isLoading = false;
        });
        _pathController.forward();
      }
    } catch (e) {
      if (mounted) {
        setState(() => _isLoading = false);
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text("Error: $e")));
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      extendBodyBehindAppBar: true,
      appBar: const AuraAppBar(title: "Digital Twin Navigation", backgroundColor: Colors.transparent),
      backgroundColor: const Color(0xFF0F172A), // Deep Digital Blue/Black
      body: Stack(
        children: [
          // 1. DIGITAL GRID & MAP LAYER
          Positioned.fill(
            child: InteractiveViewer(
              minScale: 1.0,
              maxScale: 5.0,
              child: Stack(
                children: [
                   // Base Map (Dark Mode)
                   Image.asset(
                    'assets/hospital_map.png',
                    fit: BoxFit.contain,
                    color: Colors.white.withOpacity(0.1), // Dim the original map
                    colorBlendMode: BlendMode.modulate,
                   ),
                   
                   // Digital Grid Overlay
                   CustomPaint(
                     painter: _DigitalGridPainter(),
                     child: Container(),
                   ),

                   // Neon Path Overlay
                   AnimatedBuilder(
                     animation: _pathAnimation,
                     builder: (context, child) {
                       return CustomPaint(
                         painter: _NeonPathPainter(
                           pathNodes: _pathNodes, 
                           progress: _pathAnimation.value
                         ),
                         child: Container(),
                       );
                     },
                   ),
                ],
              ),
            ),
          ),

          // 2. GLASS CONTROL PANEL (Bottom Sheet style)
          Positioned(
            bottom: 110, // Above Nav Bar
            left: 20,
            right: 20,
            child: ClipRRect(
              borderRadius: BorderRadius.circular(24),
              child: BackdropFilter(
                filter: ui.ImageFilter.blur(sigmaX: 10, sigmaY: 10),
                child: Container(
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    color: const Color(0xFF1E293B).withOpacity(0.8), // Slate 800
                    borderRadius: BorderRadius.circular(24),
                    border: Border.all(color: Colors.white.withOpacity(0.1)),
                    boxShadow: [
                      BoxShadow(
                        color: AppColors.primary.withOpacity(0.1),
                        blurRadius: 20,
                        spreadRadius: 0,
                      )
                    ]
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text("NAVIGATION ACTIVE", style: AppTypography.labelSmall.copyWith(color: AppColors.primary, letterSpacing: 1.5)),
                              const SizedBox(height: 4),
                              Text(_activeRoute, style: AppTypography.titleMedium.copyWith(color: Colors.white, fontWeight: FontWeight.bold)),
                            ],
                          ),
                          if (_isLoading)
                            const CupertinoActivityIndicator(color: AppColors.primary)
                          else
                            Container(
                              padding: const EdgeInsets.all(8),
                              decoration: BoxDecoration(color: AppColors.primary.withOpacity(0.2), shape: BoxShape.circle),
                              child: const Icon(CupertinoIcons.location_fill, color: AppColors.primary, size: 20),
                            )
                        ],
                      ),
                      const SizedBox(height: 16),
                      SizedBox(
                        height: 50,
                        child: ListView(
                          scrollDirection: Axis.horizontal,
                          children: [
                            _buildQuickChip("Reception", Icons.meeting_room, () => _findPath(1, 2, "Entrance to Reception")),
                            _buildQuickChip("Wait Room", Icons.chair, () => _findPath(2, 5, "Reception to Waiting Area")), // Assuming 5 is waiting
                            _buildQuickChip("Emergency", Icons.medical_services, () => _findPath(2, 3, "Reception to Emergency")),
                            _buildQuickChip("Cafeteria", Icons.coffee, () => _findPath(2, 4, "Reception to Cafe")),
                          ],
                        ),
                      )
                    ],
                  ),
                ),
              ),
            ),
          )
        ],
      ),
    );
  }

  Widget _buildQuickChip(String label, IconData icon, VoidCallback onTap) {
    return Padding(
      padding: const EdgeInsets.only(right: 12),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(25),
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          decoration: BoxDecoration(
            color: Colors.white.withOpacity(0.05),
            borderRadius: BorderRadius.circular(25),
            border: Border.all(color: Colors.white.withOpacity(0.1)),
          ),
          child: Row(
            children: [
              Icon(icon, color: Colors.white70, size: 16),
              const SizedBox(width: 8),
              Text(label, style: const TextStyle(color: Colors.white, fontSize: 12)),
            ],
          ),
        ),
      ),
    );
  }
}

// Draw a subtle grid to create the "Digital Twin" wireframe effect
class _DigitalGridPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = AppColors.primary.withOpacity(0.05)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 1.0;

    final double gridSize = 40.0;
    
    // Vertical Lines
    for (double x = 0; x < size.width; x += gridSize) {
      canvas.drawLine(Offset(x, 0), Offset(x, size.height), paint);
    }
    
    // Horizontal Lines
    for (double y = 0; y < size.height; y += gridSize) {
      canvas.drawLine(Offset(0, y), Offset(size.width, y), paint);
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}

class _NeonPathPainter extends CustomPainter {
  final List<Map<String, dynamic>> pathNodes;
  final double progress;

  _NeonPathPainter({required this.pathNodes, required this.progress});

  @override
  void paint(Canvas canvas, Size size) {
    if (pathNodes.isEmpty || progress == 0) return;

    // 1. Neon Glow Paint
    final glowPaint = Paint()
      ..color = AppColors.accent.withOpacity(0.5)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 8.0
      ..strokeCap = StrokeCap.round
      ..maskFilter = const MaskFilter.blur(BlurStyle.normal, 10); // Blur for glow

    // 2. Core Line Paint
    final corePaint = Paint()
      ..color = AppColors.accent
      ..style = PaintingStyle.stroke
      ..strokeWidth = 3.0
      ..strokeCap = StrokeCap.round;

    final path = Path();
    
    // Convert logic (same as before)
    Offset getOffset(Map<String, dynamic> node) {
      double x = (node['x'] as num).toDouble() / 100.0 * size.width;
      double y = (node['y'] as num).toDouble() / 100.0 * size.height;
      return Offset(x, y);
    }

    path.moveTo(getOffset(pathNodes[0]).dx, getOffset(pathNodes[0]).dy);
    
    for (int i = 1; i < pathNodes.length; i++) {
      final p = getOffset(pathNodes[i]);
      path.lineTo(p.dx, p.dy);
    }

    // Path Metrics to animate drawing
    final pathMetrics = path.computeMetrics();
    final extractPath = Path();
    
    for (var metric in pathMetrics) {
      extractPath.addPath(metric.extractPath(0, metric.length * progress), Offset.zero);
    }

    // Draw
    canvas.drawPath(extractPath, glowPaint);
    canvas.drawPath(extractPath, corePaint);

    // Draw Start/End Markers if animation started
    if (progress > 0) {
       final start = getOffset(pathNodes.first);
       canvas.drawCircle(start, 5, Paint()..color = AppColors.success);
    }
    
    if (progress >= 1.0) {
      final end = getOffset(pathNodes.last);
      // Pulsing effect target
      canvas.drawCircle(end, 6, Paint()..color = AppColors.error);
      canvas.drawCircle(end, 12, Paint()..color = AppColors.error.withOpacity(0.3));
    }
  }

  @override
  bool shouldRepaint(covariant _NeonPathPainter oldDelegate) => 
      oldDelegate.progress != progress || oldDelegate.pathNodes != pathNodes;
}
