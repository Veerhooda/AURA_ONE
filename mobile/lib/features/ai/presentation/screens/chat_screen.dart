import 'package:flutter/material.dart';
import 'package:flutter/cupertino.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_typography.dart';
import '../../../../core/widgets/aura_app_bar.dart';
// Note: In real implementation, we would call ApiService.processVoice
// For now, we simulate the interaction here or use the mock logic

class ChatScreen extends StatefulWidget {
  const ChatScreen({super.key});

  @override
  State<ChatScreen> createState() => _ChatScreenState();
}

class _ChatScreenState extends State<ChatScreen> {
  final TextEditingController _controller = TextEditingController();
  final List<Map<String, String>> _messages = [
    {"role": "ai", "content": "Hello, I am AURA. How can I help you today?"}
  ];
  bool _isLoading = false;

  void _sendMessage() async {
    final text = _controller.text.trim();
    if (text.isEmpty) return;

    setState(() {
      _messages.add({"role": "user", "content": text});
      _controller.clear();
      _isLoading = true;
    });

    // Simulate Network Delay & AI Processing
    await Future.delayed(const Duration(seconds: 1));
    
    // Simple Local NLP Stub (replicating backend logic for smoothness if backend is offline)
    // In real app, this would be: final response = await ApiService().chat(text);
    String response = "I'm not sure I understand.";
    final lower = text.toLowerCase();
    
    if (lower.contains("heart") || lower.contains("pulse") || lower.contains("bpm")) {
      response = "Your current heart rate is 72 bpm, which is normal.";
    } else if (lower.contains("pain")) {
      response = "I am sorry to hear that. On a scale of 1 to 10, how bad is the pain?";
    } else if (lower.contains("medication") || lower.contains("pill")) {
      response = "You have Lisinopril scheduled for 8:00 AM tomorrow.";
    } else if (lower.contains("nurse") || lower.contains("help")) {
      response = "I have alerted the nurse station. They will be with you shortly.";
    }

    setState(() {
      _messages.add({"role": "ai", "content": response});
      _isLoading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: const AuraAppBar(title: "AURA Assistant"),
      body: Column(
        children: [
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.all(20),
              itemCount: _messages.length,
              itemBuilder: (context, index) {
                final msg = _messages[index];
                final isUser = msg['role'] == 'user';
                return Align(
                  alignment: isUser ? Alignment.centerRight : Alignment.centerLeft,
                  child: Container(
                    margin: const EdgeInsets.only(bottom: 16),
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                    decoration: BoxDecoration(
                      gradient: isUser ? const LinearGradient(
                        colors: [AppColors.primary, Color(0xFF00CFA0)], // Teal gradient
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                      ) : null,
                      color: isUser ? null : AppColors.surface,
                      borderRadius: BorderRadius.only(
                        topLeft: const Radius.circular(20),
                        topRight: const Radius.circular(20),
                        bottomLeft: Radius.circular(isUser ? 20 : 4),
                        bottomRight: Radius.circular(isUser ? 4 : 20),
                      ),
                      border: Border.all(color: isUser ? Colors.transparent : AppColors.surfaceHighlight),
                      boxShadow: [
                        if (isUser)
                          BoxShadow(color: AppColors.primary.withOpacity(0.3), blurRadius: 10, offset: const Offset(0, 4))
                      ]
                    ),
                    constraints: BoxConstraints(maxWidth: MediaQuery.of(context).size.width * 0.75),
                    child: Text(
                      msg['content']!,
                      style: AppTypography.bodyMedium.copyWith(
                        color: isUser ? Colors.black : Colors.white,
                        fontWeight: isUser ? FontWeight.w600 : FontWeight.normal
                      ),
                    ),
                  ),
                );
              },
            ),
          ),
          if (_isLoading)
            const Padding(
              padding: EdgeInsets.all(8.0),
              child: CupertinoActivityIndicator(color: AppColors.textSecondary),
            ),
          Container(
             padding: const EdgeInsets.fromLTRB(16, 16, 16, 32),
             decoration: BoxDecoration(
               color: AppColors.surface.withOpacity(0.95), // Glassy background
               border: Border(top: BorderSide(color: AppColors.surfaceHighlight)),
               boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.2), blurRadius: 20, offset: const Offset(0, -5))]
             ),
             child: Row(
               children: [
                 Expanded(
                   child: TextField(
                     controller: _controller,
                     style: AppTypography.bodyMedium,
                     decoration: InputDecoration(
                       hintText: "Ask about your health...",
                       hintStyle: TextStyle(color: AppColors.textSecondary),
                       filled: true,
                       fillColor: Colors.black.withOpacity(0.3),
                       border: OutlineInputBorder(
                         borderRadius: BorderRadius.circular(24),
                         borderSide: BorderSide(color: AppColors.surfaceHighlight)
                       ),
                       focusedBorder: OutlineInputBorder(
                         borderRadius: BorderRadius.circular(24),
                         borderSide: const BorderSide(color: AppColors.primary)
                       ),
                       contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
                     ),
                     onSubmitted: (_) => _sendMessage(),
                   ),
                 ),
                 const SizedBox(width: 12),
                 Container(
                   decoration: BoxDecoration(
                     color: AppColors.primary,
                     shape: BoxShape.circle,
                     boxShadow: [BoxShadow(color: AppColors.primary.withOpacity(0.4), blurRadius: 10)]
                   ),
                   child: IconButton(
                     onPressed: _sendMessage,
                     icon: const Icon(CupertinoIcons.arrow_up, size: 24, color: Colors.black),
                   ),
                 )
               ],
             ),
          )
        ],
      ),
    );
  }
}
