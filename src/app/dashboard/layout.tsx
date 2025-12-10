"use client";

import React, { useEffect } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';
import { useAuth } from '@/lib/authContext';
import { useRouter } from 'next/navigation';
import { FinanceProvider } from '@/lib/financeContext';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
        }
    }, [isAuthenticated, router]);

    if (!isAuthenticated) {
        return null; // Or a loading spinner
    }

    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            <FinanceProvider>
                <Sidebar />
                <div style={{ flex: 1, marginLeft: '250px', display: 'flex', flexDirection: 'column' }}>
                    <Navbar />
                    <main style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
                        <div className="container">
                            {children}
                        </div>
                    </main>
                </div>
            </FinanceProvider>
        </div>
    );
}
