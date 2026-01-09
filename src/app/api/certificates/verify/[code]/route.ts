import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

interface RouteParams {
    params: Promise<{ code: string }>;
}

/**
 * GET /api/certificates/verify/[code]
 * Public endpoint to verify a certificate by its verification code
 */
export async function GET(
    request: NextRequest,
    { params }: RouteParams
) {
    try {
        const { code } = await params;

        if (!code) {
            return NextResponse.json({ error: 'Missing verification code' }, { status: 400 });
        }

        // Create Supabase client and query
        const supabase = await createClient();
        const { data, error } = await supabase
            .from('certificates')
            .select(`
                id,
                created_at,
                ip_name,
                attested_by,
                input_file_hash,
                creditor_count,
                net_floating_charge_property,
                floating_charge_date,
                prescribed_part,
                cap_applied,
                is_de_minimis_applied,
                is_nil_distribution,
                verification_code,
                kernel_version
            `)
            .eq('verification_code', code)
            .single();

        if (error || !data) {
            return NextResponse.json({
                valid: false,
                error: 'Certificate not found'
            }, { status: 404 });
        }

        return NextResponse.json({
            valid: true,
            certificate: {
                createdAt: data.created_at,
                ipName: data.ip_name,
                attestedBy: data.attested_by,
                inputFileHash: data.input_file_hash,
                creditorCount: data.creditor_count,
                netFloatingChargeProperty: data.net_floating_charge_property,
                floatingChargeDate: data.floating_charge_date,
                prescribedPart: data.prescribed_part,
                capApplied: data.cap_applied,
                isDeMinimisApplied: data.is_de_minimis_applied,
                isNilDistribution: data.is_nil_distribution,
                verificationCode: data.verification_code,
                kernelVersion: data.kernel_version,
            }
        });
    } catch (error) {
        console.error('Certificate verification error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
