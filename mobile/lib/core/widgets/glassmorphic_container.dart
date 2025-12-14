import 'package:flutter/material.dart';

class GlassmorphicContainer extends StatelessWidget {
  final double width;
  final double height;
  final double borderRadius;
  final double blur;
  final Alignment alignment;
  final Widget child;

  const GlassmorphicContainer({
    Key? key,
    required this.width,
    required this.height,
    required this.borderRadius,
    required this.blur,
    required this.alignment,
    required this.child,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    // Simple placeholder that mimics a glassmorphic container with a translucent background.
    return Container(
      width: width,
      height: height,
      alignment: alignment,
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.1),
        borderRadius: BorderRadius.circular(borderRadius),
        border: Border.all(color: Colors.white.withOpacity(0.2)),
      ),
      child: child,
    );
  }
}
