import React, { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

const HospitalOnboarding = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        contact_info: '',
        license_number: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            await api.post('/api/hospitals/create/', formData);
            setSuccess('Hospital created successfully!');
            setTimeout(() => navigate('/dashboard'), 2000);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to create hospital. Please check your inputs.');
            console.error(err);
        }
    };

    return (
        <div className="container" style={{ maxWidth: '600px', margin: '2rem auto', padding: '2rem', backgroundColor: 'var(--card-bg)', borderRadius: '12px', boxShadow: 'var(--shadow-md)' }}>
            <h2 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)', textAlign: 'center' }}>🏥 Onboard New Hospital</h2>

            {error && <div style={{ padding: '10px', backgroundColor: '#fee2e2', color: '#dc2626', borderRadius: '6px', marginBottom: '1rem' }}>{error}</div>}
            {success && <div style={{ padding: '10px', backgroundColor: '#dcfce7', color: '#16a34a', borderRadius: '6px', marginBottom: '1rem' }}>{success}</div>}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="form-group">
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Hospital Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="form-control"
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--input-bg)', color: 'var(--text-primary)' }}
                        placeholder="e.g. LAGOS GENERAL HOSPITAL"
                    />
                </div>

                <div className="form-group">
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Address</label>
                    <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                        className="form-control"
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--input-bg)', color: 'var(--text-primary)', minHeight: '80px' }}
                        placeholder="Full Address"
                    />
                </div>

                <div className="form-group">
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Contact Info</label>
                    <input
                        type="text"
                        name="contact_info"
                        value={formData.contact_info}
                        onChange={handleChange}
                        required
                        className="form-control"
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--input-bg)', color: 'var(--text-primary)' }}
                        placeholder="Phone or Email"
                    />
                </div>

                <div className="form-group">
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>License Number (Optional)</label>
                    <input
                        type="text"
                        name="license_number"
                        value={formData.license_number}
                        onChange={handleChange}
                        className="form-control"
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--input-bg)', color: 'var(--text-primary)' }}
                        placeholder="Registration License"
                    />
                </div>

                <button
                    type="submit"
                    className="btn-primary"
                    style={{ marginTop: '1rem', padding: '0.75rem', backgroundColor: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '1rem' }}
                >
                    Create Hospital Account
                </button>
            </form>
        </div>
    );
};

export default HospitalOnboarding;
