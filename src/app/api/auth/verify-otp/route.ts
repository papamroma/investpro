import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { phone, otpCode, userId } = body;

        if (!phone || !otpCode || !userId) {
            return NextResponse.json(
                { error: 'Phone, OTP code, and userId are required' },
                { status: 400 }
            );
        }

        // Find valid OTP
        const { data: otpRecord, error: otpError } = await supabaseAdmin
            .from('otp_verifications')
            .select('*')
            .eq('user_id', userId)
            .eq('phone', phone)
            .eq('otp_code', otpCode)
            .eq('verified', false)
            .gt('expires_at', new Date().toISOString())
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

        if (otpError || !otpRecord) {
            return NextResponse.json(
                { error: 'Invalid or expired OTP' },
                { status: 400 }
            );
        }

        // Mark OTP as verified
        await supabaseAdmin
            .from('otp_verifications')
            .update({ verified: true })
            .eq('id', otpRecord.id);

        // Update user phone verification status
        const { error: updateError } = await supabaseAdmin
            .from('users')
            .update({
                phone_verified: true,
                phone: phone
            })
            .eq('id', userId);

        if (updateError) {
            console.error('User update error:', updateError);
            return NextResponse.json(
                { error: 'Failed to verify phone' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Phone verified successfully'
        });

    } catch (error) {
        console.error('Verify OTP error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
