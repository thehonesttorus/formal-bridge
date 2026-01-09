/**
 * Certificate Storage Types
 * 
 * These types define the data stored in Supabase for certificate metadata.
 * Following Zero-Retention Architecture: we store only metadata + hashes,
 * never the actual creditor data.
 */

export interface CertificateRecord {
    id: string;
    created_at: string;
    user_id: string;              // Clerk user ID
    user_email: string;           // For display purposes

    // Case identification
    case_reference?: string;      // Optional case reference
    ip_name: string;              // Attesting IP name
    attested_by?: string;         // If on behalf of IP

    // Input verification (Zero-Retention: hash only, no data)
    input_file_hash: string;      // SHA-256 of original Excel file
    creditor_count: number;       // Number of creditors analyzed

    // Calculation results (can regenerate from these)
    net_floating_charge_property: number;
    floating_charge_date: string;
    total_costs: number;
    insolvency_commencement_date: string;
    prescribed_part: number;
    cap_applied: number;
    is_de_minimis_applied: boolean;
    is_nil_distribution: boolean;

    // Tier summaries
    tier_3a_total: number;
    tier_3b_total: number;
    tier_6_total: number;

    // Verification
    verification_code: string;    // Unique code for verification page
    kernel_version: string;       // InsolvencyLib kernel version
}

export interface CertificateInsert {
    user_id: string;
    user_email: string;
    case_reference?: string;
    ip_name: string;
    attested_by?: string;
    input_file_hash: string;
    creditor_count: number;
    net_floating_charge_property: number;
    floating_charge_date: string;
    total_costs: number;
    insolvency_commencement_date: string;
    prescribed_part: number;
    cap_applied: number;
    is_de_minimis_applied: boolean;
    is_nil_distribution: boolean;
    tier_3a_total: number;
    tier_3b_total: number;
    tier_6_total: number;
    verification_code: string;
    kernel_version: string;
}

export interface Database {
    public: {
        Tables: {
            certificates: {
                Row: CertificateRecord;
                Insert: CertificateInsert;
                Update: Partial<CertificateInsert>;
            };
        };
    };
}
