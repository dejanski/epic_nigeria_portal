import React, { useEffect, useState } from 'react';
import api from '../api';
import Sidebar from '../components/Sidebar';
import { useParams, useNavigate } from 'react-router-dom';

const PatientDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [patient, setPatient] = useState(null);
    const [activeTab, setActiveTab] = useState('clinical'); // clinical, meds, appointments, labs
    const [labs, setLabs] = useState([]);

    useEffect(() => {
        const fetchPatient = async () => {
            try {
                const response = await api.get(`/api/patients/${id}/update/`);
                setPatient(response.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchPatient();
    }, [id]);

    useEffect(() => {
        if (activeTab === 'labs') {
            const fetchLabs = async () => {
                try {
                    const res = await api.get(`/api/labs/list/?patient_id=${id}`);
                    setLabs(res.data);
                } catch (err) { console.error(err); }
            };
            fetchLabs();
        }
    }, [activeTab, id]);

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

                <div className="card" style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                    <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#dee2e6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', color: '#6c757d' }}>
                        {patient.name.charAt(0)}
                    </div>
                    <div>
                        <h2 style={{ margin: 0 }}>{patient.name}</h2>
                        <p style={{ margin: '5px 0', color: '#666' }}>ID: #{patient.id} | Born: {patient.date_of_birth} | {patient.gender}</p>
                        <p style={{ margin: 0, color: '#666' }}>Plan: {patient.insurance_provider}</p>
                    </div>
                </div>

                <div style={{ display: 'flex', borderBottom: '2px solid #dee2e6', marginBottom: '20px' }}>
                    {['clinical', 'meds', 'appointments', 'labs'].map(tab => (
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
                        <h3>Active Medications</h3>
                        <p><i>No active prescriptions.</i></p>
                        <button className="btn-success" onClick={() => navigate('/pharmacy')}>Prescribe</button>
                    </div>
                )}

                {activeTab === 'appointments' && (
                    <div className="card">
                        <h3>Appointments</h3>
                        <p><i>No upcoming appointments.</i></p>
                        <button className="btn-primary" onClick={() => navigate('/appointments')}>Book Appointment</button>
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

            </div>
        </div>
    );
};

export default PatientDetail;
