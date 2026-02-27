import React from 'react';
import { Trophy, TrendingUp } from 'lucide-react';
import './Leaderboard.css';

const Leaderboard = () => {
    const topTraders = [
        { id: 1, address: '0x1234...5678', volume: '145.2', nfts: 42, type: 'Whale' },
        { id: 2, address: '0xabcd...ef01', volume: '89.5', nfts: 15, type: 'Collector' },
        { id: 3, address: '0x9999...8888', volume: '45.1', nfts: 8, type: 'Rising Star' },
        { id: 4, address: '0x4444...3333', volume: '12.4', nfts: 12, type: 'Creator' },
        { id: 5, address: '0x8765...4321', volume: '5.8', nfts: 3, type: 'Newcomer' },
    ];

    return (
        <div className="leaderboard-container animate-fade-in">
            <div className="leaderboard-header">
                <h1 className="gradient-text">Top Collectors & Traders</h1>
                <p className="subtitle">Discover the most active members of our community</p>
            </div>

            <div className="leaderboard-stats mb-4">
                <div className="analytics-card glass-panel" style={{ flex: 1 }}>
                    <div className="analytics-icon"><Trophy size={24} color="#eab308" /></div>
                    <div className="analytics-info">
                        <span className="label">Total Traders</span>
                        <span className="value">1,234</span>
                    </div>
                </div>
                <div className="analytics-card glass-panel" style={{ flex: 1 }}>
                    <div className="analytics-icon"><TrendingUp size={24} color="#10b981" /></div>
                    <div className="analytics-info">
                        <span className="label">24h Vol</span>
                        <span className="value">45.2 ETH</span>
                    </div>
                </div>
            </div>

            <div className="leaderboard-content glass-panel">
                <div className="table-wrapper">
                    <table className="leaderboard-table">
                        <thead>
                            <tr>
                                <th>Rank</th>
                                <th>Trader</th>
                                <th>Badge</th>
                                <th>NFTs Owned</th>
                                <th>Total Volume (ETH)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {topTraders.map((trader, index) => (
                                <tr key={trader.id} className={index < 3 ? 'top-three' : ''}>
                                    <td>
                                        <div className="rank-badge">
                                            {index === 0 ? <Trophy size={16} color="#eab308" /> :
                                                index === 1 ? <Trophy size={16} color="#94a3b8" /> :
                                                    index === 2 ? <Trophy size={16} color="#b45309" /> :
                                                        `#${index + 1}`}
                                        </div>
                                    </td>
                                    <td>
                                        <span className="address-pill">{trader.address}</span>
                                    </td>
                                    <td>
                                        <span className={`type-badge ${trader.type.toLowerCase().replace(' ', '-')}`}>
                                            {trader.type}
                                        </span>
                                    </td>
                                    <td>{trader.nfts}</td>
                                    <td className="volume-cell">
                                        <span className="eth-icon">⟠</span> {trader.volume}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Leaderboard;
