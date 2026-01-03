import React, { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const CLIENT_ID = 'RRzZ15WgM7YfdyuT485UtwsG7Z6mrMLDmU68R4IP';
    const CLIENT_SECRET = '9JvflXYDAfWa1I6C9u233zKo7cnyjuBJr5vwgbe0eqiZOTZInJryOHfkO8HxA24HxOUQwfBIEr0tvlhYux1RBoqGa36ROPgERciXyIhq0NtR8kdSUx7GZoOLwIXXLuFd';

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await api.post('/o/token/', new URLSearchParams({
                grant_type: 'password',
                username: username,
                password: password,
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
            }));

            localStorage.setItem('access_token', response.data.access_token);
            localStorage.setItem('refresh_token', response.data.refresh_token);

            // Fetch User Details
            const userRes = await api.get('/api/accounts/me/');
            localStorage.setItem('is_superuser', userRes.data.is_superuser);
            localStorage.setItem('user_role', userRes.data.role);

            navigate('/dashboard');
        } catch (err) {
            console.error(err);
            setError('Invalid username or password.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#333' }}>Welcome Back</h2>
                {error && <div style={{ backgroundColor: '#f8d7da', color: '#721c24', padding: '10px', borderRadius: '4px', marginBottom: '15px' }}>{error}</div>}
                <form onSubmit={handleLogin}>
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Username</label>
                        <input
                            type="text"
                            className="input-field"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter your username"
                            required
                        />
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Password</label>
                        <input
                            type="password"
                            className="input-field"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="btn-primary"
                        style={{ width: '100%', padding: '12px' }}
                        disabled={loading}
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
