import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { requireAdmin, unauthorizedResponse } from '@/lib/admin-auth';

export async function GET(request: NextRequest) {
    const admin = await requireAdmin(request);
    if (!admin) return unauthorizedResponse();

    try {
        // Fetch users with their wallet balance
        // Note: Supabase join syntax is a bit specific. 
        // We'll fetch users and wallets separately for simplicity if join is complex, 
        // or use the relational query if foreign keys are set up correctly.
        // Assuming foreign keys are set up: users -> wallets

        const { data: users, error } = await supabaseAdmin
            .from('users')
            .select(`
                id,
                full_name,
                email,
                phone,
                created_at,
                is_admin,
                wallets (
                    balance
                )
            `)
            .order('created_at', { ascending: false });

        if (error) throw error;

        // Transform data to flatten wallet balance
        const formattedUsers = users.map((user: any) => ({
            id: user.id,
            name: user.full_name,
            email: user.email,
            phone: user.phone,
            joined: user.created_at,
            isAdmin: user.is_admin,
            balance: user.wallets?.[0]?.balance || 0
        }));

        return NextResponse.json(formattedUsers);

    } catch (error) {
        console.error('Admin users error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
