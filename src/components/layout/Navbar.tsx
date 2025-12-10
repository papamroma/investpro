"use client";

import React from 'react';
import { useAuth } from '@/lib/authContext';
import { Button } from '@/components/ui/Button';

export function Navbar() {
    const { user, logout } = useAuth();

    return (
        <header style={{
            height: 'var(--header-height)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            padding: '0 40px',
            borderBottom: '1px solid var(--border)',
            background: 'rgba(0,0,0,0.2)',
            backdropFilter: 'blur(10px)'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <span style={{ fontSize: '0.9rem' }}>
                    Welcome, <strong style={{ color: 'var(--primary)' }}>{user?.fullName}</strong>
                </span>
                <Button variant="outline" onClick={logout} style={{ padding: '8px 16px', fontSize: '0.8rem' }}>
                    Logout
                </Button>
            </div>
        </header>
    );
}
