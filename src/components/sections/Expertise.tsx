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
                        {/* Founder identifier */}
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
                                Cambridge Mathematics • Formal Methods
                            </motion.p>
                        </div>

                        {/* Founder Quote - Industry Aligned */}
                        <motion.blockquote
                            className="bg-slate-900/30 border-l-2 border-teal/50 p-6"
                            initial={{ opacity: 0 }}
                            animate={isInView ? { opacity: 1 } : {}}
                            transition={{ delay: 0.5 }}
                        >
                            <p className="text-slate-300 font-light italic leading-relaxed text-lg">
                                "In the context of a statutory distribution, a rounding variance or misapplied
                                preference isn't merely a clerical error; it is a <span className="text-teal">breach of fiduciary duty</span>.
                                We have replaced brittle, unvalidated spreadsheets with a formally verified kernel
                                to ensure that every distribution is mathematically beyond reproach and strictly
                                compliant with the Insolvency Act 1986."
                            </p>
                        </motion.blockquote>

                        {/* Cambridge Badge */}
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

                    {/* Right: Why Formal Methods */}
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

                            <p className="text-slate-400 font-light leading-relaxed mb-8">
                                Formal Bridge leverages the same <span className="text-teal font-medium">Formal Verification</span> methodology
                                used to secure mission-critical aerospace and cryptographic systems to eliminate
                                computational liability in UK insolvency proceedings.
                            </p>

                            <div className="space-y-8">
                                {[
                                    {
                                        title: "Statutory Determinism",
                                        desc: "Legal rules should not be \"interpreted\" by error-prone spreadsheets; they must be proven as theorems by mathematical kernels."
                                    },
                                    {
                                        title: "Zero-Failure Engineering",
                                        desc: "The same theorem-proving technology trusted by engineers to verify flight control systems now audits your distribution calculations."
                                    },
                                    {
                                        title: "Court-Ready Assurance",
                                        desc: "By encoding the Insolvency Rules 2016 and the Finance Act 2020 directly into verified functions, we provide a standard of care that exceeds traditional manual review."
                                    }
                                ].map((item, i) => (
                                    <motion.div
                                        key={i}
                                        className="group"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                                        transition={{ delay: 0.5 + i * 0.15 }}
                                    >
                                        <h5 className="text-white font-medium text-sm tracking-wide mb-2">
                                            {item.title}
                                        </h5>
                                        <p className="text-sm text-slate-500 font-light leading-relaxed">
                                            {item.desc}
                                        </p>
                                        {i < 2 && <div className="border-b border-slate-800/30 mt-6" />}
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Regulatory Alignment Badges */}
                        <motion.div
                            className="grid grid-cols-3 gap-4"
                            initial={{ opacity: 0 }}
                            animate={isInView ? { opacity: 1 } : {}}
                            transition={{ delay: 1.0 }}
                        >
                            {[
                                { label: "Mitigate", sub: "Regulatory Liability" },
                                { label: "Strict", sub: "Statutory Adherence" },
                                { label: "Complete", sub: "Audit Trail" }
                            ].map((item, i) => (
                                <div key={i} className="bg-slate-900/50 border border-slate-800/50 p-4 text-center">
                                    <span className="text-teal text-sm font-medium block">{item.label}</span>
                                    <span className="text-xs text-slate-600 font-mono tracking-wide">{item.sub}</span>
                                </div>
                            ))}
                        </motion.div>

                        {/* Trust Indicators */}
                        <motion.div
                            className="flex items-center gap-6 pt-4"
                            initial={{ opacity: 0 }}
                            animate={isInView ? { opacity: 1 } : {}}
                            transition={{ delay: 1.1 }}
                        >
                            <span className="text-xs text-slate-600 font-mono tracking-wide">
                                SIP 9 COMPLIANT
                            </span>
                            <span className="text-slate-800">|</span>
                            <span className="text-xs text-slate-600 font-mono tracking-wide">
                                ICAEW/IPA ALIGNED
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
