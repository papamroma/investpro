import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { verifyToken } from '@/lib/auth-utils';

export async function GET(request: NextRequest) {
    try {
        // Get token from Authorization header
        const authHeader = request.headers.get('authorization');
        const token = authHeader?.replace('Bearer ', '');

        if (!token) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Verify token
        const payload = verifyToken(token);
        if (!payload) {
            return NextResponse.json(
                { error: 'Invalid token' },
                { status: 401 }
            );
        }

        // Get user data
        const { data: user, error: userError } = await supabaseAdmin
            .from('users')
            .select('*')
            .eq('id', payload.userId)
            .single();

        if (userError || !user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // Get wallet data
        const { data: wallet, error: walletError } = await supabaseAdmin
            .from('wallets')
            .select('*')
            .eq('user_id', user.id)
            .eq('currency', 'KES')
            .single();

        if (walletError) {
            console.error('Wallet error:', walletError);
        }

        // Get investments
        const { data: investments, error: investmentsError } = await supabaseAdmin
            .from('investments')
            .select('*')
            .eq('user_id', user.id)
            .eq('status', 'active');

        if (investmentsError) {
            console.error('Investments error:', investmentsError);
        }

        return NextResponse.json({
            user: {
                id: user.id,
                email: user.email,
                fullName: user.full_name,
                idNumber: user.id_number,
                dob: user.date_of_birth,
                phone: user.phone,
                phoneVerified: user.phone_verified,
                balance: wallet?.balance || 0,
                investments: investments || []
            }
        });

    } catch (error) {
        console.error('Get user error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
