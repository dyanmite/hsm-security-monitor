const express = require("express");
const path = require("path");
const cors = require("cors");
const nodemailer = require("nodemailer");
const fs = require("fs");
const crypto = require("crypto");
const gridSimulation = require("./simulation"); // [NEW] Simulation Module

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Start Simulation
gridSimulation.start();

// Listen for Simulation Events
gridSimulation.on('intrusion', (data) => {
  let eventName = "";
  let emailBody = "";

  if (data.type === "GROVER") {
    eventName = "QUANTUM_ENTROPY_COLLAPSE";
    // 🚨 TRIGGER SYSTEM LOCKDOWN FOR QUANTUM THREAT
    systemLocked = true;
    zeroized = true;
    systemStatus = "LOCKED";
    activeTriggers.add("QUANTUM_THREAT");

    emailBody = `🚨 QUANTUM THREAT DETECTED 🚨\n\nType: GROVER ALGORITHM\nEntropy: ${data.entropy}%\nStatus: KEYS ZEROIZED\n\nSystem has been LOCKED to prevent decryption.`;
  } else {
    eventName = data.type === "VOLTAGE_DROP" ? "GRID_VOLTAGE_COLLAPSE" : "GRID_FREQ_INSTABILITY";
    emailBody = `Industrial Grid Anomaly Detected!\nType: ${data.type}\nVoltage: ${data.voltage}V\nFrequency: ${data.frequency}Hz\n\nImmediate Action Required.`;
  }

  const logStatus = data.type === "GROVER" ? "LOCKED" : "COMPROMISED";
  addLog(eventName, logStatus);

  // Send Email Alert
  sendAlert(
    `CRITICAL: ${eventName}`,
    emailBody
  );
});

// =====================
// LOCAL DB SETUP
// =====================
const DATA_DIR = path.join(__dirname, "data");
const LOGS_FILE = path.join(DATA_DIR, "logs.json");
const CONFIG_FILE = path.join(DATA_DIR, "config.json");

// Ensure data dir exists (redundant safety)
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);

// Load Config
let emailSettings = {
  recipient: "",
  sender: "",
  appPassword: ""
};

try {
  if (fs.existsSync(CONFIG_FILE)) {
    const raw = fs.readFileSync(CONFIG_FILE);
    emailSettings = JSON.parse(raw);
    console.log("✅ Config loaded from local DB");
  }
} catch (e) {
  console.error("Failed to load config:", e.message);
}

// Load Logs (Persistent)
let localLogs = [];
let lastHash = "0000000000000000000000000000000000000000000000000000000000000000";

try {
  if (fs.existsSync(LOGS_FILE)) {
    const raw = fs.readFileSync(LOGS_FILE);
    localLogs = JSON.parse(raw);
    if (localLogs.length > 0) {
      lastHash = localLogs[0].hash; // Logs are stored newest-first
    }
    console.log(`✅ Loaded ${localLogs.length} logs from local DB`);
  }
} catch (e) {
  console.error("Failed to load logs:", e.message);
}

// =====================
// AUTH MIDDLEWARE (LOCAL)
// =====================
// Simple Hardcoded Auth for Demo
const ADMIN_TOKEN = "local-demo-token-12345";

async function requireAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = header.split(" ")[1];
  if (token === ADMIN_TOKEN) {
    req.user = { email: "admin@local.host", uid: "admin" };
    next();
  } else {
    return res.status(403).json({ error: "Unauthorized" });
  }
}

// LOGIN ENDPOINT (Replaces Firebase Auth)
app.post("/auth/login", (req, res) => {
  const { email, password } = req.body;
  // Hardcoded Credentials (Relaxed Email Check)
  if ((email === "admin" || email === "admin@hsm.sec" || email === "admin@local.host") && password === "kadhaipaneer") {
    res.json({ token: ADMIN_TOKEN, user: { email: "admin@local.host" } });
  } else {
    res.status(401).json({ error: "Invalid credentials" });
  }
});

app.get("/auth/status", requireAuth, (req, res) => {
  res.json({ status: "valid", user: req.user });
});

// =====================
// SYSTEM STATE
// =====================
let systemLocked = false;
let systemStatus = "SAFE"; // SAFE, LOCKED, OFFLINE, MAINTENANCE
let sensorsActive = true;
let zeroized = false;
let uptimeStart = Date.now();
let lastHeartbeat = Date.now();
let activeOTP = null;
let otpAttempts = 0;
let activeTriggers = new Set();

