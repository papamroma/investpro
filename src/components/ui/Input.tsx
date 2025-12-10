import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export function Input({ label, error, className = '', ...props }: InputProps) {
    return (
        <div style={{ marginBottom: '1rem' }}>
            {label && (
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#ccc' }}>
                    {label}
                </label>
            )}
            <input
                className={`input-field ${className}`}
                {...props}
            />
            {error && (
                <span style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>
                    {error}
                </span>
            )}
        </div>
    );
}
