import React from 'react';
import { Home } from 'lucide-react';
import './PageStyles.css';

const NotFound = ({ setCurrentView }) => {
    return (
        <div className="page-container animate-fade-in flex-center">
            <div className="glass-panel text-center p-4">
                <h1 className="gradient-text text-huge">404</h1>
                <h2>Lost in Space</h2>
                <p className="mt-2 text-secondary">The page you are looking for has drifted into the void.</p>
                <button
                    className="btn-primary mt-4 mx-auto"
                    onClick={() => setCurrentView('dashboard')}
                >
                    <Home size={18} /> Return to Base
                </button>
            </div>
        </div>
    );
};

export default NotFound;
