# 🛡️ HSM Security Monitor: Technical Pitch

## 🚀 The Hook: Why This Matters
"In a world of remote infrastructure, your cryptographic keys are only as safe as the physical hardware holding them. What happens when someone physically attacks your server rack? **HSM Security Monitor** is the answer."

---

## 🏗️ 1. The Hardware (The "Nervous System")
**Role:** Real-time Physical Threat Detection
**Tech Stack:** ESP32 Microcontroller, MPU6050 Gyro, Voltage Dividers, Reed Switches

"Our hardware isn't just a sensor; it's an **Active Defense System**."
*   **Motion Detection:** Uses a 6-axis Gyroscope (MPU6050) to detect if the device is being moved or stolen.
*   **Voltage Glitching Protection:** Monique's power lines to detect side-channel attacks (a common way to bypass encryption).
*   **Enclosure Integrity:** Immediate lockdown if the physical casing is opened (Reed/Light sensors).

## 🧠 2. The Backend (The "Brain")
**Role:** Decision Logic & Audit Trail
**Tech Stack:** Node.js, Express, Firebase Admin SDK

"The backend serves as the bridge between the physical and digital worlds."
*   **Cloud Synchronization:** Unlike traditional isolated HSMs, ours syncs state instantly to Google Firebase.
*   **Immutable Logging:** Every tamper event is cryptographically logged to Firestore with an IST timestamp, creating an unalterable audit trail.
*   **Critical Alerting:** Automatic email triggers via Nodemailer to the security team the *millisecond* a breach occurs.

## 💻 3. The Frontend (The "Command Center")
**Role:** Visualization & Control
**Tech Stack:** React, Tailwind CSS, Recharts, Firebase Auth

"Security interfaces are usually ugly. Ours is designed for **Situational Awareness**."
*   **Real-Time Visualization:** Live graphs showing attack frequency derived from actual log data.
*   **Remote Lockdown & Zeroization:** From this dashboard, an admin can hit "Zeroize" to wipe all keys remotely—the ultimate kill-switch.
*   **Secure Authentication:** Protected by Firebase Auth, ensuring only authorized personnel can reset the system.

---

## 🌟 Key Technical Innovation
**"The Hybrid Loop"**
Most security systems are either purely physical (alarms) or purely digital (firewalls). **HSM Security Monitor** fuses them.
A physical screwdriver attack on the device instantly becomes a digital push notification on the Chief Security Officer's phone. That is **True Convergence**.
