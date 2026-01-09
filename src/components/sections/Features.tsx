"use client";

import { motion } from "framer-motion";
import { Scale, Lock, CheckCircle2, BarChart3, Building2, Terminal } from "lucide-react";
import { useEffect, useState } from "react";

export default function Features() {
    return (
        <section className="bg-navy-900 py-32">
            <div className="section">
                <div className="text-center mb-16">
                    <span className="text-teal font-mono tracking-widest text-sm font-bold">CAPABILITIES</span>
                    <h2 className="text-4xl md:text-5xl font-bold mt-4">
                        Built for <span className="text-teal">Practitioners</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(250px,auto)]">
                    {/* Feature 1: Regulatory (Large) */}
                    <FeatureCard
                        className="md:col-span-2"
                        title="Regulatory Compliance Engine"
                        desc="Always up-to-date with Insolvency Act 1986, IR 2016, and Finance Act 2020 amendments. Automatically checks against 150+ rule variants."
                        icon={Scale}
                    />

                    {/* Feature 2: Audit Trails */}
                    <FeatureCard
                        className="md:col-span-1"
                        title="Immutable Audit Trails"
                        desc="Cryptographic proof certificates for every decision."
                        icon={Lock}
                    />

                    {/* Feature 3: Live Calculator (Special) */}
                    <div className="glass-card md:col-span-1 p-8 flex flex-col justify-between group overflow-hidden border-teal/30">
                        <div className="absolute inset-0 bg-gradient-to-b from-teal/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div>
                            <div className="w-12 h-12 rounded-lg bg-teal text-midnight flex items-center justify-center mb-6">
                                <BarChart3 className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Distribution Engine</h3>
                            <p className="text-slate-400 text-sm">Real-time waterfall calculation.</p>
                        </div>

                        <div className="mt-8 font-mono bg-midnight/50 p-4 rounded-lg border border-teal/20 text-teal">
                            <div className="text-xs text-slate-500 mb-1">PRESCRIBED PART</div>
                            <div className="text-2xl font-bold flex items-center gap-2">
                                £<LiveCounter end={600000} duration={2} />
                            </div>
                        </div>
                    </div>

                    {/* Feature 4: Formal Proofs (Large) */}
                    <FeatureCard
                        className="md:col-span-2"
                        title="Formal Proof Kernel"
                        desc="Zero-margin-for-error verification logic built on Lean 4. The only insolvency tool that mathematically guarantees the correctness of the distribution waterfall."
                        icon={CheckCircle2}
                        highlight
                    />

                    {/* Feature 5: Excel */}
                    <FeatureCard
                        className="md:col-span-1"
                        title="Excel Integration"
                        desc="Native Add-in brings verified functions to your spreadsheet."
                        icon={Building2}
                    />
                    {/* Feature 6: API */}
                    <FeatureCard
                        className="md:col-span-2"
                        title="Developer API"
                        desc="Integrate verification into your existing case management software."
                        icon={Terminal}
                    />
                </div>
            </div>
        </section>
    );
}

function FeatureCard({ className, title, desc, icon: Icon, highlight }: any) {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            className={`glass-card p-8 flex flex-col justify-between ${className} ${highlight ? 'border-teal/50 bg-navy-800/80' : ''}`}
        >
            <div>
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-6 ${highlight ? 'bg-teal text-midnight' : 'bg-navy-700 text-teal'}`}>
                    <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">{title}</h3>
                <p className="text-slate-400 leading-relaxed text-sm">{desc}</p>
            </div>
        </motion.div>
    )
}

function LiveCounter({ end, duration }: { end: number, duration: number }) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let startTime: number;
        let animationFrame: number;

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;
            const percentage = Math.min(progress / (duration * 1000), 1);

            setCount(Math.floor(end * percentage));

            if (progress < duration * 1000) {
                animationFrame = requestAnimationFrame(animate);
            }
        };

        animationFrame = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationFrame);
    }, [end, duration]);

    return <span>{count.toLocaleString()}</span>;
}
