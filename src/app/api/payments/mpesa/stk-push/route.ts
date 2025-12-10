import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { verifyToken } from '@/lib/auth-utils';
import { initiateSTKPush } from '@/lib/mpesa';

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
        const { phone, amount } = body;

        if (!phone || !amount) {
            return NextResponse.json(
                { error: 'Phone and amount are required' },
                { status: 400 }
            );
        }

        if (amount < 1) {
            return NextResponse.json(
                { error: 'Amount must be at least 1 KES' },
                { status: 400 }
            );
        }

        // Generate unique reference
        const reference = `DEP-${Date.now()}-${payload.userId.slice(0, 8)}`;

        // Create pending transaction
        const { data: transaction, error: txError } = await supabaseAdmin
            .from('transactions')
            .insert({
                user_id: payload.userId,
                type: 'deposit',
                amount,
                status: 'pending',
                payment_method: 'mpesa',
                reference,
                metadata: { phone }
            })
            .select()
            .single();

        if (txError || !transaction) {
            console.error('Transaction creation error:', txError);
            return NextResponse.json(
                { error: 'Failed to create transaction' },
                { status: 500 }
            );
        }

        // Initiate STK Push
        const stkResult = await initiateSTKPush(phone, amount, reference);

        if (!stkResult.success) {
            // Update transaction status
            await supabaseAdmin
                .from('transactions')
                .update({
                    status: 'failed',
                    metadata: { phone, error: stkResult.error }
                })
                .eq('id', transaction.id);

            return NextResponse.json(
                { error: stkResult.error || 'Failed to initiate payment' },
                { status: 500 }
            );
        }

        // Update transaction with M-Pesa details
        await supabaseAdmin
            .from('transactions')
            .update({
                metadata: {
                    phone,
                    checkoutRequestId: stkResult.checkoutRequestId,
                    merchantRequestId: stkResult.merchantRequestId
                }
            })
            .eq('id', transaction.id);

        return NextResponse.json({
            success: true,
            message: 'STK Push sent. Please check your phone.',
            transactionId: transaction.id,
            checkoutRequestId: stkResult.checkoutRequestId
        });

    } catch (error) {
        console.error('M-Pesa STK Push error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
