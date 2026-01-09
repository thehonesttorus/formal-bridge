"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { FileSpreadsheet, CheckCircle2, AlertTriangle, FileCheck, Zap } from "lucide-react";

// Simulated streaming data
const streamingClaims = [
    { id: "CLM-001", creditor: "HMRC Crown Debt", type: "Preferential", amount: 847520 },
    { id: "CLM-002", creditor: "Barclays (Fixed)", type: "Secured", amount: 2500000 },
    { id: "CLM-003", creditor: "Employee Wages", type: "Preferential", amount: 89340 },
    { id: "CLM-004", creditor: "Trade Supplier A", type: "Unsecured", amount: 125000 },
    { id: "CLM-005", creditor: "Pension Trust", type: "Preferential", amount: 156000 },
    { id: "CLM-006", creditor: "Landlord Arrears", type: "Unsecured", amount: 48000 },
    { id: "CLM-007", creditor: "Professional Fees", type: "Expense", amount: 95000 },
    { id: "CLM-008", creditor: "Trade Supplier B", type: "Unsecured", amount: 67800 },
];

const verificationLogs = [
    "Loading Insolvency Act 1986...",
    "Parsing IR 2016 regulations...",
    "Validating claim hierarchy...",
    "Computing S.176A allocation...",
    "Generating formal proof...",
    "Writing certificate...",
];

type ClaimStatus = "streaming" | "validating" | "verified" | "pending";

interface ProcessedClaim {
    id: string;
    creditor: string;
    type: string;
    amount: number;
    status: ClaimStatus;
}

