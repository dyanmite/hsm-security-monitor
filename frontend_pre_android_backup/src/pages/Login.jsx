import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { apiPost } from "../api";
import { Lock, Mail, ArrowRight, Shield, Server, Activity } from "lucide-react";

export default function Login() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

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
        setError("Registration disabled in Prototype. Use admin/admin.");
        setLoading(false);
        return;
      }

      const res = await apiPost("/auth/login", { email, password });

      if (res.error) {
        throw new Error(res.error);
      }

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

  return (
    <div className="min-h-screen flex bg-black text-white font-sans selection:bg-blue-500/30">

      {/* LEFT PANEL - VISUAL (Restored Split Layout) */}
      <div className="hidden lg:flex w-1/2 relative items-center justify-center overflow-hidden bg-slate-900">
        {/* Background Gradients */}
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-purple-900/20 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-blue-900/20 blur-[100px] rounded-full pointer-events-none" />

        {/* Animated Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

        <div className="relative z-10 text-center px-10">
          <div className="mb-8 relative inline-block">
            <div className="absolute inset-0 bg-blue-500 blur-2xl opacity-20 animate-pulse" />
            <img src="/hsm-logo.png" alt="HSM Guard" className="w-24 h-24 relative z-10 drop-shadow-2xl" />
          </div>
          <h1 className="text-5xl font-display font-bold mb-4 tracking-tight">
            HSM<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Guard</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-md mx-auto leading-relaxed">
            Next-Generation Physical-Digital Integrity Monitoring System
          </p>

          <div className="mt-12 grid grid-cols-2 gap-4 text-left max-w-md mx-auto">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <Server className="w-6 h-6 text-blue-400 mb-2" />
              <div className="font-bold text-white">System Active</div>
              <div className="text-xs text-slate-500">Monitoring Enabled</div>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <Activity className="w-6 h-6 text-purple-400 mb-2" />
              <div className="font-bold text-white">Real-time</div>
              <div className="text-xs text-slate-500">Tamper Analytics</div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL - FORM */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-900/10 via-transparent to-transparent lg:hidden" />

        <div className="w-full max-w-md relative z-10">
          <div className="lg:hidden mb-8 text-center">
            <img src="/hsm-logo.png" alt="HSM Guard" className="w-16 h-16 mx-auto mb-4 drop-shadow-lg" />
            <h2 className="text-2xl font-bold">HSMGuard</h2>
          </div>

          <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
            <h2 className="text-2xl font-bold mb-2 text-white">
              {isRegistering ? "Register Device" : "Welcome Back"}
            </h2>
            <p className="text-slate-400 mb-8 text-sm">
              {isRegistering ? "Initialize new hardware operator identity" : "Authenticate to access the security dashboard"}
            </p>

            {/* Email */}
            <div className="mb-4 space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Operator ID</label>
              <div className="relative group/input">
                <div className="absolute left-4 top-3.5 text-slate-500 group-focus-within/input:text-blue-400 transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-12 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                  placeholder="admin@hsm.sec"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAuth()}
                />
              </div>
            </div>

            {/* Password */}
            <div className="mb-8 space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Secure Token</label>
              <div className="relative group/input">
                <div className="absolute left-4 top-3.5 text-slate-500 group-focus-within/input:text-purple-400 transition-colors">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type="password"
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-12 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAuth()}
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-400 text-sm mb-6 bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                {error}
              </div>
            )}

            <button
              onClick={handleAuth}
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 active:scale-[0.98] transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? "Authenticating..." : (isRegistering ? "Initialize ID" : "Secure Login")}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>

            <div className="mt-6 text-center">
              <button
                onClick={() => {
                  setIsRegistering(!isRegistering);
                  setError("");
                }}
                className="text-xs text-slate-500 hover:text-white transition-colors"
              >
                {isRegistering ? "Already initialized? Sign In" : "New Hardware Setup? Register"}
              </button>
            </div>
          </div>

          <div className="mt-8 text-center text-slate-600 text-[10px] font-mono uppercase tracking-widest">
            Protected by Quantum-Resistant Encryption
          </div>
        </div>
      </div>
    </div>
  )
}
