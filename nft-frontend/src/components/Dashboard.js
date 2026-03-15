import React, { useState, useMemo } from 'react';
import { ShoppingCart, Search, Filter, TrendingUp, Award, Box, Share2, MessageCircle, Clock, ArrowUpDown } from 'lucide-react';
import { calculateLoyalty } from '../services/LoyaltyService';
import './Dashboard.css';

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

const Dashboard = ({ nfts, buyNft, userAddress, userProfile, transactions }) => {
    const [selectedNft, setSelectedNft] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [sortOrder, setSortOrder] = useState('Recent');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [newComment, setNewComment] = useState('');
    const [nftComments, setNftComments] = useState(() => {
        const saved = localStorage.getItem('nft_comments');
        return saved ? JSON.parse(saved) : {};
    });

    // Calculate user's loyalty points
    const ownedNfts = nfts.filter(nft => nft.owner === userAddress);
    const { points } = calculateLoyalty(ownedNfts.length);

    // Filter & Sort logic
    const displayNfts = useMemo(() => {
        let filtered = nfts.filter(nft => {
            if (!nft.isListed || nft.owner === userAddress) return false;

            const matchesSearch = nft.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                nft.description.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = categoryFilter === 'All' || nft.category === categoryFilter;

            const price = parseFloat(nft.price);
            const matchesMinPrice = minPrice === '' || price >= (parseFloat(minPrice) || 0);
            const matchesMaxPrice = maxPrice === '' || price <= (parseFloat(maxPrice) || Infinity);

            return matchesSearch && matchesCategory && matchesMinPrice && matchesMaxPrice;
        });

        // Sorting
        return filtered.sort((a, b) => {
            if (sortOrder === 'Price Low-High') return parseFloat(a.price) - parseFloat(b.price);
            if (sortOrder === 'Price High-Low') return parseFloat(b.price) - parseFloat(a.price);
            if (sortOrder === 'Recent') return b.id.localeCompare(a.id);
            if (sortOrder === 'Popular') return 0.5 - Math.random(); // Mock popularity
            return 0;
        });
    }, [nfts, userAddress, searchQuery, categoryFilter, minPrice, maxPrice, sortOrder]);

    const handleAddComment = () => {
        if (!newComment.trim() || !selectedNft) return;
        const commentId = Date.now().toString();
        const commentObj = { id: commentId, text: newComment, author: userProfile?.fullName || 'User', timestamp: new Date().toLocaleDateString() };

        const updatedComments = { ...nftComments };
        if (!updatedComments[selectedNft.id]) {
            updatedComments[selectedNft.id] = [];
        }
        updatedComments[selectedNft.id].push(commentObj);

        setNftComments(updatedComments);
        localStorage.setItem('nft_comments', JSON.stringify(updatedComments));
        setNewComment('');
    };

    const handleShare = (platform) => {
        const url = window.location.href;
        const text = `Check out this amazing NFT: ${selectedNft?.name} on the marketplace!`;
        if (platform === 'twitter') {
            window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
        } else if (platform === 'discord') {
            window.open(`https://discord.com/channels/@me`, '_blank'); // Mock discord share
        }
    };

    const totalVolume = nfts.reduce((acc, curr) => acc + parseFloat(curr.price), 0).toFixed(1);

    const handleBuy = (nft) => {
        buyNft(nft);
        setSelectedNft(null);
    };

    return (
        <div className="dashboard animate-fade-in">
            <div className="hero-banner glass-panel mb-4">
                <div className="hero-content">
                    <h1 className="hero-title"><span className="gradient-text gradient-logo">NFT Galaxy</span></h1>
                    <p className="hero-subtitle">Discover, Collect, and Sell Extraordinary Digital Art</p>
                    <p className="hero-description">Join the world's most premium NFT exchange college project today. Create your own collections, buy legendary art, and show off your loyalty tier.</p>
                    <div className="hero-actions">
                        <button className="btn-primary" onClick={() => document.querySelector('.search-bar input').focus()}>Explore Market</button>
                    </div>
                </div>
                <div className="hero-visual">
                    <div className="floating-cube"></div>
                    <div className="floating-sphere"></div>
                </div>
            </div>

            {/* Analytics Header */}
            <div className="analytics-header">

                <div className="controls-row">
                    <div className="search-bar glass-panel">
                        <Search size={18} className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search NFTs..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="filters-group">
                        <div className="price-inputs glass-panel">
                            <input
                                type="number"
                                placeholder="Min ETH"
                                value={minPrice}
                                onChange={(e) => setMinPrice(e.target.value)}
                                className="price-input-small"
                            />
                            <span>-</span>
                            <input
                                type="number"
                                placeholder="Max ETH"
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(e.target.value)}
                                className="price-input-small"
                            />
                        </div>

                        <div className="filter-dropdown glass-panel">
                            <Filter size={18} />
                            <select
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                            >
                                <option value="All">All Categories</option>
                                <option value="Art">Art</option>
                                <option value="Gaming">Gaming</option>
                                <option value="PFP">PFP</option>
                            </select>
                        </div>

                        <div className="filter-dropdown glass-panel">
                            <ArrowUpDown size={18} />
                            <select
                                value={sortOrder}
                                onChange={(e) => setSortOrder(e.target.value)}
                            >
                                <option value="Recent">Recent</option>
                                <option value="Popular">Popular</option>
                                <option value="Price Low-High">Price: Low to High</option>
                                <option value="Price High-Low">Price: High to Low</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <div className="nft-grid has-staggered-animations">
                {displayNfts.map((nft, index) => (
                    <div key={nft.id} className="nft-card glass-panel staggered-item" style={{ animationDelay: `${index * 0.1}s` }} onClick={() => setSelectedNft(nft)}>
                        <div className="nft-image-container">
                            <img src={nft.image} alt={nft.name} className={`nft-image ${nft.themeClass || ''}`} loading="lazy" />
                        </div>
                        <div className="nft-info">
                            <h3>{nft.name}</h3>
                            <div className="nft-price-row">
                                <span className="price-label">Current Price</span>
                                <span className="price-value">{nft.price} ETH</span>
                            </div>
                        </div>
                    </div>
                ))}
                {displayNfts.length === 0 && (
                    <div className="empty-state glass-panel">
                        <h3>No NFTs currently listed</h3>
                        <p>Check back later for new drops!</p>
                    </div>
                )}
            </div>

            {/* Buy Modal */}
            {selectedNft && (
                <div className="modal-overlay" onClick={() => setSelectedNft(null)}>
                    <div className="modal-content glass-panel scrollable-modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-split">
                            <div className="modal-left-pane">
                                <div className="modal-image">
                                    <img src={selectedNft.image} alt={selectedNft.name} className={selectedNft.themeClass || ''} style={{ borderRadius: '12px', width: '100%', objectFit: 'cover' }} />
                                </div>
                                <div className="social-share mt-4">
                                    <h4>Share this NFT</h4>
                                    <div className="share-buttons">
                                        <button className="btn-icon circle" onClick={() => handleShare('twitter')} title="Share on X (Twitter)">
                                            <Share2 size={18} />
                                        </button>
                                        <button className="btn-icon circle" onClick={() => handleShare('discord')} title="Share on Discord">
                                            <MessageCircle size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="modal-details">
                                <h2>{selectedNft.name}</h2>
                                <p className="description">{selectedNft.description}</p>

                                <div className="detail-row">
                                    <span className="label">Creator</span>
                                    <span className="value truncate">{selectedNft.seller || 'Unknown'}</span>
                                </div>

                                <div className="price-box glass-panel">
                                    <span className="label">Current Price</span>
                                    <div className="price-amount">
                                        <span className="eth-icon">⟠</span>
                                        <strong>{selectedNft.price}</strong> ETH
                                    </div>
                                </div>

                                <div className="modal-actions mb-4">
                                    <button className="btn-primary buy-btn" onClick={() => handleBuy(selectedNft)}>
                                        <ShoppingCart size={18} />
                                        Buy Now
                                    </button>
                                    <button className="btn-secondary" onClick={() => setSelectedNft(null)}>
                                        Close
                                    </button>
                                </div>

                                <div className="mock-history mt-4">
                                    <h4><Clock size={16} className="inline-icon" /> Transaction History</h4>
                                    <div className="history-table">
                                        <div className="history-header">
                                            <span>Event</span>
                                            <span>Price</span>
                                            <span>Date</span>
                                        </div>
                                        {transactions && transactions.filter(t => t.nftId === selectedNft.id).map(tx => (
                                            <div key={tx.id} className="history-row">
                                                <span>{tx.type}</span>
                                                <span>{tx.type === 'Mint/List' ? '--' : `${tx.price} ETH`}</span>
                                                <span>{timeAgo(tx.timestamp)}</span>
                                            </div>
                                        ))}
                                        {(!transactions || transactions.filter(t => t.nftId === selectedNft.id).length === 0) && (
                                            <div className="history-row" style={{ gridTemplateColumns: '1fr', textAlign: 'center', opacity: 0.5 }}>
                                                <span>No history found</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="comments-section mt-4">
                                    <h4>Community Comments</h4>
                                    <div className="comments-list">
                                        {(nftComments[selectedNft.id] || []).map(c => (
                                            <div key={c.id} className="comment-item glass-panel">
                                                <strong>{c.author}</strong> <span className="comment-date">{c.timestamp}</span>
                                                <p>{c.text}</p>
                                            </div>
                                        ))}
                                        {(!nftComments[selectedNft.id] || nftComments[selectedNft.id].length === 0) && (
                                            <p className="no-comments">No comments yet. Be the first!</p>
                                        )}
                                    </div>
                                    <div className="comment-input-row mt-2">
                                        <input
                                            type="text"
                                            placeholder="Write a comment..."
                                            value={newComment}
                                            onChange={(e) => setNewComment(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                                        />
                                        <button className="btn-primary small-btn" onClick={handleAddComment}>Post</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
