import { useState, useEffect } from "react"
import { Key, ShieldAlert, ShieldCheck, Database } from "lucide-react"

export default function KeyVault({ systemStatus }) {
    const [masterKey, setMasterKey] = useState("XXXX XXXX XXXX XXXX")

    useEffect(() => {
        if (systemStatus === "LOCKED") {
            setMasterKey("0000 0000 0000 0000") // Zeroized
        } else {
            setMasterKey("XXXX XXXX XXXX XXXX")
        }
    }, [systemStatus])

    return (
        <div className={`rounded-2xl p-6 border transition-all duration-500 relative overflow-hidden group ${systemStatus === "LOCKED"
            ? "bg-gradient-to-br from-red-900/40 to-black border-red-500/30"
            : "bg-gradient-to-br from-indigo-900/40 to-black border-indigo-500/30"
            }`}>
            {/* Background Circuit Pattern */}
            <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/20 to-transparent" />

            <div className="flex items-center justify-between mb-6 relative z-10">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${systemStatus === "LOCKED" ? "bg-red-500/20 text-red-400" : "bg-indigo-500/20 text-indigo-400"}`}>
                        <Database className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white">Secure Key Vault</h3>
                        <p className="text-[10px] text-slate-400 uppercase tracking-widest">AES-256 ENCRYPTED</p>
                    </div>
                </div>

                <span className={`text-xs px-2.5 py-1 rounded-full font-bold tracking-wide border ${systemStatus === "LOCKED"
                    ? "bg-red-500/10 text-red-400 border-red-500/20"
                    : "bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
                    }`}>
                    {systemStatus === "LOCKED" ? "DESTROYED" : "ENCRYPTED"}
                </span>
            </div>

            <div className="bg-black/60 rounded-xl p-4 font-mono text-center border border-white/5 relative group-hover:border-white/10 transition-colors">
                <p className="text-[10px] text-slate-500 mb-2 uppercase tracking-widest flex items-center justify-center gap-2">
                    <Key className="w-3 h-3" /> Master Encryption Key (AES-256)
                </p>
                <p className={`text-lg md:text-xl tracking-widest transition-all duration-300 font-bold ${systemStatus === "LOCKED" ? "text-red-500 blur-[1px] animate-pulse" : "text-cyan-400"}`}>
                    {masterKey}
                </p>
            </div>

            {systemStatus === "LOCKED" && (
                <div className="mt-4 p-3 flex items-start gap-3 text-xs text-red-300 bg-red-500/10 rounded-lg border border-red-500/20 animate-pulse">
                    <ShieldAlert className="w-5 h-5 shrink-0" />
                    <div>
                        <span className="font-bold block mb-1">ERASE SEQUENCE COMPLETE</span>
                        <span className="opacity-75">Keys purged from volatile memory. Manual restoration from Cold Storage required.</span>
                    </div>
                </div>
            )}

            {systemStatus !== "LOCKED" && (
                <div className="mt-4 flex items-center gap-2 text-xs text-indigo-300/60 justify-center">
                    <ShieldCheck className="w-3 h-3" /> Integrity Verified
                </div>
            )}
        </div>
    )
}
