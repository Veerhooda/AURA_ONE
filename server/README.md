# AURA ONE Backend 🧠

The central nervous system of AURA ONE, built with **NestJS**, **Prisma**, and **Socket.IO**.

## 🔑 Key Responsibilities

1. **API Gateway**: REST endpoints for authentication, patient management, and care coordination.
2. **Real-time Hub**: WebSocket gateway handling live vitals, chat messages, and emergency alerts.
3. **Data Persistence**: Stores patient history, vitals, and medical records in PostgreSQL via Prisma ORM.
4. **Emergency System**: Real-time alert broadcasting with 100% delivery guarantee architecture.
5. **Care Task Management**: Nurse dashboard backend with intelligent task prioritization.

## 🚀 Setup

```bash
# Install dependencies
npm install

# Generate Prisma Client
npx prisma generate

# Push schema to database
npx prisma db push

# Seed test data
npx ts-node prisma/seed_user.ts    # Patient account
npx ts-node prisma/seed_family.ts  # Family account
npx ts-node prisma/seed_doctors.ts # Doctor accounts
npx ts-node prisma/seed_nurse.ts   # Nurse account

# Run Server (Port 3001)
npm run start:dev
```

## 📡 WebSocket Events

### Main Gateway (`events.gateway.ts`)

#### Subscriptions

- **`subscribe.patient`**: Subscribe to real-time vitals for a specific patient
  - **Payload**: `{ patientId: number }`
  - **Authorization**: Role-based (Doctor/Nurse/Patient/Family)
- **`subscribe.user`**: Subscribe to user-specific notifications
  - **Payload**: `{ userId: number }`

#### Events (Incoming)

- **`simulate_vitals`**: Receive vitals data from simulators
  - **Payload**: `{ patientId: number, hr: number, spo2: number, bp: string, ecg?: number, ... }`
  - **Features**: Vitals validation, emergency detection, real-time broadcast
- **`patient.emergency`**: Trigger emergency alert
  - **Payload**: `{ patientId: number, severity: 'CRITICAL'|'HIGH'|'MEDIUM'|'LOW', vitalType: 'HR'|'SPO2'|'BP'|'TEMP'|'FALL'|'MEDICATION', value: number, notes?: string }`
  - **Action**: Persists alert to DB and broadcasts to all subscribed clients

#### Events (Outgoing)

- **`vitals.update`**: Real-time vitals broadcast to room `patient_{id}`
- **`patient.emergency`**: Emergency alert broadcast to patient room

### Chat Gateway (`chat.gateway.ts`)

- **`joinConversation`**: Join a chat conversation
  - **Payload**: `{ conversationId: number }`
- **`sendMessage`**: Send a message
  - **Payload**: `{ senderId: number, conversationId: number, content: string, senderType: 'PATIENT'|'DOCTOR', type: 'TEXT' }`
- **`newMessage`**: Broadcast when message received (outgoing event)

## 🗄️ Database (Prisma)

### Core Models

- **User**: Authentication & Profile (role: PATIENT, DOCTOR, NURSE, FAMILY, ADMIN)
- **Patient**: Medical record, linked to User
- **Doctor**: Doctor profile, specialty, and availability
- **Nurse**: Nurse profile with assigned ward
- **Appointment**: Scheduling and status tracking
- **Vitals**: Historical time-series vitals data
- **EmergencyAlert**: Critical alerts with delivery tracking
- **CareTask**: Nurse task management with AI-powered prioritization
- **Conversation**: Chat message persistence
- **UserPatientRelation**: Family-patient relationships

## 🔌 API Modules

### Auth (`/auth`)

- `POST /auth/login` - JWT authentication
- `POST /auth/register` - Multi-role registration (supports doctor, nurse, patient, family)
- `POST /auth/refresh` - Token refresh
- `GET /auth/me` - Get authenticated user profile (includes patient/doctor details)

### Patient (`/patients`)

- `GET /patients/:id/twin` - Digital Twin data
- `GET /patients/:id/recovery-graph` - AI recovery analysis
- `POST /patients/:id/pain` - Report pain level
- `POST /patients/:id/vitals/manual` - Log manual vitals
- `GET /patients/:id/medications` - Get medications
- `GET /patients/:id/history` - Get medical history

