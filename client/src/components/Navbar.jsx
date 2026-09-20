import { useNavigate } from "react-router-dom";
import {useAuth} from "../context/AuthContext";


export const Navbar = () => {
    const {user, logout} = useAuth();
    const navigate = useNavigate();
    
    const handleLogout = () => {
        logout();
        navigate('/signin');
    }

    return(
        <nav style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 24px', borderBottom: '1px solid #ddd'}}>
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
            <h3>ApexLedger</h3>
            <div>
                {user && <span style={{ color: '#555' }}>{user.name || user.email}</span>}
                <button onClick={handleLogout} style={{ padding: '6px 12px', cursor: 'pointer' }}>
                    Logout
                </button>
            </div>
        </nav>
    )
}