import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import api from '../api';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    // In a real app, fetch stats from API
    const navigate = useNavigate();
    const [user, setUser] = useState({ first_name: 'Doctor', last_name: '' });
    const [stats, setStats] = useState({
        patients: 0,
        appointments: 0,
        labs: 0
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Parallel fetch for speed
                const [statsRes, userRes] = await Promise.all([
                    api.get('/api/analytics/summary/'),
                    api.get('/api/accounts/me/')
                ]);

                setStats({
                    patients: statsRes.data.total_patients || 0,
                    appointments: statsRes.data.appointments_today || 0,
                    labs: statsRes.data.pending_labs || 0
                });

                if (userRes.data) {
                    setUser(userRes.data);
                }
            } catch (error) {
                console.error('Failed to fetch dashboard data', error);
            }
        };
        fetchData();
    }, []);

    const mockStats = [
        { title: 'Total Patients', value: stats.patients.toLocaleString(), color: '#0056b3' },
        { title: 'Appointments Today', value: stats.appointments, color: '#28a745' },
        { title: 'Pending Labs', value: stats.labs, color: '#ffc107' },
    ];

    return (
        <div className="layout-container">
            <Sidebar />
            <div className="main-content">
                <h1>Dashboard</h1>
                <p style={{ fontSize: '1.2rem', color: '#666', marginBottom: '30px' }}>
                    Welcome back, {user.first_name ? `${user.first_name} ${user.last_name}` : 'Dr. Dolapo'}.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>
                    {mockStats.map((stat, index) => (
                        <div key={index} className="card" style={{ padding: '20px', marginBottom: 0, borderLeft: `5px solid ${stat.color}` }}>
                            <h3 style={{ fontSize: '1rem', color: '#666', margin: 0 }}>{stat.title}</h3>
                            <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '10px 0 0 0', color: '#333' }}>{stat.value}</p>
                        </div>
                    ))}
                </div>

                <div className="card">
                    <h3>Quick Actions</h3>
                    <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                        <a href="/register-patient" style={{ textDecoration: 'none' }}>
                            <button className="btn-success">Onboard New Patient</button>
                        </a>
                        {(user.role === 'clinician' || localStorage.getItem('user_role') === 'clinician') && (
                            <>
                                <a href="/clinical" style={{ textDecoration: 'none' }}>
                                    <button className="btn-primary">New Clinical Note</button>
                                </a>
                                <a href="/pharmacy" style={{ textDecoration: 'none' }}>
                                    <button className="btn-primary" style={{ backgroundColor: '#6f42c1' }}>Prescribe Medication</button>
                                </a>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
