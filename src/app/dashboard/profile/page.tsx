"use client";

import React from 'react';
import { useAuth } from '@/lib/authContext';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';

export default function ProfilePage() {
    const { user } = useAuth();

    return (
        <div>
            <h1 className="page-title">My Profile</h1>
            <Card title="Personal Information" className="max-w-2xl">
                <div style={{ display: 'grid', gap: '20px' }}>
                    <Input
                        label="Full Name"
                        value={user?.fullName || ''}
                        readOnly
                        disabled
                    />
                    <Input
                        label="Email Address"
                        value={user?.email || ''}
                        readOnly
                        disabled
                    />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <Input
                            label="ID Number"
                            value={user?.idNumber || ''}
                            readOnly
                            disabled
                        />
                        <Input
                            label="Date of Birth"
                            value={user?.dob || ''}
                            readOnly
                            disabled
                        />
                    </div>
                </div>
            </Card>
        </div>
    );
}
