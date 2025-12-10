"use client";

import React, { useState } from 'react';
import { parsePhoneNumber, isValidPhoneNumber } from 'libphonenumber-js';

interface PhoneInputProps {
    value: string;
    onChange: (phone: string, countryCode: string) => void;
    label?: string;
    error?: string;
    required?: boolean;
}

const countries = [
    { code: '+254', name: 'Kenya', flag: '🇰🇪', country: 'KE' },
    { code: '+256', name: 'Uganda', flag: '🇺🇬', country: 'UG' },
    { code: '+255', name: 'Tanzania', flag: '🇹🇿', country: 'TZ' },
    { code: '+250', name: 'Rwanda', flag: '🇷🇼', country: 'RW' },
    { code: '+1', name: 'USA/Canada', flag: '🇺🇸', country: 'US' },
    { code: '+44', name: 'UK', flag: '🇬🇧', country: 'GB' },
];

export function PhoneInput({ value, onChange, label, error, required }: PhoneInputProps) {
    const [selectedCountry, setSelectedCountry] = useState(countries[0]);
    const [phoneNumber, setPhoneNumber] = useState('');

    const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const country = countries.find(c => c.code === e.target.value) || countries[0];
        setSelectedCountry(country);
        onChange(phoneNumber, country.code);
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const phone = e.target.value.replace(/\D/g, ''); // Remove non-digits
        setPhoneNumber(phone);
        onChange(phone, selectedCountry.code);
    };

    const fullPhone = selectedCountry.code + phoneNumber;
    const isValid = phoneNumber.length > 0 ? isValidPhoneNumber(fullPhone) : true;

    return (
        <div style={{ marginBottom: '1rem' }}>
            {label && (
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#ccc' }}>
                    {label} {required && <span style={{ color: '#ef4444' }}>*</span>}
                </label>
            )}

            <div style={{ display: 'flex', gap: '10px' }}>
                <select
                    value={selectedCountry.code}
                    onChange={handleCountryChange}
                    className="input-field"
                    style={{ width: '140px', padding: '12px' }}
                >
                    {countries.map((country) => (
                        <option key={country.code} value={country.code}>
                            {country.flag} {country.code}
                        </option>
                    ))}
                </select>

                <input
                    type="tel"
                    value={phoneNumber}
                    onChange={handlePhoneChange}
                    placeholder="712345678"
                    className="input-field"
                    style={{ flex: 1 }}
                    required={required}
                />
            </div>

            {phoneNumber && !isValid && (
                <span style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>
                    Invalid phone number format
                </span>
            )}

            {error && (
                <span style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>
                    {error}
                </span>
            )}

            <div style={{ fontSize: '0.75rem', color: '#888', marginTop: '0.25rem' }}>
                Full number: {fullPhone}
            </div>
        </div>
    );
}
