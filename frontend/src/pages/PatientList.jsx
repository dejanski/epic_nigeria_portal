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
    const [search, setSearch] = useState('');
    const [nextPage, setNextPage] = useState(null);
    const [prevPage, setPrevPage] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchPatients();
    }, []);

    const fetchPatients = async (urlOrQuery = '') => {
        setLoading(true);
        try {
            let endpoint = '/api/patients/list/';
            if (urlOrQuery.startsWith('http')) {
                // It's a full URL (next/prev) - strip domain to avoid CORS/proxy issues if needed, 
                // or just use api.get with the full URL if axios handles it.
                // Since api.js has baseURL, we need to be careful. 
                // Easier to treat it as relative or pass full url if axios supports it (it does).
                endpoint = urlOrQuery;
            } else if (urlOrQuery) {
                endpoint = `/api/patients/list/?search=${urlOrQuery}`;
            }

            // Note: If using full URL with axios instance having baseURL, it generally overrides it
            // but let's be safe and use parameters if possible, or just the path.
            // Django REST Framework returns full absolute URLs. 
            // We can strip the origin or just pass it. 

            const response = await api.get(endpoint);
            // Handle paginated response ({count, next, previous, results})
            if (response.data.results) {
                setPatients(response.data.results);
                setNextPage(response.data.next);
                setPrevPage(response.data.previous);
            } else {
                setPatients(response.data); // Fallback
            }
        } catch (error) {
            console.error('Failed to fetch patients', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchPatients(search);
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
                                <p><strong>DOB:</strong> {patient.date_of_birth}</p>
                                <p><strong>Gender:</strong> {patient.gender}</p>
                                <p><strong>Insurance:</strong> {patient.insurance_provider}</p>
                            </div>
                        ))
                    ) : (
                        <EmptyState message="No patients found matching your search." />
                    )}
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '20px', paddingBottom: '20px' }}>
                    <button
                        className="btn-primary"
                        disabled={!prevPage}
                        onClick={() => fetchPatients(prevPage)}
                        style={{ opacity: !prevPage ? 0.5 : 1 }}
                    >
                        &larr; Previous
                    </button>
                    <button
                        className="btn-primary"
                        disabled={!nextPage}
                        onClick={() => fetchPatients(nextPage)}
                        style={{ opacity: !nextPage ? 0.5 : 1 }}
                    >
                        Next &rarr;
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PatientList;
