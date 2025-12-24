import 'package:flutter/material.dart';

/**
 * Finding #7: Conflict Resolution Dialog
 * Shows when offline edit conflicts with server data
 */
class ConflictResolutionDialog extends StatefulWidget {
  final Map<String, dynamic> yourData;
  final Map<String, dynamic> serverData;
  final Function(Map<String, dynamic>) onResolve;

  const ConflictResolutionDialog({
    Key? key,
    required this.yourData,
    required this.serverData,
    required this.onResolve,
  }) : super(key: key);

  @override
  State<ConflictResolutionDialog> createState() => _ConflictResolutionDialogState();
}

class _ConflictResolutionDialogState extends State<ConflictResolutionDialog> {
  late Map<String, dynamic> _resolvedData;

  @override
  void initState() {
    super.initState();
    // Default: Use server data (safe default)
    _resolvedData = Map.from(widget.serverData);
  }

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: const Row(
        children: [
          Icon(Icons.warning_amber_rounded, color: Colors.orange),
          SizedBox(width: 8),
          Text('Data Conflict Detected'),
        ],
      ),
      content: SingleChildScrollView(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'This patient\'s data was modified by another user while you were offline. Please choose which version to keep:',
              style: TextStyle(fontSize: 14),
            ),
            const SizedBox(height: 16),
            _buildConflictComparison(),
          ],
        ),
      ),
      actions: [
        TextButton(
          onPressed: () => Navigator.pop(context),
          child: const Text('Cancel'),
        ),
        ElevatedButton(
          onPressed: () {
            widget.onResolve(_resolvedData);
            Navigator.pop(context);
          },
          child: const Text('Save Resolution'),
        ),
      ],
    );
  }

  Widget _buildConflictComparison() {
    final conflicts = _findConflicts();

    return Column(
      children: conflicts.map((conflict) {
        return Card(
          margin: const EdgeInsets.only(bottom: 12),
          child: Padding(
            padding: const EdgeInsets.all(12),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  conflict['field'],
                  style: const TextStyle(fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 8),
                RadioListTile<String>(
                  title: Text('Your version: ${conflict['yourValue']}'),
                  subtitle: const Text('(Your offline change)'),
                  value: 'yours',
                  groupValue: _resolvedData[conflict['field']] == conflict['yourValue'] ? 'yours' : 'server',
                  onChanged: (value) {
                    setState(() {
                      _resolvedData[conflict['field']] = conflict['yourValue'];
                    });
                  },
                ),
                RadioListTile<String>(
                  title: Text('Server version: ${conflict['serverValue']}'),
                  subtitle: const Text('(Latest from server)'),
                  value: 'server',
                  groupValue: _resolvedData[conflict['field']] == conflict['serverValue'] ? 'server' : 'yours',
                  onChanged: (value) {
                    setState(() {
                      _resolvedData[conflict['field']] = conflict['serverValue'];
                    });
                  },
                ),
              ],
            ),
          ),
        );
      }).toList(),
    );
  }

  List<Map<String, dynamic>> _findConflicts() {
    final conflicts = <Map<String, dynamic>>[];

    widget.yourData.forEach((key, yourValue) {
      final serverValue = widget.serverData[key];
      if (yourValue != serverValue && key != 'version' && key != 'updatedAt') {
        conflicts.add({
          'field': _formatFieldName(key),
          'yourValue': yourValue?.toString() ?? 'null',
          'serverValue': serverValue?.toString() ?? 'null',
        });
      }
    });

    return conflicts;
  }

  String _formatFieldName(String key) {
    // Convert camelCase to Title Case
    return key
        .replaceAllMapped(RegExp(r'([A-Z])'), (match) => ' ${match.group(1)}')
        .trim()
        .split(' ')
        .map((word) => word[0].toUpperCase() + word.substring(1))
        .join(' ');
  }
}
