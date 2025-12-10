import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    title?: string;
}

export function Card({ children, className = '', title }: CardProps) {
    return (
        <div className={`glass-panel ${className}`} style={{ padding: '24px' }}>
            {title && (
                <h3 style={{ marginBottom: '16px', fontSize: '1.25rem', fontWeight: 600 }}>
                    {title}
                </h3>
            )}
            {children}
        </div>
    );
}
