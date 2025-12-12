import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { hashPassword } from '@/lib/auth-utils';

export async function POST(request: NextRequest) {
    try {
        const { token, newPassword } = await request.json();

        if (!token || !newPassword) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Find user with valid token
        const { data: user } = await supabaseAdmin
            .from('users')
            .select('id')
            .eq('reset_token', token)
            .gt('reset_expires', new Date().toISOString())
            .single();

        if (!user) {
            return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 });
        }

        // Hash new password
        const passwordHash = await hashPassword(newPassword);

        // Update user password and clear token
        const { error } = await supabaseAdmin
            .from('users')
            .update({
                password_hash: passwordHash,
                reset_token: null,
                reset_expires: null
            })
            .eq('id', user.id);

        if (error) {
            console.error('Failed to update password:', error);
            return NextResponse.json({ error: 'Failed to update password' }, { status: 500 });
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Reset password error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
