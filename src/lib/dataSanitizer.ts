/**
 * Data Sanitizer
 * 
 * Handles "Industrial Entropy" - the messy reality of creditor spreadsheets.
 * All sanitization is DISCLOSED, not hidden - maintaining audit trail integrity.
 * 
 * "Guided by Heuristics, Proven by Math"
 */

export interface SanitizationResult<T> {
    value: T;
    original: string;
    warnings: SanitizationWarning[];
    isValid: boolean;
    requiresReview: boolean;
}

export interface SanitizationWarning {
    type: 'info' | 'warning' | 'blocking';
    code: string;
    message: string;
    suggestion?: string;
}

// Non-deterministic patterns that BLOCK certification
const BLOCKING_PATTERNS = [
    /\btbc\b/i,           // "TBC", "TBC amount"
    /\bapprox\.?\b/i,     // "approx", "approx."
    /\bestimate[ds]?\b/i, // "estimated", "estimates"
    /\bsee\s+note/i,      // "See Note 4"
    /\bunknown\b/i,       // "unknown"
    /\bpending\b/i,       // "pending"
    /\btba\b/i,           // "To Be Advised"
    /\?/,                 // Contains question mark
];

// Currency symbols to strip
const CURRENCY_SYMBOLS = /[£$€¥]/g;

// Thousands separators and formatting
const NUMBER_FORMATTING = /,/g;

// Parentheses indicate negative (accounting style)
const NEGATIVE_PARENS = /^\s*\(([^)]+)\)\s*$/;

// Common UK date formats
const DATE_PATTERNS = [
    // DD/MM/YYYY or DD/MM/YY
    { pattern: /^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/, order: 'dmy' },
    // DD-MM-YYYY
    { pattern: /^(\d{1,2})-(\d{1,2})-(\d{2,4})$/, order: 'dmy' },
    // YYYY-MM-DD (ISO)
    { pattern: /^(\d{4})-(\d{1,2})-(\d{1,2})$/, order: 'ymd' },
    // "8 Jan 2026", "8th January 2026"
    { pattern: /^(\d{1,2})(?:st|nd|rd|th)?\s+([A-Za-z]+)\s+(\d{2,4})$/, order: 'dMy' },
    // "Jan 8, 2026"
    { pattern: /^([A-Za-z]+)\s+(\d{1,2}),?\s+(\d{2,4})$/, order: 'Mdy' },
];

const MONTH_NAMES: Record<string, number> = {
    'jan': 0, 'january': 0,
    'feb': 1, 'february': 1,
    'mar': 2, 'march': 2,
    'apr': 3, 'april': 3,
    'may': 4,
    'jun': 5, 'june': 5,
    'jul': 6, 'july': 6,
    'aug': 7, 'august': 7,
    'sep': 8, 'sept': 8, 'september': 8,
    'oct': 9, 'october': 9,
    'nov': 10, 'november': 10,
    'dec': 11, 'december': 11,
};

/**
 * Sanitize a monetary amount from various formats
 * Returns structured result with warnings for audit trail
 */
