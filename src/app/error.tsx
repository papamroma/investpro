'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/Button';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error('Application Error:', error);
    }, [error]);

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            backgroundColor: '#000',
            color: '#fff'
        }}>
            <h2 style={{ fontSize: '24px', marginBottom: '16px' }}>Something went wrong!</h2>
            <div style={{
                padding: '16px',
                backgroundColor: '#1a1a1a',
                borderRadius: '8px',
                marginBottom: '24px',
                maxWidth: '600px',
                width: '100%',
                border: '1px solid #333'
            }}>
                <p style={{ color: '#ef4444', fontFamily: 'monospace' }}>{error.message || 'Unknown error occurred'}</p>
                {error.digest && <p style={{ color: '#666', fontSize: '12px', marginTop: '8px' }}>Digest: {error.digest}</p>}
            </div>
            <Button onClick={() => reset()}>Try again</Button>
        </div>
    );
}
