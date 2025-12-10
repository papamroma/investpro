import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        console.log('M-Pesa Callback:', JSON.stringify(body, null, 2));

        const { Body } = body;
        const { stkCallback } = Body;

        const {
            MerchantRequestID,
            CheckoutRequestID,
            ResultCode,
            ResultDesc,
            CallbackMetadata
        } = stkCallback;

        // Find transaction by checkout request ID
        const { data: transactions } = await supabaseAdmin
            .from('transactions')
            .select('*')
            .eq('payment_method', 'mpesa')
            .contains('metadata', { checkoutRequestId: CheckoutRequestID });

        if (!transactions || transactions.length === 0) {
            console.error('Transaction not found for CheckoutRequestID:', CheckoutRequestID);
            return NextResponse.json({ ResultCode: 0, ResultDesc: 'Accepted' });
        }

        const transaction = transactions[0];

        // ResultCode 0 means success
        if (ResultCode === 0) {
            // Extract payment details
            const metadata = CallbackMetadata?.Item || [];
            const mpesaReceiptNumber = metadata.find((item: any) => item.Name === 'MpesaReceiptNumber')?.Value;
            const amountPaid = metadata.find((item: any) => item.Name === 'Amount')?.Value;
            const phoneNumber = metadata.find((item: any) => item.Name === 'PhoneNumber')?.Value;

            // Update transaction to completed
            await supabaseAdmin
                .from('transactions')
                .update({
                    status: 'completed',
                    metadata: {
                        ...transaction.metadata,
                        mpesaReceiptNumber,
                        amountPaid,
                        phoneNumber,
                        resultDesc: ResultDesc
                    }
                })
                .eq('id', transaction.id);

            // Get user's wallet
            const { data: wallet } = await supabaseAdmin
                .from('wallets')
                .select('*')
                .eq('user_id', transaction.user_id)
                .eq('currency', 'KES')
                .single();

            if (wallet) {
                // Update wallet balance
                const newBalance = parseFloat(wallet.balance) + parseFloat(amountPaid || transaction.amount);
                await supabaseAdmin
                    .from('wallets')
                    .update({ balance: newBalance })
                    .eq('id', wallet.id);
            }

        } else {
            // Payment failed
            await supabaseAdmin
                .from('transactions')
                .update({
                    status: 'failed',
                    metadata: {
                        ...transaction.metadata,
                        resultCode: ResultCode,
                        resultDesc: ResultDesc
                    }
                })
                .eq('id', transaction.id);
        }

        return NextResponse.json({ ResultCode: 0, ResultDesc: 'Accepted' });

    } catch (error) {
        console.error('M-Pesa callback error:', error);
        return NextResponse.json({ ResultCode: 1, ResultDesc: 'Failed' });
    }
}
