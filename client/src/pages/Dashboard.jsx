import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../services/api.js';

export const Dashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(()=>{
        const fetchAccounts = async() => {
            try{
                setLoading(true);
                setError('');
                const response = await api.get('/accounts');
                setAccounts(response.data);
            }catch(err){
                console.error('Failed to fetch accounts:', err);
                const errMsg = err.response?.data?.message || 'Failed to load accounts';
                setError(errMsg);
            }finally{
                setLoading(false);
            }
        };
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

                {loading && <p>Loading your accounts...</p>}
                {error && <p style={{ color: 'red'}}>{error}</p>}

                {!loading && !error && accounts.length === 0 && (
                    <p>No accounts found. Create your first account to get started.</p>
                )}

                {!loading && !error && accounts.length > 0 && (
                    <ul>
                        {accounts.map((account) => (
                        <li key={account._id}>
                            <strong>{account.name || account.accountType}</strong>: {account.currency || '$'}{account.balance}
                        </li>
                        ))}
                    </ul>
                )}
            </section>
        </div>
    );
};