import React, { useState } from 'react';
import './AuthPage.css';
import { Mail, Lock, ArrowRight, Loader2, UserPlus } from 'lucide-react';
import { supabase } from '../supabaseClient';

const AuthPage = ({ onLogin, showToast }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isAdminLogin, setIsAdminLogin] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
    const [isForgotPassword, setIsForgotPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isForgotPassword) {
            if (!formData.email) {
                showToast('Please enter your email address', 'error');
                return;
            }
        } else if (!formData.email || !formData.password) {
            showToast('Please fill in both email and password', 'error');
            return;
        }

        // Simple dummy validation
        if (!formData.email.includes('@')) {
            showToast('Please enter a valid email address', 'error');
            return;
        }

        if (!isForgotPassword && formData.password.length < 6) {
            showToast('Password must be at least 6 characters long', 'error');
            return;
        }

        setIsLoading(true);

        try {
            if (isForgotPassword) {
                const { error } = await supabase.auth.resetPasswordForEmail(formData.email, {
                    redirectTo: 'http://localhost:3000/reset-password',
                });
                if (error) throw error;
                showToast('Password reset email sent! Please check your inbox.', 'success');
                setIsForgotPassword(false);
            } else if (isSignUp) {
                const { error } = await supabase.auth.signUp({
                    email: formData.email,
                    password: formData.password,
                });
                if (error) throw error;
                showToast('Registration successful! You may now log in if email confirmation is not required.', 'success');
                setIsSignUp(false); // Switch to login view
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email: formData.email,
                    password: formData.password,
                });
                if (error) throw error;
                onLogin(formData.email, isAdminLogin);
            }
        } catch (error) {
            showToast(error.message || 'Authentication failed', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };



    return (
        <div className="auth-container">
            <div className="auth-left">
                <div className="auth-left-content">
                    <h1 className="gradient-text gradient-logo" style={{ fontSize: '3rem', marginBottom: '1rem' }}>NFT Galaxy</h1>
                    <h2>Discover, Collect, and Sell Extraordinary Digital Art</h2>
                    <p>Join the world's most premium NFT exchange college project today. Create your own collections, buy legendary art, and show off your loyalty tier.</p>
                </div>
                <div className="auth-illustration">
                    <img src="https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?w=800&q=80" alt="Abstract 3D Art" />
                </div>
            </div>

            <div className="auth-right">
                <div className="auth-form-container glass-panel">
                    <div className="auth-header">
                        <h2>{isForgotPassword ? 'Reset Password' : (isSignUp ? 'Create an Account' : 'Welcome Back')}</h2>
                        <p>{isForgotPassword ? 'Enter your email to receive a reset link' : (isSignUp ? 'Sign up to start your NFT journey' : 'Log in to access your dashboard')}</p>
                    </div>

                    <form className="auth-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>
                            <div className="input-with-icon">
                                <Mail className="input-icon" size={20} />
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    placeholder="you@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        {!isForgotPassword && (
                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <div className="input-with-icon">
                                    <Lock className="input-icon" size={20} />
                                    <input
                                        type="password"
                                        id="password"
                                        name="password"
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required={!isForgotPassword}
                                    />
                                </div>
                            </div>
                        )}

                        <div className="auth-options">
                            {!isSignUp && !isForgotPassword && (
                                <>
                                    <label className="remember-me">
                                        <input type="checkbox" />
                                        <span>Remember me</span>
                                    </label>
                                    <label className="remember-me" style={{ marginLeft: '1rem', color: 'var(--accent-secondary)' }}>
                                        <input
                                            type="checkbox"
                                            checked={isAdminLogin}
                                            onChange={(e) => setIsAdminLogin(e.target.checked)}
                                        />
                                        <span>Admin Access</span>
                                    </label>
                                    <a href="#" className="forgot-password" onClick={(e) => { e.preventDefault(); setIsForgotPassword(true); }} style={{ marginLeft: 'auto' }}>
                                        Forgot Password?
                                    </a>
                                </>
                            )}
                        </div>

                        <button type="submit" className="btn-primary auth-submit" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="spin-animation" size={18} />
                                    {isForgotPassword ? 'Sending...' : (isSignUp ? 'Registering...' : 'Authenticating...')}
                                </>
                            ) : (
                                <>
                                    {isForgotPassword ? 'Send Reset Link' : (isSignUp ? 'Sign Up' : 'Sign In')} {!isForgotPassword && (isSignUp ? <UserPlus size={18} /> : <ArrowRight size={18} />)}
                                </>
                            )}
                        </button>
                    </form>



                    <div className="auth-footer">
                        {isForgotPassword ? (
                            <p>Remember your password? <a href="#" onClick={(e) => { e.preventDefault(); setIsForgotPassword(false); }}>Log in here</a></p>
                        ) : isSignUp ? (
                            <p>Already have an account? <a href="#" onClick={(e) => { e.preventDefault(); setIsSignUp(false); }}>Log in here</a></p>
                        ) : (
                            <p>Don't have an account? <a href="#" onClick={(e) => { e.preventDefault(); setIsSignUp(true); }}>Sign up for free</a></p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;
