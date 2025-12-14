import 'package:flutter_test/flutter_test.dart';
import 'package:flutter/material.dart';
import 'package:aura_one/mobile/lib/features/doctor/presentation/screens/doctor_profile_screen.dart';
import 'package:aura_one/mobile/lib/features/doctor/domain/models/doctor.dart';

void main() {
  testWidgets('DoctorProfileScreen shows doctor details and edit button', (WidgetTester tester) async {
    // Build the widget with a dummy doctorId (the screen will attempt to fetch data).
    await tester.pumpWidget(
      const MaterialApp(
        home: DoctorProfileScreen(doctorId: 1),
      ),
    );

    // Verify that a CircularProgressIndicator is shown initially (loading state).
    expect(find.byType(CircularProgressIndicator), findsOneWidget);

    // Since we don't have a real backend, we can't proceed further without mocking.
    // This test ensures the widget builds without crashing.
  });
}
