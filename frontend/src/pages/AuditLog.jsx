import React, { useEffect, useState } from 'react';
import api from '../api';
import Sidebar from '../components/Sidebar';

const AuditLog = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const response = await api.get('/api/audit/logs/');
                setLogs(response.data);
            } catch (error) {
                console.error('Failed to fetch logs', error);
            } finally {
                setLoading(false);
            }
        };
        fetchLogs();
    }, []);

    return (
        <div className="layout-container">
            <Sidebar />
            <div className="main-content">
                <h1>System Audit Logs</h1>
                <p>Protected View: Admin Only</p>
                <div className="card">
                    {loading ? <p>Loading...</p> : (
                        <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                            <thead>
                                <tr style={{ borderBottom: '2px solid #eee' }}>
                                    <th style={{ padding: '10px' }}>Time</th>
                                    <th style={{ padding: '10px' }}>User</th>
                                    <th style={{ padding: '10px' }}>Action</th>
                                    <th style={{ padding: '10px' }}>IP Address</th>
                                    <th style={{ padding: '10px' }}>Details</th>
                                </tr>
                            </thead>
                            <tbody>
                                {logs.map(log => (
                                    <tr key={log.id} style={{ borderBottom: '1px solid #f8f9fa' }}>
                                        <td style={{ padding: '10px' }}>{new Date(log.timestamp).toLocaleString()}</td>
                                        <td style={{ padding: '10px' }}>{log.username}</td>
                                        <td style={{ padding: '10px' }}>{log.action}</td>
                                        <td style={{ padding: '10px' }}>{log.ip_address}</td>
                                        <td style={{ padding: '10px' }}>{JSON.stringify(log.details)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AuditLog;
