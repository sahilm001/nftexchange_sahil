import React, { useState, useEffect } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import Sell from './components/Sell';
import Toast from './components/Toast';
import AuthPage from './components/AuthPage';
import About from './components/About';
import Contact from './components/Contact';
import NotFound from './components/NotFound';
import Footer from './components/Footer';
import AdminPanel from './components/AdminPanel';
import Leaderboard from './components/Leaderboard';
import ResetPassword from './components/ResetPassword';
import { supabase } from './supabaseClient';
import { DUMMY_NFTS, USER_PROFILE } from './dummyData';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');
  const [walletConnected, setWalletConnected] = useState(false);
  const [userAddress, setUserAddress] = useState('');
  const [nfts, setNfts] = useState(() => {
    const saved = localStorage.getItem('nft_data');
    return saved ? JSON.parse(saved) : DUMMY_NFTS;
  });
  const [userProfile, setUserProfile] = useState(() => {
    const today = new Date().toDateString();
    let profile = { ...USER_PROFILE, fullName: '', email: '', phone: '', dob: '', avatarUrl: '', balance: '100.00', lastResetDate: today };
    const saved = localStorage.getItem('nft_user_profile');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        profile = { ...profile, ...parsed };
        if (!parsed.lastResetDate) {
          profile.lastResetDate = 'needs_reset';
        }
      } catch (e) {
        console.error('Failed to parse profile data', e);
      }
    }
    return profile;
  });
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('nft_transactions');
    return saved ? JSON.parse(saved) : [];
  });
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [theme, setTheme] = useState(() => localStorage.getItem('nft_theme') || 'dark');

  // Apply theme class to body
  useEffect(() => {
    document.body.className = theme === 'light' ? 'light-mode' : '';
    localStorage.setItem('nft_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Daily reset check
  useEffect(() => {
    const today = new Date().toDateString();
    if (userProfile && userProfile.lastResetDate !== today) {
      const updatedProfile = {
        ...userProfile,
        balance: '100.00',
        lastResetDate: today
      };
      setUserProfile(updatedProfile);
      localStorage.setItem('nft_user_profile', JSON.stringify(updatedProfile));
      showToast('Daily reset: Your balance has been restored to 100 ETH!', 'success');
    }
  }, [userProfile]);

  const addTransaction = (type, nft, price, from, to) => {
    const newTx = {
      id: Date.now().toString() + Math.random().toString(36).substring(7),
      type,
      nftId: nft.id,
      nftName: nft.name,
      price,
      from,
      to,
      timestamp: new Date().toISOString()
    };
    const updatedTx = [newTx, ...transactions];
    setTransactions(updatedTx);
    localStorage.setItem('nft_transactions', JSON.stringify(updatedTx));
  };

  // Initialize Auth session from Supabase
  useEffect(() => {
    // Check if we are in a password recovery flow before initializing the regular session
    const hash = window.location.hash;
    // Also check standard query parameters in case the router changed it
    const searchParams = new URLSearchParams(window.location.search);
    if (hash & hash.includes('type=recovery') || searchParams.get('type') === 'recovery') {
      setCurrentView('reset-password');
    }

    const initSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setIsAuthenticated(true);
        setUserAddress(session.user.id);
        const adminSession = localStorage.getItem('nft_admin');
        if (adminSession === 'true') setIsAdmin(true);
      }
    };
    initSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session) {
          setIsAuthenticated(true);
          setUserAddress(session.user.id);
        } else {
          setIsAuthenticated(false);
          setUserAddress('');
          setIsAdmin(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
  };

  const updateUserProfile = (newData) => {
    const updated = { ...userProfile, ...newData };
    setUserProfile(updated);
    localStorage.setItem('nft_user_profile', JSON.stringify(updated));
    showToast('Profile updated successfully!', 'success');
  };

  const handleLogin = (email, adminFlag = false) => {
    // Supabase handles isAuthenticated and userAddress via onAuthStateChange
    setIsAdmin(adminFlag);
    if (adminFlag) localStorage.setItem('nft_admin', 'true');

    setToast({ show: true, message: adminFlag ? 'Logged in as Admin successfully!' : 'Logged in successfully!', type: 'success' });
    setCurrentView(adminFlag ? 'admin' : 'dashboard');
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    setIsAdmin(false);
    setUserAddress('');
    setWalletConnected(false);
    localStorage.removeItem('nft_session');
    localStorage.removeItem('nft_admin');
    setToast({ show: true, message: 'Logged out successfully', type: 'success' });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  const connectWallet = async (shouldConnect) => {
    if (!shouldConnect) {
      setWalletConnected(false);
      setUserAddress('');
      showToast('Wallet disconnected', 'success');
      return;
    }

    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        if (accounts.length > 0) {
          setUserAddress(accounts[0]);
          setUserProfile({ ...userProfile, address: accounts[0] });
          setWalletConnected(true);
          showToast('MetaMask connected successfully!', 'success');
        }
      } catch (error) {
        showToast(error.message || 'Connection request failed', 'error');
      }
    } else {
      setUserAddress(USER_PROFILE.address);
      setWalletConnected(true);
      showToast('MetaMask not found. Using dummy connection.', 'success');
    }
  };

  const buyNft = (nft) => {
    if (!walletConnected) {
      showToast('Please connect your wallet first!', 'error');
      return;
    }

    const priceNum = parseFloat(nft.price);
    const balanceNum = parseFloat(userProfile.balance);

    if (balanceNum < priceNum) {
      showToast('Insufficient funds!', 'error');
      return;
    }

    const previouslyOwned = nfts.filter(n => n.owner === userAddress).length;
    const previouslyBought = nfts.filter(n => n.owner === userAddress && n.seller !== userAddress).length;

    const updatedNfts = nfts.map(item => {
      if (item.id === nft.id) {
        return { ...item, owner: userAddress, isListed: false };
      }
      return item;
    });

    setNfts(updatedNfts);
    localStorage.setItem('nft_data', JSON.stringify(updatedNfts));
    setUserProfile({
      ...userProfile,
      balance: (balanceNum - priceNum).toFixed(2)
    });

    addTransaction('Buy', nft, nft.price, nft.owner, userAddress);

    showToast(`Successfully purchased ${nft.name}!`, 'success');

    if (previouslyBought === 0) {
      setTimeout(() => showToast('🏆 Achievement Unlocked: First NFT Bought!', 'success'), 3500);
    }
    if (previouslyOwned === 4) {
      setTimeout(() => showToast('🏆 Achievement Unlocked: 5 NFTs Collected! Whale Status!', 'success'), 4000);
    }
    setCurrentView('profile');
  };

  const addNft = (newNft) => {
    if (!walletConnected) {
      showToast('Please connect your wallet to list an NFT!', 'error');
      return;
    }
    const previouslyMinted = nfts.filter(n => n.seller === userAddress).length;

    const updatedNfts = [...nfts, newNft];
    setNfts(updatedNfts);
    localStorage.setItem('nft_data', JSON.stringify(updatedNfts));
    addTransaction('Mint/List', newNft, newNft.price, userAddress, null);
    showToast('NFT successfully minted and listed!', 'success');

    if (previouslyMinted === 0) {
      setTimeout(() => showToast('⭐ Achievement Unlocked: First NFT Minted!', 'success'), 3500);
    }
    setCurrentView('profile');
  };

  // Protected Route Logic
  if (currentView === 'reset-password') {
    return (
      <div className="app-container">
        <ResetPassword showToast={showToast} setCurrentView={setCurrentView} />
        {toast.show && (
          <Toast message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, show: false })} />
        )}
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="app-container">
        <AuthPage onLogin={handleLogin} showToast={showToast} />
        {toast.show && (
          <Toast message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, show: false })} />
        )}
      </div>
    );
  }

  return (
    <div className="app-container">
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        walletConnected={walletConnected}
        connectWallet={connectWallet}
        userAddress={userAddress}
        userProfile={userProfile}
        handleLogout={handleLogout}
        theme={theme}
        toggleTheme={toggleTheme}
        isAdmin={isAdmin}
      />

      <main className="main-content">
        {currentView === 'dashboard' && <Dashboard nfts={nfts} buyNft={buyNft} userAddress={userAddress} showToast={showToast} userProfile={userProfile} transactions={transactions} />}
        {currentView === 'profile' && <Profile nfts={nfts} userAddress={userAddress} userProfile={userProfile} updateUserProfile={updateUserProfile} showToast={showToast} transactions={transactions} />}
        {currentView === 'sell' && <Sell nfts={nfts} addNft={addNft} userAddress={userAddress} showToast={showToast} />}
        {currentView === 'about' && <About />}
        {currentView === 'contact' && <Contact showToast={showToast} />}
        {currentView === 'leaderboard' && <Leaderboard />}
        {currentView === 'admin' && isAdmin && <AdminPanel nfts={nfts} showToast={showToast} />}
        {currentView === 'admin' && !isAdmin && <NotFound setCurrentView={setCurrentView} />}
        {!['dashboard', 'profile', 'sell', 'about', 'contact', 'admin', 'leaderboard'].includes(currentView) && <NotFound setCurrentView={setCurrentView} />}
      </main>

      <Footer setCurrentView={setCurrentView} />

      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}
    </div>
  );
}

export default App;