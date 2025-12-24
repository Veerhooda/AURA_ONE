import 'package:socket_io_client/socket_io_client.dart' as IO;
import 'dart:async';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

/**
 * Finding #1: WebSocket Service with Auto-Reconnection and Re-Subscription
 */
class SocketService {
  static final SocketService _instance = SocketService._internal();
  factory SocketService() => _instance;

  IO.Socket? _socket;
  IO.Socket? _chatSocket;
  Map<String, dynamic>? _lastVitals;
  Map<String, dynamic>? get lastVitals => _lastVitals;
  
  final _storage = const FlutterSecureStorage();

  // Finding #1: Track active subscriptions for re-subscription
  final Set<int> _subscribedPatients = {};
  final Set<int> _subscribedUsers = {};
  final Set<int> _subscribedConversations = {};
  bool _isReconnecting = false;

  final _vitalsController = StreamController<Map<String, dynamic>>.broadcast();
  final _emergencyController = StreamController<Map<String, dynamic>>.broadcast();
  final _messagesController = StreamController<Map<String, dynamic>>.broadcast();

  Stream<Map<String, dynamic>> get vitalsStream => _vitalsController.stream;
  Stream<Map<String, dynamic>> get emergencyStream => _emergencyController.stream;
  Stream<Map<String, dynamic>> get messagesStream => _messagesController.stream;

  SocketService._internal();

  Future<void> init(String baseUrl) async {
    if (_socket != null) return;
    
    final token = await _storage.read(key: 'jwt_token');

    if (token == null) {
      print('❌ Socket Init Failed: No JWT Token found. Please login first.');
      return;
    }

    // Main Socket (Events, Vitals)
    _socket = IO.io(baseUrl, IO.OptionBuilder()
      .setTransports(['websocket'])
      .disableAutoConnect()
      .setAuth({'token': token})
      .setQuery({'token': token}) // Fallback
      .build()
    );

    // Finding #1: Handle reconnection with re-subscription
    _socket!.onConnect((_) {
      print('✅ Socket Connected');
      if (_isReconnecting) {
        print('🔄 Reconnected - re-subscribing to rooms');
        _resubscribeAll();
      }
      _isReconnecting = false;
    });

    _socket!.onDisconnect((_) {
      print('❌ Socket Disconnected');
      _isReconnecting = true;
    });

    _socket!.on('vitals.update', (data) {
      if (data != null) {
        _lastVitals = data;
        _vitalsController.add(data);
      }
    });

    _socket!.on('patient.emergency', (data) {
      if (data != null) _emergencyController.add(Map<String, dynamic>.from(data));
    });

    _socket!.connect();

    // Chat Socket
    _chatSocket = IO.io('$baseUrl/chat', IO.OptionBuilder()
      .setTransports(['websocket'])
      .disableAutoConnect()
      .setAuth({'token': token})
      .setQuery({'token': token}) // Fallback
      .build()
    );

    _chatSocket!.onConnect((_) {
      print('💬 Chat Socket Connected');
      if (_isReconnecting) {
        _resubscribeConversations();
      }
    });

    _chatSocket!.on('newMessage', (data) {
      print("💬 MESSAGE RECEIVED: $data");
      if (data != null) {
        _messagesController.add(Map<String, dynamic>.from(data));
      }
    });

    _chatSocket!.connect();
  }

  /**
   * Finding #1: Re-subscribe to all rooms after reconnection
   */
  void _resubscribeAll() {
    print('🔄 Re-subscribing to ${_subscribedPatients.length} patients and ${_subscribedUsers.length} users');
    
    for (final patientId in _subscribedPatients) {
      _socket?.emit('subscribe.patient', {'patientId': patientId});
      print('✅ Re-subscribed to patient $patientId');
    }

    for (final userId in _subscribedUsers) {
      _socket?.emit('subscribe.user', {'userId': userId});
      print('✅ Re-subscribed to user $userId');
    }
  }

  /**
   * Finding #1: Re-subscribe to conversations
   */
  void _resubscribeConversations() {
    for (final conversationId in _subscribedConversations) {
      _chatSocket?.emit('joinConversation', {'conversationId': conversationId});
      print('✅ Re-subscribed to conversation $conversationId');
    }
  }

  /**
   * Finding #1: Subscribe to patient with tracking (idempotent)
   */
  void subscribeToPatient(int patientId) {
    _socket?.emit('subscribe.patient', {'patientId': patientId});
    _subscribedPatients.add(patientId);
    print('📡 Subscribed to patient $patientId');
  }

  // Alias for backward compatibility
  void subscribePatient(int patientId) => subscribeToPatient(patientId);

  /**
   * Finding #1: Unsubscribe from patient with tracking
   */
  void unsubscribeFromPatient(int patientId) {
    _socket?.emit('unsubscribe.patient', {'patientId': patientId});
    _subscribedPatients.remove(patientId);
    print('📡 Unsubscribed from patient $patientId');
  }

  /**
   * Finding #1: Subscribe to user with tracking
   */
  void subscribeToUser(int userId) {
    _socket?.emit('subscribe.user', {'userId': userId});
    _subscribedUsers.add(userId);
    print('📡 Subscribed to user $userId');
  }

  /**
   * Finding #1: Join conversation with tracking
   */
  void joinConversation(int conversationId) {
    _chatSocket?.emit('joinConversation', {'conversationId': conversationId});
    _subscribedConversations.add(conversationId);
    print('💬 Joined conversation $conversationId');
  }

  void sendChatMessage(int senderId, int conversationId, String content, {String senderType = 'DOCTOR', String type = 'TEXT', int? linkedVitalsId}) {
    _chatSocket?.emit('sendMessage', {
      'senderId': senderId,
      'conversationId': conversationId,
      'content': content,
      'senderType': senderType,
      'type': type,
      if (linkedVitalsId != null) 'linkedVitalsId': linkedVitalsId,
    });
  }

  // Legacy method support
  void sendMessage(int senderId, int recipientId, String message) {
     // For legacy calls, we might not have conversationId. 
     // This needs to be handled or updated in the UI. 
     // For now, doing nothing to prevent crash, but UI should be updated to use sendChatMessage
     print('⚠️ sendMessage called (deprecated). Use sendChatMessage');
  }

  void dispose() {
    _socket?.disconnect();
    _chatSocket?.disconnect();
    _vitalsController.close();
    _emergencyController.close();
    _messagesController.close();
    _subscribedPatients.clear();
    _subscribedUsers.clear();
    _subscribedConversations.clear();
  }
}
