# AURA ONE Mobile App 📱

The primary interface for Patients, Doctors, and Family Members in the AURA ONE ecosystem. Built with Flutter.

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
- **AI Recovery Analysis**:
  - AI-generated medical summaries.
  - Visual recovery trend graphs.
- **Indoor Navigation**:
  - Interactive hospital map with A\* pathfinding.
  - Search for Points of Interest (Reception, Labs, Wards).
- **Profile**: View family guardians who are monitoring you.

### For Family Members (NEW)

- **Family Dashboard**:
  - Monitor multiple patients in a single view.
  - Create new patient accounts with auto-generated MRN.
  - Link existing patients using Patient ID.
  - View real-time status (Stable/Warning/Critical).
  - Quick actions for navigation and chat.

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

   - Update server IP in `lib/services/api_service.dart`.
   - Update socket URL in `lib/main.dart`.
   - Find your LAN IP: `ifconfig | grep "inet " | grep -v 127.0.0.1`

3. **Run**:
   ```bash
   flutter pub get
   flutter run
   ```

## 📦 Architecture

- **State Management**: `setState` for local UI, `StreamBuilder` for real-time socket data.
- **Navigation**: `go_router` for deep linking and route management.
- **Networking**: `socket_io_client` for WebSockets, `http` for REST APIs.
- **Theme**: Custom `AppColors` and `AppTypography` for consistent dark mode styling.

## 📱 Screenshots

📸 **[View Screenshots & Demo Videos](https://drive.google.com/drive/folders/1o_omeA24i_tbTIIRAw_gdf4a5VHOIFEt)**
