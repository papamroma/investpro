"use client";

import React, { useState } from 'react';
import { Button } from './Button';

interface FileUploadProps {
    label: string;
    accept?: string;
    onFileSelect: (file: File) => void;
    maxSize?: number; // in MB
}

export function FileUpload({ label, accept = "image/*,.pdf", onFileSelect, maxSize = 5 }: FileUploadProps) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [error, setError] = useState('');
    const [preview, setPreview] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Check file size
        if (file.size > maxSize * 1024 * 1024) {
            setError(`File size must be less than ${maxSize}MB`);
            return;
        }

        setError('');
        setSelectedFile(file);
        onFileSelect(file);

        // Create preview for images
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setPreview(null);
        }
    };

    return (
        <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#ccc' }}>
                {label}
            </label>

            <div className="glass-panel" style={{ padding: '20px', textAlign: 'center' }}>
                <input
                    type="file"
                    accept={accept}
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                    id="file-upload"
                />

                <label htmlFor="file-upload">
                    <Button type="button" onClick={() => document.getElementById('file-upload')?.click()}>
                        {selectedFile ? 'Change File' : 'Choose File'}
                    </Button>
                </label>

                {selectedFile && (
                    <div style={{ marginTop: '15px' }}>
                        <div style={{ fontSize: '0.9rem', color: 'var(--primary)' }}>
                            ✓ {selectedFile.name}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#888' }}>
                            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </div>
                    </div>
                )}

                {preview && (
                    <div style={{ marginTop: '15px' }}>
                        <img
                            src={preview}
                            alt="Preview"
                            style={{
                                maxWidth: '100%',
                                maxHeight: '200px',
                                borderRadius: 'var(--radius)',
                                border: '1px solid var(--border)'
                            }}
                        />
                    </div>
                )}

                {error && (
                    <div style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '10px' }}>
                        {error}
                    </div>
                )}

                <div style={{ fontSize: '0.75rem', color: '#888', marginTop: '10px' }}>
                    Accepted formats: JPG, PNG, PDF • Max size: {maxSize}MB
                </div>
            </div>
        </div>
    );
}
