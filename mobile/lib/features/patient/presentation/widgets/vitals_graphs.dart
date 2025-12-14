import 'package:flutter/material.dart';
import 'dart:math' as math;
import '../../../../core/theme/app_colors.dart';

// ---------------------------------------------------------------------------
// BASE ANIMATED GRAPH WIDGET
// ---------------------------------------------------------------------------
abstract class AnimatedVitalsGraph extends StatefulWidget {
  final Color color;
  final double height;
  final bool isSimulation;
  final bool isActive;

  const AnimatedVitalsGraph({
    super.key,
    required this.color,
    this.height = 150,
    this.isSimulation = true,
    this.isActive = true,
  });
}

// ---------------------------------------------------------------------------
// 1. HEART RATE GRAPH (ECG / QRS Style)
// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------
// 1. HEART RATE GRAPH (ECG / QRS Style)
// ---------------------------------------------------------------------------
class HeartRateGraph extends AnimatedVitalsGraph {
  final Stream<double>? bpmStream;
  final Stream<double>? waveStream; // Raw ECG Wave

  const HeartRateGraph({
    super.key, 
    required super.color, 
    this.bpmStream,
    this.waveStream,
    super.isSimulation = true,
    super.isActive = true,
  });

  @override
  State<HeartRateGraph> createState() => _HeartRateGraphState();
}

class _HeartRateGraphState extends State<HeartRateGraph> with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  final List<double> _points = [];
  final int _maxPoints = 300;
  
  double _bpm = 60.0;
  bool _usingWaveStream = false;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(vsync: this, duration: const Duration(seconds: 1));
    if (widget.isActive) _controller.repeat();
    _controller.addListener(_updateGraph);

    // Listen to BPM (HealthKit)
    widget.bpmStream?.listen((val) {
      if (mounted) setState(() => _bpm = val);
    });

    // Listen to Raw Wave (Simulator)
    if (widget.waveStream != null) {
      _usingWaveStream = true;
      widget.waveStream!.listen((val) {
        if (mounted) {
           setState(() {
             _points.add(val);
             if (_points.length > _maxPoints) _points.removeAt(0);
           });
        }
      });
    }

    for (int i = 0; i < _maxPoints; i++) _points.add(0);
  }

  @override
  void didUpdateWidget(HeartRateGraph oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (widget.isActive != oldWidget.isActive) {
      if (widget.isActive) {
        _controller.repeat();
      } else {
        _controller.stop();
      }
    }
  }

  void _updateGraph() {
    // If using raw stream, we don't synthesize
    if (_usingWaveStream) return;

    double t = DateTime.now().millisecondsSinceEpoch / 1000.0;
    double val = _synthesizeECG(t);
    
    setState(() {
      _points.add(val);
      if (_points.length > _maxPoints) _points.removeAt(0);
    });
  }

  double _synthesizeECG(double t) {
    double cycleDuration = 60.0 / _bpm; 
    if (cycleDuration <= 0) cycleDuration = 1.0;
    double p = (t % cycleDuration) / cycleDuration;
    if (p > 0.10 && p < 0.15) return 0.2; 
    if (p > 0.15 && p < 0.20) return -0.2; 
    if (p >= 0.20 && p < 0.30) return 1.5 * (1 - ((p-0.25).abs()*20));
    if (p >= 0.30 && p < 0.35) return -0.4;
    if (p > 0.40 && p < 0.50) return 0.3;
    return (math.Random().nextDouble() * 0.05);
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return _GraphContainer(
      height: widget.height,
      color: widget.color.withOpacity(0.1),
      child: CustomPaint(
        painter: _LineGraphPainter(_points, widget.color, isSharp: true),
      ),
    );
  }
}

// ---------------------------------------------------------------------------
// 2. OXYGEN SATURATION GRAPH (Smooth Sine Wave)
// ---------------------------------------------------------------------------
class OxygenGraph extends AnimatedVitalsGraph {
  final Stream<double>? waveStream;
  const OxygenGraph({super.key, required super.color, this.waveStream, super.isActive = true});

  @override
  State<OxygenGraph> createState() => _OxygenGraphState();
}

