'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Shield, AlertTriangle } from 'lucide-react';

interface AttestationStepProps {
    ipName: string;
    onIpNameChange: (name: string) => void;
    onComplete: (attestedBy?: string) => void;
    onBack: () => void;
    isProcessing?: boolean;
}

export function AttestationStep({
    ipName,
    onIpNameChange,
    onComplete,
    onBack,
    isProcessing
}: AttestationStepProps) {
    const [attested, setAttested] = useState(false);
    const [userName, setUserName] = useState('');
    const [isOnBehalf, setIsOnBehalf] = useState(false);

    const isValid = attested && ipName.trim().length > 0 && (!isOnBehalf || userName.trim().length > 0);

    return (
        <div className="border border-slate-800/50 p-8">
            <div className="mb-8">
                <span className="text-teal font-mono text-xs tracking-widest">SEAL AUDIT CERTIFICATE</span>
                <h2 className="text-2xl font-light text-white mt-2">
                    Confirm Data Accuracy
                </h2>
                <p className="text-slate-400 font-light mt-2">
                    Before sealing the Audit Certificate, please confirm the accuracy of the inputs provided.
                </p>
            </div>

            <div className="space-y-6">
                {/* IP Name Input */}
                <div>
                    <label className="block text-sm text-slate-400 font-light mb-3">
                        Appointed Insolvency Practitioner
                    </label>
                    <input
                        type="text"
                        value={ipName}
                        onChange={(e) => onIpNameChange(e.target.value)}
                        placeholder="John Smith"
                        className="w-full px-4 py-4 bg-transparent border border-slate-700 text-white placeholder-slate-600 focus:border-teal focus:outline-none transition-colors"
                    />
                </div>

                {/* On Behalf Of */}
                <div className="flex items-start gap-3">
                    <input
                        type="checkbox"
                        id="onBehalf"
                        checked={isOnBehalf}
                        onChange={(e) => setIsOnBehalf(e.target.checked)}
                        className="mt-1 w-4 h-4 accent-teal"
                    />
                    <label htmlFor="onBehalf" className="text-sm text-slate-400 font-light cursor-pointer">
                        I am completing this on behalf of the IP
                    </label>
                </div>

                {isOnBehalf && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                    >
                        <label className="block text-sm text-slate-400 font-light mb-3">
                            Your Name
                        </label>
                        <input
                            type="text"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            placeholder="Your name"
                            className="w-full px-4 py-4 bg-transparent border border-slate-700 text-white placeholder-slate-600 focus:border-teal focus:outline-none transition-colors"
                        />
                    </motion.div>
                )}

                {/* Attestation Checkbox */}
                <div className="p-6 border border-slate-700 bg-slate-900/50">
                    <div className="flex items-start gap-4">
                        <input
                            type="checkbox"
                            id="attestation"
                            checked={attested}
                            onChange={(e) => setAttested(e.target.checked)}
                            className="mt-1 w-5 h-5 accent-teal flex-shrink-0"
                        />
                        <label htmlFor="attestation" className="text-sm text-slate-300 font-light cursor-pointer leading-relaxed">
                            I, the undersigned, attest that the inputs provided—including creditor classifications,
                            asset realisations, and expense figures—accurately reflect the records of the Estate.
                            I acknowledge that Formal Bridge verifies the mathematical application of the
                            Insolvency Act 1986 based on these attested inputs.
                        </label>
                    </div>
                </div>

                {/* Warning */}
                <div className="flex items-start gap-3 text-slate-500 text-xs">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <p>
                        The Audit Certificate will state: "Attested by {isOnBehalf && userName ? userName : ipName || '[Name]'}{isOnBehalf && userName ? ` on behalf of ${ipName || '[IP Name]'}` : ''}, {isOnBehalf ? 'Administrator' : 'Joint Liquidator'}."
                    </p>
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 mt-8 pt-8 border-t border-slate-800/50">
                <button
                    onClick={onBack}
                    className="px-8 py-4 border border-slate-700 text-slate-400 font-light hover:border-slate-500 transition-colors"
                >
                    Back
                </button>
                <button
                    onClick={() => onComplete(isOnBehalf && userName ? userName : undefined)}
                    disabled={!isValid || isProcessing}
                    className="flex-1 inline-flex items-center justify-center gap-3 px-8 py-4 bg-teal text-midnight font-medium hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Shield className="w-4 h-4" />
                    {isProcessing ? 'Sealing Certificate...' : 'Seal Audit Certificate'}
                    {!isProcessing && <ArrowRight className="w-4 h-4" />}
                </button>
            </div>
        </div>
    );
}
