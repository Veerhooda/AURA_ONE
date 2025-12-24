import 'package:flutter/material.dart';
import 'package:flutter/cupertino.dart';
import 'dart:ui' as ui;
import 'dart:convert';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_typography.dart';
import '../../../../services/api_service.dart';
import '../../../../services/socket_service.dart';

class ChatThreadScreen extends StatefulWidget {
  final int conversationId;
  final String patientName;
  final int patientId; // For fetching vitals to share

  const ChatThreadScreen({
    super.key,
    required this.conversationId,
    required this.patientName,
    required this.patientId,
  });

  @override
  State<ChatThreadScreen> createState() => _ChatThreadScreenState();
}

class _ChatThreadScreenState extends State<ChatThreadScreen> {
  final TextEditingController _messageController = TextEditingController();
  final ScrollController _scrollController = ScrollController();
  List<dynamic> _messages = [];
  bool _isLoading = true;
  int? _currentUserId; // To check "isMine"

  @override
  void initState() {
    super.initState();
    _initChat();
  }
  
  void _scrollToBottom() {
    if (_scrollController.hasClients) {
      _scrollController.animateTo(
        _scrollController.position.maxScrollExtent + 100, 
        duration: const Duration(milliseconds: 300), 
        curve: Curves.easeOut
      );
    }
  }

  Future<void> _initChat() async {
    // 1. Join Room
    SocketService().joinConversation(widget.conversationId);
    
    // 2. Load History
    try {
      final history = await ApiService().getConversationMessages(widget.conversationId);
      if (mounted) {
        setState(() {
          _messages.clear(); // Clear first
          _messages.addAll(history); // Use addAll instead of reassignment
        });
        print("📚 Loaded ${history.length} historical messages");
      }
    } catch (e) {
      print("Error loading history: $e");
    }
    
    _isLoading = false; 
    
    // Determine Identity
    final pid = await ApiService().getPatientId();
    _currentUserId = pid ?? 1;

    SocketService().messagesStream.listen((message) {
      print("📩 Chat message received in stream: $message");
      print("📊 Current conversation ID: ${widget.conversationId}");
      print("📊 Message conversation ID: ${message['conversationId']}");
      print("📊 Match: ${message['conversationId'] == widget.conversationId}");
      print("📊 Current _messages length BEFORE: ${_messages.length}");
      
      if (mounted && message['conversationId'] == widget.conversationId) {
        print("✅ Adding message to UI");
        setState(() {
          _messages.add(message);
          print("📊 _messages length AFTER: ${_messages.length}");
        });
        Future.delayed(const Duration(milliseconds: 100), _scrollToBottom);
      } else {
        print("❌ Message filtered out - not for this conversation");
      }
    });
  }

  void _sendMessage({String type = 'TEXT', int? linkedVitalsId}) {
    if (_messageController.text.trim().isEmpty && type == 'TEXT') return;

    final content = _messageController.text.trim();
    
    // Send via Socket
    SocketService().sendChatMessage(
      _currentUserId!, 
      widget.conversationId, 
      type == 'VITALS_ALERT' ? 'Shared Vitals Snapshot' : content,
      type: type,
      linkedVitalsId: linkedVitalsId
    );
    
    _messageController.clear();
  }

