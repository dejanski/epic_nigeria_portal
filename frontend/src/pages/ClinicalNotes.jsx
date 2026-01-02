import React, { useState, useEffect } from 'react';
import api from '../api';
import Sidebar from '../components/Sidebar';

const ClinicalNotes = () => {
    // In a real app, we would search via API. For MVP, we might list recent patients.
    // Assuming simple text input for patient ID for now to save lookups
    const [patientId, setPatientId] = useState('');
    const [visitDate, setVisitDate] = useState(new Date().toISOString().split('T')[0]);
    const [diagnosis, setDiagnosis] = useState('');
    const [notes, setNotes] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        try {
            await api.post('/api/clinical/', {
                patient: patientId,
                visit_date: visitDate,
                diagnosis,
                notes
            });
            setMessage('Clinical note saved successfully.');
            setNotes('');
            setDiagnosis('');
        } catch (error) {
            console.error(error);
            setMessage('Failed to save note. Check Patient ID.');
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
                                <label style={{ display: 'block', marginBottom: '5px' }}>Patient ID</label>
                                <input type="number" className="input-field" value={patientId} onChange={e => setPatientId(e.target.value)} required placeholder="ID" />
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
