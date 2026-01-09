"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { FileCheck, Shield, BadgeCheck } from "lucide-react";

export default function Process() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start center", "end center"],
    });

    // Scale the path length from 0 to 1 based on scroll
    const pathLength = useTransform(scrollYProgress, [0, 0.8], [0, 1]);

    const steps = [
        {
            id: "01",
            title: "Input",
            subtitle: "Data Ingestion",
            desc: "Ingest legal frameworks, creditor claims, and financial data.",
            icon: FileCheck,
        },
        {
            id: "02",
            title: "Verification",
            subtitle: "Formal Proof Engine",
            desc: "Mathematically prove compliance against UK insolvency regulations via Lean 4.",
            icon: Shield,
            highlight: true,
        },
        {
            id: "03",
            title: "Output",
            subtitle: "Audit-Ready Reports",
            desc: "Generate regulator-ready documents with complete audit trails.",
            icon: BadgeCheck,
        },
    ];

    return (
        <section ref={containerRef} className="section relative py-32">
            <div className="text-center mb-20">
                <span className="text-teal font-mono tracking-widest text-sm font-bold">HOW IT WORKS</span>
                <h2 className="text-4xl md:text-5xl font-bold mt-4">
                    The Verification <span className="text-teal">Lifecycle</span>
                </h2>
            </div>

            <div className="relative grid md:grid-cols-3 gap-8">
                {/* Animated Connection Line (Desktop) */}
                <div className="hidden md:block absolute top-[60px] left-0 right-0 h-[2px] z-0">
                    <svg className="w-full h-[40px] overflow-visible">
                        <motion.path
                            d="M 0 20 L 1200 20"
                            fill="none"
                            stroke="#1e293b"
                            strokeWidth="2"
                        />
                        <motion.path
                            d="M 0 20 L 1200 20"
                            fill="none"
                            stroke="#00d4aa"
                            strokeWidth="2"
                            style={{ pathLength }}
                        />
                    </svg>
                </div>

                {steps.map((step, i) => (
                    <motion.div
                        key={step.id}
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ delay: i * 0.2 }}
                        className={`glass-card p-8 relative z-10 group ${step.highlight ? "border-teal/50 bg-navy-800/80" : ""}`}
                    >
                        <div className="flex items-center justify-between mb-8">
                            <span className="text-4xl font-bold text-slate-500/20 font-mono group-hover:text-teal/20 transition-colors">
                                {step.id}
                            </span>
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${step.highlight ? "bg-teal text-midnight" : "bg-navy-700 text-teal"}`}>
                                <step.icon className="w-6 h-6" />
                            </div>
                        </div>

                        <h3 className="text-2xl font-bold text-white mb-2">{step.title}</h3>
                        <p className="text-teal text-sm font-medium mb-4">{step.subtitle}</p>
                        <p className="text-slate-400 leading-relaxed text-sm">{step.desc}</p>

                        {step.highlight && (
                            <div className="absolute inset-0 rounded-2xl bg-teal/5 pointer-events-none" />
                        )}
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
