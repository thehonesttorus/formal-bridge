'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, Banknote, AlertCircle } from 'lucide-react';

interface FinalizationData {
    netFloatingChargeProperty: number;
    floatingChargeDate: string;
    totalCosts: number;
    insolvencyCommencementDate: string;
    applyDeMinimis: boolean;
}

interface FinalizationStepProps {
    onComplete: (data: FinalizationData) => void;
    onBack: () => void;
    totalClaimsAnalyzed: number;
}

const CAP_THRESHOLD_DATE = new Date('2020-04-06');
const CROWN_PREFERENCE_DATE = new Date('2020-12-01');

export function FinalizationStep({ onComplete, onBack, totalClaimsAnalyzed }: FinalizationStepProps) {
    const [netProperty, setNetProperty] = useState('');
    const [chargeDate, setChargeDate] = useState('');
    const [totalCosts, setTotalCosts] = useState('');
    const [insolvencyDate, setInsolvencyDate] = useState('');
    const [applyDeMinimis, setApplyDeMinimis] = useState(false);

    const parsedNetProperty = parseFloat(netProperty.replace(/,/g, '')) || 0;
    const parsedCosts = parseFloat(totalCosts.replace(/,/g, '')) || 0;
    const parsedChargeDate = chargeDate ? new Date(chargeDate) : null;
    const parsedInsolvencyDate = insolvencyDate ? new Date(insolvencyDate) : null;

    const isPost2020Cap = parsedChargeDate && parsedChargeDate >= CAP_THRESHOLD_DATE;
    const isPostCrownPreference = parsedInsolvencyDate && parsedInsolvencyDate >= CROWN_PREFERENCE_DATE;
    const capAmount = isPost2020Cap ? 800000 : 600000;
    const isNilDistribution = parsedNetProperty <= parsedCosts;
    const isDeMinimisEligible = (parsedNetProperty - parsedCosts) < 10000;

    const isValid = netProperty && chargeDate && totalCosts && insolvencyDate;

    const handleSubmit = () => {
        if (!isValid) return;

        onComplete({
            netFloatingChargeProperty: parsedNetProperty,
            floatingChargeDate: chargeDate,
            totalCosts: parsedCosts,
            insolvencyCommencementDate: insolvencyDate,
            applyDeMinimis,
        });
    };

    return (
        <div className="border border-slate-800/50 p-8">
            <div className="mb-8">
                <span className="text-teal font-mono text-xs tracking-widest">FINALIZE REALISATIONS</span>
                <h2 className="text-2xl font-light text-white mt-2">
                    Complete the Statutory Waterfall
                </h2>
                <p className="text-slate-400 font-light mt-2">
                    {totalClaimsAnalyzed} creditors classified. Enter the realisation figures to calculate the Prescribed Part.
                </p>
            </div>

            <div className="space-y-6">
                {/* Gross Floating Charge Realisations */}
                <div>
                    <label className="flex items-center gap-2 text-sm text-slate-400 font-light mb-3">
                        <Banknote className="w-4 h-4" />
                        Gross Floating Charge Realisations
                    </label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">£</span>
                        <input
                            type="text"
                            value={netProperty}
                            onChange={(e) => setNetProperty(e.target.value)}
                            placeholder="500,000"
                            className="w-full pl-10 pr-4 py-4 bg-transparent border border-slate-700 text-white text-lg placeholder-slate-600 focus:border-teal focus:outline-none transition-colors"
                        />
                    </div>
                    <p className="text-xs text-slate-600 font-light mt-2">
                        Total value of property subject to floating charge after deducting Fixed Charge payments
                    </p>
                </div>

                {/* Date of Floating Charge */}
                <div>
                    <label className="flex items-center gap-2 text-sm text-slate-400 font-light mb-3">
                        <Calendar className="w-4 h-4" />
                        Date of Floating Charge Being Settled
                    </label>
                    <input
                        type="date"
                        value={chargeDate}
                        onChange={(e) => setChargeDate(e.target.value)}
                        className="w-full px-4 py-4 bg-transparent border border-slate-700 text-white focus:border-teal focus:outline-none transition-colors"
                    />
                    {parsedChargeDate && (
                        <p className={`text-xs font-light mt-2 ${isPost2020Cap ? 'text-teal' : 'text-amber-400'}`}>
                            S.176A Cap: £{capAmount.toLocaleString()} ({isPost2020Cap ? 'Post-April 2020' : 'Pre-April 2020'})
                        </p>
                    )}
                </div>

                {/* Total Costs */}
                <div>
                    <label className="flex items-center gap-2 text-sm text-slate-400 font-light mb-3">
                        <Banknote className="w-4 h-4" />
                        Less: Tier 2 Liquidation Costs (SIP 9)
                    </label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">£</span>
                        <input
                            type="text"
                            value={totalCosts}
                            onChange={(e) => setTotalCosts(e.target.value)}
                            placeholder="50,000"
                            className="w-full pl-10 pr-4 py-4 bg-transparent border border-slate-700 text-white text-lg placeholder-slate-600 focus:border-teal focus:outline-none transition-colors"
                        />
                    </div>
                    <p className="text-xs text-slate-600 font-light mt-2">
                        IP fees, legal costs, and costs of realization (Category 1 & 2)
                    </p>
                </div>

                {/* Auto-calculated Net Property */}
                {parsedNetProperty > 0 && (
                    <div className="p-4 bg-slate-900/50 border border-slate-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-400 font-light">
                                    Net Floating Charge Property (Calculated)
                                </p>
                                <p className="text-xs text-slate-600 font-light mt-1">
                                    Gross Realisations − Tier 2 Costs = Net Property
                                </p>
                            </div>
                            <div className="text-right">
                                <p className={`text-2xl font-light ${(parsedNetProperty - parsedCosts) > 0 ? 'text-teal' : 'text-amber-400'}`}>
                                    £{(parsedNetProperty - parsedCosts).toLocaleString()}
                                </p>
                                <p className="text-xs text-slate-500 font-mono mt-1">
                                    £{parsedNetProperty.toLocaleString()} − £{parsedCosts.toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Insolvency Commencement Date */}
                <div>
                    <label className="flex items-center gap-2 text-sm text-slate-400 font-light mb-3">
                        <Calendar className="w-4 h-4" />
                        Insolvency Commencement Date
                    </label>
                    <input
                        type="date"
                        value={insolvencyDate}
                        onChange={(e) => setInsolvencyDate(e.target.value)}
                        className="w-full px-4 py-4 bg-transparent border border-slate-700 text-white focus:border-teal focus:outline-none transition-colors"
                    />
                    {parsedInsolvencyDate && (
                        <p className={`text-xs font-light mt-2 ${isPostCrownPreference ? 'text-teal' : 'text-amber-400'}`}>
                            Crown Preference: {isPostCrownPreference ? 'Applies (Post-1 Dec 2020)' : 'Does NOT apply (Pre-1 Dec 2020)'}
                        </p>
                    )}
                </div>

                {/* Nil Distribution Warning */}
                {isNilDistribution && parsedNetProperty > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-start gap-3 p-4 border border-amber-500/30 bg-amber-500/5"
                    >
                        <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-amber-400 font-medium text-sm">Nil Distribution</p>
                            <p className="text-slate-400 text-xs mt-1">
                                Costs exceed or equal Net Property. Distribution stops at Tier 2 (Expenses).
                            </p>
                        </div>
                    </motion.div>
                )}

                {/* De Minimis Option */}
                {isDeMinimisEligible && !isNilDistribution && (
                    <div className="flex items-start gap-3 p-4 border border-slate-700">
                        <input
                            type="checkbox"
                            id="deMinimis"
                            checked={applyDeMinimis}
                            onChange={(e) => setApplyDeMinimis(e.target.checked)}
                            className="mt-1 w-4 h-4 accent-teal"
                        />
                        <label htmlFor="deMinimis" className="text-sm text-slate-400 font-light cursor-pointer">
                            <span className="text-white font-medium">Apply De Minimis carve-out</span>
                            <span className="block mt-1 text-xs">
                                Net Property is below £10,000. Under S.176A(3), you may waive the Prescribed Part if disproportionate.
                            </span>
                        </label>
                    </div>
                )}
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
                    onClick={handleSubmit}
                    disabled={!isValid}
                    className="flex-1 inline-flex items-center justify-center gap-3 px-8 py-4 bg-teal text-midnight font-medium hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Continue to Attestation
                    <ArrowRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
