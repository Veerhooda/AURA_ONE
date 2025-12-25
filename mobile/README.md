<p align="center">
  <img src="https://img.shields.io/badge/📱-Mobile_App-0175C2?style=for-the-badge&labelColor=1a1a2e" alt="Mobile"/>
</p>

<h1 align="center">AURA ONE Mobile</h1>
<h3 align="center">One App, Four Experiences</h3>

<p align="center">
  <img src="https://img.shields.io/badge/Flutter-3.x-02569B?style=flat-square&logo=flutter"/>
  <img src="https://img.shields.io/badge/Dart-Language-0175C2?style=flat-square&logo=dart"/>
  <img src="https://img.shields.io/badge/Platform-iOS%20%7C%20Android-lightgrey?style=flat-square"/>
</p>

---

## � Adaptive Persona System

The app transforms based on who's logged in:

<table>
<tr>
<td align="center" width="25%">

### 🛏️ Patient

**"My Health Hub"**

Real-time vitals dashboard with calming gradients and plain-language explanations

</td>
<td align="center" width="25%">

### 👨‍⚕️ Doctor

**"Clinical Cockpit"**

High-density patient monitoring with rapid-scan layouts and alert prioritization

</td>
<td align="center" width="25%">

### 👩‍⚕️ Nurse

**"Care Command"**

AI-sorted task queue with medication schedules and ward filtering

</td>
<td align="center" width="25%">

### 👨‍👩‍👧 Family

**"Guardian View"**

Simplified status timeline with push notifications for major updates

</td>
</tr>
</table>

---

## ✨ Feature Highlights

### 📊 Real-Time Vitals

- ECG waveforms at 30Hz refresh rate
- Gradient-filled graphs with glow effects
- Sub-100ms latency from sensor to screen

### 🗺️ Indoor Navigation

- A\* pathfinding algorithm
- Turn-by-turn directions
- Points of interest search

### 💬 Secure Chat

- End-to-end encryption ready
- Message persistence
- Typing indicators

### 🚨 Emergency Overlay

- Full-screen critical alerts
- Vibration + sound
- One-tap acknowledgment

---

## 🎨 Design System

```
┌─────────────────────────────────────┐
│  AURA ONE Design Language           │
├─────────────────────────────────────┤
│  Theme: Dark Mode First             │
│  Accent: Medical Teal (#00C9A7)     │
│  Alert: Urgent Red (#FF5252)        │
│  Font: Outfit (Google Fonts)        │
│  Cards: Glassmorphism               │
│  Animations: 60fps target           │
└─────────────────────────────────────┘
```

### Color Palette

| Purpose    | Color             | Hex       |
| ---------- | ----------------- | --------- |
| Primary    | 🟢 Medical Teal   | `#00C9A7` |
| Secondary  | 🔵 Trust Blue     | `#00B8FF` |
| Critical   | 🔴 Alert Red      | `#FF5252` |
| Warning    | 🟠 Caution Orange | `#FFA726` |
| Surface    | ⚫ Dark Card      | `#1E1E1E` |
| Background | ⬛ Deep Black     | `#121212` |

---

## � Project Structure

```
lib/
├── core/
│   ├── theme/          # Colors, typography
│   ├── widgets/        # Reusable components
│   └── router/         # Navigation (GoRouter)
├── features/
│   ├── auth/           # Login, registration
│   ├── patient/        # Health hub screens
│   ├── doctor/         # Clinical screens
│   ├── nurse/          # Care task screens
│   └── chat/           # Messaging
└── services/
    ├── api_service.dart    # REST client
    └── socket_service.dart # WebSocket client
```

---

## 🚀 Quick Start

```bash
# Install dependencies
flutter pub get

# Run in debug mode
flutter run

# Run in release mode (smoother animations)
flutter run --release
```

### Configuration

Update `lib/services/api_service.dart`:

```dart
static const String baseUrl = 'http://YOUR_SERVER_IP:3001';
```

---

## 📱 Screens Overview

| Screen          | Path          | Description      |
| --------------- | ------------- | ---------------- |
| Login           | `/login`      | Authentication   |
| Patient Home    | `/patient`    | Vitals dashboard |
| Doctor Home     | `/doctor`     | Patient list     |
| Nurse Dashboard | `/nurse`      | Task queue       |
| Chat Thread     | `/chat/:id`   | Messaging        |
| Indoor Map      | `/navigation` | Hospital map     |

---

<p align="center">
  <em>Crafted with Flutter ❤️</em>
</p>
