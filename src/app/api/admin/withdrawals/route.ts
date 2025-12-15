import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { requireAdmin, unauthorizedResponse } from '@/lib/admin-auth';

export async function GET(request: NextRequest) {
    const admin = await requireAdmin(request);
    if (!admin) return unauthorizedResponse();

    try {
        const { data: withdrawals, error } = await supabaseAdmin
            .from('transactions')
            .select(`
                id,
                amount,
                status,
                created_at,
                payment_method,
                metadata,
                users (
                    id,
                    full_name,
                    email,
                    phone
                )
            `)
            .eq('type', 'withdrawal')
            .order('created_at', { ascending: false });

        if (error) throw error;

        return NextResponse.json(withdrawals);

    } catch (error) {
        console.error('Admin withdrawals error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
