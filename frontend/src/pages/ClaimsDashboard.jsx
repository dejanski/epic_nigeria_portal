import React, { useEffect, useState } from 'react';
import api from '../api';
import Sidebar from '../components/Sidebar';

const ClaimsDashboard = () => {
    const [claims, setClaims] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchClaims();
    }, []);

    const fetchClaims = async () => {
        try {
            const response = await api.get('/api/billing/claims/list/');
            setClaims(response.data);
        } catch (error) {
            console.error('Failed to fetch claims', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (id, newStatus) => {
        try {
            await api.patch(`/api/billing/claims/${id}/update/`, { status: newStatus });
            fetchClaims();
        } catch (error) {
            console.error('Update failed', error);
            alert('Failed to update claim. Ensure you have permission.');
        }
    };

    return (
        <div className="layout-container">
            <Sidebar />
            <div className="main-content">
                <h1>Claims Dashboard</h1>
                <div className="card">
                    <h3>Submissions</h3>
                    {loading ? <p>Loading...</p> : (
                        <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '2px solid #eee' }}>
                                    <th style={{ padding: '10px' }}>Patient</th>
                                    <th style={{ padding: '10px' }}>Cost</th>
                                    <th style={{ padding: '10px' }}>Status</th>
                                    <th style={{ padding: '10px' }}>Submitted</th>
                                    <th style={{ padding: '10px' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {claims.map(claim => (
                                    <tr key={claim.id} style={{ borderBottom: '1px solid #f8f9fa' }}>
                                        <td style={{ padding: '10px' }}>{claim.patient_name || claim.patient}</td>
                                        <td style={{ padding: '10px' }}>₦ {parseFloat(claim.cost).toLocaleString()}</td>
                                        <td style={{ padding: '10px' }}>
                                            <span style={{
                                                padding: '4px 8px', borderRadius: '4px', fontSize: '0.8em',
                                                backgroundColor: claim.status === 'approved' ? '#d4edda' : claim.status === 'rejected' ? '#f8d7da' : '#fff3cd',
                                                color: claim.status === 'approved' ? '#155724' : claim.status === 'rejected' ? '#721c24' : '#856404'
                                            }}>
                                                {claim.status.toUpperCase()}
                                            </span>
                                        </td>
                                        <td style={{ padding: '10px' }}>{new Date(claim.submitted_at).toLocaleDateString()}</td>
                                        <td style={{ padding: '10px' }}>
                                            {claim.status === 'pending' && (
                                                <>
                                                    <button
                                                        onClick={() => handleUpdateStatus(claim.id, 'approved')}
                                                        style={{ padding: '5px 10px', fontSize: '0.8rem', backgroundColor: '#28a745', color: 'white', marginRight: '5px', border: 'none', borderRadius: '3px', cursor: 'pointer' }}
                                                    >
                                                        Approve
                                                    </button>
                                                    <button
                                                        onClick={() => handleUpdateStatus(claim.id, 'rejected')}
                                                        style={{ padding: '5px 10px', fontSize: '0.8rem', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}
                                                    >
                                                        Reject
                                                    </button>
                                                </>
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

export default ClaimsDashboard;
