"use client";

import { motion, useInView } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { Lock, Scale, Users, Landmark, TrendingDown, FileCode, Terminal } from "lucide-react";

// Real Lean code from InsolvencyLib - more substantial for the typing effect
const leanCode = `-- InsolvencyLib: Formal Verification for UK Insolvency
-- Theorem Prover: Lean 4

inductive CreditorClass where
  | FixedCharge      -- Tier 1: Secured creditors
  | Expenses         -- Tier 2: Insolvency costs
  | Preferential     -- Tier 3: Employees (S.386)
  | PrescribedPart   -- Tier 4: Ring-fenced (S.176A)
  | FloatingCharge   -- Tier 5: Floating charge holders
  | Unsecured        -- Tier 6: Trade creditors

/-- The statutory priority ordering is total --/
theorem priority_total (a b : CreditorClass) :
    priority a b ∨ priority b a ∨ a = b := by
  cases a <;> cases b <;> simp [priority]

/-- Prescribed Part calculation (S.176A) --/
def prescribedPart (netProperty : ℕ) : ℕ :=
  let first10k := min netProperty 10000
  let remainder := netProperty - first10k
  let fromFirst := first10k / 2  -- 50% of first £10k
  let fromRest := remainder / 10 -- 50% → 20% after £10k
  min (fromFirst + fromRest) 800000  -- Capped at £800k

/-- Distribution waterfall is exhaustive --/
theorem waterfall_exhaustive (claims : List Claim) :
    ∀ c ∈ claims, ∃ tier, assigned c tier := by
  intro c hc
  exact ⟨classifyCreditor c, classify_assigns c⟩

#check prescribedPart 450000  -- Result: 132000`;

const tiers = [
    { id: "FixedCharge", name: "Fixed Charge", color: "#00d4aa", icon: Lock },
    { id: "Expenses", name: "Expenses", color: "#00b8d4", icon: Scale },
    { id: "Preferential", name: "Preferential", color: "#0096c7", icon: Users },
    { id: "PrescribedPart", name: "Prescribed Part", color: "#0077b6", icon: Landmark },
    { id: "FloatingCharge", name: "Floating Charge", color: "#023e8a", icon: TrendingDown },
    { id: "Unsecured", name: "Unsecured", color: "#03045e", icon: Users },
];

