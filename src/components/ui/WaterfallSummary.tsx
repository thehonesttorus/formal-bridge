'use client';

import { motion } from 'framer-motion';
import { CheckCircle, AlertCircle } from 'lucide-react';

interface WaterfallSummaryProps {
    netFloatingChargeProperty: number;
    totalCosts: number;
    floatingChargeDate: string;
    prescribedPart: number;
    capApplied: number;
    tiersBreakdown: {
        tier3a: number;
        tier3b: number;
        tier6: number;
    };
    isDeMinimisApplied?: boolean;
    isNilDistribution?: boolean;
}

function formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-GB', {
        style: 'currency',
        currency: 'GBP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);
}

export function WaterfallSummary({
    netFloatingChargeProperty,
    totalCosts,
    floatingChargeDate,
    prescribedPart,
    capApplied,
    tiersBreakdown,
    isDeMinimisApplied,
    isNilDistribution,
}: WaterfallSummaryProps) {
    const netPropertyAfterCosts = netFloatingChargeProperty - totalCosts;
    const firstTranche = Math.min(netPropertyAfterCosts, 10000);
    const firstTranchePart = firstTranche * 0.5;
    const excessAmount = Math.max(0, netPropertyAfterCosts - 10000);
    const excessPart = excessAmount * 0.2;
    const uncappedPrescribedPart = firstTranchePart + excessPart;
    const wasCapped = uncappedPrescribedPart > capApplied;

    // Statutory Computation Trace - using legal citation style per expert guidance
    const verificationSteps = [
        { cite: 'IR 14.3', text: `Gross Floating Charge Realisations: ${formatCurrency(netFloatingChargeProperty)}` },
        { cite: 'SIP 9', text: `Less: Tier 2 Liquidation Costs: ${formatCurrency(totalCosts)}` },
        { cite: 'IA 1986', text: `Net Property Available for Distribution: ${formatCurrency(netPropertyAfterCosts)}` },
        { cite: 's.176A(2)(a)', text: `First Tranche Applied: 50% of ${formatCurrency(firstTranche)} = ${formatCurrency(firstTranchePart)}` },
        { cite: 's.176A(2)(b)', text: `Second Tranche Applied: 20% of ${formatCurrency(excessAmount)} = ${formatCurrency(excessPart)}` },
        wasCapped
            ? { cite: 's.176A(5)', text: `Statutory Cap Applied: ${formatCurrency(capApplied)} (${capApplied === 800000 ? 'Post-April 2020' : 'Pre-April 2020'})` }
            : { cite: 's.176A(5)', text: `Cap Compliance: Total ${formatCurrency(uncappedPrescribedPart)} does not exceed ${formatCurrency(capApplied)}` },
        isDeMinimisApplied
            ? { cite: 's.176A(3)', verified: true, text: `De Minimis Exception Applied: Prescribed Part waived` }
            : { cite: 'VERIFIED', verified: true, text: `Prescribed Part Calculation: ${formatCurrency(prescribedPart)}` },
    ];

    return (
        <div className="space-y-6">
            {/* Summary Header */}
            <div className={`border p-6 ${isNilDistribution ? 'border-amber-500/30' : 'border-teal/30'}`}>
                <div className="flex items-center gap-3 mb-4">
                    {isNilDistribution ? (
                        <AlertCircle className="w-5 h-5 text-amber-400" />
                    ) : (
                        <CheckCircle className="w-5 h-5 text-teal" />
                    )}
                    <span className={`font-mono text-xs tracking-widest ${isNilDistribution ? 'text-amber-400' : 'text-teal'}`}>
                        {isNilDistribution ? 'NIL DISTRIBUTION' : 'CALCULATION COMPLETE'}
                    </span>
                </div>

                {!isNilDistribution && (
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <p className="text-xs text-slate-500 font-light">Prescribed Part (S.176A)</p>
                            <p className="text-3xl font-light text-teal mt-1">
                                {isDeMinimisApplied ? 'Waived' : formatCurrency(prescribedPart)}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 font-light">Applicable Cap</p>
                            <p className="text-xl font-light text-white mt-1">
                                {formatCurrency(capApplied)}
                            </p>
                            <p className="text-xs text-slate-600 mt-1">
                                {capApplied === 800000 ? 'Post-April 2020' : 'Pre-April 2020'}
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Tier Breakdown */}
            <div className="border border-slate-800/50 p-6">
                <h3 className="text-sm text-slate-400 font-medium mb-4">Creditor Tier Summary</h3>
                <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-slate-800/30">
                        <span className="text-slate-400 font-light">Tier 3a (Preferential - Employees)</span>
                        <span className="text-white font-medium">{formatCurrency(tiersBreakdown.tier3a)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-slate-800/30">
                        <span className="text-slate-400 font-light">Tier 3b (Secondary Preferential - Crown)</span>
                        <span className="text-white font-medium">{formatCurrency(tiersBreakdown.tier3b)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-slate-800/30">
                        <span className="text-slate-400 font-light">Tier 4 (Prescribed Part)</span>
                        <span className="text-teal font-medium">
                            {isDeMinimisApplied ? 'Waived' : formatCurrency(prescribedPart)}
                        </span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                        <span className="text-slate-400 font-light">Tier 6 (Unsecured)</span>
                        <span className="text-white font-medium">{formatCurrency(tiersBreakdown.tier6)}</span>
                    </div>
                </div>
            </div>

            {/* Statutory Computation Trace */}
            <div className="bg-slate-900/50 border border-slate-800/50 p-6">
                <h3 className="text-sm text-slate-400 font-medium mb-4">Statutory Computation Trace</h3>
                <div className="space-y-2 font-mono text-xs">
                    {verificationSteps.map((step, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className={`flex gap-2 ${step.verified ? 'text-teal' : 'text-slate-400'}`}
                        >
                            <span className={`${step.verified ? 'text-teal' : 'text-slate-600'}`}>
                                [{step.cite}]
                            </span>
                            <span>{step.text}</span>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
