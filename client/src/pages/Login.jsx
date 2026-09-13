import {useState, useEffect} from 'react';
import {useNavigate, Link} from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export const Login =  () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const {login} = useAuth();
    const signup = <Link to="/signup">Sign Up</Link>;

    const handleSubmit = async(e) =>{
        e.preventDefault();

        try {
            setLoading(true);
            const response = await axios.post('http://localhost:5000/api/auth/signin', {
                email, 
                password
            });

            login(response.data.token, response.data.user);
            navigate('/dashboard');
        } catch (error) {
            const errMsg = error.response?.data?.message || 'Login failed';
            setError(errMsg); 
            console.error(errMsg);
        }finally{
            setLoading(false);
        }
    }

    return (
        <>
            <form onSubmit={handleSubmit}>
                <h3>Email</h3>
                <input 
                    type = "email"
                    value = {email}
                    onChange = {(e) => setEmail(e.target.value)}
                    required
                />

                <h3>Password</h3>
                <input 
                    type = "password"
                    value = {password}
                    onChange = {(e) => setPassword(e.target.value)}
                    required
                />
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button 
                    type="submit"
                    disabled = {loading}
                >
                    {loading ? 'Logging in...' : 'Sign In'}
                </button>
                <h3>`Don't have an account? {signup}`</h3>
            </form>
        </>
    )
}