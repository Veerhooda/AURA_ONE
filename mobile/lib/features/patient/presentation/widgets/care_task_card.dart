import 'package:flutter/material.dart';
import 'package:flutter/cupertino.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_typography.dart';
import 'package:intl/intl.dart';

class CareTaskCard extends StatefulWidget {
  final Map<String, dynamic> task;
  final Function(String status, String? notes) onUpdateStatus;

  const CareTaskCard({
    super.key, 
    required this.task,
    required this.onUpdateStatus,
  });

  @override
  State<CareTaskCard> createState() => _CareTaskCardState();
}

class _CareTaskCardState extends State<CareTaskCard> {
  bool _isExpanded = false;
  final TextEditingController _notesController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    final task = widget.task;
    final String priority = task['priority'] ?? 'ROUTINE';
    final String category = task['category'] ?? 'CARE';
    final DateTime dueAt = DateTime.parse(task['dueAt']);
    final isCritical = priority == 'CRITICAL';
    
    // Priority Colors
    Color priorityColor;
    if (priority == 'CRITICAL') {
      priorityColor = AppColors.error;
    } else if (priority == 'HIGH') {
      priorityColor = Colors.orange;
    } else {
      priorityColor = AppColors.primary;
    }

    // Category Icons
    IconData catIcon;
    switch (category) {
      case 'MEDICATION': catIcon = CupertinoIcons.capsule_fill; break;
      case 'VITALS': catIcon = CupertinoIcons.heart_fill; break;
      case 'CARE_PROCEDURE': catIcon = CupertinoIcons.bandage_fill; break;
      case 'DOCTOR_ORDER': catIcon = CupertinoIcons.doc_text_fill; break;
      default: catIcon = CupertinoIcons.doc_text_fill;
    }

    return Card(
      elevation: isCritical ? 4 : 1,
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      color: AppColors.cardSurface,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
        side: isCritical ? BorderSide(color: priorityColor, width: 2) : BorderSide.none,
      ),
      child: InkWell(
        onTap: () => setState(() => _isExpanded = !_isExpanded),
        borderRadius: BorderRadius.circular(16),
        child: Column(
          children: [
            // Header Strip
            Container(
              height: 4,
              decoration: BoxDecoration(
                color: priorityColor,
                borderRadius: const BorderRadius.only(
                  topLeft: Radius.circular(16),
                  topRight: Radius.circular(16),
                ),
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                children: [
                  // Top Row: Icon + Title
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Container(
                        padding: const EdgeInsets.all(10),
                        decoration: BoxDecoration(
                          color: priorityColor.withOpacity(0.15),
                          shape: BoxShape.circle,
                        ),
                        child: Icon(catIcon, color: priorityColor, size: 20),
                      ),
                      const SizedBox(width: 16),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              task['title'] ?? 'Task',
                              style: AppTypography.bodyLarge.copyWith(fontWeight: FontWeight.bold),
                            ),
                            const SizedBox(height: 4),
                            if (task['patient'] != null)
                              Text(
                                '${task['patient']['user']['name']} • Bed ${task['patient']['bed'] ?? "N/A"}',
                                style: AppTypography.bodyMedium.copyWith(color: AppColors.textSecondary),
                              ),
                          ],
                        ),
                      ),
                      Column(
                         crossAxisAlignment: CrossAxisAlignment.end,
                         children: [
                           Text(
                             DateFormat('HH:mm').format(dueAt),
                             style: AppTypography.titleMedium.copyWith(
                               color: isCritical ? AppColors.error : AppColors.textPrimary,
                               fontWeight: FontWeight.bold
                             ),
                           ),
                           Icon(
                             _isExpanded ? CupertinoIcons.chevron_up : CupertinoIcons.chevron_down,
                             color: AppColors.textSecondary,
                             size: 16,
                           )
                         ]
                      )
                    ],
                  ),
                  
                  // Validation / Details (Expanded)
                  if (_isExpanded) ...[
                    const SizedBox(height: 16),
                    Divider(color: Colors.white.withOpacity(0.1)),
                    const SizedBox(height: 16),
                    
                    if (task['description'] != null)
                      Align(
                        alignment: Alignment.centerLeft,
                        child: Padding(
                          padding: const EdgeInsets.only(bottom: 16.0),
                          child: Text(
                             task['description'],
                             style: AppTypography.bodyMedium.copyWith(fontStyle: FontStyle.italic),
                          ),
                        ),
                      ),

                    // Actions
                    Row(
                      children: [
                        Expanded(
                          child: OutlinedButton.icon(
                            onPressed: () {
                              // TODO: Show skip dialog
                              widget.onUpdateStatus('SKIPPED', 'Skipped by nurse');
                            },
                            icon: const Icon(CupertinoIcons.xmark, size: 16),
                            label: const Text('Skip'),
                            style: OutlinedButton.styleFrom(
                              foregroundColor: AppColors.textSecondary,
                              side: BorderSide(color: AppColors.textSecondary.withOpacity(0.5)),
                            ),
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: ElevatedButton.icon(
                            onPressed: () {
                               widget.onUpdateStatus('COMPLETED', _notesController.text.isNotEmpty ? _notesController.text : null);
                            },
                            icon: const Icon(CupertinoIcons.check_mark, size: 16, color: Colors.white),
                            label: const Text('Done'),
                            style: ElevatedButton.styleFrom(
                              backgroundColor: AppColors.success,
                              foregroundColor: Colors.white,
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),
                    // Optional Note Input
                    TextField(
                      controller: _notesController,
                      style: const TextStyle(fontSize: 14, color: Colors.white),
                      decoration: InputDecoration(
                        hintText: 'Add a note (optional)',
                        hintStyle: TextStyle(color: Colors.white.withOpacity(0.4)),
                        filled: true,
                        fillColor: Colors.black.withOpacity(0.2),
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(8),
                          borderSide: BorderSide.none
                        ),
                        contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                      ),
                    ),
                  ],
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
