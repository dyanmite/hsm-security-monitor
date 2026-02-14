import { useNavigate, useLocation } from "react-router-dom"
import { useState } from "react"
import { LayoutDashboard, FileText, Settings, LogOut, Menu, X, Shield } from "lucide-react"

export default function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)

  const menu = [
    { name: "Dashboard", path: "/dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: "Tamper Logs", path: "/logs", icon: <FileText className="w-5 h-5" /> },
    { name: "Settings", path: "/settings", icon: <Settings className="w-5 h-5" /> },
  ]

  const logout = async () => {
    navigate("/")
  }

  return (
    <>
      <div className="md:hidden bg-black/80 backdrop-blur-md p-4 flex justify-between items-center border-b border-white/10 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <img src="/hsm-logo.png" alt="Logo" className="w-8 h-8" />
          <span className="font-bold text-lg text-white">HSM Guard</span>
        </div>
        <button onClick={() => setIsOpen(!isOpen)} className="text-white focus:outline-none">
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden bg-zinc-900 border-b border-white/10 p-4 absolute top-16 left-0 w-full z-40 shadow-2xl">
          <nav className="flex flex-col space-y-2">
            {menu.map((item) => (
              <div
                key={item.path}
                onClick={() => { navigate(item.path); setIsOpen(false); }}
                className={`px-4 py-3 rounded-lg flex items-center gap-3 ${location.pathname === item.path ? "bg-blue-600/20 text-blue-400 border border-blue-500/30" : "text-slate-400"}`}
              >
                {item.icon}
                {item.name}
              </div>
            ))}
            <button onClick={logout} className="mt-4 w-full py-3 bg-red-500/10 text-red-500 border border-red-500/20 rounded-lg font-bold flex items-center justify-center gap-2">
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </nav>
        </div>
      )}

      <aside className="hidden md:flex w-72 bg-black border-r border-white/10 min-h-screen p-6 flex-col sticky top-0 h-screen">

        {/* Logo */}
        <div className="flex items-center gap-3 mb-12 px-2">
          <div className="w-12 h-12 flex items-center justify-center">
            <img src="/hsm-logo.png" alt="HSM Guard" className="w-full h-full object-contain drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-wide text-white block">
              HSM Guard
            </span>
            <span className="text-[10px] uppercase tracking-widest text-slate-500">Video Surveillance</span>
          </div>
        </div>

        {/* Menu */}
        <nav className="flex-1 space-y-3">
          {menu.map((item) => {
            const active = location.pathname === item.path
            return (
              <div
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`
                cursor-pointer px-4 py-3.5 rounded-xl transition-all duration-300 group
                flex items-center gap-3
                ${active
                    ? "bg-gradient-to-r from-blue-600/20 to-purple-600/10 text-white border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.1)]"
                    : "text-slate-400 hover:bg-white/5 hover:text-white border border-transparent"}
              `}
              >
                <span className={`transition-colors ${active ? "text-blue-400" : "text-slate-500 group-hover:text-white"}`}>
                  {item.icon}
                </span>
                <span className="font-medium tracking-wide text-sm">{item.name}</span>

                {active && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_#3b82f6]" />
                )}
              </div>
            )
          })}
        </nav>

        {/* Logout */}
        <button
          onClick={logout}
          className="
          mt-auto py-3.5 rounded-xl font-medium text-slate-400
          hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20
          transition-all border border-transparent
          flex items-center justify-center gap-2 text-sm
        "
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </aside>
    </>
  )
}
