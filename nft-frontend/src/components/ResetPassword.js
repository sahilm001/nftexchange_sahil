import React, { useState } from 'react';
import './AuthPage.css';
import { Lock, Loader2, ArrowRight } from 'lucide-react';
import { supabase } from '../supabaseClient';

const ResetPassword = ({ showToast, setCurrentView }) => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            showToast('Passwords do not match', 'error');
            return;
        }

        if (password.length < 6) {
            showToast('Password must be at least 6 characters long', 'error');
            return;
        }

        setIsLoading(true);

        try {
            const { error } = await supabase.auth.updateUser({ password });
            if (error) throw error;

            showToast('Password successfully updated!', 'success');
            setCurrentView('auth'); // Switch back to login page
        } catch (error) {
            showToast(error.message || 'Error updating password', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-left">
                <div className="auth-left-content">
                    <h1 className="gradient-text gradient-logo" style={{ fontSize: '3rem', marginBottom: '1rem' }}>NFT Galaxy</h1>
                    <h2>Secure Your Account</h2>
                    <p>Enter a new strong password below to regain access to your extraordinary digital art collection.</p>
                </div>
                <div className="auth-illustration">
                    <img src="https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?w=800&q=80" alt="Abstract 3D Art" />
                </div>
            </div>

            <div className="auth-right">
                <div className="auth-form-container glass-panel">
                    <div className="auth-header">
                        <h2>Set New Password</h2>
                        <p>Please type your new password</p>
                    </div>

                    <form className="auth-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="password">New Password</label>
                            <div className="input-with-icon">
                                <Lock className="input-icon" size={20} />
                                <input
                                    type="password"
                                    id="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <div className="input-with-icon">
                                <Lock className="input-icon" size={20} />
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    placeholder="••••••••"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <button type="submit" className="btn-primary auth-submit" disabled={isLoading} style={{ marginTop: '2rem' }}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="spin-animation" size={18} />
                                    Updating...
                                </>
                            ) : (
                                <>
                                    Update Password <ArrowRight size={18} />
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
