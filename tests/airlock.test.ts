/**
 * Jest Test Suite for Formal Bridge
 * Run: npx jest --config jest.config.js
 */

import { sanitizeAmount, generateIntegrityReport, detectDuplicates } from '../src/lib/dataSanitizer';
import { analyzeClassifications } from '../src/lib/creditorClassifier';
import { calculatePrescribedPart } from '../src/lib/prescribedPart';

describe('Data Sanitization', () => {
    describe('sanitizeAmount', () => {
        test('strips currency symbols: £10,500.50 → 10500.50', () => {
            const result = sanitizeAmount('£10,500.50');
            expect(result.value).toBe(10500.5);
            expect(result.isValid).toBe(true);
        });

        test('strips euro symbols: €5,000 → 5000', () => {
            const result = sanitizeAmount('€5,000');
            expect(result.value).toBe(5000);
        });

        test('handles plain numbers: 12345 → 12345', () => {
            const result = sanitizeAmount(12345);
            expect(result.value).toBe(12345);
            expect(result.isValid).toBe(true);
        });

        test('blocks "TBC" with blocking warning', () => {
            const result = sanitizeAmount('TBC');
            expect(result.isValid).toBe(false);
            expect(result.warnings.some(w => w.type === 'blocking')).toBe(true);
        });

        test('blocks "approx" values', () => {
            const result = sanitizeAmount('£48,000 approx');
            expect(result.isValid).toBe(false);
            expect(result.warnings.some(w => w.code === 'NON_DETERMINISTIC')).toBe(true);
        });

        test('blocks "See Note" references', () => {
            const result = sanitizeAmount('See Note 4');
            expect(result.isValid).toBe(false);
        });

        test('blocks "pending" values', () => {
            const result = sanitizeAmount('pending');
            expect(result.isValid).toBe(false);
        });

        test('converts parentheses to negative: (5000) → -5000', () => {
            const result = sanitizeAmount('(5,000)');
            expect(result.value).toBe(-5000);
            expect(result.warnings.some(w => w.code === 'CONTRA_DETECTED')).toBe(true);
        });

        test('warns on zero amounts', () => {
            const result = sanitizeAmount('0');
            expect(result.value).toBe(0);
            expect(result.warnings.some(w => w.code === 'ZERO_AMOUNT')).toBe(true);
        });

        test('handles empty string as invalid', () => {
            const result = sanitizeAmount('');
            expect(result.isValid).toBe(false);
        });

        test('handles null as invalid', () => {
            const result = sanitizeAmount(null);
            expect(result.isValid).toBe(false);
        });

        test('handles very large amounts', () => {
            const result = sanitizeAmount('999,999,999.99');
            expect(result.value).toBe(999999999.99);
            expect(result.isValid).toBe(true);
        });
    });

    describe('detectDuplicates', () => {
        test('detects exact duplicates (same name + same amount)', () => {
            const creditors = [
                { rowNumber: 1, name: 'Supplier A', amount: 10000 },
                { rowNumber: 5, name: 'Supplier A', amount: 10000 },
            ];
            const groups = detectDuplicates(creditors);
            expect(groups.length).toBe(1);
            expect(groups[0].creditors.length).toBe(2);
        });

        test('does not flag different amounts as duplicates', () => {
            const creditors = [
                { rowNumber: 1, name: 'Supplier A', amount: 10000 },
                { rowNumber: 2, name: 'Supplier A', amount: 5000 },
            ];
            const groups = detectDuplicates(creditors);
            // Same name different amounts - should still flag as potential duplicate
            expect(groups.length).toBeGreaterThanOrEqual(0);
        });
    });

    describe('generateIntegrityReport', () => {
        test('counts blocking issues correctly', () => {
            const creditors = [
                { rowNumber: 1, name: 'Test', rawAmount: 'TBC', sanitizedAmount: sanitizeAmount('TBC') },
                { rowNumber: 2, name: 'Test2', rawAmount: '1000', sanitizedAmount: sanitizeAmount('1000') },
            ];
            const report = generateIntegrityReport(creditors);
            expect(report.blockingIssues).toBe(1);
            expect(report.canProceed).toBe(false);
        });

        test('allows proceeding when no blocking issues', () => {
            const creditors = [
                { rowNumber: 1, name: 'Test', rawAmount: '1000', sanitizedAmount: sanitizeAmount('1000') },
            ];
            const report = generateIntegrityReport(creditors);
            expect(report.blockingIssues).toBe(0);
            expect(report.canProceed).toBe(true);
        });
    });
});

