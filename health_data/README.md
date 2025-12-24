# Health Data Simulator 💓

A Flutter tool that acts as a **Virtual Medical Monitor**, simulating hardware sensors for the AURA ONE ecosystem.

## 🎯 Purpose

Instead of needing physical ECG sensors during development, this app generates realistic biological waveforms and streams them to the AURA ONE server via WebSockets.

## ✨ Capabilities

### Waveform Generation

- **ECG**: Synthesized PQRST complex simulation
- **SpO2**: Plethysmograph (sine wave) simulation
- **Blood Pressure**: Systolic/Diastolic dual-wave patterns

### Real-time Control

- Toggle simulation on/off
- Automatic connection to server on startup
- Simulates patient vitals with realistic variations
- **Emergency Trigger Button** - Simulate critical events (Fall detection, critical vitals)

## 🚀 Quick Start

### 1. Find Your Server IP

```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
```

Example output: `inet 172.20.10.2`

### 2. Launch and Connect

1. **Run the app**:

   ```bash
   cd health_data
   flutter run
   ```

2. **Configure Connection** (optional - auto-connects on startup):

   - Tap **Settings** (gear icon)
   - Enter **Server IP** (e.g., `172.20.10.2`)
   - Enter **Patient Email** (optional - defaults to `patient@aura.com`)
   - Tap **Save & Connect**

3. **Start Monitoring**:
   - Tap **START MONITORING** button
   - Vitals will stream to server in real-time
   - Graphs will display live ECG and SpO2 waveforms

### 3. Test Emergency System

1. Ensure the Mobile App (AURA ONE Patient) is running and logged in
2. In Health Data Simulator, tap **TRIGGER EMERGENCY**
3. Verify:
   - Simulator shows "EMERGENCY SIGNAL SENT!" snackbar
   - Mobile app displays red emergency overlay with alert details
   - Server logs show `[EMERGENCY] Received alert for Patient...`

## 🔧 Technical Details

### WebSocket Events

#### Outgoing Events

**`simulate_vitals`** - Continuous vitals streaming

```json
{
  "patientId": 1,
  "email": "patient@aura.com",
  "hr": 72,
  "spo2": 98,
  "bp": "120/80",
  "ecg": 0.5,
  "spo2_wave": 0.8,
  "timestamp": "2025-12-24T19:00:00.000Z"
}
```

**`patient.emergency`** - Critical alert trigger

```json
{
  "patientId": 1,
  "severity": "CRITICAL",
  "vitalType": "FALL",
  "value": 0,
  "notes": "Manual Emergency Trigger from Simulator"
}
```

### Authentication

- App authenticates as `patient@aura.com` on connection
- JWT token automatically retrieved and used for WebSocket auth
- Connection status displayed in app header

### Network Configuration

- **Default IP**: `172.20.10.2` (configurable)
- **Server Port**: `3001`
- **Protocol**: WebSocket over HTTP
- **Auth Method**: JWT Bearer token

## 🔨 Recent Fixes

### Emergency System

- ✅ **Fixed payload validation** - Now sends correct `vitalType` instead of invalid `type`
- ✅ **Added required fields** - `value` field now included (was missing)
- ✅ **DTO compliance** - Payload matches server's `EmergencyAlertDto` schema
- ✅ Changed emergency type from `CRITICAL_VITALS` to `FALL` (valid enum value)
- ✅ Renamed `description` to `notes` to match DTO

### Connection Reliability

- ✅ Auto-connect on app startup
- ✅ Connection status indicator in header
- ✅ JWT token properly extracted from login response
- ✅ Supports both `accessToken` and `access_token` field names

## 🎨 UI Features

- **Live Graphs**: Real-time ECG and Pleth waveforms with gradient fills
- **Digital Display**: Large, medical-grade vital signs display
- **Status Indicators**: Green (connected) / Orange (connecting) / Red (disconnected)
- **Modern Dark Theme**: Medical monitor aesthetic with neon accents

## 🐛 Troubleshooting

### "Not connected to server" Error

1. Verify server is running on specified IP:3001
2. Check firewall allows connections on port 3001
3. Ensure mobile device is on same network as server
4. Try tapping refresh icon in app header

### Emergency Button Not Working

1. Ensure server logs show `[EMERGENCY] Received alert...`
2. Verify mobile app is logged in and subscribed to patient room
3. Check `EmergencyOverlay` is mounted in mobile app tree
4. Server must be running with updated Emergency validation

### Vitals Not Streaming

1. Tap **START MONITORING** button (should turn red when active)
2. Check server logs for `📊 VITALS RECEIVED` messages
3. Verify WebSocket connection is established (green status)
4. Try reconnecting via Settings

## 📱 Screenshots

Full-screen medical monitor display with:

- Numeric vital signs (HR, BP, SpO2)
- Real-time ECG Lead II waveform
- Plethysmograph (SpO2 wave)
- Monitor/Emergency control buttons

---

**Tip**: Run this on a separate Android device while the Mobile App runs on another device to simulate a real hospital monitoring scenario!
