"use client";

import React, { useState } from 'react';
import { useAuth } from '@/lib/authContext';
import { useFinance } from '@/lib/financeContext';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function InvestPage() {
    const { user } = useAuth();
    const { invest } = useFinance();

    const [amount, setAmount] = useState('');
    const [message, setMessage] = useState({ type: '', text: '' });
    const [loading, setLoading] = useState(false);

    const handleInvest = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            await invest(Number(amount));
            setMessage({ type: 'success', text: 'Investment created successfully!' });
            setAmount('');
        } catch (err: any) {
            setMessage({ type: 'error', text: err.message || 'Investment failed' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1 className="page-title">Investment Center</h1>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                <Card title="Create New Investment">
                    <div style={{ marginBottom: '20px', fontSize: '0.9rem', color: '#ccc' }}>
                        Earn <strong style={{ color: 'var(--secondary)' }}>5% daily interest</strong> on your investment.
                        Returns are calculated and credited daily.
                    </div>

                    {message.text && (
                        <div style={{
                            padding: '12px',
                            borderRadius: 'var(--radius)',
                            marginBottom: '20px',
                            background: message.type === 'error' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                            color: message.type === 'error' ? '#ef4444' : '#10b981',
                            border: `1px solid ${message.type === 'error' ? '#ef4444' : '#10b981'}`
                        }}>
                            {message.text}
                        </div>
                    )}

                    <form onSubmit={handleInvest}>
                        <Input
                            label="Investment Amount ($)"
                            type="number"
                            min="10"
                            step="0.01"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            required
                            placeholder="Min $10.00"
                        />
                        <div style={{ marginBottom: '15px', fontSize: '0.8rem', color: '#888' }}>
                            Available Balance: ${(user?.balance || 0).toFixed(2)}
                        </div>
                        <Button type="submit" style={{ width: '100%' }} disabled={loading}>
                            {loading ? 'Processing...' : 'Invest Now'}
                        </Button>
                    </form>
                </Card>

                <Card title="Investment Statistics">
                    <div style={{ display: 'grid', gap: '15px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid var(--border)' }}>
                            <span>Total Invested</span>
                            <strong style={{ color: 'var(--foreground)' }}>
                                ${(user?.investments || []).reduce((acc: number, curr: any) => acc + curr.amount, 0).toFixed(2)}
                            </strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid var(--border)' }}>
                            <span>Active Plans</span>
                            <strong style={{ color: 'var(--foreground)' }}>{(user?.investments || []).length}</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>Daily Rate</span>
                            <strong style={{ color: 'var(--secondary)' }}>5%</strong>
                        </div>
                    </div>
                </Card>
            </div>

            <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '20px' }}>Active Investments</h2>

            {(user?.investments || []).length === 0 ? (
                <Card>
                    <div style={{ textAlign: 'center', color: '#888', padding: '20px' }}>
                        No active investments found. Start investing today!
                    </div>
                </Card>
            ) : (
                <div style={{ display: 'grid', gap: '15px' }}>
                    {(user?.investments || []).map((inv: any) => (
                        <Card key={inv.id} className="flex justify-between items-center">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                                <div>
                                    <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>Standard Plan</div>
                                    <div style={{ fontSize: '0.8rem', color: '#888' }}>Started: {new Date(inv.startDate).toLocaleDateString()}</div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '1.2rem' }}>
                                        ${inv.amount.toFixed(2)}
                                    </div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--secondary)' }}>
                                        +${(inv.amount * 0.05).toFixed(2)} / day
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