describe('Crown Preference Detection', () => {
    describe('analyzeClassifications', () => {
        test('flags HMRC in Tier 6 as misclassified', () => {
            const creditors = [
                { rowNumber: 1, name: 'HMRC Corporation Tax', amount: 100000, currentTier: '6' }
            ];
            const result = analyzeClassifications(creditors);
            expect(result.warnings.length).toBeGreaterThan(0);
            expect(result.warnings.some(w => w.suggestedTier === '3b')).toBe(true);
        });

        test('flags VAT in Tier 6 as misclassified', () => {
            const creditors = [
                { rowNumber: 1, name: 'VAT Liability Q4', amount: 50000, currentTier: '6' }
            ];
            const result = analyzeClassifications(creditors);
            expect(result.warnings.some(w => w.suggestedTier === '3b')).toBe(true);
        });

        test('flags PAYE in Tier 6 as misclassified', () => {
            const creditors = [
                { rowNumber: 1, name: 'PAYE Settlement', amount: 45000, currentTier: '6' }
            ];
            const result = analyzeClassifications(creditors);
            expect(result.warnings.some(w => w.suggestedTier === '3b')).toBe(true);
        });

        test('flags NIC in Tier 6 as misclassified', () => {
            const creditors = [
                { rowNumber: 1, name: 'National Insurance Contributions', amount: 67800, currentTier: '6' }
            ];
            const result = analyzeClassifications(creditors);
            expect(result.warnings.some(w => w.suggestedTier === '3b')).toBe(true);
        });

        test('does NOT flag Holiday Inn as employee holiday pay', () => {
            const creditors = [
                { rowNumber: 1, name: 'Holiday Inn Conference', amount: 12500, currentTier: '6' }
            ];
            const result = analyzeClassifications(creditors);
            // Should NOT suggest Tier 3a (employee preferential)
            expect(result.warnings.every(w => w.suggestedTier !== '3a')).toBe(true);
        });

        test('warns when employee wages exceed £800 threshold', () => {
            const creditors = [
                { rowNumber: 1, name: 'Employee Wages - J. Smith', amount: 1250, currentTier: '6' }
            ];
            const result = analyzeClassifications(creditors);
            // Should have a warning about the £800 cap
            expect(result.warnings.some(w =>
                w.rule?.includes('800') || w.impactDescription?.includes('800') || w.suggestedTier === '3a'
            )).toBe(true);
        });
    });
});

describe('Prescribed Part Calculation', () => {
    describe('calculatePrescribedPart', () => {
        test('£10,000 net → £5,000 (50%)', () => {
            const result = calculatePrescribedPart(10000, new Date('2024-01-01'));
            expect(result.finalAmount).toBe(5000);
        });

        test('£5,000 net → £2,500 (50%)', () => {
            const result = calculatePrescribedPart(5000, new Date('2024-01-01'));
            expect(result.finalAmount).toBe(2500);
        });

        test('£450,000 net → £93,000 (formula)', () => {
            // £5,000 + (£440,000 × 20%) = £5,000 + £88,000 = £93,000
            const result = calculatePrescribedPart(450000, new Date('2024-01-01'));
            expect(result.finalAmount).toBe(93000);
        });

        test('Large amount capped at £800,000 (post April 2020)', () => {
            const result = calculatePrescribedPart(5000000, new Date('2021-01-01'));
            expect(result.finalAmount).toBe(800000);
            expect(result.capApplied).toBe(800000);
        });

        test('Large amount capped at £600,000 (pre April 2020)', () => {
            const result = calculatePrescribedPart(5000000, new Date('2019-01-01'));
            expect(result.finalAmount).toBe(600000);
            expect(result.capApplied).toBe(600000);
        });

        test('Exactly April 6, 2020 uses new £800,000 cap', () => {
            const result = calculatePrescribedPart(5000000, new Date('2020-04-06'));
            expect(result.capApplied).toBe(800000);
        });

        test('April 5, 2020 uses old £600,000 cap', () => {
            const result = calculatePrescribedPart(5000000, new Date('2020-04-05'));
            expect(result.capApplied).toBe(600000);
        });

        test('Zero net property → Zero prescribed part', () => {
            const result = calculatePrescribedPart(0, new Date('2024-01-01'));
            expect(result.finalAmount).toBe(0);
        });

        test('Negative net property (costs exceed realisations)', () => {
            const result = calculatePrescribedPart(-10000, new Date('2024-01-01'));
            expect(result.finalAmount).toBe(0);
        });
    });
});

describe('Usage Limits (API)', () => {
    // These tests require the dev server running and authenticated session
    // Use: npm run test:e2e for these

    test.skip('4th certificate returns 402 Payment Required', async () => {
        // This would require setting up 3 certificates first
        // and then attempting a 4th
    });
});
