import { useLocation } from "react-router-dom"
import { Activity, Bell } from "lucide-react"

export default function Header({ systemStatus }) {
  const location = useLocation()

  const pageTitle = {
    "/dashboard": "Dashboard",
    "/logs": "Tamper Logs",
    "/settings": "Settings",
  }[location.pathname] || "HSM Guard"

  return (
    <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-white/10">

      {/* Left: Title */}
      <div>
        <div className="flex items-center gap-3">
          {location.pathname !== "/dashboard" && location.pathname !== "/" && (
            <button onClick={() => window.history.back()} className="md:hidden p-1 rounded-full bg-white/10 text-white">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
            </button>
          )}
          <h1 className="text-3xl font-display font-bold text-white tracking-tight flex items-center gap-3">
            {pageTitle === "HSM Guard" && <img src="/hsm-logo.png" alt="Logo" className="w-8 h-8" />}
            {pageTitle}
          </h1>
        </div>
        <p className="text-sm text-slate-400 mt-1">
          Enterprise Security Monitor • <span className="text-slate-600">v2.4.0-stable</span>
        </p>
      </div>

      {/* Right: Actions & Status */}
      <div className="flex items-center gap-4">

        <button className="p-2.5 rounded-full bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500 border border-black" />
        </button>

        <div className={`
            flex items-center gap-3 px-4 py-2.5 rounded-full border backdrop-blur-sm
            ${systemStatus === "LOCKED"
            ? "bg-red-500/10 border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.2)]"
            : "bg-emerald-500/10 border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.2)]"}
        `}>
          <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider mr-1">Protocol:</span>
          <div className="flex items-center gap-2">
            <span className={`relative flex h-2.5 w-2.5`}>
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${systemStatus === "LOCKED" ? "bg-red-400" : "bg-emerald-400"}`}></span>
              <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${systemStatus === "LOCKED" ? "bg-red-500" : "bg-emerald-500"}`}></span>
            </span>
            <span
              className={`text-sm font-bold tracking-wide ${systemStatus === "LOCKED" ? "text-red-400" : "text-emerald-400"}`}
            >
              {systemStatus || "ONLINE"}
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}
