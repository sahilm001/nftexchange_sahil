import React from 'react';
import './PageStyles.css';

const About = () => {
    return (
        <div className="page-container animate-fade-in">
            <div className="glass-panel page-header">
                <h1 className="gradient-text">About NFT Galaxy</h1>
                <p>Pioneering the next generation of digital ownership</p>
            </div>

            <div className="page-content glass-panel">
                <h2>Our Mission</h2>
                <p>NFT Galaxy is a decentralized marketplace designed to empower creators and collectors. We believe in open access to digital assets, robust security, and an unparalleled user experience.</p>

                <h2 className="mt-2">Why Choose Us?</h2>
                <ul className="features-list">
                    <li><strong>Curated Collections:</strong> Access exclusive, hand-picked digital art.</li>
                    <li><strong>Lowest Fees:</strong> Trade with minimal transaction overhead.</li>
                    <li><strong>Community First:</strong> Join a thriving network of verified artists.</li>
                    <li><strong>Loyalty Rewards:</strong> Earn points and unlock ranks as you trade.</li>
                </ul>
            </div>
        </div>
    );
};

export default About;
