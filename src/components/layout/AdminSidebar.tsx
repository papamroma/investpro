"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/authContext';

export function AdminSidebar() {
    const pathname = usePathname();
    const { logout } = useAuth();

    const links = [
        { href: '/admin', label: 'Overview', icon: '📊' },
        { href: '/admin/users', label: 'User Management', icon: '👥' },
        { href: '/admin/withdrawals', label: 'Withdrawals', icon: '💸' },
    ];

    return (
        <aside style={{
            width: '250px',
            background: '#1a1a1a',
            color: 'white',
            height: '100vh',
            position: 'fixed',
            left: 0,
            top: 0,
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            borderRight: '1px solid #333'
        }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '40px', color: '#ef4444' }}>
                Admin Panel 🛡️
            </div>

            <nav style={{ flex: 1 }}>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {links.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <li key={link.href} style={{ marginBottom: '10px' }}>
                                <Link href={link.href} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    padding: '12px 15px',
                                    borderRadius: '8px',
                                    textDecoration: 'none',
                                    color: isActive ? 'white' : '#888',
                                    background: isActive ? '#ef4444' : 'transparent',
                                    transition: 'all 0.2s'
                                }}>
                                    <span style={{ marginRight: '10px' }}>{link.icon}</span>
                                    {link.label}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            <button
                onClick={logout}
                style={{
                    background: 'transparent',
                    border: '1px solid #333',
                    color: '#888',
                    padding: '12px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    width: '100%',
                    textAlign: 'left',
                    marginTop: 'auto'
                }}
            >
                🚪 Logout
            </button>
        </aside>
    );
}
