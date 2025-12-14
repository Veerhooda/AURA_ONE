import 'package:flutter_test/flutter_test.dart';
import 'package:aura_one/mobile/lib/services/api_service.dart';
import 'package:aura_one/mobile/lib/features/doctor/domain/models/doctor.dart';
import 'package:http/http.dart' as http;
import 'package:http/testing.dart';
import 'dart:convert';

void main() {
  test('updateDoctorProfileWithDoctor sends correct request', () async {
    // Arrange: create a mock client
    final mockClient = MockClient((http.Request request) async {
      expect(request.method, equals('PUT'));
      expect(request.url.path, equals('/doctors/1'));
      final body = jsonDecode(request.body) as Map<String, dynamic>;
      expect(body['name'], equals('Dr. Test'));
      expect(body['specialty'], equals('Cardiology'));
      expect(body['email'], equals('test@example.com'));
      return http.Response('', 200);
    });

    // Inject mock client into ApiService (temporarily replace http client)
    final apiService = ApiService();
    // Save original client
    final originalClient = http.Client;
    // Override http.Client with mock
    http.Client = () => mockClient;

    // Act
    await apiService.updateDoctorProfileWithDoctor(
      doctorId: 1,
      doctor: Doctor(id: 1, name: 'Dr. Test', specialty: 'Cardiology', email: 'test@example.com'),
    );

    // Cleanup: restore original client
    http.Client = originalClient;
  });
}
