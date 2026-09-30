import { useState, useMemo } from 'react';
import {
  BadgeCheck,
  Copy,
  Settings,
  Image as ImageIcon,
  Heart,
  Tag,
  Clock,
  CheckCircle2,
  Plus,
  Wallet,
} from 'lucide-react';
import NFTCard from '../components/NFTCard';
import { useMarketplace } from '../context/MarketplaceContext';

interface ProfilePageProps {
  setCurrentPage: (page: string) => void;
  setSelectedNFT: (id: string) => void;
}

export default function ProfilePage({ setCurrentPage, setSelectedNFT }: ProfilePageProps) {
  const {
    user,
    walletConnected,
    setWalletModalOpen,
    nfts,
    likedIds,
    userActivities,
    setEditProfileOpen,
    addFunds,
    addToast,
  } = useMarketplace();

  const [activeTab, setActiveTab] = useState<'owned' | 'created' | 'favorited' | 'activity'>('owned');
  const [copied, setCopied] = useState(false);

  // Dynamic lists from real state
  const ownedNFTs = useMemo(() => {
    return nfts.filter((n) => n.owner.address === user.address);
  }, [nfts, user.address]);

  const createdNFTs = useMemo(() => {
    return nfts.filter((n) => n.creator.address === user.address);
  }, [nfts, user.address]);

  const favoritedNFTs = useMemo(() => {
    return nfts.filter((n) => likedIds.includes(n.id));
  }, [nfts, likedIds]);

  const totalPortfolioValue = useMemo(() => {
    return ownedNFTs.reduce((acc, curr) => acc + parseFloat(curr.price || '0'), 0).toFixed(2);
  }, [ownedNFTs]);

  if (!walletConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24 pb-16 px-4">
        <div className="glass rounded-3xl p-8 sm:p-12 text-center max-w-md w-full border border-white/10 shadow-2xl animate-slide-up">
          <div className="w-20 h-20 rounded-2xl bg-brand-500/20 border border-brand-500/30 flex items-center justify-center mx-auto mb-6">
            <Wallet className="w-10 h-10 text-brand-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Connect Your Wallet</h2>
          <p className="text-gray-400 text-sm mb-8 leading-relaxed">
            Connect your Web3 provider to inspect your collected NFTs, minting history, and live activity stream.
          </p>
          <button
            onClick={() => setWalletModalOpen(true)}
            className="btn-glow w-full py-4 bg-gradient-to-r from-brand-500 to-accent-500 hover:from-brand-400 hover:to-accent-400 text-white font-bold rounded-2xl shadow-xl transition-all cursor-pointer"
          >
            Connect Wallet
          </button>
        </div>
      </div>
    );
  }

  const handleCopyAddress = () => {
    navigator.clipboard?.writeText(user.address);
    setCopied(true);
    addToast('Address Copied', 'Wallet public address copied to clipboard', 'info');
    setTimeout(() => setCopied(false), 2000);
  };

  const tabs = [
    { key: 'owned', label: 'Collected', icon: ImageIcon, count: ownedNFTs.length },
    { key: 'created', label: 'Created', icon: Tag, count: createdNFTs.length },
    { key: 'favorited', label: 'Favorited', icon: Heart, count: favoritedNFTs.length },
    { key: 'activity', label: 'Activity', icon: Clock, count: userActivities.length },
  ];

  return (
    <div className="min-h-screen pt-20 pb-20">
      {/* Banner */}
      <div className="relative h-56 md:h-72 overflow-hidden bg-surface-900">
        <img
          src={user.banner}
          alt="Profile Banner"
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1600&q=80';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface-950 via-surface-950/40 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Info Header */}
        <div className="relative -mt-20 mb-10">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
            {/* Avatar & User Details */}
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5">
              <div className="relative">
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-surface-900 p-1.5 border-2 border-brand-500/50 shadow-2xl overflow-hidden">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-full h-full rounded-2xl object-cover bg-surface-800"
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-emerald-500 border-4 border-surface-950 flex items-center justify-center">
                  <BadgeCheck className="w-4 h-4 text-white" />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{user.name}</h1>
                  {user.verified && <BadgeCheck className="w-5 h-5 text-accent-400" />}
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="text-brand-300 font-mono font-bold">{user.handle}</span>
                  <span className="text-gray-600">•</span>
                  <button
                    onClick={handleCopyAddress}
                    className="flex items-center gap-1 font-mono text-gray-400 hover:text-white transition-colors cursor-pointer bg-white/5 px-2 py-0.5 rounded-lg border border-white/5"
                  >
                    <span>
                      {user.address.slice(0, 6)}...{user.address.slice(-4)}
                    </span>
                    {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>

                <p className="text-gray-300 text-xs sm:text-sm max-w-lg pt-1 leading-relaxed">
                  {user.bio}
                </p>
              </div>
            </div>

            {/* Header Action Buttons */}
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={() => addFunds(5.0)}
                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-xs font-bold transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+5 ETH Faucet</span>
              </button>

              <button
                onClick={() => setEditProfileOpen(true)}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4.5 py-2.5 bg-surface-900 hover:bg-white/10 border border-white/10 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Edit Profile</span>
              </button>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <div className="glass-light rounded-2xl p-4.5 border border-white/5">
              <span className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold block mb-1">
                Portfolio Value
              </span>
              <p className="text-xl sm:text-2xl font-extrabold text-white font-mono">
                {totalPortfolioValue} <span className="text-brand-400 text-xs font-sans">ETH</span>
              </p>
            </div>

            <div className="glass-light rounded-2xl p-4.5 border border-white/5">
              <span className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold block mb-1">
                Wallet Balance
              </span>
              <p className="text-xl sm:text-2xl font-extrabold text-emerald-400 font-mono">
                {user.balance.toFixed(3)} <span className="text-xs font-sans">ETH</span>
              </p>
            </div>

            <div className="glass-light rounded-2xl p-4.5 border border-white/5">
              <span className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold block mb-1">
                Collected NFTs
              </span>
              <p className="text-xl sm:text-2xl font-extrabold text-accent-400 font-mono">
                {ownedNFTs.length}
              </p>
            </div>

            <div className="glass-light rounded-2xl p-4.5 border border-white/5">
              <span className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold block mb-1">
                Minted Artworks
              </span>
              <p className="text-xl sm:text-2xl font-extrabold text-brand-400 font-mono">
                {createdNFTs.length}
              </p>
            </div>
          </div>
        </div>

        {/* Tabs Bar */}
        <div className="flex gap-2 bg-surface-900/90 rounded-2xl p-1.5 border border-white/10 mb-8 overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as typeof activeTab)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === tab.key
                  ? 'bg-gradient-to-r from-brand-500 to-accent-500 text-white shadow-lg shadow-brand-500/25'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
              <span
                className={`px-1.5 py-0.2 rounded-md text-[11px] font-mono ${
                  activeTab === tab.key ? 'bg-black/30 text-white' : 'bg-white/5 text-gray-400'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Tab Content Display */}
        {activeTab === 'owned' && (
          <div>
            {ownedNFTs.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in">
                {ownedNFTs.map((nft) => (
                  <NFTCard
                    key={nft.id}
                    nft={nft}
                    onClick={() => {
                      setSelectedNFT(nft.id);
                      setCurrentPage('nft-detail');
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="glass rounded-3xl p-16 text-center border border-white/10">
                <ImageIcon className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <h3 className="text-white font-bold text-lg mb-1">No Collected NFTs Yet</h3>
                <p className="text-gray-400 text-xs sm:text-sm mb-6 max-w-sm mx-auto">
                  Browse the marketplace to find extraordinary digital creations and expand your Web3 vault.
                </p>
                <button
                  onClick={() => setCurrentPage('explore')}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-brand-500 to-accent-500 text-white font-bold text-xs cursor-pointer shadow-lg"
                >
                  Explore Marketplace
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'created' && (
          <div>
            {createdNFTs.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in">
                {createdNFTs.map((nft) => (
                  <NFTCard
                    key={nft.id}
                    nft={nft}
                    onClick={() => {
                      setSelectedNFT(nft.id);
                      setCurrentPage('nft-detail');
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="glass rounded-3xl p-16 text-center border border-white/10">
                <Tag className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <h3 className="text-white font-bold text-lg mb-1">No Minted Creations Yet</h3>
                <p className="text-gray-400 text-xs sm:text-sm mb-6 max-w-sm mx-auto">
                  Upload your digital artwork, set your royalties, and mint your first official NFT token.
                </p>
                <button
                  onClick={() => setCurrentPage('create')}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-brand-500 to-accent-500 text-white font-bold text-xs cursor-pointer shadow-lg"
                >
                  Mint Artwork Now
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'favorited' && (
          <div>
            {favoritedNFTs.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in">
                {favoritedNFTs.map((nft) => (
                  <NFTCard
                    key={nft.id}
                    nft={nft}
                    onClick={() => {
                      setSelectedNFT(nft.id);
                      setCurrentPage('nft-detail');
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="glass rounded-3xl p-16 text-center border border-white/10">
                <Heart className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <h3 className="text-white font-bold text-lg mb-1">No Favorited Artworks</h3>
                <p className="text-gray-400 text-xs sm:text-sm mb-6 max-w-sm mx-auto">
                  Click the heart icon on any NFT card to save it to your curated favorites list.
                </p>
                <button
                  onClick={() => setCurrentPage('explore')}
                  className="px-6 py-3 rounded-xl bg-brand-500/20 text-brand-300 font-bold text-xs cursor-pointer"
                >
                  Browse Marketplace
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="glass rounded-3xl p-4 sm:p-6 border border-white/10 animate-fade-in">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-300 mb-4 px-2">
              On-Chain Activity Timeline
            </h3>
            {userActivities.length > 0 ? (
              <div className="space-y-3">
                {userActivities.map((act) => (
                  <div
                    key={act.id}
                    className="flex items-center gap-4 p-4 rounded-2xl bg-surface-900 border border-white/5 hover:border-white/10 transition-all"
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                        act.type === 'Purchased'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : act.type === 'Minted'
                          ? 'bg-accent-500/20 text-accent-400'
                          : act.type === 'Bid Placed'
                          ? 'bg-amber-500/20 text-amber-400'
                          : 'bg-brand-500/20 text-brand-400'
                      }`}
                    >
                      {act.type === 'Purchased' ? 'BUY' : act.type === 'Minted' ? 'MINT' : 'BID'}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-white font-bold text-sm truncate">{act.item}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <span>{act.type}</span>
                        <span>•</span>
                        <span className="font-mono text-[11px] text-gray-500">{act.txHash}</span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      {act.price && (
                        <p className="text-white font-mono font-bold text-sm">{act.price}</p>
                      )}
                      <p className="text-gray-500 text-xs">{act.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center text-gray-400 text-xs">
                No recent transactions recorded on this profile.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
