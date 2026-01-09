'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/browser';
import { useRouter } from 'next/navigation';
import type { User } from '@supabase/supabase-js';
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Shield, FileCheck, Clock, Hash, ExternalLink, Banknote, LogOut } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import DataPlaneBackground from "@/components/ui/DataPlaneBackground";
import type { CertificateRecord } from "@/lib/database.types";

function formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-GB', {
        style: 'currency',
        currency: 'GBP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);
}

export default function DashboardPage() {
    const router = useRouter();
    const supabase = createClient();
    const [user, setUser] = useState<User | null>(null);
    const [certificates, setCertificates] = useState<CertificateRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Get user and redirect if not authenticated
    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push('/login');
            } else {
                setUser(user);
            }
        };
        getUser();
    }, [supabase, router]);

    useEffect(() => {
        async function fetchCertificates() {
            try {
                const response = await fetch('/api/certificates');
                const data = await response.json();

                if (data.certificates) {
                    setCertificates(data.certificates);
                } else {
                    setError(data.error || 'Failed to load certificates');
                }
            } catch (err) {
                setError('Failed to connect to server');
            } finally {
                setLoading(false);
            }
        }

        fetchCertificates();
    }, []);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push('/');
    };

    const freeRemaining = Math.max(0, 3 - certificates.length);

    return (
        <main className="bg-midnight min-h-screen selection:bg-teal selection:text-midnight relative">
            <div className="fixed inset-0 z-0">
                <DataPlaneBackground />
            </div>

            <div className="relative z-10 text-white">
                <Navbar />

                <section className="pt-40 pb-20 px-6">
                    <div className="max-w-4xl mx-auto">

                        {/* Header */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-12"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <span className="text-teal font-mono tracking-widest text-sm font-medium block">
                                        DASHBOARD
                                    </span>
                                    <h1 className="text-4xl md:text-5xl font-light text-white mt-4 leading-tight">
                                        Your <span className="font-medium">Certificates</span>
                                    </h1>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-slate-400 text-sm font-light">
                                        {user?.email}
                                    </span>
                                    <button
                                        onClick={handleSignOut}
                                        className="p-2 border border-slate-700 text-slate-400 hover:border-red-500 hover:text-red-400 transition-colors"
                                        title="Sign out"
                                    >
                                        <LogOut className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            <p className="text-lg text-slate-400 font-light max-w-xl">
                                Access and re-download your Audit Certificates. Your certificate hashes are stored securely while creditor data is never retained.
                            </p>
                        </motion.div>

                        {/* Quick Actions */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="grid md:grid-cols-2 gap-6 mb-12"
                        >
                            <Link
                                href="/portal/airlock"
                                className="group border border-slate-800/50 p-8 hover:border-teal/50 transition-colors"
                            >
                                <div className="flex items-start justify-between">
                                    <div>
                                        <Shield className="w-8 h-8 text-teal mb-4" />
                                        <h3 className="text-xl font-light text-white mb-2">
                                            New Audit
                                        </h3>
                                        <p className="text-sm text-slate-400 font-light">
                                            Upload a creditor schedule and generate a new Audit Certificate
                                        </p>
                                    </div>
                                    <ArrowRight className="w-5 h-5 text-slate-600 group-hover:text-teal transition-colors" />
                                </div>
                            </Link>

                            <Link
                                href="/portal"
                                className="group border border-slate-800/50 p-8 hover:border-teal/50 transition-colors"
                            >
                                <div className="flex items-start justify-between">
                                    <div>
                                        <FileCheck className="w-8 h-8 text-slate-400 mb-4" />
                                        <h3 className="text-xl font-light text-white mb-2">
                                            All Tools
                                        </h3>
                                        <p className="text-sm text-slate-400 font-light">
                                            Access the full Audit Portal with all verification tools
                                        </p>
                                    </div>
                                    <ArrowRight className="w-5 h-5 text-slate-600 group-hover:text-teal transition-colors" />
                                </div>
                            </Link>
                        </motion.div>

                        {/* Certificates List */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <h2 className="text-xl font-light text-white mb-6">
                                Certificate History
                            </h2>

                            {loading ? (
                                <div className="border border-slate-800/50 p-12 text-center">
                                    <div className="w-8 h-8 border-2 border-teal border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                                    <p className="text-slate-400 font-light">Loading certificates...</p>
                                </div>
                            ) : error ? (
                                <div className="border border-red-500/30 p-12 text-center">
                                    <p className="text-red-400 font-light">{error}</p>
                                </div>
                            ) : certificates.length === 0 ? (
                                <div className="border border-slate-800/50 p-12 text-center">
                                    <FileCheck className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                                    <h3 className="text-lg font-light text-slate-400 mb-2">
                                        No certificates yet
                                    </h3>
                                    <p className="text-sm text-slate-600 font-light mb-6">
                                        Your Audit Certificates will appear here after you generate them.
                                    </p>
                                    <Link
                                        href="/portal/airlock"
                                        className="inline-flex items-center gap-2 px-6 py-3 bg-teal text-midnight font-medium hover:bg-white transition-colors"
                                    >
                                        Generate First Certificate
                                        <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {certificates.map((cert) => (
                                        <div
                                            key={cert.id}
                                            className="border border-slate-800/50 p-6 hover:border-slate-700 transition-colors"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <div className="flex items-center gap-3">
                                                        <h3 className="text-lg font-light text-white">
                                                            {cert.case_reference || `Certificate ${cert.verification_code}`}
                                                        </h3>
                                                        <span className="text-teal font-mono text-xs">
                                                            {cert.verification_code}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                                                        <span className="flex items-center gap-1">
                                                            <Clock className="w-3 h-3" />
                                                            {new Date(cert.created_at).toLocaleDateString('en-GB')}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <Banknote className="w-3 h-3" />
                                                            {cert.is_de_minimis_applied ? 'Waived' : formatCurrency(cert.prescribed_part)}
                                                        </span>
                                                        <span className="flex items-center gap-1 font-mono">
                                                            <Hash className="w-3 h-3" />
                                                            {cert.input_file_hash.slice(0, 12)}...
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <Link
                                                        href={`/verify/${cert.verification_code}`}
                                                        className="p-2 border border-slate-700 text-slate-400 hover:border-teal hover:text-teal transition-colors"
                                                        title="View Certificate"
                                                    >
                                                        <ExternalLink className="w-4 h-4" />
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </motion.div>

                        {/* Usage Stats */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="mt-12 pt-8 border-t border-slate-800/50"
                        >
                            <div className="grid grid-cols-3 gap-8 text-center">
                                <div>
                                    <p className="text-2xl font-light text-white">{certificates.length}</p>
                                    <p className="text-xs text-slate-500 mt-1">Certificates</p>
                                </div>
                                <div>
                                    <p className="text-2xl font-light text-teal">{freeRemaining}</p>
                                    <p className="text-xs text-slate-500 mt-1">Free Remaining</p>
                                </div>
                                <div>
                                    <p className="text-2xl font-light text-white">£50</p>
                                    <p className="text-xs text-slate-500 mt-1">Per Certificate</p>
                                </div>
                            </div>
                        </motion.div>

                    </div>
                </section>

                <Footer />
            </div>
        </main>
    );
}
