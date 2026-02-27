import React, { useEffect } from 'react';
import { X, CheckCircle, AlertCircle } from 'lucide-react';
import './Toast.css';

const Toast = ({ message, type, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 4000); // auto close after 4 seconds
        return () => clearTimeout(timer);
    }, [onClose]);

    if (!message) return null;

    return (
        <div className={`toast-container animate-slide-up ${type}`}>
            <div className="toast-content">
                {type === 'success' ? (
                    <CheckCircle className="toast-icon success" size={20} />
                ) : (
                    <AlertCircle className="toast-icon error" size={20} />
                )}
                <span className="toast-message">{message}</span>
            </div>
            <button className="toast-close" onClick={onClose}>
                <X size={16} />
            </button>
        </div>
    );
};

export default Toast;
