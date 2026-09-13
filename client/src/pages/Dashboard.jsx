import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export const Dashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/signin');
    };

    return (
        <div>
        <h1>Dashboard</h1>
        {user && <p>Welcome, {user.name || user.email}!</p>}
        <button onClick={handleLogout}>Log Out</button>
        </div>
    );
};