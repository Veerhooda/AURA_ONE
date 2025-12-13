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
    return Stack(
      clipBehavior: Clip.none, // Allow glow to spill over if needed
      alignment: Alignment.bottomCenter,
      children: [
        // 1. Ambient Glow from the notch (Energy Core)
        Positioned(
          bottom: 20,
          left: 0,
          right: 0,
          child: IgnorePointer(
            child: Center(
              child: Container(
                width: 100,
                height: 50,
                decoration: BoxDecoration(
                  shape: BoxShape.rectangle,
                  borderRadius: BorderRadius.circular(50),
                  boxShadow: [
                    BoxShadow(
                      color: AppColors.primary.withOpacity(0.2), // Soft reactive glow
                      blurRadius: 50,
                      spreadRadius: 10,
                    )
                  ]
                ),
              ),
            ),
          ),
        ),

        // 2. The Glass Structure
        ClipPath(
          clipper: _SmoothNotchClipper(),
          child: BackdropFilter(
            filter: ImageFilter.blur(sigmaX: 15, sigmaY: 15), // Increased blur for frost
            child: Container(
              height: 90,
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                  colors: [
                    AppColors.background.withOpacity(0.85),
                    AppColors.background.withOpacity(0.95),
                  ],
                ),
              ),
              child: Material(
                color: Colors.transparent, // Required for InkWell/GestureDetector to work cleanly
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceAround,
                  children: [
                    _buildTab(0, CupertinoIcons.house_fill, "Home"),
                    _buildTab(1, CupertinoIcons.capsule_fill, "Meds"),
                    const SizedBox(width: 80), // Space for FAB
                    _buildTab(2, CupertinoIcons.map_fill, "Map"),
                    _buildTab(3, CupertinoIcons.person_fill, "Profile"),
                  ],
                ),
              ),
            ),
          ),
        ),
        
        // 3. Precision Bevel Painter (The "cut glass" edge)
        IgnorePointer(
          child: CustomPaint(
            size: Size(MediaQuery.of(context).size.width, 90),
            painter: _GlassBevelPainter(),
          ),
        ),
      ],
    );
  }

  Widget _buildTab(int index, IconData icon, String label) {
    final bool isSelected = currentIndex == index;
    return GestureDetector(
      onTap: () => onTap(index),
      behavior: HitTestBehavior.opaque,
      child: Container(
        height: 60,
        width: 60, // Fixed width for easier touch target
        alignment: Alignment.center,
        child: AnimatedSwitcher(
          duration: const Duration(milliseconds: 200),
          child: Column(
            key: ValueKey<bool>(isSelected),
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(
                icon,
                color: isSelected ? AppColors.primary : Colors.white24, // High contrast state
                size: isSelected ? 28 : 24,
              ),
              const SizedBox(height: 4),
              if (isSelected) // Only show label when selected for cleaner look
                Text(
                  label,
                  style: const TextStyle(
                    color: AppColors.primary,
                    fontSize: 10,
                    fontWeight: FontWeight.bold,
                    letterSpacing: 0.5,
                  ),
                )
              else 
                const SizedBox(height: 12), // Keep height consistent
            ],
          ),
        ),
      ),
    );
  }
}

// Optimized cubic bezier for a smoother, tighter notch
class _SmoothNotchClipper extends CustomClipper<Path> {
  @override
  Path getClip(Size size) {
    final path = Path();
    final double center = size.width / 2;
    // Notch dimensions
    final double topRadius = 45.0; // Width of opening
    final double bottomRadius = 25.0; // Depth/Shape of curve

    path.moveTo(0, 0);
    
    // Line to start of notch
    path.lineTo(center - topRadius - 10, 0);

    // Smooth Entrance Curve
    path.cubicTo(
      center - topRadius, 0,
      center - topRadius + 15, bottomRadius, 
      center, bottomRadius,
    );
    
    // Smooth Exit Curve
    path.cubicTo(
      center + topRadius - 15, bottomRadius,
      center + topRadius, 0,
      center + topRadius + 10, 0,
    );

    // Rest of outline
    path.lineTo(size.width, 0);
    path.lineTo(size.width, size.height);
    path.lineTo(0, size.height);
    path.close();

    return path;
  }

  @override
  bool shouldReclip(covariant CustomClipper<Path> oldClipper) => false;
}

// Paints a double-stroke to simulate light hitting the cut glass edge
class _GlassBevelPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    // 1. Top Highlight (Light hitting the top edge)
    final highlightPaint = Paint()
      ..color = Colors.white.withOpacity(0.3)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 1.0;
      
    // 2. Inner Shadow/Refraction (Darker edge inside the cut)
    final shadowPaint = Paint()
      ..color = Colors.black.withOpacity(0.3)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 2.0
      ..maskFilter = const MaskFilter.blur(BlurStyle.normal, 2);

    final path = Path();
    final double center = size.width / 2;
    final double topRadius = 45.0;
    final double bottomRadius = 25.0;

    path.moveTo(0, 0);
    path.lineTo(center - topRadius - 10, 0);
    path.cubicTo(
      center - topRadius, 0,
      center - topRadius + 15, bottomRadius, 
      center, bottomRadius,
    );
    path.cubicTo(
      center + topRadius - 15, bottomRadius,
      center + topRadius, 0,
      center + topRadius + 10, 0,
    );
    path.lineTo(size.width, 0);

    // Draw shadow slightly offset downwards
    canvas.drawPath(path.shift(const Offset(0, 1)), shadowPaint);
    // Draw highlight on top
    canvas.drawPath(path, highlightPaint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
