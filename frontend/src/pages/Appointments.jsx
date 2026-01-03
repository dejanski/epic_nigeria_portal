import React, { useState, useEffect } from 'react';
import api from '../api';
import Sidebar from '../components/Sidebar';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';

const Appointments = () => {
    const [patientId, setPatientId] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [searchedPatients, setSearchedPatients] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [formData, setFormData] = useState({
        clinic_id: 'MAIN-CLINIC',
        appointment_datetime: '',
        reason: '',
        status: 'scheduled',
        status: 'scheduled',
        clinician: 2 // Defaulting to 2 (dr_adebayo) as 1 (dola) is not a clinician
    });
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        setLoading(true);
        try {
            const res = await api.get('/api/appointments/list/');
            setAppointments(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearchPatient = async (e) => {
        setSearchTerm(e.target.value);
        if (e.target.value.length > 2) {
            try {
                const res = await api.get(`/api/patients/list/?search=${e.target.value}`);
                setSearchedPatients(res.data.results || res.data);
            } catch (err) { console.error(err); }
        } else {
            setSearchedPatients([]);
        }
    };

    const selectPatient = (p) => {
        setPatientId(p.id);
        setSearchTerm(`${p.name} (ID: ${p.id})`);
        setSearchedPatients([]);
    };

    const handleEdit = (apt) => {
        setIsEditing(true);
        setEditId(apt.id);
        setFormData({
            clinic_id: apt.clinic_id,
            appointment_datetime: apt.appointment_datetime.replace('Z', ''), // Simple format fix
            reason: apt.reason,
            status: apt.status,
            clinician: apt.clinician
        });
        setPatientId(apt.patient);
        setSearchTerm(`Patient ID: ${apt.patient}`); // Ideally retrieve name
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditId(null);
        setFormData({
            clinic_id: 'MAIN-CLINIC',
            appointment_datetime: '',
            reason: '',
            status: 'scheduled',
            clinician: 2
        });
        setPatientId('');
        setSearchTerm('');
        setMessage('');
    };

    const handleCancelAppointment = async (id) => {
        if (window.confirm('Are you sure you want to cancel this appointment?')) {
            try {
                await api.put(`/api/appointments/${id}/update/`, { status: 'cancelled' });
                alert('Appointment Cancelled');
                fetchAppointments();
            } catch (err) {
                console.error(err);
                alert('Failed to cancel');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Need to ensure clinician ID is set correctly. For now hardcode or use logged in user ID if available
            // Note: In real app, we decode token to get user ID.
            if (!patientId) {
                setMessage('Please select a patient.');
                return;
            }

            if (isEditing) {
                await api.put(`/api/appointments/${editId}/update/`, { ...formData, patient: patientId });
                setMessage('Appointment updated successfully!');
                handleCancelEdit(); // Reset form
            } else {
                await api.post('/api/appointments/create/', { ...formData, patient: patientId });
                setMessage('Appointment booked successfully!');
                // Reset form but keep clinician/clinic defaults
                setFormData({ ...formData, appointment_datetime: '', reason: '', status: 'scheduled' });
                setSearchTerm('');
                setPatientId('');
            }

            fetchAppointments();
        } catch (err) {
            console.error(err);
            if (err.response && err.response.data) {
                const errorData = err.response.data;
                const errorMsg = Object.keys(errorData).map(key => `${key}: ${errorData[key]}`).join(', ');
                setMessage(`Booking failed: ${errorMsg}`);
            } else {
                setMessage('Booking failed. Ensure Patient ID exists.');
            }
        }
    };

    return (
        <div className="layout-container">
            <Sidebar />
            <div className="main-content">
                <h1>Appointments</h1>

                <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                    <div className="card" style={{ flex: 1, minWidth: '300px' }}>
                        <h3>{isEditing ? 'Edit Appointment' : 'Book New Appointment'}</h3>
                        {message && <p style={{ color: 'green' }}>{message}</p>}
                        <form onSubmit={handleSubmit}>
                            <div style={{ marginBottom: '10px' }}>
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
                            </div>
                            <div style={{ marginBottom: '10px' }}>
                                <label style={{ display: 'block', marginBottom: '5px' }}>Date & Time</label>
                                <input type="datetime-local" className="input-field" value={formData.appointment_datetime} onChange={e => setFormData({ ...formData, appointment_datetime: e.target.value })} required />
                            </div>
                            <div style={{ marginBottom: '10px' }}>
                                <label style={{ display: 'block', marginBottom: '5px' }}>Reason</label>
                                <input type="text" className="input-field" value={formData.reason} onChange={e => setFormData({ ...formData, reason: e.target.value })} required />
                            </div>
                            <div style={{ marginBottom: '10px' }}>
                                <label style={{ display: 'block', marginBottom: '5px' }}>Clinician ID</label>
                                <input type="number" className="input-field" value={formData.clinician} onChange={e => setFormData({ ...formData, clinician: e.target.value })} required />
                            </div>
                            <button className="btn-primary" type="submit">{isEditing ? 'Update' : 'Book'}</button>
                            {isEditing && <button type="button" className="btn-danger" onClick={handleCancelEdit} style={{ marginLeft: '10px' }}>Cancel</button>}
                        </form>
                    </div>

                    <div className="card" style={{ flex: 1.5, minWidth: '400px' }}>
                        <h3>Upcoming Schedule</h3>
                        {loading ? (
                            <LoadingSpinner />
                        ) : appointments.length === 0 ? (
                            <EmptyState message="No scheduled appointments." />
                        ) : (
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                {appointments.map(apt => (
                                    <li key={apt.id} style={{ padding: '10px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <strong>{new Date(apt.appointment_datetime).toLocaleString()}</strong> - {apt.reason} <br />
                                            <span style={{ fontSize: '0.9em', color: '#666' }}>Patient ID: {apt.patient} | Status: {apt.status}</span>
                                        </div>
                                        <div>
                                            <button className="btn-primary" style={{ padding: '5px 10px', fontSize: '0.8rem' }} onClick={() => handleEdit(apt)}>Edit</button>
                                            <button className="btn-danger" style={{ padding: '5px 10px', fontSize: '0.8rem', marginLeft: '5px' }} onClick={() => handleCancelAppointment(apt.id)}>Cancel</button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Appointments;
