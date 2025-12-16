class Doctor {
  final int id;
  final String name;
  final String specialty;
  final String email;
  final String? about;
  final int yearsExperience;
  final double rating;
  final int patientsProcessed;
  final String? imageUrl;
  final List<dynamic> availability;

  Doctor({
    required this.id,
    required this.name,
    required this.specialty,
    required this.email,
    this.about,
    this.yearsExperience = 0,
    this.rating = 0.0,
    this.patientsProcessed = 0,
    this.imageUrl,
    this.availability = const [],
  });

  factory Doctor.fromJson(Map<String, dynamic> json) {
    return Doctor(
      id: json['id'] as int,
      name: json['name'] as String,
      specialty: json['specialty'] as String,
      email: json['email'] as String,
      about: json['about'] as String?,
      yearsExperience: json['yearsExperience'] as int? ?? 0,
      rating: (json['rating'] as num?)?.toDouble() ?? 0.0,
      patientsProcessed: json['patientsProcessed'] as int? ?? 0,
      imageUrl: json['imageUrl'] as String?,
      availability: json['availability'] as List<dynamic>? ?? [],
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'name': name,
        'specialty': specialty,
        'email': email,
        'about': about,
        'yearsExperience': yearsExperience,
        'rating': rating,
        'patientsProcessed': patientsProcessed,
        'imageUrl': imageUrl,
        'availability': availability,
      };
}
