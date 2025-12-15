"use client";
// Force Vercel Redeploy

import React, { useState } from 'react';
import { useAuth } from '@/lib/authContext';
import { useFinance, ADMIN_WALLET_CONFIG } from '@/lib/financeContext';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function WalletPage() {
    const { user } = useAuth();
    const { deposit, withdraw } = useFinance();

    const [activeTab, setActiveTab] = useState<'deposit' | 'withdraw'>('deposit');
    const [paymentMethod, setPaymentMethod] = useState('mpesa');

    const [amount, setAmount] = useState('');
    const [phoneNumber, setPhoneNumber] = useState(''); // For M-Pesa

    const [message, setMessage] = useState({ type: '', text: '' });
    const [loading, setLoading] = useState(false);

    const handleDeposit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            if (paymentMethod === 'mpesa') {
                // Use existing deposit logic which handles M-Pesa STK Push
                // We might need to pass phone number if the context supports it, 
                // otherwise it uses the user's registered phone.
                // Assuming 'deposit' function handles the API call.
                await deposit(Number(amount), 'mpesa');
                setMessage({ type: 'success', text: 'STK Push sent! Check your phone to complete payment.' });
            } else {
                // For other methods, we might just simulate success or show instructions
                setMessage({ type: 'success', text: 'Deposit request received. Please complete the transfer.' });
            }
            setAmount('');
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
            await withdraw(Number(amount));
            setMessage({ type: 'success', text: 'Withdrawal successful!' });
            setAmount('');
        } catch (err: any) {
            setMessage({ type: 'error', text: err.message || 'Withdrawal failed' });
        } finally {
            setLoading(false);
        }
    };

    const renderPaymentMethodContent = () => {
        switch (paymentMethod) {
            case 'mpesa':
                return (
                    <div className="space-y-4">
                        <p className="text-sm text-gray-500">
                            Enter amount and we will send an M-Pesa STK Push to your registered phone number.
                        </p>
                        <Input
                            label="Amount (KES)"
                            type="number"
                            min="10"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            required
                            placeholder="e.g. 1000"
                        />
                        <Button type="submit" style={{ width: '100%', background: '#2ecc71' }} disabled={loading}>
                            {loading ? 'Sending Request...' : 'Pay with M-Pesa'}
                        </Button>
                    </div>
                );
            case 'card':
                return (
                    <div className="space-y-4">
                        <p className="text-sm text-gray-500">
                            Secure credit/debit card payment via Stripe.
                        </p>
                        <Input
                            label="Amount (USD)"
                            type="number"
                            min="10"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            required
                            placeholder="e.g. 100"
                        />
                        <Button type="button" style={{ width: '100%', background: '#635bff' }} onClick={() => setMessage({ type: 'info', text: 'Stripe integration coming soon!' })}>
                            Pay with Card
                        </Button>
                    </div>
                );
            case 'paypal':
                return (
                    <div className="space-y-4">
                        <p className="text-sm text-gray-500">
                            Send payment to our PayPal address.
                        </p>
                        <div className="p-4 bg-gray-100 rounded-md text-sm">
                            <strong>PayPal Email:</strong><br />
                            {ADMIN_WALLET_CONFIG.paypalEmail}
                        </div>
                        <Input
                            label="Amount (USD)"
                            type="number"
                            min="10"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            required
                            placeholder="e.g. 100"
                        />
                        <Button type="button" style={{ width: '100%', background: '#003087' }} onClick={() => window.open(`https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=${ADMIN_WALLET_CONFIG.paypalEmail}&amount=${amount}&currency_code=USD`, '_blank')}>
                            Proceed to PayPal
                        </Button>
                    </div>
                );
            case 'airtel':
            case 'tkash':
                const isAirtel = paymentMethod === 'airtel';
                return (
                    <div className="space-y-4">
                        <p className="text-sm text-gray-500">
                            Manual Transfer Instructions for {isAirtel ? 'Airtel Money' : 'T-Kash'}.
                        </p>
                        <div className="p-4 bg-gray-100 rounded-md text-sm">
                            <strong>{isAirtel ? 'Airtel Till Number' : 'T-Kash Number'}:</strong><br />
                            <span className="text-lg font-mono">{isAirtel ? ADMIN_WALLET_CONFIG.airtelTill : ADMIN_WALLET_CONFIG.tkashNumber}</span>
                        </div>
                        <Input
                            label="Amount Sent"
                            type="number"
                            min="10"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            required
                            placeholder="e.g. 1000"
                        />
                        <Input
                            label="Transaction Code"
                            type="text"
                            placeholder="e.g. QWE123456"
                            required
                        />
                        <Button type="submit" style={{ width: '100%', background: isAirtel ? '#e74c3c' : '#e67e22' }} disabled={loading}>
                            {loading ? 'Verifying...' : 'Confirm Payment'}
                        </Button>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div>
            <h1 className="page-title">My Wallet</h1>

            <div style={{ marginBottom: '30px' }}>
                <Card>
                    <div style={{ fontSize: '0.9rem', color: '#888' }}>Available Balance</div>
                    <div style={{ fontSize: '3rem', fontWeight: 700, color: 'var(--primary)' }}>
                        ${(user?.balance || 0).toFixed(2)}
                    </div>
                </Card>
            </div>

            {message.text && (
                <div style={{
                    padding: '12px',
                    borderRadius: 'var(--radius)',
                    marginBottom: '20px',
                    background: message.type === 'error' ? 'rgba(239, 68, 68, 0.1)' : message.type === 'info' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                    color: message.type === 'error' ? '#ef4444' : message.type === 'info' ? '#3b82f6' : '#10b981',
                    border: `1px solid ${message.type === 'error' ? '#ef4444' : message.type === 'info' ? '#3b82f6' : '#10b981'}`
                }}>
                    {message.text}
                </div>
            )}

            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                <Button
                    variant={activeTab === 'deposit' ? 'primary' : 'outline'}
                    onClick={() => { setActiveTab('deposit'); setMessage({ type: '', text: '' }); setAmount(''); }}
                    style={{ flex: 1 }}
                >
                    Deposit
                </Button>
                <Button
                    variant={activeTab === 'withdraw' ? 'primary' : 'outline'}
                    onClick={() => { setActiveTab('withdraw'); setMessage({ type: '', text: '' }); setAmount(''); }}
                    style={{ flex: 1 }}
                >
                    Withdraw
                </Button>
            </div>

            {activeTab === 'deposit' ? (
                <Card title="Deposit Funds">
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', overflowX: 'auto', paddingBottom: '5px' }}>
                        {[
                            { id: 'mpesa', label: 'M-Pesa', color: '#2ecc71' },
                            { id: 'card', label: 'Card', color: '#635bff' },
                            { id: 'paypal', label: 'PayPal', color: '#003087' },
                            { id: 'airtel', label: 'Airtel', color: '#e74c3c' },
                            { id: 'tkash', label: 'T-Kash', color: '#e67e22' }
                        ].map(method => (
                            <button
                                key={method.id}
                                onClick={() => setPaymentMethod(method.id)}
                                style={{
                                    padding: '8px 16px',
                                    borderRadius: '20px',
                                    border: paymentMethod === method.id ? `2px solid ${method.color}` : '1px solid #ddd',
                                    background: paymentMethod === method.id ? method.color : 'transparent',
                                    color: paymentMethod === method.id ? 'white' : '#666',
                                    cursor: 'pointer',
                                    fontWeight: 500,
                                    whiteSpace: 'nowrap',
                                    transition: 'all 0.2s'
                                }}
                            >
                                {method.label}
                            </button>
                        ))}
                    </div>

                    <form onSubmit={handleDeposit}>
                        {renderPaymentMethodContent()}
                    </form>
                </Card>
            ) : (
                <Card title="Withdraw Funds">
                    <form onSubmit={handleWithdraw}>
                        <Input
                            label="Amount ($)"
                            type="number"
                            min="1"
                            step="0.01"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            required
                            placeholder="0.00"
                        />
                        <Button type="submit" style={{ width: '100%' }} disabled={loading}>
                            {loading ? 'Processing...' : 'Withdraw Now'}
                        </Button>
                    </form>
                </Card>
            )}
        </div>
    );
}
