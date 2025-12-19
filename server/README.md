# AURA ONE Backend 🧠

The central nervous system of AURA ONE, built with **NestJS**, **Prisma**, and **Socket.IO**.

## 🔑 Key Responsibilities

1. **API Gateway**: REST endpoints for authentication and data retrieval.
2. **Real-time Hub**: WebSocket gateway handling `vitals.update` events from the Simulator and broadcasting them to Patient apps.
3. **Data Persistence**: Stores patient history in PostgreSQL via Prisma ORM.
4. **Family Management**: Multi-patient monitoring and account creation for family members.

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

# Run Server (Port 3001)
npm run start:dev
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
  - `UserPatientRelation`: Family-patient relationships.

## 🔌 API Modules

- **Auth**: Login, Register (JWT).
- **Patient**: Profile, History, Vitals, Medications.
- **Doctor**: Profile management, Patient lists.
- **Appointments**: Booking, Rescheduling, Doctor availability.
- **Family** (NEW):
  - `GET /family/patients` - Get monitored patients
  - `POST /family/create-patient` - Create new patient account
  - `POST /family/add-patient` - Link existing patient
  - `DELETE /family/remove/:id` - Remove from monitoring
  - `GET /family/my-guardians/:id` - Get patient's guardians
- **Chat**: Real-time messaging history.
- **AI**: Vision and Voice command processing.
