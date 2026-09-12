import {useState} from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();


    const handleSubmit = async(e) => {
        e.preventDefault();
        setError('');

        try {
            setLoading(true);
            const response = await axios.post('http://localhost:5000/api/auth/signup', {name, email, password});

            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
            }

            navigate('/signin')
        } catch (error) {
            const errMsg = error.response?.data?.message || 'Sign Up failed';
            setError(errMsg); 
            console.error(errMsg);
        }finally{
            setLoading(false);
        }
    }


    return(
        <>
            <form onSubmit = {handleSubmit}>
                <h2>Create an Account</h2>
                
                {error && <p style={{ color: 'red' }}>{error}</p>}

                <div>
                    <label>Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? 'Signing up...' : 'Sign Up'}
                </button>
            </form>

            <p>
                Already have an account? <Link to="/signin">Sign In</Link>
            </p>
        </>
    )
}