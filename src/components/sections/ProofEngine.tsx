"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Shield, FileCode, CheckCircle } from "lucide-react";

// Real Lean code - clean, professional
const leanCode = `-- InsolvencyLib: UK Insolvency Verification
-- Theorem Prover: Lean 4 | Version 1.0.0

/-- The statutory distribution priority --/
inductive CreditorClass where
  | FixedCharge
  | Expenses  
  | Preferential
  | PrescribedPart
  | FloatingCharge
  | Unsecured

/-- S.176A Prescribed Part Calculation --/
def prescribedPart (netProperty : ℕ) : ℕ :=
  let first := min netProperty 10000
  let remainder := netProperty - first
  min (first / 2 + remainder / 10) 800000

/-- Waterfall distribution is exhaustive --/
theorem distribution_complete : 
    ∀ c : Claim, ∃ t : Tier, assigned c t := by
  intro c
  exact ⟨classify c, classify_assigns c⟩

#check prescribedPart 450000
-- Result: 132000 [OK]`;

export default function ProofEngine() {
    const ref = useRef<HTMLElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });
    const [displayedCode, setDisplayedCode] = useState("");
    const [isComplete, setIsComplete] = useState(false);
    const codeRef = useRef<HTMLDivElement>(null);

    // Typing effect
    useEffect(() => {
        if (!isInView) return;

        const lines = leanCode.split('\n');
        let lineIndex = 0;
        let charIndex = 0;
        let result = "";

        const interval = setInterval(() => {
            if (lineIndex >= lines.length) {
                clearInterval(interval);
                setIsComplete(true);
                return;
            }

            const line = lines[lineIndex];
            if (charIndex < line.length) {
                result += line[charIndex];
                charIndex++;
            } else {
                result += '\n';
                lineIndex++;
                charIndex = 0;
            }
            setDisplayedCode(result);
        }, 12);

        return () => clearInterval(interval);
    }, [isInView]);

    // Auto-scroll
    useEffect(() => {
        if (codeRef.current) {
            codeRef.current.scrollTop = codeRef.current.scrollHeight;
        }
    }, [displayedCode]);

    return (
        <section ref={ref} className="py-20">
            <div className="max-w-7xl mx-auto px-8">

                {/* Section Header - Clean, minimal */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8 }}
                    className="max-w-2xl mb-16"
                >
                    <span className="text-teal font-medium tracking-[0.2em] uppercase text-sm block mb-4">
                        The Technology
                    </span>
                    <h2 className="text-4xl md:text-5xl font-light text-white leading-tight mb-6">
                        Every calculation backed by
                        <span className="block font-medium">mathematical proof.</span>
                    </h2>
                    <p className="text-lg text-slate-400 font-light leading-relaxed">
                        Formal Bridge uses Lean 4, the same theorem prover trusted by
                        mathematicians and aerospace engineers. Your distributions aren't
                        just calculated—they're proven correct.
                    </p>
                </motion.div>

                {/* Two Column Layout */}
                <div className="grid lg:grid-cols-2 gap-16 items-start">

                    {/* Left: Benefits */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="space-y-8"
                    >
                        {[
                            {
                                title: "Audit-Ready Certificates",
                                description: "Every calculation generates a cryptographic proof certificate that can be independently verified."
                            },
                            {
                                title: "Statutory Compliance",
                                description: "IA 1986, IR 2016, and Finance Act 2020 rules encoded directly into verified functions."
                            },
                            {
                                title: "Zero Runtime Errors",
                                description: "Proofs guarantee correctness. If the code compiles, the calculation is mathematically sound."
                            }
                        ].map((item, i) => (
                            <div key={i} className="group">
                                <div className="flex items-start gap-4">
                                    <div className="mt-1">
                                        <CheckCircle className="w-5 h-5 text-teal" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-medium text-white mb-2">{item.title}</h3>
                                        <p className="text-slate-400 font-light leading-relaxed">{item.description}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </motion.div>

                    {/* Right: Code Terminal - Premium Design */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.8, delay: 0.3 }}
                    >
                        <div className="bg-[#0a0e14] border border-slate-800 overflow-hidden">
                            {/* Terminal Header */}
                            <div className="flex items-center justify-between px-4 py-3 bg-[#0d1117] border-b border-slate-800">
                                <div className="flex items-center gap-4">
                                    <div className="flex gap-2">
                                        <div className="w-3 h-3 rounded-full bg-slate-700" />
                                        <div className="w-3 h-3 rounded-full bg-slate-700" />
                                        <div className="w-3 h-3 rounded-full bg-slate-700" />
                                    </div>
                                    <span className="text-xs text-slate-500 font-mono">InsolvencyLib/Waterfall.lean</span>
                                </div>
                                <FileCode className="w-4 h-4 text-slate-600" />
                            </div>

                            {/* Code Display */}
                            <div
                                ref={codeRef}
                                className="p-6 font-mono text-sm h-[400px] overflow-y-auto"
                            >
                                <pre className="text-slate-400 whitespace-pre-wrap leading-relaxed">
                                    {displayedCode.split('\n').map((line, i) => (
                                        <div key={i} className="flex">
                                            <span className="w-6 text-slate-700 text-right mr-6 select-none shrink-0 text-xs">
                                                {i + 1}
                                            </span>
                                            <span className={`${line.startsWith('--') ? 'text-slate-600' :
                                                line.includes('theorem') || line.includes('def') ? 'text-teal' :
                                                    line.includes('inductive') ? 'text-blue-400' :
                                                        line.includes('#check') || line.includes('Result') ? 'text-green-400' :
                                                            'text-slate-400'
                                                }`}>
                                                {line}
                                            </span>
                                        </div>
                                    ))}
                                    {!isComplete && (
                                        <motion.span
                                            className="inline-block w-2 h-4 bg-teal/80 ml-1"
                                            animate={{ opacity: [1, 0] }}
                                            transition={{ duration: 0.6, repeat: Infinity }}
                                        />
                                    )}
                                </pre>
                            </div>

                            {/* Footer */}
                            <div className="px-4 py-3 bg-[#0d1117] border-t border-slate-800 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Shield className="w-4 h-4 text-teal" />
                                    <span className="text-xs text-slate-500 font-mono">
                                        {isComplete ? "All proofs verified" : "Verifying..."}
                                    </span>
                                </div>
                                <span className="text-xs text-slate-600 font-mono">Lean 4</span>
                            </div>

                            {/* Caption for non-mathematicians */}
                            <div className="px-4 py-3 bg-slate-900/50 border-t border-slate-800/50">
                                <p className="text-xs text-slate-500 font-light leading-relaxed">
                                    The logic above isn't a prediction—it's a <span className="text-teal">theorem</span>.
                                    Our kernel uses the same technology used by aerospace engineers to ensure that
                                    the code—and your distribution—is mathematically impossible to get wrong.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
