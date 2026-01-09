import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const FREE_CERTIFICATE_LIMIT = 3;

/**
 * GET /api/usage
 * Get the current user's certificate usage count and remaining free certificates
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

        // Count certificates
        const { count, error } = await supabase
            .from('certificates')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', userId);

        if (error) {
            console.error('Supabase count error:', error);
            return NextResponse.json({ error: 'Failed to fetch usage' }, { status: 500 });
        }

        const usedCount = count || 0;
        const remainingFree = Math.max(0, FREE_CERTIFICATE_LIMIT - usedCount);
        const hasReachedLimit = usedCount >= FREE_CERTIFICATE_LIMIT;

        return NextResponse.json({
            usedCount,
            freeLimit: FREE_CERTIFICATE_LIMIT,
            remainingFree,
            hasReachedLimit,
            // Show upgrade prompt after first certificate
            showUpgradePrompt: usedCount >= 1,
        });
    } catch (error) {
        console.error('Usage fetch error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
