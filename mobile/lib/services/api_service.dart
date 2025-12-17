import 'dart:convert';
import 'package:aura_one/features/doctor/domain/models/doctor.dart';
import 'package:http/http.dart' as http;
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:flutter/foundation.dart';

class ApiService {
  final http.Client _client;

  ApiService({http.Client? client}) : _client = client ?? http.Client();

  static String get baseUrl {
    // Using current LAN IP
    return 'http://172.20.10.3:3001';
  }

  final _storage = const FlutterSecureStorage();
  Future<String?> getToken() async {
    return await _storage.read(key: 'jwt_token');
  }

  Future<String?> getUserName() async {
    return await _storage.read(key: 'user_name');
  }

  Future<Map<String, dynamic>> login(String email, String password) async {
    final response = await _client.post(
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
      if (data['patient'] != null) {
        if (data['patient']['mrn'] != null) {
          await _storage.write(key: 'patient_mrn', value: data['patient']['mrn']);
        }
        if (data['patient']['id'] != null) {
          await _storage.write(key: 'patient_id', value: data['patient']['id'].toString());
        }
      }
      return data;
    } else {
      throw Exception('Failed to login (${response.statusCode}): ${response.body}');
    }
  }
  
  Future<String?> getPatientMRN() async {
    return await _storage.read(key: 'patient_mrn');
  }

  Future<int?> getPatientId() async {
    final idStr = await _storage.read(key: 'patient_id');
    return idStr != null ? int.tryParse(idStr) : null;
  }

  // Get Digital Twin data (Profile, Vitals, Predictions)
  Future<Map<String, dynamic>> getPatientTwin(int patientId) async {
    final token = await getToken();
    final response = await _client.get(
      Uri.parse('$baseUrl/patients/$patientId/twin'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
    );

    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception('Failed to load patient twin data');
    }
  }

