"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import { AdminSidebar } from '@/components/layout/AdminSidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading) {
            if (!user) {
                router.push('/login');
            } else if (!user.isAdmin) {
                router.push('/dashboard'); // Kick non-admins out
            }
        }
    }, [user, loading, router]);

    if (loading) {
        return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#000', color: '#fff' }}>Loading Admin Panel...</div>;
    }

    if (!user || !user.isAdmin) {
        return null; // Don't render anything while redirecting
    }

    return (
        <div style={{ minHeight: '100vh', background: '#000' }}>
            <AdminSidebar />
            <main style={{ marginLeft: '250px', padding: '40px' }}>
                {children}
            </main>
        </div>
    );
}
