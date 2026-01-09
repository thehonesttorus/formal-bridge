/**
 * PII Stripper
 * 
 * Removes toxic personally identifiable information from spreadsheet data
 * before it leaves the browser.
 * 
 * REMOVES:
 * - Addresses (postcode patterns)
 * - Bank details (sort codes, account numbers)
 * - Phone numbers
 * - Email addresses
 * 
 * KEEPS:
 * - Creditor names (needed for certificate)
 * - Amounts
 * - Dates
 * - Claim types/classifications
 */

// Patterns for detecting PII columns
const PII_PATTERNS = {
    // UK postcode pattern
    postcode: /\b[A-Z]{1,2}\d{1,2}[A-Z]?\s*\d[A-Z]{2}\b/i,

    // UK sort code (00-00-00)
    sortCode: /\b\d{2}[-\s]?\d{2}[-\s]?\d{2}\b/,

    // Bank account number (8 digits)
    accountNumber: /\b\d{8}\b/,

    // Phone number
    phone: /\b(0\d{10}|\+44\s?\d{10}|\d{4}\s\d{3}\s\d{4})\b/,

    // Email
    email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/,

    // IBAN
    iban: /\b[A-Z]{2}\d{2}[A-Z0-9]{1,30}\b/,
};

// Column names that likely contain PII
const PII_COLUMN_NAMES = [
    'address', 'addr', 'street', 'road', 'postcode', 'post code', 'zip',
    'sort code', 'sortcode', 'account number', 'account no', 'bank account',
    'phone', 'telephone', 'mobile', 'fax',
    'email', 'e-mail', 'e mail',
    'iban', 'bic', 'swift',
    'national insurance', 'ni number', 'nino',
];

export interface SpreadsheetRow {
    [key: string]: string | number | null;
}

export interface StripResult {
    cleanedData: SpreadsheetRow[];
    strippedColumns: string[];
    warnings: string[];
}

/**
 * Check if a column name suggests it contains PII
 */
function isPiiColumnName(columnName: string): boolean {
    const lower = columnName.toLowerCase();
    return PII_COLUMN_NAMES.some(pii => lower.includes(pii));
}

/**
 * Check if a value contains PII patterns
 */
function containsPiiPattern(value: string): boolean {
    if (typeof value !== 'string') return false;

    return Object.values(PII_PATTERNS).some(pattern => pattern.test(value));
}

/**
 * Analyze columns to identify which contain PII
 */
export function identifyPiiColumns(data: SpreadsheetRow[]): string[] {
    if (!data.length) return [];

    const columns = Object.keys(data[0]);
    const piiColumns: string[] = [];

    for (const col of columns) {
        // Check column name
        if (isPiiColumnName(col)) {
            piiColumns.push(col);
            continue;
        }

        // Sample first 10 rows for pattern detection
        const sampleRows = data.slice(0, 10);
        const hasPii = sampleRows.some(row => {
            const value = row[col];
            return typeof value === 'string' && containsPiiPattern(value);
        });

        if (hasPii) {
            piiColumns.push(col);
        }
    }

    return piiColumns;
}

/**
 * Strip PII columns from spreadsheet data
 */
export function stripPii(data: SpreadsheetRow[]): StripResult {
    if (!data.length) {
        return { cleanedData: [], strippedColumns: [], warnings: [] };
    }

    const piiColumns = identifyPiiColumns(data);
    const warnings: string[] = [];

    // Warn about columns we're stripping
    if (piiColumns.length > 0) {
        warnings.push(`Stripped ${piiColumns.length} columns containing sensitive data: ${piiColumns.join(', ')}`);
    }

    // Remove PII columns from each row
    const cleanedData = data.map(row => {
        const cleanRow: SpreadsheetRow = {};
        for (const [key, value] of Object.entries(row)) {
            if (!piiColumns.includes(key)) {
                cleanRow[key] = value;
            }
        }
        return cleanRow;
    });

    return {
        cleanedData,
        strippedColumns: piiColumns,
        warnings,
    };
}

/**
 * Get safe columns (non-PII) from column list
 */
export function getSafeColumns(columns: string[]): string[] {
    return columns.filter(col => !isPiiColumnName(col));
}
