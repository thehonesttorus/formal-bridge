import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client (server-side)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, email, firmName, casesPerMonth, currentSystem, notes, product } = body;

        // Validate required fields
        if (!name || !email) {
            return NextResponse.json(
                { error: 'Name and email are required' },
                { status: 400 }
            );
        }

        // If Supabase is configured, save to database
        if (supabaseUrl && supabaseServiceKey) {
            const supabase = createClient(supabaseUrl, supabaseServiceKey);

            const { error } = await supabase.from('waitlist').insert({
                name,
                email,
                firm_name: firmName || null,
                cases_per_month: casesPerMonth || null,
                current_system: currentSystem || null,
                notes: notes || null,
                product: product || 'full_waterfall',
            });

            if (error) {
                console.error('Supabase error:', error);
                // Don't fail the request - log and continue
            }
        } else {
            // Log to console if Supabase not configured
            console.log('📋 Waitlist signup (Supabase not configured):', {
                name,
                email,
                firmName,
                casesPerMonth,
                currentSystem,
                notes,
                product,
                timestamp: new Date().toISOString(),
            });
        }

        return NextResponse.json({
            success: true,
            message: 'Added to waitlist successfully'
        });
    } catch (error) {
        console.error('Waitlist API error:', error);
        return NextResponse.json(
            { error: 'Failed to process request' },
            { status: 500 }
        );
    }
}
