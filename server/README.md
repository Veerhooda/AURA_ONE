# AURA ONE Backend 🧠

The central nervous system of AURA ONE, built with **NestJS**, **Prisma**, and **Socket.IO**.

## 🔑 Key Responsibilities

1. **API Gateway**: REST endpoints for authentication and data retrieval.
2. **Real-time Hub**: WebSocket gateway handling `vitals.update` events from the Simulator and broadcasting them to Patient apps.
3. **Data Persistence**: Stores patient history in PostgreSQL via Prisma ORM.

## 🚀 Setup

```bash
# Install dependencies
npm install

# Generate Prisma Client
npx prisma generate

# Run Server (Port 3001)
npm run start
```

## 📡 socket.io Events

### `events.gateway.ts`

- **Listen**: `vitals.update`

  - **Payload**: `{ email?: string, patientId?: number, heart_rate: number, spo2: number, blood_pressure: string }`
  - **Action**: Broadcasts data to room `patient_{id}` and saves snapshot to DB.

- **Listen**: `join_room`
  - **Payload**: `{ room: string }` (e.g., `"patient_1"`)
  - **Action**: Subscribes client to updates for that specific room.

## 🗄️ Database (Prisma)

- **Models**:
  - `User`: Auth & Profile.
  - `Patient`: Medical record, linked to User.
  - `Doctor`: Doctor profile and availability.
  - `Appointment`: Scheduling and status.
  - `Vitals`: Historical time-series data.
  - `Medication`: Schedules and dosages.

## 🔌 API Modules

- **Auth**: Login, Register (JWT).
- **Patient**: Profile, History, Vitals, Medications.
- **Doctor**: Profile management, Patient lists.
- **Appointments**: Booking, Rescheduling, Doctor availability.
- **Chat**: Real-time messaging history.
- **AI**: Vision and Voice command processing.
