import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter/cupertino.dart';
import 'dart:ui' as ui;
import 'dart:typed_data';
import '../../../../core/theme/app_colors.dart';
import '../../../../services/api_service.dart';

class RecoveryGraphCard extends StatefulWidget {
  final int patientId;
  const RecoveryGraphCard({super.key, required this.patientId});

  @override
  State<RecoveryGraphCard> createState() => _RecoveryGraphCardState();
}

class _RecoveryGraphCardState extends State<RecoveryGraphCard> {
  bool _isLoading = false;
  String? _error;
  String? _summary;
  String? _imageBase64;
  Uint8List? _imageBytes; // Cache decoded bytes
  bool _loaded = false;

  Future<void> _generateGraph() async {
    setState(() {
      _isLoading = true;
      _error = null;
    });

    try {
      final data = await ApiService().getRecoverySummary(widget.patientId);
      print("DEBUG: Recovery Graph Response: $data");
      print("DEBUG: recovery_graph_url type: ${data['recovery_graph_url'].runtimeType}");

      if (mounted) {
        setState(() {
          _summary = data['summary'];
          if (data['recovery_graph_url'] is String) {
            _imageBase64 = data['recovery_graph_url'];
            // Decode once here, not in build
            try {
              _imageBytes = base64Decode(_imageBase64!);
              print('✅ Decoded ${_imageBytes!.length} bytes');
            } catch (e) {
              print("❌ Base64 decode failed: $e");
              _imageBytes = null;
              _error = "Invalid image data";
            }
          } else {
            print("ERROR: recovery_graph_url is NOT a string. Value: ${data['recovery_graph_url']}");
            _imageBase64 = null;
            _imageBytes = null;
            _error = "Invalid graph format from AI";
          }
          _isLoading = false;
          _loaded = true;
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _error = "Could not generate analysis. Ensure AI service is active.";
          _isLoading = false;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.black.withOpacity(0.6), // Increased opacity since blur is gone
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: AppColors.info.withOpacity(0.2)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Row(
                children: [
                  Icon(CupertinoIcons.graph_circle_fill, color: AppColors.info),
                  SizedBox(width: 8),
                  Text("AI Recovery Analysis", style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16)),
                ],
              ),
              if (!_isLoading && !_loaded)
                ElevatedButton(
                  onPressed: _generateGraph,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.info.withOpacity(0.2),
                    foregroundColor: AppColors.info,
                    elevation: 0,
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 0),
                    side: const BorderSide(color: AppColors.info),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20))
                  ),
                  child: const Text("Generate", style: TextStyle(fontSize: 12)),
                )
            ],
          ),
          
          if (_isLoading)
            const Padding(
              padding: EdgeInsets.symmetric(vertical: 30),
              child: Center(
                child: Column(
                  children: [
                    CupertinoActivityIndicator(color: AppColors.info),
                    SizedBox(height: 10),
                    Text("Analyzing patient history...", style: TextStyle(color: Colors.white54, fontSize: 12))
                  ],
                ),
              ),
            ),

          if (_error != null)
             Padding(
               padding: const EdgeInsets.only(top: 16),
               child: Text(_error!, style: const TextStyle(color: AppColors.error)),
             ),

          if (_loaded && !_isLoading) ...[
            const SizedBox(height: 16),
            Text(
              _summary ?? "No summary available.",
              style: const TextStyle(color: Colors.white70, fontSize: 13, height: 1.4, fontStyle: FontStyle.italic),
            ),
            const SizedBox(height: 16),
            if (_imageBase64 != null) _buildGraphImage(),
          ]
        ],
      ),
    );
  }

  Widget _buildGraphImage() {
    // Use cached bytes instead of decoding every frame
    if (_imageBytes == null) {
      return const Padding(
         padding: EdgeInsets.all(20.0),
         child: Center(child: Text("Invalid Graph Data", style: TextStyle(color: Colors.white38))),
      );
    }

    return Container(
      width: double.infinity,
      height: 250, // Explicit height for the graph
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.white10),
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(16),
        child: Image.memory(
          _imageBytes!, // Use cached bytes
          fit: BoxFit.contain,
          errorBuilder: (c,e,s) {
            print("❌ Image.memory errorBuilder: $e");
            return const Padding(
              padding: EdgeInsets.all(20.0),
              child: Center(child: Text("Error displaying graph", style: TextStyle(color: Colors.white38))),
            );
          },
        ),
      ),
    );
  }

}
