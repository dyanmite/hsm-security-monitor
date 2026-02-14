import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Server, Database, LayoutDashboard, ArrowRight, Lock, Cpu, ShieldCheck } from "lucide-react";

const Architecture = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.3,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, type: "spring" } },
    };

    return (
        <section ref={ref} className="py-32 bg-black relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-black to-black pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-24"
                >
                    <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
                        Hybrid Physical-Digital <span className="text-blue-500">Trust Loop</span>
                    </h2>
                    <p className="text-slate-400 max-w-2xl mx-auto text-lg">
                        Unbreakable security chain from the hardware root of trust to the executive dashboard.
                    </p>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12"
                >
                    {/* Hardware Node */}
                    <motion.div variants={itemVariants} className="relative group">
                        <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="relative w-64 p-8 rounded-2xl bg-zinc-900/80 border border-white/10 backdrop-blur-xl flex flex-col items-center text-center hover:border-blue-500/50 transition-all shadow-2xl">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center mb-6 shadow-lg shadow-blue-500/20">
                                <Cpu className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Hardware</h3>
                            <p className="text-sm text-slate-400">
                                Tamper Sensors <br /> Voltage Monitor <br /> Key Vault
                            </p>
                        </div>
                        {/* Absolute positioning for connector on mobile vs desktop */}
                    </motion.div>

                    {/* Connection 1 */}
                    <motion.div variants={itemVariants} className="hidden md:flex flex-col items-center">
                        <div className="w-full h-0.5 bg-gradient-to-r from-blue-500/50 to-purple-500/50 w-24 relative overflow-hidden">
                            <div className="absolute top-0 left-0 h-full w-1/2 bg-white blur-[2px] animate-shimmer" />
                        </div>
                        <div className="p-2 rounded-full bg-zinc-800 border border-white/10 mt-[-14px] z-10">
                            <ShieldCheck className="w-4 h-4 text-green-400" />
                        </div>
                    </motion.div>

                    {/* Backend Node */}
                    <motion.div variants={itemVariants} className="relative group">
                        <div className="absolute inset-0 bg-purple-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="relative w-64 p-8 rounded-2xl bg-zinc-900/80 border border-white/10 backdrop-blur-xl flex flex-col items-center text-center hover:border-purple-500/50 transition-all shadow-2xl">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-fuchsia-700 flex items-center justify-center mb-6 shadow-lg shadow-purple-500/20">
                                <Server className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Backend Logic</h3>
                            <p className="text-sm text-slate-400">
                                Threat Analysis <br /> Zeroization Protocol <br /> Event Logging
                            </p>
                        </div>
                    </motion.div>

                    {/* Connection 2 */}
                    <motion.div variants={itemVariants} className="hidden md:flex flex-col items-center">
                        <div className="w-full h-0.5 bg-gradient-to-r from-purple-500/50 to-blue-500/50 w-24 relative overflow-hidden">
                            <div className="absolute top-0 left-0 h-full w-1/2 bg-white blur-[2px] animate-shimmer delay-75" />
                        </div>
                        <div className="p-2 rounded-full bg-zinc-800 border border-white/10 mt-[-14px] z-10">
                            <Lock className="w-4 h-4 text-blue-400" />
                        </div>
                    </motion.div>

                    {/* Dashboard Node */}
                    <motion.div variants={itemVariants} className="relative group">
                        <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="relative w-64 p-8 rounded-2xl bg-zinc-900/80 border border-white/10 backdrop-blur-xl flex flex-col items-center text-center hover:border-blue-500/50 transition-all shadow-2xl">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-6 shadow-lg shadow-blue-500/20">
                                <LayoutDashboard className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Dashboard</h3>
                            <p className="text-sm text-slate-400">
                                Real-time Alerts <br /> Forensic Logs <br /> Device Status
                            </p>
                        </div>
                    </motion.div>

                </motion.div>
            </div>

            <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite linear;
        }
      `}</style>
        </section>
    );
};

export default Architecture;
