import React, { useState, useRef } from 'react';
import { calculateLoyalty } from '../services/LoyaltyService';
import { Edit3, Check, X, Upload, Star, Award, Zap } from 'lucide-react';
import './Profile.css';

const timeAgo = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const seconds = Math.floor((new Date() - date) / 1000);
    let interval = seconds / 31536000;
    if (interval >= 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval >= 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval >= 1) return Math.floor(interval) + (Math.floor(interval) === 1 ? " day ago" : " days ago");
    interval = seconds / 3600;
    if (interval >= 1) return Math.floor(interval) + (Math.floor(interval) === 1 ? " hour ago" : " hours ago");
    interval = seconds / 60;
    if (interval >= 1) return Math.floor(interval) + (Math.floor(interval) === 1 ? " minute ago" : " minutes ago");
    if (seconds < 30) return "Just now";
    return Math.floor(seconds) + " seconds ago";
};

const Profile = ({ nfts, userAddress, userProfile, updateUserProfile, showToast, transactions }) => {
    const ownedNfts = nfts.filter(nft => nft.owner === userAddress);
    const createdNfts = nfts.filter(nft => nft.seller === userAddress);
    const loyalty = calculateLoyalty(ownedNfts.length);

    const [activeTab, setActiveTab] = useState('collected');
    const [selectedNft, setSelectedNft] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [updatePrice, setUpdatePrice] = useState('');

    const hasMinted = nfts.some(nft => nft.seller === userAddress);
    const hasBought = nfts.some(nft => nft.owner === userAddress && nft.seller !== userAddress);
    const hasCollected5 = ownedNfts.length >= 5;
    const [formData, setFormData] = useState({
        fullName: userProfile.fullName || '',
        email: userProfile.email || '',
        phone: userProfile.phone || '',
        dob: userProfile.dob || '',
        password: '',
        avatarUrl: userProfile.avatarUrl || ''
    });

    const [formErrors, setFormErrors] = useState({});
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);

    const fileInputRef = useRef(null);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5000000) { // 5MB limit
                showToast('Image must be less than 5MB', 'error');
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, avatarUrl: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const validateForm = () => {
        const errors = {};

        // Name Validation: Words optionally followed by up to 3 numbers.
        const nameRegex = /^[a-zA-Z\s]+[0-9]{0,3}$/;
        if (!formData.fullName.trim()) {
            errors.fullName = "Name is required";
        } else if (!nameRegex.test(formData.fullName.trim())) {
            errors.fullName = "Name must be words, optionally followed by up to 3 numbers (e.g. John123)";
        }

        if (!formData.email) {
            errors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = "Invalid email format";
        }
        if (!formData.password || formData.password.length < 6) {
            errors.password = "Password must be at least 6 characters";
        }
        if (formData.phone && !/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
            errors.phone = "Phone must be exactly 10 digits";
        }
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (formErrors[e.target.name]) {
            setFormErrors({ ...formErrors, [e.target.name]: null });
        }
    };

    const handleSave = (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsSaving(true);
        // Simulate network request
        setTimeout(() => {
            setIsSaving(false);
            setSaveSuccess(true);
            updateUserProfile(formData);
            showToast('Profile updated successfully!', 'success');

            setTimeout(() => {
                setSaveSuccess(false);
                setIsEditing(false);
            }, 1000);
        }, 1500);
    };

    return (
        <div className="profile-view animate-fade-in">
            <div className="profile-header glass-panel">
                <div className="avatar">
                    {userProfile.avatarUrl ? (
                        <img src={userProfile.avatarUrl} alt="Profile" className="avatar-image" />
                    ) : (
                        <div className="avatar-placeholder gradient-bg"></div>
                    )}
                </div>
                <div className="profile-info">
                    <div className="profile-name-row">
                        <h1 className="gradient-text">{userProfile.fullName || 'Unnamed Explorer'}</h1>
                        {!isEditing && (
                            <button className="btn-icon" onClick={() => setIsEditing(true)}>
                                <Edit3 size={18} />
                            </button>
                        )}
                    </div>
                    <div className="wallet-pill">
                        <span className="address">{userProfile.address}</span>
                    </div>
                    <div className="balance-info">
                        <span className="label">Wallet Balance</span>
                        <span className="value">{userProfile.balance} ETH</span>
                    </div>

                    <div className="loyalty-section">
                        <div className="loyalty-header">
                            <div className="loyalty-badge">
                                <div className="tier-dot" style={{ backgroundColor: loyalty.tierColor }}></div>
                                <span>{loyalty.tier} Tier</span>
                                <span className="pts-text">• {loyalty.points} PTS</span>
                            </div>
                            {loyalty.nextTier && (
                                <span className="next-tier-hint">Next: {loyalty.nextTier}</span>
                            )}
                        </div>

                        <div className="progress-bar-container">
                            <div
                                className="progress-fill gradient-bg"
                                style={{ width: `${Math.min(100, (loyalty.points / (loyalty.points + loyalty.pointsToNext)) * 100)}%` }}
                            ></div>
                        </div>

                        <div className="achievements-row mt-2">
                            <div className={`achievement-badge ${hasMinted ? 'active' : 'dimmed'}`} title="First Mint">
                                <Star size={14} className="achievement-icon" />
                            </div>
                            <div className={`achievement-badge ${hasBought ? 'active' : 'dimmed'}`} title="First Bought">
                                <Zap size={14} className="achievement-icon" />
                            </div>
                            <div className={`achievement-badge ${hasCollected5 ? 'gold' : 'dimmed'}`} title="5 Collected">
                                <Award size={14} className="achievement-icon" />
                            </div>
                            <button
                                className="btn-secondary redeem-btn ml-auto"
                                onClick={() => showToast('Rewards portal coming soon!', 'success')}
                            >
                                Redeem Points
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {isEditing && (
                <div className="edit-profile-section glass-panel animate-fade-in">
                    <div className="edit-profile-header">
                        <h2>Edit Profile</h2>
                        <button className="btn-icon circle" onClick={() => setIsEditing(false)}>
                            <X size={20} />
                        </button>
                    </div>

                    <form className="edit-profile-form" onSubmit={handleSave}>
                        <div className="form-grid">
                            <div className="form-group dp-upload-group">
                                <label>Profile Picture</label>
                                <div
                                    className="dp-dropzone"
                                    onClick={() => fileInputRef.current.click()}
                                    style={{ backgroundImage: formData.avatarUrl ? `url(${formData.avatarUrl})` : 'none' }}
                                >
                                    {!formData.avatarUrl && (
                                        <div className="dp-placeholder-content">
                                            <Upload size={24} />
                                            <span>Click to upload</span>
                                        </div>
                                    )}
                                </div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    ref={fileInputRef}
                                    onChange={handleImageUpload}
                                    style={{ display: 'none' }}
                                />
                            </div>

                            <div className="form-fields">
                                <div className="form-group">
                                    <label>Full Name *</label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        placeholder="Enter your name"
                                        className={formErrors.fullName ? 'is-invalid' : ''}
                                    />
                                    {formErrors.fullName && <span className="error-text">{formErrors.fullName}</span>}
                                </div>
                                <div className="form-group">
                                    <label>Email Address *</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="you@example.com"
                                        className={formErrors.email ? 'is-invalid' : ''}
                                    />
                                    {formErrors.email && <span className="error-text">{formErrors.email}</span>}
                                </div>
                                <div className="form-group">
                                    <label>Password *</label>
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Enter new password"
                                        className={formErrors.password ? 'is-invalid' : ''}
                                    />
                                    {formErrors.password && <span className="error-text">{formErrors.password}</span>}
                                </div>
                                <div className="form-group">
                                    <label>Phone Number</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="1234567890"
                                        className={formErrors.phone ? 'is-invalid' : ''}
                                    />
                                    {formErrors.phone && <span className="error-text">{formErrors.phone}</span>}
                                </div>
                                <div className="form-group">
                                    <label>Date of Birth</label>
                                    <input
                                        type="date"
                                        name="dob"
                                        value={formData.dob}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="form-actions">
                            <button type="button" className="btn-secondary" onClick={() => setIsEditing(false)} disabled={isSaving}>Cancel</button>
                            <button type="submit" className={`btn-primary ${saveSuccess ? 'success-state' : ''}`} disabled={isSaving || Object.keys(formErrors).some(k => formErrors[k])}>
                                {isSaving ? (
                                    <div className="spinner-mini"></div>
                                ) : saveSuccess ? (
                                    <><Check size={18} /> Saved!</>
                                ) : (
                                    <><Check size={18} /> Save Changes</>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="profile-tabs mt-4">
                <button
                    className={`tab ${activeTab === 'collected' ? 'active' : ''}`}
                    onClick={() => setActiveTab('collected')}
                >
                    Collected ({ownedNfts.length})
                </button>
                <button
                    className={`tab ${activeTab === 'created' ? 'active' : ''}`}
                    onClick={() => setActiveTab('created')}
                >
                    Created ({createdNfts.length})
                </button>
                <button
                    className={`tab ${activeTab === 'activity' ? 'active' : ''}`}
                    onClick={() => setActiveTab('activity')}
                >
                    Activity
                </button>
            </div>

            {activeTab !== 'activity' ? (
                <div className="nft-grid">
                    {(activeTab === 'collected' ? ownedNfts : createdNfts).map(nft => (
                        <div key={nft.id} className="nft-card glass-panel" onClick={() => setSelectedNft(nft)}>
                            <div className="nft-image-container">
                                <img src={nft.image} alt={nft.name} className={`nft-image ${nft.themeClass || ''}`} />
                            </div>
                            <div className="nft-info">
                                <h3>{nft.name}</h3>
                                {nft.isListed ? (
                                    <div className="status-badge listed">Listed for {nft.price} ETH</div>
                                ) : (
                                    <div className="status-badge unlisted">In Vault</div>
                                )}
                            </div>
                        </div>
                    ))}

                    {(activeTab === 'collected' ? ownedNfts : createdNfts).length === 0 && (
                        <div className="empty-state glass-panel">
                            <h3>No NFTs found here.</h3>
                            <p>{activeTab === 'collected' ? 'Go to the market to find your first NFT!' : 'Try minting your first NFT in the Create drop section!'}</p>
                        </div>
                    )}
                </div>
            ) : (
                <div className="activity-list glass-panel p-4">
                    <h3 className="mb-4">Recent Activity</h3>
                    <div className="history-table">
                        <div className="history-header">
                            <span>Event</span>
                            <span>Item</span>
                            <span>Price</span>
                            <span>Date</span>
                        </div>
                        {transactions && transactions.filter(t => t.from === userAddress || t.to === userAddress).map(tx => (
                            <div key={tx.id} className="history-row">
                                <span>{tx.type}</span>
                                <span>{tx.nftName}</span>
                                <span>{tx.type === 'Mint/List' ? '--' : `${tx.price} ETH`}</span>
                                <span>{timeAgo(tx.timestamp)}</span>
                            </div>
                        ))}
                        {(!transactions || transactions.filter(t => t.from === userAddress || t.to === userAddress).length === 0) && (
                            <div className="history-row" style={{ gridTemplateColumns: '1fr', textAlign: 'center', opacity: 0.5 }}>
                                <span>No recent activity</span>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* View Details Modal */}
            {selectedNft && (
                <div className="modal-overlay" onClick={() => setSelectedNft(null)}>
                    <div className="modal-content glass-panel" onClick={e => e.stopPropagation()}>
                        <div className="modal-split">
                            <div className="modal-image">
                                <img src={selectedNft.image} alt={selectedNft.name} className={selectedNft.themeClass || ''} style={{ borderRadius: '12px', width: '100%', objectFit: 'cover' }} />
                            </div>
                            <div className="modal-details">
                                <h2>{selectedNft.name}</h2>
                                <p className="description">{selectedNft.description}</p>

                                <div className="detail-row">
                                    <span className="label">Creator</span>
                                    <span className="value truncate">{selectedNft.seller || 'Unknown'}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="label">Owner</span>
                                    <span className="value truncate">{selectedNft.owner}</span>
                                </div>
                                {selectedNft.category && (
                                    <div className="detail-row">
                                        <span className="label">Category</span>
                                        <span className="value badge-outline">{selectedNft.category}</span>
                                    </div>
                                )}

                                <div className="price-box glass-panel">
                                    <span className="label">Status</span>
                                    <div className="price-amount" style={{ fontSize: '1.5rem' }}>
                                        {selectedNft.isListed ? `Listed For: ${selectedNft.price} ETH` : 'Not For Sale (Vaulted)'}
                                    </div>
                                </div>

                                {selectedNft.owner === userAddress ? (
                                    <div className="owner-actions mt-4">
                                        <h4 style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Manage Listing</h4>
                                        {selectedNft.isListed ? (
                                            <div className="manage-controls">
                                                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                                                    <input
                                                        type="number"
                                                        placeholder="New Price"
                                                        value={updatePrice}
                                                        onChange={e => setUpdatePrice(e.target.value)}
                                                        style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-color)', color: 'white' }}
                                                    />
                                                    <button className="btn-primary" onClick={() => { showToast('Price updated! (Simulated)', 'success'); setUpdatePrice(''); }}>Update</button>
                                                </div>
                                                <button className="btn-secondary w-100" style={{ width: '100%' }} onClick={() => showToast('Listing cancelled! (Simulated)', 'success')}>
                                                    Cancel Listing
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="manage-controls">
                                                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                                                    <input
                                                        type="number"
                                                        placeholder="Price (ETH)"
                                                        value={updatePrice}
                                                        onChange={e => setUpdatePrice(e.target.value)}
                                                        style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-color)', color: 'white' }}
                                                    />
                                                    <button className="btn-primary" onClick={() => { showToast('NFT Listed! (Simulated)', 'success'); setUpdatePrice(''); }}>List for Sale</button>
                                                </div>
                                            </div>
                                        )}
                                        <button className="btn-secondary full-width mt-4" onClick={() => setSelectedNft(null)}>
                                            Close Details
                                        </button>
                                    </div>
                                ) : (
                                    <div className="modal-actions mt-4">
                                        <button className="btn-secondary full-width" onClick={() => setSelectedNft(null)}>
                                            Close Details
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;
