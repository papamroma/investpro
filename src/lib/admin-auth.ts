import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth-utils';

export async function requireAdmin(request: NextRequest) {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null;
    }

    const token = authHeader.split(' ')[1];
    const payload = await verifyToken(token);

    if (!payload || !payload.isAdmin) {
        return null;
    }

    return payload;
}

export function unauthorizedResponse() {
    return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403 });
}
