import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { randomBytes } from 'crypto';

export async function POST(request: NextRequest) {
    try {
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        // Check if user exists
        const { data: user } = await supabaseAdmin
            .from('users')
            .select('id, email')
            .eq('email', email)
            .single();

        if (!user) {
            // Return success even if user doesn't exist to prevent enumeration
            return NextResponse.json({ success: true });
        }

        // Generate reset token
        const token = randomBytes(32).toString('hex');
        const expires = new Date(Date.now() + 3600000); // 1 hour from now

        // Save to database
        const { error } = await supabaseAdmin
            .from('users')
            .update({
                reset_token: token,
                reset_expires: expires.toISOString()
            })
            .eq('id', user.id);

        if (error) {
            console.error('Failed to save reset token:', error);
            return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
        }

        // In a real app, send email here.
        // For now, log the link to the console for testing.
        const resetLink = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`;
        console.log('----------------------------------------');
        console.log('🔐 PASSWORD RESET LINK (Test Mode):');
        console.log(resetLink);
        console.log('----------------------------------------');

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Forgot password error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
