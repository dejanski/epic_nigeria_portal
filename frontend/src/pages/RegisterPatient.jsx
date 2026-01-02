import React, { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

const RegisterPatient = () => {
    const [formData, setFormData] = useState({
        name: '',
        date_of_birth: '',
        gender: '',
        contact_info: '',
        insurance_provider: '',
        nhia_id: ''
    });
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        try {
            await api.post('/api/patients/register/', formData);
            setMessage('Patient registered successfully!');
            setTimeout(() => navigate('/dashboard'), 2000);
        } catch (error) {
            console.error(error);
            setMessage('Registration failed. Please check the inputs.');
        }
    };

    return (
        <div style={{ maxWidth: '500px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h2>Onboard New Client</h2>
            {message && <p style={{ color: message.includes('success') ? 'green' : 'red' }}>{message}</p>}
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '10px' }}>
                    <label>Full Name:</label>
                    <input name="name" type="text" onChange={handleChange} required style={{ width: '100%', padding: '8px' }} />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label>Date of Birth:</label>
                    <input name="date_of_birth" type="date" onChange={handleChange} required style={{ width: '100%', padding: '8px' }} />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label>Gender:</label>
                    <select name="gender" onChange={handleChange} required style={{ width: '100%', padding: '8px' }}>
                        <option value="">Select Gender</option>
                        <option value="M">Male</option>
                        <option value="F">Female</option>
                        <option value="O">Other</option>
                    </select>
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label>Contact Info:</label>
                    <input name="contact_info" type="text" onChange={handleChange} required style={{ width: '100%', padding: '8px' }} />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label>Insurance Provider:</label>
                    <input name="insurance_provider" type="text" onChange={handleChange} required style={{ width: '100%', padding: '8px' }} />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label>NHIA ID (Optional):</label>
                    <input name="nhia_id" type="text" onChange={handleChange} style={{ width: '100%', padding: '8px' }} />
                </div>
                <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none' }}>Register Patient</button>
            </form>
            <button onClick={() => navigate('/dashboard')} style={{ marginTop: '10px', padding: '10px', backgroundColor: '#6c757d', color: 'white', border: 'none', width: '100%' }}>Cancel</button>
        </div>
    );
};

export default RegisterPatient;
