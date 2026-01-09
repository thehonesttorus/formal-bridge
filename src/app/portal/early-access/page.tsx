'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import DataPlaneBackground from '@/components/ui/DataPlaneBackground';
import Link from 'next/link';

interface WaitlistForm {
    name: string;
    email: string;
    firmName: string;
    casesPerMonth: string;
    currentSystem: string;
    notes: string;
}

export default function EarlyAccessPage() {
    const [form, setForm] = useState<WaitlistForm>({
        name: '',
        email: '',
        firmName: '',
        casesPerMonth: '',
        currentSystem: '',
        notes: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            const response = await fetch('/api/waitlist', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...form,
                    product: 'full_waterfall',
                }),
            });

            if (!response.ok) throw new Error('Failed to join waitlist');
            setIsSubmitted(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="bg-midnight min-h-screen selection:bg-teal selection:text-midnight relative">
            <div className="fixed inset-0 z-0">
                <DataPlaneBackground />
            </div>

            <div className="relative z-10 text-white">
                <Navbar />

                <section className="pt-40 pb-20 px-6">
                    <div className="max-w-2xl mx-auto">

                        {/* Header */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-12"
                        >
                            <Link
                                href="/portal"
                                className="inline-flex items-center gap-2 text-slate-500 hover:text-white transition-colors mb-10 text-sm font-light"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Back to Portal
                            </Link>

                            <span className="text-blue-400 font-mono tracking-widest text-sm font-medium block">
                                EARLY ACCESS
                            </span>
                            <h1 className="text-4xl md:text-5xl font-light text-white mt-4 leading-tight">
                                Full Distribution<span className="font-medium"> Waterfall</span>
                            </h1>
                            <p className="text-lg text-slate-400 font-light mt-4 max-w-xl">
                                Complete distribution analysis across all 8 creditor tiers with pro-rata calculations, surplus allocation, and verified audit trail.
                            </p>
                        </motion.div>

                        {!isSubmitted ? (
                            <motion.form
                                onSubmit={handleSubmit}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="space-y-6"
                            >
                                <div className="border border-slate-800/50 p-8">
                                    <h2 className="text-xl font-light text-white mb-6">
                                        Request Early Access
                                    </h2>

                                    <div className="space-y-5">
                                        <div className="grid md:grid-cols-2 gap-5">
                                            <div>
                                                <label className="block text-sm text-slate-400 font-light mb-2">
                                                    Your Name *
                                                </label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={form.name}
                                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-800 text-white font-light focus:border-blue-500/50 focus:outline-none transition-colors"
                                                    placeholder="John Smith"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm text-slate-400 font-light mb-2">
                                                    Email Address *
                                                </label>
                                                <input
                                                    type="email"
                                                    required
                                                    value={form.email}
                                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-800 text-white font-light focus:border-blue-500/50 focus:outline-none transition-colors"
                                                    placeholder="john@example.com"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-5">
                                            <div>
                                                <label className="block text-sm text-slate-400 font-light mb-2">
                                                    Firm Name
                                                </label>
                                                <input
                                                    type="text"
                                                    value={form.firmName}
                                                    onChange={(e) => setForm({ ...form, firmName: e.target.value })}
                                                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-800 text-white font-light focus:border-blue-500/50 focus:outline-none transition-colors"
                                                    placeholder="Smith & Partners LLP"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm text-slate-400 font-light mb-2">
                                                    Cases Per Month
                                                </label>
                                                <select
                                                    value={form.casesPerMonth}
                                                    onChange={(e) => setForm({ ...form, casesPerMonth: e.target.value })}
                                                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-800 text-white font-light focus:border-blue-500/50 focus:outline-none transition-colors"
                                                >
                                                    <option value="">Select...</option>
                                                    <option value="1-5">1–5 cases</option>
                                                    <option value="5-10">5–10 cases</option>
                                                    <option value="10-20">10–20 cases</option>
                                                    <option value="20+">20+ cases</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm text-slate-400 font-light mb-2">
                                                Current Distribution System
                                            </label>
                                            <select
                                                value={form.currentSystem}
                                                onChange={(e) => setForm({ ...form, currentSystem: e.target.value })}
                                                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-800 text-white font-light focus:border-blue-500/50 focus:outline-none transition-colors"
                                            >
                                                <option value="">Select...</option>
                                                <option value="excel">Excel / Spreadsheets</option>
                                                <option value="ips">IPS (Insolvency Practitioner Services)</option>
                                                <option value="turnkey">Turnkey</option>
                                                <option value="aries">Aries</option>
                                                <option value="other">Other / In-house</option>
                                            </select>
                                            <p className="text-xs text-slate-600 font-light mt-1">
                                                This helps us understand your workflow
                                            </p>
                                        </div>

                                        <div>
                                            <label className="block text-sm text-slate-400 font-light mb-2">
                                                Case Complexity
                                            </label>
                                            <textarea
                                                value={form.notes}
                                                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                                                rows={4}
                                                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-800 text-white font-light focus:border-blue-500/50 focus:outline-none transition-colors resize-none"
                                                placeholder="Number of creditors, BVI/offshore requirements, complex pro-rata scenarios..."
                                            />
                                        </div>
                                    </div>

                                    {error && (
                                        <div className="mt-4 p-3 border border-red-500/30 text-red-400 text-sm font-light">
                                            {error}
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="mt-8 w-full inline-flex items-center justify-center gap-3 px-8 py-4 bg-blue-500 text-white font-medium hover:bg-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        {isSubmitting ? 'Submitting...' : 'Request Early Access'}
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                </div>

                                <p className="text-center text-sm text-slate-600 font-light">
                                    We&apos;ll notify you when the Full Waterfall tool is ready for your firm.
                                </p>
                            </motion.form>
                        ) : (
                            /* Success State with Manual Audit Hook */
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="border border-slate-800/50 p-12 text-center"
                            >
                                <CheckCircle className="w-16 h-16 text-blue-400 mx-auto mb-6" />
                                <h2 className="text-2xl font-light text-white mb-4">
                                    You&apos;re on the list!
                                </h2>
                                <p className="text-slate-400 font-light mb-8 max-w-md mx-auto leading-relaxed">
                                    We&apos;ll be in touch when the Full Distribution Waterfall is ready.
                                </p>

                                {/* Manual Audit Hook per Expert */}
                                <div className="border-t border-slate-800/50 pt-8 mt-8">
                                    <div className="bg-slate-900/50 p-6 text-left">
                                        <h3 className="text-lg font-medium text-white mb-3">
                                            Need a distribution verified now?
                                        </h3>
                                        <p className="text-slate-400 font-light text-sm leading-relaxed mb-4">
                                            While the automated Full Waterfall is in Early Access, our team is currently performing
                                            <span className="text-white"> Manual Verified Distributions</span> for high-complexity cases.
                                        </p>
                                        <p className="text-slate-500 font-light text-sm">
                                            If you have a distribution pending with &gt;50 creditors or complex pro-rata requirements,
                                            reply to your confirmation email for a custom quote.
                                        </p>
                                    </div>
                                </div>

                                <Link
                                    href="/portal"
                                    className="inline-flex items-center gap-2 mt-8 text-blue-400 hover:text-blue-300 transition-colors font-light"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    Back to Portal
                                </Link>
                            </motion.div>
                        )}

                    </div>
                </section>

                <Footer />
            </div>
        </main>
    );
}