  void _shareVitals() {
    final vitals = SocketService().lastVitals;
    if (vitals == null) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text("No live vitals data available")));
      return;
    }
    
    // Serialize vitals to content string for MVP (or use linkedVitalsId in full implementation)
    // We prefix with "VITALS:" to denote it carries data, or just rely on type='VITALS_ALERT'
    final content = 'VITALS_JAILBREAK:${jsonEncode(vitals)}'; // Using a jailbreak prefix to store JSON in content
    
    // Or better: Just put JSON in content.
    // _sendMessage uses type 'VITALS_ALERT'.
    
    // Sending...
    SocketService().sendChatMessage(
      _currentUserId!, 
      widget.conversationId, 
      jsonEncode(vitals), // Content IS the JSON
      type: 'VITALS_ALERT'
    );
    Navigator.pop(context); // Close sheet
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      extendBodyBehindAppBar: true,
      backgroundColor: AppColors.background,
      appBar: AppBar(
        flexibleSpace: ClipRRect(
          child: BackdropFilter(
            filter: ui.ImageFilter.blur(sigmaX: 10, sigmaY: 10),
            child: Container(color: Colors.white.withOpacity(0.05)),
          ),
        ),
        backgroundColor: Colors.transparent,
        elevation: 0,
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(widget.patientName, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.white)),
            const Text("Online", style: TextStyle(fontSize: 12, color: AppColors.success)),
          ],
        ),
        leading: const BackButton(color: Colors.white),
        actions: [
          IconButton(
            icon: const Icon(CupertinoIcons.video_camera_solid, color: Colors.white),
            onPressed: () {}, 
          )
        ],
      ),
      body: Column(
        children: [
          Expanded(
            child: ListView.builder(
              controller: _scrollController,
              padding: const EdgeInsets.only(top: 100, bottom: 20, left: 16, right: 16),
              itemCount: _messages.length,
              itemBuilder: (context, index) {
                return _buildSmartBubble(_messages[index]);
              },
            ),
          ),
          _buildInputArea(),
        ],
      ),
    );
  }

  Widget _buildSmartBubble(dynamic msg) {
    final bool isMine = msg['senderId'] == _currentUserId;
    final String type = msg['type'] ?? 'TEXT';
    
    Widget contentWidget;
    
    if (type == 'VITALS_ALERT') {
      // Try to parse JSON
      String hr = "--";
      String spo2 = "--";
      String bp = "--"; // Vitals might not have BP
      
      try {
        final data = jsonDecode(msg['content']);
        hr = data['hr']?.toString() ?? "--";
        spo2 = data['spo2'] != null ? "${data['spo2']}%" : "--";
        // BP provided? Not usually in simple simulation
      } catch (e) {
        // Fallback for mock messages
        if (msg['content'] == 'Shared Vitals Snapshot') {
          hr = "120"; // Mock
          spo2 = "98%";
        }
      }

      contentWidget = Container(
        width: 200,
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: AppColors.error.withOpacity(0.2),
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: AppColors.error),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(CupertinoIcons.heart_fill, color: AppColors.error, size: 16),
                const SizedBox(width: 8),
                Text("Vitals Snapshot", style: TextStyle(color: AppColors.error, fontWeight: FontWeight.bold)),
              ],
            ),
            const SizedBox(height: 12),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                    Text("HEART RATE", style: TextStyle(color: Colors.white54, fontSize: 10)),
                    Text("$hr bpm", style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16)),
                ]),
                Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                    Text("SpO2", style: TextStyle(color: Colors.white54, fontSize: 10)),
                    Text(spo2, style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16)),
                ]),
              ],
            )
          ],
        ),
      );
    } else {
      contentWidget = Text(msg['content'] ?? '', style: const TextStyle(color: Colors.white));
    }

    return Align(
        alignment: isMine ? Alignment.centerRight : Alignment.centerLeft,
        child: Container(
          margin: const EdgeInsets.only(bottom: 12),
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          decoration: BoxDecoration(
            color: isMine ? AppColors.primary : Colors.white.withOpacity(0.1),
            borderRadius: BorderRadius.only(
              topLeft: const Radius.circular(20),
              topRight: const Radius.circular(20),
              bottomLeft: isMine ? const Radius.circular(20) : Radius.zero,
              bottomRight: isMine ? Radius.zero : const Radius.circular(20),
            ),
          ),
          child: contentWidget,
        ),
      );
  }

  Widget _buildInputArea() {
    return Container(
      padding: const EdgeInsets.fromLTRB(16, 12, 16, 30),
      color: Colors.black.withOpacity(0.4),
      child: Row(
        children: [
          IconButton(
            icon: const Icon(CupertinoIcons.add_circled, color: AppColors.primary),
            onPressed: () {
               // Show Action Sheet (Vitals, Image)
               showCupertinoModalPopup(context: context, builder: (c) => CupertinoActionSheet(
                 actions: [
                   CupertinoActionSheetAction(
                     onPressed: _shareVitals, 
                     child: const Text('Share Vitals Snapshot')
                   ),
                   CupertinoActionSheetAction(
                     onPressed: () {}, 
                     child: const Text('Attach Photo')
                   ),
                 ],
                 cancelButton: CupertinoActionSheetAction(
                   onPressed: () => Navigator.pop(c),
                   child: const Text('Cancel'),
                 ),
               ));
            },
          ),
          Expanded(
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              decoration: BoxDecoration(
                color: Colors.white.withOpacity(0.1),
                borderRadius: BorderRadius.circular(24),
              ),
              child: TextField(
                controller: _messageController,
                style: const TextStyle(color: Colors.white),
                decoration: const InputDecoration(
                  hintText: "Type a message...",
                  hintStyle: TextStyle(color: Colors.white38),
                  border: InputBorder.none,
                ),
                onSubmitted: (_) => _sendMessage(),
              ),
            ),
          ),
          const SizedBox(width: 8),
          IconButton(
            icon: const Icon(CupertinoIcons.arrow_up_circle_fill, color: AppColors.primary, size: 36),
            onPressed: () => _sendMessage(),
          ),
        ],
      ),
    );
  }
}
