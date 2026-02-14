import { useState } from "react"
import { apiPost } from "../api"
import { Lock, Unlock, RotateCcw, ShieldAlert, KeyRound, X } from "lucide-react"

export default function LockdownPanel({ onDeactivate, onReactivate, onReset, onZeroize }) {
  const [showOtp, setShowOtp] = useState(false)
  const [actionType, setActionType] = useState("")
  const [otp, setOtp] = useState("")
  const [error, setError] = useState(false)

  const handleActionClick = async (type) => {
    setActionType(type)
    setOtp("")
    setError(false)

    try {
      await apiPost("/request-otp")
      setShowOtp(true)
    } catch (err) {
      console.error("Failed to request OTP", err)
      alert("Failed to send OTP. Check backend connection.")
    }
  }

  const handleVerifyOtp = async () => {
    try {
      const res = await apiPost("/verify-otp", { otp })

      if (res.success) {
        if (actionType === "deactivate") onDeactivate()
        if (actionType === "reactivate") onReactivate()
        if (actionType === "reset") onReset()
        setShowOtp(false)
      } else {
        throw new Error("Invalid OTP")
      }
    } catch (err) {
      setError(true)
      setOtp("")
    }
  }

  return (
    <div className="bg-red-950/20 border border-red-500/20 rounded-2xl p-6 h-full backdrop-blur-sm">
      <h3 className="text-lg font-bold text-red-50 mb-4 flex items-center gap-2">
        <Lock className="w-5 h-5 text-red-500" />
        Lockdown Controls
      </h3>

      <div className="text-xs text-red-200/60 space-y-2 mb-6 bg-red-900/10 p-3 rounded-lg border border-red-500/10">
        <p className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-red-400" /> Triggered on physical tamper</p>
        <p className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-red-400" /> Crypto operations halted</p>
        <p className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-red-400" /> Admin reset required</p>
      </div>

      <div className="space-y-3">
        <button
          onClick={() => handleActionClick("deactivate")}
          className="w-full py-3 rounded-xl bg-yellow-500/10 text-yellow-500 border border-yellow-500/30 hover:bg-yellow-500/20 transition flex items-center justify-center gap-2 text-sm font-bold"
        >
          <RotateCcw className="w-4 h-4" /> Deactivate (Maintenance)
        </button>

        <button
          onClick={() => handleActionClick("reactivate")}
          className="w-full py-3 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 hover:bg-emerald-500/20 transition flex items-center justify-center gap-2 text-sm font-bold"
        >
          <ShieldAlert className="w-4 h-4" /> Reactivate Security
        </button>

        <button
          onClick={() => handleActionClick("reset")}
          className="w-full py-3 rounded-xl bg-blue-500/10 text-blue-500 border border-blue-500/30 hover:bg-blue-500/20 transition flex items-center justify-center gap-2 text-sm font-bold"
        >
          <Unlock className="w-4 h-4" /> System Unlock
        </button>
      </div>

      {showOtp && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 rounded-2xl p-8 w-full max-w-sm border border-white/10 shadow-2xl relative">

            <button
              onClick={() => setShowOtp(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto mb-4 border border-purple-500/30">
                <KeyRound className="w-6 h-6 text-purple-500" />
              </div>
              <h4 className="text-xl font-bold text-white">Admin Verification</h4>
              <p className="text-xs text-slate-400 mt-1">Enter OTP to confirm critical action</p>
            </div>

            <input
              type="password"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
              className="w-full text-center text-2xl tracking-[0.5em] font-mono bg-black/50 rounded-xl py-4 mb-4 outline-none border border-white/10 focus:border-purple-500 transition-colors text-white placeholder-slate-700"
              placeholder="••••••"
              autoFocus
            />

            {error && (
              <p className="text-xs text-red-400 text-center mb-4 bg-red-500/10 p-2 rounded">
                Authorization Failed. Invalid Token.
              </p>
            )}

            <button
              onClick={handleVerifyOtp}
              className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold transition shadow-lg shadow-purple-500/20"
            >
              Confirm & Execute
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
