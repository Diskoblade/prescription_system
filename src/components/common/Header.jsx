import React from 'react';
import { Stethoscope } from 'lucide-react';

export default function Header() {
    return (
        <header style={{
            backgroundColor: 'var(--color-surface)',
            borderBottom: '1px solid var(--color-border)'
        }}>
            <div className="container flex items-center justify-between" style={{ height: '4rem' }}>
                <div className="flex items-center gap-2">
                    <div style={{
                        padding: '0.5rem',
                        background: '#cffafe', // Cyan 100
                        borderRadius: 'var(--radius-md)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <Stethoscope size={24} color="var(--color-primary)" />
                    </div>
                    <h1 style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.025em' }}>
                        MediScript
                    </h1>
                </div>

                <div className="flex items-center gap-4">
                    <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text-muted)' }}>
                        Dr. Rahul TP
                    </span>
                    <div style={{
                        width: '2rem',
                        height: '2rem',
                        borderRadius: '9999px',
                        backgroundColor: '#e2e8f0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: '0.875rem',
                        color: '#475569'
                    }}>
                        DR
                    </div>
                </div>
            </div>
        </header>
    );
}
