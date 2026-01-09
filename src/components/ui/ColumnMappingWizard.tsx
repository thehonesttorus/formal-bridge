'use client';

import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import type { ParsedSpreadsheet } from './ExcelDropzone';

interface ColumnMappingWizardProps {
    data: ParsedSpreadsheet;
    onComplete: (mapping: ColumnMapping) => void;
    onCancel: () => void;
}

export interface ColumnMapping {
    nameColumn: string;
    amountColumn: string;
    classificationColumn: string | null;
}

type WizardStep = 'name' | 'amount' | 'classification' | 'confirm';

const STEP_CONFIG = {
    name: {
        title: 'Select the Creditor Name column',
        description: 'Click on the column containing creditor or company names',
        hint: 'Patterns: Creditor, Name, Company, Supplier',
    },
    amount: {
        title: 'Select the Amount column',
        description: 'Click on the column containing claim amounts',
        hint: 'Patterns: Amount, Claim, Balance, Total',
    },
    classification: {
        title: 'Select the Classification column (optional)',
        description: 'Click on the column with tier or type, or skip to auto-detect',
        hint: 'Patterns: Type, Class, Tier, Category',
    },
    confirm: {
        title: 'Confirm mapping',
        description: 'Review the column mapping before analysis',
        hint: '',
    },
};

