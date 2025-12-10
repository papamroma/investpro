import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabaseAdmin } from '@/lib/supabase';
import { verifyToken } from '@/lib/auth-utils';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2024-11-20.acacia',
});

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
        const { amount, currency = 'usd' } = body;

        if (!amount || amount < 0.5) {
            return NextResponse.json(
                { error: 'Amount must be at least $0.50' },
                { status: 400 }
            );
        }

        // Create payment intent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // Convert to cents
            currency,
            automatic_payment_methods: {
                enabled: true,
            },
            metadata: {
                userId: payload.userId,
                email: payload.email
            }
        });

        // Create pending transaction
        const reference = `CARD-${Date.now()}-${payload.userId.slice(0, 8)}`;
        await supabaseAdmin
            .from('transactions')
            .insert({
                user_id: payload.userId,
                type: 'deposit',
                amount,
                status: 'pending',
                payment_method: 'card',
                reference,
                metadata: {
                    paymentIntentId: paymentIntent.id,
                    currency
                }
            });

        return NextResponse.json({
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id
        });

    } catch (error: any) {
        console.error('Stripe payment intent error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to create payment intent' },
            { status: 500 }
        );
    }
}
