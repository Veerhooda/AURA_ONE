import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_typography.dart';
import '../../../../core/widgets/aura_app_bar.dart';
import '../../../../services/api_service.dart';

class NavigationMapScreen extends StatefulWidget {
  const NavigationMapScreen({super.key});

  @override
  State<NavigationMapScreen> createState() => _NavigationMapScreenState();
}

class _NavigationMapScreenState extends State<NavigationMapScreen> {
  List<Map<String, dynamic>> pathNodes = [];
  bool isLoading = false;

  void _findPath(int startId, int endId) async {
    setState(() => isLoading = true);
    try {
      final result = await ApiService().getNavigationPath(startId, endId);
      setState(() {
        pathNodes = List<Map<String, dynamic>>.from(result['path']);
        isLoading = false;
      });
    } catch (e) {
      setState(() => isLoading = false);
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text("Error fetching path: $e")));
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: const AuraAppBar(title: "Hospital Navigation"),
      body: Column(
        children: [
          Expanded(
            child: InteractiveViewer(
              minScale: 1.0,
              maxScale: 5.0,
              child: Center(
                child: CustomPaint(
                  foregroundPainter: MapPathPainter(pathNodes: pathNodes),
                  child: Image.asset(
                    'assets/hospital_map.png',
                    fit: BoxFit.contain,
                    errorBuilder: (c, e, s) => const Center(
                      child: Text("Map Asset Not Found (Download hospital_map.png to assets/)"),
                    ),
                  ),
                ),
              ),
            ),
          ),
          _buildControls(),
        ],
      ),
    );
  }

  Widget _buildControls() {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
        border: Border.all(color: AppColors.surfaceHighlight),
        boxShadow: [
          BoxShadow(color: Colors.black.withOpacity(0.2), blurRadius: 10, offset: const Offset(0, -5))
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Text("Where to?", style: AppTypography.headlineMedium),
          const SizedBox(height: 16),
          Row(
            children: [
              Expanded(
                child: _LocationButton(
                  label: "Entrance -> Reception",
                  onPressed: () => _findPath(1, 2),
                  icon: Icons.login,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: _LocationButton(
                  label: "Reception -> Surgery",
                  onPressed: () => _findPath(2, 6),
                  icon: Icons.local_hospital,
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              Expanded(
                child: _LocationButton(
                  label: "Reception -> Cafe",
                  onPressed: () => _findPath(2, 4),
                  icon: Icons.coffee,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: _LocationButton(
                  label: "Emergency -> Elev",
                  onPressed: () => _findPath(3, 8),
                  icon: Icons.medical_services,
                ),
              ),
            ],
          ),
           if (isLoading)
            const Padding(
              padding: EdgeInsets.only(top: 16),
              child: Center(child: CircularProgressIndicator()),
            ),
        ],
      ),
    );
  }
}

class _LocationButton extends StatelessWidget {
  final String label;
  final VoidCallback onPressed;
  final IconData icon;

  const _LocationButton({required this.label, required this.onPressed, required this.icon});

  @override
  Widget build(BuildContext context) {
    return ElevatedButton.icon(
      onPressed: onPressed,
      icon: Icon(icon, size: 18),
      label: Text(label, style: const TextStyle(fontSize: 12)),
      style: ElevatedButton.styleFrom(
        backgroundColor: AppColors.primary.withOpacity(0.2),
        foregroundColor: AppColors.textPrimary,
        padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 8),
      ),
    );
  }
}

class MapPathPainter extends CustomPainter {
  final List<Map<String, dynamic>> pathNodes;
  MapPathPainter({required this.pathNodes});

  @override
  void paint(Canvas canvas, Size size) {
    if (pathNodes.isEmpty) return;

    final paint = Paint()
      ..color = AppColors.error // Red Path
      ..strokeWidth = 4.0
      ..strokeCap = StrokeCap.round
      ..style = PaintingStyle.stroke;

    final path = Path();
    
    // Helper to map 0-100 coordinates to canvas size
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

    // Draw the Path
    canvas.drawPath(path, paint);
    canvas.drawPath(path, paint);

    // Draw Markers
    final start = getOffset(pathNodes.first);
    final end = getOffset(pathNodes.last);

    // Start (Green)
    canvas.drawCircle(start, 6, Paint()..color = AppColors.success);
    canvas.drawCircle(start, 8, Paint()..color = AppColors.success.withOpacity(0.3));

    // End (Red Target)
    canvas.drawCircle(end, 6, Paint()..color = AppColors.error);
    canvas.drawCircle(end, 2, Paint()..color = Colors.white);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => true;
}
