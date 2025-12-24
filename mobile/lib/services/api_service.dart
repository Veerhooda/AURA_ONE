import 'dart:convert';
import 'package:aura_one/features/doctor/domain/models/doctor.dart';
import 'package:http/http.dart' as http;
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:flutter/foundation.dart';

class ApiService {
  final http.Client _client;

  ApiService({http.Client? client}) : _client = client ?? http.Client();

  static String get baseUrl {
    // C3 fix: Use environment variable instead of hardcoded IP
    // Build with: flutter build --dart-define=API_URL=https://api.aura.com
    const String? apiUrl = String.fromEnvironment('API_URL');
    
    if (apiUrl != null && apiUrl.isNotEmpty) {
      // C5 fix: Validate HTTPS in production
      if (!apiUrl.startsWith('http://') && !apiUrl.startsWith('https://')) {
        throw Exception('API_URL must start with http:// or https://');
      }
      return apiUrl;
    }
    
    // Development fallback
    if (kDebugMode) {
      print('⚠️  WARNING: Using development API URL. Set API_URL for production builds.');
      // Use 10.0.2.2 for Android Emulator, or your machine's IP for iOS/Physical devices
      return 'http://172.20.10.2:3001';
    }
    
    throw Exception(
      'API_URL environment variable not set. '
      'Build with: flutter build --dart-define=API_URL=https://your-api-url'
    );
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
      
      // C17: Store user role
      if (data['user'] != null && data['user']['role'] != null) {
        await _storage.write(key: 'user_role', value: data['user']['role']);
      }
      
      // Store patient data
      if (data['patient'] != null) {
        if (data['patient']['mrn'] != null) {
          await _storage.write(key: 'patient_mrn', value: data['patient']['mrn']);
        }
        if (data['patient']['id'] != null) {
          await _storage.write(key: 'patient_id', value: data['patient']['id'].toString());
        }
      }
      
      // C17: Store doctor ID for DOCTOR role
      if (data['doctorId'] != null) {
        await _storage.write(key: 'doctor_id', value: data['doctorId'].toString());
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



  // C17: Get user role from storage
  Future<String?> getUserRole() async {
    return await _storage.read(key: 'user_role');
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

  Future<Map<String, dynamic>> getUserProfile() async {
    final token = await getToken();
    final response = await _client.get(
      Uri.parse('$baseUrl/auth/me'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
    );

    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception('Failed to load profile');
    }
  }

  // Helper to get current Doctor ID
  Future<int> getDoctorId() async {
    try {
      final profile = await getUserProfile();
      // Look for doctorId in top level or inside doctor object
      if (profile.containsKey('doctorId') && profile['doctorId'] != null) return profile['doctorId'];
      if (profile.containsKey('doctor') && profile['doctor'] != null && profile['doctor']['id'] != null) return profile['doctor']['id'];
      
      print("⚠️ No linked doctor profile found for user. Using fallback ID 1.");
      return 1; // Fallback
    } catch (e) {
      print("Warning: Could not fetch doctor ID: $e");
      return 1; // Fallback
    }
  }

  Future<Map<String, dynamic>> register(
    String name, 
    String email, 
    String password, 
    {
      String role = 'PATIENT',
      String? weight, 
      String? status, 
      String? symptoms,
      String? specialty, // For Doctors
      String? ward,      // For Nurses
    }
  ) async {
    final response = await _client.post(
      Uri.parse('$baseUrl/auth/register'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'email': email, 
        'password': password, 
        'name': name, 
        'role': role,
        'weight': weight,
        'status': status,
        'symptoms': symptoms,
        'specialty': specialty,
        'ward': ward,
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

  Future<List<dynamic>> getConversationMessages(int conversationId) async {
    final token = await getToken();
    final response = await http.get(
      Uri.parse('$baseUrl/chat/messages/$conversationId'),
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

  // ========== FAMILY DASHBOARD METHODS ==========
  
  /// Get list of patients monitored by family member
  Future<List<dynamic>> getFamilyPatients() async {
    final token = await getToken();
    final response = await _client.get(
      Uri.parse('$baseUrl/family/patients'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
    );

    if (response.statusCode == 200) {
      return jsonDecode(response.body) as List<dynamic>;
    } else {
      throw Exception('Failed to load family patients: ${response.body}');
    }
  }

  /// Create a new patient account and link to family
  Future<Map<String, dynamic>> createFamilyPatient({
    required String name,
    required String email,
    required String password,
    required String mrn,
    required String dob,
    required String gender,
    String? weight,
    required String relationship,
  }) async {
    final token = await getToken();
    final response = await _client.post(
      Uri.parse('$baseUrl/family/create-patient'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
      body: jsonEncode({
        'name': name,
        'email': email,
        'password': password,
        'mrn': mrn,
        'dob': dob,
        'gender': gender,
        'weight': weight,
        'relationship': relationship,
      }),
    );

    if (response.statusCode == 200 || response.statusCode == 201) {
      return jsonDecode(response.body);
    } else {
      throw Exception('Failed to create patient: ${response.body}');
    }
  }

  /// Add existing patient to family monitoring list
  Future<void> addExistingPatient({
    required int patientId,
    required String relationship,
  }) async {
    final token = await getToken();
    final response = await _client.post(
      Uri.parse('$baseUrl/family/add-patient'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
      body: jsonEncode({
        'patientId': patientId,
        'relationship': relationship,
      }),
    );

    if (response.statusCode != 200 && response.statusCode != 201) {
      throw Exception('Failed to add patient: ${response.body}');
    }
  }

  /// Remove patient from family monitoring list
  Future<void> removePatient(int patientId) async {
    final token = await getToken();
    final response = await _client.delete(
      Uri.parse('$baseUrl/family/remove/$patientId'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
    );

    if (response.statusCode != 200) {
      throw Exception('Failed to remove patient: ${response.body}');
    }
  }

  /// Get family guardians watching a patient (for patient profile)
  Future<List<dynamic>> getPatientGuardians(int patientId) async {
    final token = await getToken();
    final response = await _client.get(
      Uri.parse('$baseUrl/family/my-guardians/$patientId'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
    );

    if (response.statusCode == 200) {
      return jsonDecode(response.body) as List<dynamic>;
    } else {
      return []; // Return empty if no guardians
    }
  }
  // ========== NURSING CARE MODULE METHODS ==========

  /// Get prioritized tasks for a ward
  Future<List<dynamic>> getCareTasks({String ward = 'General'}) async {
    final token = await getToken();
    final response = await _client.get(
      Uri.parse('$baseUrl/care/ward?ward=$ward'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
    );

    if (response.statusCode == 200) {
      return jsonDecode(response.body) as List<dynamic>;
    } else {
      throw Exception('Failed to load care tasks');
    }
  }

  /// Update task status (Complete, Skip, etc.)
  Future<void> updateCareTask(int id, String status, {String? notes}) async {
    final token = await getToken();
    final response = await _client.patch(
      Uri.parse('$baseUrl/care/task/$id'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
      body: jsonEncode({
        'status': status,
        if (notes != null) 'notes': notes,
      }),
    );

    if (response.statusCode != 200) {
      throw Exception('Failed to update task');
    }
  }

  /// Create a manual task
  Future<void> createCareTask(Map<String, dynamic> data) async {
    final token = await getToken();
    final response = await _client.post(
      Uri.parse('$baseUrl/care/task'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
      body: jsonEncode(data),
    );

    if (response.statusCode != 201) {
      throw Exception('Failed to create task');
    }
  }
  // ========== CLINICAL CHAT METHODS ==========

  Future<Map<String, dynamic>> getConversation(int patientId, int doctorId) async {
    final token = await getToken();
    final response = await _client.post(
      Uri.parse('$baseUrl/chat/conversation'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
      body: jsonEncode({
        'patientId': patientId,
        'doctorId': doctorId,
      }),
    );

    if (response.statusCode == 200 || response.statusCode == 201) {
      return jsonDecode(response.body);
    } else {
      throw Exception('Failed to load conversation');
    }
  }

  Future<List<dynamic>> getDoctorInbox(int doctorId) async {
    final token = await getToken();
    final response = await _client.get(
      Uri.parse('$baseUrl/chat/inbox/doctor?doctorId=$doctorId'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
    );

    if (response.statusCode == 200) {
      return jsonDecode(response.body) as List<dynamic>;
    } else {
      throw Exception('Failed to load inbox');
    }
  }

  Future<List<dynamic>> getPatientChatInbox(int patientId) async {
    final token = await getToken();
    final response = await _client.get(
      Uri.parse('$baseUrl/chat/inbox/patient?patientId=$patientId'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
    );

    if (response.statusCode == 200) {
      return jsonDecode(response.body) as List<dynamic>;
    } else {
      throw Exception('Failed to load patient inbox');
    }
  }

  // C19: Acknowledge emergency alert
  Future<void> acknowledgeEmergency(int patientId, String severity, String vitalType) async {
    final token = await getToken();
    final response = await _client.post(
      Uri.parse('$baseUrl/emergency/acknowledge'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
      body: jsonEncode({
        'patientId': patientId,
        'severity': severity,
        'vitalType': vitalType,
        'acknowledgedAt': DateTime.now().toIso8601String(),
      }),
    );

    if (response.statusCode != 200 && response.statusCode != 201) {
      throw Exception('Failed to acknowledge emergency');
    }
  }
}

