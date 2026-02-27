import React, { useState } from 'react';
import { Send } from 'lucide-react';
import './PageStyles.css';

const Contact = ({ showToast }) => {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });

    const handleSubmit = (e) => {
        e.preventDefault();
        showToast('Message sent! We will get back to you soon.', 'success');
        setFormData({ name: '', email: '', message: '' });
    };

    return (
        <div className="page-container animate-fade-in">
            <div className="glass-panel page-header">
                <h1 className="gradient-text">Contact Support</h1>
                <p>We're here to help you navigate the galaxy.</p>
            </div>

            <div className="page-content glass-panel max-w-md">
                <form className="contact-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Your Name</label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Alex Walker"
                        />
                    </div>
                    <div className="form-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="alex@example.com"
                        />
                    </div>
                    <div className="form-group">
                        <label>How can we help?</label>
                        <textarea
                            required
                            rows="5"
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            placeholder="Describe your issue..."
                        />
                    </div>
                    <button type="submit" className="btn-primary full-width">
                        <Send size={18} /> Send Message
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Contact;
