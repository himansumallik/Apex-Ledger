import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api.js';

export const AdminDashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { token, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAdminData = async () => {
            try {
                const response = await api.get('/admin/dashboard', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                setData(response.data);
            } catch (err) {
                console.error('Admin Dashboard Fetch Error:', err);
                setError(err.response?.data?.message || 'Failed to load admin data');
            } finally {
                setLoading(false);
            }
        };

        fetchAdminData();
    }, [token]);

    if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading Admin Portal...</div>;
    if (error) return <div style={{ padding: '40px', color: 'red', textAlign: 'center' }}>{error}</div>;

    return (
        <div style={{ padding: '32px', fontFamily: 'Arial, sans-serif', backgroundColor: '#f3f4f6', minHeight: '100vh' }}>
            {/* Admin Header Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', background: '#1e3a8a', padding: '20px 32px', borderRadius: '12px', color: '#fff' }}>
                <div>
                    <h1 style={{ margin: 0, fontSize: '24px' }}>🛡️ ApexLedger Admin Control Center</h1>
                    <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#93c5fd' }}>Platform-wide multi-tenant management</p>
                </div>
                <button 
                    onClick={() => { logout(); navigate('/login'); }}
                    style={{ padding: '8px 16px', background: '#dc2626', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                    Logout
                </button>
            </div>

            {/* Metric Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '32px' }}>
                <div style={{ background: '#fff', padding: '24px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                    <h3 style={{ margin: '0 0 8px 0', color: '#6b7280', fontSize: '14px' }}>Total Registered Users</h3>
                    <p style={{ margin: 0, fontSize: '32px', fontWeight: 'bold', color: '#111827' }}>{data?.totalUsers}</p>
                </div>
                <div style={{ background: '#fff', padding: '24px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                    <h3 style={{ margin: '0 0 8px 0', color: '#6b7280', fontSize: '14px' }}>Total System Accounts</h3>
                    <p style={{ margin: 0, fontSize: '32px', fontWeight: 'bold', color: '#2563eb' }}>{data?.totalAccounts}</p>
                </div>
            </div>

            {/* Users Table */}
            <div style={{ background: '#fff', padding: '24px', borderRadius: '8px', marginBottom: '32px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                <h2 style={{ fontSize: '18px', marginBottom: '16px', color: '#111827' }}>System Users</h2>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid #e5e7eb', color: '#374151' }}>
                                <th style={{ padding: '10px' }}>Name</th>
                                <th style={{ padding: '10px' }}>Email</th>
                                <th style={{ padding: '10px' }}>Role</th>
                                <th style={{ padding: '10px' }}>Joined Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data?.users.map(u => (
                                <tr key={u._id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                    <td style={{ padding: '10px', fontWeight: '500' }}>{u.name}</td>
                                    <td style={{ padding: '10px', color: '#6b7280' }}>{u.email}</td>
                                    <td style={{ padding: '10px' }}>
                                        <span style={{ 
                                            padding: '2px 8px', 
                                            borderRadius: '4px', 
                                            fontSize: '12px', 
                                            fontWeight: 'bold',
                                            backgroundColor: u.role === 'admin' ? '#fee2e2' : '#e0f2fe',
                                            color: u.role === 'admin' ? '#991b1b' : '#0369a1'
                                        }}>
                                            {u.role}
                                        </span>
                                    </td>
                                    <td style={{ padding: '10px', color: '#6b7280' }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Accounts Table */}
            <div style={{ background: '#fff', padding: '24px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                <h2 style={{ fontSize: '18px', marginBottom: '16px', color: '#111827' }}>Platform Accounts</h2>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid #e5e7eb', color: '#374151' }}>
                                <th style={{ padding: '10px' }}>Owner</th>
                                <th style={{ padding: '10px' }}>Account Type</th>
                                <th style={{ padding: '10px' }}>Balance</th>
                                <th style={{ padding: '10px' }}>Created</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data?.accounts.map(acc => (
                                <tr key={acc._id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                    <td style={{ padding: '10px' }}>{acc.userId?.name || 'Unknown'} ({acc.userId?.email})</td>
                                    <td style={{ padding: '10px', fontWeight: '500' }}>{acc.accountType}</td>
                                    <td style={{ padding: '10px', fontWeight: 'bold', color: '#16a34a' }}>${acc.balance.toFixed(2)}</td>
                                    <td style={{ padding: '10px', color: '#6b7280' }}>{new Date(acc.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};