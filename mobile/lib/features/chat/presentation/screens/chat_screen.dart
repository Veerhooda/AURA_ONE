import 'package:flutter/material.dart';
import 'package:flutter/cupertino.dart';
import 'dart:ui' as ui;
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_typography.dart';
import '../../../../services/api_service.dart';
import '../../../../services/socket_service.dart';

class ChatScreen extends StatefulWidget {
  final int recipientId;
  final String recipientName;
  
  const ChatScreen({
    super.key,
    required this.recipientId,
    required this.recipientName,
  });

  @override
  State<ChatScreen> createState() => _ChatScreenState();
}

class _ChatScreenState extends State<ChatScreen> {
  final TextEditingController _messageController = TextEditingController();
  List<Map<String, dynamic>> _messages = [];
  int? _currentUserId;
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _initChat();
  }

  Future<void> _initChat() async {
    _currentUserId = await ApiService().getPatientId();
    if (_currentUserId != null) {
      // Subscribe to user's messages
      SocketService().subscribeToUser(_currentUserId!);
      
      // Load history
      final history = await ApiService().getChatHistory(_currentUserId!, widget.recipientId);
      
      if (mounted) {
        setState(() {
          _messages = history.cast<Map<String, dynamic>>();
          _isLoading = false;
        });
      }

      // Listen to real-time messages
      SocketService().messagesStream.listen((message) {
        if (mounted && 
            ((message['senderId'] == _currentUserId && message['recipientId'] == widget.recipientId) ||
             (message['senderId'] == widget.recipientId && message['recipientId'] == _currentUserId))) {
          setState(() {
            _messages.add(message);
          });
        }
      });
    }
  }

  void _sendMessage() {
    if (_messageController.text.trim().isEmpty || _currentUserId == null) return;

    final messageText = _messageController.text.trim();
    SocketService().sendMessage(_currentUserId!, widget.recipientId, messageText);
    _messageController.clear();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      extendBodyBehindAppBar: true,
      body: Stack(
        children: [
          // Background Gradient
          Container(
            decoration: const BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [Color(0xFF0F172A), Color(0xFF1E293B), Color(0xFF0F172A)],
              ),
            ),
          ),

          // Content
          SafeArea(
            child: Column(
              children: [
                // Glass App Bar
                ClipRRect(
                  child: BackdropFilter(
                    filter: ui.ImageFilter.blur(sigmaX: 10, sigmaY: 10),
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                      decoration: BoxDecoration(
                        color: Colors.white.withOpacity(0.05),
                        border: Border(bottom: BorderSide(color: Colors.white.withOpacity(0.1))),
                      ),
                      child: Row(
                        children: [
                          IconButton(
                            icon: const Icon(CupertinoIcons.back, color: Colors.white),
                            onPressed: () => Navigator.pop(context),
                          ),
                          const SizedBox(width: 8),
                          Container(
                            width: 40, height: 40,
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              gradient: LinearGradient(colors: [AppColors.primary, AppColors.accent]),
                            ),
                            child: const Icon(CupertinoIcons.person_fill, color: Colors.white, size: 20),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(widget.recipientName, style: AppTypography.titleMedium.copyWith(color: Colors.white, fontWeight: FontWeight.bold)),
                                Text("Online", style: const TextStyle(color: Colors.white54, fontSize: 12)),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),

                // Messages List
                Expanded(
                  child: _isLoading
                      ? const Center(child: CupertinoActivityIndicator(color: AppColors.primary))
                      : _messages.isEmpty
                          ? Center(
                              child: Text("No messages yet. Start the conversation!", 
                                  style: TextStyle(color: Colors.white38)),
                            )
                          : ListView.builder(
                              padding: const EdgeInsets.all(20),
                              itemCount: _messages.length,
                              itemBuilder: (context, index) => _buildMessageBubble(_messages[index]),
                            ),
                ),

                // Input Field
                _buildInputField(),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildMessageBubble(Map<String, dynamic> message) {
    final isMine = message['senderId'] == _currentUserId;
    final timestamp = message['timestamp'] != null 
        ? DateTime.parse(message['timestamp']).toLocal() 
        : DateTime.now();
    final timeStr = "${timestamp.hour}:${timestamp.minute.toString().padLeft(2, '0')}";

    return Align(
      alignment: isMine ? Alignment.centerRight : Alignment.centerLeft,
      child: Container(
        margin: const EdgeInsets.only(bottom: 12),
        constraints: BoxConstraints(maxWidth: MediaQuery.of(context).size.width * 0.7),
        child: ClipRRect(
          borderRadius: BorderRadius.only(
            topLeft: const Radius.circular(16),
            topRight: const Radius.circular(16),
            bottomLeft: isMine ? const Radius.circular(16) : Radius.zero,
            bottomRight: isMine ? Radius.zero : const Radius.circular(16),
          ),
          child: BackdropFilter(
            filter: ui.ImageFilter.blur(sigmaX: 10, sigmaY: 10),
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              decoration: BoxDecoration(
                color: isMine 
                    ? AppColors.primary.withOpacity(0.3) 
                    : Colors.white.withOpacity(0.05),
                border: Border.all(color: Colors.white.withOpacity(0.1)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(message['message'] ?? '', 
                      style: AppTypography.bodyMedium.copyWith(color: Colors.white)),
                  const SizedBox(height: 4),
                  Text(timeStr, style: const TextStyle(color: Colors.white38, fontSize: 10)),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildInputField() {
    return ClipRRect(
      child: BackdropFilter(
        filter: ui.ImageFilter.blur(sigmaX: 10, sigmaY: 10),
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          decoration: BoxDecoration(
            color: Colors.white.withOpacity(0.05),
            border: Border(top: BorderSide(color: Colors.white.withOpacity(0.1))),
          ),
          child: Row(
            children: [
              Expanded(
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  decoration: BoxDecoration(
                    color: Colors.white.withOpacity(0.05),
                    borderRadius: BorderRadius.circular(24),
                    border: Border.all(color: Colors.white.withOpacity(0.1)),
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
              const SizedBox(width: 12),
              GestureDetector(
                onTap: _sendMessage,
                child: Container(
                  width: 48, height: 48,
                  decoration: BoxDecoration(
                    gradient: const LinearGradient(colors: [AppColors.primary, AppColors.accent]),
                    shape: BoxShape.circle,
                    boxShadow: [BoxShadow(color: AppColors.primary.withOpacity(0.4), blurRadius: 10)],
                  ),
                  child: const Icon(CupertinoIcons.paperplane_fill, color: Colors.white, size: 20),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  @override
  void dispose() {
    _messageController.dispose();
    super.dispose();
  }
}
