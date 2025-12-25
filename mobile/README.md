# AURA ONE Mobile Experience

![Flutter](https://img.shields.io/badge/Flutter-Production-blue)
![Render](https://img.shields.io/badge/Engine-Skia%2FImpeller-cyan)

**One Codebase, Four Unique Experiences.**

The AURA ONE mobile client is an adaptive Flutter application that morphs its interface and capabilities based on the authenticated user's role. It is engineered for high-performance rendering of real-time medical data.

---

## 🌟 Adaptive Persona System

The app identifies the user claim (`role`) upon login and hydrates the appropriate "Micro-App":

### 1. Patient Experience ("My Health Hub")

- **Goal**: Empowerment & Clarity.
- **Key Feature**: **Digital Twin Visualization**. A 3D-rendered representation of the patient's current health state, highlighting pain points or surgical sites.
- **UX Detail**: We prioritize plain language and soothing gradients (Teal/Blue) to reduce anxiety.

### 2. Provider Experience ("Clinical Cockpit")

- **Goal**: Efficiency & Speed.
- **Key Feature**: **Ward Eye View**. Doctors and Nurses get a distinct dashboard optimized for rapid scanning of multiple live vitals simultaneously.
- **UX Detail**: High-contrast alerts (Red/Orange) and information density are prioritized over aesthetics.

### 3. Family Experience ("Guardian View")

- **Goal**: Reassurance.
- **Key Feature**: **Status Ledger**. A simplified timeline of the patient's major status changes (e.g., "Surgery Started", "In Recovery", "Vitals Stable").

---

## 🎨 Design Engineering

We implemented a custom design system aimed at **"Medical Clarity"**:

- **Glassmorphism Engine**: Custom-built `GlassContainer` widgets that use `BackdropFilter` sparingly to maintain 60fps even on mid-range devices.
- **Real-Time Graphing**: We utilize `flutter_chart` with optimized repaint boundaries to draw ECG waveforms at 30Hz without janking the main thread.
- **Accessibility**: Full support for dynamic type sizes and high-contrast modes for elderly patients.

---

## 🛠️ Technical Implementation

### State Management

We rely on **Riverpod** for a reactive, unidirectional data flow:

- `SocketProvider`: Manages the websocket singleton and connection lifecycle.
- `UserProvider`: Caches profile data to minimize API calls.
- `VitalsProvider`: A high-frequency stream provider that debounces updates to UI widgets.

### Indoor Navigation

We implemented **A\* Pathfinding** natively in Dart for the hospital map feature, allowing for offline route calculation between "Reception" and specific "Ward Rooms".

---

## 🚀 Development Setup

1.  **Environment**: Flutter 3.10+ required.
2.  **Configuration**:
    - Set your API target in `lib/services/api_service.dart`.
3.  **Run**:
    ```bash
    flutter run --release
    ```
    > **Tip**: Use `--release` mode to test the true smoothnes of the waveform animations.

---

_Mobile Engineering Team_