// =====================
// LOGGING FUNCTION
// =====================
function addLog(event, status) {
  // Calculate IST Time
  const now = new Date();
  const offset = 5.5 * 60 * 60 * 1000;
  const istDate = new Date(now.getTime() + offset);
  const istString = istDate.toISOString().replace("T", " ").slice(0, 19);

  // 1. Calculate Hash (Immutable Chain)
  const dataToHash = istString + event + status + lastHash;
  const currentHash = crypto.createHash("sha256").update(dataToHash).digest("hex");

  const prevHashStored = lastHash;
  lastHash = currentHash;

  const newLog = {
    time: istString,
    event,
    status,
    hash: currentHash,
    prevHash: prevHashStored
  };

  // 2. Add to Memory
  localLogs.unshift(newLog);
  // Keep last 1000 logs for local DB
  if (localLogs.length > 1000) localLogs.pop();

  // 3. Persist to Disk (JSON)
  try {
    fs.writeFileSync(LOGS_FILE, JSON.stringify(localLogs, null, 2));
  } catch (e) {
    console.error("Failed to write logs:", e.message);
  }
}

function saveConfig() {
  try {
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(emailSettings, null, 2));
  } catch (e) {
    console.error("Failed to save config:", e.message);
  }
}

// =====================
// EMAIL & OTP
// =====================
async function sendAlert(subject, text, targetEmail = null) {
  const recipient = targetEmail || emailSettings.recipient;

  if (!emailSettings.sender || !emailSettings.appPassword) {
    console.log("Skipping email: No Sender Configured");
    return;
  }
  if (!recipient) {
    console.log("Skipping email: No Recipient");
    return;
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: emailSettings.sender,
        pass: emailSettings.appPassword,
      },
    });

    await transporter.sendMail({
      from: emailSettings.sender,
      to: recipient,
      subject: `[HSM ALERT] ${subject}`,
      text: text,
    });
    console.log(`Email sent to ${recipient}: ${subject}`);
  } catch (error) {
    console.error("Failed to send email:", error.message);
  }
}

app.post("/settings/email", requireAuth, (req, res) => {
  const { recipient, sender, appPassword } = req.body;
  if (recipient !== undefined) emailSettings.recipient = recipient;
  if (sender !== undefined) emailSettings.sender = sender;
  if (appPassword !== undefined) emailSettings.appPassword = appPassword;

  saveConfig(); // Persist

  res.json({ success: true, message: "Email settings saved locally" });
  if (emailSettings.recipient) {
    sendAlert("System Configured", "HSM Security Monitor is now connected (Local DB Mode).");
  }
});

app.get("/settings/email", requireAuth, (req, res) => {
  res.json({
    recipient: emailSettings.recipient,
    sender: emailSettings.sender,
    isConfigured: !!(emailSettings.recipient && emailSettings.sender && emailSettings.appPassword)
  });
});

app.post("/request-otp", requireAuth, (req, res) => {
  activeOTP = Math.floor(100000 + Math.random() * 900000).toString();
  otpAttempts = 0;
  console.log("OTP:", activeOTP);

  // Send to User (which is now just hardcoded admin or configured recipient)
  const requesterEmail = emailSettings.recipient;

  if (requesterEmail) {
    sendAlert("OTP Verification", `Your Secure Access Code is: ${activeOTP}`, requesterEmail);
    res.json({ message: `OTP sent to ${requesterEmail}` });
  } else {
    res.json({ message: "OTP Generated (Configure Email Settings to receive it)" });
  }
});

app.post("/verify-otp", requireAuth, (req, res) => {
  const { otp } = req.body;
  if (!activeOTP) return res.status(400).json({ error: "No OTP active" });

  if (otp === activeOTP) {
    activeOTP = null;
    return res.json({ success: true });
  }

  otpAttempts++;
  if (otpAttempts >= 3) {
    systemLocked = true;
    systemStatus = "LOCKED";
    addLog("OTP_FAILED", "LOCKED");
    sendAlert("SECURITY LOCKDOWN", "Multiple failed access attempts. System Locked.");
  }
  res.status(401).json({ error: "Invalid OTP" });
});

// =====================
// GRID SIMULATION API
// =====================
app.get("/api/grid/status", (req, res) => {
  res.json(gridSimulation.getStatus());
});

app.post("/api/grid/attack", (req, res) => {
  const { type } = req.body; // "VOLTAGE_DROP" or "FREQ_SPIKE"
  gridSimulation.triggerAttack(type || "VOLTAGE_DROP");
  res.json({ success: true, message: "Attack Triggered" });
});

app.post("/api/grid/reset", (req, res) => {
  gridSimulation.reset();
  res.json({ success: true, message: "Grid Simulation Reset" });
});


// =====================
// DATA ENDPOINTS
// =====================
app.get("/logs", requireAuth, (req, res) => {
  res.json(localLogs);
});

app.get("/esp/status", (req, res) => {
  res.json({ locked: systemLocked, sensorsActive, zeroized });
});

