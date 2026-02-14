import React from "react";
import { motion } from "framer-motion";
import { ShieldAlert, Zap, Lock, Database, FileSearch, Power } from "lucide-react";

const features = [
    {
        icon: <ShieldAlert className="w-8 h-8 text-blue-500" />,
        title: "Physical Tamper Detection",
        description: "Monitors enclosure breach, motion anomalies, and voltage manipulation in real-time.",
    },
    {
        icon: <Lock className="w-8 h-8 text-purple-500" />,
        title: "Fail-Secure Key Zeroization",
        description: "Immediately destroys cryptographic keys upon confirmed tamper event.",
    },
    {
        icon: <FileSearch className="w-8 h-8 text-blue-400" />,
        title: "Immutable Forensic Logging",
        description: "Tamper events are hashed and logged with timestamps for post-incident investigation.",
    },
    {
        icon: <Zap className="w-8 h-8 text-yellow-500" />,
        title: "Power & Voltage Anomaly",
        description: "Detects voltage drops and frequency instability indicating fault injection attempts.",
    },
    {
        icon: <Database className="w-8 h-8 text-green-500" />,
        title: "Edge Deployment Ready",
        description: "Designed for substations, PLC cabinets, IoT gateways, and remote industrial environments.",
    },
    {
        icon: <Power className="w-8 h-8 text-red-500" />,
        title: "Controlled Reactivation",
        description: "System requires authenticated reset after lockdown—prevents silent recovery.",
    },
];

const Features = () => {
    return (
        <section id="features" className="py-32 bg-black relative">
            <div className="max-w-7xl mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-20"
                >
                    <div className="inline-block px-3 py-1 rounded-full bg-blue-900/20 border border-blue-500/20 text-blue-400 text-sm font-medium mb-4">
                        Security Features
                    </div>
                    <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-6">
                        Hardware-Grade <span className="text-blue-500">Defense</span>
                    </h2>
                    <p className="text-slate-400 max-w-2xl mx-auto text-lg">
                        Built to withstand sophisticated physical and logical attacks in critical environments.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="group p-8 rounded-2xl bg-zinc-900/50 border border-white/5 hover:border-blue-500/30 hover:bg-zinc-900/80 transition-all duration-500"
                        >
                            <div className="mb-6 p-4 rounded-xl bg-black border border-white/5 w-fit group-hover:scale-110 group-hover:border-blue-500/30 transition-transform duration-500">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
                                {feature.title}
                            </h3>
                            <p className="text-slate-400 leading-relaxed">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;
