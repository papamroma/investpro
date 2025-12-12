"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import Link from 'next/link';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState({ type: '', text: '' });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const response = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to send reset link');
            }

            setMessage({
                type: 'success',
                text: 'If an account exists with this email, a reset link has been sent.'
            });
            setEmail('');
        } catch (err: any) {
            setMessage({ type: 'error', text: err.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <Card className="w-full max-w-md" title="Reset Password">
                <p style={{ color: '#888', marginBottom: '20px', fontSize: '0.9rem' }}>
                    Enter your email address and we'll send you a link to reset your password.
                </p>

                <form onSubmit={handleSubmit}>
                    <Input
                        label="Email Address"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="john@example.com"
                    />

                    {message.text && (
                        <div style={{
                            padding: '12px',
                            borderRadius: '4px',
                            marginBottom: '20px',
                            background: message.type === 'error' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                            color: message.type === 'error' ? '#ef4444' : '#10b981',
                            border: `1px solid ${message.type === 'error' ? '#ef4444' : '#10b981'}`
                        }}>
                            {message.text}
                        </div>
                    )}

                    <Button type="submit" style={{ width: '100%' }} disabled={loading}>
                        {loading ? 'Sending Link...' : 'Send Reset Link'}
                    </Button>

                    <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem' }}>
                        <Link href="/login" style={{ color: 'var(--primary)' }}>
                            Back to Login
                        </Link>
                    </div>
                </form>
            </Card>
        </div>
    );
}
