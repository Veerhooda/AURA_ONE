# AURA ONE

**A Unified AI Operating System for Hospitals.**

AURA ONE is a next-generation hospital management platform that combines a **Patient Digital Twin**, **Real-time Vitals Monitoring**, **Indoor Navigation**, and **AI Assistance** into a seamless ecosystem.

---

## 🏗️ Project Architecture

The system consists of three connected applications:

1.  **`server/` (Backend)**

    - **Tech**: NestJS, Prisma, PostgreSQL, Socket.IO.
    - **Role**: Central API, AI Gateway, WebSocket Hub (Relays simulated data to dashboard).
    - **Features**: Authentication, Patient Management, Map Pathfinding, Data Relay.

2.  **`mobile/` (Patient Dashboard)**

    - **Tech**: Flutter (iOS/Android).
    - **Role**: The primary interface for patients and doctors.
    - **Features**:
      - **Dynamic Dashboard**: Real-time Vitals Cards (ECG, SpO2, BP).
      - **Indoor Navigation**: A\* Pathfinding on hospital maps.
      - **AI Assistant**: Voice/Text chat for medical queries.
      - **Digital Twin**: 3D-style health visualization.

3.  **`health_data/` (Hardware Simulator)**

    - **Tech**: Flutter (Android).
    - **Role**: Simulates a medical vitals monitor.
    - **Features**: Generates realistic ECG (PQRST), SpO2 waveforms, and vital sign numbers; streams to server via WebSockets.

4.  **`web/` (Web Portal)**

    - **Location**: `web/frontend/AURA_ONE_web`
    - **Tech**: React 19, Vite, Tailwind-like CSS variables.
    - **Role**: Administrative / Hospital Staff Dashboard.
    - **Features**: Role-based access, Patient Reporting, and Glassmorphism UI.

5.  **`Patient_Summary_Graph/` (AI Agent)**
    - **Tech**: n8n, Groq (Llama 3), QuickChart.
    - **Role**: Automated medical summary generation.
    - **Features**: Analyzes patient history to produce text summaries and visual recovery trend graphs via Webhook.

---

## 🚀 Getting Started

### Project Structure

- `server/`: NestJS application (API, AI Gateway, Digital Twin)
- `mobile/`: Flutter application (Android/iOS)
- `health_data/`: Flutter application (Hardware Simulator)
- `web/`: Web application (React/Vite Frontend)
- `Patient_Summary_Graph/`: n8n Workflow & AI Logic
- `docker-compose.yml`: Database infrastructure (PostgreSQL, Redis, TimescaleDB)

### 1. Database Infrastructure

Start the PostgreSQL database:

```bash
docker-compose up -d
```

### 2. Backend Server

The server coordinates everything on **Port 3001** and must be accessible on your LAN.

```bash
cd server
npm install
npx prisma generate
npx prisma db push  # Set up database schema
npm run start:dev   # Development mode with hot-reload
```

**Important - Network Setup:**

1. Find your Mac's LAN IP: `ifconfig | grep "inet " | grep -v 127.0.0.1`
2. Server will bind to `0.0.0.0:3001` (all interfaces)
3. Update these files with your IP (e.g., `172.20.10.3`):
   - `mobile/lib/services/api_service.dart` - Update `baseUrl`
   - `mobile/lib/main.dart` - Update `socketUrl`
   - `health_data/lib/main.dart` - Update `_ipController` default value

**Seeding Data:**

```bash
npx ts-node server/create-doctor.ts  # Create sample doctor account
```

### 3. Health Data Simulator (The "Medical Monitor")

Run this on a separate device (Android recommended) to act as the source of truth.

```bash
cd health_data
flutter run
```

- **Usage**:
  1. Go to **Settings** (Gear icon).
  2. Enter **Server IP** (e.g., `http://10.0.2.2:3001` or your LAN IP).
  3. Enter **Patient Email** (to target a specific user).
  4. Tap **Save & Connect** -> **Start Monitoring**.

### 4. Patient Dashboard (The "Receiver")

