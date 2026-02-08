import { useLocation } from "react-router-dom"

export default function Header({ systemStatus }) {
  const location = useLocation()

  const pageTitle = {
    "/dashboard": "Dashboard",
    "/logs": "Tamper Logs",
    "/settings": "Settings",
  }[location.pathname] || "HSM Guard"

  return (
    <header className="flex items-center justify-between mb-8 pb-4 border-b border-slate-800">

      {/* Left: Shield + Title */}
      <div className="flex items-center gap-4">
        <div className="bg-cyan-500/10 p-2 rounded-lg border border-cyan-500/20">
          <img
            src="/hsm-shield.png"
            alt="HSM"
            className="w-8 h-8 drop-shadow-[0_0_10px_rgba(34,211,238,0.4)]"
          />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            {pageTitle}
          </h1>
          <p className="text-xs text-slate-500 font-medium uppercase tracking-widest mt-0.5">
            Enterprise Security Monitor
          </p>
        </div>
      </div>

      {/* Right: Status */}
      <div className="flex items-center gap-3 bg-slate-800/50 px-4 py-2 rounded-full border border-slate-700/50 backdrop-blur-sm">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Status Protocol:</span>
        <div className="flex items-center gap-2">
          <span className={`h-2 w-2 rounded-full ${systemStatus === "LOCKED" ? "bg-red-500 animate-ping" : "bg-emerald-500"}`}></span>
          <span
            className={`text-sm font-bold tracking-wide ${systemStatus === "LOCKED" ? "text-red-400" : "text-emerald-400"}`}
          >
            {systemStatus || "SAFE"}
          </span>
        </div>
      </div>
    </header>
  )
}


