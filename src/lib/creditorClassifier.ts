/**
 * Creditor Classifier
 * 
 * Finance Act 2020 compliance heuristics for detecting
 * misclassified creditors in insolvency distributions.
 * 
 * STATUTORY TIERS (Insolvency Act 1986):
 * - Tier 1: Fixed Charge Holders
 * - Tier 2: Preferential Creditors (pre-FA2020)
 * - Tier 3a: Preferential Creditors (employees)
 * - Tier 3b: Secondary Preferential (Crown - FA2020)
 * - Tier 4: Prescribed Part (S.176A)
 * - Tier 5: Floating Charge Holders
 * - Tier 6: Unsecured Creditors
 * - Tier 7: Statutory Interest
 * - Tier 8: Shareholders
 */

export type TierCode = '1' | '2' | '3a' | '3b' | '4' | '5' | '6' | '7' | '8';

export interface CreditorRow {
    rowNumber: number;
    name: string;
    amount: number;
    currentTier: TierCode | string;
}

export interface ClassificationWarning {
    rowNumber: number;
    creditorName: string;
    amount: number;
    currentTier: string;
    suggestedTier: TierCode;
    severity: 'critical' | 'warning' | 'info';
    rule: string;
    regulatoryBreach: string;
    impactDescription: string;
}

export interface ClassificationResult {
    warnings: ClassificationWarning[];
    totalAtRisk: number;
    crownGapTotal: number;
    wagesGapTotal: number;
    summary: {
        criticalCount: number;
        warningCount: number;
        infoCount: number;
    };
}

// Detection patterns for Finance Act 2020 compliance
const CROWN_PATTERNS = {
    hmrc: /\b(hmrc|h\.m\.r\.c\.?|hm\s*revenue|inland\s*revenue)\b/i,
    vat: /\b(vat|value\s*added\s*tax)\b/i,
    paye: /\b(paye|pay\s*as\s*you\s*earn)\b/i,
    cis: /\b(cis|construction\s*industry\s*scheme)\b/i,
    nationalInsurance: /\b(nic|national\s*insurance|ni\s*contributions?)\b/i,
};

const PREFERENTIAL_PATTERNS = {
    wages: /\b(wages?|salary|salaries|arrears\s*of\s*pay|employee\s*wages?)\b/i,
    holidayPay: /\b(holiday\s*pay|annual\s*leave|accrued\s*leave)\b/i,
    redundancy: /\b(redundancy|notice\s*pay|lieu\s*of\s*notice)\b/i,
    pension: /\b(pension\s*contributions?|occupational\s*pension|auto-?enrolment)\b/i,
};

const SECURED_PATTERNS = {
    bank: /\b(bank|mortgage|debenture|fixed\s*charge|security)\b/i,
};

// Company name indicators - if present, this is likely a company name, NOT a Crown debt
const COMPANY_NAME_INDICATORS = /\b(ltd|limited|plc|inc|incorporated|llp|services|solutions|consulting|consultants|group|holdings|agency|associates|partners)\b/i;

// Specific false positive patterns to exclude
const FALSE_POSITIVE_PATTERNS = [
    /holiday\s*inn/i,    // Holiday Inn Hotels
    /wageworks/i,        // Wageworks Ltd
];

// Tier normalization
function normalizeTier(tier: string): TierCode | null {
    const t = tier.toLowerCase().trim();

    // Direct matches
    if (['1', '2', '3a', '3b', '4', '5', '6', '7', '8'].includes(t)) {
        return t as TierCode;
    }

    // Common aliases
    if (t.includes('unsecured') || t.includes('ordinary')) return '6';
    if (t.includes('preferential') && !t.includes('secondary')) return '3a';
    if (t.includes('secondary') || t.includes('crown')) return '3b';
    if (t.includes('secured') || t.includes('fixed')) return '1';
    if (t.includes('floating')) return '5';

    return null;
}

/**
 * Check if this looks like a company name rather than a Crown debt
 */
function isLikelyCompanyName(name: string): boolean {
    // If it contains company indicators like "Ltd", "Inc", "Services", etc.
    if (COMPANY_NAME_INDICATORS.test(name)) {
        return true;
    }
    // Check for specific false positive patterns
    if (FALSE_POSITIVE_PATTERNS.some(p => p.test(name))) {
        return true;
    }
    return false;
}

/**
 * Check if a creditor name matches Crown Preference patterns (FA2020)
 * Excludes company names that happen to contain keywords
 */
function isCrownCreditor(name: string): boolean {
    // First, check if this looks like a company name - if so, exclude it
    if (isLikelyCompanyName(name)) {
        return false;
    }
    return Object.values(CROWN_PATTERNS).some(pattern => pattern.test(name));
}

/**
 * Check if a creditor name matches Employee Preferential patterns
 * Excludes company names
 */
function isEmployeePreferential(name: string): boolean {
    // Exclude company names
    if (isLikelyCompanyName(name)) {
        return false;
    }
    return (
        PREFERENTIAL_PATTERNS.wages.test(name) ||
        PREFERENTIAL_PATTERNS.holidayPay.test(name) ||
        PREFERENTIAL_PATTERNS.redundancy.test(name) ||
        PREFERENTIAL_PATTERNS.pension.test(name)
    );
}

/**
 * Detect specific Crown creditor type for detailed warnings
 */
function getCrownType(name: string): string {
    if (CROWN_PATTERNS.vat.test(name)) return 'VAT';
    if (CROWN_PATTERNS.paye.test(name)) return 'PAYE';
    if (CROWN_PATTERNS.cis.test(name)) return 'CIS';
    if (CROWN_PATTERNS.nationalInsurance.test(name)) return 'National Insurance';
    if (CROWN_PATTERNS.hmrc.test(name)) return 'HMRC';
    return 'Crown';
}

