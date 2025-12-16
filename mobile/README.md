# AURA ONE Mobile App 📱

The primary interface for Patients and Doctors in the AURA ONE ecosystem. Built with Flutter.

## 🌟 Features

### For Patients

- **My Health Hub**:
  - Real-time vitals monitoring (Heart Rate, SpO2, BP) with **premium gradient visualizations**.
  - Medication tracking with progress bars.
  - "Current Status" banner for hospital admission details.
- **Appointments & OPD**:
  - Book appointments with doctors.
  - View upcoming and past appointment history.
- **Vitals Tracking**:
  - Manual entry logging.
  - Real-time visualization from connected hardware.
- **Indoor Navigation**:
  - Interactive hospital map with A\* pathfinding.
  - Search for Points of Interest (Reception, Labs, Wards).
- **Family Access**: Manage family access to health data.

### For Doctors

- **Profile Management**:
  - View and edit professional details (Specialty, Bio).
- **Patient Monitor**:
  - Live streaming of patient waveforms.
  - Vital signs alerts and history.
- **Appointments**:
  - View daily schedule and patient booking details.

## 🛠️ Setup & Running

1. **Prerequisites**:

   - Flutter SDK installed.
   - AURA ONE Server running on port `3001`.

2. **Configuration**:

   - The app connects to the server URL defined in `lib/services/api_service.dart`.
   - Default: `http://10.0.2.2:3001` (Android Emulator) or `http://localhost:3001` (iOS Simulator).

3. **Run**:
   ```bash
   flutter pub get
   flutter run
   ```

## 📦 Architecture

- **State Management**: `setState` for local UI, `StreamBuilder` for real-time socket data.
- **Navigation**: `go_router` for deep linking and route management.
- **Networking**: `socket_io_client` for WebSockets, `http` for REST APIs.
