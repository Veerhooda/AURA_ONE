class Doctor {
  final int id;
  final String name;
  final String specialty;
  final String email;

  Doctor({required this.id, required this.name, required this.specialty, required this.email});

  factory Doctor.fromJson(Map<String, dynamic> json) {
    return Doctor(
      id: json['id'] as int,
      name: json['name'] as String,
      specialty: json['specialty'] as String,
      email: json['email'] as String,
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'name': name,
        'specialty': specialty,
        'email': email,
      };
}
