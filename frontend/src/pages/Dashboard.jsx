import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';

const Dashboard = () => {
    // In a real app, fetch stats from API
    const mockStats = [
        { title: 'Total Patients', value: '1,234', color: '#0056b3' },
        { title: 'Appointments Today', value: '42', color: '#28a745' },
        { title: 'Pending Labs', value: '15', color: '#ffc107' },
        { title: 'Revenue (Today)', value: '₦ 450,000', color: '#17a2b8' },
    ];

    return (
        <div className="layout-container">
            <Sidebar />
            <div className="main-content">
                <h1>Dashboard</h1>
                <p style={{ fontSize: '1.2rem', color: '#666', marginBottom: '30px' }}>Welcome back, Dr. Dolapo.</p>

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
                        <a href="/clinical" style={{ textDecoration: 'none' }}>
                            <button className="btn-primary">New Clinical Note</button>
                        </a>
                        <a href="/pharmacy" style={{ textDecoration: 'none' }}>
                            <button className="btn-primary" style={{ backgroundColor: '#6f42c1' }}>Prescribe Medication</button>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