/**
 * Main classification analysis - detects compliance errors
 */
export function analyzeClassifications(creditors: CreditorRow[]): ClassificationResult {
    const warnings: ClassificationWarning[] = [];
    let crownGapTotal = 0;
    let wagesGapTotal = 0;

    for (const creditor of creditors) {
        const normalizedTier = normalizeTier(creditor.currentTier);

        // Rule 1: Crown Preference Gap (Finance Act 2020)
        // HMRC/VAT/PAYE/CIS claims listed as Unsecured should be Secondary Preferential
        if (isCrownCreditor(creditor.name)) {
            if (normalizedTier === '6') {
                const crownType = getCrownType(creditor.name);
                warnings.push({
                    rowNumber: creditor.rowNumber,
                    creditorName: creditor.name,
                    amount: creditor.amount,
                    currentTier: creditor.currentTier,
                    suggestedTier: '3b',
                    severity: 'critical',
                    rule: '[FA2020 s.98] Crown Preference Breach',
                    regulatoryBreach: `STATUTORY BREACH: ${crownType} identified in Tier 6 (Unsecured). Finance Act 2020 designates this as Tier 3b (Secondary Preferential).`,
                    impactDescription: `You are about to overpay Unsecured Creditors by £${creditor.amount.toLocaleString()}. This creates personal regulatory liability for the distributing Practitioner.`,
                });
                crownGapTotal += creditor.amount;
            }
        }

        // Rule 2: Employee Wages Gap
        // Wages should be Preferential (Tier 3a), but amounts >£800 per employee need splitting
        if (isEmployeePreferential(creditor.name)) {
            if (normalizedTier === '6') {
                warnings.push({
                    rowNumber: creditor.rowNumber,
                    creditorName: creditor.name,
                    amount: creditor.amount,
                    currentTier: creditor.currentTier,
                    suggestedTier: '3a',
                    severity: 'critical',
                    rule: '[IA1986 Sch.6] Preferential Creditor Breach',
                    regulatoryBreach: `STATUTORY BREACH: Employee claim identified in Tier 6 (Unsecured). Insolvency Act 1986 Schedule 6 designates this as Tier 3a (Preferential).`,
                    impactDescription: `£${creditor.amount.toLocaleString()} should rank ahead of Unsecured creditors. Incorrect distribution creates personal liability.`,
                });
                wagesGapTotal += creditor.amount;
            }

            // Warning for amounts that may need splitting (>£800 per employee)
            // Only warn if NOT already correctly classified as 3a (preferential)
            if (creditor.amount > 800 && PREFERENTIAL_PATTERNS.wages.test(creditor.name) && normalizedTier !== '3a') {
                const existingWarning = warnings.find(w => w.rowNumber === creditor.rowNumber);
                if (!existingWarning) {
                    warnings.push({
                        rowNumber: creditor.rowNumber,
                        creditorName: creditor.name,
                        amount: creditor.amount,
                        currentTier: creditor.currentTier,
                        suggestedTier: '3a',
                        severity: 'warning',
                        rule: '[IA1986 Sch.6 Para.9(c)] Wages Threshold',
                        regulatoryBreach: `Amount exceeds £800 preferential cap per employee under Para 9(c) Schedule 6.`,
                        impactDescription: `Excess above £800 may need to be split between Preferential (3a) and Unsecured (6).`,
                    });
                }
            }
        }
    }

    // Sort by severity (critical first)
    warnings.sort((a, b) => {
        const severityOrder = { critical: 0, warning: 1, info: 2 };
        return severityOrder[a.severity] - severityOrder[b.severity];
    });

    const summary = {
        criticalCount: warnings.filter(w => w.severity === 'critical').length,
        warningCount: warnings.filter(w => w.severity === 'warning').length,
        infoCount: warnings.filter(w => w.severity === 'info').length,
    };

    return {
        warnings,
        totalAtRisk: crownGapTotal + wagesGapTotal,
        crownGapTotal,
        wagesGapTotal,
        summary,
    };
}

/**
 * Auto-correct classifications based on detected warnings
 */
export function applyCorrections(
    creditors: CreditorRow[],
    warnings: ClassificationWarning[]
): CreditorRow[] {
    const correctionMap = new Map(
        warnings.map(w => [w.rowNumber, w.suggestedTier])
    );

    return creditors.map(creditor => {
        const correction = correctionMap.get(creditor.rowNumber);
        if (correction) {
            return { ...creditor, currentTier: correction };
        }
        return creditor;
    });
}

/**
 * Calculate true Net Property from classified creditors
 * Net Property = Total Assets - Fixed Charges - Liquidation Costs
 */
export function calculateNetProperty(
    totalAssets: number,
    creditors: CreditorRow[]
): { netProperty: number; fixedChargesTotal: number; preferentialTotal: number } {
    const fixedChargesTotal = creditors
        .filter(c => normalizeTier(c.currentTier) === '1')
        .reduce((sum, c) => sum + c.amount, 0);

    const preferentialTotal = creditors
        .filter(c => {
            const tier = normalizeTier(c.currentTier);
            return tier === '2' || tier === '3a' || tier === '3b';
        })
        .reduce((sum, c) => sum + c.amount, 0);

    // Net Property available for Prescribed Part = after Fixed Charges
    const netProperty = Math.max(0, totalAssets - fixedChargesTotal);

    return {
        netProperty,
        fixedChargesTotal,
        preferentialTotal,
    };
}