export function sanitizeAmount(value: string | number | null | undefined): SanitizationResult<number> {
    const original = String(value ?? '').trim();
    const warnings: SanitizationWarning[] = [];

    // Empty value
    if (!original || original === '') {
        return {
            value: 0,
            original,
            warnings: [{
                type: 'blocking',
                code: 'EMPTY_AMOUNT',
                message: 'Amount field is empty',
                suggestion: 'Enter a numeric value',
            }],
            isValid: false,
            requiresReview: true,
        };
    }

    // Already a number
    if (typeof value === 'number' && !isNaN(value)) {
        return { value, original, warnings: [], isValid: true, requiresReview: false };
    }

    // Check for blocking patterns (TBC, approx, etc.)
    for (const pattern of BLOCKING_PATTERNS) {
        if (pattern.test(original)) {
            return {
                value: 0,
                original,
                warnings: [{
                    type: 'blocking',
                    code: 'NON_DETERMINISTIC',
                    message: `Non-deterministic value: "${original}"`,
                    suggestion: 'Replace with exact numeric amount before certification',
                }],
                isValid: false,
                requiresReview: true,
            };
        }
    }

    let sanitized = original;

    // Track what we're stripping for audit trail
    if (CURRENCY_SYMBOLS.test(sanitized)) {
        warnings.push({
            type: 'info',
            code: 'CURRENCY_STRIPPED',
            message: 'Currency symbol removed',
        });
        sanitized = sanitized.replace(CURRENCY_SYMBOLS, '');
    }

    // Handle negative in parentheses: (5000) -> -5000
    const negativeMatch = sanitized.match(NEGATIVE_PARENS);
    if (negativeMatch) {
        warnings.push({
            type: 'warning',
            code: 'CONTRA_DETECTED',
            message: 'Negative/contra amount detected',
            suggestion: 'Verify this represents a contra entry or credit balance',
        });
        sanitized = '-' + negativeMatch[1];
    }

    // Remove thousands separators
    if (NUMBER_FORMATTING.test(sanitized)) {
        sanitized = sanitized.replace(NUMBER_FORMATTING, '');
    }

    // Remove any remaining non-numeric except decimal point and minus
    sanitized = sanitized.replace(/[^\d.\-]/g, '');

    // Parse the number
    const parsed = parseFloat(sanitized);

    if (isNaN(parsed)) {
        return {
            value: 0,
            original,
            warnings: [{
                type: 'blocking',
                code: 'PARSE_FAILED',
                message: `Could not parse "${original}" as a number`,
                suggestion: 'Enter a valid numeric amount',
            }],
            isValid: false,
            requiresReview: true,
        };
    }

    // Zero amount warning
    if (parsed === 0) {
        warnings.push({
            type: 'warning',
            code: 'ZERO_AMOUNT',
            message: 'Amount is zero',
            suggestion: 'Verify this is intentional (e.g., fully paid claim)',
        });
    }

    // Negative amount warning
    if (parsed < 0) {
        warnings.push({
            type: 'warning',
            code: 'NEGATIVE_AMOUNT',
            message: 'Negative amount - may require netting before distribution',
            suggestion: 'Review contra entries with IP before proceeding',
        });
    }

    return {
        value: parsed,
        original,
        warnings,
        isValid: true,
        requiresReview: warnings.some(w => w.type === 'warning'),
    };
}

/**
 * Normalize date from various UK formats
 */
export function normalizeDate(value: string | null | undefined): SanitizationResult<Date | null> {
    const original = String(value ?? '').trim();
    const warnings: SanitizationWarning[] = [];

    if (!original) {
        return {
            value: null,
            original,
            warnings: [{
                type: 'blocking',
                code: 'EMPTY_DATE',
                message: 'Date field is empty',
            }],
            isValid: false,
            requiresReview: true,
        };
    }

    // Try each pattern
    for (const { pattern, order } of DATE_PATTERNS) {
        const match = original.match(pattern);
        if (match) {
            let day: number, month: number, year: number;

            if (order === 'dmy') {
                day = parseInt(match[1], 10);
                month = parseInt(match[2], 10) - 1; // 0-indexed
                year = parseInt(match[3], 10);
            } else if (order === 'ymd') {
                year = parseInt(match[1], 10);
                month = parseInt(match[2], 10) - 1;
                day = parseInt(match[3], 10);
            } else if (order === 'dMy') {
                day = parseInt(match[1], 10);
                month = MONTH_NAMES[match[2].toLowerCase().slice(0, 3)] ?? 0;
                year = parseInt(match[3], 10);
            } else if (order === 'Mdy') {
                month = MONTH_NAMES[match[1].toLowerCase().slice(0, 3)] ?? 0;
                day = parseInt(match[2], 10);
                year = parseInt(match[3], 10);
            } else {
                continue;
            }

            // Handle 2-digit years
            if (year < 100) {
                year += year < 50 ? 2000 : 1900;
                warnings.push({
                    type: 'info',
                    code: 'YEAR_INFERRED',
                    message: `2-digit year interpreted as ${year}`,
                });
            }

            const date = new Date(year, month, day);

            // Validate the date is real
            if (date.getDate() !== day || date.getMonth() !== month) {
                return {
                    value: null,
                    original,
                    warnings: [{
                        type: 'blocking',
                        code: 'INVALID_DATE',
                        message: `Invalid date: "${original}"`,
                    }],
                    isValid: false,
                    requiresReview: true,
                };
            }

            return {
                value: date,
                original,
                warnings,
                isValid: true,
                requiresReview: warnings.length > 0,
            };
        }
    }

    return {
        value: null,
        original,
        warnings: [{
            type: 'blocking',
            code: 'UNRECOGNIZED_FORMAT',
            message: `Could not parse date: "${original}"`,
            suggestion: 'Use DD/MM/YYYY format',
        }],
        isValid: false,
        requiresReview: true,
    };
}

