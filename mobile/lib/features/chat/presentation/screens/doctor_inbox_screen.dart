import 'package:flutter/material.dart';
import 'package:flutter/cupertino.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_typography.dart';
import '../../../../services/api_service.dart';

class DoctorInboxScreen extends StatefulWidget {
  const DoctorInboxScreen({super.key});

  @override
  State<DoctorInboxScreen> createState() => _DoctorInboxScreenState();
}

class _DoctorInboxScreenState extends State<DoctorInboxScreen> {
  bool _isLoading = true;
  List<dynamic> _conversations = [];

  @override
  void initState() {
    super.initState();
    _loadInbox();
  }

  Future<void> _loadInbox() async {
    try {
      final doctorId = await ApiService().getDoctorId();
      print("📬 Loading inbox for Doctor ID: $doctorId");
      
      final inbox = await ApiService().getDoctorInbox(doctorId); 
      
      if (mounted) {
        setState(() {
          _conversations = inbox;
          _isLoading = false;
        });
      }
    } catch (e) {
      if (mounted) setState(() => _isLoading = false);
      print("Error loading inbox: $e");
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('Messages', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
        backgroundColor: AppColors.background,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(CupertinoIcons.back, color: Colors.white),
          onPressed: () => context.pop(),
        ),
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : _conversations.isEmpty
              ? _buildEmptyState()
              : RefreshIndicator(
                  onRefresh: _loadInbox,
                  child: ListView.separated(
                    padding: const EdgeInsets.all(16),
                    itemCount: _conversations.length,
                    separatorBuilder: (context, index) => const SizedBox(height: 12),
                    itemBuilder: (context, index) {
                      final conv = _conversations[index];
                      return _buildConversationCard(conv);
                    },
                  ),
                ),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(CupertinoIcons.chat_bubble_2, size: 64, color: Colors.white.withOpacity(0.1)),
          const SizedBox(height: 16),
          Text('No active conversations', style: AppTypography.bodyMedium.copyWith(color: AppColors.textSecondary)),
        ],
      ),
    );
  }

  Widget _buildConversationCard(dynamic conv) {
    final patient = conv['patient']['user'];
    
    // Extract last message from messages array (server returns latest message)
    String lastMsg = 'Start a conversation';
    if (conv['messages'] != null && (conv['messages'] as List).isNotEmpty) {
      final latestMessage = conv['messages'][0];
      lastMsg = latestMessage['content'] ?? 'No content';
      
      // Truncate if too long
      if (lastMsg.length > 50) {
        lastMsg = lastMsg.substring(0, 50) + '...';
      }
    }
    
    final time = DateTime.parse(conv['lastMessageAt']);
    final timeStr = DateFormat('HH:mm').format(time);

    return ListTile(
      onTap: () {
          // Go to chat thread
          context.push('/chat/thread/${conv['id']}?patientName=${patient['name']}&patientId=${conv['patientId']}');
      },
      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      tileColor: AppColors.cardSurface,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      leading: Container(
        padding: const EdgeInsets.all(10),
        decoration: BoxDecoration(
          color: AppColors.primary.withOpacity(0.2),
          shape: BoxShape.circle,
        ),
        child: const Icon(CupertinoIcons.person_fill, color: AppColors.primary, size: 24),
      ),
      title: Text(
        patient['name'] ?? 'Unknown',
        style: AppTypography.bodyLarge.copyWith(fontWeight: FontWeight.bold, color: Colors.white),
      ),
      subtitle: Padding(
        padding: const EdgeInsets.only(top: 4.0),
        child: Text(
          lastMsg,
          style: AppTypography.bodyMedium.copyWith(color: Colors.white70),
          maxLines: 1,
          overflow: TextOverflow.ellipsis,
        ),
      ),
      trailing: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        crossAxisAlignment: CrossAxisAlignment.end,
        children: [
          Text(timeStr, style: TextStyle(color: Colors.white30, fontSize: 12)),
          const SizedBox(height: 4),
          // const Icon(CupertinoIcons.chevron_right, color: Colors.white10, size: 16),
        ],
      ),
    );
  }
}
