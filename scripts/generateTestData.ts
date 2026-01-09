/**
 * Test Data Generator for Forensic Airlock
 * 
 * Creates CSV test files with various edge cases to test
 * the creditor classification engine.
 * 
 * Run with: npx ts-node generateTestData.ts
 */

import * as fs from 'fs';
import * as path from 'path';

const outputDir = path.join(__dirname, '..', 'SampleData');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

function writeCSV(filename: string, headers: string[], rows: string[][]): void {
    const content = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    fs.writeFileSync(path.join(outputDir, filename), content);
    console.log(`Created: ${filename}`);
}

// ============================================
// TEST FILE 1: OBVIOUS CROWN PREFERENCE ERRORS
// ============================================
writeCSV('test_01_obvious_crown_errors.csv',
    ['Creditor Name', 'Amount', 'Classification'],
    [
        ['HMRC - VAT Liability', '15000', 'Unsecured'],        // OBVIOUS ERROR
        ['HMRC PAYE Outstanding', '8500', 'Unsecured'],        // OBVIOUS ERROR
        ['ABC Supplies Ltd', '4200', 'Unsecured'],             // Correct
        ['Construction Industry Scheme (CIS)', '3100', 'Unsecured'], // OBVIOUS ERROR
        ['British Gas Business', '890', 'Unsecured'],          // Correct
    ]
);

// ============================================
// TEST FILE 2: SUBTLE CROWN PREFERENCE ERRORS
// ============================================
writeCSV('test_02_subtle_crown_errors.csv',
    ['Creditor', 'Claim Amount', 'Type'],
    [
        ['HM Revenue & Customs', '12500', 'Ordinary'],         // Subtle: "Ordinary" = Unsecured
        ['Inland Revenue (legacy)', '5000', 'Trade'],          // Subtle: Old name, Trade = Unsecured
        ['V.A.T. Payable Account', '7800', 'General'],         // Subtle: Abbreviated, General class
        ['PAYE/NIC Arrears', '4200', 'Tier 6'],                // Subtle: Combined with NIC
        ['CIS Deductions Owing', '2100', 'Unsecured'],         // Subtle: "Deductions Owing"
        ['National Insurance Contributions', '3500', 'Unsecured'], // Should detect NIC
    ]
);

// ============================================
// TEST FILE 3: EMPLOYEE WAGE CLASSIFICATION
// ============================================
writeCSV('test_03_employee_wages.csv',
    ['Creditor Name', 'Amount', 'Current Tier'],
    [
        ['Employee Wages (Arrears)', '15000', 'Unsecured'],    // ERROR: Should be Preferential
        ['Staff Salaries Outstanding', '8200', 'Unsecured'],   // ERROR: Should be Preferential
        ['Holiday Pay Accrued', '3400', 'Unsecured'],          // ERROR: Should be Preferential
        ['Redundancy Payments', '12000', 'Unsecured'],         // ERROR: Should be Preferential
        ['Notice Pay in Lieu', '5500', 'Unsecured'],           // ERROR: Should be Preferential
        ['Pension Contributions', '2800', 'Unsecured'],        // ERROR: Should be Preferential
        ['Director Loan Account', '25000', 'Unsecured'],       // Correct: Not employee wages
    ]
);

// ============================================
// TEST FILE 4: £800 THRESHOLD EDGE CASES
// ============================================
writeCSV('test_04_800_threshold.csv',
    ['Creditor', 'Claim', 'Class'],
    [
        ['Employee A - Wages', '800', 'Preferential'],         // Exactly £800 - CORRECT
        ['Employee B - Wages', '801', 'Preferential'],         // £801 - NEEDS SPLIT WARNING
        ['Employee C - Wages', '2500', 'Preferential'],        // Above threshold
        ['Employee D - Wages', '799', 'Preferential'],         // Just under - CORRECT
        ['Wages General Pool', '45000', 'Preferential'],       // Large pool - NEEDS REVIEW
        ['Wages Arrears Multiple', '8000', 'Preferential'],    // Bulk amount
    ]
);

// ============================================
// TEST FILE 5: CORRECTLY CLASSIFIED (NO ERRORS)
// ============================================
writeCSV('test_05_all_correct.csv',
    ['Creditor Name', 'Amount', 'Tier'],
    [
        ['HMRC VAT', '12500', '3b'],                           // Correct: Secondary Preferential
        ['HMRC PAYE', '8000', '3b'],                           // Correct
        ['Employee Wages', '4500', '3a'],                      // Correct: Preferential
        ['Trade Creditor A', '15000', '6'],                    // Correct: Unsecured
        ['Trade Creditor B', '8200', '6'],                     // Correct
        ['Bank of England (Fixed)', '100000', '1'],            // Correct: Secured
        ['Floating Charge Holder', '50000', '5'],              // Correct
    ]
);

