import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    // Debug: Log what we have (only in development)
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
        console.log('[Supabase] Creating client:', {
            hasUrl: !!supabaseUrl,
            hasKey: !!supabaseAnonKey,
            urlPreview: supabaseUrl?.substring(0, 30) + '...',
        });
    }

    // NEXT_PUBLIC_ vars should always be available (inlined at build time)
    // If missing, something is wrong with the build configuration
    if (!supabaseUrl || !supabaseAnonKey) {
        // Check if we're on server during build - return a stub that won't be used
        if (typeof window === 'undefined') {
            // Server-side: return a stub (won't be called, just for type safety)
            return {} as ReturnType<typeof createBrowserClient>;
        }

        // Client-side: this is a real problem
        console.error('[Supabase] Environment variables missing at runtime!', {
            NEXT_PUBLIC_SUPABASE_URL: supabaseUrl ? 'set' : 'MISSING',
            NEXT_PUBLIC_SUPABASE_ANON_KEY: supabaseAnonKey ? 'set' : 'MISSING',
        });
        throw new Error(
            'Supabase not configured. Please redeploy: Netlify → Deploys → Clear cache and deploy'
        );
    }

    return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
