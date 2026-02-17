import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Server, Database, Shield, Radio, Lock, Globe, Cpu, Zap, Eye, AlertTriangle, FileKey } from "lucide-react";

export default function ArchitectureOverlay({ isOpen, onClose }) {
    if (!isOpen) return null;

    const nodes = [
        { id: "sensor", icon: <Radio className="w-6 h-6" />, label: "IoT Sensors", x: 10, y: 50, color: "text-blue-400" },
        { id: "hsm", icon: <Cpu className="w-8 h-8" />, label: "HSM Core", x: 30, y: 50, color: "text-purple-400" },
        { id: "cloud", icon: <Globe className="w-8 h-8" />, label: "Secure Cloud", x: 60, y: 20, color: "text-cyan-400" },
        { id: "db", icon: <Database className="w-6 h-6" />, label: "Immutable Ledger", x: 60, y: 80, color: "text-emerald-400" },
        { id: "admin", icon: <Shield className="w-8 h-8" />, label: "Admin Dashboard", x: 85, y: 50, color: "text-indigo-400" },
    ];

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    // Mobile: Fullscreen (h-screen, w-screen), No rounding. Desktop: Standard Modal.
                    className="relative w-full h-[100dvh] md:w-full md:max-w-6xl md:h-auto md:aspect-video bg-zinc-900 border-none md:border md:border-white/10 rounded-none md:rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-none md:max-h-none"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex-none p-6 flex justify-between items-center z-20 border-b border-white/5 bg-black/20 backdrop-blur-sm">
                        <div>
                            <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-3">
                                <Zap className="w-6 h-6 text-yellow-400" /> System Architecture
                            </h2>
                            <p className="text-xs md:text-sm text-slate-400">Real-time Data Flow & Trust Verification</p>
                        </div>
                        <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 transition">
                            <X className="w-6 h-6 text-white" />
                        </button>
                    </div>

                    {/* Flowchart Canvas Wrapper - Auto Scroll on Mobile */}
                    <div className="flex-1 overflow-auto bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-black to-black">
                        {/* Inner Container: Fill Height, Min width for scroll */}
                        <div className="relative min-w-[800px] h-full p-10">

                            {/* Animated Grid */}
                            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />

                            {/* Connection Lines (SVG) */}
                            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                                <defs>
                                    <linearGradient id="gradientLine" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
                                        <stop offset="50%" stopColor="#a855f7" stopOpacity="0.8" />
                                        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.2" />
                                    </linearGradient>
                                </defs>
                                {/* Sensor -> HSM */}
                                <motion.path
                                    d="M 15% 50% L 30% 50%"
                                    stroke="url(#gradientLine)"
                                    strokeWidth="2"
                                    fill="none"
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    transition={{ duration: 1, repeat: Infinity }}
                                />
                                {/* HSM -> Cloud */}
                                <motion.path
                                    d="M 30% 50% C 45% 50%, 45% 20%, 60% 20%"
                                    stroke="url(#gradientLine)"
                                    strokeWidth="2"
                                    fill="none"
                                />
                                {/* HSM -> DB */}
                                <motion.path
                                    d="M 30% 50% C 45% 50%, 45% 80%, 60% 80%"
                                    stroke="url(#gradientLine)"
                                    strokeWidth="2"
                                    fill="none"
                                />
                                {/* Cloud -> Admin */}
                                <motion.path
                                    d="M 60% 20% C 75% 20%, 75% 50%, 85% 50%"
                                    stroke="url(#gradientLine)"
                                    strokeWidth="2"
                                    fill="none"
                                />
                                {/* DB -> Admin */}
                                <motion.path
                                    d="M 60% 80% C 75% 80%, 75% 50%, 85% 50%"
                                    stroke="url(#gradientLine)"
                                    strokeWidth="2"
                                    fill="none"
                                />
                            </svg>

                            {/* Nodes */}

                            {/* 1. SENSORS */}
                            <div className="absolute top-1/2 left-[15%] transform -translate-x-1/2 -translate-y-1/2 text-center group">
                                <div className="w-16 h-16 rounded-full bg-blue-900/30 border border-blue-500/50 flex items-center justify-center mb-4 relative z-10 shadow-[0_0_30px_rgba(59,130,246,0.2)] group-hover:scale-110 transition-transform">
                                    <Radio className="w-8 h-8 text-blue-400 animate-pulse" />
                                    <div className="absolute -top-2 -right-2 bg-red-500 text-[10px] px-1.5 py-0.5 rounded text-white font-bold animate-bounce">LIVE</div>
                                </div>
                                <h4 className="font-bold text-white">Physical Sensors</h4>
                                <p className="text-xs text-slate-500">Voltage • Temp • Motion</p>
                            </div>

                            {/* 2. HSM CORE (Centerpiece) */}
                            <div className="absolute top-1/2 left-[30%] transform -translate-x-1/2 -translate-y-1/2 text-center group z-10">
                                <div className="relative w-32 h-32">
                                    <div className="absolute inset-0 bg-purple-600/20 blur-2xl rounded-full" />
                                    <div className="absolute inset-0 border-2 border-purple-500/30 rounded-full border-dashed animate-spin-slow" />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-20 h-20 bg-zinc-900 rounded-xl border border-white/20 flex items-center justify-center shadow-2xl relative z-10 group-hover:scale-105 transition-all">
                                            <Cpu className="w-10 h-10 text-purple-400" />
                                        </div>
                                    </div>
                                </div>
                                <h4 className="font-bold text-white mt-2">HSM Core</h4>
                                <p className="text-xs text-purple-400 font-mono">FIPS 140-2 L3</p>
                            </div>

                            {/* 3. CLOUD */}
                            <div className="absolute top-[20%] left-[60%] transform -translate-x-1/2 -translate-y-1/2 text-center group">
                                <div className="w-20 h-20 rounded-2xl bg-cyan-900/30 border border-cyan-500/50 flex items-center justify-center mb-2 shadow-[0_0_30px_rgba(34,211,238,0.2)]">
                                    <Globe className="w-10 h-10 text-cyan-400" />
                                </div>
                                <h4 className="font-bold text-white">Secure Cloud</h4>
                                <p className="text-xs text-slate-500">AES-256 Transport</p>
                            </div>

                            {/* 4. DATABASE */}
                            <div className="absolute top-[80%] left-[60%] transform -translate-x-1/2 -translate-y-1/2 text-center group">
                                <div className="w-20 h-20 rounded-2xl bg-emerald-900/30 border border-emerald-500/50 flex items-center justify-center mb-2 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                                    <Database className="w-10 h-10 text-emerald-400" />
                                </div>
                                <h4 className="font-bold text-white">Tamper Log</h4>
                                <p className="text-xs text-slate-500">Immutable Blockchain</p>
                            </div>

                            {/* 5. ADMIN DASHBOARD */}
                            <div className="absolute top-1/2 left-[85%] transform -translate-x-1/2 -translate-y-1/2 text-center group">
                                <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-indigo-600 to-blue-600 flex items-center justify-center mb-4 shadow-xl border border-white/10 group-hover:scale-105 transition-transform">
                                    <Shield className="w-12 h-12 text-white" />
                                </div>
                                <h4 className="font-bold text-white text-lg">Command Center</h4>
                                <p className="text-xs text-indigo-300">Admin Control</p>
                            </div>

                            {/* Floating Info Cards */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 }}
                                className="absolute top-10 right-10 p-4 bg-black/60 backdrop-blur-md rounded-xl border border-white/10 w-64"
                            >
                                <h5 className="flex items-center gap-2 text-sm font-bold text-white mb-2">
                                    <Eye className="w-4 h-4 text-blue-400" /> Protocol Status
                                </h5>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs text-slate-400">
                                        <span>Latency</span>
                                        <span className="text-green-400">12ms</span>
                                    </div>
                                    <div className="flex justify-between text-xs text-slate-400">
                                        <span>Encryption</span>
                                        <span className="text-purple-400">Quantum-Resistant</span>
                                    </div>
                                    <div className="flex justify-between text-xs text-slate-400">
                                        <span>Integrity</span>
                                        <span className="text-emerald-400">Verified</span>
                                    </div>
                                </div>
                            </motion.div>

                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
