import React, { useEffect, useState } from 'react';
import api from '../api';
import Sidebar from '../components/Sidebar';
import { useNavigate } from 'react-router-dom';

const PatientList = () => {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchPatients();
    }, []);

    const fetchPatients = async (query = '') => {
        setLoading(true);
        try {
            const endpoint = query ? `/api/patients/list/?search=${query}` : '/api/patients/list/';
            const response = await api.get(endpoint);
            // Handle paginated response ({count, results}) or list response
            const data = response.data.results ? response.data.results : response.data;
            setPatients(data);
        } catch (error) {
            console.error('Failed to fetch patients', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchPatients(searchTerm);
    };

    return (
        <div className="layout-container">
            <Sidebar />
            <div className="main-content">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h1>Patient Directory</h1>
                    <div>
                        <form onSubmit={handleSearch} style={{ display: 'inline-block', marginRight: '10px' }}>
                            <input
                                type="text"
                                placeholder="Search Name or ID..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ced4da', marginRight: '5px' }}
                            />
                            <button type="submit" className="btn-primary" style={{ padding: '8px 15px' }}>Search</button>
                        </form>
                        <button className="btn-success" onClick={() => navigate('/register-patient')}>
                            + Onboard New Patient
                        </button>
                    </div>
                </div>

                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
                                <tr>
                                    <th style={{ padding: '15px' }}>ID</th>
                                    <th style={{ padding: '15px' }}>Name</th>
                                    <th style={{ padding: '15px' }}>Date of Birth</th>
                                    <th style={{ padding: '15px' }}>Gender</th>
                                    <th style={{ padding: '15px' }}>Insurance</th>
                                    <th style={{ padding: '15px' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {patients.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" style={{ padding: '20px', textAlign: 'center' }}>No patients found.</td>
                                    </tr>
                                ) : (
                                    patients.map((patient) => (
                                        <tr key={patient.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                                            <td style={{ padding: '15px' }}>#{patient.id}</td>
                                            <td style={{ padding: '15px', fontWeight: 'bold' }}>{patient.name}</td>
                                            <td style={{ padding: '15px' }}>{patient.date_of_birth}</td>
                                            <td style={{ padding: '15px' }}>{patient.gender}</td>
                                            <td style={{ padding: '15px' }}>{patient.insurance_provider}</td>
                                            <td style={{ padding: '15px' }}>
                                                <button
                                                    style={{ padding: '5px 10px', fontSize: '0.8rem', backgroundColor: '#0056b3', color: 'white', cursor: 'pointer' }}
                                                    onClick={() => navigate(`/patients/${patient.id}`)}
                                                >
                                                    View
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PatientList;
