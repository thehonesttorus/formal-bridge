'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Shield } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import DataPlaneBackground from '@/components/ui/DataPlaneBackground';

export default function TermsOfBusinessPage() {
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
                                <Shield className="w-8 h-8 text-teal" />
                                <h1 className="text-3xl font-light text-white">
                                    Terms of Business
                                </h1>
                            </div>

                            <p className="text-slate-400 text-sm mb-8">
                                Last updated: January 2026
                            </p>

                            <div className="prose prose-invert prose-slate max-w-none space-y-8">

                                {/* Critical Distinction */}
                                <section className="border border-teal/30 p-6 bg-teal/5">
                                    <h2 className="text-xl font-medium text-teal mt-0 mb-4">
                                        Important: Computation vs. Advice
                                    </h2>
                                    <p className="text-slate-300 leading-relaxed m-0">
                                        Formal Bridge provides <strong className="text-white">mathematical computation services</strong>,
                                        not legal, financial, or insolvency advice. Our platform applies the statutory
                                        formulae set out in the Insolvency Act 1986 and related legislation to the
                                        input data you provide. <strong className="text-white">We do not verify the accuracy
                                            of your inputs</strong>—you attest to that. We verify only that the computation
                                        is mathematically correct.
                                    </p>
                                </section>

                                {/* Service Description */}
                                <section>
                                    <h2 className="text-xl font-medium text-white mb-4">1. Service Description</h2>
                                    <p className="text-slate-400 leading-relaxed">
                                        Formal Bridge operates a formally verified computational engine built on the
                                        Lean 4 theorem prover. Our services include:
                                    </p>
                                    <ul className="text-slate-400 space-y-2 mt-4">
                                        <li>Prescribed Part calculations under Section 176A of the Insolvency Act 1986</li>
                                        <li>Creditor classification analysis against statutory tiers</li>
                                        <li>Generation of Audit Certificates documenting computational correctness</li>
                                        <li>Verification of calculations against formally proven algorithms</li>
                                    </ul>
                                </section>

                                {/* Your Responsibilities */}
                                <section>
                                    <h2 className="text-xl font-medium text-white mb-4">2. Your Responsibilities</h2>
                                    <p className="text-slate-400 leading-relaxed">
                                        As a user of Formal Bridge, you (the Insolvency Practitioner or authorised
                                        representative) are solely responsible for:
                                    </p>
                                    <ul className="text-slate-400 space-y-2 mt-4">
                                        <li><strong className="text-white">Input Accuracy:</strong> All data entered into our platform, including creditor amounts, classifications, dates, and asset figures</li>
                                        <li><strong className="text-white">Professional Judgement:</strong> All decisions regarding creditor priority, disputed claims, and case management</li>
                                        <li><strong className="text-white">Regulatory Compliance:</strong> Ensuring your use of our calculations complies with SIP requirements and regulatory standards</li>
                                        <li><strong className="text-white">Attestation:</strong> The accuracy statement you provide when generating an Audit Certificate</li>
                                    </ul>
                                </section>

                                {/* Limitation of Liability */}
                                <section className="border border-slate-700 p-6">
                                    <h2 className="text-xl font-medium text-white mb-4">3. Limitation of Liability</h2>
                                    <p className="text-slate-400 leading-relaxed mb-4">
                                        <strong className="text-white">Formal Bridge's liability is limited to the mathematical
                                            correctness of the computation performed.</strong> We warrant that:
                                    </p>
                                    <ul className="text-slate-400 space-y-2">
                                        <li>Our calculations correctly implement the statutory formulae</li>
                                        <li>Our Lean 4 proofs mathematically verify algorithmic correctness</li>
                                        <li>The Audit Certificate accurately reflects the computation performed</li>
                                    </ul>
                                    <p className="text-slate-400 leading-relaxed mt-4">
                                        We are <strong className="text-white">not liable</strong> for:
                                    </p>
                                    <ul className="text-slate-400 space-y-2 mt-2">
                                        <li>Errors in the input data you provide</li>
                                        <li>Misclassification of creditors based on your professional judgement</li>
                                        <li>Losses arising from reliance on calculations based on incorrect inputs</li>
                                        <li>Any indirect, consequential, or punitive damages</li>
                                    </ul>
                                </section>

                                {/* Pricing */}
                                <section>
                                    <h2 className="text-xl font-medium text-white mb-4">4. Pricing & Payment</h2>
                                    <p className="text-slate-400 leading-relaxed">
                                        Audit Certificates are priced at <strong className="text-white">£50 per certificate</strong>.
                                        This fee is classified as a <strong className="text-white">Category 1 Expense</strong> under
                                        SIP 9, being a disbursement directly referable to the case and properly billable
                                        to the insolvent estate.
                                    </p>
                                    <p className="text-slate-400 leading-relaxed mt-4">
                                        Payment is processed via Stripe. You will receive a VAT invoice for each transaction.
                                    </p>
                                </section>

                                {/* Data Protection */}
                                <section>
                                    <h2 className="text-xl font-medium text-white mb-4">5. Data & Privacy</h2>
                                    <p className="text-slate-400 leading-relaxed">
                                        Formal Bridge operates on a <strong className="text-white">Zero-Retention Architecture</strong>:
                                    </p>
                                    <ul className="text-slate-400 space-y-2 mt-4">
                                        <li>Creditor data is processed in your browser and is <strong className="text-white">never transmitted to or stored on our servers</strong></li>
                                        <li>We store only certificate metadata (hashes, dates, calculation results) for verification purposes</li>
                                        <li>Your email address is stored for authentication only</li>
                                        <li>See our <Link href="/privacy" className="text-teal hover:text-white">Privacy Policy</Link> for full details</li>
                                    </ul>
                                </section>

                                {/* Intellectual Property */}
                                <section>
                                    <h2 className="text-xl font-medium text-white mb-4">6. Intellectual Property</h2>
                                    <p className="text-slate-400 leading-relaxed">
                                        The Formal Bridge platform, including the Lean 4 InsolvencyLib kernel, algorithms,
                                        user interface, and documentation, is protected by copyright and other intellectual
                                        property rights. You may not reverse engineer, decompile, or extract our algorithms.
                                    </p>
                                </section>

                                {/* Governing Law */}
                                <section>
                                    <h2 className="text-xl font-medium text-white mb-4">7. Governing Law</h2>
                                    <p className="text-slate-400 leading-relaxed">
                                        These terms are governed by the laws of England and Wales. Any disputes shall
                                        be subject to the exclusive jurisdiction of the English courts.
                                    </p>
                                </section>

                                {/* Contact */}
                                <section className="pt-6 border-t border-slate-800">
                                    <h2 className="text-xl font-medium text-white mb-4">Contact</h2>
                                    <p className="text-slate-400 leading-relaxed">
                                        For questions about these terms, contact us at{' '}
                                        <a href="mailto:legal@formalbridge.com" className="text-teal hover:text-white">
                                            legal@formalbridge.com
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
