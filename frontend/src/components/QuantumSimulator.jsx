import { useState, useEffect } from "react"
import { apiPost } from "../api"

export default function QuantumSimulator({ onAttackStart }) {
    const [isAttacking, setIsAttacking] = useState(false)
    const [entropy, setEntropy] = useState(100)
    const [attempts, setAttempts] = useState(0)

    // Simulation Logic
    useEffect(() => {
        let interval
        if (isAttacking) {
            interval = setInterval(() => {
                setAttempts(prev => prev + Math.floor(Math.random() * 1500000)) // +1.5M attempts per tick
                setEntropy(prev => Math.max(0, prev - 2))

                // Trigger Defense if Entropy is Critical
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
        <div className="card p-6 border border-purple-500/30 bg-gradient-to-br from-slate-900 to-purple-900/10">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <span className="text-2xl">⚛️</span> Quantum Threat Sim
                </h3>
                {isAttacking && (
                    <span className="animate-ping h-3 w-3 rounded-full bg-red-500"></span>
                )}
            </div>

            {!isAttacking ? (
                <button
                    onClick={startAttack}
                    className="w-full py-3 rounded-lg font-bold text-white bg-purple-600 hover:bg-purple-500 transition shadow-[0_0_15px_rgba(168,85,247,0.4)]"
                >
                    LAUNCH GROVER'S ALGORITHM
                </button>
            ) : (
                <div className="space-y-4">
                    {/* Decryption Speed */}
                    <div>
                        <div className="flex justify-between text-xs text-purple-300 mb-1">
                            <span>Decryption Speed</span>
                            <span className="font-mono text-red-400">{(attempts / 1000000).toFixed(1)}M/s</span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-2">
                            <div className="bg-red-500 h-2 rounded-full animate-pulse" style={{ width: '100%' }}></div>
                        </div>
                    </div>

                    {/* Entropy */}
                    <div>
                        <div className="flex justify-between text-xs text-purple-300 mb-1">
                            <span>System Entropy (Randomness)</span>
                            <span className="font-mono text-yellow-400">{entropy}%</span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-2">
                            <div
                                className="bg-green-500 h-2 rounded-full transition-all duration-100"
                                style={{ width: `${entropy}%`, backgroundColor: entropy < 30 ? '#ef4444' : '#10b981' }}
                            ></div>
                        </div>
                    </div>

                    <div className="text-center text-xs text-red-500 font-mono animate-pulse mt-2">
                        CRACKING RSA-2048 KEY...
                    </div>
                </div>
            )}
        </div>
    )
}
