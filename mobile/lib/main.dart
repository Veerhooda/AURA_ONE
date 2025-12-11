import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'core/router/app_router.dart';
import 'core/theme/app_theme.dart';
import 'services/socket_service.dart';
import 'core/widgets/emergency_overlay.dart';


import 'package:flutter/foundation.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  
  final socketUrl = (!kIsWeb && defaultTargetPlatform == TargetPlatform.android) 
      ? 'http://10.0.2.2:3001' 
      : 'http://localhost:3001';
      
  SocketService().init(socketUrl);

  runApp(const ProviderScope(child: AuraOneApp()));
}

class AuraOneApp extends StatelessWidget {
  const AuraOneApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      title: 'AURA ONE',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.darkTheme,
      routerConfig: appRouter,
      builder: (context, child) => EmergencyOverlay(child: child!),
    );
  }
}
