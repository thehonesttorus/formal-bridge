import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    // Return a null-safe client during build time when env vars aren't available
    if (!supabaseUrl || !supabaseAnonKey) {
        // During SSR/build, return a dummy client that will be replaced on hydration
        // This prevents the build from failing
        return createBrowserClient(
            'https://placeholder.supabase.co',
            'placeholder-key'
        );
    }

    return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
