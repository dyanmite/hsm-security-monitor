import React from "react";
import { motion } from "framer-motion";
import { Zap, Factory, Server, Wifi, Shield } from "lucide-react";

const useCases = [
    {
        icon: <Zap className="w-6 h-6 text-yellow-400" />,
        title: "Power Substations",
        description: "Protect grid control cabinets and monitoring devices from physical tampering and voltage manipulation attacks.",
    },
    {
        icon: <Factory className="w-6 h-6 text-orange-400" />,
        title: "Industrial PLC Networks",
        description: "Monitor control hardware for intrusion attempts without disrupting real-time operations.",
    },
    {
        icon: <Server className="w-6 h-6 text-slate-400" />,
        title: "Data Centres",
        description: "Enforce hardware-level key protection for server racks and edge cryptographic devices.",
    },
    {
        icon: <Wifi className="w-6 h-6 text-blue-400" />,
        title: "Edge IoT Gateways",
        description: "Deploy fail-secure tamper detection in remote and unmanned infrastructure.",
    },
    {
        icon: <Shield className="w-6 h-6 text-emerald-400" />,
        title: "Government & Defense",
        description: "Ensure cryptographic assets are destroyed immediately if physical compromise is detected.",
    },
];

const UseCases = () => {
    return (
        <section id="use-cases" className="py-32 bg-black relative overflow-hidden">
            {/* Grid Pattern Background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-20"
                >
                    <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-6">
                        Designed for <span className="text-purple-500">Critical Infrastructure</span>
                    </h2>
                    <p className="text-slate-400 max-w-2xl mx-auto text-lg">
                        Securing the backbone of modern industry with uncompromising trust.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {useCases.map((useCase, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="p-8 rounded-2xl bg-zinc-900/40 border border-white/5 hover:bg-zinc-900/60 hover:border-purple-500/30 hover:-translate-y-1 transition-all duration-300"
                        >
                            <div className="mb-5 p-3 rounded-lg bg-black border border-white/10 w-fit">
                                {useCase.icon}
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">{useCase.title}</h3>
                            <p className="text-base text-slate-400 leading-relaxed">
                                {useCase.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default UseCases;
