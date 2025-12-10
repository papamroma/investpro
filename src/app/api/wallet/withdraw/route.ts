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

        const payload = await verifyToken(token);
        if (!payload) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        const body = await request.json();
        const { amount, method, details } = body;

        if (!amount || amount <= 0) {
            return NextResponse.json(
                { error: 'Invalid amount' },
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

        // Create withdrawal transaction
        const reference = `WD-${Date.now()}-${payload.userId.slice(0, 8)}`;
        await supabaseAdmin
            .from('transactions')
            .insert({
                user_id: payload.userId,
                wallet_id: wallet.id,
                type: 'withdrawal',
                amount,
                status: 'completed',
                payment_method: method || 'bank',
                reference,
                metadata: details || {}
            });

        // Update wallet balance
        const newBalance = parseFloat(wallet.balance) - amount;
        await supabaseAdmin
            .from('wallets')
            .update({ balance: newBalance })
            .eq('id', wallet.id);

        return NextResponse.json({
            success: true,
            message: 'Withdrawal successful',
            newBalance
        });

    } catch (error) {
        console.error('Withdrawal error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
