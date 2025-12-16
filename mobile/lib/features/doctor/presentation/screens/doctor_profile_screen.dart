import 'package:flutter/material.dart';
import 'package:aura_one/services/api_service.dart';
import 'package:aura_one/features/doctor/domain/models/doctor.dart';
import 'package:aura_one/core/widgets/glassmorphic_container.dart';

class DoctorProfileScreen extends StatefulWidget {
  const DoctorProfileScreen({Key? key, required this.doctorId, this.apiService}) : super(key: key);

  final int doctorId;
  final ApiService? apiService;

  @override
  State<DoctorProfileScreen> createState() => _DoctorProfileScreenState();
}

class _DoctorProfileScreenState extends State<DoctorProfileScreen> {
  late Future<Doctor> _doctorFuture;
  Doctor? _doctor;

  @override
  void initState() {
    super.initState();
    _doctorFuture = (widget.apiService ?? ApiService()).getDoctorProfile(doctorId: widget.doctorId);
    _doctorFuture.then((doc) => setState(() => _doctor = doc));
  }

  bool _isSaving = false;

  void _showEditDialog() async {
    final nameController = TextEditingController(text: _doctor?.name);
    final specialtyController = TextEditingController(text: _doctor?.specialty);
    final emailController = TextEditingController(text: _doctor?.email);
    String? errorMessage;

    final bool? didUpdate = await showDialog<bool>(
      context: context,
      builder: (BuildContext context) {
        return StatefulBuilder(
          builder: (context, setStateDialog) {
            return AlertDialog(
              title: const Text('Edit Doctor Profile'),
              content: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  TextField(
                    controller: nameController,
                    decoration: const InputDecoration(labelText: 'Name'),
                  ),
                  TextField(
                    controller: specialtyController,
                    decoration: const InputDecoration(labelText: 'Specialty'),
                  ),
                  TextField(
                    controller: emailController,
                    decoration: const InputDecoration(labelText: 'Email'),
                  ),
                  if (errorMessage != null)
                    Padding(
                      padding: const EdgeInsets.only(top: 8.0),
                      child: Text(
                        errorMessage!,
                        style: const TextStyle(color: Colors.red),
                      ),
                    ),
                ],
              ),
              actions: [
                TextButton(
                  onPressed: () => Navigator.of(context).pop(false), // Cancel, no update
                  child: const Text('Cancel'),
                ),
                ElevatedButton(
                  onPressed: _isSaving
                      ? null
                      : () async {
                          setStateDialog(() {
                            _isSaving = true;
                            errorMessage = null; // Clear previous error
                          });
                          try {
                            await (widget.apiService ?? ApiService()).updateDoctorProfileWithDoctor(
                              doctorId: widget.doctorId,
                              doctor: Doctor(
                                id: _doctor!.id,
                                name: nameController.text,
                                specialty: specialtyController.text,
                                email: emailController.text,
                                about: _doctor!.about,
                                yearsExperience: _doctor!.yearsExperience,
                                rating: _doctor!.rating,
                                patientsProcessed: _doctor!.patientsProcessed,
                                imageUrl: _doctor!.imageUrl,
                                availability: _doctor!.availability,
                              ),
                            );
                            Navigator.of(context).pop(true); // Success, indicate update
                          } catch (e) {
                            setStateDialog(() {
                              errorMessage = 'Failed to update: $e';
                            });
                          } finally {
                            setStateDialog(() {
                              _isSaving = false;
                            });
                          }
                        },
                  child: _isSaving
                      ? const SizedBox(
                          width: 20,
                          height: 20,
                          child: CircularProgressIndicator(strokeWidth: 2),
                        )
                      : const Text('Save'),
                ),
              ],
            );
          },
        );
      },
    );

    // After dialog closes, refresh profile if an update occurred
    if (didUpdate == true) {
      setState(() {
        _doctorFuture = (widget.apiService ?? ApiService()).getDoctorProfile(doctorId: widget.doctorId);
        _doctorFuture.then((doc) => _doctor = doc);
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Doctor Profile'),
        backgroundColor: Colors.transparent,
        elevation: 0,
      ),
      backgroundColor: Colors.black,
      body: FutureBuilder<Doctor>(
        future: _doctorFuture,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }
          if (snapshot.hasError) {
            return Center(child: Text('Error: ${snapshot.error}'));
          }
          final doctor = snapshot.data!;
          return Center(
            child: GlassmorphicContainer(
              width: 350,
              height: 400,
              borderRadius: 20,
              blur: 20,
              alignment: Alignment.center,
              child: Padding(
                padding: const EdgeInsets.all(24.0),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('Name: ${doctor.name}', style: const TextStyle(color: Colors.white, fontSize: 20)),
                    const SizedBox(height: 12),
                    Text('Specialty: ${doctor.specialty}', style: const TextStyle(color: Colors.white70, fontSize: 18)),
                    const SizedBox(height: 12),
                    Text('Email: ${doctor.email}', style: const TextStyle(color: Colors.white70, fontSize: 16)),
                    const Spacer(),
                    Align(
                      alignment: Alignment.centerRight,
                      child: ElevatedButton.icon(
                        onPressed: _showEditDialog,
                        icon: const Icon(Icons.edit),
                        label: const Text('Edit'),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          );
        },
      ),
    );
  }
}
