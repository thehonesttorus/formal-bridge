"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, Shield, AlertTriangle } from "lucide-react";

export default function Trust() {
    const ref = useRef<HTMLElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <section ref={ref} className="py-20 border-t border-slate-800/50">
            <div className="max-w-6xl mx-auto px-8">

                {/* Compliance Badges */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8 }}
                    className="flex flex-wrap justify-center gap-12 mb-24"
                >
                    {["Insolvency Act 1986", "IR 2016", "Finance Act 2020", "Lean 4 Verified"].map((item, i) => (
                        <motion.span
                            key={item}
                            initial={{ opacity: 0 }}
                            animate={isInView ? { opacity: 1 } : {}}
                            transition={{ delay: i * 0.1 }}
                            className="text-sm text-slate-600 font-light tracking-wide"
                        >
                            {item}
                        </motion.span>
                    ))}
                </motion.div>

                {/* CTA Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="max-w-3xl mx-auto text-center"
                >
                    <h2 className="text-4xl md:text-5xl font-light text-white leading-tight mb-6">
                        Ready to verify
                        <span className="block font-medium">your next distribution?</span>
                    </h2>

                    <p className="text-lg text-slate-400 font-light mb-10 max-w-xl mx-auto">
                        Upload your data to our secure portal. Receive a court-ready
                        Computational Audit Certificate within minutes.
                    </p>

                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <a
                            href="/portal"
                            className="group inline-flex items-center justify-center gap-3 px-10 py-5 bg-teal text-midnight font-medium hover:bg-white transition-colors duration-300"
                        >
                            <Shield className="w-5 h-5" />
                            Access Secure Portal
                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </a>
                        <a
                            href="mailto:contact@formalbridge.com"
                            className="inline-flex items-center justify-center gap-3 px-10 py-5 border border-slate-700 text-white font-medium hover:border-slate-500 transition-colors duration-300"
                        >
                            Contact Us
                        </a>
                    </div>

                    <p className="text-sm text-slate-500 mt-6">
                        First 3 audits free &bull; £50 per certificate &bull; Category 1 Expense
                    </p>
                </motion.div>

                {/* Legal Disclaimer - Liability Protection */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ delay: 0.6 }}
                    className="mt-20 pt-8 border-t border-slate-800/50"
                >
                    <div className="max-w-3xl mx-auto">
                        <div className="flex items-start gap-3 text-slate-600 text-xs leading-relaxed">
                            <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <p>
                                <span className="font-medium text-slate-500">Important:</span>{" "}
                                Formal Bridge verifies the mathematical application of statutory rules
                                to the data provided. We do not provide legal advice.
                                The Practitioner remains solely responsible for the validity of
                                claims, creditor classifications, and distribution decisions.
                                Liability is limited to £50.00 per certificate as per our Terms of Business.
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Bottom contact line */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ delay: 0.7 }}
                    className="mt-8 text-center"
                >
                    <p className="text-sm text-slate-600 font-light">
                        Enterprise enquiries: <a href="mailto:enterprise@formalbridge.com" className="text-slate-400 hover:text-white transition-colors">enterprise@formalbridge.com</a>
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
