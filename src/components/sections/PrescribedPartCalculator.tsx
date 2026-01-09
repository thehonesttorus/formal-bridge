"use client";

import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useState, useEffect } from "react";
import { Calculator, PieChart, ChevronRight } from "lucide-react";

export default function PrescribedPartCalculator() {
    const [netProperty, setNetProperty] = useState(150000);
    const [isHoveringCode, setIsHoveringCode] = useState(false);

    // Formula constants
    const firstTranche = Math.min(netProperty, 10000);
    const remainder = Math.max(0, netProperty - 10000);
    const prescribedPart = (firstTranche * 0.5) + (remainder * 0.2);
    // Cap at £800k (post-2020)
    const finalAmount = Math.min(prescribedPart, 800000);
    const floatingChargeShare = netProperty - finalAmount;

    return (
        <section className="py-24 bg-navy-900 border-t border-navy-800">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid lg:grid-cols-2 gap-16">
                    {/* Left: Interactive Controls & 3D Split */}
                    <div className="space-y-12">
                        <div className="space-y-4">
                            <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                                <Calculator className="w-8 h-8 text-teal" />
                                Section 176A Calculator
                            </h2>
                            <p className="text-slate-400">
                                Drag to adjust Net Property and see the <span className="text-white font-mono">calculatePrescribedPart</span> function react in real-time.
                            </p>
                        </div>

                        {/* Slider Control */}
                        <div className="p-6 rounded-2xl bg-navy-800 border border-navy-700">
                            <div className="flex justify-between mb-4">
                                <label className="text-sm font-semibold text-slate-300">Net Property Value</label>
                                <span className="font-mono text-teal font-bold">£{netProperty.toLocaleString()}</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="1000000"
                                step="1000"
                                value={netProperty}
                                onChange={(e) => setNetProperty(parseInt(e.target.value))}
                                className="w-full h-2 bg-navy-900 rounded-lg appearance-none cursor-pointer accent-teal"
                            />
                            <div className="flex justify-between mt-2 text-xs text-slate-500 font-mono">
                                <span>£0</span>
                                <span>£1M+</span>
                            </div>
                        </div>

                        {/* Visual Output */}
                        <div className="grid grid-cols-2 gap-4">
                            <ResultCard
                                label="Prescribed Part"
                                sub="(For Unsecured)"
                                amount={finalAmount}
                                color="text-teal"
                                bg="bg-teal/10"
                                border="border-teal/30"
                            />
                            <ResultCard
                                label="Floating Charge"
                                sub="(For Lender)"
                                amount={floatingChargeShare}
                                color="text-blue-400"
                                bg="bg-blue-400/10"
                                border="border-blue-400/30"
                            />
                        </div>
                    </div>

                    {/* Right: Live Lean Code */}
                    <div
                        className="relative rounded-2xl bg-[#0d1117] border border-navy-700 p-6 font-mono text-sm shadow-xl overflow-hidden group"
                        onMouseEnter={() => setIsHoveringCode(true)}
                        onMouseLeave={() => setIsHoveringCode(false)}
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-50">
                            <div className="px-2 py-1 rounded bg-navy-800 text-xs text-slate-400 border border-navy-700">
                                PrescribedPart.lean
                            </div>
                        </div>

                        <div className="space-y-1">
                            <CodeLine num={34} code="def calculatePrescribedPart (netProperty : Amount) := " />
                            <CodeLine num={35} code="  let tenK := 10000" />

                            <CodeLine
                                num={36}
                                code={`  let firstTranche := min ${netProperty} tenK`}
                                active highlight={netProperty <= 10000}
                            />
                            <CodeLine
                                num={37}
                                code={`  let firstPart := ${firstTranche} * 0.5 -- £${(firstTranche * 0.5).toFixed(0)}`}
                                active
                            />

                            <CodeLine
                                num={38}
                                code={`  let remainder := max 0 (${netProperty} - tenK)`}
                                active highlight={netProperty > 10000}
                            />
                            <CodeLine
                                num={39}
                                code={`  let secondPart := ${remainder} * 0.2 -- £${(remainder * 0.2).toFixed(0)}`}
                                active
                            />

                            <CodeLine
                                num={40}
                                code={`  let total := firstPart + secondPart`}
                                active
                            />

                            <CodeLine num={41} code="  let cap := 800000" />
                            <CodeLine
                                num={42}
                                code={`  min total cap -- Final: £${finalAmount}`}
                                color="text-teal"
                                active
                            />
                        </div>

                        {/* Overlay "Live Execution" Badge */}
                        <div className="absolute bottom-4 right-4 flex items-center gap-2">
                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-teal"></span>
                            </span>
                            <span className="text-xs font-bold text-teal tracking-wider uppercase">Live Execution</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function ResultCard({ label, sub, amount, color, bg, border }: any) {
    return (
        <motion.div
            className={`p-6 rounded-xl ${bg} ${border} border`}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            key={amount} // Re-animate on change
        >
            <div className="text-sm text-slate-400 mb-1">{label}</div>
            <div className="text-xs text-slate-500 mb-2">{sub}</div>
            <div className={`text-2xl font-bold ${color}`}>
                £{amount.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </div>
        </motion.div>
    );
}

function CodeLine({ num, code, active, highlight, color = "text-slate-300" }: any) {
    return (
        <div className={`flex gap-4 ${highlight ? "bg-white/5 -mx-4 px-4 py-0.5 rounded" : ""}`}>
            <span className="text-slate-600 select-none w-6 text-right">{num}</span>
            <span className={`${color} ${active ? "opacity-100" : "opacity-60"}`}>
                {code}
            </span>
        </div>
    )
}
