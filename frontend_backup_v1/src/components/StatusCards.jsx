import { useEffect, useState } from "react"

export default function StatusCards({ systemStatus }) {
  const [uptime, setUptime] = useState(0)
  const [lastTamperTime, setLastTamperTime] = useState(null)
  const [keysZeroized, setKeysZeroized] = useState(false)

  // ⏱️ Uptime timer
  useEffect(() => {
    const timer = setInterval(() => {
      setUptime((prev) => prev + 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // 🔴 On LOCKED → zeroize keys + reset uptime
  useEffect(() => {
    if (systemStatus === "LOCKED") {
      setUptime(0)
      setLastTamperTime(new Date().toLocaleString())
      setKeysZeroized(true)
    }

    if (systemStatus === "SAFE") {
      setKeysZeroized(false)
    }
  }, [systemStatus])

  const formatUptime = () => {
    const h = Math.floor(uptime / 3600)
    const m = Math.floor((uptime % 3600) / 60)
    const s = uptime % 60
    return `${h}h ${m}m ${s}s`
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      {/* SYSTEM STATE */}
      <div className="card p-4">
        <p className="text-sm text-slate-400 font-medium tracking-wide">System State</p>
        <div className="mt-2 flex items-center gap-2">
          <span className={`h-2.5 w-2.5 rounded-full ${systemStatus === "LOCKED" ? "bg-red-500 animate-pulse" :
            systemStatus === "OFFLINE" ? "bg-slate-500" :
              "bg-green-500 animate-pulse"
            }`}></span>
          <p
            className={`text-2xl font-bold tracking-tight ${systemStatus === "LOCKED" ? "text-red-400 drop-shadow-md" :
              systemStatus === "OFFLINE" ? "text-slate-500" :
                "text-green-400 drop-shadow-md"
              }`}
          >
            {systemStatus || "OFFLINE"}
          </p>
        </div>
      </div>

      {/* UPTIME */}
      <div className="card p-4">
        <p className="text-sm text-slate-400 font-medium tracking-wide">System Uptime</p>
        <p className="mt-1 text-2xl font-bold text-cyan-400 font-mono tracking-tighter drop-shadow-sm">
          {formatUptime()}
        </p>
      </div>

      {/* LAST TAMPER */}
      <div className="card p-4">
        <p className="text-sm text-slate-400 font-medium tracking-wide">Last Tamper</p>
        <p className="mt-2 text-sm font-semibold text-yellow-400/90 whitespace-nowrap">
          {lastTamperTime ?? "No Incidents"}
        </p>
      </div>

      {/* 🔐 KEY ZEROIZATION */}
      <div
        className={`card p-4 border transition-colors duration-500 ${keysZeroized
          ? "bg-red-900/20 border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.3)]"
          : "border-slate-700/50"
          }`}
      >
        <p className="text-sm text-slate-400 font-medium tracking-wide">Crypto Keys</p>
        <p
          className={`mt-1 text-xl font-bold tracking-tight ${keysZeroized
            ? "text-red-500"
            : "text-emerald-400"
            }`}
        >
          {keysZeroized ? "ZEROIZED" : "SECURE"}
        </p>
      </div>

      {/* SECURITY MODE */}
      <div className="card p-4 bg-gradient-to-br from-slate-900/50 to-purple-900/20">
        <p className="text-sm text-slate-400 font-medium tracking-wide">Security Mode</p>
        <p className={`mt-1 text-lg font-bold flex items-center gap-2 ${systemStatus === "OFFLINE" ? "text-slate-500" :
            systemStatus === "LOCKED" ? "text-red-400" :
              "text-purple-400"
          }`}>
          {systemStatus === "OFFLINE" ? "🔌 Disconnected" :
            systemStatus === "LOCKED" ? "🔒 Locked Down" :
              "🛡️ HSM Active"}
        </p>
      </div>
    </div>
  )
}
