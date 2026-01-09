'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, AlertCircle, CheckCircle, Info, ChevronDown, ChevronUp, Users } from 'lucide-react';
import { useState } from 'react';
import type { DataIntegrityReport, DuplicateGroup, SanitizationWarning } from '@/lib/dataSanitizer';

interface DataIntegrityReportProps {
    report: DataIntegrityReport;
    onProceed: () => void;
    onBack: () => void;
}

export function DataIntegrityReportUI({ report, onProceed, onBack }: DataIntegrityReportProps) {
    const [expandedSection, setExpandedSection] = useState<'blocking' | 'warnings' | 'duplicates' | null>(
        report.blockingIssues > 0 ? 'blocking' : report.warningIssues > 0 ? 'warnings' : null
    );

    const toggleSection = (section: 'blocking' | 'warnings' | 'duplicates') => {
        setExpandedSection(expandedSection === section ? null : section);
    };

    const blockingIssues = report.amountIssues.filter(i => i.warning.type === 'blocking');
    const warningIssues = report.amountIssues.filter(i => i.warning.type === 'warning');

    return (
        <div className="border border-slate-800/50 p-8">
            {/* Header */}
            <div className="mb-8">
                <span className="text-teal font-mono text-xs tracking-widest">STATUTORY HEURISTICS</span>
                <h2 className="text-2xl font-light text-white mt-2">
                    Data Integrity Report
                </h2>
                <p className="text-slate-400 font-light mt-2">
                    {report.totalRows} creditors analyzed. Review any issues before proceeding.
                </p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-3 gap-4 mb-8">
                <div className={`p-4 border ${report.blockingIssues > 0 ? 'border-red-500/50 bg-red-500/5' : 'border-slate-800/50'}`}>
                    <div className="flex items-center gap-2 mb-2">
                        {report.blockingIssues > 0 ? (
                            <AlertCircle className="w-4 h-4 text-red-400" />
                        ) : (
                            <CheckCircle className="w-4 h-4 text-teal" />
                        )}
                        <span className="text-xs text-slate-500 uppercase tracking-wide">Blocking</span>
                    </div>
                    <span className={`text-2xl font-light ${report.blockingIssues > 0 ? 'text-red-400' : 'text-teal'}`}>
                        {report.blockingIssues}
                    </span>
                </div>

                <div className={`p-4 border ${report.warningIssues > 0 ? 'border-amber-500/50 bg-amber-500/5' : 'border-slate-800/50'}`}>
                    <div className="flex items-center gap-2 mb-2">
                        {report.warningIssues > 0 ? (
                            <AlertTriangle className="w-4 h-4 text-amber-400" />
                        ) : (
                            <CheckCircle className="w-4 h-4 text-teal" />
                        )}
                        <span className="text-xs text-slate-500 uppercase tracking-wide">Warnings</span>
                    </div>
                    <span className={`text-2xl font-light ${report.warningIssues > 0 ? 'text-amber-400' : 'text-teal'}`}>
                        {report.warningIssues}
                    </span>
                </div>

                <div className={`p-4 border ${report.duplicateGroups.length > 0 ? 'border-blue-500/50 bg-blue-500/5' : 'border-slate-800/50'}`}>
                    <div className="flex items-center gap-2 mb-2">
                        <Users className="w-4 h-4 text-blue-400" />
                        <span className="text-xs text-slate-500 uppercase tracking-wide">Duplicates</span>
                    </div>
                    <span className={`text-2xl font-light ${report.duplicateGroups.length > 0 ? 'text-blue-400' : 'text-slate-600'}`}>
                        {report.duplicateGroups.length}
                    </span>
                </div>
            </div>

            {/* Blocking Issues - Must be resolved */}
            {blockingIssues.length > 0 && (
                <div className="mb-6">
                    <button
                        onClick={() => toggleSection('blocking')}
                        className="w-full flex items-center justify-between p-4 bg-red-500/10 border border-red-500/30 hover:bg-red-500/15 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <AlertCircle className="w-5 h-5 text-red-400" />
                            <span className="text-red-400 font-medium">
                                {blockingIssues.length} Blocking Issue{blockingIssues.length > 1 ? 's' : ''} - Must Resolve
                            </span>
                        </div>
                        {expandedSection === 'blocking' ? (
                            <ChevronUp className="w-5 h-5 text-red-400" />
                        ) : (
                            <ChevronDown className="w-5 h-5 text-red-400" />
                        )}
                    </button>

                    <AnimatePresence>
                        {expandedSection === 'blocking' && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden border-x border-b border-red-500/30"
                            >
                                <div className="p-4 space-y-3">
                                    {blockingIssues.map((issue, i) => (
                                        <IssueRow key={i} issue={issue} />
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            )}

            {/* Warning Issues */}
            {warningIssues.length > 0 && (
                <div className="mb-6">
                    <button
                        onClick={() => toggleSection('warnings')}
                        className="w-full flex items-center justify-between p-4 bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/15 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <AlertTriangle className="w-5 h-5 text-amber-400" />
                            <span className="text-amber-400 font-medium">
                                {warningIssues.length} Warning{warningIssues.length > 1 ? 's' : ''} - Review Recommended
                            </span>
                        </div>
                        {expandedSection === 'warnings' ? (
                            <ChevronUp className="w-5 h-5 text-amber-400" />
                        ) : (
                            <ChevronDown className="w-5 h-5 text-amber-400" />
                        )}
                    </button>

                    <AnimatePresence>
                        {expandedSection === 'warnings' && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden border-x border-b border-amber-500/30"
                            >
                                <div className="p-4 space-y-3">
                                    {warningIssues.map((issue, i) => (
                                        <IssueRow key={i} issue={issue} />
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            )}

            {/* Duplicate Detection */}
            {report.duplicateGroups.length > 0 && (
                <div className="mb-6">
                    <button
                        onClick={() => toggleSection('duplicates')}
                        className="w-full flex items-center justify-between p-4 bg-blue-500/10 border border-blue-500/30 hover:bg-blue-500/15 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <Users className="w-5 h-5 text-blue-400" />
                            <span className="text-blue-400 font-medium">
                                {report.duplicateGroups.length} Potential Duplicate{report.duplicateGroups.length > 1 ? 's' : ''}
                            </span>
                        </div>
                        {expandedSection === 'duplicates' ? (
                            <ChevronUp className="w-5 h-5 text-blue-400" />
                        ) : (
                            <ChevronDown className="w-5 h-5 text-blue-400" />
                        )}
                    </button>

                    <AnimatePresence>
                        {expandedSection === 'duplicates' && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden border-x border-b border-blue-500/30"
                            >
                                <div className="p-4 space-y-3">
                                    {report.duplicateGroups.map((group, i) => (
                                        <DuplicateGroupRow key={i} group={group} />
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            )}

            {/* All Clear */}
            {report.blockingIssues === 0 && report.warningIssues === 0 && report.duplicateGroups.length === 0 && (
                <div className="flex items-center gap-4 p-6 bg-teal/10 border border-teal/30 mb-6">
                    <CheckCircle className="w-8 h-8 text-teal" />
                    <div>
                        <p className="text-teal font-medium">All {report.totalRows} creditors validated</p>
                        <p className="text-slate-400 text-sm font-light">Data integrity checks passed. Ready for classification analysis.</p>
                    </div>
                </div>
            )}

            {/* Blocking Message */}
            {!report.canProceed && (
                <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/30 mb-6">
                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="text-red-400 font-medium">Cannot proceed with certification</p>
                        <p className="text-slate-400 text-sm font-light mt-1">
                            Resolve all blocking issues above. Non-deterministic values (TBC, approx, etc.)
                            cannot be mathematically verified.
                        </p>
                    </div>
                </div>
            )}

            {/* Actions */}
            <div className="flex gap-4 mt-8 pt-8 border-t border-slate-800/50">
                <button
                    onClick={onBack}
                    className="px-8 py-4 border border-slate-700 text-slate-400 font-light hover:border-slate-500 transition-colors"
                >
                    Back to Mapping
                </button>
                <button
                    onClick={onProceed}
                    disabled={!report.canProceed}
                    className="flex-1 inline-flex items-center justify-center gap-3 px-8 py-4 bg-teal text-midnight font-medium hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <CheckCircle className="w-4 h-4" />
                    {report.canProceed
                        ? 'Proceed to Classification Analysis'
                        : 'Resolve Blocking Issues First'
                    }
                </button>
            </div>
        </div>
    );
}

function IssueRow({ issue }: { issue: { rowNumber: number; creditorName: string; warning: SanitizationWarning } }) {
    return (
        <div className="flex items-start gap-4 p-3 bg-slate-900/50">
            <span className="text-xs font-mono text-slate-600 w-12 flex-shrink-0">
                Row {issue.rowNumber}
            </span>
            <div className="flex-1 min-w-0">
                <p className="text-sm text-white font-light truncate">{issue.creditorName}</p>
                <p className="text-xs text-slate-500 mt-1">{issue.warning.message}</p>
                {issue.warning.suggestion && (
                    <p className="text-xs text-teal mt-1 flex items-center gap-1">
                        <Info className="w-3 h-3" />
                        {issue.warning.suggestion}
                    </p>
                )}
            </div>
            <span className="text-xs font-mono text-slate-600">[{issue.warning.code}]</span>
        </div>
    );
}

function DuplicateGroupRow({ group }: { group: DuplicateGroup }) {
    return (
        <div className="p-3 bg-slate-900/50">
            <p className="text-sm text-white font-light">{group.message}</p>
            <div className="mt-2 flex flex-wrap gap-2">
                {group.creditors.map((c, i) => (
                    <span key={i} className="text-xs font-mono text-slate-500 bg-slate-800/50 px-2 py-1">
                        Row {c.rowNumber}
                    </span>
                ))}
            </div>
        </div>
    );
}
