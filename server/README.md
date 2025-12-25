<p align="center">
  <img src="https://img.shields.io/badge/⚙️-Backend_Engine-E0234E?style=for-the-badge&labelColor=1a1a2e" alt="Backend"/>
</p>

<h1 align="center">AURA ONE Server</h1>
<h3 align="center">The Brain of the Hospital OS</h3>

<p align="center">
  <img src="https://img.shields.io/badge/NestJS-10.x-E0234E?style=flat-square&logo=nestjs"/>
  <img src="https://img.shields.io/badge/Prisma-ORM-2D3748?style=flat-square&logo=prisma"/>
  <img src="https://img.shields.io/badge/Socket.IO-Realtime-010101?style=flat-square&logo=socket.io"/>
  <img src="https://img.shields.io/badge/PostgreSQL-Database-316192?style=flat-square&logo=postgresql"/>
</p>

---

## 🎯 What This Does

The backend is a **high-throughput, event-driven** system that:

- 📡 Ingests real-time vitals from IoT simulators
- 🔄 Broadcasts events to subscribed mobile clients
- 🗄️ Persists clinical data to PostgreSQL
- 🛡️ Enforces security at every layer

---

## 🏗️ Architecture

```mermaid
graph LR
    subgraph Ingestion
        WS[WebSocket Gateway]
    end

    subgraph Processing
        Auth[Auth Module]
        Patient[Patient Module]
        Care[Care Module]
        Chat[Chat Module]
        Emergency[Emergency Module]
    end

    subgraph Security
        Audit[Audit Logger]
        Consent[Consent Engine]
        Crypto[AES-256 Encryption]
    end

    subgraph Storage
        DB[(PostgreSQL)]
    end

    WS --> Processing
    Processing --> Security
    Processing --> DB
```

---

## 🔌 API Reference

### REST Endpoints

| Method | Endpoint                 | Description              | Auth |
| ------ | ------------------------ | ------------------------ | ---- |
| `POST` | `/auth/login`            | Authenticate user        | ❌   |
| `POST` | `/auth/register`         | Create account           | ❌   |
| `GET`  | `/auth/me`               | Get current user profile | ✅   |
| `GET`  | `/patients/:id/twin`     | Digital Twin data        | ✅   |
| `GET`  | `/care/ward`             | Nurse task queue         | ✅   |
| `POST` | `/emergency/acknowledge` | Acknowledge alert        | ✅   |

### WebSocket Events

| Event               | Direction   | Purpose                 |
| ------------------- | ----------- | ----------------------- |
| `simulate_vitals`   | ⬅️ Inbound  | Receive sensor data     |
| `vitals.update`     | ➡️ Outbound | Broadcast to dashboards |
| `patient.emergency` | ⬅️ Inbound  | Trigger critical alert  |
| `subscribe.patient` | ⬅️ Inbound  | Join patient room       |

---

## 🛡️ Security Features

### 🔐 Encryption (AES-256-GCM)

```typescript
// Sensitive data is encrypted before database storage
const encrypted = encryptionService.encrypt(patientSSN);
// Format: iv:tag:ciphertext (all hex-encoded)
```

### 📋 Audit Logging

Every clinical action is permanently recorded:

- **Who**: User ID + IP Address
- **What**: Resource accessed
- **When**: Microsecond timestamp
- **Context**: Emergency override, scheduled access, etc.

### 🚦 Rate Limiting

```typescript
ThrottlerModule.forRoot([
  {
    ttl: 60000, // 1 minute window
    limit: 10, // Max 10 requests
  },
]);
```

---

## 🚀 Setup

```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Start development server
npm run start:dev
```

### Environment Variables

```env
DATABASE_URL="postgresql://user:pass@localhost:5432/aura"
JWT_SECRET="your-256-bit-secret-minimum-32-chars"
ENCRYPTION_KEY="64-hex-characters-for-aes-256"
```

---

## 📁 Module Structure

```
src/
├── auth/           # JWT authentication
├── patient/        # Digital twin, vitals, history
├── doctor/         # Provider profiles
├── care/           # Nurse task management
├── chat/           # Real-time messaging
├── emergency/      # Critical alert system
├── events/         # WebSocket gateway
├── audit/          # Compliance logging
├── consent/        # Access control
└── encryption/     # Data protection
```

---

<p align="center">
  <em>Engineering Documentation v1.3</em>
</p>