class _OxygenGraphState extends State<OxygenGraph> with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  final List<double> _points = [];
  final int _maxPoints = 200;
  bool _usingWaveStream = false;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(vsync: this, duration: const Duration(seconds: 1));
    if (widget.isActive) _controller.repeat();
    _controller.addListener(_updateSimulation);

    if (widget.waveStream != null) {
      _usingWaveStream = true;
      widget.waveStream!.listen((val) {
        if (mounted) {
          setState(() {
            _points.add(val);
             if (_points.length > _maxPoints) _points.removeAt(0);
          });
        }
      });
    }

    for (int i = 0; i < _maxPoints; i++) _points.add(0);
  }

  @override
  void didUpdateWidget(OxygenGraph oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (widget.isActive != oldWidget.isActive) {
      if (widget.isActive) _controller.repeat();
      else _controller.stop();
    }
  }

  void _updateSimulation() {
    if (_usingWaveStream) return;

    double t = DateTime.now().millisecondsSinceEpoch / 500.0; 
    double val = math.sin(t) + 0.3 * math.sin(2 * t + 0.5);
    setState(() {
      _points.add(val);
      if (_points.length > _maxPoints) _points.removeAt(0);
    });
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return _GraphContainer(
      height: widget.height,
      color: widget.color.withOpacity(0.1),
      child: CustomPaint(
        painter: _LineGraphPainter(_points, widget.color, isSharp: false),
      ),
    );
  }
}



// ---------------------------------------------------------------------------
// 2. OXYGEN SATURATION GRAPH (Smooth Sine Wave)
// ---------------------------------------------------------------------------


// ---------------------------------------------------------------------------
// 3. BLOOD PRESSURE GRAPH (Dual Wave)
// ---------------------------------------------------------------------------
class BloodPressureGraph extends AnimatedVitalsGraph {
  const BloodPressureGraph({super.key, required super.color, super.isActive = true});

  @override
  State<BloodPressureGraph> createState() => _BloodPressureGraphState();
}

class _BloodPressureGraphState extends State<BloodPressureGraph> with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  final List<double> _systolicPoints = [];
  final List<double> _diastolicPoints = [];
  final int _maxPoints = 200;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(vsync: this, duration: const Duration(seconds: 1));
    if (widget.isActive) _controller.repeat();
    _controller.addListener(_updateSimulation);
    for (int i = 0; i < _maxPoints; i++) {
       _systolicPoints.add(0);
       _diastolicPoints.add(0);
    }
  }

  @override
  void didUpdateWidget(BloodPressureGraph oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (widget.isActive != oldWidget.isActive) {
      if (widget.isActive) _controller.repeat();
      else _controller.stop();
    }
  }

  void _updateSimulation() {
    double t = DateTime.now().millisecondsSinceEpoch / 800.0;
    // Systolic (Higher Amp)
    double sys = math.sin(t) * 1.0; 
    // Diastolic (Lower Amp, Phase Shift)
    double dia = math.sin(t - 0.5) * 0.6; 
    
    setState(() {
      _systolicPoints.add(sys);
      if (_systolicPoints.length > _maxPoints) _systolicPoints.removeAt(0);

      _diastolicPoints.add(dia);
      if (_diastolicPoints.length > _maxPoints) _diastolicPoints.removeAt(0);
    });
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return _GraphContainer(
      height: widget.height,
      color: widget.color.withOpacity(0.1),
      child: CustomPaint(
        painter: _DualLineGraphPainter(_systolicPoints, _diastolicPoints, widget.color),
      ),
    );
  }
}

// ---------------------------------------------------------------------------
// HELPERS & PAINTERS
// ---------------------------------------------------------------------------
class _GraphContainer extends StatelessWidget {
  final Widget child;
  final double height;
  final Color color;

  const _GraphContainer({required this.child, required this.height, required this.color});

  @override
  Widget build(BuildContext context) {
    return Container(
      height: height,
      width: double.infinity,
      decoration: BoxDecoration(
        color: Colors.black.withOpacity(0.4),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.surfaceHighlight),
        gradient: LinearGradient(
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
          colors: [color, Colors.transparent],
        ),
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(16),
        child: child,
      ),
    );
  }
}

class _LineGraphPainter extends CustomPainter {
  final List<double> points;
  final Color color;
  final bool isSharp; // True for ECG, False for Oxygen

