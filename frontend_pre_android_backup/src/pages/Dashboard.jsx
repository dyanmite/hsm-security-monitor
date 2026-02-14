import { useEffect, useState } from "react"
import Sidebar from "../components/Sidebar"
import Header from "../components/Header"
import StatusCards from "../components/StatusCards"
import TamperGraph from "../components/TamperGraph"
import EventLogTable from "../components/EventLogTable"
import LockdownPanel from "../components/LockdownPanel"
import SensorStatusPanel from "../components/SensorStatusPanel"
import QuantumSimulator from "../components/QuantumSimulator"
import KeyVault from "../components/KeyVault"
import GridMonitor from "../components/GridMonitor"
import { apiGet, apiPost } from "../api"

function Dashboard() {
  /* =======================
     🔹 STATE (APPENDED ONLY)
  ======================= */
  const [status, setStatus] = useState(null)
  const [logs, setLogs] = useState([])
  const [uptime, setUptime] = useState(0)
  const [alertVisible, setAlertVisible] = useState(false)

  /* =======================
     🔹 AUTH CHECK (UNCHANGED)
  ======================= */
  /* =======================
     🔹 AUTH CHECK (UPDATED)
  ======================= */
  useEffect(() => {
    // We use apiGet which now attaches the Firebase Bearer Token automatically
    apiGet("/auth/status")
      .then((res) => {
        if (!res.user) window.location.href = "/"
      })
      .catch(() => {
        window.location.href = "/"
      })
  }, [])

  /* =======================
     🔹 BACKEND DATA FETCH
  ======================= */
  useEffect(() => {
    // 1. Fetch Status (Fast, In-Memory) frequently
    async function fetchStatus() {
      try {
        const statusRes = await apiGet("/status")
        const uptimeRes = await apiGet("/uptime")
        setStatus(statusRes)
        setUptime(uptimeRes.uptimeSeconds)
        if (statusRes.locked) setAlertVisible(true)
      } catch (err) {
        console.error("Status fetch error", err)
      }
    }

    // 2. Fetch Logs (Slow, Firestore) less frequently
    async function fetchLogs() {
      try {
        const logsRes = await apiGet("/logs")
        if (Array.isArray(logsRes)) {
          setLogs(logsRes.reverse())
        }
      } catch (err) {
        console.error("Log fetch error", err)
      }
    }

    // Initial Load
    fetchStatus();
    fetchLogs();

    const statusInterval = setInterval(fetchStatus, 2000); // Fast status updates (2s)
    const logsInterval = setInterval(fetchLogs, 10000);   // Slower log updates (10s) to save bandwidth

    return () => {
      clearInterval(statusInterval);
      clearInterval(logsInterval);
    }
  }, [])

  /* =======================
     🔹 SYSTEM STATUS LOGIC
  ======================= */
  const systemStatus = status?.status || "OFFLINE"

  const dangerClass =
    systemStatus === "LOCKED" || systemStatus === "ZEROIZED"
      ? "danger-pulse border border-red-500/40"
      : "border border-transparent"

  /* =======================
     🔹 HELPERS
  ======================= */
  function formatUptime(sec) {
    const h = Math.floor(sec / 3600)
    const m = Math.floor((sec % 3600) / 60)
    const s = sec % 60
    return `${h}h ${m}m ${s}s`
  }

  /* =======================
     🔹 OTP RESET HANDLER
  ======================= */
  async function requestResetOTP() {
    await apiPost("/request-otp")
    alert("OTP sent (check backend console)")
  }

  async function submitOTP(otp) {
    const res = await apiPost("/verify-otp", { otp })
    if (res.success) {
      await apiPost("/reset")
      setAlertVisible(false)
    }
  }

  return (
    <div className="flex flex-col md:flex-row bg-slate-900 text-white min-h-screen">
      <Sidebar />

      <div className="flex-1 p-4 md:p-6 overflow-x-hidden">
        <Header systemStatus={systemStatus} />

        {/* =======================
            🚨 CRITICAL ALERT BANNER
        ======================= */}
        {systemStatus === "LOCKED" && (
          <div className="mb-4 rounded-lg border border-red-500 bg-red-500/10 p-4 text-red-400 animate-pulse">
            🚨 <b>CRITICAL ALERT SENT</b>
            <ul className="mt-2 text-sm list-disc list-inside">
              <li>Push notification</li>
              <li>Email alert</li>
              <li>SOC dashboard</li>
            </ul>
          </div>
        )}

        {/* =======================
            🔹 STATUS CARDS
        ======================= */}
        <div className={`rounded-xl p-1 mb-6 transition-all duration-300 ${dangerClass}`}>
          <StatusCards
            systemStatus={systemStatus}
            uptime={formatUptime(uptime)}
            lastTamper={logs[0]?.time || "—"}
          />
        </div>

        {/* =======================
            🔹 SENSORS | QUANTUM | KEYS
        ======================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <SensorStatusPanel
            systemStatus={systemStatus}
            alerts={status?.triggers || []}
          />
          <KeyVault systemStatus={systemStatus} />
          <QuantumSimulator />
        </div>

        {/* =======================
            🔹 GRAPH + LOCKDOWN
        ======================= */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className={`lg:col-span-2 rounded-xl transition-all duration-300 ${dangerClass}`}>
            <TamperGraph logs={logs} />
          </div>

          <div className={`rounded-xl transition-all duration-300 ${dangerClass}`}>
            <LockdownPanel
              onDeactivate={() => apiPost("/deactivate")}
              onReactivate={() => apiPost("/reactivate")}
              onReset={() => apiPost("/reset")}
              onZeroize={() => apiPost("/zeroize")}
            />
          </div>
        </div>

        {/* =======================
            🔹 GRID MONITOR (Phantom SCADA)
        ======================= */}
        <div className="mb-6">
          <GridMonitor />
        </div>

        {/* =======================
            🔹 EVENT LOG TABLE
        ======================= */}
        <div className={`mt-6 rounded-xl transition-all duration-300 ${dangerClass}`}>
          <EventLogTable logs={logs} />
        </div>
      </div>
    </div>
  )
}

export default Dashboard
