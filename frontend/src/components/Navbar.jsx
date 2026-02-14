import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Shield, Lock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { name: "Features", href: "#features" },
        { name: "Use Cases", href: "#use-cases" },
        { name: "How it Works", href: "#how-it-works" },
    ];

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                ? "bg-cyber-dark/80 backdrop-blur-lg border-b border-white/10"
                : "bg-transparent"
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 group">
                    <img src="/hsm-logo.png" alt="HSM Guard" className="w-10 h-10 object-contain drop-shadow-lg" />
                    <span className="text-2xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-cyber-glow">
                        HSM<span className="font-sans font-light text-cyber-glow">Guard</span>
                    </span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            className="text-sm font-medium text-slate-300 hover:text-white transition-colors relative group"
                        >
                            {link.name}
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyber-primary transition-all group-hover:w-full" />
                        </a>
                    ))}
                </div>

                {/* Desktop OTA */}
                <div className="hidden md:flex items-center gap-4">
                    <Link
                        to="/login"
                        className="px-6 py-2.5 rounded-lg text-sm font-semibold text-white bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all"
                    >
                        Log In
                    </Link>
                    <Link
                        to="/login" // Assuming Get Started goes to login/register for now
                        className="px-6 py-2.5 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-cyber-primary to-cyber-accent hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] transition-all transform hover:-translate-y-0.5"
                    >
                        Get Started
                    </Link>
                </div>

                {/* Mobile Toggle */}
                <button
                    className="md:hidden text-white"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-cyber-dark/95 backdrop-blur-xl border-b border-white/10 overflow-hidden"
                    >
                        <div className="px-6 py-8 flex flex-col gap-6">
                            {navLinks.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    className="text-lg font-medium text-slate-300 hover:text-white"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {link.name}
                                </a>
                            ))}
                            <div className="h-px bg-white/10 my-2" />
                            <Link
                                to="/login"
                                className="w-full py-3 rounded-lg text-center font-semibold text-white bg-white/5 border border-white/10"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Log In
                            </Link>
                            <Link
                                to="/login"
                                className="w-full py-3 rounded-lg text-center font-semibold text-white bg-gradient-to-r from-cyber-primary to-cyber-accent"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Get Started
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
