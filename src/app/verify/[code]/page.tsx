'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Shield, CheckCircle, XCircle, Calendar, Hash, Users, Banknote } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import DataPlaneBackground from '@/components/ui/DataPlaneBackground';

interface VerifiedCertificate {
    createdAt: string;
    ipName: string;
    attestedBy?: string;
    inputFileHash: string;
    creditorCount: number;
    netFloatingChargeProperty: number;
    floatingChargeDate: string;
    prescribedPart: number;
    capApplied: number;
    isDeMinimisApplied: boolean;
    isNilDistribution: boolean;
    verificationCode: string;
    kernelVersion: string;
}

function formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-GB', {
        style: 'currency',
        currency: 'GBP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);
}

export default function VerifyPage() {
    const params = useParams();
    const code = params.code as string;

    const [loading, setLoading] = useState(true);
    const [valid, setValid] = useState(false);
    const [certificate, setCertificate] = useState<VerifiedCertificate | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function verifyCertificate() {
            if (!code) return;

            try {
                const response = await fetch(`/api/certificates/verify/${code}`);
                const data = await response.json();

                if (data.valid) {
                    setValid(true);
                    setCertificate(data.certificate);
                } else {
                    setValid(false);
                    setError(data.error || 'Certificate not found');
                }
            } catch (err) {
                setValid(false);
                setError('Failed to verify certificate');
            } finally {
                setLoading(false);
            }
        }

        verifyCertificate();
    }, [code]);

    return (
        <main className="bg-midnight min-h-screen selection:bg-teal selection:text-midnight relative">
            <div className="fixed inset-0 z-0">
                <DataPlaneBackground />
            </div>

            <div className="relative z-10 text-white">
                <Navbar />

                <section className="pt-40 pb-20 px-6">
                    <div className="max-w-2xl mx-auto">

                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 text-slate-500 hover:text-white transition-colors mb-8 text-sm font-light"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Home
                        </Link>

                        {loading ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center py-20"
                            >
                                <div className="w-8 h-8 border-2 border-teal border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                                <p className="text-slate-400 font-light">Verifying certificate...</p>
                            </motion.div>
                        ) : valid && certificate ? (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <div className="border border-teal/30 p-8 mb-8">
                                    <div className="flex items-center gap-3 mb-6">
                                        <CheckCircle className="w-8 h-8 text-teal" />
                                        <div>
                                            <span className="text-teal font-mono text-xs tracking-widest block">
                                                VERIFIED
                                            </span>
                                            <h1 className="text-2xl font-light text-white">
                                                Audit Certificate Valid
                                            </h1>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3 text-sm">
                                            <Hash className="w-4 h-4 text-slate-500" />
                                            <span className="text-slate-400">Verification Code:</span>
                                            <span className="font-mono text-teal">{certificate.verificationCode}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm">
                                            <Calendar className="w-4 h-4 text-slate-500" />
                                            <span className="text-slate-400">Issued:</span>
                                            <span className="text-white">{new Date(certificate.createdAt).toLocaleDateString('en-GB', {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric'
                                            })}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm">
                                            <Shield className="w-4 h-4 text-slate-500" />
                                            <span className="text-slate-400">Attested by:</span>
                                            <span className="text-white">
                                                {certificate.attestedBy ? `${certificate.attestedBy} (on behalf of ${certificate.ipName})` : certificate.ipName}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm">
                                            <Users className="w-4 h-4 text-slate-500" />
                                            <span className="text-slate-400">Creditors Analyzed:</span>
                                            <span className="text-white">{certificate.creditorCount}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="border border-slate-800/50 p-6">
                                    <h3 className="text-sm text-slate-400 font-medium mb-4">Calculation Summary</h3>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <p className="text-slate-500">Net Floating Charge Property</p>
                                            <p className="text-white font-medium">{formatCurrency(certificate.netFloatingChargeProperty)}</p>
                                        </div>
                                        <div>
                                            <p className="text-slate-500">Prescribed Part</p>
                                            <p className="text-teal font-medium">
                                                {certificate.isDeMinimisApplied ? 'Waived' : formatCurrency(certificate.prescribedPart)}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-slate-500">Floating Charge Date</p>
                                            <p className="text-white">{new Date(certificate.floatingChargeDate).toLocaleDateString('en-GB')}</p>
                                        </div>
                                        <div>
                                            <p className="text-slate-500">Cap Applied</p>
                                            <p className="text-white">{formatCurrency(certificate.capApplied)}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 pt-6 border-t border-slate-800/50">
                                    <p className="text-xs text-slate-600">
                                        <span className="text-slate-500">Input File Hash:</span>{' '}
                                        <span className="font-mono">{certificate.inputFileHash}</span>
                                    </p>
                                    <p className="text-xs text-slate-600 mt-2">
                                        <span className="text-slate-500">Kernel:</span>{' '}
                                        <span className="font-mono">{certificate.kernelVersion}</span>
                                    </p>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-center py-20 border border-red-500/30"
                            >
                                <XCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                                <h1 className="text-2xl font-light text-white mb-2">
                                    Certificate Not Found
                                </h1>
                                <p className="text-slate-400 font-light mb-6">
                                    {error || 'The verification code is invalid or the certificate does not exist.'}
                                </p>
                                <Link
                                    href="/"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-slate-800 text-white hover:bg-slate-700 transition-colors"
                                >
                                    Return to Home
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
