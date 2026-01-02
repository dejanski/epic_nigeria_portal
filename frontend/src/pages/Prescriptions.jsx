import React, { useState } from 'react';
import api from '../api';
import Sidebar from '../components/Sidebar';

const Pharmacy = () => {
    const [formData, setFormData] = useState({
        patient: '',
        medication_name: '',
        dosage: '',
        frequency: '',
        duration: ''
    });
    const [message, setMessage] = useState('');

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/api/medications/prescriptions/', formData);
            setMessage('Prescription sent successfully.');
            setFormData({ ...formData, medication_name: '', dosage: '', frequency: '', duration: '' });
        } catch (error) {
            console.error(error);
            setMessage('Failed to send prescription.');
        }
    };

    return (
        <div className="layout-container">
            <Sidebar />
            <div className="main-content">
                <div className="card" style={{ maxWidth: '800px' }}>
                    <h2>New Prescription</h2>
                    {message && <div style={{ color: message.includes('success') ? 'green' : 'red', marginBottom: '10px' }}>{message}</div>}
                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '5px' }}>Patient ID</label>
                            <input type="number" name="patient" className="input-field" value={formData.patient} onChange={handleChange} required />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '15px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '5px' }}>Medication Name</label>
                                <input type="text" name="medication_name" className="input-field" value={formData.medication_name} onChange={handleChange} required placeholder="e.g. Paracetamol" />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '5px' }}>Dosage</label>
                                <input type="text" name="dosage" className="input-field" value={formData.dosage} onChange={handleChange} required placeholder="e.g. 500mg" />
                            </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '5px' }}>Frequency</label>
                                <input type="text" name="frequency" className="input-field" value={formData.frequency} onChange={handleChange} required placeholder="e.g. TDS (3x daily)" />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '5px' }}>Duration</label>
                                <input type="text" name="duration" className="input-field" value={formData.duration} onChange={handleChange} required placeholder="e.g. 5 days" />
                            </div>
                        </div>

                        <button type="submit" className="btn-success">Send Prescription</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Pharmacy;
