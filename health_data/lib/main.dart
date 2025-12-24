import 'dart:async';
import 'dart:convert';
import 'package:http/http.dart' as http;
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
  final _ipController = TextEditingController(text: '172.20.10.2');
  final _emailController = TextEditingController();
  
  StreamSubscription? _subscription;
  bool _isSimulating = false;
  bool _isConnecting = false;
  String? _accessToken;
  String _connectionStatus = 'Disconnected';
  Color _statusColor = Colors.red;
  
  // Data Buffers for Graphs
  final List<FlSpot> _ecgPoints = [];
  final List<FlSpot> _spo2Points = [];
  double _xValue = 0;

  // Current Values
  int _hr = 0;
  int _spo2 = 0;
  String _bp = "--/--";

  @override
  void initState() {
    super.initState();
    // Auto-connect on startup
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _connect();
    });
  }

  @override
  void dispose() {
    _subscription?.cancel();
    _simulationService.stop();
    _socketService.dispose();
    super.dispose();
  }

  void _toggleSimulation() {
    if (!_socketService.isConnected) {
       ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Please connect to server first!"), backgroundColor: Colors.orange),
      );
      return;
    }

    setState(() {
      _isSimulating = !_isSimulating;
    });

    if (_isSimulating) {
      _simulationService.start();
      _subscription = _simulationService.dataStream.listen((data) {
        _updateData(data);
        // Send to Server
        if (_socketService.isConnected) {
          // Add email to payload for backend lookup if needed
          if (_emailController.text.isNotEmpty) {
             data['email'] = _emailController.text;
          }
          // Default to patient 1 if no specific email
           data['patientId'] = 1; 
           
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

  Future<void> _connect() async {
    print("🔌 Starting connection to ${_ipController.text}...");
    setState(() {
      _isConnecting = true;
      _connectionStatus = 'Connecting...';
      _statusColor = Colors.orange;
    });
    
    final ip = _ipController.text;

    try {
      print("📡 Attempting login to http://$ip:3001/auth/login");
      
      // 1. Authenticate
      final response = await http.post(
        Uri.parse('http://$ip:3001/auth/login'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'email': 'patient@aura.com', 
          'password': 'password123'
        }),
      ).timeout(const Duration(seconds: 10));

      print("📥 Login response: ${response.statusCode}");
      print("📦 Response body: ${response.body}");

      if (response.statusCode == 200 || response.statusCode == 201) {
        final data = jsonDecode(response.body);
        print("📊 Parsed data keys: ${data.keys}");
        
        // Try both field names (accessToken and access_token)
        _accessToken = data['accessToken'] ?? data['access_token'];
        
        if (_accessToken != null) {
          print("✅ Login Successful. Token: ${_accessToken!.substring(0, 20)}...");
          
          // 2. Connect Socket with Token
          _socketService.connect(ip, _accessToken!);
          
          // Wait a moment for socket to connect
          await Future.delayed(const Duration(milliseconds: 500));
          
          if (mounted) {
            setState(() {
              _connectionStatus = _socketService.isConnected ? 'Connected ✓' : 'Socket connecting...';
              _statusColor = _socketService.isConnected ? Colors.green : Colors.orange;
            });
            
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(content: Text("Connected securely!"), backgroundColor: Colors.green),
            );
          }
        } else {
          throw Exception('No access token in response');
        }
      } else {
        final body = response.body;
        print("❌ Login failed: ${response.statusCode} - $body");
        throw Exception('Login Failed: ${response.statusCode}');
      }
    } catch (e) {
      print("❌ Connection Error: $e");
      print("Stack trace: ${StackTrace.current}");
      
      if (mounted) {
        setState(() {
          _connectionStatus = 'Failed: ${e.toString().substring(0, 30)}';
          _statusColor = Colors.red;
        });
        
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text("Connection Failed: $e"),
            backgroundColor: Colors.red,
            duration: const Duration(seconds: 5),
          ),
        );
      }
    } finally {
      if (mounted) setState(() => _isConnecting = false);
    }
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
      'severity': 'CRITICAL',
      'vitalType': 'FALL', // Using FALL as generic emergency proxy
      'value': 0,
      'notes': 'Manual Emergency Trigger from Simulator',
    });

    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text("EMERGENCY SIGNAL SENT!"), backgroundColor: Colors.red),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text("AURA Vitals Monitor", style: TextStyle(fontSize: 18)),
            Text(
              _connectionStatus,
              style: TextStyle(fontSize: 12, color: _statusColor),
            ),
          ],
        ),
        backgroundColor: Colors.transparent,
        elevation: 0,
        actions: [
          if (_isConnecting)
            const Padding(
              padding: EdgeInsets.all(16.0),
              child: SizedBox(
                width: 20,
                height: 20,
                child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
              ),
            )
          else
            IconButton(
              icon: Icon(
                _socketService.isConnected ? Icons.check_circle : Icons.refresh,
                color: _socketService.isConnected ? Colors.green : Colors.orange,
              ),
              onPressed: _connect,
              tooltip: 'Reconnect',
            ),
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
