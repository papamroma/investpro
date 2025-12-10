import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { generateOTP } from '@/lib/auth-utils';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { phone, userId } = body;

        if (!phone || !userId) {
            return NextResponse.json(
                { error: 'Phone and userId are required' },
                { status: 400 }
            );
        }

        // Generate OTP
        const otpCode = generateOTP();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

        // Save OTP to database
        const { error: otpError } = await supabaseAdmin
            .from('otp_verifications')
            .insert({
                user_id: userId,
                phone,
                otp_code: otpCode,
                expires_at: expiresAt.toISOString(),
                verified: false
            });

        if (otpError) {
            console.error('OTP save error:', otpError);
            return NextResponse.json(
                { error: 'Failed to generate OTP' },
                { status: 500 }
            );
        }

        // TODO: Send SMS using Twilio or Africa's Talking
        // For now, we'll return the OTP in development mode
        const isDevelopment = process.env.NODE_ENV === 'development';

        if (isDevelopment) {
            console.log(`OTP for ${phone}: ${otpCode}`);
            return NextResponse.json({
                success: true,
                message: 'OTP sent successfully',
                // Only include OTP in development
                otp: otpCode
            });
        }

        // In production, send actual SMS
        // Example with Twilio:
        // const twilioClient = require('twilio')(
        //   process.env.TWILIO_ACCOUNT_SID,
        //   process.env.TWILIO_AUTH_TOKEN
        // );
        // await twilioClient.messages.create({
        //   body: `Your InvestPro verification code is: ${otpCode}`,
        //   from: process.env.TWILIO_PHONE_NUMBER,
        //   to: phone
        // });

        return NextResponse.json({
            success: true,
            message: 'OTP sent successfully'
        });

    } catch (error) {
        console.error('Send OTP error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
