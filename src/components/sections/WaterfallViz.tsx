"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Shield, Lock, FileCheck } from "lucide-react";
import Scene from "@/components/3d/Scene";
import Waterfall3D from "@/components/3d/Waterfall3D";

interface WaterfallTier {
    name: string;
    amount: number;
    regulation: string;
}

const tiers: WaterfallTier[] = [
    { name: "Fixed Charge Holders", amount: 1200000, regulation: "IA 1986 s.175" },
    { name: "Insolvency Expenses", amount: 95000, regulation: "IR 2016 r.6.42" },
    { name: "Preferential Creditors", amount: 847520, regulation: "IA 1986 s.386" },
    { name: "Prescribed Part", amount: 600000, regulation: "IA 1986 s.176A" },
    { name: "Floating Charge", amount: 400000, regulation: "IA 1986 s.175" },
    { name: "Unsecured Creditors", amount: 280000, regulation: "IA 1986 s.107" },
];

export default function WaterfallVisualization() {
    const ref = useRef<HTMLElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });
    const [activeTier, setActiveTier] = useState(-1);
    const totalAmount = tiers.reduce((sum, t) => sum + t.amount, 0);

    useEffect(() => {
        if (!isInView) return;
        let current = 0;
        const interval = setInterval(() => {
            if (current >= tiers.length) {
                clearInterval(interval);
                return;
            }
            setActiveTier(current);
            current++;
        }, 500);
        return () => clearInterval(interval);
    }, [isInView]);

    return (
        <section ref={ref} className="py-20 relative overflow-hidden">

            {/* Background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 flex justify-around opacity-20 pointer-events-none">
                    {[...Array(8)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="w-px h-full bg-gradient-to-b from-teal/0 via-teal to-teal/0"
                            initial={{ opacity: 0 }}
                            animate={{
                                opacity: [0, 0.5, 0],
                                y: ["-100%", "100%"]
                            }}
                            transition={{
                                duration: 3,
                                delay: i * 0.4,
                                repeat: Infinity,
                                ease: "linear"
                            }}
                        />
                    ))}
                </div>

                <motion.div
                    className="absolute inset-0"
                    style={{
                        maskImage: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.3) 30%, rgba(0,0,0,0.6) 100%)'
                    }}
                >
                    <Scene cameraPosition={[0, 0, 8]}>
                        <Waterfall3D />
                    </Scene>
                </motion.div>
            </div>

            <div className="max-w-6xl mx-auto px-8 relative z-10">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8 }}
                    className="max-w-2xl mb-16"
                >
                    <span className="text-teal font-medium tracking-[0.2em] uppercase text-sm block mb-4">
                        Verified Computation
                    </span>
                    <h2 className="text-4xl md:text-5xl font-light text-white leading-tight mb-6">
                        £{(totalAmount / 1000000).toFixed(1)}M computed.
                        <span className="block font-medium">Every tier verified.</span>
                    </h2>
                    <p className="text-lg text-slate-400 font-light leading-relaxed">
                        Our Lean 4 kernel validates that your distribution mathematics
                        align with statutory priority. Certificate valid only for the
                        exact inputs provided.
                    </p>
                </motion.div>

                {/* Two Column Layout */}
                <div className="grid lg:grid-cols-2 gap-16 items-start">

                    {/* Left: Waterfall Bars */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="space-y-3"
                    >
                        {tiers.map((tier, index) => {
                            const percentage = (tier.amount / totalAmount) * 100;
                            const isActive = index <= activeTier;

                            return (
                                <motion.div
                                    key={tier.name}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={isActive ? { opacity: 1, x: 0 } : { opacity: 0.3, x: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="group"
                                >
                                    <div className="flex items-center justify-between mb-1.5">
                                        <div className="flex items-center gap-3">
                                            <span className="text-slate-500 font-mono text-xs w-4">
                                                {index + 1}
                                            </span>
                                            <span className={`text-sm font-light transition-colors ${isActive ? 'text-white' : 'text-slate-600'}`}>
                                                {tier.name}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="text-slate-600 font-mono text-[10px] tracking-wider">
                                                {tier.regulation}
                                            </span>
                                            <span className={`text-sm font-medium transition-colors ${isActive ? 'text-teal' : 'text-slate-700'}`}>
                                                £{(tier.amount / 1000).toFixed(0)}k
                                            </span>
                                        </div>
                                    </div>

                                    <div className="h-2 bg-navy-800 overflow-hidden">
                                        <motion.div
                                            className="h-full"
                                            style={{
                                                background: isActive
                                                    ? 'linear-gradient(90deg, #00d4aa 0%, #00d4aa80 100%)'
                                                    : '#1e293b'
                                            }}
                                            initial={{ width: 0 }}
                                            animate={{ width: isActive ? `${percentage}%` : '0%' }}
                                            transition={{ duration: 0.8, delay: index * 0.1, ease: "easeOut" }}
                                        />
                                    </div>
                                </motion.div>
                            );
                        })}
                    </motion.div>

                    {/* Right: Certificate Card */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="bg-white/5 border border-white/10 p-8 backdrop-blur-sm"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <Shield className="w-5 h-5 text-teal" />
                            <span className="text-white font-medium">Verification Certificate</span>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <span className="text-slate-500 text-xs uppercase tracking-widest block mb-1">
                                    Total Computed
                                </span>
                                <span className="text-3xl font-light text-white">
                                    £{(totalAmount / 1000000).toFixed(2)}M
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-6 pt-6 border-t border-white/10">
                                <div>
                                    <span className="text-slate-500 text-xs uppercase tracking-widest block mb-1">
                                        Creditor Classes
                                    </span>
                                    <span className="text-xl font-light text-white">{tiers.length}</span>
                                </div>
                                <div>
                                    <span className="text-slate-500 text-xs uppercase tracking-widest block mb-1">
                                        Expense Type
                                    </span>
                                    <span className="text-xl font-light text-teal">Category 1</span>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-white/10">
                                <div className="flex items-center gap-2 mb-2">
                                    <Lock className="w-3 h-3 text-slate-500" />
                                    <span className="text-slate-500 text-xs uppercase tracking-widest">
                                        Input Integrity Anchor
                                    </span>
                                </div>
                                <code className="text-xs font-mono text-slate-400 bg-navy-800 px-3 py-2 block">
                                    SHA-256: 0x7F3A...C91B2E9A
                                </code>
                                <p className="text-[10px] text-slate-600 mt-2">
                                    Certificate valid only for matching input hash
                                </p>
                            </div>

                            <div className="pt-4 flex items-center gap-2 text-sm text-slate-400">
                                <FileCheck className="w-4 h-4 text-teal" />
                                <span>Billable to estate &bull; Not your P&L</span>
                            </div>
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
