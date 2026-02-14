import { useEffect, useState } from "react"
import { Activity, Clock, AlertTriangle, Key, Shield, Wifi, Lock } from "lucide-react"

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
      setLastTamperTime(new Date().toLocaleTimeString())
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

  // Common Card Style
  const cardClass = "relative overflow-hidden rounded-2xl p-5 border bg-slate-900/50 backdrop-blur-sm transition-all duration-300 group hover:bg-slate-800/50"

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">

      {/* 1. SYSTEM STATE */}
      <div className={`${cardClass} ${systemStatus === "LOCKED"
        ? "border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.2)]"
        : "border-emerald-500/30"
        }`}>
        <div className="flex items-center gap-3 mb-2">
          <Wifi className={`w-5 h-5 ${systemStatus === "LOCKED" ? "text-red-500" : "text-emerald-500"}`} />
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">System State</span>
        </div>
        <p className={`text-xl font-bold tracking-tight truncate ${systemStatus === "LOCKED" ? "text-red-400" : "text-emerald-400"
          }`}>
          {systemStatus || "OFFLINE"}
        </p>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-50" />
      </div>

      {/* 2. UPTIME */}
      <div className={`${cardClass} border-blue-500/30`}>
        <div className="flex items-center gap-3 mb-2">
          <Clock className="w-5 h-5 text-blue-400" />
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Uptime</span>
        </div>
        <p className="text-xl font-bold text-white font-mono tracking-tight">
          {formatUptime()}
        </p>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50" />
      </div>

      {/* 3. LAST TAMPER */}
      <div className={`${cardClass} border-yellow-500/30`}>
        <div className="flex items-center gap-3 mb-2">
          <AlertTriangle className="w-5 h-5 text-yellow-500" />
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Last Tamper</span>
        </div>
        <p className="text-sm font-semibold text-yellow-100/80 truncate">
          {lastTamperTime || "No Recent Incidents"}
        </p>
      </div>

      {/* 4. CRYPTO KEYS */}
      <div className={`${cardClass} ${keysZeroized ? "border-red-500/50 bg-red-900/10" : "border-purple-500/30"}`}>
        <div className="flex items-center gap-3 mb-2">
          <Key className={`w-5 h-5 ${keysZeroized ? "text-red-500" : "text-purple-400"}`} />
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Crypto Keys</span>
        </div>
        <p className={`text-xl font-bold tracking-tight ${keysZeroized ? "text-red-500" : "text-purple-400"}`}>
          {keysZeroized ? "ZEROIZED" : "SECURE"}
        </p>
      </div>

      {/* 5. SECURITY MODE */}
      <div className={`${cardClass} border-indigo-500/30`}>
        <div className="flex items-center gap-3 mb-2">
          <Shield className="w-5 h-5 text-indigo-400" />
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Security</span>
        </div>
        <p className="text-sm font-bold text-indigo-100 flex items-center gap-2">
          {systemStatus === "LOCKED" ? "LOCKDOWN" : "SHIELD ACTIVE"}
          <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
        </p>
      </div>

    </div>
  )
}
