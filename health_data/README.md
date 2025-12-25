<p align="center">
  <img src="https://img.shields.io/badge/🧬-Simulator-9C27B0?style=for-the-badge&labelColor=1a1a2e" alt="Simulator"/>
</p>

<h1 align="center">Health Data Simulator</h1>
<h3 align="center">Your Virtual Medical Monitor</h3>

<p align="center">
  <img src="https://img.shields.io/badge/Type-Developer_Tool-purple?style=flat-square"/>
  <img src="https://img.shields.io/badge/Signal-Synthetic_Bio-green?style=flat-square"/>
  <img src="https://img.shields.io/badge/Flutter-3.x-02569B?style=flat-square&logo=flutter"/>
</p>

---

## 🎯 Purpose

No expensive ECG hardware? No problem.

This simulator generates **medically-accurate biosignals** and streams them to the AURA ONE server via WebSocket. Perfect for:

- 🧪 Development without hardware
- 🔬 Load testing the platform
- 🚨 Emergency response drills

---

## 📊 Signal Types

### ❤️ ECG (Electrocardiogram)

```
    R
   /\
P /  \ S    T
  ‾‾‾‾\/‾‾‾‾\/‾‾‾‾
       Q
```

Generates the classic **P-Q-R-S-T complex** using gaussian mathematical models.

### 💉 SpO2 (Plethysmography)

```
  /\      /\      /\
 /  \    /  \    /  \
/    \__/    \__/    \__
```

Simulates arterial pulse wave with dicrotic notch.

### 🩸 Blood Pressure

Generates realistic systolic/diastolic pairs (e.g., `120/80`).

---

## 🎮 Controls

| Button                   | Action                  |
| ------------------------ | ----------------------- |
| ▶️ **START MONITORING**  | Begin streaming vitals  |
| ⏹️ **STOP MONITORING**   | Pause data transmission |
| 🚨 **TRIGGER EMERGENCY** | Send critical alert     |
| ⚙️ **Settings**          | Configure server IP     |

---

## 🚨 Emergency Testing

Test the platform's emergency response system:

```dart
// Payload sent when you tap TRIGGER EMERGENCY
{
  "patientId": 1,
  "severity": "CRITICAL",
  "vitalType": "FALL",
  "value": 0,
  "notes": "Manual trigger from simulator"
}
```

**Expected Result:**

1. Server logs `[EMERGENCY] Received alert...`
2. Mobile app shows red emergency overlay
3. All subscribed clients receive the alert

---

## 📡 Data Format

### Vitals Stream (`simulate_vitals`)

```json
{
  "patientId": 1,
  "hr": 72,
  "spo2": 98,
  "bp": "120/80",
  "ecg": 0.125,
  "spo2_wave": 0.75,
  "timestamp": "2024-12-25T21:00:00Z"
}
```

### Emergency Alert (`patient.emergency`)

```json
{
  "patientId": 1,
  "severity": "CRITICAL",
  "vitalType": "FALL",
  "value": 0,
  "notes": "Description"
}
```

---

## 🚀 Quick Start

```bash
cd health_data
flutter run
```

### First-Time Setup

1. Tap ⚙️ **Settings**
2. Enter your server IP (e.g., `192.168.1.100`)
3. Tap **Save & Connect**
4. Tap ▶️ **START MONITORING**

---

## 🔧 Configuration

| Setting       | Default            | Description                   |
| ------------- | ------------------ | ----------------------------- |
| Server IP     | `172.20.10.2`      | Backend server address        |
| Patient Email | `patient@aura.com` | User to authenticate as       |
| Update Rate   | ~10 Hz             | Signal transmission frequency |

---

## ⚠️ Disclaimer

```
╔════════════════════════════════════════════════════════╗
║  ⚠️  FOR DEVELOPMENT AND TESTING ONLY                  ║
║                                                        ║
║  This tool generates SIMULATED medical data.           ║
║  DO NOT use for clinical decisions or calibration.     ║
╚════════════════════════════════════════════════════════╝
```

---

<p align="center">
  <em>Developer Tools • AURA ONE Platform</em>
</p>
