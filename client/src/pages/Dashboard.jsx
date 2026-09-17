import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../services/api.js';
import { AccountCard } from '../components/AccountCard.jsx';
import { TransactionForm } from '../components/TransactionForm.jsx';

export const Dashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [accountType, setAccountType] = useState('checking');
    const [selectedAccountId, setSelectedAccountId] = useState('');
    const [transactions, setTransactions] = useState([]);
    const [txLoading, setTxLoading] = useState(false);
    
    const fetchTransactions = async() => {
        if(!selectedAccountId) return;
        try{
            setTxLoading(true);
            const response = await api.get(`/transactions/${selectedAccountId}`);
            setTransactions(response.data);
        }catch(err){
            console.error('Failed to fetch transactions:', err);
        }finally{
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

    useEffect(()=>{
        fetchTransactions();
    }, [selectedAccountId, fetchTransactions]);

    const handleLogout = () => {
        logout();
        navigate('/signin');
    };

    return (
        <div>
            <header>
                <h1>Dashboard</h1>
                {user && <p>Welcome, {user.name || user.email}!</p>}
                <button onClick={handleLogout}>Log Out</button>
            </header>

            <hr />


            {accounts.length > 0 && (
                <TransactionForm 
                    accounts={accounts} 
                    onTransactionSuccess={fetchAccounts} 
                />
            )}

            <section>
                <h2>Your Accounts</h2>

                <button onClick={() => setShowForm(!showForm)}>
                {showForm ? 'Cancel' : 'Create Account'}
                </button>

                {showForm && (
                <form onSubmit={handleCreateAccount} style={{ marginTop: '10px' }}>
                    <label htmlFor="accountTypeSelect">Account Type: </label>
                    <select
                    id="accountTypeSelect"
                    value={accountType}
                    onChange={(e) => setAccountType(e.target.value)}
                    >
                    <option value="checking">Checking</option>
                    <option value="savings">Savings</option>
                    <option value="investment">Investment</option>
                    </select>
                    <button type="submit" style={{ marginLeft: '8px' }}>
                    Submit
                    </button>
                </form>
                )}

                {loading && <p>Loading your accounts...</p>}
                {error && <p style={{ color: 'red' }}>{error}</p>}

                {!loading && !error && accounts.length === 0 && (
                <p>No accounts found. Create your first account to get started.</p>
                )}

                {!loading && !error && accounts.length > 0 && (
                <div style={{ marginTop: '16px' }}>
                    {accounts.map((acc) => (
                    <AccountCard key={acc._id} account={acc} />
                    ))}
                </div>
                )}
                
            </section>
            <section style={{ marginTop: '32px' }}>
                <h2>Transaction History</h2>

                {/* Account Selector for History Feed */}
                {accounts.length > 0 && (
                    <div style={{ marginBottom: '12px' }}>
                        <label htmlFor="history-account">View History For: </label>
                        <select
                            id="history-account"
                            value={selectedAccountId}
                            onChange={(e) => setSelectedAccountId(e.target.value)}
                        >
                            {accounts.map((acc) => (
                                <option key={acc._id} value={acc._id}>
                                    {acc.accountType} ({acc.currency || '$'}{acc.balance})
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {txLoading && <p>Loading transactions...</p>}

                {!txLoading && transactions.length === 0 && (
                    <p>No transactions found for this account.</p>
                )}

                {!txLoading && transactions.length > 0 && (
                    <ul style={{ listStyleType: 'none', padding: 0 }}>
                        {transactions.map((tx) => (
                            <li key={tx._id} style={{ border: '1px solid #eee', padding: '8px', marginBottom: '6px', display: 'flex', gap: '16px' }}>
                                <span>{new Date(tx.createdAt).toLocaleDateString()}</span>
                                <span><strong>{tx.category}</strong></span>
                                <span style={{ color: tx.type === 'deposit' ? 'green' : 'red' }}>
                                    {tx.type.toUpperCase()}
                                </span>
                                <span>{tx.amount}</span>
                                {tx.description && <span style={{ color: '#666' }}>— {tx.description}</span>}
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </div>
    );
};