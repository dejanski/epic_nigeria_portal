import React, { useState, useEffect } from 'react';
import api from '../api';
import Sidebar from '../components/Sidebar';

const Appointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [formData, setFormData] = useState({
        patient: '',
        clinic_id: 'MAIN-CLINIC',
        appointment_datetime: '',
        reason: '',
        status: 'scheduled',
        clinician: 1 // Default to 1 (admin/current user) for MVP, should be dynamic
    });
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            const res = await api.get('/api/appointments/list/');
            setAppointments(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Need to ensure clinician ID is set correctly. For now hardcode or use logged in user ID if available
            // Note: In real app, we decode token to get user ID.
            await api.post('/api/appointments/create/', formData);
            setMessage('Appointment booked successfully!');
            fetchAppointments();
        } catch (err) {
            console.error(err);
            setMessage('Booking failed. Ensure Patient ID exists.');
        }
    };

    return (
        <div className="layout-container">
            <Sidebar />
            <div className="main-content">
                <h1>Appointments</h1>

                <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                    <div className="card" style={{ flex: 1, minWidth: '300px' }}>
                        <h3>Book New Appointment</h3>
                        {message && <p style={{ color: 'green' }}>{message}</p>}
                        <form onSubmit={handleSubmit}>
                            <div style={{ marginBottom: '10px' }}>
                                <label style={{ display: 'block', marginBottom: '5px' }}>Patient ID</label>
                                <input type="number" className="input-field" value={formData.patient} onChange={e => setFormData({ ...formData, patient: e.target.value })} required />
                            </div>
                            <div style={{ marginBottom: '10px' }}>
                                <label style={{ display: 'block', marginBottom: '5px' }}>Date & Time</label>
                                <input type="datetime-local" className="input-field" value={formData.appointment_datetime} onChange={e => setFormData({ ...formData, appointment_datetime: e.target.value })} required />
                            </div>
                            <div style={{ marginBottom: '10px' }}>
                                <label style={{ display: 'block', marginBottom: '5px' }}>Reason</label>
                                <input type="text" className="input-field" value={formData.reason} onChange={e => setFormData({ ...formData, reason: e.target.value })} required />
                            </div>
                            <button className="btn-primary" type="submit">Book</button>
                        </form>
                    </div>

                    <div className="card" style={{ flex: 1.5, minWidth: '400px' }}>
                        <h3>Upcoming Schedule</h3>
                        {appointments.length === 0 ? <p>No appointments found.</p> : (
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                {appointments.map(apt => (
                                    <li key={apt.id} style={{ padding: '10px', borderBottom: '1px solid #eee' }}>
                                        <strong>{apt.appointment_datetime.replace('T', ' ')}</strong> - {apt.reason} <br />
                                        <span style={{ fontSize: '0.9em', color: '#666' }}>Patient ID: {apt.patient} | Status: {apt.status}</span>
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
