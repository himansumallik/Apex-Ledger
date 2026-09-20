import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../services/api.js';
import { AccountCard } from '../components/AccountCard.jsx';
import { TransactionForm } from '../components/TransactionForm.jsx';
import { Navbar } from '../components/Navbar.jsx';

export const Dashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [accountType, setAccountType] = useState('checking');
    const [selectedAccountId, setSelectedAccountId] = useState('');
    const [transactions, setTransactions] = useState([]);
    const [txLoading, setTxLoading] = useState(false);
    
    const fetchTransactions = async () => {
        if (!selectedAccountId) return;
        try {
            setTxLoading(true);
            const response = await api.get(`/transactions/${selectedAccountId}`);
            setTransactions(response.data);
        } catch (err) {
            console.error('Failed to fetch transactions:', err);
        } finally {
            setTxLoading(false);
        }
    };

    const fetchAccounts = async () => {
        try {
            setLoading(true);
            setError('');
            const response = await api.get('/accounts');
            setAccounts(response.data);

            if (response.data.length > 0 && !selectedAccountId) {
                setSelectedAccountId(response.data[0]._id);
            }
        } catch (err) {
            console.error('Failed to fetch accounts:', err);
            const errMsg = err.response?.data?.message || 'Failed to load accounts';
            setError(errMsg);
        } finally {
            setLoading(false);
        }
    };

    const handleTransactionSuccess = () => {
        fetchAccounts();
        fetchTransactions();
    };

    const handleCreateAccount = async (e) => {
        e.preventDefault();
        try {
            await api.post('/accounts', { accountType });
            await fetchAccounts();
            setShowForm(false);
            setAccountType('checking');
        } catch (err) {
            console.error('Failed to create account:', err);
            const errMsg = err.response?.data?.message || 'Failed to create account';
            setError(errMsg);
        }
    };

    useEffect(() => {
        fetchAccounts();
    }, []);

    useEffect(() => {
        fetchTransactions();
    }, [selectedAccountId]);

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6', fontFamily: 'Arial, sans-serif' }}>
            <Navbar />

            <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '32px 16px', boxSizing: 'border-box' }}>
                
                {/* Welcome Banner */}
                <div style={{ marginBottom: '24px' }}>
                    <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#111827', margin: 0 }}>
                        Dashboard Overview
                    </h1>
                    {user && (
                        <p style={{ fontSize: '15px', color: '#6b7280', marginTop: '4px' }}>
                            Welcome back, <span style={{ fontWeight: '600', color: '#374151' }}>{user.name || user.email}</span>!
                        </p>
                    )}
                </div>

                {/* Main Content Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>

                    {/* Accounts Card Section */}
                    <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '24px', boxShadow: '0 4px 6px rgba(0,0,0,0.02)', border: '1px solid #e5e7eb' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#111827', margin: 0 }}>
                                Your Accounts
                            </h2>
                            <button 
                                onClick={() => setShowForm(!showForm)}
                                style={{
                                    backgroundColor: showForm ? '#e5e7eb' : '#2563eb',
                                    color: showForm ? '#374151' : '#ffffff',
                                    border: 'none',
                                    borderRadius: '6px',
                                    padding: '8px 16px',
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    transition: 'background-color 0.2s'
                                }}
                            >
                                {showForm ? 'Cancel' : '+ Create Account'}
                            </button>
                        </div>

                        {/* Collapsible Account Creation Form */}
                        {showForm && (
                            <form onSubmit={handleCreateAccount} style={{ backgroundColor: '#f9fafb', padding: '16px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #e5e7eb' }}>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                                    Select Account Type:
                                </label>
                                <div style={{ display: 'flex', gap: '12px' }}>
                                    <select
                                        value={accountType}
                                        onChange={(e) => setAccountType(e.target.value)}
                                        style={{ flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '14px', backgroundColor: '#ffffff' }}
                                    >
                                        <option value="checking">Checking</option>
                                        <option value="savings">Savings</option>
                                        <option value="investment">Investment</option>
                                    </select>
                                    <button 
                                        type="submit" 
                                        style={{ backgroundColor: '#10b981', color: '#ffffff', border: 'none', borderRadius: '6px', padding: '10px 20px', fontWeight: '600', cursor: 'pointer' }}
                                    >
                                        Submit
                                    </button>
                                </div>
                            </form>
                        )}

                        {loading && <p style={{ color: '#6b7280' }}>Loading your accounts...</p>}
                        {error && <p style={{ color: '#dc2626', backgroundColor: '#fef2f2', padding: '10px', borderRadius: '6px' }}>{error}</p>}

                        {!loading && !error && accounts.length === 0 && (
                            <p style={{ color: '#6b7280', fontStyle: 'italic' }}>No accounts found. Create your first account to get started.</p>
                        )}

                        {!loading && !error && accounts.length > 0 && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {accounts.map((acc) => (
                                    <AccountCard key={acc._id} account={acc} />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Transaction Form Section */}
                    {accounts.length > 0 && (
                        <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '24px', boxShadow: '0 4px 6px rgba(0,0,0,0.02)', border: '1px solid #e5e7eb' }}>
                            <TransactionForm 
                                accounts={accounts} 
                                onTransactionSuccess={handleTransactionSuccess} 
                            />
                        </div>
                    )}

                    {/* Transaction History Section */}
                    <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '24px', boxShadow: '0 4px 6px rgba(0,0,0,0.02)', border: '1px solid #e5e7eb' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
                            <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#111827', margin: 0 }}>
                                Transaction History
                            </h2>

                            {accounts.length > 0 && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <label htmlFor="history-account" style={{ fontSize: '14px', fontWeight: '600', color: '#374151' }}>Account:</label>
                                    <select
                                        id="history-account"
                                        value={selectedAccountId}
                                        onChange={(e) => setSelectedAccountId(e.target.value)}
                                        style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '14px', backgroundColor: '#ffffff' }}
                                    >
                                        {accounts.map((acc) => (
                                            <option key={acc._id} value={acc._id}>
                                                {acc.accountType} ({acc.currency || '$'}{acc.balance})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}
                        </div>

                        {txLoading && <p style={{ color: '#6b7280' }}>Loading transactions...</p>}

                        {!txLoading && transactions.length === 0 && (
                            <p style={{ color: '#6b7280', fontStyle: 'italic' }}>No transactions found for this account.</p>
                        )}

                        {!txLoading && transactions.length > 0 && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {transactions.map((tx) => (
                                    <div key={tx._id} style={{ 
                                        display: 'flex', 
                                        justifyContent: 'space-between', 
                                        alignItems: 'center', 
                                        padding: '12px 16px', 
                                        backgroundColor: '#f9fafb', 
                                        borderRadius: '8px', 
                                        border: '1px solid #e5e7eb' 
                                    }}>
                                        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                                            <span style={{ fontSize: '13px', color: '#6b7280', minWidth: '80px' }}>
                                                {new Date(tx.createdAt).toLocaleDateString()}
                                            </span>
                                            <div>
                                                <span style={{ fontWeight: '600', color: '#111827', display: 'block' }}>{tx.category}</span>
                                                {tx.description && <span style={{ fontSize: '13px', color: '#6b7280' }}>{tx.description}</span>}
                                            </div>
                                        </div>

                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <span style={{ 
                                                fontSize: '11px', 
                                                fontWeight: 'bold', 
                                                padding: '4px 8px', 
                                                borderRadius: '4px', 
                                                backgroundColor: tx.type === 'deposit' ? '#d1fae5' : '#fee2e2',
                                                color: tx.type === 'deposit' ? '#065f46' : '#991b1b',
                                                textTransform: 'uppercase'
                                            }}>
                                                {tx.type}
                                            </span>
                                            <span style={{ fontWeight: '700', color: tx.type === 'deposit' ? '#059669' : '#dc2626' }}>
                                                {tx.type === 'deposit' ? '+' : '-'}${Math.abs(tx.amount).toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};