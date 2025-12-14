// import 'package:health/health.dart';
import 'package:permission_handler/permission_handler.dart';
import 'dart:io';
import 'dart:async';

class HealthService {
  static final HealthService _instance = HealthService._internal();
  factory HealthService() => _instance;
  HealthService._internal();

  // final Health _health = Health();

  Future<bool> requestPermissions() async {
    // Stub implementation
    return true; 
  }

  Stream<double> get heartRateStream async* {
    yield* Stream.periodic(Duration(seconds: 1), (i) => 70.0 + (i % 5));
  }
}
