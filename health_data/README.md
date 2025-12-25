# Health Data Simulator (HDS) 🧬

![Type](https://img.shields.io/badge/Type-Hardware_Emulator-purple)
![Signal](https://img.shields.io/badge/Signal-Synthetic_Bio-green)

The **Health Data Simulator** is a critical engineering tool that mocks the behavior of physical medical sensors (Pulse Oximeters, ECG patches). It allows developers to test the AURA ONE platform's real-time capabilities without needing expensive clinical hardware.

---

## 🔬 Signal Synthesis Engine

The HDS doesn't just send random numbers. It uses mathematical models to generate realistic bio-signals:

- **ECG Algorithm**: Synthesizes the standard **P-Q-R-S-T complex** using a composite of gaussian functions. This tests the dashboard's ability to render complex curves.
- **Plethysmography (SpO2)**: Generates a distinct dicrotic notch waveform to simulate arterial pressure changes.
- **Noise Injection**: Optional jitter can be added to signals to test the backend's smoothing algorithms.

---

## 🛠️ Developer Utility

### Use Cases

1.  **Load Testing**: Spin up 50 instances of the simulator to stress-test the Server's WebSocket gateway.
2.  **Latency Analysis**: Measure the time-to-glass (TTG) from signal generation to dashboard rendering.
3.  **Emergency Drills**: Manually trigger specific codes (e.g., Code Blue, Fall Detected) to verify notification pipelines.

### Configuration

The simulator is highly configurable via its UI:

- **Target IP**: Point to local dev server or staging environment.
- **Patient Identity**: Spoof specific Patient IDs to test multi-tenant isolation.
- **Signal Frequency**: Adjust update rates from 1Hz to 60Hz.

---

## ⚡ Emergency Injection Protocol

To test the platform's resilience, you can inject critical failures:

1.  **Fall Detection**: Simulates accelerometer spike followed by inactivity.
    - _Payload_: `{ type: "FALL", severity: "CRITICAL" }`
2.  **Tachycardia**: Ramps heart rate > 120 BPM instantly.
3.  **Probe Disconnect**: Simulates sensor loss to test dashboard error states.

---

## 🚀 Running the Simulator

```bash
cd health_data
flutter run
```

_Note: This tool is strictly for development and QA purposes. DO NOT use for clinical calibration._
