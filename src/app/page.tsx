"use client";

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function LandingPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{
        height: '80px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 40px',
        borderBottom: '1px solid var(--border)',
        backdropFilter: 'blur(10px)',
        position: 'fixed',
        width: '100%',
        zIndex: 100
      }}>
        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)' }}>
          InvestPro
        </div>
        <div style={{ display: 'flex', gap: '15px' }}>
          <Link href="/login">
            <Button variant="outline">Log In</Button>
          </Link>
          <Link href="/signup">
            <Button>Get Started</Button>
          </Link>
        </div>
      </header>

      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '80px' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h1 style={{
            fontSize: '4rem',
            fontWeight: 800,
            marginBottom: '20px',
            lineHeight: 1.1,
            background: 'linear-gradient(to right, #fff, #aaa)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Grow Your Wealth <br />
            <span style={{ color: 'var(--primary)', WebkitTextFillColor: 'var(--primary)' }}>With Confidence</span>
          </h1>

          <p style={{ fontSize: '1.2rem', color: '#888', maxWidth: '600px', margin: '0 auto 40px' }}>
            Join thousands of investors earning stable returns.
            Experience our premium platform with 5% daily interest rates and secure withdrawals.
          </p>

          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
            <Link href="/signup">
              <Button style={{ padding: '16px 32px', fontSize: '1.1rem' }}>
                Start Investing Now
              </Button>
            </Link>
          </div>

          <div style={{ marginTop: '80px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '40px' }}>
            <div className="glass-panel" style={{ padding: '30px' }}>
              <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🚀</div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '10px' }}>High Returns</h3>
              <p style={{ color: '#888' }}>Earn consistent 5% daily interest on your investments.</p>
            </div>
            <div className="glass-panel" style={{ padding: '30px' }}>
              <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🛡️</div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '10px' }}>Secure Platform</h3>
              <p style={{ color: '#888' }}>Your data and funds are protected with state-of-the-art security.</p>
            </div>
            <div className="glass-panel" style={{ padding: '30px' }}>
              <div style={{ fontSize: '2rem', marginBottom: '10px' }}>⚡</div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '10px' }}>Instant Withdrawals</h3>
              <p style={{ color: '#888' }}>Access your funds anytime with our quick withdrawal system.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
