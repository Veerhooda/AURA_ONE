import 'package:flutter_test/flutter_test.dart';
import 'package:http/http.dart' as http;
import 'package:http/testing.dart';
import 'package:aura_one/services/api_service.dart';
import 'package:aura_one/features/doctor/domain/models/doctor.dart';
import 'dart:convert';

class TestApiService extends ApiService {
  TestApiService({required http.Client client}) : super(client: client);
  @override
  Future<String?> getToken() async => 'mock_token';
}

void main() {
  group('ApiService', () {
    test('updateDoctorProfileWithDoctor sends correct PUT request', () async {
      final client = MockClient((request) async {
        if (request.method == 'PUT' && 
            request.url.path.contains('/doctors/1') &&
            request.headers['Authorization'] == 'Bearer mock_token') {
            
           // Verify body
           final body = jsonDecode(request.body);
           if (body['name'] == 'Dr. Test' && body['specialty'] == 'Cardiology') {
             return http.Response('{}', 200);
           }
        }
        return http.Response('Not Found', 404);
      });

      final apiService = TestApiService(client: client);
      final doctor = Doctor(
        id: 1,
        name: 'Dr. Test',
        specialty: 'Cardiology',
        email: 'test@test.com',
        patientsProcessed: 0,
        yearsExperience: 5,
        rating: 4.5,
        about: 'About',
        imageUrl: 'url',
        availability: [],
      );

      await apiService.updateDoctorProfileWithDoctor(doctorId: 1, doctor: doctor);
    });
  });
}
