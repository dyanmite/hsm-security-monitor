import { useState } from "react"
import { useNavigate } from "react-router-dom"
// REMOVED: import { signInWithEmailAndPassword... }
// REMOVED: import { auth } from "../firebase";
import { apiPost } from "../api"; // New API helper

export default function Login() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  // REMOVED: import { auth } from "../firebase";

  const handleAuth = async (e) => {
    if (e) e.preventDefault();
    if (!email || !password) {
      setError("Please enter credentials")
      return
    }

    setError("")
    setLoading(true)

    try {
      if (isRegistering) {
        // We disabled registration for local demo
        setError("Registration disabled in Local Mode. Use admin/admin.");
        setLoading(false);
        return;
      }

      // LOCAL AUTH: Call backend
      const res = await apiPost("/auth/login", { email, password });

      if (res.error) {
        throw new Error(res.error);
      }

      // Save Token to LocalStorage
      if (res.token) {
        localStorage.setItem("hsm_token", res.token);
        navigate("/dashboard");
      } else {
        throw new Error("No token received");
      }

    } catch (err) {
      console.error(err);
      setError(err.message || "Authentication failed");
    } finally {
      setLoading(false)
    }
  }

  // 🔑 Press Enter to Login
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleAuth()
    }
  }

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-slate-900 text-white">

      {/* LEFT PANEL */}
      <div className="
        hidden lg:flex flex-col justify-center px-20 relative overflow-hidden
        bg-gradient-to-br from-purple-700 via-indigo-800 to-cyan-700
      ">
        <div className="absolute inset-0 bg-black/20" />

        <div className="relative z-10">
          <img
            src="/hsm-logo.png"
            alt="HSM Guard"
            className="w-24 mb-8"
          />

          <h1 className="text-5xl font-bold leading-tight">
            Secure Access<br />to HSM Guard
          </h1>

          <p className="mt-6 text-lg text-slate-200 max-w-md">
            Real-time hardware tamper detection, cryptographic lockdown,
            and compliance-grade monitoring — all in one control plane.
          </p>

          <p className="mt-12 text-sm text-slate-300">
            Hardware Security Module • Cyber Security Track
          </p>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex items-center justify-center px-6">
        <div className="
          w-full max-w-md
          bg-slate-800/70 backdrop-blur-xl
          border border-slate-700
          rounded-2xl p-8
          shadow-xl
          transition
          hover:shadow-[0_0_30px_rgba(99,102,241,0.15)]
        ">
          <h2 className="text-2xl font-bold mb-1">
            {isRegistering ? "Create Account" : "Welcome Back"}
          </h2>

          <p className="text-slate-400 mb-6 text-sm">
            {isRegistering ? "Register as new operator" : "Authorized operators only"}
          </p>

          {/* Email */}
          <input
            type="email"
            className="
              w-full mb-4 px-4 py-2 rounded-lg
              bg-slate-900 border border-slate-700
              focus:outline-none focus:border-purple-500
              focus:shadow-[0_0_10px_rgba(168,85,247,0.4)]
              transition
            "
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={handleKeyDown}
          />

          {/* Password */}
          <input
            type="password"
            className="
              w-full mb-4 px-4 py-2 rounded-lg
              bg-slate-900 border border-slate-700
              focus:outline-none focus:border-purple-500
              focus:shadow-[0_0_10px_rgba(168,85,247,0.4)]
              transition
            "
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
          />

          {error && (
            <p className="text-red-400 text-sm mb-4">
              {error}
            </p>
          )}

          {/* Login/Register Button */}
          <button
            onClick={handleAuth}
            disabled={loading}
            className="
              w-full py-2 rounded-lg font-semibold
              bg-gradient-to-r from-purple-600 to-cyan-500
              hover:shadow-[0_0_20px_rgba(34,211,238,0.6)]
              hover:scale-[1.02]
              transition
              disabled:opacity-50
            "
          >
            {loading ? "Processing..." : (isRegistering ? "Register →" : "Secure Login →")}
          </button>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsRegistering(!isRegistering);
                setError("");
              }}
              className="text-xs text-slate-400 hover:text-white underline underline-offset-4"
            >
              {isRegistering ? "Already have an account? Login" : "Need an account? Register"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
