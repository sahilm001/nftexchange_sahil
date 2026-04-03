import React, { useState, useEffect } from 'react';
import { Trophy, TrendingUp, Users, Activity, Loader2 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { supabase } from '../supabaseClient';
import './Leaderboard.css';

const Leaderboard = () => {
    const [transactions, setTransactions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTxs = async () => {
            const { data, error } = await supabase.from('nft_transactions').select('*').order('timestamp', { ascending: true });
            if (data) {
                setTransactions(data);
            } else if (error) {
                console.error("Error fetching analytics:", error);
            }
            setIsLoading(false);
        };
        fetchTxs();
    }, []);

    // 1. Process Chart Data (Volume over time)
    const chartData = transactions.reduce((acc, tx) => {
        const price = parseFloat(tx.price) || 0;
        const date = new Date(tx.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' });
        
        const existing = acc.find(item => item.date === date);
        if (existing) {
            existing.volume += price;
        } else {
            // Keep a running total or just daily volume? Let's do Daily Volume to show spikes.
            acc.push({ date, volume: price });
        }
        return acc;
    }, []);

    // Ensure chart has at least some skeleton if empty to look good
    const displayChart = chartData.length > 0 ? chartData : [
        { date: 'Mon', volume: 0 }, { date: 'Tue', volume: 0 }, { date: 'Wed', volume: 0 }
    ];

    // 2. Process Traders and Global Stats
    const tradersMap = {};
    let totalVolume = 0;

    transactions.forEach(tx => {
        const price = parseFloat(tx.price) || 0;
        totalVolume += price;

        // Tally buying activity
        if (tx.to_address) {
            if (!tradersMap[tx.to_address]) tradersMap[tx.to_address] = { volume: 0, nfts: 0 };
            tradersMap[tx.to_address].volume += price;
            tradersMap[tx.to_address].nfts += 1;
        }
        // Tally selling activity
        if (tx.from_address && tx.from_address !== 'System') {
            if (!tradersMap[tx.from_address]) tradersMap[tx.from_address] = { volume: 0, nfts: 0 };
            tradersMap[tx.from_address].volume += price; // Sellers also generate market volume
        }
    });

    const totalTradersCount = Object.keys(tradersMap).length;

    const topTraders = Object.keys(tradersMap)
        .map(address => {
            const vol = tradersMap[address].volume;
            const nftsCount = tradersMap[address].nfts;
            return {
                id: address,
                address: address.length > 15 ? `${address.substring(0,6)}...${address.substring(address.length-4)}` : address,
                volume: vol.toFixed(2),
                nfts: nftsCount,
                type: vol > 10 ? 'Whale' : nftsCount > 2 ? 'Collector' : 'Newcomer'
            };
        })
        .sort((a, b) => parseFloat(b.volume) - parseFloat(a.volume))
        .slice(0, 5); // Top 5

    return (
        <div className="leaderboard-container animate-fade-in">
            <div className="leaderboard-header">
                <h1 className="gradient-text">Live Market Analytics</h1>
                <p className="subtitle">Real-time statistics directly from the Supabase Ledger</p>
            </div>

            {isLoading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
                    <Loader2 size={40} className="spin-animation" color="var(--accent-primary)" />
                </div>
            ) : (
                <>
                    <div className="leaderboard-stats mb-4">
                        <div className="analytics-card glass-panel" style={{ flex: 1 }}>
                            <div className="analytics-icon"><Activity size={24} color="#eab308" /></div>
                            <div className="analytics-info">
                                <span className="label">Total Transactions</span>
                                <span className="value">{transactions.length}</span>
                            </div>
                        </div>
                        <div className="analytics-card glass-panel" style={{ flex: 1 }}>
                            <div className="analytics-icon"><TrendingUp size={24} color="#10b981" /></div>
                            <div className="analytics-info">
                                <span className="label">Total Market Volume</span>
                                <span className="value">{totalVolume.toFixed(2)} ETH</span>
                            </div>
                        </div>
                        <div className="analytics-card glass-panel" style={{ flex: 1 }}>
                            <div className="analytics-icon"><Users size={24} color="#6366f1" /></div>
                            <div className="analytics-info">
                                <span className="label">Active Traders</span>
                                <span className="value">{totalTradersCount}</span>
                            </div>
                        </div>
                    </div>

                    <div className="chart-container glass-panel mb-4" style={{ padding: '2rem', height: '350px' }}>
                        <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <TrendingUp size={20} color="var(--accent-primary)" /> 
                            Volume Over Time
                        </h3>
                        <ResponsiveContainer width="100%" height="85%">
                            <AreaChart data={displayChart} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                                <XAxis dataKey="date" stroke="rgba(255,255,255,0.5)" tick={{fill: 'rgba(255,255,255,0.5)'}} />
                                <YAxis stroke="rgba(255,255,255,0.5)" tick={{fill: 'rgba(255,255,255,0.5)'}} />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: 'rgba(10, 10, 15, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                                    itemStyle={{ color: '#c4b5fd' }}
                                />
                                <Area type="monotone" dataKey="volume" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorVolume)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="leaderboard-content glass-panel">
                        <div className="table-wrapper">
                            <table className="leaderboard-table">
                                <thead>
                                    <tr>
                                        <th>Rank</th>
                                        <th>Trader</th>
                                        <th>Status</th>
                                        <th>NFTs Acquired</th>
                                        <th>Total Volume (ETH)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {topTraders.length > 0 ? topTraders.map((trader, index) => (
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
                                    )) : (
                                        <tr>
                                            <td colSpan="5" style={{ textAlign: 'center', opacity: 0.5, padding: '3rem' }}>
                                                No trading data available yet. Start buying NFTs!
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Leaderboard;
