import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../services/api.js';
import { AccountCard } from '../components/AccountCard.jsx';

export const Dashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [accountType, setAccountType] = useState('checking');

    const fetchAccounts = async () => {
        try {
        setLoading(true);
        setError('');
        const response = await api.get('/accounts');
        setAccounts(response.data);
        } catch (err) {
        console.error('Failed to fetch accounts:', err);
        const errMsg = err.response?.data?.message || 'Failed to load accounts';
        setError(errMsg);
        } finally {
        setLoading(false);
        }
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
        </div>
    );
};