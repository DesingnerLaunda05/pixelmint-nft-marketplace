import { useState, useRef, useEffect } from 'react';
import { Search, Menu, X, Wallet, ChevronDown, User, LogOut, Plus, Sparkles, Hexagon, RotateCcw } from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';
import { SupportedNetwork } from '../types';

interface NavbarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  setSelectedNFT: (id: string) => void;
}

export default function Navbar({
  currentPage,
  setCurrentPage,
  searchQuery,
  setSearchQuery,
  setSelectedNFT,
}: NavbarProps) {
  const {
    user,
    walletConnected,
    setWalletModalOpen,
    disconnectWallet,
    activeNetwork,
    switchNetwork,
    addFunds,
    nfts,
    resetAllDemoData,
  } = useMarketplace();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const [networkDropdown, setNetworkDropdown] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Close search dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { name: 'Home', page: 'home' },
    { name: 'Explore', page: 'explore' },
    { name: 'Collections', page: 'collections' },
    { name: 'Create', page: 'create' },
  ];

  const networks: SupportedNetwork[] = ['Ethereum', 'Polygon', 'Arbitrum', 'Solana'];

  // Instant matching search results
  const searchResults = searchQuery.trim()
    ? nfts
        .filter(
          (n) =>
            n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            n.creator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            n.category.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 5)
    : [];

  const handleSelectSearchResult = (id: string) => {
    setSelectedNFT(id);
    setCurrentPage('nft-detail');
    setSearchFocused(false);
    setSearchQuery('');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 sm:h-20">
          {/* Logo */}
          <button
            onClick={() => setCurrentPage('home')}
            className="flex items-center gap-2.5 group cursor-pointer shrink-0"
          >
            <div className="relative">
              <Hexagon className="w-9 h-9 text-brand-500 group-hover:text-brand-400 transition-colors drop-shadow-[0_0_12px_rgba(108,60,255,0.6)]" fill="currentColor" />
              <Hexagon className="w-9 h-9 text-accent-400 absolute inset-0 opacity-0 group-hover:opacity-60 transition-opacity" />
              <Sparkles className="w-4 h-4 text-white absolute inset-0 m-auto animate-pulse" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xl font-extrabold tracking-tight gradient-text">PixelMint</span>
              <span className="text-[10px] font-mono tracking-widest text-accent-400 uppercase -mt-1 hidden sm:block">Marketplace</span>
            </div>
          </button>

          {/* Search Bar - Desktop with Live Dropdown Preview */}
          <div ref={searchContainerRef} className="hidden md:flex flex-1 max-w-md mx-6 relative">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search NFTs, collections, creators..."
                value={searchQuery}
                onFocus={() => setSearchFocused(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSearchFocused(true);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setCurrentPage('explore');
                    setSearchFocused(false);
                  }
                }}
                className="w-full pl-10 pr-10 py-2.5 bg-surface-900/90 border border-white/10 rounded-2xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white p-1 rounded-full cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Live Search Suggestions Dropdown */}
            {searchFocused && searchQuery.trim() && (
              <div className="absolute top-full left-0 right-0 mt-2 glass rounded-2xl border border-white/10 shadow-2xl p-2 z-50 animate-slide-up">
                <div className="px-3 py-1.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider flex justify-between">
                  <span>NFTs Found</span>
                  <span>Press Enter for all</span>
                </div>
                {searchResults.length > 0 ? (
                  <div className="space-y-1">
                    {searchResults.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => handleSelectSearchResult(item.id)}
                        className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
                      >
                        <img src={item.image} alt={item.title} className="w-10 h-10 rounded-lg object-cover" />
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-xs font-bold truncate">{item.title}</p>
                          <p className="text-gray-400 text-[11px] truncate">by {item.creator.name}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-brand-400 font-mono text-xs font-bold">{item.price} ETH</span>
                        </div>
                      </div>
                    ))}
                    <button
                      onClick={() => {
                        setCurrentPage('explore');
                        setSearchFocused(false);
                      }}
                      className="w-full mt-1 py-2 text-center text-xs font-semibold text-accent-400 hover:text-accent-300 rounded-lg hover:bg-white/5 cursor-pointer"
                    >
                      View all results in Explore →
                    </button>
                  </div>
                ) : (
                  <div className="py-4 text-center text-xs text-gray-400">
                    No results for "{searchQuery}". Press Enter to search explore.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Navigation Links - Desktop */}
          <div className="hidden lg:flex items-center gap-1.5">
            {navLinks.map((link) => (
              <button
                key={link.page}
                onClick={() => setCurrentPage(link.page)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                  currentPage === link.page
                    ? 'text-white bg-brand-500/20 border border-brand-500/40 shadow-[0_0_15px_rgba(108,60,255,0.3)]'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.name}
              </button>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Network Selector */}
            <div className="relative hidden sm:block">
              <button
                onClick={() => setNetworkDropdown(!networkDropdown)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-900/80 border border-white/10 hover:border-white/20 text-xs font-medium text-gray-300 transition-all cursor-pointer"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>{activeNetwork}</span>
                <ChevronDown className="w-3 h-3 text-gray-400" />
              </button>
              {networkDropdown && (
                <div className="absolute right-0 mt-2 w-40 glass rounded-2xl border border-white/10 py-1.5 shadow-2xl z-50 animate-slide-up">
                  {networks.map((net) => (
                    <button
                      key={net}
                      onClick={() => {
                        switchNetwork(net);
                        setNetworkDropdown(false);
                      }}
                      className={`w-full flex items-center justify-between px-3.5 py-2 text-xs text-left cursor-pointer transition-colors ${
                        activeNetwork === net ? 'text-brand-400 font-bold bg-brand-500/10' : 'text-gray-300 hover:bg-white/5'
                      }`}
                    >
                      <span>{net}</span>
                      {activeNetwork === net && <span className="w-1.5 h-1.5 rounded-full bg-brand-400" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Wallet State */}
            {walletConnected ? (
              <div className="flex items-center gap-1.5 sm:gap-2">
                {/* Balance Pill with Faucet Button */}
                <div className="hidden md:flex items-center gap-1.5 pl-3 pr-1 py-1 rounded-xl bg-surface-900 border border-white/10 text-xs font-mono">
                  <span className="text-white font-bold">{user.balance.toFixed(2)}</span>
                  <span className="text-brand-400 font-semibold">ETH</span>
                  <button
                    onClick={() => addFunds(5.0)}
                    title="Claim 5 test ETH from Faucet"
                    className="p-1 rounded-lg bg-brand-500/20 hover:bg-brand-500/40 text-brand-300 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>

                {/* Profile Pill & Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setProfileDropdown(!profileDropdown)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-2xl glass-light border border-white/10 hover:border-brand-500/30 transition-all cursor-pointer"
                  >
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-7 h-7 rounded-xl object-cover border border-brand-400/40"
                    />
                    <span className="hidden sm:block text-xs font-mono font-semibold text-gray-200">
                      {user.address.slice(0, 6)}...{user.address.slice(-4)}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                  </button>

                  {profileDropdown && (
                    <div className="absolute right-0 mt-2 w-64 glass rounded-2xl border border-white/10 py-2 shadow-2xl z-50 animate-slide-up">
                      <div className="px-4 py-3 border-b border-white/10">
                        <p className="text-white font-bold text-sm truncate">{user.name}</p>
                        <p className="text-gray-400 text-xs font-mono truncate">{user.handle}</p>
                        <div className="mt-2 flex items-center justify-between text-xs text-gray-300 bg-white/5 p-2 rounded-xl">
                          <span>Balance:</span>
                          <span className="font-mono font-bold text-white">{user.balance.toFixed(3)} ETH</span>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setCurrentPage('profile');
                          setProfileDropdown(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
                      >
                        <User className="w-4 h-4 text-brand-400" /> My Profile & Inventory
                      </button>

                      <button
                        onClick={() => {
                          setCurrentPage('create');
                          setProfileDropdown(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
                      >
                        <Sparkles className="w-4 h-4 text-accent-400" /> Mint New NFT
                      </button>

                      <button
                        onClick={() => {
                          addFunds(5.0);
                          setProfileDropdown(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-emerald-400 hover:bg-white/5 transition-all cursor-pointer"
                      >
                        <Plus className="w-4 h-4" /> Claim Test Faucet (+5 ETH)
                      </button>

                      <button
                        onClick={() => {
                          resetAllDemoData();
                          setProfileDropdown(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-xs text-gray-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" /> Reset Marketplace Data
                      </button>

                      <hr className="my-1 border-white/10" />

                      <button
                        onClick={() => {
                          disconnectWallet();
                          setProfileDropdown(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-rose-400 hover:bg-white/5 transition-all cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" /> Disconnect Wallet
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <button
                onClick={() => setWalletModalOpen(true)}
                className="btn-glow flex items-center gap-2 px-4.5 py-2.5 bg-gradient-to-r from-brand-500 to-accent-500 hover:from-brand-400 hover:to-accent-400 text-white text-xs sm:text-sm font-bold rounded-2xl shadow-lg shadow-brand-500/25 transition-all cursor-pointer"
              >
                <Wallet className="w-4 h-4" />
                <span>Connect Wallet</span>
              </button>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-gray-400 hover:text-white transition-colors cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-white/10 space-y-3 animate-slide-up">
            {/* Search in mobile */}
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search NFTs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setCurrentPage('explore');
                    setMobileMenuOpen(false);
                  }
                }}
                className="w-full pl-10 pr-4 py-2.5 bg-surface-900 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-brand-500"
              />
            </div>

            {/* Links */}
            <div className="grid grid-cols-2 gap-2 pt-2">
              {navLinks.map((link) => (
                <button
                  key={link.page}
                  onClick={() => {
                    setCurrentPage(link.page);
                    setMobileMenuOpen(false);
                  }}
                  className={`px-4 py-2.5 rounded-xl text-sm font-semibold text-left transition-all cursor-pointer ${
                    currentPage === link.page
                      ? 'bg-brand-500/20 text-brand-300 border border-brand-500/30'
                      : 'text-gray-300 hover:bg-white/5'
                  }`}
                >
                  {link.name}
                </button>
              ))}
            </div>

            {walletConnected && (
              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
                <span className="text-gray-400">Balance: <strong className="text-white font-mono">{user.balance.toFixed(2)} ETH</strong></span>
                <button
                  onClick={() => addFunds(5.0)}
                  className="px-2.5 py-1 rounded-lg bg-brand-500/20 text-brand-300 font-semibold"
                >
                  +5 ETH Faucet
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
