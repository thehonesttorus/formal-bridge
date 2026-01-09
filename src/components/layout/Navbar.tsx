"use client";

import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import FormalBridgeLogo from "@/components/ui/DynamicLogo";

export default function Navbar() {
    const { scrollY } = useScroll();
    const [isScrolled, setIsScrolled] = useState(false);
    const [logoKey, setLogoKey] = useState(0);

    useMotionValueEvent(scrollY, "change", (latest) => {
        setIsScrolled(latest > 50);
    });

    // Replay logo animation on click
    const replayLogo = () => setLogoKey(prev => prev + 1);

    return (
        <motion.nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled
                ? "bg-midnight/80 backdrop-blur-xl border-b border-white/5 py-4"
                : "bg-transparent border-b border-transparent py-6"
                }`}
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6 }}
        >
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                {/* Logo */}
                <Link
                    href="/"
                    className="flex items-center gap-4 group cursor-pointer"
                    onClick={replayLogo}
                >
                    <FormalBridgeLogo key={logoKey} size={64} animated={true} />
                    <h1 className="text-2xl font-bold tracking-[0.15em] text-white group-hover:text-teal transition-colors">
                        FORMAL BRIDGE
                    </h1>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-10">
                    <Link
                        href="#platform"
                        className="text-sm font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-colors relative group"
                    >
                        Platform
                        <span className="absolute -bottom-2 left-0 w-full h-[2px] bg-teal scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                    </Link>
                    <Link
                        href="#expertise"
                        className="text-sm font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-colors relative group"
                    >
                        The Science
                        <span className="absolute -bottom-2 left-0 w-full h-[2px] bg-teal scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                    </Link>
                </div>

                {/* Auth CTA - Simple login/portal links */}
                <div className="hidden md:flex items-center gap-6">
                    <Link
                        href="/login"
                        className="px-6 py-3 text-slate-400 text-sm font-bold uppercase tracking-widest hover:text-white transition-colors"
                    >
                        Sign In
                    </Link>
                    <Link
                        href="/signup"
                        className="px-8 py-3 border border-teal/30 bg-teal/10 text-teal text-sm font-bold uppercase tracking-widest hover:bg-teal hover:text-midnight transition-all"
                    >
                        Get Started
                    </Link>
                </div>
            </div>
        </motion.nav>
    );
}
