'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ArrowRight } from 'lucide-react';
import type { ClassificationResult, ClassificationWarning, CreditorRow } from '@/lib/creditorClassifier';

interface RiskReportProps {
    result: ClassificationResult;
    creditors: CreditorRow[];
    onAutoCorrect: () => void;
    onGenerateCertificate: () => void;
    isProcessing?: boolean;
}

export function RiskReport({
    result,
    creditors,
    onAutoCorrect,
    onGenerateCertificate,
    isProcessing
}: RiskReportProps) {
    const [expandedWarnings, setExpandedWarnings] = useState<Set<number>>(new Set());
    const hasWarnings = result.warnings.length > 0;
    const hasCritical = result.summary.criticalCount > 0;

    const toggleWarning = (rowNumber: number) => {
        const next = new Set(expandedWarnings);
        if (next.has(rowNumber)) {
            next.delete(rowNumber);
        } else {
            next.add(rowNumber);
        }
        setExpandedWarnings(next);
    };

    return (
        <div className="space-y-8">
            {/* Summary Header */}
            <div className={`border p-8 ${hasCritical
                ? 'border-red-500/30'
                : hasWarnings
                    ? 'border-amber-500/30'
                    : 'border-teal/30'
                }`}>
                <div className="flex items-start justify-between">
                    <div>
                        <span className={`font-mono text-xs tracking-widest ${hasCritical ? 'text-red-400' : hasWarnings ? 'text-amber-400' : 'text-teal'
                            }`}>
                            {hasCritical ? 'LIABILITY EXPOSURE WARNING' : hasWarnings ? 'STATUTORY COMPLIANCE ISSUES' : 'AUDIT COMPLETE'}
                        </span>
                        <h2 className="text-2xl font-light text-white mt-2">
                            {hasWarnings
                                ? `${result.warnings.length} statutory compliance breach${result.warnings.length > 1 ? 'es' : ''} detected`
                                : 'All classifications verified'
                            }
                        </h2>
                        <p className="text-slate-400 font-light mt-2">
                            {creditors.length} creditors analyzed
                        </p>
                    </div>

                    {hasWarnings && (
                        <div className="text-right">
                            <p className="text-xs text-slate-500 font-light">Total at risk</p>
                            <p className={`text-2xl font-light ${hasCritical ? 'text-red-400' : 'text-amber-400'}`}>
                                £{result.totalAtRisk.toLocaleString()}
                            </p>
                        </div>
                    )}
                </div>

                {hasWarnings && (
                    <div className="grid grid-cols-2 gap-8 mt-8 pt-8 border-t border-slate-800/50">
                        <div>
                            <p className="text-xs text-slate-500 font-light">Potential Overpayment</p>
                            <p className={`text-xl font-light mt-1 ${result.crownGapTotal > 0 ? 'text-red-400' : 'text-slate-400'}`}>
                                £{result.crownGapTotal.toLocaleString()}
                            </p>
                            <p className="text-xs text-red-400/70 mt-1">Crown Preference Breach</p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 font-light">Employee Claims Misclassified</p>
                            <p className={`text-xl font-light mt-1 ${result.wagesGapTotal > 0 ? 'text-amber-400' : 'text-slate-400'}`}>
                                £{result.wagesGapTotal.toLocaleString()}
                            </p>
                            <p className="text-xs text-amber-400/70 mt-1">IA 1986 Sch.6 Breach</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Warning List */}
            {hasWarnings && (
                <div>
                    <h3 className="text-sm text-slate-400 font-medium mb-4">
                        Statutory Breaches Requiring Correction
                    </h3>

                    <div className="space-y-2">
                        {result.warnings.map((warning) => (
                            <WarningCard
                                key={warning.rowNumber}
                                warning={warning}
                                isExpanded={expandedWarnings.has(warning.rowNumber)}
                                onToggle={() => toggleWarning(warning.rowNumber)}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 pt-8 border-t border-slate-800/50">
                {hasWarnings ? (
                    <>
                        <button
                            onClick={onAutoCorrect}
                            disabled={isProcessing}
                            className="flex-1 inline-flex items-center justify-center gap-3 px-8 py-4 bg-teal text-midnight font-medium hover:bg-white transition-colors disabled:opacity-50"
                        >
                            Auto-Correct & Generate Certificate
                            <ArrowRight className="w-4 h-4" />
                        </button>
                        <button
                            onClick={onGenerateCertificate}
                            disabled={isProcessing}
                            className="px-8 py-4 border border-slate-700 text-slate-400 font-light hover:border-slate-500 transition-colors disabled:opacity-50"
                        >
                            Keep Original
                        </button>
                    </>
                ) : (
                    <button
                        onClick={onGenerateCertificate}
                        disabled={isProcessing}
                        className="flex-1 inline-flex items-center justify-center gap-3 px-8 py-4 bg-teal text-midnight font-medium hover:bg-white transition-colors disabled:opacity-50"
                    >
                        {isProcessing ? 'Generating...' : 'Generate Audit Certificate'}
                        {!isProcessing && <ArrowRight className="w-4 h-4" />}
                    </button>
                )}
            </div>
        </div>
    );
}

function WarningCard({ warning, isExpanded, onToggle }: {
    warning: ClassificationWarning;
    isExpanded: boolean;
    onToggle: () => void;
}) {
    const isCritical = warning.severity === 'critical';

    return (
        <div className={`border ${isCritical ? 'border-red-500/20' : 'border-slate-800/50'}`}>
            <button
                onClick={onToggle}
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
            >
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-4">
                        <span className="text-white font-light">
                            Row {warning.rowNumber}
                        </span>
                        <span className="text-slate-400 font-light truncate">
                            &quot;{warning.creditorName}&quot;
                        </span>
                        <span className={`text-xs font-mono ${isCritical ? 'text-red-400' : 'text-amber-400'}`}>
                            {warning.rule}
                        </span>
                    </div>
                    <p className="text-sm text-slate-500 font-light mt-1">
                        £{warning.amount.toLocaleString()} &bull; {warning.currentTier} → Tier {warning.suggestedTier}
                    </p>
                </div>

                <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <ChevronDown className="w-4 h-4 text-slate-500" />
                </motion.div>
            </button>

            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                    >
                        <div className="px-6 pb-4 space-y-3 border-t border-slate-800/50 pt-4">
                            <div>
                                <p className="text-xs text-slate-500 font-light">Regulatory Breach</p>
                                <p className="text-sm text-slate-300 font-light mt-1">{warning.regulatoryBreach}</p>
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 font-light">Impact</p>
                                <p className={`text-sm font-light mt-1 ${isCritical ? 'text-red-400' : 'text-amber-400'}`}>
                                    {warning.impactDescription}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