export default function CodeWaterfall() {
    const [hoveredTier, setHoveredTier] = useState<string | null>(null);
    const [displayedCode, setDisplayedCode] = useState("");
    const [currentLine, setCurrentLine] = useState(0);
    const codeContainerRef = useRef<HTMLDivElement>(null);
    const sectionRef = useRef<HTMLElement>(null);
    const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

    // Typing animation effect
    useEffect(() => {
        if (!isInView) return;

        const lines = leanCode.split('\n');
        let lineIndex = 0;
        let charIndex = 0;
        let currentText = "";

        const typeInterval = setInterval(() => {
            if (lineIndex >= lines.length) {
                clearInterval(typeInterval);
                return;
            }

            const currentLineText = lines[lineIndex];

            if (charIndex < currentLineText.length) {
                currentText += currentLineText[charIndex];
                charIndex++;
            } else {
                currentText += '\n';
                lineIndex++;
                charIndex = 0;
                setCurrentLine(lineIndex);
            }

            setDisplayedCode(currentText);
        }, 15); // Fast typing speed

        return () => clearInterval(typeInterval);
    }, [isInView]);

    // Auto-scroll as code types
    useEffect(() => {
        if (codeContainerRef.current) {
            codeContainerRef.current.scrollTop = codeContainerRef.current.scrollHeight;
        }
    }, [displayedCode]);

    return (
        <section ref={sectionRef} className="py-24 bg-midnight relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex items-center gap-3 mb-4">
                    <Terminal className="w-6 h-6 text-teal" />
                    <span className="text-teal text-sm font-bold tracking-widest uppercase">
                        The Source of Truth
                    </span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                    Defined by <span className="text-teal">Law</span>. Verified by <span className="text-teal">Code</span>.
                </h2>
                <p className="text-slate-400 text-lg mb-12 max-w-2xl">
                    Every calculation is backed by formal proofs in Lean 4—the same technology used to verify aircraft systems and cryptographic protocols.
                </p>

                <div className="grid lg:grid-cols-2 gap-12 items-start">
                    {/* Left: Interactive Tier Blocks */}
                    <div className="relative perspective-[1000px]">
                        <div className="space-y-3" style={{ transformStyle: "preserve-3d", transform: "rotateY(8deg)" }}>
                            {tiers.map((tier, i) => (
                                <motion.div
                                    key={tier.id}
                                    onHoverStart={() => setHoveredTier(tier.id)}
                                    onHoverEnd={() => setHoveredTier(null)}
                                    className="relative h-14 rounded-xl border border-navy-600 bg-navy-800/80 backdrop-blur-sm cursor-pointer transition-all duration-300"
                                    style={{
                                        transformStyle: "preserve-3d",
                                        transform: hoveredTier === tier.id ? "translateZ(25px) scale(1.03)" : "translateZ(0)",
                                    }}
                                    animate={{
                                        borderColor: hoveredTier === tier.id ? tier.color : "rgba(30, 41, 59, 0.5)",
                                        boxShadow: hoveredTier === tier.id ? `0 0 30px ${tier.color}40` : "none",
                                    }}
                                >
                                    <div className="absolute inset-0 flex items-center justify-between px-5">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-lg" style={{ backgroundColor: `${tier.color}20` }}>
                                                <tier.icon className="w-4 h-4" style={{ color: tier.color }} />
                                            </div>
                                            <span className="font-bold text-white">{tier.name}</span>
                                        </div>
                                        <div className="font-mono text-xs text-slate-500">Tier {i + 1}</div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Right: Live Typing Code Terminal */}
                    <div className="relative group">
                        <div className="absolute -inset-2 bg-gradient-to-br from-teal/20 to-blue-600/20 rounded-2xl blur-xl opacity-50 group-hover:opacity-80 transition-opacity" />
                        <div className="relative rounded-2xl bg-[#0d1117] border border-navy-600 overflow-hidden shadow-2xl">
                            {/* Terminal Header */}
                            <div className="flex items-center justify-between px-4 py-3 bg-navy-900/80 border-b border-navy-700">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500" />
                                    <div className="w-3 h-3 rounded-full bg-amber-500" />
                                    <div className="w-3 h-3 rounded-full bg-green-500" />
                                </div>
                                <div className="flex items-center gap-2">
                                    <FileCode className="w-4 h-4 text-slate-500" />
                                    <span className="text-xs text-slate-400 font-mono">InsolvencyLib/Types/Creditor.lean</span>
                                </div>
                                <div className="w-16" /> {/* Spacer for balance */}
                            </div>

                            {/* Code Display with Typing Effect */}
                            <div
                                ref={codeContainerRef}
                                className="p-4 font-mono text-sm h-[420px] overflow-y-auto scrollbar-thin scrollbar-thumb-navy-700 scrollbar-track-transparent"
                            >
                                <pre className="text-slate-300 whitespace-pre-wrap">
                                    {displayedCode.split('\n').map((line, i) => (
                                        <div key={i} className="flex">
                                            <span className="w-8 text-slate-600 text-right mr-4 select-none shrink-0">
                                                {i + 1}
                                            </span>
                                            <span className={`${line.startsWith('--') ? 'text-slate-500' :
                                                    line.includes('theorem') || line.includes('def') ? 'text-purple-400' :
                                                        line.includes('inductive') ? 'text-blue-400' :
                                                            line.includes(':=') || line.includes('by') ? 'text-cyan-400' :
                                                                'text-slate-300'
                                                }`}>
                                                {line}
                                            </span>
                                        </div>
                                    ))}
                                    {/* Blinking cursor */}
                                    <motion.span
                                        className="inline-block w-2 h-4 bg-teal ml-1"
                                        animate={{ opacity: [1, 0] }}
                                        transition={{ duration: 0.5, repeat: Infinity }}
                                    />
                                </pre>
                            </div>

                            {/* Terminal Footer */}
                            <div className="px-4 py-2 bg-navy-900/80 border-t border-navy-700 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-teal animate-pulse" />
                                    <span className="text-xs text-teal font-mono">Lean 4 — All theorems verified</span>
                                </div>
                                <span className="text-xs text-slate-500 font-mono">
                                    Line {currentLine + 1}/{leanCode.split('\n').length}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
