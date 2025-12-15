"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/lib/authContext';
import { Card } from '@/components/ui/Card';

export default function AdminDashboard() {
    const { getToken } = useAuth();
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = getToken();
                const res = await fetch('/api/admin/stats', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setStats(data);
                }
            } catch (error) {
                console.error('Failed to fetch stats', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [getToken]);

    if (loading) return <div>Loading stats...</div>;

    return (
        <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '30px', color: 'white' }}>Admin Overview</h1>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                <Card title="Total Users">
                    <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#3b82f6' }}>
                        {stats?.totalUsers || 0}
                    </div>
                </Card>

                <Card title="Total Deposits">
                    <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#10b981' }}>
                        ${(stats?.totalDeposits || 0).toFixed(2)}
                    </div>
                </Card>

                <Card title="Total Withdrawals">
                    <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#ef4444' }}>
                        ${(stats?.totalWithdrawals || 0).toFixed(2)}
                    </div>
                </Card>

                <Card title="Pending Requests">
                    <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#f59e0b' }}>
                        {stats?.pendingWithdrawals || 0}
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#888' }}>Withdrawals needing approval</div>
                </Card>
            </div>
        </div>
    );
}
