"use client";

import { motion } from "framer-motion";
import { Shield, Lock, FileCheck, ExternalLink } from "lucide-react";

interface CertificatePreviewProps {
    isActive?: boolean;
    fileName?: string;
}

/**
 * Certificate Preview Component
 * Shows a visual mockup of the court-ready Audit Certificate
 * Designed to look like a formal legal/financial document
 */
export default function CertificatePreview({ isActive = false, fileName }: CertificatePreviewProps) {
    const currentDate = new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });

    // Mock data for the certificate
    const mockData = {
        certId: "FB-2026-8891",
        inputHash: "7F3A9B2C4D5E6F1A8B9C0D1E2F3A4B5C6D7E8F9A0B1C2D3E4F5A6B7C8D9E0F1A",
        netProperty: 500000,
        date: "01 June 2021",
        isPost2020: true,
        result: 103000,
        verificationSteps: [
            "Net Property £500,000 > £10,000 Threshold.",
            "First Tranche: 50% of £10,000 = £5,000.",
            "Excess: £490,000. Second Tranche: 20% of Excess = £98,000.",
            "Total Calculated: £103,000.",
            "Cap Check: £103,000 < £800,000. No Cap Applied.",
        ]
    };

    return (
        <div className={`transition-all duration-500 ${isActive ? 'opacity-100' : 'opacity-60'}`}>
            {/* Document Container - Paper aesthetic */}
            <div className="bg-white text-slate-900 rounded-lg shadow-2xl overflow-hidden">

                {/* Header */}
                <div className="bg-slate-50 border-b border-slate-200 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Shield className="w-6 h-6 text-teal" />
                            <span className="font-bold text-slate-800">
                                Formal Bridge
                            </span>
                            <span className="text-slate-400 text-sm">|</span>
                            <span className="text-slate-600 text-sm">
                                Verified Computation Certificate
                            </span>
                        </div>
                        <div className="text-right text-xs text-slate-500">
                            <div>Date: {currentDate}</div>
                            <div>Cert ID: #{mockData.certId}</div>
                        </div>
                    </div>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6">

                    {/* Section 1: Input Integrity Anchor */}
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Lock className="w-4 h-4 text-slate-500" />
                            <h3 className="font-bold text-sm text-slate-800 uppercase tracking-wider">
                                1. Input Integrity Anchor
                            </h3>
                        </div>
                        <div className="bg-slate-100 rounded p-3">
                            <p className="text-xs text-slate-600 mb-1">Input Payload SHA-256 Hash:</p>
                            <code className="text-xs font-mono text-slate-700 break-all block">
                                {mockData.inputHash}
                            </code>
                        </div>
                        <p className="text-[10px] text-slate-500 mt-2 italic">
                            Certificate void if input data does not match this cryptographic signature.
                        </p>
                    </div>

                    {/* Section 2: Calculation Summary */}
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <FileCheck className="w-4 h-4 text-slate-500" />
                            <h3 className="font-bold text-sm text-slate-800 uppercase tracking-wider">
                                2. Calculation Summary (Prescribed Part s.176A)
                            </h3>
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                            <div className="flex justify-between py-2 border-b border-slate-100">
                                <span className="text-slate-600">Net Property (Floating Charge):</span>
                                <span className="font-medium">£{mockData.netProperty.toLocaleString()}.00</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-slate-100">
                                <span className="text-slate-600">Relevant Date:</span>
                                <span className="font-medium">{mockData.date}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-slate-100">
                                <span className="text-slate-600">Applicable Cap:</span>
                                <span className="font-medium">£800,000 (Post-2020)</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-slate-100">
                                <span className="text-slate-600">Prescribed Part Fund:</span>
                                <span className="font-bold text-teal">£{mockData.result.toLocaleString()}.00</span>
                            </div>
                        </div>
                    </div>

                    {/* Section 3: Formal Verification Trace */}
                    <div>
                        <h3 className="font-bold text-sm text-slate-800 uppercase tracking-wider mb-3">
                            3. Formal Verification Trace (Lean 4 Kernel)
                        </h3>
                        <div className="bg-slate-50 rounded p-3 font-mono text-xs space-y-1">
                            {mockData.verificationSteps.map((step, i) => (
                                <div key={i} className="text-slate-700">
                                    <span className="text-slate-400">[Step {i + 1}]</span> {step}
                                </div>
                            ))}
                            <div className="text-teal font-bold pt-2 border-t border-slate-200 mt-2">
                                [VERIFIED] Theorem insolvency_prescribed_part holds.
                            </div>
                        </div>
                    </div>

                    {/* Disclaimer Box */}
                    <div className="border border-slate-300 rounded p-4 bg-slate-50">
                        <p className="text-[10px] text-slate-600 leading-relaxed">
                            This certificate confirms mathematical consistency with the statutes cited
                            based strictly on the input values provided by the User. Formal Bridge
                            Limited does not provide legal advice. The Practitioner remains solely
                            responsible for the distribution of funds. Liability is limited as per
                            the Terms of Business.
                        </p>
                    </div>

                </div>

                {/* Footer */}
                <div className="bg-slate-50 border-t border-slate-200 px-6 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Shield className="w-3 h-3" />
                        <span>Lean 4 Verified</span>
                    </div>
                    <a
                        href="#"
                        className="flex items-center gap-1 text-xs text-teal hover:underline"
                    >
                        Download PDF <ExternalLink className="w-3 h-3" />
                    </a>
                </div>

            </div>

            {/* Label */}
            <p className="text-center text-xs text-slate-500 mt-4">
                Preview of your court-ready Verification Certificate
            </p>
        </div>
    );
}
