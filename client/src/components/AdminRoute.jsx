import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const AdminRoute = ({ children }) => {
    const { user, token, loading } = useAuth();

    // 1. While auth state is initializing, show a loader instead of redirecting
    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '100px', fontSize: '18px', color: '#4b5563' }}>
                Verifying administrative credentials...
            </div>
        );
    }

    // 2. If fully loaded and still no token/user, go to login
    if (!token || !user) {
        return <Navigate to="/signin" replace />;
    }

    // 3. If logged in but NOT an admin, bounce to user dashboard
    if (user.role !== 'admin') {
        return <Navigate to="/dashboard" replace />;
    }

    // 4. Authorized as admin! Render the admin page
    return children;
};