import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { requireAdmin, unauthorizedResponse } from '@/lib/admin-auth';

export async function POST(request: NextRequest) {
    const admin = await requireAdmin(request);
    if (!admin) return unauthorizedResponse();

    try {
        const { id } = await request.json();

        if (!id) {
            return NextResponse.json({ error: 'Transaction ID required' }, { status: 400 });
        }

        // 1. Get the transaction to find amount and user_id
        const { data: tx, error: txError } = await supabaseAdmin
            .from('transactions')
            .select('*')
            .eq('id', id)
            .single();

        if (txError || !tx) {
            return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
        }

        if (tx.status !== 'pending') {
            return NextResponse.json({ error: 'Transaction is not pending' }, { status: 400 });
        }

        // 2. Refund the user's wallet
        // We need to find the user's wallet first
        const { data: wallet, error: walletError } = await supabaseAdmin
            .from('wallets')
            .select('id, balance')
            .eq('user_id', tx.user_id)
            .single();

        if (walletError || !wallet) {
            return NextResponse.json({ error: 'User wallet not found' }, { status: 404 });
        }

        const newBalance = Number(wallet.balance) + Number(tx.amount);

        // 3. Update wallet balance
        const { error: updateError } = await supabaseAdmin
            .from('wallets')
            .update({ balance: newBalance })
            .eq('id', wallet.id);

        if (updateError) throw updateError;

        // 4. Mark transaction as failed/rejected
        const { error: statusError } = await supabaseAdmin
            .from('transactions')
            .update({ status: 'failed' }) // Using 'failed' as per schema, or could add 'rejected'
            .eq('id', id);

        if (statusError) throw statusError;

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Reject withdrawal error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
