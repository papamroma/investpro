"use client";

import React, { createContext, useContext } from 'react';
import { useAuth } from './authContext';

interface FinanceContextType {
    deposit: (amount: number, paymentMethod?: string) => Promise<void>;
    withdraw: (amount: number, method?: string) => Promise<void>;
    invest: (amount: number) => Promise<void>;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export function FinanceProvider({ children }: { children: React.ReactNode }) {
    const { refreshUser } = useAuth();

    const getToken = () => {
        return localStorage.getItem('token');
    };

    const deposit = async (amount: number, paymentMethod: string = 'demo') => {
        const token = getToken();
        if (!token) throw new Error('Not authenticated');

        const response = await fetch('/api/wallet/deposit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ amount, paymentMethod })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Deposit failed');
        }

        // Refresh user data to get updated balance
        await refreshUser();
    };

    const withdraw = async (amount: number, method: string = 'bank') => {
        const token = getToken();
        if (!token) throw new Error('Not authenticated');

        const response = await fetch('/api/wallet/withdraw', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ amount, method })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Withdrawal failed');
        }

        // Refresh user data
        await refreshUser();
    };

    const invest = async (amount: number) => {
        const token = getToken();
        if (!token) throw new Error('Not authenticated');

        const response = await fetch('/api/investments/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ amount })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Investment failed');
        }

        // Refresh user data
        await refreshUser();
    };

    return (
        <FinanceContext.Provider value={{ deposit, withdraw, invest }}>
            {children}
        </FinanceContext.Provider>
    );
}

export function useFinance() {
    const context = useContext(FinanceContext);
    if (context === undefined) {
        throw new Error('useFinance must be used within a FinanceProvider');
    }
    return context;
}