Run this to visualize the data.

```bash
cd mobile
flutter run
```

- **Usage**: Log in -> View the "My Health Hub" dashboard. The **gradient-filled graphs** will animate in sync with the simulator!

### 5. Web Portal

Run the web dashboard.

```bash
cd web/frontend/AURA_ONE_web
npm install
npm run dev
```

---

## ✨ Key Features

- **Family Dashboard** (NEW):

  - **Multi-Patient Monitoring**: Family members can track multiple patients in one view
  - **Patient Account Creation**: Create new patient accounts directly from family dashboard
  - **Link Existing Patients**: Add existing patients using their Patient ID
  - **Real-time Status**: View patient status (Stable/Warning/Critical) with alert counts
  - **Quick Actions**: One-tap access to vitals, navigation, and chat for each patient
  - **Bidirectional Sync**: Patients can see their family guardians in their profile

- **AI Recovery Analysis**:

  - **n8n Workflow**: Automated medical summary generation using Groq (Llama 3)
  - **Visual Graphs**: QuickChart-powered recovery trend visualization
  - **Real-time Generation**: Click "Generate" to analyze patient history
  - Setup: Import `/Patient_Summary_Graph/Patient Summary + Recovery Graph.json` into n8n (http://localhost:5678)

- **Real-time Vitals Monitoring**:

  - Sub-second latency streaming via Socket.IO
  - Live ECG, SpO2, and BP waveforms
  - Simulator → Server → Mobile Dashboard sync
  - Emergency alert system with instant doctor notifications

- **Premium UI**:

  - **Performance Optimized**: Removed expensive BackdropFilter widgets to eliminate GPU timeouts
  - **Gradient Graphs**: Medical-grade visualizations with fill effects
  - **Glassmorphism**: Modern translucent cards (using simple opacity, not blur)
  - **Polished Typography**: Clean hierarchy using "Outfit" font

- **Healthcare Management**:

  - **Appointments**: Full booking flow with doctor availability
  - **Prescriptions**: Medication tracking with reminders
  - **Medical History**: Timeline view with reports
  - **Manual Vitals Entry**: Log health data offline

- **Communication**:

  - **Real-time Chat**: Doctor-patient messaging via Socket.IO
  - **Emergency Alerts**: One-tap critical notifications

- **Smart Features**:
  - **Indoor Navigation**: A\* pathfinding on hospital maps
  - **Digital Twin**: Live health state synchronization
  - **Accessibility Mode**: High-contrast UI for accessibility

---

## 🔐 Test Accounts

Seed the database to create test accounts:

```bash
cd server
npx ts-node prisma/seed_user.ts    # Patient: patient@aura.com / password123
npx ts-node prisma/seed_family.ts  # Family: family@aura.com / family123
npx ts-node prisma/seed_doctors.ts # Create sample doctors
```

| Role    | Email             | Password    |
| ------- | ----------------- | ----------- |
| Patient | patient@aura.com  | password123 |
| Family  | family@aura.com   | family123   |
| Doctor  | (see seed output) | (varies)    |

---

## 📡 API Endpoints

### Family Management

| Method | Endpoint                          | Description                          |
| ------ | --------------------------------- | ------------------------------------ |
| GET    | `/family/patients`                | Get all patients monitored by family |
| POST   | `/family/create-patient`          | Create new patient account           |
| POST   | `/family/add-patient`             | Link existing patient to family      |
| DELETE | `/family/remove/:patientId`       | Remove patient from monitoring       |
| GET    | `/family/my-guardians/:patientId` | Get family members watching patient  |

---

## 📱 Screenshots & Demo

The mobile app features a modern dark theme with gradient accents, glassmorphism cards, and smooth animations throughout.

📸 **[View Screenshots & Demo Videos](https://drive.google.com/drive/folders/1o_omeA24i_tbTIIRAw_gdf4a5VHOIFEt)**

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is developed for educational and demonstration purposes.

---

Made with ❤️ by the AURA ONE Team
