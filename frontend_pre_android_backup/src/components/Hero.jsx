import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck, Lock } from "lucide-react";
import ArchitectureOverlay from "./ArchitectureOverlay";

const Hero = () => {
    const [showArchitecture, setShowArchitecture] = useState(false);

    return (
        <section
            className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black pt-20"
        >
            <ArchitectureOverlay isOpen={showArchitecture} onClose={() => setShowArchitecture(false)} />

            {/* Enhanced Bold Background Gradients (Mesh Effect) */}
            <div className="absolute top-[-10%] left-[-15%] w-[800px] h-[800px] bg-blue-600/30 blur-[180px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-15%] w-[800px] h-[800px] bg-purple-600/25 blur-[180px] rounded-full pointer-events-none" />
            <div className="absolute top-1/4 right-[5%] w-[600px] h-[600px] bg-blue-500/20 blur-[160px] rounded-full pointer-events-none" />
            <div className="absolute bottom-1/4 left-[5%] w-[600px] h-[600px] bg-indigo-600/20 blur-[160px] rounded-full pointer-events-none" />

            {/* Central Vibrant Glow */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] bg-blue-500/15 blur-[140px] rounded-full pointer-events-none z-0" />

            {/* Floating Particles */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                {[...Array(25)].map((_, i) => (
                    <motion.div
                        key={i}
                        initial={{
                            x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
                            y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
                            opacity: Math.random() * 0.5 + 0.1
                        }}
                        animate={{
                            y: [null, -100],
                            opacity: [null, 0]
                        }}
                        transition={{
                            duration: Math.random() * 10 + 10,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                        className="absolute w-1 h-1 bg-blue-500 rounded-full blur-[1px]"
                    />
                ))}
            </div>

            <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">

                {/* Text Content */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-sm"
                    >
                        <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse shadow-[0_0_10px_#a855f7]" />
                        <span className="text-xs font-mono font-medium text-purple-300 tracking-wider uppercase">
                            Prototype v1 - Research Demonstration
                        </span>
                    </motion.div>

                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold leading-tight mb-6 text-white">
                        Hybrid <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">Physical-Digital</span> <br />
                        Trust Loop
                    </h1>

                    <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                        Unifying hardware security modules with real-time tamper analytics.
                        The first defense system that bridges the gap between physical breach and digital response.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            to="/login"
                            className="group relative px-10 py-4 rounded-full bg-white text-black font-bold transition-all hover:scale-105 active:scale-95"
                        >
                            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 blur-lg opacity-40 group-hover:opacity-70 transition-opacity" />
                            <span className="relative flex items-center gap-2">
                                Initialize System <ArrowRight className="w-4 h-4" />
                            </span>
                        </Link>
                        <button
                            onClick={() => setShowArchitecture(true)}
                            className="px-10 py-4 rounded-full text-white font-medium hover:bg-white/5 transition-colors border border-transparent hover:border-white/10"
                        >
                            View Architecture
                        </button>
                    </div>

                    {/* Real-time metrics */}
                    <div className="mt-20 flex flex-wrap items-center justify-center gap-12 border-t border-white/10 pt-10">
                        <div className="text-left">
                            <div className="text-white font-bold text-2xl flex items-center gap-2">
                                <ShieldCheck className="w-6 h-6 text-green-500" /> Active
                            </div>
                            <div className="text-slate-500 text-sm mt-1">Real-time Tamper Detection</div>
                        </div>
                        <div className="text-left">
                            <div className="text-white font-bold text-2xl flex items-center gap-2">
                                <span className="text-red-500 text-xs font-mono border border-red-500/50 px-2 py-0.5 rounded bg-red-500/10">FAIL-SECURE</span>
                            </div>
                            <div className="text-slate-500 text-sm mt-1">Key Zeroization Ready</div>
                        </div>
                    </div>
                </motion.div>

            </div>

            <style>{`
         .perspective-1000 { perspective: 1000px; }
         .transform-style-3d { transform-style: preserve-3d; }
         .translate-z-20 { transform: translateZ(20px); }
         .translate-z-30 { transform: translateZ(30px); }
         .animate-spin-slow { animation: spin 8s linear infinite; }
         .animate-spin-reverse-slower { animation: spin 12s linear infinite reverse; }
         .animate-shine { animation: shine 5s infinite linear; }
         
         @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
         @keyframes shine { 
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
         }
      `}</style>
        </section>
    );
};

export default Hero;
