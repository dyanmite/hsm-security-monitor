# Cyber Intrusion Detection System for Power and Industrial Control Networks
**Problem Statement: HECEE003 | Cyber-Physical Security for Critical Infrastructure**

This project is a **Software-Defined Intrusion Detection System (IDS)** designed for Power Grids and Industrial Control Systems (ICS). It features real-time grid simulation, cyber-physical attack detection (Voltage/Frequency anomalies), and immutable forensic logging.

## 🚀 Features
- **Real-Time Grid Monitoring**: Live visualization of Voltage (220-240V) and Frequency (50Hz) data simulating a SCADA environment.
- **Cyber-Physical Attack Detection**: Instantly detects "Voltage Collapse" and "Frequency Instability" attacks (e.g., Stuxnet-style sabotage).
- **Secure Forensic Logging**: SHA-256 Hash Chain logging to ensure data integrity and non-repudiation (Blockchain-ready).
- **Automated Incident Response**: Immediate email alerts (`Nodemailer`) triggered upon anomaly detection.
- **Role-Based Reset**: Separate controls for "Grid Simulation Reset" and "System Security Unlock" to ensure operational continuity.

## 🛠️ Tech Stack
- **Frontend**: React (Vite), TailwindCSS, Recharts (Industrial Dashboard)
- **Backend**: Node.js, Express (Implements "Digital Twin" Simulation)
- **Security**: SHA-256 Hashing, JWT Authentication
- **Hardware Ready**: API-First design compatible with ESP32/ZMPT101B sensors

## 🔮 Roadmap
- [ ] Integration with Real PLC/SCADA Hardware (Modbus/MQTT)
- [ ] SIEM Integration (Splunk/ELK Forwarding)
- [ ] AI-Powered Anomaly Detection (LSTM Models)

## 📦 Installation
1. Clone the repository.
2. `cd frontend` && `npm install`
3. `cd ../backend` && `npm install`
4. Run frontend: `npm run dev`
5. Run backend: `node server.js`

---
*Created by [Your Name] for Advanced Security Research Data.*
