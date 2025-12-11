import 'package:socket_io_client/socket_io_client.dart' as IO;
import 'dart:async';

class SocketService {
  static final SocketService _instance = SocketService._internal();
  factory SocketService() => _instance;

  IO.Socket? _socket;
  final _vitalsController = StreamController<Map<String, dynamic>>.broadcast();
  final _emergencyController = StreamController<Map<String, dynamic>>.broadcast();

  Stream<Map<String, dynamic>> get vitalsStream => _vitalsController.stream;
  Stream<Map<String, dynamic>> get emergencyStream => _emergencyController.stream;

  SocketService._internal();

  void init(String baseUrl) {
    if (_socket != null) return;

    // Remove "http://" or "https://" for socket connection if needed, 
    // but socket_io_client usually handles url parsing.
    // Assuming baseUrl is like "http://localhost:3000"
    _socket = IO.io(baseUrl, IO.OptionBuilder()
      .setTransports(['websocket'])
      .disableAutoConnect() 
      .build()
    );

    _socket!.onConnect((_) {
      print('Socket Connected');
    });

    _socket!.onDisconnect((_) {
      print('Socket Disconnected');
    });
    
    _socket!.on('vitals.update', (data) {
      if (data != null) {
        _vitalsController.add(Map<String, dynamic>.from(data));
      }
    });

    _socket!.on('patient.emergency', (data) {
      print("EMERGENCY RECEIVED: $data");
      if (data != null) {
        _emergencyController.add(Map<String, dynamic>.from(data));
      }
    });

    _socket!.connect();
  }

  void subscribePatient(int patientId) {
    _socket?.emit('subscribe.patient', {'patientId': patientId});
  }

  void unsubscribePatient() {
    _socket?.emit('unsubscribe.patient');
  }

  void dispose() {
    _socket?.dispose();
    _vitalsController.close();
    _emergencyController.close();
  }
}
