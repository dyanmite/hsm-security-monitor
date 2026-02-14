import { useRef, useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { apiPost } from "../api"

export default function Otp() {
  const navigate = useNavigate()
  const inputsRef = useRef([])
  const [otp, setOtp] = useState(Array(6).fill(""))
  const [error, setError] = useState("")
  const [shake, setShake] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const locked = attempts >= 3

  const dataFetched = useRef(false)

  useEffect(() => {
    // Prevent double-fetching in React Strict Mode
    if (dataFetched.current) return
    dataFetched.current = true

    // Request a new OTP when arriving at this page
    apiPost("/request-otp")
      .then(res => console.log("OTP Requested:", res))
      .catch(err => console.error("OTP Error:", err))
  }, [])

  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value) || locked) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    if (value && index < 5) {
      inputsRef.current[index + 1].focus()
    }
  }

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus()
    }
  }

  const verifyOtp = async () => {
    if (locked) return

    setError("")
    const code = otp.join("")

    try {
      const res = await apiPost("/verify-otp", { otp: code })

      if (res.success) {
        navigate("/dashboard")
      } else {
        throw new Error("Invalid OTP")
      }
    } catch (err) {
      setAttempts((prev) => prev + 1)
      setError("Invalid OTP")

      setShake(true)
      setTimeout(() => setShake(false), 400)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 relative overflow-hidden text-white">

      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-transparent to-cyan-500/10" />

      <div
        className={`
          relative z-10 w-[420px]
          bg-slate-800/70 backdrop-blur-xl
          border rounded-2xl p-8 shadow-xl
          transition
          ${shake ? "animate-shake border-red-500" : "border-slate-700"}
        `}
      >
        {/* Header */}
        <div className="text-center mb-6">
          <div className="text-3xl mb-2">{locked ? "🔒" : "🔐"}</div>
          <h2 className="text-2xl font-bold">
            {locked ? "Session Locked" : "OTP Verification"}
          </h2>

          <p className="text-slate-400 text-sm mt-1">
            {locked
              ? "Too many failed attempts. Access temporarily blocked."
              : "Enter the 6-digit verification code"}
          </p>
        </div>

        {/* OTP Inputs */}
        <div className="flex justify-between mb-6">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputsRef.current[index] = el)}
              value={digit}
              disabled={locked}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              maxLength={1}
              className={`
                w-12 h-14 text-center text-xl font-semibold rounded-lg
                bg-slate-900 border
                transition
                ${locked
                  ? "border-slate-700 opacity-50 cursor-not-allowed"
                  : "border-slate-700 focus:border-purple-500 focus:shadow-[0_0_12px_rgba(168,85,247,0.6)]"}
              `}
            />
          ))}
        </div>

        {error && !locked && (
          <p className="text-red-400 text-sm text-center mb-4">
            {error} ({3 - attempts} attempts left)
          </p>
        )}

        {locked && (
          <p className="text-red-500 text-sm text-center mb-4 font-semibold">
            HSM access locked for security reasons
          </p>
        )}

        {/* Verify Button */}
        <button
          onClick={verifyOtp}
          disabled={locked}
          className={`
            w-full py-2 rounded-lg font-semibold transition
            ${locked
              ? "bg-slate-700 cursor-not-allowed"
              : "bg-gradient-to-r from-purple-600 to-cyan-500 hover:shadow-[0_0_20px_rgba(34,211,238,0.6)] hover:scale-[1.02]"}
          `}
        >
          {locked ? "Locked" : "Verify →"}
        </button>
      </div>
    </div>
  )
}
