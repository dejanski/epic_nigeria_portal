import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const Sidebar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        navigate('/');
    };

    return (
        <div className="sidebar">
            <h2>EPIC Portal</h2>
            <nav style={{ flex: 1 }}>
                <NavLink to="/dashboard" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>Dashboard</NavLink>
                <NavLink to="/patients" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>Patients</NavLink>
                <NavLink to="/appointments" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>Scheduling</NavLink>
                <NavLink to="/labs" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>Labs</NavLink>
                <NavLink to="/claims" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>Claims</NavLink>
                <NavLink to="/clinical" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>Clinical Notes</NavLink>
                <NavLink to="/pharmacy" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>Pharmacy</NavLink>
                <NavLink to="/audit" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>System Audit</NavLink>
                {localStorage.getItem('is_superuser') === 'true' && (
                    <NavLink to="/staff" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>Staff Admin</NavLink>
                )}
                <NavLink to="/settings" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>Settings</NavLink>
            </nav>
            <button
                onClick={handleLogout}
                style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white', marginTop: '20px' }}
            >
                Logout
            </button>
        </div>
    );
};

export default Sidebar;
