import 'dart:async';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:fl_chart/fl_chart.dart';
import 'services/simulation_service.dart';
import 'services/socket_service.dart';

void main() {
  runApp(const HealthDataApp());
}

class HealthDataApp extends StatelessWidget {
  const HealthDataApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'AURA Sensor',
      debugShowCheckedModeBanner: false,
      theme: ThemeData.dark().copyWith(
        scaffoldBackgroundColor: Colors.black,
        colorScheme: const ColorScheme.dark(
          primary: Color(0xFF00FF9D), // Medical Green
          secondary: Color(0xFF00B8FF), // Medical Blue
          surface: Color(0xFF1E1E1E),
        ),
        textTheme: GoogleFonts.outfitTextTheme(ThemeData.dark().textTheme),
      ),
      home: const MonitorScreen(),
    );
  }
}

class MonitorScreen extends StatefulWidget {
  const MonitorScreen({super.key});

  @override
  State<MonitorScreen> createState() => _MonitorScreenState();
}

class _MonitorScreenState extends State<MonitorScreen> {
  final _simulationService = SimulationService();
  final _socketService = SocketService();
  final _ipController = TextEditingController(text: '172.20.10.3');
  final _emailController = TextEditingController();
  
  StreamSubscription? _subscription;
  bool _isSimulating = false;
  
  // Data Buffers for Graphs
  final List<FlSpot> _ecgPoints = [];
  final List<FlSpot> _spo2Points = [];
  double _xValue = 0;

  // Current Values
  int _hr = 0;
  int _spo2 = 0;
  String _bp = "--/--";

  @override
  void dispose() {
    _subscription?.cancel();
    _simulationService.stop();
    _socketService.dispose();
    super.dispose();
  }

  void _toggleSimulation() {
    setState(() {
      _isSimulating = !_isSimulating;
    });

    if (_isSimulating) {
      _simulationService.start();
      _subscription = _simulationService.dataStream.listen((data) {
        _updateData(data);
        // Send to Server
        if (_socketService.isConnected) {
          // Add email to payload for backend lookup
          if (_emailController.text.isNotEmpty) {
             data['email'] = _emailController.text;
          }
          // Remove hardcoded ID if we want to rely on email, or keep it as fallback?
          // The backend uses email if patientId is missing.
          // data['patientId'] = 1; 
          _socketService.emitData(data);
        }
      });
    } else {
      _subscription?.cancel();
      _simulationService.stop();
    }
  }

  void _updateData(Map<String, dynamic> data) {
    if (!mounted) return;
    
    setState(() {
      _hr = data['hr'];
      _spo2 = (data['spo2'] as num).toInt();
      _bp = data['bp'] as String;
      
      _xValue += 0.05;
      
      // Update Graph Points (Keep last 100 points)
      _ecgPoints.add(FlSpot(_xValue, (data['ecg'] as num).toDouble()));
      _spo2Points.add(FlSpot(_xValue, (data['spo2_wave'] as num).toDouble()));

      if (_ecgPoints.length > 100) {
        _ecgPoints.removeAt(0);
        _spo2Points.removeAt(0);
      }
    });
  }

  void _connect() {
    _socketService.connect(_ipController.text);
  }

