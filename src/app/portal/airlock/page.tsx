'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { createClient } from '@/lib/supabase/browser';
import { useRouter } from 'next/navigation';
import type { User } from '@supabase/supabase-js';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import DataPlaneBackground from '@/components/ui/DataPlaneBackground';
import { ExcelDropzone, type ParsedSpreadsheet } from '@/components/ui/ExcelDropzone';

import { ColumnMappingWizard, type ColumnMapping } from '@/components/ui/ColumnMappingWizard';
import { DataIntegrityReportUI } from '@/components/ui/DataIntegrityReport';
import { RiskReport } from '@/components/ui/RiskReport';
import { FinalizationStep } from '@/components/ui/FinalizationStep';
import { AttestationStep } from '@/components/ui/AttestationStep';
import { WaterfallSummary } from '@/components/ui/WaterfallSummary';
import {
    analyzeClassifications,
    applyCorrections,
    type CreditorRow,
    type ClassificationResult,
    type TierCode
} from '@/lib/creditorClassifier';
import { sanitizeAmount, generateIntegrityReport, type DataIntegrityReport } from '@/lib/dataSanitizer';
import { generateFileHash } from '@/lib/fileHash';
import { calculatePrescribedPart } from '@/lib/prescribedPart';
import { generateVerificationCode, KERNEL_VERSION } from '@/lib/verificationCode';
import type { CertificateInsert } from '@/lib/database.types';
import Link from 'next/link';

type FlowStep = 'upload' | 'mapping' | 'integrity' | 'analysis' | 'finalization' | 'attestation' | 'certificate';

interface FinalizationData {
    netFloatingChargeProperty: number;
    floatingChargeDate: string;
    totalCosts: number;
    insolvencyCommencementDate: string;
    applyDeMinimis: boolean;
}

const steps: { id: FlowStep; label: string }[] = [
    { id: 'upload', label: 'Upload Schedule' },
    { id: 'mapping', label: 'Confirm Columns' },
    { id: 'integrity', label: 'Data Check' },
    { id: 'analysis', label: 'Review' },
    { id: 'finalization', label: 'Finalize Realisations' },
    { id: 'attestation', label: 'Seal Audit Certificate' },
    { id: 'certificate', label: 'Complete' },
];

