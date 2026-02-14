import { useState } from "react"
import { apiPost } from "../api"

export default function LockdownPanel({ onDeactivate, onReactivate, onReset, onZeroize }) {
  const [showOtp, setShowOtp] = useState(false)
  const [actionType, setActionType] = useState("") // deactivate | reactivate
  const [otp, setOtp] = useState("")
  const [error, setError] = useState(false)

  const handleActionClick = async (type) => {
    setActionType(type)
    setOtp("")
    setError(false)

    // Request real OTP from backend
    try {
      await apiPost("/request-otp")
      setShowOtp(true)
      console.log("OTP requested for", type)
    } catch (err) {
      console.error("Failed to request OTP", err)
      alert("Failed to send OTP. Check backend connection.")
    }
  }

  const handleVerifyOtp = async () => {
    try {
      const res = await apiPost("/verify-otp", { otp })

      if (res.success) {
        // execute the callback for the specific action
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
    <div className="bg-slate-800 rounded-xl p-6 h-full">
      <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
        🔒 Lockdown Mode Active
      </h3>

      <ul className="text-sm text-gray-300 space-y-1 mb-6">
        <li>• Triggered on physical tamper detection</li>
        <li>• Cryptographic operations halted</li>
        <li>• Manual administrator reset required</li>
      </ul>

      {/* 🔘 ACTION BUTTONS */}
      <div className="space-y-3">
        <button
          onClick={() => handleActionClick("deactivate")}
          className="w-full py-2 rounded-lg bg-yellow-500/10 text-yellow-400 border border-yellow-500/40 hover:bg-yellow-500/20 transition"
        >
          Deactivate Lockdown (Maintenance)
        </button>

        <button
          onClick={() => handleActionClick("reactivate")}
          className="w-full py-2 rounded-lg bg-green-500/10 text-green-400 border border-green-500/40 hover:bg-green-500/20 transition"
        >
          Reactivate Security
        </button>

        <button
          onClick={() => handleActionClick("reset")}
          className="w-full py-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/40 hover:bg-blue-500/20 transition"
        >
          Reset System (Unlock)
        </button>
      </div>

      {/* 🔐 OTP MODAL */}
      {showOtp && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div
            className={`bg-slate-900 rounded-xl p-6 w-80 border border-slate-700 ${error ? "shake border-red-500" : ""
              }`}
          >
            <h4 className="font-semibold mb-2">
              OTP Verification Required
            </h4>

            <p className="text-xs text-gray-400 mb-4">
              Enter administrator OTP to proceed
            </p>

            <input
              type="password"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
              className="w-full text-center text-lg tracking-widest bg-slate-800 rounded-lg py-2 mb-3 outline-none border border-slate-700 focus:border-purple-500"
              placeholder="••••••"
            />

            {error && (
              <p className="text-xs text-red-400 mb-2">
                Invalid OTP. Try again.
              </p>
            )}

            <div className="flex gap-2">
              <button
                onClick={() => setShowOtp(false)}
                className="flex-1 py-2 text-sm rounded-lg bg-slate-700 hover:bg-slate-600"
              >
                Cancel
              </button>
              <button
                onClick={handleVerifyOtp}
                className="flex-1 py-2 text-sm rounded-lg bg-purple-600 hover:bg-purple-700"
              >
                Verify
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