  // Fetch AI Recovery Summary & Graph
  Future<Map<String, dynamic>> getRecoverySummary(int patientId) async {
    final token = await getToken();
    final response = await _client.get(
      Uri.parse('$baseUrl/patients/$patientId/recovery-graph'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
    );

    if (response.statusCode == 200 || response.statusCode == 201) {
      return jsonDecode(response.body);
    } else {
      throw Exception('Failed to fetch recovery graph');
    }
  }

  Future<void> updateProfile({
    required String weight, 
    required String status, 
    required String symptoms
  }) async {
    final token = await getToken();
    final response = await _client.post(
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
      final response = await _client.post(
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
    // Doctor Profile
  Future<Doctor> getDoctorProfile({required int doctorId}) async {
    final token = await getToken();
    final response = await _client.get(
      Uri.parse('$baseUrl/doctors/$doctorId'),
      headers: {
        'Authorization': 'Bearer $token',
      },
    );

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      return Doctor.fromJson(data);
    } else {
      throw Exception('Failed to fetch doctor profile');
    }
  }

  // Update doctor profile using a Doctor object
  Future<void> updateDoctorProfileWithDoctor({
    required int doctorId,
    required Doctor doctor,
  }) async {
    final token = await getToken();
    final body = jsonEncode({
      'name': doctor.name,
      'specialty': doctor.specialty,
      'email': doctor.email,
    });
    final response = await _client.put(
      Uri.parse('$baseUrl/doctors/$doctorId'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
      body: body,
    );
    if (response.statusCode != 200) {
      throw Exception('Failed to update doctor profile');
    }
  }

  // Existing method (kept for backward compatibility)
  Future<void> updateDoctorProfile({
    required int doctorId,
    String? name,
    String? specialty,
    String? email,
  }) async {
    final token = await getToken();
    final body = jsonEncode({
      if (name != null) 'name': name,
      if (specialty != null) 'specialty': specialty,
      if (email != null) 'email': email,
    });
    final response = await _client.put(
      Uri.parse('$baseUrl/doctors/$doctorId'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
      body: body,
    );
    if (response.statusCode != 200) {
      throw Exception('Failed to update doctor profile');
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
  Future<List<dynamic>> getPatientHistory(int patientId) async {
    final token = await getToken();
    final response = await http.get(
      Uri.parse('$baseUrl/patients/$patientId/history'),
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

  Future<List<dynamic>> getPatientMedications(int patientId) async {
    final token = await getToken();
    final response = await http.get(
      Uri.parse('$baseUrl/patients/$patientId/medications'),
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

  Future<void> updatePatientStatus(int id, String status) async {
    final token = await getToken();
    final response = await http.post(
      Uri.parse('$baseUrl/patients/$id/status'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
      body: jsonEncode({'status': status}),
    );
    if (response.statusCode != 200 && response.statusCode != 201) {
       throw Exception('Failed to update status');
    }
  }

  Future<void> addMedication(int id, String name, String dosage, {String frequency = 'Daily'}) async {
    final token = await getToken();
    final response = await http.post(
      Uri.parse('$baseUrl/patients/$id/medications'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
      body: jsonEncode({
        'name': name, 
        'dosage': dosage,
        'frequency': frequency
      }),
    );
    if (response.statusCode != 201) {
       throw Exception('Failed to add medication');
    }
  }

  Future<void> addHistory(int id, String note) async {
    final token = await getToken();
    final response = await http.post(
      Uri.parse('$baseUrl/patients/$id/history'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
      body: jsonEncode({'note': note}),
    );
    if (response.statusCode != 201) {
       throw Exception('Failed to add history');
    }
  }
  Future<List<dynamic>> getPatientReports(int patientId) async {
    final token = await getToken();
    final response = await http.get(
      Uri.parse('$baseUrl/patients/$patientId/reports'),
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

  Future<void> uploadPatientReport(int patientId, dynamic file) async {
    // Mock Upload
    final token = await getToken();
    final response = await http.post(
      Uri.parse('$baseUrl/patients/$patientId/reports'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
      body: jsonEncode({'filename': 'test_upload.pdf'}),
    );

    if (response.statusCode != 201) {
       throw Exception('Failed to upload report');
    }
  }

  Future<List<dynamic>> getChatHistory(int userId, int otherUserId) async {
    final token = await getToken();
    final response = await http.get(
      Uri.parse('$baseUrl/chat/history/$userId/$otherUserId'),
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

  // Appointments
  Future<List<dynamic>> getAppointments(int patientId) async {
    final token = await getToken();
    final response = await http.get(
      Uri.parse('$baseUrl/appointments/patient/$patientId'),
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

  Future<List<dynamic>> getAllDoctors() async {
    final token = await getToken();
    final response = await http.get(
      Uri.parse('$baseUrl/appointments/doctors'),
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

  Future<List<String>> getAvailableSlots(int doctorId, String date) async {
    final token = await getToken();
    final response = await http.get(
      Uri.parse('$baseUrl/appointments/slots/$doctorId/$date'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
    );

    if (response.statusCode == 200) {
      final List<dynamic> slots = jsonDecode(response.body);
      return slots.cast<String>();
    } else {
      return [];
    }
  }

  Future<void> bookAppointment({
    required int patientId,
    required int doctorId,
    required String dateTime,
    required String type,
    String? notes,
  }) async {
    final token = await getToken();
    final response = await http.post(
      Uri.parse('$baseUrl/appointments'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
      body: jsonEncode({
        'patientId': patientId,
        'doctorId': doctorId,
        'dateTime': dateTime,
        'type': type,
        'notes': notes,
      }),
    );

    if (response.statusCode != 201) {
      throw Exception('Failed to book appointment');
    }
  }

  Future<void> cancelAppointment(int appointmentId) async {
    final token = await getToken();
    await http.delete(
      Uri.parse('$baseUrl/appointments/$appointmentId'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
    );
  }

  // Manual Vitals
  Future<void> addManualVital({
    required int patientId,
    required String type,
    required double value,
    required String unit,
  }) async {
    final token = await getToken();
    final response = await http.post(
      Uri.parse('$baseUrl/patients/$patientId/vitals/manual'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
      body: jsonEncode({
        'type': type,
        'value': value,
        'unit': unit,
      }),
    );

    if (response.statusCode != 201) {
      throw Exception('Failed to add vital');
    }
  }
}

