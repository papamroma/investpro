import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { requireAdmin, unauthorizedResponse } from '@/lib/admin-auth';

export async function GET(request: NextRequest) {
    const admin = await requireAdmin(request);
    if (!admin) return unauthorizedResponse();

    try {
        // 1. Total Users
        const { count: totalUsers, error: usersError } = await supabaseAdmin
            .from('users')
            .select('*', { count: 'exact', head: true });

        if (usersError) throw usersError;

        // 2. Total Deposits (Completed)
        const { data: deposits, error: depositsError } = await supabaseAdmin
            .from('transactions')
            .select('amount')
            .eq('type', 'deposit')
            .eq('status', 'completed');

        if (depositsError) throw depositsError;
        const totalDeposits = deposits.reduce((sum: number, tx: any) => sum + Number(tx.amount), 0);

        // 3. Total Withdrawals (Completed)
        const { data: withdrawals, error: withdrawalsError } = await supabaseAdmin
            .from('transactions')
            .select('amount')
            .eq('type', 'withdrawal')
            .eq('status', 'completed');

        if (withdrawalsError) throw withdrawalsError;
        const totalWithdrawals = withdrawals.reduce((sum: number, tx: any) => sum + Number(tx.amount), 0);

        // 4. Pending Withdrawals Count
        const { count: pendingWithdrawals, error: pendingError } = await supabaseAdmin
            .from('transactions')
            .select('*', { count: 'exact', head: true })
            .eq('type', 'withdrawal')
            .eq('status', 'pending');

        if (pendingError) throw pendingError;

        return NextResponse.json({
            totalUsers: totalUsers || 0,
            totalDeposits,
            totalWithdrawals,
            pendingWithdrawals: pendingWithdrawals || 0
        });

    } catch (error) {
        console.error('Admin stats error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