/**
 * Detect potential duplicate creditors
 */
export interface DuplicateGroup {
    type: 'exact_name' | 'similar_name' | 'exact_amount' | 'both';
    creditors: Array<{ rowNumber: number; name: string; amount: number }>;
    severity: 'warning' | 'info';
    message: string;
}

export function detectDuplicates(
    creditors: Array<{ rowNumber: number; name: string; amount: number }>
): DuplicateGroup[] {
    const groups: DuplicateGroup[] = [];

    // Normalize name for comparison
    const normalizeName = (name: string) =>
        name.toLowerCase().replace(/[^a-z0-9]/g, '');

    // Group by normalized name
    const nameGroups = new Map<string, typeof creditors>();
    for (const c of creditors) {
        const key = normalizeName(c.name);
        if (!nameGroups.has(key)) {
            nameGroups.set(key, []);
        }
        nameGroups.get(key)!.push(c);
    }

    // Find duplicates
    for (const [, group] of nameGroups) {
        if (group.length > 1) {
            // Check if amounts are also the same
            const amounts = new Set(group.map(c => c.amount));
            const hasSameAmount = amounts.size === 1;

            groups.push({
                type: hasSameAmount ? 'both' : 'exact_name',
                creditors: group,
                severity: hasSameAmount ? 'warning' : 'info',
                message: hasSameAmount
                    ? `Potential duplicate: ${group.length} entries for "${group[0].name}" with identical amounts (£${group[0].amount.toLocaleString()})`
                    : `Multiple entries for "${group[0].name}" with different amounts`,
            });
        }
    }

    return groups;
}

/**
 * Aggregate all data integrity issues for the Risk Report
 */
export interface DataIntegrityReport {
    totalRows: number;
    validRows: number;
    blockingIssues: number;
    warningIssues: number;
    infoIssues: number;
    duplicateGroups: DuplicateGroup[];
    amountIssues: Array<{
        rowNumber: number;
        creditorName: string;
        warning: SanitizationWarning;
    }>;
    canProceed: boolean;
    summary: string[];
}

export function generateIntegrityReport(
    creditors: Array<{
        rowNumber: number;
        name: string;
        rawAmount: string | number;
        sanitizedAmount: SanitizationResult<number>;
    }>
): DataIntegrityReport {
    const amountIssues: DataIntegrityReport['amountIssues'] = [];
    let blockingIssues = 0;
    let warningIssues = 0;
    let infoIssues = 0;

    for (const c of creditors) {
        for (const warning of c.sanitizedAmount.warnings) {
            if (warning.type === 'blocking') blockingIssues++;
            if (warning.type === 'warning') warningIssues++;
            if (warning.type === 'info') infoIssues++;

            if (warning.type !== 'info') {
                amountIssues.push({
                    rowNumber: c.rowNumber,
                    creditorName: c.name,
                    warning,
                });
            }
        }
    }

    const duplicateGroups = detectDuplicates(
        creditors.map(c => ({
            rowNumber: c.rowNumber,
            name: c.name,
            amount: c.sanitizedAmount.value,
        }))
    );

    const summary: string[] = [];
    if (blockingIssues > 0) {
        summary.push(`${blockingIssues} value${blockingIssues > 1 ? 's' : ''} require correction before certification`);
    }
    if (warningIssues > 0) {
        summary.push(`${warningIssues} item${warningIssues > 1 ? 's' : ''} flagged for review`);
    }
    if (duplicateGroups.length > 0) {
        summary.push(`${duplicateGroups.length} potential duplicate${duplicateGroups.length > 1 ? 's' : ''} detected`);
    }
    if (summary.length === 0) {
        summary.push('All values validated successfully');
    }

    return {
        totalRows: creditors.length,
        validRows: creditors.filter(c => c.sanitizedAmount.isValid).length,
        blockingIssues,
        warningIssues,
        infoIssues,
        duplicateGroups,
        amountIssues,
        canProceed: blockingIssues === 0,
        summary,
    };
}
