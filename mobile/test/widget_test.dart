// This is a basic Flutter widget test.
//
// To perform an interaction with a widget in your test, use the WidgetTester
// utility in the flutter_test package. For example, you can send tap and scroll
// gestures. You can also use WidgetTester to find child widgets in the widget
// tree, read text, and verify that the values of widget properties are correct.

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:aura_one/main.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:aura_one/features/auth/presentation/screens/role_selection_screen.dart';
void main() {
  testWidgets('App smoke test', (WidgetTester tester) async {
    // Build our app and trigger a frame.
    await tester.pumpWidget(const ProviderScope(child: AuraOneApp()));
    await tester.pump(const Duration(seconds: 2)); // Allow initial animations to start but don't wait for infinite ones

    // Verify that the RoleSelectionScreen is displayed.
    expect(find.byType(RoleSelectionScreen), findsOneWidget);
  });
}
