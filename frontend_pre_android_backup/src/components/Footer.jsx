import React from "react";
import { Shield, Github, Twitter, Linkedin } from "lucide-react";

const Footer = () => {
    return (
        <footer className="bg-black border-t border-white/10 pt-20 pb-10">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    <div className="col-span-1 md:col-span-1">
                        <div className="flex items-center gap-2 mb-6">
                            <img src="/hsm-logo.png" alt="HSM Guard" className="w-8 h-8 drop-shadow-lg" />
                            <span className="text-xl font-bold text-white tracking-tight">HSMGuard</span>
                        </div>
                        <p className="text-slate-500 text-sm leading-relaxed">
                            Hybrid Physical-Digital Trust Loop for Critical Infrastructure.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold mb-6">Architecture</h4>
                        <ul className="space-y-4 text-sm text-slate-500">
                            <li><a href="#" className="hover:text-blue-400 transition-colors">Hardware Architecture</a></li>
                            <li><a href="#" className="hover:text-blue-400 transition-colors">Backend Logic</a></li>
                            <li><a href="#" className="hover:text-blue-400 transition-colors">Key LifeCycle</a></li>
                            <li><a href="#" className="hover:text-blue-400 transition-colors">Threat Model</a></li>
                            <li><a href="#" className="hover:text-blue-400 transition-colors">Deployment Model</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold mb-6">Security Policies</h4>
                        <ul className="space-y-4 text-sm text-slate-500">
                            <li><a href="#" className="hover:text-blue-400 transition-colors">Zeroization Protocol</a></li>
                            <li><a href="#" className="hover:text-blue-400 transition-colors">Tamper Response Flow</a></li>
                            <li><a href="#" className="hover:text-blue-400 transition-colors">Data Retention Policy</a></li>
                            <li><a href="#" className="hover:text-blue-400 transition-colors">Compliance Alignment</a></li>
                        </ul>
                    </div>

                    {/* Empty column or Socials */}
                    <div>
                        <h4 className="text-white font-semibold mb-6">Connect</h4>
                        <div className="flex items-center gap-4">
                            <a href="#" className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all"><Github className="w-5 h-5" /></a>
                            <a href="#" className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all"><Twitter className="w-5 h-5" /></a>
                            <a href="#" className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all"><Linkedin className="w-5 h-5" /></a>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar - No Copyright as requested */}
                <div className="pt-8 border-t border-white/5 flex items-center justify-center">
                    <p className="text-slate-600 text-xs font-mono">
                        SYSTEM STATUS: OPERATIONAL
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
