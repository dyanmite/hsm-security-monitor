import { useState, useEffect } from "react"

export default function KeyVault({ systemStatus }) {
    const [masterKey, setMasterKey] = useState("XXXX XXXX XXXX XXXX")

    useEffect(() => {
        if (systemStatus === "LOCKED") {
            setMasterKey("0000 0000 0000 0000") // Zeroized
        } else {
            // Simulate "Restoring from Secure Backup" when system is Safe
            setMasterKey("XXXX XXXX XXXX XXXX")
        }
    }, [systemStatus])

    return (
        <div className="card p-6 border border-slate-700/50 relative overflow-hidden group">
            {/* Background Circuit Pattern (Subtle) */}
            <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/circuit-board.png')]"></div>

            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <span>🔑</span> Secure Key Vault
                </h3>
                <span className={`text-xs px-2 py-1 rounded font-mono ${systemStatus === "LOCKED" ? "bg-red-500/20 text-red-400" : "bg-emerald-500/20 text-emerald-400"}`}>
                    {systemStatus === "LOCKED" ? "DESTROYED" : "ENCRYPTED"}
                </span>
            </div>

            <div className="bg-black/40 rounded-lg p-4 font-mono text-center border border-slate-700/50">
                <p className="text-xs text-slate-500 mb-1 uppercase tracking-widest">Master Encryption Key (AES-256)</p>
                <p className={`text-xl tracking-wider transition-all duration-300 ${systemStatus === "LOCKED" ? "text-red-500 blur-[1px]" : "text-cyan-400"}`}>
                    {masterKey}
                </p>
            </div>

            {systemStatus === "LOCKED" && (
                <div className="mt-4 p-2 text-xs text-center text-red-400 bg-red-900/10 rounded border border-red-500/20 animate-pulse">
                    ⚠️ ERASE SEQUENCE COMPLETE <br />
                    <span className="opacity-75">Keys must be manually re-loaded from Cold Storage card after unlock.</span>
                </div>
            )}
        </div>
    )
}
