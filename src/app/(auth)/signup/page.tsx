"use client";

import React, { useState } from 'react';
import { useAuth } from '@/lib/authContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import Link from 'next/link';

export default function SignupPage() {
    const { register } = useAuth();
    const [formData, setFormData] = useState({
        fullName: '',
        idNumber: '',
        dob: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        try {
            await register({
                fullName: formData.fullName,
                idNumber: formData.idNumber,
                dob: formData.dob,
                email: formData.email,
                password: formData.password
            });
        } catch (err: any) {
            setError(err.message || 'Failed to register');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <Card className="w-full max-w-md" title="Create Account">
                <form onSubmit={handleSubmit}>
                    <Input
                        label="Full Name"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                        placeholder="John Doe"
                    />
                    <Input
                        label="ID Number"
                        name="idNumber"
                        value={formData.idNumber}
                        onChange={handleChange}
                        required
                        placeholder="12345678"
                    />
                    <Input
                        label="Date of Birth"
                        name="dob"
                        type="date"
                        value={formData.dob}
                        onChange={handleChange}
                        required
                    />
                    <Input
                        label="Email Address"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="john@example.com"
                    />
                    <Input
                        label="Password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        placeholder="••••••••"
                    />
                    <Input
                        label="Confirm Password"
                        name="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        placeholder="••••••••"
                    />

                    {error && (
                        <div style={{ color: '#ef4444', marginBottom: '1rem', fontSize: '0.9rem' }}>
                            {error}
                        </div>
                    )}

                    <Button type="submit" style={{ width: '100%' }} disabled={loading}>
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </Button>

                    <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem', color: '#888' }}>
                        Already have an account?{' '}
                        <Link href="/login" style={{ color: 'var(--primary)' }}>
                            Log in
                        </Link>
                    </div>
                </form>
            </Card>
        </div>
    );
}
