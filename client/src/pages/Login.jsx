import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

export const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const { login } = useAuth();
    const signup = <Link to="/signup" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: '600' }}>Sign Up</Link>;

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Submit triggered! Payload:", { email, password });

        try {
            setLoading(true);
            const response = await api.post('/auth/signin', { email, password });

            const { token, user } = response.data;

            // Save auth data via AuthContext / localStorage
            login(token, user);

            // SMART ROLE-BASED REDIRECTION
            if (user.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/dashboard');
            }
        } catch (err) {
            console.dir(err);
            console.log("Status code:", err.response?.status);
            console.log("Server response:", err.response?.data);
            console.log("Error message:", err.message);
            
            const errMsg = err.response?.data?.message || err.message || 'Login failed';
            setError(errMsg); 
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
            }}
            className="brand-section"
            >
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
                        Smart Financial Engine
                    </span>
                    <h1 style={{ fontSize: '42px', fontWeight: '800', lineHeight: '1.2', marginTop: '20px', marginBottom: '16px' }}>
                        Manage your finances with absolute precision.
                    </h1>
                    <p style={{ fontSize: '16px', color: '#93c5fd', lineHeight: '1.6', marginBottom: '32px' }}>
                        Track accounts, securely monitor transaction flows, and get ready for next-gen AI insights tailored to your portfolio.
                    </p>

                    {/* Feature Highlights */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '15px' }}>
                            <span style={{ color: '#4ade80', fontWeight: 'bold' }}>✓</span> Secure JWT Authentication & RBAC
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '15px' }}>
                            <span style={{ color: '#4ade80', fontWeight: 'bold' }}>✓</span> Real-time account balance synchronization
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '15px' }}>
                            <span style={{ color: '#4ade80', fontWeight: 'bold' }}>✓</span> Instant tracking for deposits and withdrawals
                        </div>
                    </div>
                </div>

                {/* Footer copy */}
                <div style={{ fontSize: '13px', color: '#93c5fd' }}>
                    © 2026 ApexLedger Inc. All rights reserved.
                </div>
            </div>

            {/* Right Half: Login Form Container */}
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
                            Welcome back
                        </h2>
                        <p style={{ fontSize: '14px', color: '#6b7280' }}>
                            Please enter your credentials to access your dashboard.
                        </p>
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
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>

                    {/* Professional Demo Quick-Access Panel */}
                    <div style={{
                        marginTop: '24px',
                        padding: '16px',
                        backgroundColor: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '10px',
                        fontSize: '13px',
                        color: '#475569'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                            <span style={{ fontWeight: '600', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <span>⚡</span> Quick Demo Access
                            </span>
                            <span style={{ fontSize: '11px', backgroundColor: '#e0f2fe', color: '#0369a1', padding: '2px 8px', borderRadius: '12px', fontWeight: '500' }}>
                                Role Testing
                            </span>
                        </div>
                        <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 12px 0', lineHeight: '1.4' }}>
                            Click a profile below to instantly test different RBAC security permissions:
                        </p>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                            <button 
                                type="button"
                                onClick={() => { 
                                    setEmail('admin@apex.com'); 
                                    setPassword('yourAdminPassword'); 
                                }}
                                style={{
                                    padding: '8px 12px',
                                    backgroundColor: '#ffffff',
                                    color: '#1e293b',
                                    border: '1px solid #cbd5e1',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    fontWeight: '500',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '6px',
                                    transition: 'all 0.2s',
                                    boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
                                }}
                            >
                                <span>👑</span> Admin Mode
                            </button>
                            <button 
                                type="button"
                                onClick={() => { 
                                    setEmail('user@apex.com'); 
                                    setPassword('yourUserPassword'); 
                                }}
                                style={{
                                    padding: '8px 12px',
                                    backgroundColor: '#ffffff',
                                    color: '#1e293b',
                                    border: '1px solid #cbd5e1',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    fontWeight: '500',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '6px',
                                    transition: 'all 0.2s',
                                    boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
                                }}
                            >
                                <span>👤</span> User Mode
                            </button>
                        </div>
                    </div>

                    <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '14px', color: '#6b7280' }}>
                        <span>Don't have an account? {signup}</span>
                    </div>
                </form>
            </div>
        </div>
    );
};