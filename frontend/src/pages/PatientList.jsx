import React, { useEffect, useState } from 'react';
import api from '../api';
import Sidebar from '../components/Sidebar';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import './PatientList.css'; // Assuming you might move CSS to a file later, but for now inline is fine

const PatientList = () => {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState(''); // Changed from searchTerm to search
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
        fetchPatients(search); // Use 'search' state
    };

    // Filter patients based on the search term for display
    const filteredPatients = patients.filter(patient =>
        patient.name.toLowerCase().includes(search.toLowerCase()) ||
        String(patient.id).includes(search)
    );

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
                                value={search} // Use 'search' state
                                onChange={(e) => setSearch(e.target.value)} // Update 'search' state
                                style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ced4da', marginRight: '5px' }}
                            />
                            <button type="submit" className="btn-primary" style={{ padding: '8px 15px' }}>Search</button>
                        </form>
                        <button className="btn-success" onClick={() => navigate('/register-patient')}>
                            + Onboard New Patient
                        </button>
                    </div>
                </div>

                <div className="patient-grid">
                    {loading ? (
                        <LoadingSpinner />
                    ) : filteredPatients.length > 0 ? (
                        filteredPatients.map(patient => (
                            <div key={patient.id} className="patient-card" onClick={() => navigate(`/patients/${patient.id}`)}>
                                <h3>{patient.name}</h3>
                                <p><strong>ID:</strong> {patient.id}</p>
                                <p><strong>DOB:</strong> {patient.date_of_birth}</p> {/* Changed from patient.dob to patient.date_of_birth */}
                                <p><strong>Gender:</strong> {patient.gender}</p> {/* Added gender */}
                                <p><strong>Insurance:</strong> {patient.insurance_provider}</p> {/* Added insurance */}
                            </div>
                        ))
                    ) : (
                        <EmptyState message="No patients found matching your search." />
                    )}
                </div>
            </div>
        </div>
    );
};

export default PatientList;
