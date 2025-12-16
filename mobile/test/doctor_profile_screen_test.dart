import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:http/http.dart' as http;
import 'package:http/testing.dart';
import 'package:aura_one/features/doctor/presentation/screens/doctor_profile_screen.dart';
import 'package:aura_one/services/api_service.dart';
import 'dart:convert';

class TestApiService extends ApiService {
  TestApiService({required http.Client client}) : super(client: client);
  @override
  Future<String?> getToken() async => 'mock_token';
}

void main() {
  testWidgets('DoctorProfileScreen loads and displays doctor data', (WidgetTester tester) async {
    // 1. Mock Client
    final client = MockClient((request) async {
      if (request.method == 'GET' && request.url.path.contains('/doctors/1')) {
        return http.Response(jsonEncode({
          'id': 1,
          'name': 'Dr. Mock',
          'specialty': 'Mockology',
          'email': 'mock@test.com',
          'patientsProcessed': 100,
          'yearsExperience': 10,
          'rating': 4.8,
          'about': 'Mock bio',
          'imageUrl': 'http://image.com',
          'availability': []
        }), 200);
      }
      return http.Response('Not Found', 404);
    });

    final apiService = TestApiService(client: client);

    // 2. Pump Widget
    await tester.pumpWidget(
      MaterialApp(
        home: DoctorProfileScreen(
          doctorId: 1,
          apiService: apiService,
        ),
      ),
    );

    // 3. Verify Loading
    expect(find.byType(CircularProgressIndicator), findsOneWidget);

    // 4. Verify Data is Loaded
    await tester.pumpAndSettle(); // Wait for Future to complete
    
    expect(find.textContaining('Dr. Mock'), findsOneWidget);
    expect(find.textContaining('Mockology'), findsOneWidget);
  });
}
