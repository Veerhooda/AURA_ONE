import 'package:socket_io_client/socket_io_client.dart' as io;

class SocketService {
  io.Socket? _socket;
  bool get isConnected => _socket?.connected ?? false;

  void connect(String ip) {
    if (_socket != null) {
      _socket!.dispose();
    }

    print('Connecting to http://$ip:3001');
    _socket = io.io('http://$ip:3001', io.OptionBuilder()
        .setTransports(['websocket'])
        .disableAutoConnect()
        .build());

    _socket!.connect();

    _socket!.onConnect((_) {
      print('Connected to Server');
    });

    _socket!.onDisconnect((_) => print('Disconnected'));
  }

  void emitData(Map<String, dynamic> data) {
    if (_socket != null && _socket!.connected) {
      _socket!.emit('simulate_vitals', data);
    }
  }

  void emit(String event, Map<String, dynamic> data) {
    if (_socket != null && _socket!.connected) {
      _socket!.emit(event, data);
    }
  }
  
  void dispose() {
    _socket?.dispose();
  }
}
