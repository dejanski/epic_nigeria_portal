import React, { useState, useEffect } from 'react';
import api from '../api';
import Sidebar from '../components/Sidebar';

const Settings = () => {
    const [activeTab, setActiveTab] = useState('profile');
    const [profileData, setProfileData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        username: ''
    });
    const [passwordData, setPasswordData] = useState({
        old_password: '',
        new_password: '',
        confirm_password: ''
    });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await api.get('/api/accounts/me/');
            setProfileData({
                first_name: res.data.first_name || '',
                last_name: res.data.last_name || '',
                email: res.data.email || '',
                username: res.data.username || ''
            });
        } catch (err) {
            console.error(err);
        }
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setMessage('');
        try {
            await api.patch('/api/accounts/me/', profileData);
            setMessage('Profile updated successfully!');
        } catch (err) {
            console.error(err);
            setError('Failed to update profile.');
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        if (passwordData.new_password !== passwordData.confirm_password) {
            setError('New passwords do not match.');
            return;
        }
        try {
            await api.post('/api/accounts/change-password/', {
                old_password: passwordData.old_password,
                new_password: passwordData.new_password
            });
            setMessage('Password changed successfully!');
            setPasswordData({ old_password: '', new_password: '', confirm_password: '' });
        } catch (err) {
            console.error(err);
            if (err.response && err.response.data && err.response.data.error) {
                setError(err.response.data.error);
            } else {
                setError('Failed to change password. Check old password.');
            }
        }
    };

    return (
        <div className="layout-container">
            <Sidebar />
            <div className="main-content">
                <h1>Account Settings</h1>

                <div style={{ marginBottom: '20px' }}>
                    <button
                        className={`btn-primary ${activeTab !== 'profile' ? 'btn-secondary' : ''}`}
                        style={{ marginRight: '10px', backgroundColor: activeTab === 'profile' ? '' : '#ccc' }}
                        onClick={() => setActiveTab('profile')}
                    >
                        Profile
                    </button>
                    <button
                        className={`btn-primary ${activeTab !== 'security' ? 'btn-secondary' : ''}`}
                        style={{ backgroundColor: activeTab === 'security' ? '' : '#ccc' }}
                        onClick={() => setActiveTab('security')}
                    >
                        Security
                    </button>
                </div>

                {message && <p style={{ color: 'green', padding: '10px', backgroundColor: '#d4edda', borderRadius: '5px' }}>{message}</p>}
                {error && <p style={{ color: 'red', padding: '10px', backgroundColor: '#f8d7da', borderRadius: '5px' }}>{error}</p>}

                {activeTab === 'profile' && (
                    <div className="card" style={{ maxWidth: '500px' }}>
                        <h3>Edit Profile</h3>
                        <form onSubmit={handleProfileUpdate}>
                            <div style={{ marginBottom: '10px' }}>
                                <label>Username (Ready Only)</label>
                                <input className="input-field" value={profileData.username} disabled style={{ backgroundColor: '#eee' }} />
                            </div>
                            <div style={{ marginBottom: '10px' }}>
                                <label>First Name</label>
                                <input className="input-field" value={profileData.first_name} onChange={e => setProfileData({ ...profileData, first_name: e.target.value })} />
                            </div>
                            <div style={{ marginBottom: '10px' }}>
                                <label>Last Name</label>
                                <input className="input-field" value={profileData.last_name} onChange={e => setProfileData({ ...profileData, last_name: e.target.value })} />
                            </div>
                            <div style={{ marginBottom: '10px' }}>
                                <label>Email</label>
                                <input className="input-field" type="email" value={profileData.email} onChange={e => setProfileData({ ...profileData, email: e.target.value })} />
                            </div>
                            <button type="submit" className="btn-primary">Update Profile</button>
                        </form>
                    </div>
                )}

                {activeTab === 'security' && (
                    <div className="card" style={{ maxWidth: '500px' }}>
                        <h3>Change Password</h3>
                        <form onSubmit={handlePasswordChange}>
                            <div style={{ marginBottom: '10px' }}>
                                <label>Old Password</label>
                                <input className="input-field" type="password" value={passwordData.old_password} onChange={e => setPasswordData({ ...passwordData, old_password: e.target.value })} required />
                            </div>
                            <div style={{ marginBottom: '10px' }}>
                                <label>New Password</label>
                                <input className="input-field" type="password" value={passwordData.new_password} onChange={e => setPasswordData({ ...passwordData, new_password: e.target.value })} required />
                            </div>
                            <div style={{ marginBottom: '10px' }}>
                                <label>Confirm New Password</label>
                                <input className="input-field" type="password" value={passwordData.confirm_password} onChange={e => setPasswordData({ ...passwordData, confirm_password: e.target.value })} required />
                            </div>
                            <button type="submit" className="btn-primary">Change Password</button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Settings;
