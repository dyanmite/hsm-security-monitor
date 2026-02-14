import { useRef, useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { apiPost } from "../api"
import { ShieldCheck, Lock, AlertTriangle } from "lucide-react"

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
    if (dataFetched.current) return
    dataFetched.current = true

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
    <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden text-white font-sans selection:bg-purple-500/30">

      {/* Background Ambience */}
      <div className="absolute top-[-30%] left-[20%] w-[600px] h-[600px] bg-purple-900/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />

      <div
        className={`
          relative z-10 w-full max-w-md px-6
          transition-transform duration-100
          ${shake ? "translate-x-[-5px]" : ""}
        `}
      >
        <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl relative overflow-hidden">

          {/* Status Indicator */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-blue-500" />

          <div className="text-center mb-8">
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${locked ? 'bg-red-500/20 text-red-500 border border-red-500/50' : 'bg-purple-500/20 text-purple-400 border border-purple-500/50'}`}>
              {locked ? <AlertTriangle className="w-8 h-8" /> : <ShieldCheck className="w-8 h-8" />}
            </div>
            <h2 className="text-2xl font-bold text-white">
              {locked ? "Session Locked" : "2FA Verification"}
            </h2>
            <p className="text-slate-400 text-sm mt-2">
              {locked
                ? "Security protocol initiated. Access blocked."
                : "Enter the 6-digit code sent to your device."}
            </p>
          </div>

          {/* OTP Inputs */}
          <div className="flex justify-between gap-2 mb-8">
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
                        w-12 h-14 text-center text-xl font-bold rounded-lg
                        bg-black/50 border
                        transition-all duration-200
                        ${locked
                    ? "border-red-900/50 text-red-500/50 cursor-not-allowed"
                    : "border-white/10 text-white focus:border-purple-500 focus:shadow-[0_0_15px_rgba(168,85,247,0.3)] focus:outline-none"}
                    `}
              />
            ))}
          </div>

          {error && !locked && (
            <div className="flex items-center justify-center gap-2 text-red-400 text-sm mb-6 bg-red-500/10 p-2 rounded-lg">
              <span>Invalid Code ({3 - attempts} attempts remaining)</span>
            </div>
          )}

          {locked && (
            <div className="text-center mb-6">
              <p className="text-red-500 font-mono text-xs border border-red-500/30 bg-red-500/10 p-2 rounded">
                ERROR_CODE_0x99: BRUTE_FORCE_DETECTED
              </p>
            </div>
          )}

          <button
            onClick={verifyOtp}
            disabled={locked}
            className={`
                w-full py-3 rounded-xl font-bold transition-all shadow-lg
                ${locked
                ? "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                : "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white shadow-purple-500/25 hover:scale-[1.02]"}
            `}
          >
            {locked ? "Access Denied" : "Verify Identity"}
          </button>
        </div>

        <div className="mt-8 text-center opacity-50">
          <div className="flex items-center justify-center gap-2 text-xs font-mono text-slate-500">
            <Lock className="w-3 h-3" /> Encrypted Channel
          </div>
        </div>

      </div>
    </div>
  )
}