export default function AirlockPage() {
    const router = useRouter();
    const supabase = createClient();
    const [user, setUser] = useState<User | null>(null);
    const [step, setStep] = useState<FlowStep>('upload');
    const [spreadsheet, setSpreadsheet] = useState<ParsedSpreadsheet | null>(null);
    const [creditors, setCreditors] = useState<CreditorRow[]>([]);
    const [analysisResult, setAnalysisResult] = useState<ClassificationResult | null>(null);
    const [integrityReport, setIntegrityReport] = useState<DataIntegrityReport | null>(null);
    const [inputHash, setInputHash] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    // New state for finalization and attestation
    const [finalizationData, setFinalizationData] = useState<FinalizationData | null>(null);
    const [ipName, setIpName] = useState<string>('');
    const [prescribedPartResult, setPrescribedPartResult] = useState<{
        prescribedPart: number;
        cap: number;
        isDeMinimisApplied: boolean;
        isNilDistribution: boolean;
    } | null>(null);
    const [verificationCode, setVerificationCode] = useState<string | null>(null);

    // Get Supabase user session
    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push('/login');
            } else {
                setUser(user);
            }
        };
        getUser();
    }, [supabase, router]);
    // Usage tracking state
    const [usageData, setUsageData] = useState<{
        usedCount: number;
        remainingFree: number;
        hasReachedLimit: boolean;
    } | null>(null);

    // Fetch usage data on mount
    useEffect(() => {
        async function fetchUsage() {
            try {
                const response = await fetch('/api/usage');
                if (response.ok) {
                    const data = await response.json();
                    setUsageData(data);
                }
            } catch (err) {
                console.error('Failed to fetch usage:', err);
            }
        }
        fetchUsage();
    }, []);

    const currentStepIndex = steps.findIndex(s => s.id === step);

    const handleParsed = useCallback(async (data: ParsedSpreadsheet) => {
        setSpreadsheet(data);
        setError(null);
        const hash = await generateFileHash(data.rawFile);
        setInputHash(hash);
        setStep('mapping');
    }, []);

    const handleMappingComplete = useCallback((columnMapping: ColumnMapping) => {
        if (!spreadsheet) return;

        // Build creditors with sanitized amounts for integrity report
        const sanitizedCreditors = spreadsheet.rows.map((row, index) => {
            const name = String(row[columnMapping.nameColumn] ?? '');
            const rawAmount = row[columnMapping.amountColumn];
            const sanitized = sanitizeAmount(rawAmount);

            let currentTier: TierCode | string = '6';
            if (columnMapping.classificationColumn) {
                currentTier = String(row[columnMapping.classificationColumn] ?? '6');
            }

            return {
                rowNumber: index + 2,
                name,
                rawAmount: String(rawAmount ?? ''),
                sanitizedAmount: sanitized,
                currentTier,
            };
        }).filter(c => c.name.trim() !== '');

        // Generate integrity report
        const report = generateIntegrityReport(sanitizedCreditors);
        setIntegrityReport(report);

        // Convert to CreditorRow format (only valid ones for now)
        const rows: CreditorRow[] = sanitizedCreditors
            .filter(c => c.sanitizedAmount.isValid && c.sanitizedAmount.value > 0)
            .map(c => ({
                rowNumber: c.rowNumber,
                name: c.name,
                amount: c.sanitizedAmount.value,
                currentTier: c.currentTier,
            }));

        setCreditors(rows);
        setStep('integrity');
    }, [spreadsheet]);

    // Handle integrity report proceed
    const handleIntegrityProceed = useCallback(() => {
        const result = analyzeClassifications(creditors);
        setAnalysisResult(result);
        setStep('analysis');
    }, [creditors]);

    // Handle integrity report back
    const handleIntegrityBack = useCallback(() => {
        setStep('mapping');
    }, []);

    const handleAutoCorrect = useCallback(() => {
        if (!analysisResult || !creditors.length) return;
        const correctedCreditors = applyCorrections(creditors, analysisResult.warnings);
        setCreditors(correctedCreditors);
        const newResult = analyzeClassifications(correctedCreditors);
        setAnalysisResult(newResult);
    }, [analysisResult, creditors]);

    // New: Navigate to finalization after classification is complete
    const handleContinueToFinalization = useCallback(() => {
        setStep('finalization');
    }, []);

    // New: Handle finalization data and calculate Prescribed Part
    const handleFinalizationComplete = useCallback((data: FinalizationData) => {
        setFinalizationData(data);

        // Calculate Prescribed Part using the lib function
        const netPropertyAfterCosts = data.netFloatingChargeProperty - data.totalCosts;
        const isNilDistribution = netPropertyAfterCosts <= 0;
        const chargeDate = new Date(data.floatingChargeDate);
        const cap = chargeDate >= new Date('2020-04-06') ? 800000 : 600000;

        let prescribedPart = 0;
        if (!isNilDistribution && !data.applyDeMinimis) {
            const result = calculatePrescribedPart(netPropertyAfterCosts, new Date(data.floatingChargeDate));
            prescribedPart = result.finalAmount;
        }

        setPrescribedPartResult({
            prescribedPart,
            cap,
            isDeMinimisApplied: data.applyDeMinimis,
            isNilDistribution,
        });

        setStep('attestation');
    }, []);

    // New: Handle attestation and generate certificate
    const handleAttestationComplete = useCallback(async (attestedBy?: string) => {
        if (!finalizationData || !prescribedPartResult || !user) return;
        setIsProcessing(true);
        setError(null);

        try {
            // Generate verification code
            const verificationCode = generateVerificationCode();

            // Calculate tier totals
            const tier3a = creditors.filter(c => c.currentTier === '3a').reduce((s, c) => s + c.amount, 0);
            const tier3b = creditors.filter(c => c.currentTier === '3b').reduce((s, c) => s + c.amount, 0);
            const tier6 = creditors.filter(c => c.currentTier === '6').reduce((s, c) => s + c.amount, 0);

            // Save certificate metadata to Supabase
            const certificateData: CertificateInsert = {
                user_id: user!.id,
                user_email: user!.email || '',
                case_reference: undefined,  // Could add input field later
                ip_name: ipName,
                attested_by: attestedBy,
                input_file_hash: inputHash,
                creditor_count: creditors.length,
                net_floating_charge_property: finalizationData.netFloatingChargeProperty,
                floating_charge_date: finalizationData.floatingChargeDate,
                total_costs: finalizationData.totalCosts,
                insolvency_commencement_date: finalizationData.insolvencyCommencementDate,
                prescribed_part: prescribedPartResult.prescribedPart,
                cap_applied: prescribedPartResult.cap,
                is_de_minimis_applied: prescribedPartResult.isDeMinimisApplied,
                is_nil_distribution: prescribedPartResult.isNilDistribution,
                tier_3a_total: tier3a,
                tier_3b_total: tier3b,
                tier_6_total: tier6,
                verification_code: verificationCode,
                kernel_version: KERNEL_VERSION,
            };

            const saveResponse = await fetch('/api/certificates', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(certificateData),
            });

            if (!saveResponse.ok) {
                // Check if limit reached (402 Payment Required)
                if (saveResponse.status === 402) {
                    const errorData = await saveResponse.json();
                    setError(`Free certificate limit reached (${errorData.usedCount}/${errorData.limit}). Upgrade to continue generating certificates.`);
                    setIsProcessing(false);
                    return;
                }
                console.warn('Failed to save certificate metadata');
                // Continue anyway for other errors - PDF generation is more important
            }

            // Generate PDF certificate
            const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5200';
            const response = await fetch(`${API_BASE}/api/prescribedpart/certificate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    netProperty: finalizationData.netFloatingChargeProperty - finalizationData.totalCosts,
                    floatingChargeDate: finalizationData.floatingChargeDate,
                    ipName: ipName,
                    inputHash: inputHash,
                    verificationCode: verificationCode,
                }),
            });

            if (!response.ok) throw new Error('Failed to generate certificate');

            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `FormalBridge_AuditCertificate_${verificationCode}.pdf`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            setStep('certificate');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Certificate generation failed');
        } finally {
            setIsProcessing(false);
        }
    }, [finalizationData, prescribedPartResult, ipName, inputHash, creditors, user]);

    const handleGenerateCertificate = useCallback(async () => {
        if (!creditors.length) return;
        setIsProcessing(true);
        try {
            const totalClaims = creditors.reduce((sum, c) => sum + c.amount, 0);
            const netProperty = totalClaims;
            const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5200';
            const response = await fetch(`${API_BASE}/api/prescribedpart/certificate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ netProperty, floatingChargeDate: new Date().toISOString() }),
            });
            if (!response.ok) throw new Error('Failed to generate certificate');
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `FormalBridge_Certificate_${Date.now()}.pdf`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            setStep('certificate');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Certificate generation failed');
        } finally {
            setIsProcessing(false);
        }
    }, [creditors]);

    const handleReset = () => {
        setStep('upload');
        setSpreadsheet(null);
        setCreditors([]);
        setAnalysisResult(null);
        setInputHash('');
        setError(null);
        setFinalizationData(null);
        setIpName('');
        setPrescribedPartResult(null);
    };

    return (
        <main className="bg-midnight min-h-screen selection:bg-teal selection:text-midnight relative">
            <div className="fixed inset-0 z-0">
                <DataPlaneBackground />
            </div>

            <div className="relative z-10 text-white">
                <Navbar />

                <section className="pt-40 pb-20 px-6">
                    <div className="max-w-4xl mx-auto">

                        {/* Header */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-16"
                        >
                            <Link
                                href="/portal"
                                className="inline-flex items-center gap-2 text-slate-500 hover:text-white transition-colors mb-10 text-sm font-light"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Back to Portal
                            </Link>

                            <span className="text-teal font-mono tracking-widest text-sm font-medium block">
                                S.176A STATUTORY AUDIT
                            </span>
                            <h1 className="text-4xl md:text-5xl font-light text-white mt-4 leading-tight">
                                Statutory Distribution<span className="font-medium"> Audit</span>
                            </h1>
                            <p className="text-lg text-slate-400 font-light mt-4 max-w-xl">
                                Upload your creditor list. We verify classifications, calculate the Prescribed Part, and generate your Audit Certificate.
                            </p>
                            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-amber-900/20 border border-amber-700/30 rounded">
                                <span className="text-amber-400 text-sm font-medium">
                                    £50.00 | Category 1 Estate Expense (SIP 9 Compliant)
                                </span>
                            </div>
                        </motion.div>

                        {/* Progress Steps */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className="mb-12"
                        >
                            <div className="flex items-center">
                                {steps.map((s, i) => (
                                    <div key={s.id} className="flex items-center flex-1 last:flex-initial">
                                        <div className="flex flex-col items-center">
                                            <div className={`
                                                w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono
                                                ${currentStepIndex >= i
                                                    ? 'bg-teal text-midnight'
                                                    : 'border border-slate-700 text-slate-600'}
                                            `}>
                                                {i + 1}
                                            </div>
                                            <span className={`mt-2 text-xs font-light ${currentStepIndex >= i ? 'text-slate-300' : 'text-slate-600'}`}>
                                                {s.label}
                                            </span>
                                        </div>
                                        {i < steps.length - 1 && (
                                            <div className={`flex-1 h-px mx-4 ${currentStepIndex > i ? 'bg-teal/50' : 'bg-slate-800'}`} />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Error Display */}
                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="mb-8 p-4 border border-red-500/30 text-red-400 text-sm font-light"
                                >
                                    {error}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Main Content */}
                        <AnimatePresence mode="wait">
                            {step === 'upload' && (
                                <motion.div
                                    key="upload"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.4 }}
                                >
                                    {/* Usage Indicator */}
                                    {usageData && (
                                        <div className={`mb-8 p-4 border ${usageData.hasReachedLimit
                                            ? 'border-red-500/30 bg-red-500/5'
                                            : usageData.remainingFree === 1
                                                ? 'border-amber-500/30 bg-amber-500/5'
                                                : 'border-slate-800/50'
                                            }`}>
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    {usageData.hasReachedLimit ? (
                                                        <>
                                                            <span className="text-red-400 font-medium">Free certificate limit reached</span>
                                                            <p className="text-xs text-slate-500 mt-1">
                                                                You have used all 3 free certificates. Upgrade to continue.
                                                            </p>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <span className="text-slate-400 font-light">
                                                                <span className="text-teal font-medium">{usageData.remainingFree}</span>
                                                                {' '}of 3 free certificates remaining
                                                            </span>
                                                            {usageData.remainingFree === 1 && (
                                                                <p className="text-xs text-amber-400 mt-1">
                                                                    This is your last free certificate
                                                                </p>
                                                            )}
                                                        </>
                                                    )}
                                                </div>
                                                <div className="flex gap-1">
                                                    {[1, 2, 3].map((i) => (
                                                        <div
                                                            key={i}
                                                            className={`w-3 h-3 rounded-full ${i <= usageData.usedCount
                                                                ? 'bg-teal'
                                                                : 'border border-slate-700'
                                                                }`}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {usageData?.hasReachedLimit ? (
                                        <div className="text-center py-12">
                                            <p className="text-slate-400 mb-4">Upgrade to generate unlimited certificates</p>
                                            <Link
                                                href="/portal/early-access"
                                                className="inline-flex items-center gap-2 px-6 py-3 bg-teal text-midnight font-medium hover:bg-white transition-colors"
                                            >
                                                Join Early Access Waitlist
                                            </Link>
                                        </div>
                                    ) : (
                                        <ExcelDropzone onParsed={handleParsed} onError={setError} />
                                    )}

                                    <div className="mt-12 grid md:grid-cols-3 gap-8 border-t border-slate-800/50 pt-12">
                                        <div>
                                            <h3 className="text-sm text-slate-400 font-medium mb-2">Crown Preference</h3>
                                            <p className="text-xs text-slate-600 font-light leading-relaxed">
                                                Detects HMRC, VAT, PAYE, NIC claims incorrectly listed as unsecured.
                                            </p>
                                        </div>
                                        <div>
                                            <h3 className="text-sm text-slate-400 font-medium mb-2">Wages Threshold</h3>
                                            <p className="text-xs text-slate-600 font-light leading-relaxed">
                                                Verifies £800 preferential cap and correct tier classification.
                                            </p>
                                        </div>
                                        <div>
                                            <h3 className="text-sm text-slate-400 font-medium mb-2">Zero Retention</h3>
                                            <p className="text-xs text-slate-600 font-light leading-relaxed">
                                                All processing happens locally. Data purged immediately.
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {step === 'mapping' && spreadsheet && (
                                <motion.div
                                    key="mapping"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.4 }}
                                >
                                    <ColumnMappingWizard
                                        data={spreadsheet}
                                        onComplete={handleMappingComplete}
                                        onCancel={handleReset}
                                    />
                                </motion.div>
                            )}

                            {step === 'integrity' && integrityReport && (
                                <motion.div
                                    key="integrity"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.4 }}
                                >
                                    <DataIntegrityReportUI
                                        report={integrityReport}
                                        onProceed={handleIntegrityProceed}
                                        onBack={handleIntegrityBack}
                                    />
                                </motion.div>
                            )}

                            {step === 'analysis' && analysisResult && (
                                <motion.div
                                    key="analysis"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.4 }}
                                >
                                    <RiskReport
                                        result={analysisResult}
                                        creditors={creditors}
                                        onAutoCorrect={handleAutoCorrect}
                                        onGenerateCertificate={handleContinueToFinalization}
                                        isProcessing={isProcessing}
                                    />

                                    {inputHash && (
                                        <div className="mt-8 pt-6 border-t border-slate-800/50">
                                            <p className="text-xs text-slate-600 font-light">
                                                <span className="text-slate-500">Input Hash:</span>{' '}
                                                <span className="font-mono">{inputHash.slice(0, 24)}...{inputHash.slice(-8)}</span>
                                            </p>
                                        </div>
                                    )}
                                </motion.div>
                            )}

                            {step === 'finalization' && (
                                <motion.div
                                    key="finalization"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.4 }}
                                >
                                    <FinalizationStep
                                        onComplete={handleFinalizationComplete}
                                        onBack={() => setStep('analysis')}
                                        totalClaimsAnalyzed={creditors.length}
                                    />
                                </motion.div>
                            )}

                            {step === 'attestation' && finalizationData && prescribedPartResult && (
                                <motion.div
                                    key="attestation"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.4 }}
                                    className="space-y-8"
                                >
                                    <WaterfallSummary
                                        netFloatingChargeProperty={finalizationData.netFloatingChargeProperty}
                                        totalCosts={finalizationData.totalCosts}
                                        floatingChargeDate={finalizationData.floatingChargeDate}
                                        prescribedPart={prescribedPartResult.prescribedPart}
                                        capApplied={prescribedPartResult.cap}
                                        tiersBreakdown={{
                                            tier3a: creditors.filter(c => c.currentTier === '3a').reduce((s, c) => s + c.amount, 0),
                                            tier3b: creditors.filter(c => c.currentTier === '3b').reduce((s, c) => s + c.amount, 0),
                                            tier6: creditors.filter(c => c.currentTier === '6').reduce((s, c) => s + c.amount, 0),
                                        }}
                                        isDeMinimisApplied={prescribedPartResult.isDeMinimisApplied}
                                        isNilDistribution={prescribedPartResult.isNilDistribution}
                                    />
                                    <AttestationStep
                                        ipName={ipName}
                                        onIpNameChange={setIpName}
                                        onComplete={handleAttestationComplete}
                                        onBack={() => setStep('finalization')}
                                        isProcessing={isProcessing}
                                    />
                                </motion.div>
                            )}

                            {step === 'certificate' && (
                                <motion.div
                                    key="certificate"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-center py-20 border border-slate-800/50"
                                >
                                    <div className="text-teal font-mono text-sm tracking-widest mb-6">
                                        AUDIT COMPLETE
                                    </div>
                                    <h2 className="text-3xl font-light text-white mb-4">
                                        Audit Certificate Generated
                                    </h2>
                                    <p className="text-slate-400 font-light mb-12 max-w-md mx-auto">
                                        Your audit certificate has been downloaded. All creditor data has been purged.
                                    </p>
                                    <button
                                        onClick={handleReset}
                                        className="inline-flex items-center gap-3 px-8 py-4 bg-teal text-midnight font-medium hover:bg-white transition-colors"
                                    >
                                        Analyze Another File
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>

                    </div>
                </section>

                <Footer />
            </div>
        </main>
    );
}
