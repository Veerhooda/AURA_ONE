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

1. **Find Server IP**:

   ```bash
   ifconfig | grep "inet " | grep -v 127.0.0.1
   ```

2. **Connect**:

   - Launch the app.
   - Go to **Settings** (Gear icon).
   - Enter your **Server IP** (e.g., `http://172.20.10.3:3001`).
   - Enter the **Patient Email** you want to simulate data for.
   - Tap **Save & Connect**.

3. **Simulate**:
   - Return to the main screen.
   - The app will start generating data and emitting `vitals.update` events to the server.
   - Verify connection status in the top bar.

## 🔧 Technical Details

- **Socket Event**: `vitals.update`
- **Data Format**:
  ```json
  {
    "email": "patient@example.com",
    "heart_rate": 72,
    "spo2": 98,
    "blood_pressure": "120/80",
    "timestamp": "..."
  }
  ```

## 📱 Screenshots

📸 **[View Screenshots & Demo Videos](https://drive.google.com/drive/folders/1o_omeA24i_tbTIIRAw_gdf4a5VHOIFEt)**
