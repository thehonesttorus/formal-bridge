import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import type { CertificateInsert } from '@/lib/database.types';

const FREE_CERTIFICATE_LIMIT = 3;

/**
 * POST /api/certificates
 * Save certificate metadata to Supabase
 * Enforces 3 free certificate limit per user
 */
export async function POST(request: NextRequest) {
    try {
        // Get authenticated user from Supabase
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const userId = user.id;

        // Parse request body
        const body: CertificateInsert = await request.json();

        // Verify user_id matches authenticated user
        if (body.user_id !== userId) {
            return NextResponse.json({ error: 'User ID mismatch' }, { status: 403 });
        }

        // Check usage limit BEFORE allowing new certificate
        const { count, error: countError } = await supabase
            .from('certificates')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', userId);

        if (countError) {
            console.error('Supabase count error:', countError);
            return NextResponse.json({ error: 'Failed to check usage' }, { status: 500 });
        }

        const usedCount = count || 0;
        if (usedCount >= FREE_CERTIFICATE_LIMIT) {
            return NextResponse.json({
                error: 'Free certificate limit reached',
                usedCount,
                limit: FREE_CERTIFICATE_LIMIT,
                upgradeRequired: true
            }, { status: 402 }); // 402 Payment Required
        }

        // Insert certificate
        const { data, error } = await supabase
            .from('certificates')
            .insert(body)
            .select()
            .single();

        if (error) {
            console.error('Supabase insert error:', error);
            return NextResponse.json({ error: 'Failed to save certificate' }, { status: 500 });
        }

        const newUsedCount = usedCount + 1;
        const remainingFree = FREE_CERTIFICATE_LIMIT - newUsedCount;

        return NextResponse.json({
            success: true,
            certificate: data,
            verificationUrl: `/verify/${data.verification_code}`,
            usage: {
                usedCount: newUsedCount,
                remainingFree,
                limit: FREE_CERTIFICATE_LIMIT,
                showUpgradePrompt: remainingFree <= 1
            }
        });
    } catch (error) {
        console.error('Certificate save error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

/**
 * GET /api/certificates
 * Retrieve all certificates for the authenticated user
 */
export async function GET() {
    try {
        // Get authenticated user from Supabase
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const userId = user.id;

        // Query certificates
        const { data, error } = await supabase
            .from('certificates')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Supabase query error:', error);
            return NextResponse.json({ error: 'Failed to fetch certificates' }, { status: 500 });
        }

        return NextResponse.json({ certificates: data });
    } catch (error) {
        console.error('Certificate fetch error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
