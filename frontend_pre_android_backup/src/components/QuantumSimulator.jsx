import { useState, useEffect } from "react"
import { apiPost } from "../api"
import { Cpu, Zap, AlertOctagon, ShieldAlert } from "lucide-react"

export default function QuantumSimulator({ onAttackStart }) {
    const [isAttacking, setIsAttacking] = useState(false)
    const [entropy, setEntropy] = useState(100)
    const [attempts, setAttempts] = useState(0)

    useEffect(() => {
        let interval
        if (isAttacking) {
            interval = setInterval(() => {
                setAttempts(prev => prev + Math.floor(Math.random() * 1500000))
                setEntropy(prev => Math.max(0, prev - 2))

                if (entropy < 10) {
                    triggerQuantumLockdown();
                }
            }, 100)
        }
        return () => clearInterval(interval)
    }, [isAttacking, entropy])

    const startAttack = () => {
        if (confirm("⚠️ WARNING: SIMULATING QUANTUM BRUTE-FORCE ATTACK\n\nThis will trigger system defensive measures. Proceed?")) {
            setIsAttacking(true)
            if (onAttackStart) onAttackStart();
        }
    }

    const triggerQuantumLockdown = async () => {
        setIsAttacking(false);
        await apiPost("/log", { event: "QUANTUM_DECRYPTION_ATTEMPT", status: "LOCKED" });
        alert("🛡️ QUANTUM THREAT DETECTED\n\nSystem initiated emergency ZEROIZATION protocol.");
        window.location.reload();
    }

    return (
        <div className={`rounded-2xl p-6 border transition-all duration-300 relative overflow-hidden group ${isAttacking
                ? "bg-gradient-to-br from-purple-900/60 to-black border-purple-500/50 shadow-[0_0_30px_rgba(168,85,247,0.2)]"
                : "bg-gradient-to-br from-slate-900/60 to-black border-white/10"
            }`}>
            {/* Animated Matrix Background when attacking */}
            {isAttacking && (
                <div className="absolute inset-0 z-0 opacity-10 bg-[url('https://media.giphy.com/media/dummy/giphy.gif')] bg-cover">
                    {/* Placeholder for noise/glitch effect */}
                </div>
            )}

            <div className="flex items-center justify-between mb-6 relative z-10">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${isAttacking ? "bg-purple-500/20 text-purple-400" : "bg-slate-700/50 text-slate-400"}`}>
                        <Cpu className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white">Quantum Sim</h3>
                        <p className="text-[10px] text-slate-400 uppercase tracking-widest">Shor's Algorithm Test</p>
                    </div>
                </div>
                {isAttacking && (
                    <span className="animate-ping h-2.5 w-2.5 rounded-full bg-purple-500 shadow-[0_0_10px_#a855f7]"></span>
                )}
            </div>

            {!isAttacking ? (
                <button
                    onClick={startAttack}
                    className="w-full py-4 rounded-xl font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 transition shadow-lg shadow-purple-900/20 border border-white/10 flex items-center justify-center gap-2 group/btn"
                >
                    <Zap className="w-4 h-4 group-hover/btn:text-yellow-300 transition-colors" />
                    LAUNCH ATTACK SIMULATION
                </button>
            ) : (
                <div className="space-y-5 relative z-10">
                    {/* Decryption Speed */}
                    <div>
                        <div className="flex justify-between text-xs font-medium text-purple-300 mb-2">
                            <span>Decryption Rate</span>
                            <span className="font-mono text-purple-200">{(attempts / 1000000).toFixed(1)}M ops/s</span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden border border-white/5">
                            <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full animate-pulse shadow-[0_0_10px_#a855f7]" style={{ width: '100%' }}></div>
                        </div>
                    </div>

                    {/* Entropy */}
                    <div>
                        <div className="flex justify-between text-xs font-medium text-slate-300 mb-2">
                            <span>Key Entropy</span>
                            <span className={`font-mono ${entropy < 30 ? "text-red-400" : "text-emerald-400"}`}>{entropy}%</span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden border border-white/5">
                            <div
                                className={`h-full rounded-full transition-all duration-100 ${entropy < 30 ? "bg-red-500 shadow-[0_0_10px_#ef4444]" : "bg-emerald-500"}`}
                                style={{ width: `${entropy}%` }}
                            ></div>
                        </div>
                    </div>

                    <div className="flex items-center justify-center gap-2 text-xs text-red-400 font-mono animate-pulse bg-red-500/10 p-2 rounded border border-red-500/20">
                        <AlertOctagon className="w-3 h-3" />
                        CRACKING RSA-2048 KEY PAIR...
                    </div>
                </div>
            )}
        </div>
    )
}
