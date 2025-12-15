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

        // Update transaction status to completed
        const { error } = await supabaseAdmin
            .from('transactions')
            .update({ status: 'completed' })
            .eq('id', id)
            .eq('type', 'withdrawal');

        if (error) throw error;

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Approve withdrawal error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