### Care (`/care`) **[RECENTLY ENABLED]**

- `GET /care/task` - Get care tasks (defaults to 'General' ward)
- `GET /care/ward?ward=ICU` - Get tasks for specific ward
- `POST /care/task` - Create manual care task
- `PATCH /care/task/:id` - Update task status

### Chat (`/chat`)

- `POST /chat/conversation` - Create/get conversation
- `GET /chat/inbox/doctor` - Get doctor's inbox (with dynamic doctor ID)
- `GET /chat/inbox/patient` - Get patient's inbox
- `GET /chat/messages/:id` - Get conversation messages

### Emergency (`/emergency`)

- `POST /emergency/acknowledge` - Acknowledge emergency alert
- `GET /emergency/unacknowledged` - Get all unacknowledged alerts
- `GET /emergency/unacknowledged/:patientId` - Get alerts for patient

### Family (`/family`)

- `GET /family/patients` - Get monitored patients
- `POST /family/create-patient` - Create new patient account
- `POST /family/add-patient` - Link existing patient
- `DELETE /family/remove/:id` - Remove from monitoring
- `GET /family/my-guardians/:id` - Get patient's guardians

### AI (`/ai`)

- `POST /ai/vision/describe` - Vision analysis
- `POST /ai/vision/pain` - Pain detection from facial expressions
- `POST /ai/voice/command` - Voice command processing

## 🔧 Recent Fixes & Improvements

### Authentication & Authorization

- ✅ Fixed `GET /auth/me` to use `req.user.userId` (matching JWT strategy)
- ✅ Dynamic doctor/patient ID retrieval from user profile
- ✅ Fixed JWT token handling in WebSocket connections (both auth and query parameters)

### Chat System

- ✅ Fixed chat persistence - messages now correctly stored and retrieved
- ✅ Doctor inbox now loads with message previews and counts
- ✅ Fixed message listener reactivity in Flutter mobile app
- ✅ Removed hardcoded doctor IDs - now uses dynamic profile lookup

### Nurse Dashboard

- ✅ Re-enabled Care module (`server/src/care`)
- ✅ Registered CareModule in AppModule
- ✅ Added `GET /care/task` endpoint for mobile compatibility
- ✅ Intelligent task sorting by priority, urgency, and patient risk score

### Emergency System

- ✅ Fixed Emergency trigger validation (DTO mismatch resolved)
- ✅ `health_data` simulator now sends correct payload format
- ✅ Server validates and broadcasts emergency alerts properly
- ✅ Mobile app `EmergencyOverlay` receives and displays alerts

### Performance & Stability

- ✅ Fixed Prisma validation errors in `PatientService`
- ✅ Removed TypeScript compilation errors in CareController
- ✅ Excluded `.disabled` folders from TypeScript compilation
- ✅ Socket authentication with fallback token strategies

## 🧪 Test Accounts

| Role    | Email            | Password    |
| ------- | ---------------- | ----------- |
| Patient | patient@aura.com | password123 |
| Doctor  | doctor@aura.com  | password123 |
| Nurse   | nurse@aura.com   | password123 |
| Family  | family@aura.com  | family123   |

## 📝 Environment Variables

Create a `.env` file:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/aura_one"
JWT_SECRET="your-secret-key"
GEMINI_API_KEY="your-gemini-api-key"
ALLOWED_ORIGINS="http://localhost:3000,http://localhost:5173"
```

## 🐛 Debugging

### WebSocket Connection Issues

1. Check server logs for connection attempts
2. Verify JWT token is present in handshake
3. Ensure client subscribes to correct room (e.g., `patient_1`)

### Chat Not Working

1. Verify `GET /auth/me` returns user profile
2. Check conversation exists before sending messages
3. Monitor server logs for `[CHAT]` prefixed messages

### Emergency Alerts Not Showing

1. Ensure payload matches `EmergencyAlertDto` schema
2. Verify mobile app is subscribed to patient room
3. Check `EmergencyOverlay` is mounted in app tree
