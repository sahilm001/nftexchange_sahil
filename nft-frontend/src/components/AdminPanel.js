import React from 'react';
import { Shield, Users, Activity, Settings } from 'lucide-react';
import './PageStyles.css';

const AdminPanel = ({ nfts, showToast }) => {
    return (
        <div className="page-container animate-fade-in" style={{ maxWidth: '1000px' }}>
            <div className="glass-panel page-header">
                <Shield size={48} className="mx-auto" style={{ color: 'var(--accent-secondary)' }} />
                <h1 className="gradient-text mt-2">Admin Command Center</h1>
                <p>System overview and platform controls</p>
            </div>

            <div className="form-grid mt-4">
                <div className="glass-panel p-4 text-center">
                    <Activity size={32} className="mx-auto mb-2" style={{ color: 'var(--accent-primary)' }} />
                    <h3 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{nfts.length}</h3>
                    <p className="text-secondary" style={{ fontSize: '0.9rem' }}>Total Platform NFTs</p>
                </div>
                <div className="glass-panel p-4 text-center">
                    <Users size={32} className="mx-auto mb-2" style={{ color: 'var(--accent-primary)' }} />
                    <h3 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>1,204</h3>
                    <p className="text-secondary" style={{ fontSize: '0.9rem' }}>Active Users</p>
                </div>
                <div className="glass-panel p-4 text-center" style={{ cursor: 'pointer' }} onClick={() => showToast('Settings locked for security', 'error')}>
                    <Settings size={32} className="mx-auto mb-2" style={{ color: 'var(--accent-secondary)' }} />
                    <h3 style={{ fontSize: '1.2rem', marginTop: '1rem' }}>Platform Settings</h3>
                </div>
            </div>

            <div className="glass-panel mt-4 p-4">
                <h2 style={{ marginBottom: '1rem' }}>Recent Platform Activity</h2>
                <div className="notification-item">
                    <p><strong>System:</strong> Database backup completed successfully.</p>
                    <small>10 mins ago</small>
                </div>
                <div className="notification-item">
                    <p><strong>User:</strong> 0x1234...5678 minted a new asset.</p>
                    <small>1 hour ago</small>
                </div>
                <div className="notification-item">
                    <p><strong>Alert:</strong> High gas fees detected on Ethereum mainnet.</p>
                    <small>2 hours ago</small>
                </div>
            </div>
        </div>
    );
};

export default AdminPanel;