export default function DataIngestionVisualizer() {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });
    const [claims, setClaims] = useState<ProcessedClaim[]>([]);
    const [currentLog, setCurrentLog] = useState(0);
    const [totalVerified, setTotalVerified] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);

    useEffect(() => {
        if (!isInView) return;

        let claimIndex = 0;
        const interval = setInterval(() => {
            if (claimIndex >= streamingClaims.length) {
                clearInterval(interval);
                return;
            }

            const claim = streamingClaims[claimIndex];

            // Add claim as streaming
            setClaims(prev => [...prev, { ...claim, status: "streaming" }]);

            // After 200ms, mark as validating
            setTimeout(() => {
                setClaims(prev => prev.map(c =>
                    c.id === claim.id ? { ...c, status: "validating" } : c
                ));
                setCurrentLog(prev => (prev + 1) % verificationLogs.length);
            }, 200);

            // After 500ms, mark as verified
            setTimeout(() => {
                setClaims(prev => prev.map(c =>
                    c.id === claim.id ? { ...c, status: "verified" } : c
                ));
                setTotalVerified(prev => prev + 1);
                setTotalAmount(prev => prev + claim.amount);
            }, 500);

            claimIndex++;
        }, 700);

        return () => clearInterval(interval);
    }, [isInView]);

    return (
        <section ref={ref} className="py-32 bg-midnight relative overflow-hidden">
            {/* Animated grid background */}
            <div className="absolute inset-0 perspective-[1000px]">
                <div
                    className="absolute inset-0 origin-center opacity-20"
                    style={{
                        transform: "rotateX(60deg) scale(2)",
                        backgroundImage: `
                            linear-gradient(rgba(0,212,170,0.15) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(0,212,170,0.15) 1px, transparent 1px)
                        `,
                        backgroundSize: '80px 80px',
                    }}
                />
            </div>

            <div className="max-w-7xl mx-auto px-6 relative">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500/20 to-teal/10 border border-amber-500/30 mb-6">
                        <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 0.5, repeat: Infinity }}
                        >
                            <Zap className="w-4 h-4 text-amber-400" />
                        </motion.div>
                        <span className="text-amber-400 text-sm font-bold tracking-widest uppercase">Live Data Stream</span>
                    </div>
                    <h2 className="text-4xl md:text-6xl font-bold mb-4">
                        <span className="text-white">Real-Time </span>
                        <span className="text-teal">Verification</span>
                    </h2>
                    <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                        Watch claims stream in and get verified against UK insolvency regulations
                    </p>
                </motion.div>

                {/* Main visualization */}
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left: Data Stream */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        className="lg:col-span-2"
                    >
                        <div
                            className="relative rounded-2xl overflow-hidden border border-navy-700 bg-navy-900/80 backdrop-blur-sm"
                            style={{ perspective: "1000px" }}
                        >
                            {/* Header bar */}
                            <div className="flex items-center justify-between px-6 py-4 border-b border-navy-700 bg-navy-800/50">
                                <div className="flex items-center gap-3">
                                    <FileSpreadsheet className="w-5 h-5 text-teal" />
                                    <span className="font-mono text-sm text-slate-400">incoming_claims.stream</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                                    <span className="text-xs text-slate-500">STREAMING</span>
                                </div>
                            </div>

                            {/* Claims list */}
                            <div className="p-4 h-[400px] overflow-hidden relative">
                                <div className="space-y-2">
                                    {claims.map((claim, i) => (
                                        <motion.div
                                            key={claim.id}
                                            initial={{ opacity: 0, x: -20, rotateX: 10 }}
                                            animate={{ opacity: 1, x: 0, rotateX: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-300 ${claim.status === "verified"
                                                ? "bg-teal/10 border-teal/40 shadow-[0_0_20px_rgba(0,212,170,0.2)]"
                                                : claim.status === "validating"
                                                    ? "bg-amber-500/10 border-amber-500/40"
                                                    : "bg-navy-800/50 border-navy-600"
                                                }`}
                                        >
                                            <div className="flex items-center gap-4">
                                                {/* Status icon */}
                                                <div className="relative">
                                                    {claim.status === "verified" ? (
                                                        <motion.div
                                                            initial={{ scale: 0 }}
                                                            animate={{ scale: 1 }}
                                                            className="w-10 h-10 rounded-lg bg-teal/20 flex items-center justify-center"
                                                        >
                                                            <CheckCircle2 className="w-5 h-5 text-teal" />
                                                        </motion.div>
                                                    ) : claim.status === "validating" ? (
                                                        <motion.div
                                                            animate={{ rotate: 360 }}
                                                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                            className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center"
                                                        >
                                                            <Zap className="w-5 h-5 text-amber-400" />
                                                        </motion.div>
                                                    ) : (
                                                        <div className="w-10 h-10 rounded-lg bg-navy-700 flex items-center justify-center">
                                                            <FileCheck className="w-5 h-5 text-slate-500" />
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Claim info */}
                                                <div>
                                                    <div className="font-bold text-white">{claim.creditor}</div>
                                                    <div className="flex items-center gap-2 text-xs">
                                                        <span className="text-slate-500">{claim.id}</span>
                                                        <span className="px-2 py-0.5 rounded bg-navy-700 text-slate-400">{claim.type}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="text-right">
                                                <div className={`text-lg font-bold ${claim.status === "verified" ? "text-teal" : "text-white"}`}>
                                                    £{claim.amount.toLocaleString()}
                                                </div>
                                                <div className={`text-xs ${claim.status === "verified" ? "text-teal" :
                                                    claim.status === "validating" ? "text-amber-400" : "text-slate-500"
                                                    }`}>
                                                    {claim.status === "verified" ? "VERIFIED" :
                                                        claim.status === "validating" ? "VALIDATING..." : "PENDING"}
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>

                                {/* Fade out at bottom */}
                                <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-navy-900 to-transparent pointer-events-none" />
                            </div>
                        </div>
                    </motion.div>

                    {/* Right: Stats Panel */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ delay: 0.2 }}
                        className="space-y-6"
                    >
                        {/* Counter cards */}
                        <div className="rounded-2xl border border-navy-700 bg-navy-900/80 p-6">
                            <div className="text-xs font-mono text-slate-500 mb-2">CLAIMS VERIFIED</div>
                            <div className="text-5xl font-black text-white mb-1">{totalVerified}</div>
                            <div className="text-sm text-slate-500">of {streamingClaims.length} total</div>
                        </div>

                        <div className="rounded-2xl border border-navy-700 bg-navy-900/80 p-6">
                            <div className="text-xs font-mono text-slate-500 mb-2">TOTAL VERIFIED</div>
                            <div className="text-4xl font-black text-teal">
                                £{(totalAmount / 1000000).toFixed(2)}M
                            </div>
                        </div>

                        {/* Verification log */}
                        <div className="rounded-2xl border border-navy-700 bg-navy-900/80 p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-2 h-2 rounded-full bg-teal animate-pulse" />
                                <span className="text-xs font-mono text-teal">LEAN 4 ENGINE</span>
                            </div>
                            <div className="font-mono text-xs text-slate-400 space-y-1">
                                {verificationLogs.slice(0, currentLog + 1).map((log, i) => (
                                    <motion.div
                                        key={log}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className={i === currentLog ? "text-teal" : "text-slate-600"}
                                    >
                                        {i === currentLog ? "> " : "- "}{log}
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
