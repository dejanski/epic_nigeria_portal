import React from 'react';

const EmptyState = ({ message, actionObject }) => {
    return (
        <div style={{ textAlign: 'center', padding: '40px', color: '#666', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
            <div style={{ fontSize: '3rem', marginBottom: '10px' }}>📂</div>
            <h3>{message || 'No records found'}</h3>
            {actionObject && (
                <div style={{ marginTop: '20px' }}>
                    {actionObject}
                </div>
            )}
        </div>
    );
};

export default EmptyState;
