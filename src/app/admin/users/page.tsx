"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/lib/authContext';
import { Card } from '@/components/ui/Card';

export default function AdminUsersPage() {
    const { getToken } = useAuth();
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = getToken();
                const res = await fetch('/api/admin/users', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setUsers(data);
                }
            } catch (error) {
                console.error('Failed to fetch users', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [getToken]);

    if (loading) return <div>Loading users...</div>;

    return (
        <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '30px', color: 'white' }}>User Management</h1>

            <Card>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', color: 'white' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid #333', textAlign: 'left' }}>
                                <th style={{ padding: '15px' }}>Name</th>
                                <th style={{ padding: '15px' }}>Email</th>
                                <th style={{ padding: '15px' }}>Phone</th>
                                <th style={{ padding: '15px' }}>Balance</th>
                                <th style={{ padding: '15px' }}>Joined</th>
                                <th style={{ padding: '15px' }}>Role</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id} style={{ borderBottom: '1px solid #222' }}>
                                    <td style={{ padding: '15px' }}>{user.name}</td>
                                    <td style={{ padding: '15px' }}>{user.email}</td>
                                    <td style={{ padding: '15px' }}>{user.phone || '-'}</td>
                                    <td style={{ padding: '15px', color: '#10b981', fontWeight: 'bold' }}>
                                        ${Number(user.balance).toFixed(2)}
                                    </td>
                                    <td style={{ padding: '15px', color: '#888' }}>
                                        {new Date(user.joined).toLocaleDateString()}
                                    </td>
                                    <td style={{ padding: '15px' }}>
                                        {user.isAdmin ? (
                                            <span style={{ background: '#ef4444', padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>Admin</span>
                                        ) : (
                                            <span style={{ background: '#333', padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>User</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}
