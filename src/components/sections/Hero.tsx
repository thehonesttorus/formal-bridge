"use client";

import { motion } from "framer-motion";
import { ChevronRight, Shield } from "lucide-react";
import Link from "next/link";
import BridgeAnimation from "@/components/ui/BridgeAnimation";

/**
 * Hero Section
 * Features: "Audit Shield" headline with liability-safe "computation vs advice" framing
 */
export default function Hero() {
    return (
        <section className="relative min-h-screen overflow-hidden flex flex-col justify-center">

            {/* CONTENT */}
            <div className="relative z-10 pt-32 pb-12 px-6 max-w-7xl mx-auto w-full">

                {/* Top: Headline + Description */}
                <div className="max-w-4xl mb-16">

                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-8"
                    >
                        <div className="w-2 h-2 rounded-full bg-teal animate-pulse" />
                        <span className="text-teal font-mono text-xs uppercase tracking-wider">
                            Statutory Audit Kernel
                        </span>
                    </motion.div>

                    {/* Headline */}
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-6xl md:text-8xl font-bold leading-tight tracking-tight text-white mb-8"
                    >
                        Audit <br />
                        <span className="relative">
                            Shield.
                            <svg className="absolute -bottom-2 left-0 w-full h-3" viewBox="0 0 100 10" preserveAspectRatio="none">
                                <path d="M0 5 Q 50 10 100 5" stroke="#00d4aa" strokeWidth="2" fill="none" opacity="0.5" />
                            </svg>
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="text-xl text-slate-400 font-light leading-relaxed max-w-2xl border-l-2 border-teal/30 pl-6 mb-4"
                    >
                        You attest the inputs.{" "}
                        <span className="text-white font-medium">We certify the computation.</span>
                    </motion.p>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7 }}
                        className="text-base text-slate-500 font-light leading-relaxed max-w-2xl pl-6 mb-10"
                    >
                        If your inputs are correct, our Lean 4 kernel mathematically proves
                        the calculation aligns with the Insolvency Act 1986.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                        className="flex flex-wrap items-center gap-6"
                    >
                        <Link
                            href="/login"
                            className="group relative h-14 px-8 bg-teal overflow-hidden flex items-center gap-3"
                        >
                            <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                            <span className="relative z-10 text-midnight font-bold tracking-wide text-sm uppercase flex items-center gap-2">
                                <Shield size={16} />
                                Launch Audit Portal <ChevronRight size={16} />
                            </span>
                        </Link>
                        <span className="text-slate-500 text-sm">
                            £50 per audit certificate &bull; Category 1 Expense
                        </span>
                    </motion.div>
                </div>

                {/* Bottom: Bridge Animation */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1, duration: 0.8 }}
                    className="w-full"
                >
                    <BridgeAnimation height={420} />
                </motion.div>

            </div>
        </section >
    );
}
