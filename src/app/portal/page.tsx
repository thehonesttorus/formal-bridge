"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import DataPlaneBackground from "@/components/ui/DataPlaneBackground";
import Link from "next/link";

const tools = [
    {
        id: 'airlock',
        title: 'S.176A Prescribed Part Audit',
        subtitle: 'Finance Act 2020 Compliance',
        description: 'Upload your creditor schedule. We calculate the correct Prescribed Part and generate a verified Audit Certificate for your compliance file.',
        status: 'available',
        href: '/portal/airlock',
        features: ['Crown Preference detection', 'Post-2020 statutory rules', 'Signed Audit Certificate'],
        pricing: '£50.00 | Category 1 Estate Expense (SIP 9 Compliant)',
        cta: 'Generate Audit Certificate — First 3 Free',
    },
    {
        id: 'full-waterfall',
        title: 'Full Distribution Waterfall',
        subtitle: 'Early Access Available',
        description: 'Complete distribution analysis across all 8 creditor tiers with pro-rata calculations, surplus allocation, and dust handling.',
        status: 'early-access',
        href: '/portal/early-access',
        features: ['All 8 creditor tiers', 'Pro-rata allocations', 'Full audit trail'],
    },
];

export default function PortalPage() {
    return (
        <main className="bg-midnight min-h-screen selection:bg-teal selection:text-midnight relative">
            <div className="fixed inset-0 z-0">
                <DataPlaneBackground />
            </div>

            <div className="relative z-10 text-white">
                <Navbar />

                <section className="pt-40 pb-20 px-6">
                    <div className="max-w-5xl mx-auto">

                        {/* Header */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="text-center mb-20"
                        >
                            <span className="text-teal font-mono tracking-widest text-sm font-medium">
                                STATUTORY AUDIT KERNEL
                            </span>
                            <h1 className="text-5xl md:text-6xl font-light text-white mt-6 leading-tight">
                                Select a<span className="font-medium"> verification module</span>
                            </h1>
                            <p className="text-lg text-slate-400 font-light mt-6 max-w-xl mx-auto">
                                Your data is processed locally and destroyed immediately after certification.
                                We retain nothing.
                            </p>
                        </motion.div>

                        {/* Tool Cards */}
                        <div className="space-y-6">
                            {tools.map((tool, i) => (
                                <motion.div
                                    key={tool.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 + (i * 0.1), duration: 0.6 }}
                                >
                                    {tool.status === 'available' ? (
                                        <Link href={tool.href} className="block group">
                                            <div className="border border-slate-800/50 hover:border-teal/50 transition-colors duration-300 p-8 md:p-10">
                                                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                                                    <div className="flex-1">
                                                        <span className="text-teal font-mono text-xs tracking-widest">
                                                            {tool.subtitle.toUpperCase()}
                                                        </span>
                                                        <h2 className="text-2xl md:text-3xl font-light text-white mt-3 group-hover:text-teal transition-colors duration-300">
                                                            {tool.title}
                                                        </h2>
                                                        <p className="text-slate-400 font-light mt-4 max-w-xl leading-relaxed">
                                                            {tool.description}
                                                        </p>

                                                        <div className="flex flex-wrap gap-x-6 gap-y-2 mt-6">
                                                            {tool.features.map((f, j) => (
                                                                <span key={j} className="text-sm text-slate-500 font-light">
                                                                    • {f}
                                                                </span>
                                                            ))}
                                                        </div>

                                                        {/* SIP 9 Compliant Pricing Badge */}
                                                        {tool.pricing && (
                                                            <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-amber-900/20 border border-amber-700/30 rounded">
                                                                <span className="text-amber-400 text-sm font-medium">
                                                                    {tool.pricing}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="flex flex-col items-end gap-3">
                                                        <div className="inline-flex items-center gap-2 px-6 py-3 bg-teal text-midnight font-medium group-hover:bg-white transition-colors">
                                                            {tool.cta || 'Launch'}
                                                            <ArrowRight className="w-4 h-4" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    ) : tool.status === 'early-access' ? (
                                        <Link href={tool.href} className="block group">
                                            <div className="border border-slate-800/50 hover:border-blue-500/50 transition-colors duration-300 p-8 md:p-10">
                                                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                                                    <div className="flex-1">
                                                        <span className="text-blue-400 font-mono text-xs tracking-widest">
                                                            {tool.subtitle.toUpperCase()}
                                                        </span>
                                                        <h2 className="text-2xl md:text-3xl font-light text-white mt-3 group-hover:text-blue-400 transition-colors duration-300">
                                                            {tool.title}
                                                        </h2>
                                                        <p className="text-slate-400 font-light mt-4 max-w-xl leading-relaxed">
                                                            {tool.description}
                                                        </p>
                                                        <div className="flex flex-wrap gap-x-6 gap-y-2 mt-6">
                                                            {tool.features.map((f, j) => (
                                                                <span key={j} className="text-sm text-slate-500 font-light">
                                                                    {f}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-blue-400 font-medium group-hover:gap-4 transition-all duration-300">
                                                        Request Early Access
                                                        <ArrowRight className="w-4 h-4" />
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    ) : (
                                        <div className="border border-slate-800/30 p-8 md:p-10 opacity-50">
                                            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                                                <div className="flex-1">
                                                    <span className="text-slate-600 font-mono text-xs tracking-widest">
                                                        {tool.subtitle.toUpperCase()}
                                                    </span>
                                                    <h2 className="text-2xl md:text-3xl font-light text-slate-500 mt-3">
                                                        {tool.title}
                                                    </h2>
                                                    <p className="text-slate-600 font-light mt-4 max-w-xl leading-relaxed">
                                                        {tool.description}
                                                    </p>
                                                </div>
                                                <span className="text-slate-600 text-sm">Coming soon</span>
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </div>

                        {/* Security Note */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="mt-20 pt-12 border-t border-slate-800/50"
                        >
                            <div className="max-w-xl mx-auto text-center">
                                <h3 className="text-xl font-light text-white mb-4">
                                    Zero-Retention Architecture
                                </h3>
                                <p className="text-slate-500 font-light text-sm leading-relaxed">
                                    Files are parsed client-side. A SHA-256 hash anchors the certificate to the original input.
                                    All data is purged immediately after processing. We retain nothing.
                                </p>
                            </div>
                        </motion.div>

                        {/* Pricing */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.7 }}
                            className="mt-12 text-center"
                        >
                            <p className="text-sm text-slate-600 font-light">
                                First 3 cases free &bull; £50 per certificate &bull; Category 1 Expense
                            </p>
                        </motion.div>

                    </div>
                </section>

                <Footer />
            </div>
        </main>
    );
}
