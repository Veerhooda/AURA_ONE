import 'package:flutter/material.dart';

import '../../features/doctor/presentation/screens/doctor_profile_screen.dart';
import 'package:go_router/go_router.dart';
import '../../features/auth/presentation/screens/role_selection_screen.dart';
import '../../features/auth/presentation/screens/login_screen.dart';
import '../../features/auth/presentation/screens/signup_screen.dart';
import '../../features/patient/presentation/screens/patient_home_screen.dart';
import '../../features/patient/presentation/screens/update_profile_screen.dart';
import '../../features/patient/presentation/screens/accessibility_mode_screen.dart';
import '../../features/navigation/presentation/screens/navigation_map_screen.dart';
import '../../features/patient/presentation/screens/doctor_dashboard_screen.dart';
import '../../features/patient/presentation/screens/doctor_patient_screen.dart';
import '../../features/patient/presentation/screens/medication_screen.dart';
import '../../features/patient/presentation/screens/family_dashboard_screen.dart';
import '../../features/ai/presentation/screens/vision_stub_screen.dart';
import '../../features/ai/presentation/screens/chat_screen.dart';
import '../../features/patient/presentation/screens/pain_report_screen.dart';

final appRouter = GoRouter(
  initialLocation: '/',
  routes: [
    GoRoute(
      path: '/',
      builder: (context, state) => const RoleSelectionScreen(),
    ),
    GoRoute(
      path: '/login',
      pageBuilder: (context, state) {
        final role = state.extra as String? ?? 'PATIENT';
        return CustomTransitionPage(
          key: state.pageKey,
          child: LoginScreen(role: role),
          transitionsBuilder: (context, animation, secondaryAnimation, child) {
            return FadeTransition(opacity: animation, child: child);
          },
        );
      },
    ),
    GoRoute(
      path: '/signup',
      builder: (context, state) => const SignUpScreen(),
    ),
    GoRoute(
      path: '/update-profile',
      builder: (context, state) => const UpdateProfileScreen(),
    ),
    GoRoute(
      path: '/family/home',
      builder: (context, state) => const FamilyDashboardScreen(),
    ),
    GoRoute(
      path: '/patient/home',
      pageBuilder: (context, state) => CustomTransitionPage(
        key: state.pageKey,
        child: const PatientHomeScreen(),
        transitionsBuilder: (context, animation, secondaryAnimation, child) {
          return FadeTransition(opacity: animation, child: child);
        },
      ),
    ),
    GoRoute(
      path: '/accessibility',
      builder: (context, state) => const AccessibilityModeScreen(),
    ),
    GoRoute(
      path: '/medication',
      builder: (context, state) => const MedicationScreen(),
    ),
    GoRoute(
      path: '/patient/pain',
      builder: (context, state) => const PainReportScreen(),
    ),
    GoRoute(
      path: '/chat',
      builder: (context, state) => const ChatScreen(),
    ),
    GoRoute(
      path: '/navigation',
      builder: (context, state) => const NavigationMapScreen(),
    ),
    GoRoute(
      path: '/doctor/profile/:id',
      builder: (context, state) {
        final id = int.tryParse(state.pathParameters['id'] ?? '0') ?? 0;
        return DoctorProfileScreen(doctorId: id);
      },
    ),
    GoRoute(
      path: '/doctor/home',
      builder: (context, state) => const DoctorDashboardScreen(),
    ),
    GoRoute(
      path: '/doctor/monitor/:id',
      builder: (context, state) {
        final id = int.tryParse(state.pathParameters['id'] ?? '0') ?? 0;
        return DoctorPatientScreen(patientId: id);
      },
    ),
    GoRoute(
      path: '/ai/medication',
      builder: (context, state) => const VisionStubScreen(mode: 'medication'),
    ),
    GoRoute(
      path: '/ai/pain',
      builder: (context, state) => const VisionStubScreen(mode: 'pain'),
    ),
  ],
);
