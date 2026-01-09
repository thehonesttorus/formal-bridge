'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

export default function Expertise() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <section id="expertise" ref={ref} className="py-32 px-6 relative">
            <div className="max-w-6xl mx-auto">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-20"
                >
                    <span className="text-teal font-medium tracking-[0.2em] uppercase text-sm block mb-4">
                        The Science
                    </span>
                    <h2 className="text-4xl md:text-5xl font-light text-white leading-tight mb-6">
                        From Cambridge
                        <span className="block font-medium">to Compliance.</span>
                    </h2>
                </motion.div>

                {/* Main Content */}
                <div className="grid lg:grid-cols-2 gap-16 items-start">

                    {/* Left: Founder Story */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="space-y-8"
                    >
                        {/* Founder identifier - elegant typography only */}
                        <div className="border-l-2 border-teal/50 pl-6">
                            <motion.h3
                                className="text-2xl font-light text-white tracking-wide"
                                initial={{ opacity: 0 }}
                                animate={isInView ? { opacity: 1 } : {}}
                                transition={{ delay: 0.3 }}
                            >
                                Theodore S.
                            </motion.h3>
                            <motion.p
                                className="text-teal font-mono text-xs tracking-[0.2em] uppercase mt-1"
                                initial={{ opacity: 0 }}
                                animate={isInView ? { opacity: 1 } : {}}
                                transition={{ delay: 0.4 }}
                            >
                                Formal Methods Engineer
                            </motion.p>
                        </div>

                        <div className="space-y-6 text-slate-400 font-light leading-relaxed">
                            <p>
                                Formal Bridge leverages the same <span className="text-teal">Formal Verification</span> methodology
                                used in aerospace and cryptographic systems to eliminate calculation risk in UK insolvency.
                            </p>
                            <p>
                                Legal rules shouldn't be "interpreted" by brittle spreadsheets;
                                they should be <span className="text-teal">proven</span> by mathematical kernels.
                            </p>
                            <p>
                                The same theorem-proving technology trusted by aerospace engineers to
                                verify flight control systems now verifies your distribution calculations—
                                ensuring every output is mathematically beyond reproach.
                            </p>
                        </div>

                        {/* Cambridge Badge - minimalist text treatment */}
                        <motion.div
                            className="pt-4"
                            initial={{ opacity: 0 }}
                            animate={isInView ? { opacity: 1 } : {}}
                            transition={{ delay: 0.6 }}
                        >
                            <div className="inline-block border border-slate-700/50 px-4 py-2">
                                <span className="text-xs text-slate-500 font-mono tracking-wide">
                                    CAMBRIDGE MATHEMATICAL TRIPOS
                                </span>
                                <span className="text-slate-700 mx-2">|</span>
                                <span className="text-xs text-slate-600 font-light">
                                    Pure Mathematics & Formal Methods
                                </span>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Right: Why Formal Methods - Dynamic Stats */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="space-y-6"
                    >
                        <div className="border border-slate-800/50 p-8">
                            <h4 className="text-xs font-mono text-teal tracking-[0.2em] uppercase mb-8">
                                Why Formal Methods?
                            </h4>

                            <div className="space-y-8">
                                {[
                                    {
                                        stat: "0",
                                        unit: "runtime errors",
                                        desc: "If the code compiles, the calculation is mathematically guaranteed correct."
                                    },
                                    {
                                        stat: "100%",
                                        unit: "statutory coverage",
                                        desc: "IA 1986, IR 2016, and Finance Act 2020 rules encoded as verified theorems."
                                    },
                                    {
                                        stat: "∞",
                                        unit: "audit trail",
                                        desc: "Every calculation generates a cryptographic proof certificate."
                                    }
                                ].map((item, i) => (
                                    <motion.div
                                        key={i}
                                        className="group"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                                        transition={{ delay: 0.5 + i * 0.15 }}
                                    >
                                        <div className="flex items-baseline gap-4">
                                            <span className="text-4xl font-extralight text-teal tabular-nums">
                                                {item.stat}
                                            </span>
                                            <span className="text-xs text-slate-600 font-mono uppercase tracking-wide">
                                                {item.unit}
                                            </span>
                                        </div>
                                        <p className="text-sm text-slate-500 font-light leading-relaxed mt-2 pl-0">
                                            {item.desc}
                                        </p>
                                        {i < 2 && <div className="border-b border-slate-800/30 mt-6" />}
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Quote - Clean treatment */}
                        <motion.div
                            className="bg-slate-900/30 border-l-2 border-teal/50 p-6"
                            initial={{ opacity: 0 }}
                            animate={isInView ? { opacity: 1 } : {}}
                            transition={{ delay: 0.9 }}
                        >
                            <p className="text-slate-400 font-light italic leading-relaxed">
                                "In insolvency, a rounding error isn't just a mistake—it's a regulatory breach.
                                We replaced brittle spreadsheets with a verified kernel to ensure every
                                distribution is mathematically beyond reproach."
                            </p>
                            <p className="text-sm text-slate-600 mt-4">— Theodore S., Founder</p>
                        </motion.div>

                        {/* Trust Indicators - Text only */}
                        <motion.div
                            className="flex items-center gap-6 pt-4"
                            initial={{ opacity: 0 }}
                            animate={isInView ? { opacity: 1 } : {}}
                            transition={{ delay: 1.0 }}
                        >
                            <span className="text-xs text-slate-600 font-mono tracking-wide">
                                SIP 9 COMPLIANT
                            </span>
                            <span className="text-slate-800">|</span>
                            <span className="text-xs text-slate-600 font-mono tracking-wide">
                                ZERO-RETENTION
                            </span>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
