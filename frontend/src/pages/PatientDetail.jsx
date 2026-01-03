import React, { useEffect, useState } from 'react';
import api from '../api';
import Sidebar from '../components/Sidebar';
import { useParams, useNavigate } from 'react-router-dom';

const PatientDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [patient, setPatient] = useState(null);
    const [activeTab, setActiveTab] = useState('clinical'); // clinical, meds, appointments, labs, billing
    const [labs, setLabs] = useState([]);
    const [claims, setClaims] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({});

    useEffect(() => {
        const fetchPatient = async () => {
            try {
                const response = await api.get(`/api/patients/${id}/update/`);
                setPatient(response.data);
                setEditForm(response.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchPatient();
    }, [id]);

    const handleEditChange = (e) => {
        setEditForm({ ...editForm, [e.target.name]: e.target.value });
    };

    const handleUpdateProfile = async () => {
        try {
            const res = await api.patch(`/api/patients/${id}/update/`, editForm);
            setPatient(res.data);
            setIsEditing(false);
            alert('Profile Updated Successfully');
        } catch (error) {
            console.error(error);
            alert('Failed to update profile');
        }
    };

    const [notes, setNotes] = useState([]);
    const [meds, setMeds] = useState([]);
    const [appointments, setAppointments] = useState([]);

    useEffect(() => {
        if (activeTab === 'labs') {
            const fetchLabs = async () => {
                try {
                    const res = await api.get(`/api/labs/list/?patient_id=${id}`);
                    setLabs(res.data);
                } catch (err) { console.error(err); }
            };
            fetchLabs();
        } else if (activeTab === 'billing') {
            const fetchClaims = async () => {
                try {
                    const res = await api.get(`/api/billing/claims/list/?patient_id=${id}`);
                    setClaims(res.data);
                } catch (err) { console.error(err); }
            };
            fetchClaims();
        } else if (activeTab === 'clinical') {
            const fetchNotes = async () => {
                try {
                    const res = await api.get(`/api/clinical/list/?patient_id=${id}`);
                    setNotes(res.data);
                } catch (err) { console.error(err); }
            };
            fetchNotes();
        } else if (activeTab === 'meds') {
            const fetchMeds = async () => {
                try {
                    const res = await api.get(`/api/medications/list/?patient_id=${id}`);
                    setMeds(res.data);
                } catch (err) { console.error(err); }
            };
            fetchMeds();
        } else if (activeTab === 'appointments') {
            const fetchAppointments = async () => {
                try {
                    const res = await api.get(`/api/appointments/list/?patient_id=${id}`);
                    setAppointments(res.data);
                } catch (err) { console.error(err); }
            };
            fetchAppointments();
        }
    }, [activeTab, id]);

    // ... existing handlers ...

    // ... inside render:
    {
        activeTab === 'clinical' && (
            <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3>Clinical History</h3>
                    <button className="btn-primary" onClick={() => navigate('/clinical')}>Add Note</button>
                </div>
                {notes.length === 0 ? (
                    <p><i>No notes found for this patient.</i></p>
                ) : (
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {notes.map(note => (
                            <li key={note.id} style={{ padding: '15px', borderBottom: '1px solid #eee' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <strong>{note.diagnosis}</strong>
                                    <span style={{ fontSize: '0.9em', color: '#888' }}>{new Date(note.visit_date).toLocaleString()}</span>
                                </div>
                                <p style={{ margin: '5px 0', whiteSpace: 'pre-wrap' }}>{note.notes}</p>
                                <small style={{ color: '#666' }}>By: {note.clinician_name || 'Clinician'}</small>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        )
    }

    const handleCreateClaim = async () => {
        const cost = prompt("Enter Claim Amount (NGN):");
        if (cost) {
            try {
                await api.post('/api/billing/claims/create/', {
                    patient: id,
                    cost: cost,
                    services_rendered: [{ 'service': 'Consultation', 'cost': cost }],
                    insurance_details: patient.insurance_provider,
                    status: 'pending'
                });
                alert('Claim Submitted!');
                // refresh
                const res = await api.get(`/api/billing/claims/list/?patient_id=${id}`);
                setClaims(res.data);
            } catch (err) { alert('Failed to create claim.'); }
        }
    };

    const handleOrderLab = async () => {
        const testType = prompt("Enter Test Type (e.g. Malaria, HbA1c, CBC):");
        if (testType) {
            try {
                await api.post('/api/labs/create/', {
                    patient: id,
                    test_type: testType,
                    result_value: 'Pending',
                    status: 'pending'
                });
                alert('Lab Ordered!');
                // refresh
                const res = await api.get(`/api/labs/list/?patient_id=${id}`);
                setLabs(res.data);
            } catch (err) { alert('Failed to order lab.'); }
        }
    };

    if (!patient) return <div>Loading...</div>;

    return (
        <div className="layout-container">
            <Sidebar />
            <div className="main-content">
                <button onClick={() => navigate('/patients')} style={{ marginBottom: '10px', backgroundColor: '#6c757d', color: 'white', padding: '5px 10px' }}>&larr; Back to List</button>

                <div className="card" style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                    <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#dee2e6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', color: '#6c757d', alignSelf: 'center' }}>
                        {patient.name.charAt(0)}
                    </div>
                    <div style={{ flex: 1 }}>
                        {isEditing ? (
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                <div><label>Name:</label><input className="form-control" name="name" value={editForm.name} onChange={handleEditChange} /></div>
                                <div><label>Phone:</label><input className="form-control" name="phone_number" value={editForm.phone_number} onChange={handleEditChange} /></div>
                                <div style={{ gridColumn: 'span 2' }}><label>Contact:</label><input className="form-control" name="contact_info" value={editForm.contact_info} onChange={handleEditChange} /></div>
                                <div><label>Guardian:</label><input className="form-control" name="guardian_name" value={editForm.guardian_name} onChange={handleEditChange} /></div>
                                <div><label>Insurance:</label><input className="form-control" name="insurance_provider" value={editForm.insurance_provider} onChange={handleEditChange} /></div>
                                <div style={{ marginTop: '10px' }}>
                                    <button className="btn-success" onClick={handleUpdateProfile} style={{ marginRight: '10px' }}>Save</button>
                                    <button className="btn-danger" onClick={() => setIsEditing(false)}>Cancel</button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <h2 style={{ margin: 0 }}>{patient.name}</h2>
                                    <button className="btn-primary" style={{ padding: '5px 10px', fontSize: '0.8rem' }} onClick={() => setIsEditing(true)}>Edit Profile</button>
                                </div>
                                <p style={{ margin: '5px 0', color: '#666' }}>ID: #{patient.id} | Born: {patient.date_of_birth} | {patient.gender} | Phone: {patient.phone_number || 'N/A'}</p>
                                {patient.guardian_name && <p style={{ margin: '5px 0', color: '#0056b3', fontSize: '0.9em' }}>Guardian: {patient.guardian_name}</p>}
                                <p style={{ margin: 0, color: '#666' }}>Plan: {patient.insurance_provider} | Contact: {patient.contact_info}</p>
                            </>
                        )}
                    </div>
                </div>

                <div style={{ display: 'flex', borderBottom: '2px solid #dee2e6', marginBottom: '20px' }}>
                    {['clinical', 'meds', 'appointments', 'labs', 'billing'].map(tab => (
                        <div
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            style={{
                                padding: '10px 20px',
                                cursor: 'pointer',
                                borderBottom: activeTab === tab ? '3px solid #0056b3' : 'none',
                                color: activeTab === tab ? '#0056b3' : '#666',
                                fontWeight: activeTab === tab ? 'bold' : 'normal',
                                textTransform: 'capitalize'
                            }}
                        >
                            {tab === 'meds' ? 'Medications' : tab}
                        </div>
                    ))}
                </div>

                {activeTab === 'clinical' && (
                    <div className="card">
                        <h3>Clinical History</h3>
                        <p><i>No notes found for this patient.</i></p>
                        <button className="btn-primary" onClick={() => navigate('/clinical')}>Add Note</button>
                    </div>
                )}

                {activeTab === 'meds' && (
                    <div className="card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3>Active Medications</h3>
                            <button className="btn-success" onClick={() => navigate('/pharmacy')}>Prescribe</button>
                        </div>
                        {meds.length === 0 ? <p><i>No active prescriptions.</i></p> : (
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                {meds.map(med => (
                                    <li key={med.id} style={{ padding: '10px', borderBottom: '1px solid #eee' }}>
                                        <strong>{med.medication_name}</strong> - {med.dosage} ({med.frequency}) <br />
                                        <span style={{ fontSize: '0.9em', color: '#666' }}>Duration: {med.duration} | Prescribed: {new Date(med.prescribed_at).toLocaleDateString()}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                )}

                {activeTab === 'appointments' && (
                    <div className="card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3>Appointments</h3>
                            <button className="btn-primary" onClick={() => navigate('/appointments')}>Book Appointment</button>
                        </div>
                        {appointments.length === 0 ? <p><i>No upcoming appointments.</i></p> : (
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                {appointments.map(appt => (
                                    <li key={appt.id} style={{ padding: '10px', borderBottom: '1px solid #eee' }}>
                                        <strong>{new Date(appt.appointment_datetime).toLocaleString()}</strong> <br />
                                        <span style={{ fontSize: '0.9em' }}>Clinician: {appt.clinician || 'Assigned'} | Reason: {appt.reason}</span>
                                        <br /><span style={{ fontSize: '0.8em', color: appt.status === 'confirmed' ? 'green' : 'orange' }}>{appt.status}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                )}

                {activeTab === 'labs' && (
                    <div className="card">
                        <h3>Laboratory Orders</h3>
                        <button className="btn-primary" onClick={handleOrderLab} style={{ marginBottom: '15px' }}>Order New Lab</button>
                        {labs.length === 0 ? <p>No labs found.</p> : (
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                {labs.map(lab => (
                                    <li key={lab.id} style={{ padding: '10px', borderBottom: '1px solid #eee' }}>
                                        <strong>{lab.test_type}</strong> - {lab.status} <br />
                                        <span style={{ fontSize: '0.9em' }}>Result: {lab.result_value || 'Pending'} | Date: {new Date(lab.ordered_date).toLocaleDateString()}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                )}

                {activeTab === 'billing' && (
                    <div className="card">
                        <h3>Billing & Claims</h3>
                        <button className="btn-success" onClick={handleCreateClaim} style={{ marginBottom: '15px' }}>Submit New Claim</button>
                        {claims.length === 0 ? <p>No claims found.</p> : (
                            <table style={{ width: '100%', textAlign: 'left' }}>
                                <thead>
                                    <tr><th>Date</th><th>Amount</th><th>Status</th></tr>
                                </thead>
                                <tbody>
                                    {claims.map(claim => (
                                        <tr key={claim.id} style={{ borderBottom: '1px solid #eee' }}>
                                            <td style={{ padding: '8px' }}>{new Date(claim.submitted_at).toLocaleDateString()}</td>
                                            <td style={{ padding: '8px' }}>₦ {parseFloat(claim.cost).toLocaleString()}</td>
                                            <td style={{ padding: '8px' }}>{claim.status}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}

            </div>
        </div>
    );
};

export default PatientDetail;
