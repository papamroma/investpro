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
        const { amount, paymentMethod, paymentDetails } = body;

        if (!amount || amount <= 0) {
            return NextResponse.json(
                { error: 'Invalid amount' },
                { status: 400 }
            );
        }

        if (!paymentMethod) {
            return NextResponse.json(
                { error: 'Payment method is required' },
                { status: 400 }
            );
        }

        // For demo/testing purposes, allow instant deposit
        if (paymentMethod === 'demo') {
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

            // Create transaction
            const reference = `DEMO-${Date.now()}-${payload.userId.slice(0, 8)}`;
            await supabaseAdmin
                .from('transactions')
                .insert({
                    user_id: payload.userId,
                    wallet_id: wallet.id,
                    type: 'deposit',
                    amount,
                    status: 'completed',
                    payment_method: 'demo',
                    reference
                });

            // Update wallet balance
            const newBalance = parseFloat(wallet.balance) + parseFloat(amount);
            await supabaseAdmin
                .from('wallets')
                .update({ balance: newBalance })
                .eq('id', wallet.id);

            return NextResponse.json({
                success: true,
                message: 'Deposit successful',
                newBalance
            });
        }

        // For real payment methods, return instructions
        return NextResponse.json({
            success: false,
            message: `Please use the ${paymentMethod} payment endpoint`,
            endpoint: `/api/payments/${paymentMethod}/initiate`
        });

    } catch (error) {
        console.error('Deposit error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
