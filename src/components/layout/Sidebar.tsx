"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
    { label: 'Overview', href: '/dashboard' },
    { label: 'Wallet', href: '/dashboard/wallet' },
    { label: 'Invest', href: '/dashboard/invest' },
    { label: 'Profile', href: '/dashboard/profile' },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <aside style={{
            width: '250px',
            height: '100vh',
            position: 'fixed',
            left: 0,
            top: 0,
            background: 'rgba(0,0,0,0.5)',
            borderRight: '1px solid var(--border)',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column'
        }}>
            <div style={{ marginBottom: '40px', fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)' }}>
                InvestPro
            </div>

            <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            style={{
                                padding: '12px 16px',
                                borderRadius: 'var(--radius)',
                                background: isActive ? 'var(--primary)' : 'transparent',
                                color: isActive ? '#000' : 'var(--foreground)',
                                fontWeight: isActive ? 600 : 400,
                                transition: 'all 0.2s ease'
                            }}
                        >
                            {item.label}
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}
