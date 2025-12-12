"use client";

import React from 'react';
import { useAuth } from '@/lib/authContext';
import { Card } from '@/components/ui/Card';

export default function DashboardPage() {
    const { user } = useAuth();

    return (
        <div>
            <h1 className="page-title">Dashboard Overview</h1>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                <Card title="Total Balance">
                    <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--primary)' }}>
                        ${(user?.balance || 0).toFixed(2)}
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#888', marginTop: '5px', marginBottom: '15px' }}>
                        Available for withdrawal
                    </div>
                    <Link href="/dashboard/wallet">
                        <Button style={{ width: '100%' }}>Deposit Funds</Button>
                    </Link>
                </Card>

                <Card title="Active Investments">
                    <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--secondary)' }}>
                        {user?.investments?.length || 0}
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#888', marginTop: '5px', marginBottom: '15px' }}>
                        Generating 5% daily
                    </div>
                    <Link href="/dashboard/invest">
                        <Button variant="outline" style={{ width: '100%' }}>View Investments</Button>
                    </Link>
                </Card>

                <Card title="Profile Status">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                        <div style={{
                            width: '10px',
                            height: '10px',
                            borderRadius: '50%',
                            background: user?.idNumber ? '#10b981' : '#ef4444'
                        }} />
                        <span>{user?.idNumber ? 'Verified' : 'Unverified'}</span>
                    </div>
                    <Link href="/dashboard/profile">
                        <Button variant="outline" style={{ width: '100%' }}>Manage Profile</Button>
                    </Link>
                </Card>
            </div>

            <div style={{ marginTop: '40px' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '20px' }}>Quick Actions</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                    <Link href="/dashboard/wallet" style={{ textDecoration: 'none' }}>
                        <Card className="hover:border-primary transition-colors cursor-pointer">
                            <div style={{ fontSize: '1.5rem', marginBottom: '10px' }}>💰</div>
                            <h3 style={{ fontWeight: 600 }}>Deposit / Withdraw</h3>
                            <p style={{ fontSize: '0.8rem', color: '#888' }}>Manage your funds</p>
                        </Card>
                    </Link>
                    <Link href="/dashboard/invest" style={{ textDecoration: 'none' }}>
                        <Card className="hover:border-primary transition-colors cursor-pointer">
                            <div style={{ fontSize: '1.5rem', marginBottom: '10px' }}>📈</div>
                            <h3 style={{ fontWeight: 600 }}>New Investment</h3>
                            <p style={{ fontSize: '0.8rem', color: '#888' }}>Start earning returns</p>
                        </Card>
                    </Link>
                </div>
            </div>
        </div>
    );
}
