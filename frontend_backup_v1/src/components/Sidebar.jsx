import { useNavigate, useLocation } from "react-router-dom"
import { useState } from "react"

export default function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)

  const menu = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Tamper Logs", path: "/logs" },
    { name: "Settings", path: "/settings" },
  ]

  const logout = async () => {
    // In a real app we might fetch logout endpoint
    // await fetch("http://localhost:5000/auth/logout", { credentials: "include" })
    navigate("/")
  }

  return (
    <>
      <div className="md:hidden bg-slate-800 p-4 flex justify-between items-center border-b border-slate-700 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <img src="/hsm-shield.png" alt="Logo" className="w-8 h-8" />
          <span className="font-bold text-lg text-white">HSM Guard</span>
        </div>
        <button onClick={() => setIsOpen(!isOpen)} className="text-white focus:outline-none">
          {/* Hamburger Icon */}
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden bg-slate-800 p-4 absolute top-16 left-0 w-full z-40 border-b border-slate-700 shadow-xl">
          <nav className="flex flex-col space-y-2">
            {menu.map((item) => (
              <div
                key={item.path}
                onClick={() => { navigate(item.path); setIsOpen(false); }}
                className={`px-4 py-3 rounded-lg ${location.pathname === item.path ? "bg-slate-700 text-white" : "text-slate-400"}`}
              >
                {item.name}
              </div>
            ))}
            <button onClick={logout} className="mt-4 w-full py-3 bg-red-600 rounded-lg font-bold">Logout</button>
          </nav>
        </div>
      )}

      <aside className="hidden md:flex w-64 bg-slate-800 border-r border-slate-700 min-h-screen p-5 flex-col sticky top-0 h-screen">

        {/* Logo */}
        <div className="flex items-center gap-3 mb-10 pl-2">
          <img
            src="/hsm-shield.png"
            alt="HSM Guard"
            className="
            w-9 h-9
            transition
            hover:drop-shadow-[0_0_10px_rgba(168,85,247,0.6)]
          "
          />
          <span className="text-xl font-bold tracking-wide text-white">
            HSM Guard
          </span>
        </div>

        {/* Menu */}
        <nav className="flex-1 space-y-2">
          {menu.map((item) => {
            const active = location.pathname === item.path

            return (
              <div
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`
                cursor-pointer px-4 py-3 rounded-lg transition
                flex items-center justify-between group
                ${active
                    ? "bg-slate-700 text-white shadow-lg shadow-black/20"
                    : "text-slate-400 hover:bg-slate-700/50 hover:text-white"}
              `}
              >
                <span className="font-medium tracking-wide">{item.name}</span>

                {/* Active indicator */}
                {active && (
                  <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                )}
              </div>
            )
          })}
        </nav>

        {/* Logout */}
        <button
          onClick={logout}
          className="
          mt-6 py-3 rounded-lg font-semibold text-white
          bg-gradient-to-r from-red-600 to-red-700
          hover:from-red-500 hover:to-red-600
          transition shadow-lg shadow-red-900/30
          border border-red-500/30
        "
        >
          Logout
        </button>
      </aside>
    </>
  )
}
