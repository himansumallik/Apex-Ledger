import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api.js';

export const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const signinLink = <Link to="/signin" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: '600' }}>Sign In</Link>;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            setLoading(true);
            const response = await api.post('/auth/signup', { name, email, password });

            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
            }

            navigate('/signin');
        } catch (err) {
            const errMsg = err.response?.data?.message || 'Sign Up failed';
            setError(errMsg); 
            console.error(errMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            display: 'flex',
            minHeight: '100vh',
            fontFamily: 'Arial, sans-serif',
            backgroundColor: '#f3f4f6',
            width: '100vw',
            overflow: 'hidden'
        }}>
            {/* Left Half: Branding, Logo & Hero Content */}
            <div style={{
                flex: '1',
                background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)',
                color: '#ffffff',
                padding: '64px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxSizing: 'border-box',
            }}>
                {/* Logo & App Name */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        backgroundColor: '#ffffff',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold',
                        color: '#2563eb',
                        fontSize: '20px',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                    }}>
                        A
                    </div>
                    <span style={{ fontSize: '22px', fontWeight: 'bold', letterSpacing: '0.5px' }}>ApexLedger</span>
                </div>

                {/* Hero Center Content */}
                <div style={{ maxWidth: '480px', margin: 'auto 0' }}>
                    <span style={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.15)', 
                        padding: '6px 12px', 
                        borderRadius: '20px', 
                        fontSize: '13px', 
                        fontWeight: '500',
                        letterSpacing: '0.5px',
                        textTransform: 'uppercase'
                    }}>
                        Get Started Today
                    </span>
                    <h1 style={{ fontSize: '42px', fontWeight: '800', lineHeight: '1.2', marginTop: '20px', marginBottom: '16px' }}>
                        Create your financial command center.
                    </h1>
                    <p style={{ fontSize: '16px', color: '#93c5fd', lineHeight: '1.6', marginBottom: '32px' }}>
                        Join ApexLedger to structure your accounts, track cash flow seamlessly, and prepare for intelligent financial management.
                    </p>

                    {/* Feature Highlights */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '15px' }}>
                            <span style={{ color: '#4ade80', fontWeight: 'bold' }}>✓</span> Instant account initialization
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '15px' }}>
                            <span style={{ color: '#4ade80', fontWeight: 'bold' }}>✓</span> Automated balance tracking & history feeds
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '15px' }}>
                            <span style={{ color: '#4ade80', fontWeight: 'bold' }}>✓</span> Robust security with token-based interceptors
                        </div>
                    </div>
                </div>

                {/* Footer copy */}
                <div style={{ fontSize: '13px', color: '#93c5fd' }}>
                    © 2026 ApexLedger Inc. All rights reserved.
                </div>
            </div>

            {/* Right Half: Signup Form Container */}
            <div style={{
                flex: '1',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '32px',
                backgroundColor: '#ffffff',
                boxSizing: 'border-box'
            }}>
                <form onSubmit={handleSubmit} style={{
                    width: '100%',
                    maxWidth: '420px',
                    padding: '16px'
                }}>
                    <div style={{ marginBottom: '32px' }}>
                        <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#111827', marginBottom: '8px' }}>
                            Create an Account
                        </h2>
                        <p style={{ fontSize: '14px', color: '#6b7280' }}>
                            Fill in your details below to set up your ledger.
                        </p>
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                            Full Name
                        </label>
                        <input
                            type="text"
                            placeholder="John Doe"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                borderRadius: '8px',
                                border: '1px solid #d1d5db',
                                fontSize: '15px',
                                boxSizing: 'border-box',
                                outline: 'none',
                                transition: 'border-color 0.2s',
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                            Email Address
                        </label>
                        <input
                            type="email"
                            placeholder="name@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                borderRadius: '8px',
                                border: '1px solid #d1d5db',
                                fontSize: '15px',
                                boxSizing: 'border-box',
                                outline: 'none',
                                transition: 'border-color 0.2s',
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: '24px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                            Password
                        </label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                borderRadius: '8px',
                                border: '1px solid #d1d5db',
                                fontSize: '15px',
                                boxSizing: 'border-box',
                                outline: 'none',
                                transition: 'border-color 0.2s',
                            }}
                        />
                    </div>

                    {error && (
                        <div style={{ 
                            backgroundColor: '#fef2f2', 
                            border: '1px solid #fecaca', 
                            padding: '12px', 
                            borderRadius: '8px', 
                            marginBottom: '20px' 
                        }}>
                            <p style={{ color: '#dc2626', fontSize: '14px', margin: 0 }}>{error}</p>
                        </div>
                    )}

                    <button 
                        type="submit" 
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '12px 16px',
                            backgroundColor: loading ? '#9ca3af' : '#2563eb',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '16px',
                            fontWeight: '600',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            boxShadow: '0 4px 6px rgba(37, 99, 235, 0.2)',
                            transition: 'background-color 0.2s'
                        }}
                    >
                        {loading ? 'Signing up...' : 'Sign Up'}
                    </button>

                    <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '14px', color: '#6b7280' }}>
                        <span>Already have an account? {signinLink}</span>
                    </div>
                </form>
            </div>
        </div>
    );
};