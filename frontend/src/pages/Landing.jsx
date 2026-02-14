import React from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Architecture from "../components/Architecture";
import Features from "../components/Features";
import UseCases from "../components/UseCases";
import HowItWorks from "../components/HowItWorks";
import Footer from "../components/Footer";

const Landing = () => {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-blue-500/30 font-sans">
            <Navbar />
            <Hero />
            <Architecture />
            <Features />
            <UseCases />
            <HowItWorks />
            <Footer />
        </div>
    );
};

export default Landing;