  _LineGraphPainter(this.points, this.color, {required this.isSharp});

  @override
  void paint(Canvas canvas, Size size) {
    if (points.isEmpty) return;

    final paint = Paint()
      ..color = color
      ..strokeWidth = 2.5
      ..style = PaintingStyle.stroke
      ..strokeCap = StrokeCap.round;

    final path = Path();
    final double stepX = size.width / (points.length - 1);
    
    // Normalize Y: assuming simulated range approx -2 to 2
    double range = 4.0; 
    double midY = size.height / 2;

    for (int i = 0; i < points.length; i++) {
      double x = i * stepX;
      double y = midY - (points[i] * (size.height / range));

      if (i == 0) {
        path.moveTo(x, y);
      } else {
        if (isSharp) {
          path.lineTo(x, y);
        } else {
           // Smooth curve
           double prevX = (i - 1) * stepX;
           double prevY = midY - (points[i - 1] * (size.height / range));
           path.quadraticBezierTo(prevX + stepX/2, prevY, x, y);
           // Not accurate Bezier but smoother than lineTo
        }
      }
    }

    // 1. Draw Gradient Fill
    final fillPath = Path.from(path)
      ..lineTo(size.width, size.height)
      ..lineTo(0, size.height)
      ..close();

    final gradient = LinearGradient(
      begin: Alignment.topCenter,
      end: Alignment.bottomCenter,
      colors: [
        color.withOpacity(0.2),
        color.withOpacity(0.0),
      ],
      stops: const [0.0, 0.85],
    );

    canvas.drawPath(
      fillPath,
      Paint()
        ..shader = gradient.createShader(Rect.fromLTWH(0, 0, size.width, size.height))
        ..style = PaintingStyle.fill,
    );

    // 2. Draw Glow Effect (Removed as it caused blurring issues on some devices)
    // canvas.drawPath(path, Paint()..color = color.withOpacity(0.5)..strokeWidth = 4..style = PaintingStyle.stroke..maskFilter = const MaskFilter.blur(BlurStyle.normal, 5));
    
    // 3. Draw Main Line
    canvas.drawPath(path, paint);

    // 4. Draw Tip
    if (points.isNotEmpty) {
       double lastY = midY - (points.last * (size.height / range));
       
       // Outer glow ring
       canvas.drawCircle(Offset(size.width, lastY), 6, Paint()..color = color.withOpacity(0.3));
       // Inner dot
       canvas.drawCircle(Offset(size.width, lastY), 3, Paint()..color = Colors.white);
    }
  }

  @override
  bool shouldRepaint(covariant _LineGraphPainter oldDelegate) => true;
}

class _DualLineGraphPainter extends CustomPainter {
  final List<double> sysPoints;
  final List<double> diaPoints;
  final Color color;

  _DualLineGraphPainter(this.sysPoints, this.diaPoints, this.color);

  @override
  void paint(Canvas canvas, Size size) {
    _drawPath(canvas, size, sysPoints, color, 1.0);
    _drawPath(canvas, size, diaPoints, color.withOpacity(0.6), 0.7);
  }

  void _drawPath(Canvas canvas, Size size, List<double> points, Color c, double scale) {
     if (points.isEmpty) return;
     final paint = Paint()..color = c..strokeWidth = 2.0..style = PaintingStyle.stroke;
     final path = Path();
     final double stepX = size.width / (points.length - 1);
     double midY = size.height / 2;
     double range = 4.0;

     for (int i = 0; i < points.length; i++) {
      double x = i * stepX;
      double y = midY - (points[i] * (size.height / range));
      if (i == 0) path.moveTo(x, y);
      else {
        // Simple smoothing
        double prevX = (i - 1) * stepX;
        double prevY = midY - (points[i-1] * (size.height / range));
        double midX = (prevX + x) / 2;
        double midY_pt = (prevY + y) / 2;
        path.quadraticBezierTo(prevX, prevY, midX, midY_pt);
        // Correct way is control points, but this suffices for 'wavy' look
        path.lineTo(x, y); 
      }
    }
    
    // Draw area between? No, just lines for now
    canvas.drawPath(path, paint);
  }

  @override
  bool shouldRepaint(covariant _DualLineGraphPainter oldDelegate) => true;
}
