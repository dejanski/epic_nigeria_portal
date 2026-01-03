import React, { useEffect, useState } from 'react';
import api from '../api';
import PatientDetail from './PatientDetail';
import Sidebar from '../components/Sidebar';
import LoadingSpinner from '../components/LoadingSpinner';

const PatientPortal = () => {
    const [patientId, setPatientId] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get('/api/accounts/me/');
                if (res.data.patient_id) {
                    setPatientId(res.data.patient_id);
                } else {
                    console.error("User is not linked to a patient record");
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    if (loading) return <LoadingSpinner />;

    if (!patientId) {
        return (
            <div className="layout-container">
                <Sidebar />
                <div className="main-content">
                    <div className="card">
                        <h2>Access Denied</h2>
                        <p>Your account is not linked to a medical record. Please contact the clinic.</p>
                    </div>
                </div>
            </div>
        );
    }

    // Reuse PatientDetail but we might need to hide some controls via props if we wanted to be strict.
    // However, the backend enforces RBAC, so even if they see 'Edit', saving would fail.
    // For better UX, let's assume PatientDetail handles read-only view or we'd add a prop.
    return <PatientDetail patientIdOverride={patientId} isPatientView={true} />;
};

export default PatientPortal;
