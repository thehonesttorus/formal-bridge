'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Shield, Lock } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import DataPlaneBackground from '@/components/ui/DataPlaneBackground';

export default function PrivacyPolicyPage() {
    return (
        <main className="bg-midnight min-h-screen selection:bg-teal selection:text-midnight relative">
            <div className="fixed inset-0 z-0">
                <DataPlaneBackground />
            </div>

            <div className="relative z-10 text-white">
                <Navbar />

                <section className="pt-40 pb-20 px-6">
                    <div className="max-w-3xl mx-auto">

                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 text-slate-500 hover:text-white transition-colors mb-8 text-sm font-light"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Home
                        </Link>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <Lock className="w-8 h-8 text-teal" />
                                <h1 className="text-3xl font-light text-white">
                                    Privacy Policy
                                </h1>
                            </div>

                            <p className="text-slate-400 text-sm mb-8">
                                Last updated: January 2026
                            </p>

                            <div className="prose prose-invert prose-slate max-w-none space-y-8">

                                {/* Zero-Retention Highlight */}
                                <section className="border border-teal/30 p-6 bg-teal/5">
                                    <h2 className="text-xl font-medium text-teal mt-0 mb-4">
                                        Zero-Retention Architecture
                                    </h2>
                                    <p className="text-slate-300 leading-relaxed m-0">
                                        Formal Bridge is built on a <strong className="text-white">Zero-Retention Architecture</strong>.
                                        Creditor data uploaded to our platform is processed entirely in your browser.
                                        <strong className="text-white"> It is never transmitted to or stored on our servers.</strong>
                                        {' '}We store only the minimum metadata required for certificate verification.
                                    </p>
                                </section>

                                {/* Data Controller */}
                                <section>
                                    <h2 className="text-xl font-medium text-white mb-4">1. Data Controller</h2>
                                    <p className="text-slate-400 leading-relaxed">
                                        Formal Bridge Ltd. is the data controller for personal data processed through
                                        this platform. We are registered in England and Wales.
                                    </p>
                                    <p className="text-slate-400 leading-relaxed mt-2">
                                        Contact: <a href="mailto:privacy@formalbridge.com" className="text-teal hover:text-white">privacy@formalbridge.com</a>
                                    </p>
                                </section>

                                {/* What We Collect */}
                                <section>
                                    <h2 className="text-xl font-medium text-white mb-4">2. Data We Collect</h2>

                                    <h3 className="text-lg font-medium text-slate-300 mt-6 mb-3">Data We Store</h3>
                                    <ul className="text-slate-400 space-y-2">
                                        <li><strong className="text-white">Account Data:</strong> Email address (for authentication via Clerk)</li>
                                        <li><strong className="text-white">Certificate Metadata:</strong> Verification codes, calculation results, dates, IP names, input file hashes</li>
                                        <li><strong className="text-white">Usage Data:</strong> Page views, feature usage (anonymised)</li>
                                    </ul>

                                    <h3 className="text-lg font-medium text-slate-300 mt-6 mb-3">Data We Do NOT Store</h3>
                                    <ul className="text-slate-400 space-y-2">
                                        <li><strong className="text-white">Creditor Data:</strong> Names, addresses, claim amounts, classifications</li>
                                        <li><strong className="text-white">Uploaded Files:</strong> Excel spreadsheets, CSV files</li>
                                        <li><strong className="text-white">Case Details:</strong> Company names, case numbers, estate details</li>
                                    </ul>
                                    <p className="text-slate-500 text-sm mt-4 italic">
                                        All creditor data is processed client-side and destroyed immediately after certificate generation.
                                    </p>
                                </section>

                                {/* How We Use Data */}
                                <section>
                                    <h2 className="text-xl font-medium text-white mb-4">3. How We Use Your Data</h2>
                                    <ul className="text-slate-400 space-y-2">
                                        <li><strong className="text-white">Authentication:</strong> To verify your identity and protect your account</li>
                                        <li><strong className="text-white">Certificate Verification:</strong> To allow third parties to verify certificate authenticity</li>
                                        <li><strong className="text-white">Service Improvement:</strong> Anonymised usage analytics</li>
                                        <li><strong className="text-white">Communication:</strong> Service updates and important notices (you can opt out)</li>
                                    </ul>
                                </section>

                                {/* Third Parties */}
                                <section>
                                    <h2 className="text-xl font-medium text-white mb-4">4. Third-Party Services</h2>
                                    <p className="text-slate-400 leading-relaxed mb-4">
                                        We use the following third-party services:
                                    </p>
                                    <ul className="text-slate-400 space-y-2">
                                        <li><strong className="text-white">Clerk:</strong> Authentication (processes email, stores account data)</li>
                                        <li><strong className="text-white">Supabase:</strong> Database hosting (stores certificate metadata)</li>
                                        <li><strong className="text-white">Stripe:</strong> Payment processing (when payments are enabled)</li>
                                        <li><strong className="text-white">Vercel:</strong> Website hosting</li>
                                    </ul>
                                    <p className="text-slate-400 leading-relaxed mt-4">
                                        Each provider has their own privacy policy and complies with GDPR requirements.
                                    </p>
                                </section>

                                {/* Data Retention */}
                                <section>
                                    <h2 className="text-xl font-medium text-white mb-4">5. Data Retention</h2>
                                    <ul className="text-slate-400 space-y-2">
                                        <li><strong className="text-white">Account Data:</strong> Retained while your account is active</li>
                                        <li><strong className="text-white">Certificate Metadata:</strong> Retained for 7 years (regulatory compliance period for insolvency records)</li>
                                        <li><strong className="text-white">Creditor Data:</strong> Not retained (processed client-side only)</li>
                                    </ul>
                                </section>

                                {/* Your Rights */}
                                <section>
                                    <h2 className="text-xl font-medium text-white mb-4">6. Your Rights (GDPR)</h2>
                                    <p className="text-slate-400 leading-relaxed mb-4">
                                        Under the UK GDPR, you have the right to:
                                    </p>
                                    <ul className="text-slate-400 space-y-2">
                                        <li>Access your personal data</li>
                                        <li>Rectify inaccurate data</li>
                                        <li>Erase your data ("right to be forgotten")</li>
                                        <li>Restrict processing</li>
                                        <li>Data portability</li>
                                        <li>Object to processing</li>
                                    </ul>
                                    <p className="text-slate-400 leading-relaxed mt-4">
                                        To exercise these rights, contact{' '}
                                        <a href="mailto:privacy@formalbridge.com" className="text-teal hover:text-white">
                                            privacy@formalbridge.com
                                        </a>
                                    </p>
                                </section>

                                {/* Cookies */}
                                <section>
                                    <h2 className="text-xl font-medium text-white mb-4">7. Cookies</h2>
                                    <p className="text-slate-400 leading-relaxed">
                                        We use only essential cookies required for authentication and platform
                                        functionality. We do not use advertising or tracking cookies.
                                    </p>
                                </section>

                                {/* Security */}
                                <section>
                                    <h2 className="text-xl font-medium text-white mb-4">8. Security</h2>
                                    <p className="text-slate-400 leading-relaxed">
                                        We implement appropriate technical and organisational measures to protect
                                        your data, including encryption in transit (TLS), secure authentication,
                                        and regular security reviews.
                                    </p>
                                </section>

                                {/* Contact */}
                                <section className="pt-6 border-t border-slate-800">
                                    <h2 className="text-xl font-medium text-white mb-4">Contact</h2>
                                    <p className="text-slate-400 leading-relaxed">
                                        For privacy enquiries, contact us at{' '}
                                        <a href="mailto:privacy@formalbridge.com" className="text-teal hover:text-white">
                                            privacy@formalbridge.com
                                        </a>
                                    </p>
                                </section>

                            </div>
                        </motion.div>

                    </div>
                </section>

                <Footer />
            </div>
        </main>
    );
}