app.post("/heartbeat", (req, res) => {
  lastHeartbeat = Date.now();
  console.log("[HEARTBEAT] Received ping from ESP32");

  // AUTO-RECOVERY: If locked ONLY due to disconnection, unlock on new heartbeat
  if (systemLocked && activeTriggers.has("DEVICE_DISCONNECTED") && activeTriggers.size === 1) {
    console.log("[HEARTBEAT] Device Reconnected - Auto-Unlocking System");
    systemStatus = "SAFE";
    systemLocked = false;
    zeroized = false;
    activeTriggers.delete("DEVICE_DISCONNECTED");
    addLog("DEVICE_RECONNECTED", "SAFE");
  }

  if (systemStatus === "OFFLINE") {
    console.log("[HEARTBEAT] System back ONLINE");
    systemStatus = "SAFE";
  }
  res.send("PONG");
});

app.get("/", (_, res) => res.send("HSM Secure Gateway (Local JSON Edition)"));

app.get("/status", requireAuth, (req, res) => {
  const diff = Date.now() - lastHeartbeat;
  const isOffline = diff > 15000; // 15 seconds timeout

  // GRACE PERIOD: 30 seconds after reset (Allow ESP reboot time)
  const inGracePeriod = Date.now() < (uptimeStart + 30000);

  if (isOffline && !inGracePeriod && systemStatus !== "LOCKED" && systemStatus !== "OFFLINE") {
    console.log(`[HEARTBEAT] 🚨 Device OFFLINE (Possible Tamper) - LOCKING DOWN`);
    systemStatus = "LOCKED";
    systemLocked = true;
    zeroized = true;
    activeTriggers.add("DEVICE_DISCONNECTED");
    addLog("DEVICE_DISCONNECTED", "LOCKED");
    sendAlert("CRITICAL: DEVICE DISCONNECTED", "Heartbeat lost. System Locked & Zeroized.");
  }

  res.json({
    status: systemStatus,
    locked: systemStatus === "LOCKED",
    triggers: Array.from(activeTriggers)
  });
});

app.get("/uptime", requireAuth, (req, res) => {
  res.json({ uptimeSeconds: Math.floor((Date.now() - uptimeStart) / 1000) });
});

app.post("/log", (req, res) => {
  const { event, status } = req.body;
  if (!event || !status) return res.status(400).json({ error: "Invalid log" });

  if (sensorsActive) {
    if (status === "LOCKED") {
      systemLocked = true;
      systemStatus = "LOCKED";
      activeTriggers.add(event);
      console.log(`[DEBUG] Locked by: ${event}. Active Triggers:`, Array.from(activeTriggers));
      sendAlert("SYSTEM LOCKED", `Event: ${event}\nStatus: LOCKED\nTime: ${new Date().toLocaleString()}`);
    }
    addLog(event, status);
  }
  res.json({ success: true });
});

app.post("/reset", requireAuth, (req, res) => {
  systemLocked = false;
  systemStatus = "SAFE";
  sensorsActive = true;
  zeroized = false;
  activeTriggers.clear();
  uptimeStart = Date.now(); // Resets Helper for Grace Period
  lastHeartbeat = Date.now(); // Reset heartbeat timer to give device a fresh start
  addLog("SYSTEM_RESET", "SAFE");
  sendAlert("System Reset", "System reset by admin.");
  res.json({ success: true });
});

app.post("/deactivate", requireAuth, (req, res) => {
  sensorsActive = false;
  systemStatus = "MAINTENANCE";
  addLog("MAINTENANCE_MODE", "SAFE");
  res.json({ success: true });
});

app.post("/reactivate", requireAuth, (req, res) => {
  sensorsActive = true;
  systemStatus = "SAFE";
  addLog("SYSTEM_ARMED", "SAFE");
  res.json({ success: true });
});

app.post("/zeroize", requireAuth, (req, res) => {
  zeroized = true;
  systemLocked = true;
  systemStatus = "LOCKED";
  addLog("KEY_ZEROIZED", "LOCKED");
  sendAlert("CRITICAL: KEYS ZEROIZED", "System keys destroyed. Manual recovery required.");
  res.json({ success: true });
});

// =====================
// NETWORK DISCOVERY
// =====================
const os = require('os');
function getLocalIPs() {
  const interfaces = os.networkInterfaces();
  const ips = [];
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        ips.push(iface.address);
      }
    }
  }
  return ips;
}

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Backend running on http://localhost:${PORT}`);
  console.log("Local JSON DB: Active");
  console.log("Available on your network at:");
  getLocalIPs().forEach(ip => {
    console.log(`  http://${ip}:${PORT}`);
  });
});
