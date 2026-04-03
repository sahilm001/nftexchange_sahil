import React, { useState, useEffect, useRef } from 'react';
import { Wallet, Store, User, PlusCircle, Menu, X, LogOut, Sun, Moon, Bell, Shield, Trophy, Flame } from 'lucide-react';
import './Navbar.css';

const Navbar = ({ currentView, setCurrentView, walletConnected, connectWallet, userAddress, userProfile, handleLogout, theme, toggleTheme, isAdmin }) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [unreadCount, setUnreadCount] = useState(2);
    const dropdownRef = useRef(null);

    // Handle click outside to close the dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Auto-close dropdown after 4 seconds
    useEffect(() => {
        let timeoutId;
        if (showNotifications) {
            timeoutId = setTimeout(() => {
                setShowNotifications(false);
            }, 4000);
        }
        return () => {
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, [showNotifications]);

    const handleBellClick = () => {
        setShowNotifications(!showNotifications);
        if (unreadCount > 0) {
            setUnreadCount(0); // clear count when opening
        }
    };

    const dummyNotifications = [
        { id: 1, text: "Your NFT sold!", time: "2m ago" },
        { id: 2, text: "New drop live", time: "1h ago" }
    ];

    const displayAddress = userAddress.length > 12
        ? `${userAddress.substring(0, 6)}...${userAddress.substring(userAddress.length - 4)}`
        : userAddress;

    const closeMenuAndNav = (view) => {
        setCurrentView(view);
        setMobileMenuOpen(false);
    };

    return (
        <React.Fragment>
            <div className="announcement-banner" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', background: 'linear-gradient(90deg, #8b5cf6, #3b82f6)', color: 'white', padding: '0.6rem', fontSize: '0.9rem', fontWeight: 'bold' }}>
                <Flame size={18} />
                <span>NEW DROP: The "Cosmic Legacy" collection goes live in 24 hours! GET READY!</span>
                <Flame size={18} />
            </div>
            <nav className="navbar glass-panel">
                <div className="nav-brand" onClick={() => closeMenuAndNav('dashboard')}>
                    <span className="gradient-text gradient-logo">NFT Galaxy</span>
                </div>

                <div className={`nav-links ${mobileMenuOpen ? 'mobile-open' : ''}`}>
                    <button
                        className={`nav-link ${currentView === 'dashboard' ? 'active' : ''}`}
                        onClick={() => closeMenuAndNav('dashboard')}
                    >
                        <Store size={18} />
                        <span>Market</span>
                    </button>
                    <button
                        className={`nav-link ${currentView === 'sell' ? 'active' : ''}`}
                        onClick={() => closeMenuAndNav('sell')}
                    >
                        <PlusCircle size={18} />
                        <span>Create</span>
                    </button>
                    <button
                        className={`nav-link ${currentView === 'profile' ? 'active' : ''}`}
                        onClick={() => closeMenuAndNav('profile')}
                    >
                        {userProfile?.avatarUrl ? (
                            <img src={userProfile.avatarUrl} alt="Avatar" className="nav-avatar" />
                        ) : (
                            <User size={18} />
                        )}
                        <span>Profile</span>
                    </button>
                    <button
                        className={`nav-link ${currentView === 'leaderboard' ? 'active' : ''}`}
                        onClick={() => closeMenuAndNav('leaderboard')}
                    >
                        <Trophy size={18} />
                        <span>Top Traders</span>
                    </button>
                    {isAdmin && (
                        <button
                            className={`nav-link ${currentView === 'admin' ? 'active' : ''}`}
                            onClick={() => closeMenuAndNav('admin')}
                        >
                            <Shield size={18} />
                            <span>Admin</span>
                        </button>
                    )}
                </div>

                <div className="nav-actions">
                    <button className="btn-icon theme-toggle" onClick={toggleTheme} title="Toggle Theme">
                        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                    </button>

                    <div className="notifications-wrapper" ref={dropdownRef}>
                        <button className="btn-icon bell-btn" onClick={handleBellClick} title="Notifications">
                            <Bell size={20} />
                            {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
                        </button>
                        {showNotifications && (
                            <div className="notifications-dropdown glass-panel dropdown-animate">
                                <h4>Notifications</h4>
                                {dummyNotifications.length > 0 ? dummyNotifications.map(n => (
                                    <div key={n.id} className="notification-item">
                                        <p>{n.text}</p>
                                        <small>{n.time}</small>
                                    </div>
                                )) : (
                                    <div className="notification-empty">No new notifications</div>
                                )}
                            </div>
                        )}
                    </div>

                    {walletConnected ? (
                        <button className="btn-secondary wallet-btn" onClick={() => connectWallet(false)}>
                            <Wallet size={18} className="wallet-icon connected" />
                            <span>{displayAddress}</span>
                        </button>
                    ) : (
                        <button className="btn-primary" onClick={() => connectWallet(true)}>
                            Connect Wallet
                        </button>
                    )}

                    <button className="btn-secondary logout-btn" onClick={handleLogout} title="Log Out">
                        <LogOut size={18} />
                        <span className="logout-text">Log Out</span>
                    </button>

                    <button className="hamburger-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </nav>
        </React.Fragment>
    );
};

export default Navbar;
