import React from 'react';
import './Footer.css';
import { Twitter, MessageCircle, Github } from 'lucide-react';

const Footer = ({ setCurrentView }) => {
    return (
        <footer className="glass-panel footer-container">
            <div className="footer-content">
                <div className="footer-brand">
                    <span className="gradient-text gradient-logo">NFT Galaxy</span>
                    <p>The premier decentralized exchange for hyper-rare digital assets. Trade, collect, and flex your NFTs.</p>
                </div>
                <div className="footer-links">
                    <div className="link-group">
                        <h4>Platform</h4>
                        <button onClick={() => setCurrentView('dashboard')}>Marketplace</button>
                        <button onClick={() => setCurrentView('sell')}>Create Drop</button>
                        <button onClick={() => setCurrentView('profile')}>My Profile</button>
                    </div>
                    <div className="link-group">
                        <h4>Company</h4>
                        <button onClick={() => setCurrentView('about')}>About Us</button>
                        <button onClick={() => setCurrentView('contact')}>Contact Support</button>
                        <button onClick={() => setCurrentView('notFound')}>Careers</button>
                    </div>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; 2026 NFT Galaxy. All rights reserved.</p>
                <div className="social-icons">
                    <Twitter size={20} />
                    <MessageCircle size={20} />
                    <Github size={20} />
                </div>
            </div>
        </footer>
    );
};

export default Footer;
