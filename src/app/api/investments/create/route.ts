import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { verifyToken } from '@/lib/auth-utils';

export async function POST(request: NextRequest) {
    try {
        // Verify authentication
        const authHeader = request.headers.get('authorization');
        const token = authHeader?.replace('Bearer ', '');

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const payload = verifyToken(token);
        if (!payload) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        const body = await request.json();
        const { amount } = body;

        if (!amount || amount < 10) {
            return NextResponse.json(
                { error: 'Minimum investment is 10 KES' },
                { status: 400 }
            );
        }

        // Get user's wallet
        const { data: wallet } = await supabaseAdmin
            .from('wallets')
            .select('*')
            .eq('user_id', payload.userId)
            .eq('currency', 'KES')
            .single();

        if (!wallet) {
            return NextResponse.json(
                { error: 'Wallet not found' },
                { status: 404 }
            );
        }

        // Check sufficient balance
        if (parseFloat(wallet.balance) < amount) {
            return NextResponse.json(
                { error: 'Insufficient funds' },
                { status: 400 }
            );
        }

        // Create investment
        const { data: investment, error: investError } = await supabaseAdmin
            .from('investments')
            .insert({
                user_id: payload.userId,
                wallet_id: wallet.id,
                amount,
                daily_rate: 0.005,
                status: 'active',
                accrued_interest: 0,
                last_interest_date: new Date().toISOString()
            })
            .select()
            .single();

        if (investError || !investment) {
            console.error('Investment creation error:', investError);
            return NextResponse.json(
                { error: 'Failed to create investment' },
                { status: 500 }
            );
        }

        // Deduct from wallet
        const newBalance = parseFloat(wallet.balance) - amount;
        await supabaseAdmin
            .from('wallets')
            .update({ balance: newBalance })
            .eq('id', wallet.id);

        // Create transaction record
        const reference = `INV-${Date.now()}-${payload.userId.slice(0, 8)}`;
        await supabaseAdmin
            .from('transactions')
            .insert({
                user_id: payload.userId,
                wallet_id: wallet.id,
                type: 'investment',
                amount,
                status: 'completed',
                payment_method: 'wallet',
                reference,
                metadata: { investmentId: investment.id }
            });

        return NextResponse.json({
            success: true,
            message: 'Investment created successfully',
            investment: {
                id: investment.id,
                amount: investment.amount,
                dailyRate: investment.daily_rate,
                dailyEarnings: amount * 0.005
            },
            newBalance
        });

    } catch (error) {
        console.error('Investment creation error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
