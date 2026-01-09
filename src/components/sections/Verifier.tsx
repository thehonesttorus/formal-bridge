"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { CheckCircle2, Terminal as TerminalIcon } from "lucide-react";

export default function Verifier() {
    return (
        <section className="py-32 section">
            <div className="text-center mb-16">
                <span className="text-teal font-mono tracking-widest text-sm font-bold">LIVE DEMO</span>
                <h2 className="text-4xl md:text-5xl font-bold mt-4">
                    See the <span className="text-teal">Engine</span> in Action
                </h2>
            </div>

            <div className="max-w-4xl mx-auto">
                <TerminalWindow />
            </div>
        </section>
    );
}

function TerminalWindow() {
    const [lines, setLines] = useState<string[]>([]);
    const [completed, setCompleted] = useState(false);

    useEffect(() => {
        const sequence = [
            { text: "Scanning UK Insolvency Act 1986...", delay: 500 },
            { text: "Parsing creditor claims: 847 entries...", delay: 1500 },
            { text: "Calculating prescribed part (S.176A)...", delay: 2500 },
            { text: "Verifying distribution waterfall...", delay: 3500 },
            { text: "Success.", delay: 4500 },
        ];

        let timeouts: NodeJS.Timeout[] = [];

        sequence.forEach(({ text, delay }) => {
            const t = setTimeout(() => {
                setLines((prev) => [...prev, text]);
                if (text === "Success.") setCompleted(true);
            }, delay);
            timeouts.push(t);
        });

        return () => timeouts.forEach(clearTimeout);
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="terminal bg-midnight border border-navy-700 rounded-xl overflow-hidden shadow-2xl shadow-teal/5"
        >
            {/* Header */}
            <div className="terminal-header flex items-center gap-2 px-4 py-3 bg-navy-800 border-b border-navy-700">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <div className="ml-4 text-xs font-mono text-slate-500 flex items-center gap-2">
                    <TerminalIcon className="w-3 h-3" />
                    formal-bridge-cli — v1.0.4
                </div>
            </div>

            {/* Body */}
            <div className="p-6 font-mono text-sm relative min-h-[300px]">
                <div className="text-slate-400 mb-4">
                    <span className="text-teal font-bold">$</span> insolvency verify --case REF-2026-0042
                </div>

                <div className="space-y-2">
                    {lines.map((line, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className={line === "Success." ? "text-teal font-bold mt-4" : "text-slate-300"}
                        >
                            {line === "Success." ? (
                                <span className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4" />
                                    All 12 compliance checks passed.
                                </span>
                            ) : (
                                `> ${line}`
                            )}
                        </motion.div>
                    ))}
                    {!completed && (
                        <motion.div
                            animate={{ opacity: [0, 1] }}
                            transition={{ repeat: Infinity, duration: 0.8 }}
                            className="w-2 h-4 bg-teal inline-block ml-1 align-middle"
                        />
                    )}
                </div>

                {/* Certificate Pop-up */}
                {completed && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute bottom-6 right-6 p-4 bg-navy-800/90 backdrop-blur border border-teal/20 rounded-lg shadow-xl"
                    >
                        <div className="text-xs text-slate-500 mb-1">PROOF CERTIFICATE</div>
                        <div className="text-teal font-mono font-bold">fb-2026-0042-verified</div>
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
}
