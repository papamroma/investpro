"use client";

import React, { useState } from 'react';
import { useAuth } from '@/lib/authContext';
import { useFinance } from '@/lib/financeContext';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function WalletPage() {
    const { user } = useAuth();
    const { deposit, withdraw } = useFinance();

    const [depositAmount, setDepositAmount] = useState('');
    const [withdrawAmount, setWithdrawAmount] = useState('');
    const [message, setMessage] = useState({ type: '', text: '' });
    const [loading, setLoading] = useState(false);

    const handleDeposit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            await deposit(Number(depositAmount));
            setMessage({ type: 'success', text: 'Deposit successful!' });
            setDepositAmount('');
        } catch (err: any) {
            setMessage({ type: 'error', text: err.message || 'Deposit failed' });
        } finally {
            setLoading(false);
        }
    };

    const handleWithdraw = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            await withdraw(Number(withdrawAmount));
            setMessage({ type: 'success', text: 'Withdrawal successful!' });
            setWithdrawAmount('');
        } catch (err: any) {
            setMessage({ type: 'error', text: err.message || 'Withdrawal failed' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1 className="page-title">My Wallet</h1>

            <div style={{ marginBottom: '30px' }}>
                <Card>
                    <div style={{ fontSize: '0.9rem', color: '#888' }}>Available Balance</div>
                    <div style={{ fontSize: '3rem', fontWeight: 700, color: 'var(--primary)' }}>
                        ${user?.balance.toFixed(2)}
                    </div>
                </Card>
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

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                <Card title="Deposit Funds">
                    <form onSubmit={handleDeposit}>
                        <Input
                            label="Amount ($)"
                            type="number"
                            min="1"
                            step="0.01"
                            value={depositAmount}
                            onChange={(e) => setDepositAmount(e.target.value)}
                            required
                            placeholder="0.00"
                        />
                        <Button type="submit" style={{ width: '100%' }} disabled={loading}>
                            {loading ? 'Processing...' : 'Deposit Now'}
                        </Button>
                    </form>
                </Card>

                <Card title="Withdraw Funds">
                    <form onSubmit={handleWithdraw}>
                        <Input
                            label="Amount ($)"
                            type="number"
                            min="1"
                            step="0.01"
                            value={withdrawAmount}
                            onChange={(e) => setWithdrawAmount(e.target.value)}
                            required
                            placeholder="0.00"
                        />
                        <Button type="submit" variant="outline" style={{ width: '100%' }} disabled={loading}>
                            {loading ? 'Processing...' : 'Withdraw Now'}
                        </Button>
                    </form>
                </Card>
            </div>
        </div>
    );
}