// ============================================
// TEST FILE 6: MIXED CASE & FORMATTING EDGE CASES
// ============================================
writeCSV('test_06_formatting_edge_cases.csv',
    ['CREDITOR', 'AMOUNT (£)', 'STATUS'],
    [
        ['hmrc', '5000', 'unsecured'],                         // Lowercase
        ['H.M.R.C.', '3200', 'UNSECURED'],                     // Periods between letters
        ['HmRc VaT', '2800', 'Unsecured'],                     // Mixed case weird
        ['  HMRC  ', '1500', ' Unsecured '],                   // Extra whitespace
        ['H M R C', '900', 'Unsecured'],                       // Spaces between letters
        ['HMRC-VAT-2024', '4100', 'Unsecured'],                // With dashes and year
        ['vat liability', '2200', 'trade'],                    // All lowercase VAT
    ]
);

// ============================================
// TEST FILE 7: POTENTIAL FALSE POSITIVES
// (Should NOT trigger Crown warnings)
// ============================================
writeCSV('test_07_false_positive_traps.csv',
    ['Creditor Name', 'Amount', 'Classification'],
    [
        ['HMRC Consulting Ltd', '5000', 'Unsecured'],           // Company NAME contains HMRC
        ['VAT Solutions Inc', '3200', 'Unsecured'],             // VAT is part of company name
        ['Mr P Aye', '1500', 'Unsecured'],                      // Name sounds like PAYE
        ['CIS Security Services', '8000', 'Unsecured'],         // CIS is company name
        ['The Private Clinic', '2100', 'Unsecured'],            // Contains "private" not "priv"
        ['Wageworks Ltd', '4500', 'Unsecured'],                 // Contains "wage" but is company
        ['Holiday Inn Hotels', '1200', 'Unsecured'],            // Contains "holiday" but is hotel
    ]
);

// ============================================
// TEST FILE 8: COMBINED REALISTIC SCENARIO
// ============================================
writeCSV('test_08_realistic_case.csv',
    ['Creditor', 'Amount Claimed', 'Current Classification'],
    [
        // Fixed Charge Holders
        ['Lloyds Bank plc (Debenture)', '250000', 'Secured - Fixed'],

        // Should be Secondary Preferential (3b)
        ['HMRC - VAT Q4 2023', '18500', 'Unsecured'],          // ERROR
        ['HMRC - PAYE/NIC Oct-Dec', '12300', 'Unsecured'],     // ERROR
        ['CIS Deductions Payable', '4200', 'Unsecured'],       // ERROR

        // Should be Preferential (3a)
        ['Employee Wages (12 staff)', '28500', 'Unsecured'],   // ERROR
        ['Holiday Pay Accrued', '6200', 'Unsecured'],          // ERROR
        ['Statutory Redundancy', '8400', 'Unsecured'],         // ERROR

        // Correctly classified as Unsecured
        ['ABC Office Supplies', '3400', 'Unsecured'],
        ['XYZ Logistics', '12000', 'Unsecured'],
        ['IT Services Ltd', '5600', 'Unsecured'],
        ['Commercial Landlord', '45000', 'Unsecured'],
        ['Professional Fees', '15000', 'Unsecured'],

        // Edge cases
        ['HMRC Interest on Late Payment', '890', 'Unsecured'], // ERROR - even interest
        ['Pension Auto-enrolment Arrears', '3100', 'Unsecured'], // ERROR
    ]
);

// ============================================
// TEST FILE 9: AMOUNT PARSING EDGE CASES
// ============================================
writeCSV('test_09_amount_parsing.csv',
    ['Creditor', 'Amount', 'Type'],
    [
        ['HMRC VAT', '"£12,500.00"', 'Unsecured'],             // Currency symbol + commas
        ['Employee Wages', '"12500"', 'Unsecured'],            // Just number
        ['Trade Creditor', '"£1,234.56"', 'Unsecured'],        // Pence
        ['Supplier A', '(5000)', 'Unsecured'],                 // Parentheses = negative?
        ['Supplier B', '-2500', 'Unsecured'],                  // Negative amount
        ['HMRC PAYE', '£0.00', 'Unsecured'],                   // Zero amount
    ]
);

// ============================================
// TEST FILE 10: REAL-WORLD MESSY DATA
// ============================================
writeCSV('test_10_messy_real_world.csv',
    ['Ref', 'Creditor Details', 'Balance O/S', 'Notes', 'Proposed Dist'],
    [
        ['001', 'HMRC (VAT acct 123456789)', '15234.56', 'Contested', 'Unsecured'],
        ['002', 'HMRC - PAYE Settlement Agreement', '8700', 'Agreed', 'Unsecured'],
        ['003', 'Wages - 15 employees (see schedule)', '32000', '', 'Unsecured'],
        ['004', 'Trade Creditors Various (see attached)', '45000', 'Pooled', 'Unsecured'],
        ['005', 'Accrued Holiday Pay per HR records', '5200', 'Verified', 'Unsecured'],
        ['006', 'Directors Loan - J Smith', '75000', 'Subordinated?', 'Unsecured'],
        ['007', 'CIS Tax w/h Q1-Q3 2024', '9800', 'HMRC confirmed', 'Unsecured'],
        ['008', 'NatWest (floating charge)', '180000', 'Registered', 'Floating'],
        ['009', 'Pension Regulator Levy', '2400', '', 'Unsecured'],
        ['010', 'Corp Tax Assessment (disputed)', '28000', 'Under appeal', 'Unsecured'],
    ]
);

console.log('\n✓ All test files created in SampleData/');
console.log('Load these into the Forensic Airlock to test edge cases.');
