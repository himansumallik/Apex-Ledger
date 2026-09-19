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