  void _triggerEmergency() {
    if (!_socketService.isConnected) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Not connected to server!"), backgroundColor: Colors.red),
      );
      return;
    }
    
    _socketService.emit('patient.emergency', {
      'patientId': 1,
      'room': '302',
      'type': 'CRITICAL_VITALS',
      'timestamp': DateTime.now().toIso8601String(),
    });

    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text("EMERGENCY SIGNAL SENT!"), backgroundColor: Colors.red),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("AURA Vitals Monitor"),
        backgroundColor: Colors.transparent,
        elevation: 0,
        actions: [
          IconButton(icon: const Icon(Icons.settings), onPressed: _showSettings),
        ],
      ),
      body: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // Top Bar: Numeric Vitals
          Container(
            padding: const EdgeInsets.all(16),
            color: const Color(0xFF111111),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: [
                _buildVital("HR", "$_hr", "bpm", const Color(0xFF00FF9D)),
                _buildVital("BP", _bp, "mmHg", Colors.white),
                _buildVital("SpO2", "$_spo2", "%", const Color(0xFF00B8FF)),
              ],
            ),
          ),
          
          const Divider(color: Colors.white24, height: 1),

          // Graphs
          Expanded(
            child: Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                children: [
                  Expanded(child: _buildGraph("ECG Lead II", _ecgPoints, const Color(0xFF00FF9D), -2, 2)),
                  const SizedBox(height: 16),
                  Expanded(child: _buildGraph("Pleth", _spo2Points, const Color(0xFF00B8FF), 0, 1)),
                ],
              ),
            ),
          ),

          // Controls
          Padding(
            padding: const EdgeInsets.all(24.0),
            child: SizedBox(
              height: 56,
              child: ElevatedButton(
                onPressed: _toggleSimulation,
                style: ElevatedButton.styleFrom(
                  backgroundColor: _isSimulating ? Colors.red : const Color(0xFF00FF9D),
                  foregroundColor: Colors.black,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
                child: Text(
                  _isSimulating ? "STOP MONITORING" : "START MONITORING",
                  style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
                ),
              ),
            ),
          ),
          
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 24.0),
            child: SizedBox(
              height: 56,
              child: ElevatedButton(
                onPressed: _triggerEmergency,
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFFFF5252), // Red Accent
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  elevation: 8,
                  shadowColor: Colors.redAccent.withOpacity(0.5),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: const [
                    Icon(Icons.warning_amber_rounded, size: 28),
                    SizedBox(width: 12),
                    Text(
                      "TRIGGER EMERGENCY",
                      style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
                    ),
                  ],
                ),
              ),
            ),
          ),
          const SizedBox(height: 24),
        ],
      ),
    );
  }

  Widget _buildVital(String label, String value, String unit, Color color) {
    return Column(
      children: [
        Text(label, style: TextStyle(color: color, fontWeight: FontWeight.bold)),
        const SizedBox(height: 4),
        Text(
          value,
          style: GoogleFonts.shareTechMono(
            color: color,
            fontSize: 48,
            fontWeight: FontWeight.bold,
            shadows: [Shadow(color: color.withOpacity(0.5), blurRadius: 10)]
          ),
        ),
        Text(unit, style: const TextStyle(color: Colors.grey, fontSize: 12)),
      ],
    );
  }

  Widget _buildGraph(String title, List<FlSpot> points, Color color, double minY, double maxY) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
         Text(title, style: TextStyle(color: color, fontSize: 12, fontWeight: FontWeight.bold)),
         const SizedBox(height: 8),
         Expanded(
           child: LineChart(
             LineChartData(
               gridData: FlGridData(
                 show: true, 
                 drawVerticalLine: true,
                 getDrawingHorizontalLine: (value) => FlLine(color: const Color(0xFF00FF9D).withOpacity(0.1), strokeWidth: 1),
                 getDrawingVerticalLine: (value) => FlLine(color: const Color(0xFF00FF9D).withOpacity(0.1), strokeWidth: 1),
               ),
               titlesData: const FlTitlesData(show: false),
               borderData: FlBorderData(show: true, border: Border.all(color: Colors.white12)),
               minX: _xValue - 5 > 0 ? _xValue - 5 : 0, // Show last 5 seconds window
               maxX: _xValue, 
               minY: minY,
               maxY: maxY,
               lineBarsData: [
                 LineChartBarData(
                   spots: points,
                   isCurved: true,
                   color: color,
                   barWidth: 2,
                   dotData: const FlDotData(show: false),
                   belowBarData: BarAreaData(show: false),
                 ),
               ],
             ),
           ),
         ),
      ],
    );
  }

  void _showSettings() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text("Connection Settings"),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(
              controller: _ipController,
              decoration: const InputDecoration(labelText: "Server IP Address"),
              keyboardType: TextInputType.number,
            ),
            const SizedBox(height: 16),
            TextField(
              controller: _emailController,
              decoration: const InputDecoration(labelText: "Patient Email"),
              keyboardType: TextInputType.emailAddress,
            ),
          ],
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context), child: const Text("Cancel")),
          ElevatedButton(
            onPressed: () {
              _connect();
              Navigator.pop(context);
            },
            child: const Text("Save & Connect"),
          ),
        ],
      ),
    );
  }
}
