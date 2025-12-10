"use client";

import React from 'react';

interface CountrySelectorProps {
    value: string;
    onChange: (country: string) => void;
    label?: string;
    error?: string;
}

const countries = [
    { code: 'KE', name: 'Kenya', flag: '🇰🇪' },
    { code: 'UG', name: 'Uganda', flag: '🇺🇬' },
    { code: 'TZ', name: 'Tanzania', flag: '🇹🇿' },
    { code: 'RW', name: 'Rwanda', flag: '🇷🇼' },
    { code: 'US', name: 'United States', flag: '🇺🇸' },
    { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
    { code: 'CA', name: 'Canada', flag: '🇨🇦' },
    { code: 'ZA', name: 'South Africa', flag: '🇿🇦' },
    { code: 'NG', name: 'Nigeria', flag: '🇳🇬' },
    { code: 'GH', name: 'Ghana', flag: '🇬🇭' },
];

export function CountrySelector({ value, onChange, label, error }: CountrySelectorProps) {
    return (
        <div style={{ marginBottom: '1rem' }}>
            {label && (
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#ccc' }}>
                    {label}
                </label>
            )}

            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="input-field"
                required
            >
                <option value="">Select Country</option>
                {countries.map((country) => (
                    <option key={country.code} value={country.code}>
                        {country.flag} {country.name}
                    </option>
                ))}
            </select>

            {error && (
                <span style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>
                    {error}
                </span>
            )}
        </div>
    );
}
