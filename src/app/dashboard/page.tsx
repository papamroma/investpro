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
                    <div style={{ fontSize: '0.9rem', color: '#888', marginTop: '5px' }}>
                        Available for withdrawal
                    </div>
                </Card>

                <Card title="Active Investments">
                    <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--secondary)' }}>
                        {user?.investments?.length || 0}
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#888', marginTop: '5px' }}>
                        Generating 0.5% daily
                    </div>
                </Card>

                <Card title="Profile Status">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                            width: '10px',
                            height: '10px',
                            borderRadius: '50%',
                            background: user?.idNumber ? '#10b981' : '#ef4444'
                        }} />
                        <span>{user?.idNumber ? 'Verified' : 'Unverified'}</span>
                    </div>
                </Card>
            </div>
        </div>
    );
}
