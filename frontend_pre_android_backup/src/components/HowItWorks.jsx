import React from "react";
import { motion } from "framer-motion";
import { Server, Settings, ShieldCheck, Box, Activity, FileText, Cpu, Lock } from "lucide-react";

const steps = [
    {
        icon: <Box className="w-6 h-6 text-white" />,
        title: "1. Install Hardware Module",
        description: (
            <span>
                Mount <img src="/hsm-logo.png" alt="HSM Guard" className="h-4 w-4 inline-block align-middle mx-1" />HSMGuard inside control cabinet or server rack. Connect sensors (reed switch, voltage monitor, motion detection).
            </span>
        ),
    },
    {
        icon: <Settings className="w-6 h-6 text-white" />,
        title: "2. Secure Key Initialization",
        description: "Generate cryptographic keys inside secure hardware environment. Bind device to authorized control system.",
    },
    {
        icon: <Activity className="w-6 h-6 text-white" />,
        title: "3. Activate Monitoring",
        description: "Real-time anomaly detection begins. On tamper: keys zeroized, forensic log recorded, alert triggered.",
    },
];

const systemModules = [
    { title: "Hardware Layer", items: ["Key Vault Engine", "Intrusion Detection Logic", "Forensic Logging", "Quantum Simulation Layer"] },
];

const HowItWorks = () => {
    return (
        <section id="how-it-works" className="py-32 bg-zinc-950 relative border-t border-white/5">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

                    {/* Left Column: Deployment Flow */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-8">
                            Deployment in <span className="text-blue-500">Critical Infrastructure</span>
                        </h2>

                        <div className="space-y-12">
                            {steps.map((step, index) => (
                                <div key={index} className="flex gap-6 relative">
                                    {/* Vertical Line */}
                                    {index !== steps.length - 1 && (
                                        <div className="absolute left-[22px] top-12 bottom-[-48px] w-0.5 bg-white/10" />
                                    )}

                                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-900/20 flex items-center justify-center border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                                        {step.icon}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-white mb-2">{step.title}</h3>
                                        <p className="text-slate-400 leading-relaxed">{step.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Right Column: System Modules */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="bg-black/40 backdrop-blur-sm rounded-2xl p-8 border border-white/10"
                    >
                        <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                            <Cpu className="w-6 h-6 text-purple-500" /> System Modules
                        </h3>

                        <div className="grid grid-cols-1 gap-4">
                            {["Key Vault Engine", "Intrusion Detection Logic", "Forensic Logging", "Quantum Simulation Layer"].map((item, i) => (
                                <div key={i} className="flex items-center gap-3 p-4 rounded-lg bg-white/5 border border-white/5 hover:border-purple-500/30 transition-colors">
                                    <div className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.6)]" />
                                    <span className="text-slate-300 font-mono text-sm">{item}</span>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 pt-8 border-t border-white/10">
                            <div className="flex items-center justify-between text-sm text-slate-500 font-mono">
                                <span>STATUS: ACTIVE</span>
                                <span className="text-green-500 flex items-center gap-1">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                    </span>
                                    MONITORING
                                </span>
                            </div>
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
