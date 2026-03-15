import React, { useState } from 'react';
import { Upload, Loader2, Info } from 'lucide-react';
import './Sell.css';

const Sell = ({ nfts, addNft, userAddress, showToast }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        image: '',
        rarity: 'Common'
    });
    const [preview, setPreview] = useState(null);
    const [isMinting, setIsMinting] = useState(false);
    const [mintSuccess, setMintSuccess] = useState(false);

    // Hardcoded dummy values for project requirement fulfillment
    const TIER = 'Premium Drop Phase 1';
    const TOTAL_SUPPLY = 5000;
    const REMAINING_SUPPLY = 1243;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name || !formData.price || !preview) {
            showToast('Please fill in all required fields.', 'error');
            return;
        }

        if (parseFloat(formData.price) <= 0) {
            showToast('Price must be greater than 0 ETH', 'error');
            return;
        }

        // Check for duplicates
        const isDuplicate = nfts.some(nft => nft.name.toLowerCase() === formData.name.toLowerCase());
        if (isDuplicate) {
            showToast('An NFT with this name already exists.', 'error');
            return;
        }

        setIsMinting(true);

        // Simulate blockchain transaction delay
        setTimeout(() => {
            const newNft = {
                id: Date.now().toString(),
                name: formData.name,
                description: formData.description,
                price: formData.price,
                image: preview,
                owner: userAddress,
                seller: userAddress,
                isListed: true,
                category: 'Art', // Default category
                rarity: formData.rarity
            };

            addNft(newNft);
            setMintSuccess(true);

            // Show success tick for 1.5 seconds before resetting form
            setTimeout(() => {
                setIsMinting(false);
                setMintSuccess(false);
                setFormData({ name: '', description: '', price: '', image: '', rarity: 'Common' });
                setPreview(null);
            }, 1500);
        }, 2000); // 2 second simulated minting wait
    };

    const handleImageChange = (e) => {
        setFormData({ ...formData, image: e.target.value });
        setPreview(e.target.value || 'https://images.unsplash.com/photo-1618172193622-ae2d025f4032?w=500&q=80');
    };

    return (
        <div className="sell-container animate-fade-in">
            <div className="sell-header">
                <h1 className="gradient-text">Create & List New NFT</h1>
                <p className="subtitle">Mint your digital asset and list it on the marketplace</p>
            </div>

            <div className="collection-stats glass-panel">
                <Info size={18} className="info-icon" />
                <div>
                    <strong>{TIER}</strong>
                    <span className="stat-detail">Total Supply: {TOTAL_SUPPLY} • Remaining: {REMAINING_SUPPLY}</span>
                </div>
            </div>

            <div className="sell-content">
                <div className="preview-section glass-panel">
                    <h3>Preview</h3>
                    {preview ? (
                        <div className="preview-card">
                            <img src={preview} alt="Preview" onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1618172193622-ae2d025f4032?w=500&q=80'; }} />
                            <div className="preview-info">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                    <h4 style={{ margin: 0 }}>{formData.name || 'Untitled NFT'}</h4>
                                    <span className={`badge-outline ${formData.rarity.toLowerCase()}`} style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', borderRadius: '12px', border: '1px solid var(--accent-primary)', color: 'var(--accent-primary)' }}>
                                        {formData.rarity}
                                    </span>
                                </div>
                                <div className="price-row">
                                    <span>Price</span>
                                    <span className="gradient-text">{formData.price || '0.00'} ETH</span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="preview-placeholder">
                            <Upload size={48} className="upload-icon" />
                            <p>Image preview will appear here</p>
                        </div>
                    )}
                </div>

                <div className="form-section glass-panel relative-container">
                    {/* Minting Overlay */}
                    {(isMinting || mintSuccess) && (
                        <div className="minting-overlay">
                            {mintSuccess ? (
                                <div className="success-content animate-pop-in">
                                    <div className="success-circle">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="20 6 9 17 4 12"></polyline>
                                        </svg>
                                    </div>
                                    <h2 className="gradient-text gradient-logo">Minted Successfully!</h2>
                                </div>
                            ) : (
                                <div className="minting-content">
                                    <div className="hologram-spinner">
                                        <div className="inner-spin"></div>
                                        <div className="outer-spin"></div>
                                    </div>
                                    <h2 className="pulse-text">Interacting with Blockchain...</h2>
                                    <p>Deploying smart contract and uploading metadata to IPFS</p>
                                </div>
                            )}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className={(isMinting || mintSuccess) ? 'blurred-form' : ''}>
                        <div className="form-group">
                            <label>NFT Name</label>
                            <input
                                type="text"
                                placeholder="e.g. 'Cosmic Dream #001'"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Description (Optional)</label>
                            <textarea
                                placeholder="Provide a detailed description of your item."
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows={4}
                            />
                        </div>

                        <div className="form-group">
                            <label>Image URL</label>
                            <input
                                type="url"
                                placeholder="https://..."
                                value={formData.image}
                                onChange={handleImageChange}
                                required
                            />
                            <small>For demo: paste any valid image URL.</small>
                        </div>

                        <div className="form-group">
                            <label>Rarity Tier</label>
                            <select
                                value={formData.rarity}
                                onChange={(e) => setFormData({ ...formData, rarity: e.target.value })}
                                style={{ background: 'rgba(0,0,0,0.2)', color: 'white', border: '1px solid rgba(255,255,255,0.1)', padding: '0.8rem 1rem', borderRadius: '8px', fontFamily: 'inherit' }}
                            >
                                <option value="Common">Common</option>
                                <option value="Rare">Rare</option>
                                <option value="Epic">Epic</option>
                                <option value="Legendary">Legendary</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Price (ETH)</label>
                            <div className="price-input">
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0.01"
                                    placeholder="0.00"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    required
                                />
                                <span className="currency-label">ETH</span>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn-primary submit-btn"
                            disabled={isMinting || !userAddress}
                        >
                            {isMinting ? (
                                <>
                                    <Loader2 size={20} className="spin-animation" />
                                    Minting & Listing...
                                </>
                            ) : (
                                'Create & List NFT'
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Sell;
