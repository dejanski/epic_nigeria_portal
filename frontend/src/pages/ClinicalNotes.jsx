import React, { useState, useEffect } from 'react';
import api from '../api';
import Sidebar from '../components/Sidebar';

const ClinicalNotes = () => {
    // In a real app, we would search via API. For MVP, we might list recent patients.
    // Assuming simple text input for patient ID for now to save lookups
    const [patientId, setPatientId] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [searchedPatients, setSearchedPatients] = useState([]);
    const [visitDate, setVisitDate] = useState(new Date().toISOString().split('T')[0]);
    const [diagnosis, setDiagnosis] = useState('');
    const [notes, setNotes] = useState('');
    const [message, setMessage] = useState('');

    const handleSearchPatient = async (e) => {
        setSearchTerm(e.target.value);
        if (e.target.value.length > 2) {
            try {
                const res = await api.get(`/api/patients/list/?search=${e.target.value}`);
                setSearchedPatients(res.data.results || res.data); // Handle pagination or raw list
            } catch (err) {
                console.error(err);
            }
        } else {
            setSearchedPatients([]);
        }
    };

    const selectPatient = (p) => {
        setPatientId(p.id);
        setSearchTerm(`${p.name} (ID: ${p.id})`);
        setSearchedPatients([]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        if (!patientId) {
            setMessage('Please select a patient from the search dropdown.');
            return;
        }

        try {
            await api.post('/api/clinical/document/', {
                patient: patientId,
                visit_date: visitDate,
                diagnosis,
                notes
            });
            setMessage('Clinical note saved successfully.');
            setNotes('');
            setDiagnosis('');
            setSearchTerm('');
            setPatientId('');
        } catch (error) {
            console.error(error);
            if (error.response && error.response.data) {
                // Formatting API errors for display
                const errorData = error.response.data;
                const errorMsg = Object.keys(errorData).map(key => `${key}: ${errorData[key]}`).join(', ');
                setMessage(`Failed to save: ${errorMsg}`);
            } else {
                setMessage('Failed to save note. Check Patient ID.');
            }
        }
    };

    return (
        <div className="layout-container">
            <Sidebar />
            <div className="main-content">
                <div className="card" style={{ maxWidth: '800px' }}>
                    <h2>Clinical Documentation</h2>
                    {message && <div style={{ color: message.includes('success') ? 'green' : 'red', marginBottom: '10px' }}>{message}</div>}
                    <form onSubmit={handleSubmit}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '15px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '5px' }}>Patient</label>
                                <input
                                    type="text"
                                    className="input-field"
                                    value={searchTerm}
                                    onChange={handleSearchPatient}
                                    placeholder="Search by name or ID..."
                                    required
                                />
                                {searchedPatients.length > 0 && (
                                    <ul style={{ border: '1px solid #ccc', maxHeight: '150px', overflowY: 'auto', padding: 0, margin: 0, listStyle: 'none', position: 'absolute', backgroundColor: 'white', width: '300px', zIndex: 1000 }}>
                                        {searchedPatients.map(p => (
                                            <li
                                                key={p.id}
                                                onClick={() => selectPatient(p)}
                                                style={{ padding: '8px', cursor: 'pointer', borderBottom: '1px solid #eee' }}
                                            >
                                                {p.name} (ID: {p.id})
                                            </li>
                                        ))}
                                    </ul>
                                )}
                                <input type="hidden" value={patientId} required />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '5px' }}>Visit Date</label>
                                <input type="date" className="input-field" value={visitDate} onChange={e => setVisitDate(e.target.value)} required />
                            </div>
                        </div>

                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '5px' }}>Diagnosis</label>
                            <input type="text" className="input-field" value={diagnosis} onChange={e => setDiagnosis(e.target.value)} required placeholder="e.g. Malaria, Hypertension" />
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '5px' }}>Clinical Notes</label>
                            <textarea
                                className="input-field"
                                rows="6"
                                value={notes}
                                onChange={e => setNotes(e.target.value)}
                                required
                                placeholder="Patient presents with..."
                            ></textarea>
                        </div>

                        <button type="submit" className="btn-primary">Save Note</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ClinicalNotes;
