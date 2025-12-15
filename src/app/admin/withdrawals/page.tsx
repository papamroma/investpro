"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/lib/authContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function AdminWithdrawalsPage() {
    const { getToken } = useAuth();
    const [withdrawals, setWithdrawals] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState<string | null>(null);

    const fetchWithdrawals = async () => {
        try {
            const token = getToken();
            const res = await fetch('/api/admin/withdrawals', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setWithdrawals(data);
            }
        } catch (error) {
            console.error('Failed to fetch withdrawals', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWithdrawals();
    }, [getToken]);

    const handleAction = async (id: string, action: 'approve' | 'reject') => {
        if (!confirm(`Are you sure you want to ${action} this withdrawal?`)) return;

        setProcessingId(id);
        try {
            const token = getToken();
            const res = await fetch(`/api/admin/withdrawals/${action}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ id })
            });

            if (res.ok) {
                alert(`Withdrawal ${action}d successfully!`);
                fetchWithdrawals(); // Refresh list
            } else {
                const err = await res.json();
                alert(`Error: ${err.error}`);
            }
        } catch (error) {
            alert('Failed to process request');
        } finally {
            setProcessingId(null);
        }
    };

    if (loading) return <div>Loading withdrawals...</div>;

    return (
        <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '30px', color: 'white' }}>Withdrawal Requests</h1>

            {withdrawals.length === 0 ? (
                <Card>
                    <div style={{ padding: '20px', textAlign: 'center', color: '#888' }}>
                        No pending withdrawals found.
                    </div>
                </Card>
            ) : (
                <div style={{ display: 'grid', gap: '20px' }}>
                    {withdrawals.map((tx) => (
                        <Card key={tx.id}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
                                <div>
                                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'white', marginBottom: '5px' }}>
                                        ${Number(tx.amount).toFixed(2)}
                                    </div>
                                    <div style={{ color: '#888', fontSize: '0.9rem' }}>
                                        Requested by: <span style={{ color: 'white' }}>{tx.users?.full_name} ({tx.users?.email})</span>
                                    </div>
                                    <div style={{ color: '#888', fontSize: '0.9rem', marginTop: '5px' }}>
                                        Date: {new Date(tx.created_at).toLocaleString()}
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <Button
                                        onClick={() => handleAction(tx.id, 'approve')}
                                        disabled={processingId === tx.id}
                                        style={{ background: '#10b981', border: 'none' }}
                                    >
                                        {processingId === tx.id ? 'Processing...' : 'Approve ✅'}
                                    </Button>
                                    <Button
                                        onClick={() => handleAction(tx.id, 'reject')}
                                        disabled={processingId === tx.id}
                                        style={{ background: '#ef4444', border: 'none' }}
                                    >
                                        {processingId === tx.id ? 'Processing...' : 'Reject ❌'}
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
