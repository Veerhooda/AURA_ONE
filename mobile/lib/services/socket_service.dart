import 'package:socket_io_client/socket_io_client.dart' as IO;
import 'dart:async';

class SocketService {
  static final SocketService _instance = SocketService._internal();
  factory SocketService() => _instance;

  IO.Socket? _socket;
  final _vitalsController = StreamController<Map<String, dynamic>>.broadcast();
  final _emergencyController = StreamController<Map<String, dynamic>>.broadcast();
  final _messagesController = StreamController<Map<String, dynamic>>.broadcast();

  Stream<Map<String, dynamic>> get vitalsStream => _vitalsController.stream;
  Stream<Map<String, dynamic>> get emergencyStream => _emergencyController.stream;
  Stream<Map<String, dynamic>> get messagesStream => _messagesController.stream;

  SocketService._internal();

  void init(String baseUrl) {
    if (_socket != null) return;

    // Remove "http://" or "https://" for socket connection if needed, 
    // but socket_io_client usually handles url parsing.
    // Use the provided baseUrl directly
    // Ideally pass the full URL from main.dart or a config
    // For now, ensuring we trust the argument passed to init()
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
      print('📊 VITALS RECEIVED ON CLIENT: $data');
      if (data != null) {
        _vitalsController.add(data);
        print('✅ Vitals added to stream');
      } else {
        print('❌ Received null vitals data');
      }
    });

    _socket!.on('patient.emergency', (data) {
      print("EMERGENCY RECEIVED: $data");
      if (data != null) {
        _emergencyController.add(Map<String, dynamic>.from(data));
      }
    });

    _socket!.on('receiveMessage', (data) {
      print("MESSAGE RECEIVED: $data");
      if (data != null) {
        _messagesController.add(Map<String, dynamic>.from(data));
      }
    });

    _socket!.connect();
  }

  void subscribePatient(dynamic patientId) {
    print('🔔 Subscribing to patient: $patientId');
    _socket?.emit('subscribe.patient', {'patientId': patientId});
  }

  void unsubscribePatient() {
    _socket?.emit('unsubscribe.patient');
  }

  void subscribeToUser(int userId) {
    _socket?.emit('subscribe.user', {'userId': userId});
  }

  void sendMessage(int senderId, int recipientId, String message) {
    _socket?.emit('sendMessage', {
      'senderId': senderId,
      'recipientId': recipientId,
      'message': message,
    });
  }

  void dispose() {
    _socket?.dispose();
    _vitalsController.close();
    _emergencyController.close();
    _messagesController.close();
  }
}
