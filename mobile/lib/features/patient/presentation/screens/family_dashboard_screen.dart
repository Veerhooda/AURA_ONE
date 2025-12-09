import 'package:flutter/material.dart';
import 'package:flutter/cupertino.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_typography.dart';
import '../../../../core/widgets/aura_app_bar.dart';

class FamilyDashboardScreen extends StatelessWidget {
  const FamilyDashboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    // Stub data matching backend response format
    final myPatients = [
      {
        "relation": "Father",
        "name": "John Doe",
        "ward": "Building A, Floor 2",
        "status": "Stable",
        "lastSeen": "10 mins ago",
        "alerts": 0
      },
       {
        "relation": "Mother",
        "name": "Jane Doe",
        "ward": "ICU, Room 101",
        "status": "Critical",
        "lastSeen": "Just now",
        "alerts": 2
      }
    ];

    return Scaffold(
      appBar: const AuraAppBar(title: "Family Guardian"),
      body: ListView.separated(
        padding: const EdgeInsets.all(20),
        itemCount: myPatients.length,
        separatorBuilder: (c, i) => const SizedBox(height: 24),
        itemBuilder: (context, index) {
          final p = myPatients[index];
          final hasAlerts = (p['alerts'] as int) > 0;

          return Container(
            decoration: BoxDecoration(
              color: AppColors.surface,
              borderRadius: BorderRadius.circular(24),
              border: Border.all(color: hasAlerts ? AppColors.error : AppColors.surfaceHighlight),
              boxShadow: [
                 BoxShadow(
                   color: (hasAlerts ? AppColors.error : Colors.black).withOpacity(0.1),
                   blurRadius: 10,
                   offset: const Offset(0,5)
                 )
              ]
            ),
            child: Column(
              children: [
                // Header
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: hasAlerts ? AppColors.error.withOpacity(0.1) : AppColors.primary.withOpacity(0.1),
                    borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
                  ),
                  child: Row(
                    children: [
                      CircleAvatar(
                        backgroundColor: hasAlerts ? AppColors.error : AppColors.primary,
                        child: Icon(
                          hasAlerts ? CupertinoIcons.exclamationmark : CupertinoIcons.person_fill,
                          color: Colors.white,
                        ),
                      ),
                      const SizedBox(width: 16),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(p['relation'] as String, style: AppTypography.labelLarge.copyWith(color: AppColors.textSecondary)),
                          Text(p['name'] as String, style: AppTypography.titleMedium),
                        ],
                      ),
                      const Spacer(),
                      if (hasAlerts)
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                          decoration: BoxDecoration(
                            color: AppColors.error,
                            borderRadius: BorderRadius.circular(12)
                          ),
                          child: Text("${p['alerts']} Alerts", style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 12)),
                        )
                    ],
                  ),
                ),
                
                // Status Map Stub
                Container(
                  height: 150,
                  width: double.infinity,
                  decoration: BoxDecoration(
                    color: Colors.black26,
                    image: const DecorationImage(
                      image: NetworkImage("https://www.transparenttextures.com/patterns/black-scales.png"), // Subtle texture if available, or just gradient
                      opacity: 0.1,
                      repeat: ImageRepeat.repeat,
                    ),
                    gradient: LinearGradient(
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                      colors: [
                        Colors.black.withOpacity(0.8),
                         Colors.black.withOpacity(0.4),
                      ]
                    )
                  ), 
                  child: Stack(
                    alignment: Alignment.center,
                    children: [
                      // Placeholder for map
                      Icon(CupertinoIcons.map_fill, size: 64, color: AppColors.textSecondary.withOpacity(0.2)),
                      Text("Location: ${p['ward']}", style: AppTypography.bodySmall),
                      Positioned(
                        bottom: 8,
                        right: 8,
                        child: ElevatedButton.icon(
                          onPressed: () => context.push('/navigation'), // Reuse nav map
                          icon: const Icon(CupertinoIcons.location_fill, size: 14),
                          label: const Text("Nav"),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: AppColors.accent,
                            padding: const EdgeInsets.symmetric(horizontal: 12),
                          ),
                        ),
                      )
                    ],
                  ),
                ),

                // Footer
                Padding(
                  padding: const EdgeInsets.all(16),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text("Status: ${p['status']}", style: AppTypography.bodyMedium.copyWith(
                        color: hasAlerts ? AppColors.error : AppColors.success
                      )),
                      Text("Last Update: ${p['lastSeen']}", style: AppTypography.labelSmall),
                    ],
                  ),
                )
              ],
            ),
          );
        },
      ),
    );
  }
}
