import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

import 'package:flutter/foundation.dart';

class ApiService {
  static String get baseUrl {
    if (!kIsWeb && defaultTargetPlatform == TargetPlatform.android) {
      return 'http://10.0.2.2:3001';
    }
    return 'http://localhost:3001';
  }
  final _storage = const FlutterSecureStorage();

  // Singleton pattern
  static final ApiService _instance = ApiService._internal();
  factory ApiService() => _instance;
  ApiService._internal();

  Future<String?> getToken() async {
    return await _storage.read(key: 'jwt_token');
  }

  Future<String?> getUserName() async {
    return await _storage.read(key: 'user_name');
  }

  Future<Map<String, dynamic>> login(String email, String password) async {
    final response = await http.post(
      Uri.parse('$baseUrl/auth/login'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'email': email, 'password': password}),
    );

    if (response.statusCode == 200 || response.statusCode == 201) {
      final data = jsonDecode(response.body);
      await _storage.write(key: 'jwt_token', value: data['access_token']);
      // Store user name for greeting
      if (data['user'] != null && data['user']['name'] != null) {
        await _storage.write(key: 'user_name', value: data['user']['name']);
      }
      if (data['patient'] != null && data['patient']['mrn'] != null) {
        await _storage.write(key: 'patient_mrn', value: data['patient']['mrn']);
      }
      return data;
    } else {
      throw Exception('Failed to login (${response.statusCode}): ${response.body}');
    }
  }
  
  Future<String?> getPatientMRN() async {
    return await _storage.read(key: 'patient_mrn');
  }

  Future<void> updateProfile({
    required String weight, 
    required String status, 
    required String symptoms
  }) async {
    final token = await getToken();
    final response = await http.post(
      Uri.parse('$baseUrl/patients/profile'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
      body: jsonEncode({
        'weight': weight,
        'status': status,
        'symptoms': symptoms,
      }),
    );

    if (response.statusCode != 200 && response.statusCode != 201) {
      throw Exception('Failed to update profile: ${response.body}');
    }
  }

  Future<Map<String, dynamic>> register(
    String name, 
    String email, 
    String password, 
    {String? weight, String? status, String? symptoms}
  ) async {
      final response = await http.post(
      Uri.parse('$baseUrl/auth/register'),
      headers: {'Content-Type': 'application/json'},
      // Default to PATIENT role for self-registration
      body: jsonEncode({
        'email': email, 
        'password': password, 
        'name': name, 
        'role': 'PATIENT',
        'weight': weight,
        'status': status,
        'symptoms': symptoms,
      }),
    );

    if (response.statusCode == 201) {
      return jsonDecode(response.body);
    } else {
      throw Exception('Failed to register: ${response.body}');
    }
  }

  Future<Map<String, dynamic>> getPatientTwin(int id) async {
    final token = await getToken();
    final response = await http.get(
      Uri.parse('$baseUrl/patients/$id/twin'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
    );

    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception('Failed to fetch twin data');
    }
  }

  Future<List<dynamic>> getPatients() async {
    final token = await getToken();
    final response = await http.get(
      Uri.parse('$baseUrl/patients'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
    );

    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception('Failed to fetch patients');
    }
  }

  Future<Map<String, dynamic>> getNavigationPath(int from, int to) async {
    final response = await http.get(Uri.parse('$baseUrl/navigation/path?from=$from&to=$to'));
    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception('Failed to fetch path');
    }
  }

  Future<Map<String, dynamic>> sendVoiceCommand(String text) async {
    final response = await http.post(
        Uri.parse('$baseUrl/ai/voice/command'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'text': text})
    );
     if (response.statusCode == 201) {
      return jsonDecode(response.body);
    } else {
      throw Exception('Failed to process voice command');
    }
  }
  Future<List<dynamic>> getPatientMedications(int patientId) async {
    final token = await getToken();
    // ... impl
    final response = await http.get(
      Uri.parse('$baseUrl/medication/patient/$patientId'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
    );

    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      return [];
    }
  }

  Future<void> reportPain(int patientId, int level) async {
    final token = await getToken();
    final response = await http.post(
      Uri.parse('$baseUrl/patients/$patientId/pain'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
      body: jsonEncode({'level': level}),
    );

    if (response.statusCode != 200 && response.statusCode != 201) {
      throw Exception('Failed to report pain');
    }
  }
}
