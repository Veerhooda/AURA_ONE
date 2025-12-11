# Health Data Simulator 💓

A Flutter tool that acts as a **Virtual Medical Monitor**, simulating hardware sensors for the AURA ONE ecosystem.

## 🎯 Purpose

Instead of needing physical ECG sensors during development, this app generates realistic biological waveforms and streams them to the AURA ONE server via WebSockets.

## ✨ Capabilities

- **Waveform Generation**:
  - **ECG**: Synthesized PQRST complex simulation.
  - **SpO2**: Plethysmograph (sine wave) simulation.
  - **Blood Pressure**: Systolic/Diastolic dual-wave patterns.
- **Real-time Control**:
  - Toggle simulation on/off.
  - Adjustment sliders for Heart Rate (BPM) and Oxygen Levels.
  - Simulates critical events (e.g., Tachycardia).

## 🚀 Usage

1. **Connect**:

   - Launch the app.
   - Go to **Settings** (Gear icon).
   - Enter your Server IP (e.g., `http://192.168.1.X:3001` or `http://10.0.2.2:3001`).
   - Tap **Connect**.

2. **Simulate**:
   - Return to the main screen.
   - The app will start generating data and emitting `vitals.update` events to the server.
   - Verify connection status in the top bar.

## 🔧 Technical Details

- **Socket Event**: `vitals.update`
- **Data Format**:
  ```json
  {
    "patientId": 1,
    "heart_rate": 72,
    "spo2": 98,
    "blood_pressure": "120/80",
    "timestamp": "..."
  }
  ```
