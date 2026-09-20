import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    
    const handleLogout = () => {
        logout();
        navigate('/signin');
    };

    return (
        <nav style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            padding: '16px 32px', 
            backgroundColor: '#ffffff',
            borderBottom: '1px solid #e5e7eb',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
        }}>
            {/* Branded Logo & Name */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                    width: '36px',
                    height: '36px',
                    backgroundColor: '#2563eb',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    color: '#ffffff',
                    fontSize: '18px',
                    boxShadow: '0 2px 4px rgba(37, 99, 235, 0.2)'
                }}>
                    A
                </div>
                <span style={{ fontSize: '20px', fontWeight: '800', letterSpacing: '-0.5px', color: '#111827' }}>
                    ApexLedger
                </span>
            </div>

            {/* User Info & Logout */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                {user && (
                    <span style={{ fontSize: '14px', color: '#4b5563', fontWeight: '500' }}>
                        {user.name || user.email}
                    </span>
                )}
                <button 
                    onClick={handleLogout} 
                    style={{ 
                        padding: '8px 16px', 
                        cursor: 'pointer',
                        backgroundColor: '#f3f4f6',
                        color: '#374151',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '14px',
                        fontWeight: '600',
                        transition: 'background-color 0.2s'
                    }}
                >
                    Logout
                </button>
            </div>
        </nav>
    );
};