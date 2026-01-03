import React, { useEffect, useState } from 'react';
import api from '../api';
import Sidebar from '../components/Sidebar';

const StaffManagement = () => {
    const [staff, setStaff] = useState([]);
    const [isCreating, setIsCreating] = useState(false);
    const [nextPage, setNextPage] = useState(null);
    const [prevPage, setPrevPage] = useState(null);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: 'clinician',
        first_name: '',
        last_name: ''
    });

    const fetchStaff = async (url = '') => {
        try {
            const endpoint = url || '/api/accounts/staff/list/';
            const res = await api.get(endpoint);
            // Handle paginated response
            if (res.data.results) {
                setStaff(res.data.results);
                setNextPage(res.data.next);
                setPrevPage(res.data.previous);
            } else {
                setStaff(res.data);
            }
        } catch (err) {
            console.error('Failed to fetch staff:', err);
        }
    };

    useEffect(() => {
        fetchStaff();
    }, []);


    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/api/accounts/staff/create/', formData);
            alert('Staff member created successfully!');
            setIsCreating(false);
            setFormData({
                username: '',
                email: '',
                password: '',
                role: 'clinician',
                first_name: '',
                last_name: ''
            });
            fetchStaff();
        } catch (err) {
            console.error(err);
            alert('Failed to create staff. Username might be taken.');
        }
    };

    return (
        <div className="layout-container">
            <Sidebar />
            <div className="main-content">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h2>Staff Management</h2>
                    <button className="btn-primary" onClick={() => setIsCreating(!isCreating)}>
                        {isCreating ? 'Cancel' : 'Add New Staff'}
                    </button>
                </div>

                {isCreating && (
                    <div className="card" style={{ marginBottom: '20px', backgroundColor: '#f8f9fa' }}>
                        <h3>Register New Staff</h3>
                        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                            <div>
                                <label>Username:</label>
                                <input className="form-control" name="username" value={formData.username} onChange={handleChange} required />
                            </div>
                            <div>
                                <label>Password:</label>
                                <input className="form-control" type="password" name="password" value={formData.password} onChange={handleChange} required />
                            </div>
                            <div>
                                <label>Role:</label>
                                <select className="form-control" name="role" value={formData.role} onChange={handleChange}>
                                    <option value="clinician">Clinician</option>
                                    <option value="nurse">Nurse</option>
                                    <option value="admin">Admin</option>
                                    <option value="lab_tech">Lab Technician</option>
                                    <option value="billing_staff">Billing Staff</option>
                                </select>
                            </div>
                            <div>
                                <label>Email:</label>
                                <input className="form-control" type="email" name="email" value={formData.email} onChange={handleChange} required />
                            </div>
                            <div>
                                <label>First Name:</label>
                                <input className="form-control" name="first_name" value={formData.first_name} onChange={handleChange} required />
                            </div>
                            <div>
                                <label>Last Name:</label>
                                <input className="form-control" name="last_name" value={formData.last_name} onChange={handleChange} required />
                            </div>
                            <div style={{ gridColumn: 'span 2', marginTop: '10px' }}>
                                <button type="submit" className="btn-success">Create User</button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="card">
                    {staff.length === 0 ? <p>No staff found.</p> : (
                        <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '2px solid #dee2e6' }}>
                                    <th style={{ padding: '10px' }}>Name</th>
                                    <th style={{ padding: '10px' }}>Role</th>
                                    <th style={{ padding: '10px' }}>Username</th>
                                    <th style={{ padding: '10px' }}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {staff.map(s => (
                                    <tr key={s.id} style={{ borderBottom: '1px solid #eee' }}>
                                        <td style={{ padding: '10px' }}>{s.first_name} {s.last_name}</td>
                                        <td style={{ padding: '10px', textTransform: 'capitalize' }}>
                                            <span style={{
                                                padding: '3px 8px',
                                                borderRadius: '12px',
                                                backgroundColor: s.role === 'admin' ? '#e2e3e5' : '#d1e7dd',
                                                color: s.role === 'admin' ? '#383d41' : '#0f5132',
                                                fontSize: '0.85em'
                                            }}>
                                                {s.role}
                                            </span>
                                        </td>
                                        <td style={{ padding: '10px' }}>{s.username}</td>
                                        <td style={{ padding: '10px' }}>{s.is_active ? 'Active' : 'Inactive'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '20px', paddingBottom: '20px' }}>
                    <button
                        className="btn-primary"
                        disabled={!prevPage}
                        onClick={() => fetchStaff(prevPage)}
                        style={{ opacity: !prevPage ? 0.5 : 1 }}
                    >
                        &larr; Previous
                    </button>
                    <button
                        className="btn-primary"
                        disabled={!nextPage}
                        onClick={() => fetchStaff(nextPage)}
                        style={{ opacity: !nextPage ? 0.5 : 1 }}
                    >
                        Next &rarr;
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StaffManagement;