export function ColumnMappingWizard({ data, onComplete, onCancel }: ColumnMappingWizardProps) {
    const [step, setStep] = useState<WizardStep>('name');
    const [mapping, setMapping] = useState<Partial<ColumnMapping>>({});

    const handleColumnSelect = (column: string) => {
        if (step === 'name') {
            setMapping({ ...mapping, nameColumn: column });
            setStep('amount');
        } else if (step === 'amount') {
            setMapping({ ...mapping, amountColumn: column });
            setStep('classification');
        } else if (step === 'classification') {
            setMapping({ ...mapping, classificationColumn: column });
            setStep('confirm');
        }
    };

    const handleSkipClassification = () => {
        setMapping({ ...mapping, classificationColumn: null });
        setStep('confirm');
    };

    const handleConfirm = () => {
        if (mapping.nameColumn && mapping.amountColumn) {
            onComplete({
                nameColumn: mapping.nameColumn,
                amountColumn: mapping.amountColumn,
                classificationColumn: mapping.classificationColumn ?? null,
            });
        }
    };

    const handleBack = () => {
        if (step === 'amount') setStep('name');
        else if (step === 'classification') setStep('amount');
        else if (step === 'confirm') setStep('classification');
    };

    const currentConfig = STEP_CONFIG[step];

    // Detect likely columns based on name patterns (Enhanced fuzzy matching)
    const suggestColumn = (columns: string[], patterns: RegExp[]): string | null => {
        for (const col of columns) {
            if (patterns.some(p => p.test(col))) return col;
        }
        return null;
    };

    const getSuggestion = () => {
        if (step === 'name') {
            return suggestColumn(data.columns, [
                /name/i, /creditor/i, /company/i, /supplier/i, /payee/i, /vendor/i, /claimant/i
            ]);
        }
        if (step === 'amount') {
            // Enhanced patterns per expert guidance: "Amt", "Balance", "Amount Owed", "Claim Value", "Outstanding"
            return suggestColumn(data.columns, [
                /amount/i, /amt/i, /claim/i, /balance/i, /total/i, /value/i, /owed/i,
                /outstanding/i, /due/i, /debt/i, /sum/i, /£/, /gbp/i
            ]);
        }
        if (step === 'classification') {
            return suggestColumn(data.columns, [
                /type/i, /class/i, /tier/i, /category/i, /status/i, /priority/i, /rank/i
            ]);
        }
        return null;
    };

    const suggestion = getSuggestion();
    const steps: WizardStep[] = ['name', 'amount', 'classification', 'confirm'];
    const currentStepIndex = steps.indexOf(step);

    return (
        <div className="border border-slate-800/50">
            {/* Header */}
            <div className="border-b border-slate-800/50 px-8 py-6">
                <div className="flex items-center gap-8 mb-6">
                    {steps.map((s, i) => (
                        <div key={s} className="flex items-center gap-4">
                            <div className={`
                                w-6 h-6 flex items-center justify-center text-xs font-mono
                                ${currentStepIndex >= i ? 'bg-teal text-midnight' : 'text-slate-600'}
                            `}>
                                {i + 1}
                            </div>
                            {i < steps.length - 1 && (
                                <div className={`w-8 h-px ${currentStepIndex > i ? 'bg-teal/50' : 'bg-slate-800'}`} />
                            )}
                        </div>
                    ))}
                </div>

                <h3 className="text-xl font-light text-white">{currentConfig.title}</h3>
                <p className="text-sm text-slate-500 font-light mt-1">{currentConfig.description}</p>
            </div>

            {/* Content */}
            <div className="p-8">
                {step === 'confirm' ? (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <div className="flex justify-between py-3 border-b border-slate-800/50">
                                <span className="text-slate-500 font-light">Creditor Name</span>
                                <span className="font-mono text-teal">{mapping.nameColumn}</span>
                            </div>
                            <div className="flex justify-between py-3 border-b border-slate-800/50">
                                <span className="text-slate-500 font-light">Amount</span>
                                <span className="font-mono text-teal">{mapping.amountColumn}</span>
                            </div>
                            <div className="flex justify-between py-3 border-b border-slate-800/50">
                                <span className="text-slate-500 font-light">Classification</span>
                                <span className="font-mono text-slate-400">
                                    {mapping.classificationColumn || '(Auto-detect)'}
                                </span>
                            </div>
                        </div>

                        <p className="text-sm text-slate-600 font-light mt-8">
                            <span className="text-slate-400">{data.rows.length}</span> creditor rows will be analyzed
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {currentConfig.hint && (
                            <p className="text-xs text-slate-600 font-light">{currentConfig.hint}</p>
                        )}

                        {/* Column preview table */}
                        <div className="overflow-x-auto border border-slate-800/50">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-slate-800/50">
                                        {data.columns.map((col) => (
                                            <th
                                                key={col}
                                                onClick={() => handleColumnSelect(col)}
                                                className={`
                                                    px-4 py-3 text-left font-light cursor-pointer
                                                    transition-colors hover:bg-teal/5 
                                                    ${col === suggestion ? 'text-teal' : 'text-slate-300'}
                                                    ${Object.values(mapping).includes(col) ? 'opacity-40' : ''}
                                                `}
                                            >
                                                <div className="flex items-center gap-2">
                                                    {col}
                                                    {col === suggestion && (
                                                        <span className="text-xs text-teal/60 font-mono">
                                                            Suggested
                                                        </span>
                                                    )}
                                                </div>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.rows.slice(0, 5).map((row, i) => (
                                        <tr key={i} className="border-t border-slate-800/30">
                                            {data.columns.map((col) => (
                                                <td
                                                    key={col}
                                                    onClick={() => handleColumnSelect(col)}
                                                    className={`
                                                        px-4 py-2 cursor-pointer hover:bg-slate-800/50 font-light
                                                        ${Object.values(mapping).includes(col) ? 'opacity-40 text-slate-600' : 'text-slate-500'}
                                                    `}
                                                >
                                                    {String(row[col] ?? '')}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {data.rows.length > 5 && (
                            <p className="text-xs text-slate-600 font-light">
                                Showing 5 of {data.rows.length} rows
                            </p>
                        )}
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="border-t border-slate-800/50 px-8 py-4 flex justify-between">
                <div className="flex gap-4">
                    {step !== 'name' && (
                        <button
                            onClick={handleBack}
                            className="text-slate-500 hover:text-white transition-colors text-sm font-light"
                        >
                            Back
                        </button>
                    )}
                    <button
                        onClick={onCancel}
                        className="text-slate-500 hover:text-white transition-colors text-sm font-light"
                    >
                        Cancel
                    </button>
                </div>

                <div className="flex gap-4">
                    {step === 'classification' && (
                        <button
                            onClick={handleSkipClassification}
                            className="px-6 py-2 border border-slate-700 text-slate-400 text-sm font-light hover:border-slate-600 transition-colors"
                        >
                            Skip (Auto-detect)
                        </button>
                    )}

                    {step === 'confirm' && (
                        <button
                            onClick={handleConfirm}
                            className="inline-flex items-center gap-2 px-6 py-2 bg-teal text-midnight font-medium hover:bg-white transition-colors"
                        >
                            Analyze Classifications
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
