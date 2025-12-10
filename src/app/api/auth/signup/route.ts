import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { hashPassword, generateToken } from '@/lib/auth-utils';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, password, fullName, idNumber, dob, phone, countryCode } = body;

        // Validate required fields
        if (!email || !password || !fullName || !idNumber || !dob) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Check if user already exists
        const { data: existingUser } = await supabaseAdmin
            .from('users')
            .select('id')
            .eq('email', email)
            .single();

        if (existingUser) {
            return NextResponse.json(
                { error: 'User already exists' },
                { status: 409 }
            );
        }

        // Hash password
        const passwordHash = await hashPassword(password);

        // Create user
        const { data: user, error: userError } = await supabaseAdmin
            .from('users')
            .insert({
                email,
                password_hash: passwordHash,
                full_name: fullName,
                id_number: idNumber,
                date_of_birth: dob,
                phone: phone || null,
                country_code: countryCode || '+254',
                phone_verified: false
            })
            .select()
            .single();

        if (userError || !user) {
            console.error('User creation error:', userError);
            return NextResponse.json(
                { error: 'Failed to create user' },
                { status: 500 }
            );
        }

        // Create wallet for user
        const { error: walletError } = await supabaseAdmin
            .from('wallets')
            .insert({
                user_id: user.id,
                balance: 0,
                currency: 'KES'
            });

        if (walletError) {
            console.error('Wallet creation error:', walletError);
            // Note: User was created but wallet failed - could implement cleanup
        }

        // Generate JWT token
        const token = generateToken({
            userId: user.id,
            email: user.email
        });

        return NextResponse.json({
            success: true,
            token,
            user: {
                id: user.id,
                email: user.email,
                fullName: user.full_name,
                idNumber: user.id_number,
                dob: user.date_of_birth,
                phone: user.phone,
                phoneVerified: user.phone_verified
            }
        });

    } catch (error) {
        console.error('Signup error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
