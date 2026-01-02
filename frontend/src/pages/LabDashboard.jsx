import React, { useEffect, useState } from 'react';
import api from '../api';
import Sidebar from '../components/Sidebar';

const LabDashboard = () => {
    const [labs, setLabs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLabs();
    }, []);

    const fetchLabs = async () => {
        try {
            const response = await api.get('/api/labs/list/');
            setLabs(response.data);
        } catch (error) {
            console.error('Failed to fetch labs', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateResult = async (id) => {
        const result = prompt("Enter Test Result Value:");
        if (result) {
            try {
                await api.patch(`/api/labs/${id}/update/`, {
                    result_value: result,
                    status: 'completed',
                    completed_date: new Date().toISOString()
                });
                fetchLabs();
            } catch (error) {
                console.error('Update failed', error);
                alert('Failed to update result.');
            }
        }
    };

    return (
        <div className="layout-container">
            <Sidebar />
            <div className="main-content">
                <h1>Laboratory Dashboard</h1>
                <div className="card">
                    <h3>Pending Orders</h3>
                    {loading ? <p>Loading...</p> : (
                        <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '2px solid #eee' }}>
                                    <th style={{ padding: '10px' }}>Date</th>
                                    <th style={{ padding: '10px' }}>Patient</th>
                                    <th style={{ padding: '10px' }}>Test</th>
                                    <th style={{ padding: '10px' }}>Result</th>
                                    <th style={{ padding: '10px' }}>Status</th>
                                    <th style={{ padding: '10px' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {labs.map(lab => (
                                    <tr key={lab.id} style={{ borderBottom: '1px solid #f8f9fa' }}>
                                        <td style={{ padding: '10px' }}>{new Date(lab.ordered_date).toLocaleDateString()}</td>
                                        <td style={{ padding: '10px' }}>{lab.patient_name || lab.patient}</td>
                                        <td style={{ padding: '10px' }}>{lab.test_type}</td>
                                        <td style={{ padding: '10px' }}>{lab.result_value || '-'}</td>
                                        <td style={{ padding: '10px' }}>
                                            <span style={{
                                                padding: '4px 8px', borderRadius: '4px', fontSize: '0.8em',
                                                backgroundColor: lab.status === 'completed' ? '#d4edda' : '#fff3cd',
                                                color: lab.status === 'completed' ? '#155724' : '#856404'
                                            }}>
                                                {lab.status.toUpperCase()}
                                            </span>
                                        </td>
                                        <td style={{ padding: '10px' }}>
                                            {lab.status !== 'completed' && (
                                                <button
                                                    onClick={() => handleUpdateResult(lab.id)}
                                                    style={{ padding: '5px 10px', fontSize: '0.8rem', backgroundColor: '#007bff', color: 'white' }}
                                                >
                                                    Enter Result
                                                </button>
                                            )}
                                        </td>
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

export default LabDashboard;
