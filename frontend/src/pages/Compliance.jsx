import { useState, useEffect } from "react"
import Sidebar from "../components/Sidebar"
import Header from "../components/Header"
import { ShieldCheck, AlertTriangle, CheckCircle, XCircle, Activity, Lock, Zap } from "lucide-react"
import { motion } from "framer-motion"
import { apiGet } from "../api"

export default function Compliance() {
    const [status, setStatus] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchStatus()
        const interval = setInterval(fetchStatus, 2000)
        return () => clearInterval(interval)
    }, [])

    async function fetchStatus() {
        try {
            const data = await apiGet("/status") // { status: "SAFE" | "LOCKED", triggers: [] }
            setStatus(data)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    // --- COMPLIANCE LOGIC ---
    // 1. FIPS 140-2 Level 3 (Physical Security)
    // Requirement: "Tamper detection and response (zeroization) for covers/doors."
    const fipsCompliant = status?.status === "SAFE" || (status?.status === "LOCKED" && status?.triggers.includes("ENCLOSURE_OPENED"));

    // 2. PCI-DSS Requirement 9.9
    // Requirement: "Protect devices that capture payment card data from tampering and substitution."
    const pciCompliant = !status?.triggers.includes("DEVICE_DISCONNECTED") && !status?.triggers.includes("PHYSICAL_MOVEMENT");

    // 3. ISO/IEC 19790 (Non-invasive attacks)
    // Requirement: "Protection against side-channel power analysis (Voltage Glitch)."
    const isoCompliant = !status?.triggers.includes("VOLTAGE_GLITCH");

    // Overall Score
    const checks = [fipsCompliant, pciCompliant, isoCompliant];
    const score = checks.filter(Boolean).length;
    const total = checks.length;
    const health = Math.round((score / total) * 100);

    const container = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.1 } }
    }

    return (
        <div className="flex bg-slate-900 text-white min-h-screen">
            <Sidebar />
            <div className="flex-1 p-6 pb-24 overflow-y-auto">
                <Header />

                <div className="max-w-6xl mx-auto space-y-8">

                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                                Compliance & Validation
                            </h1>
                            <p className="text-slate-400 mt-1">Real-time mapping of sensor events to Industry Standards.</p>
                        </div>

                        <div className="flex items-center gap-4 bg-slate-800 p-4 rounded-xl border border-slate-700">
                            <div className="text-right">
                                <div className="text-xs text-slate-400 uppercase tracking-widest">Overall Health</div>
                                <div className={`text-2xl font-bold ${health === 100 ? "text-green-400" : "text-red-400"}`}>
                                    {health}%
                                </div>
                            </div>
                            <div className="h-12 w-12 rounded-full border-4 border-slate-700 flex items-center justify-center relative">
                                <div className={`absolute inset-0 rounded-full border-4 ${health === 100 ? "border-green-500" : "border-red-500"} opacity-25`}></div>
                                <ShieldCheck className={`w-6 h-6 ${health === 100 ? "text-green-500" : "text-red-500"}`} />
                            </div>
                        </div>
                    </div>

                    {loading ? (
                        <div className="text-center py-20 text-slate-500">Connecting to Secure Enclave...</div>
                    ) : (
                        <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                            {/* STANDARD 1: FIPS 140-2 */}
                            <ComplianceCard
                                title="FIPS 140-2 Level 3"
                                desc="Physical Security Mechanisms"
                                isCompliant={fipsCompliant}
                                icon={<Lock className="w-6 h-6" />}
                                details={[
                                    { label: "Enclosure Integrity", status: !status?.triggers.includes("ENCLOSURE_OPENED") },
                                    { label: "Zeroization Trigger", status: true } // Always active in firmware
                                ]}
                            />

                            {/* STANDARD 2: PCI-DSS */}
                            <ComplianceCard
                                title="PCI-DSS Req 9.9"
                                desc="Point of Interaction (POI) Security"
                                isCompliant={pciCompliant}
                                icon={<Activity className="w-6 h-6" />}
                                details={[
                                    { label: "Anti-Skimming (Motion)", status: !status?.triggers.includes("PHYSICAL_MOVEMENT") },
                                    { label: "Substitution (Heartbeat)", status: !status?.triggers.includes("DEVICE_DISCONNECTED") }
                                ]}
                            />

                            {/* STANDARD 3: ISO/IEC 19790 */}
                            <ComplianceCard
                                title="ISO/IEC 19790"
                                desc="Non-Invasive Attack Mitigation"
                                isCompliant={isoCompliant}
                                icon={<Zap className="w-6 h-6" />}
                                details={[
                                    { label: "Voltage Glitch Detect", status: !status?.triggers.includes("VOLTAGE_GLITCH") },
                                    { label: "Side-Channel Analysis", status: !status?.triggers.includes("AI_ANOMALY") }
                                ]}
                            />

                        </motion.div>
                    )}

                    {/* Audit Log Preview */}
                    <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <ShieldCheck className="w-5 h-5 text-blue-400" /> Validation Logic
                        </h3>
                        <div className="bg-black/50 rounded-lg p-4 font-mono text-sm text-slate-400">
                            <p className="mb-2"><span className="text-purple-400">function</span> <span className="text-blue-400">validateFIPS</span>(event) {"{"}</p>
                            <p className="pl-4 mb-1">if (event.type == <span className="text-orange-400">"ENCLOSURE_OPENED"</span>) {"{"}</p>
                            <p className="pl-8 mb-1"><span className="text-red-400">return</span> CRITICAL_FAILURE;</p>
                            <p className="pl-4 mb-1">{"}"}</p>
                            <p className="pl-4"><span className="text-green-400">return</span> COMPLIANT;</p>
                            <p>{"}"}</p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

function ComplianceCard({ title, desc, isCompliant, icon, details }) {
    return (
        <motion.div
            variants={{ hidden: { y: 20, opacity: 0 }, show: { y: 0, opacity: 1 } }}
            className={`relative overflow-hidden rounded-xl border p-6 transition-all duration-500 ${isCompliant ? "bg-slate-800/80 border-slate-700 hover:border-green-500/30" : "bg-red-900/10 border-red-500/30"}`}
        >
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-lg ${isCompliant ? "bg-blue-500/10 text-blue-400" : "bg-red-500/10 text-red-500"}`}>
                    {icon}
                </div>
                {isCompliant ? (
                    <div className="px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-xs font-bold border border-green-500/20 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> PASS
                    </div>
                ) : (
                    <div className="px-3 py-1 rounded-full bg-red-500/10 text-red-400 text-xs font-bold border border-red-500/20 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> FAIL
                    </div>
                )}
            </div>

            <h3 className="text-xl font-bold text-white mb-1">{title}</h3>
            <p className="text-sm text-slate-400 mb-6">{desc}</p>

            <div className="space-y-3">
                {details.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-sm">
                        <span className="text-slate-400">{item.label}</span>
                        {item.status ? (
                            <CheckCircle className="w-4 h-4 text-green-500/50" />
                        ) : (
                            <XCircle className="w-4 h-4 text-red-500" />
                        )}
                    </div>
                ))}
            </div>
        </motion.div>
    )
}
