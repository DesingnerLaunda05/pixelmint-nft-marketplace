import { useState } from 'react';
import {
  ArrowLeft,
  Heart,
  Share2,
  ExternalLink,
  BadgeCheck,
  Clock,
  Tag,
  History,
  Eye,
  RefreshCcw,
  Sparkles,
  Zap,
  Check,
  Copy,
} from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';

interface NFTDetailPageProps {
  nftId: string;
  setCurrentPage: (page: string) => void;
  setSelectedNFT: (id: string) => void;
}

export default function NFTDetailPage({ nftId, setCurrentPage, setSelectedNFT }: NFTDetailPageProps) {
  const {
    nfts,
    likedIds,
    toggleLike,
    setBuyModalNFT,
    setBidModalNFT,
    setOfferModalNFT,
    addToast,
    user,
  } = useMarketplace();

  const nft = nfts.find((n) => n.id === nftId);
  const [activeTab, setActiveTab] = useState<'details' | 'history' | 'bids'>('details');
  const [copiedToken, setCopiedToken] = useState(false);

  if (!nft) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24 pb-16 px-4">
        <div className="glass rounded-3xl p-10 text-center max-w-md border border-white/10 shadow-2xl animate-fade-in">
          <h2 className="text-2xl font-bold text-white mb-2">Artwork Not Found</h2>
          <p className="text-gray-400 text-sm mb-6">
            The requested NFT may have been burned or removed from the marketplace.
          </p>
          <button
            onClick={() => setCurrentPage('explore')}
            className="btn-glow px-6 py-3 bg-gradient-to-r from-brand-500 to-accent-500 text-white font-bold text-sm rounded-xl cursor-pointer"
          >
            Back to Explore
          </button>
        </div>
      </div>
    );
  }

  const isLiked = likedIds.includes(nft.id);
  const priceNum = parseFloat(nft.isAuction ? nft.highestBid || nft.price : nft.price);
  const ethToUsd = 3450;
  const isOwner = nft.owner.address === user.address;

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    addToast('Link Copied', 'Direct link to this NFT has been copied to your clipboard!', 'info');
  };

  const handleCopyContract = () => {
    navigator.clipboard?.writeText('0x71C...b41');
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2000);
    addToast('Copied Address', 'Smart contract address copied to clipboard', 'info');
  };

  const relatedNFTs = nfts.filter((n) => n.id !== nft.id && n.category === nft.category).slice(0, 4);

  return (
    <div className="min-h-screen pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Navigation Button */}
        <button
          onClick={() => setCurrentPage('explore')}
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-semibold">Back to Marketplace</span>
        </button>

        <div className="grid lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Artwork Presentation */}
          <div className="lg:col-span-6">
            <div className="gradient-border sticky top-28 shadow-2xl">
              <div className="p-4">
                <div className="relative rounded-2xl overflow-hidden aspect-square bg-surface-900">
                  <img
                    src={nft.image}
                    alt={nft.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80';
                    }}
                  />
                  {nft.isAuction && (
                    <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-accent-400/40 text-xs font-bold text-accent-300">
                      <Clock className="w-3.5 h-3.5 animate-spin-slow" />
                      <span>Live Auction</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Information, Pricing, Tabs */}
          <div className="lg:col-span-6 space-y-6">
            {/* Header / Social Badges */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-3.5 py-1 rounded-full bg-brand-500/20 border border-brand-500/30 text-brand-300 text-xs font-bold tracking-wide">
                  {nft.category}
                </span>
                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300 text-xs font-mono font-medium">
                  {nft.network || 'Ethereum'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleLike(nft.id)}
                  title="Favorite NFT"
                  className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                    isLiked
                      ? 'bg-rose-500/20 border-rose-500/40 text-rose-400'
                      : 'bg-surface-900 border-white/10 text-gray-400 hover:text-white hover:border-white/20'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                </button>

                <button
                  onClick={handleShare}
                  title="Share NFT Link"
                  className="p-2.5 rounded-xl bg-surface-900 border border-white/10 text-gray-400 hover:text-white hover:border-white/20 transition-all cursor-pointer"
                >
                  <Share2 className="w-4 h-4" />
                </button>

                <a
                  href="https://etherscan.io"
                  target="_blank"
                  rel="noreferrer"
                  title="View on Block Explorer"
                  className="p-2.5 rounded-xl bg-surface-900 border border-white/10 text-gray-400 hover:text-white hover:border-white/20 transition-all cursor-pointer"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Title */}
            <div>
              <p className="text-xs font-mono text-gray-400 mb-1">
                {nft.collectionName ? `${nft.collectionName} Collection` : 'PixelMint Certified Drop'}
              </p>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                {nft.title}
              </h1>
            </div>

            {/* Creator & Current Owner Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-surface-900/80 border border-white/5">
                <img src={nft.creator.avatar} alt={nft.creator.name} className="w-10 h-10 rounded-xl object-cover border border-white/10" />
                <div className="min-w-0">
                  <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Creator</span>
                  <div className="flex items-center gap-1">
                    <p className="text-white font-bold text-xs truncate">{nft.creator.name}</p>
                    {nft.creator.verified && <BadgeCheck className="w-3.5 h-3.5 text-accent-400 shrink-0" />}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-surface-900/80 border border-white/5">
                <img src={nft.owner.avatar} alt={nft.owner.name} className="w-10 h-10 rounded-xl object-cover border border-white/10" />
                <div className="min-w-0">
                  <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Owner</span>
                  <div className="flex items-center gap-1">
                    <p className="text-white font-bold text-xs truncate">{nft.owner.name}</p>
                    {nft.owner.verified && <BadgeCheck className="w-3.5 h-3.5 text-accent-400 shrink-0" />}
                  </div>
                </div>
              </div>
            </div>

            {/* Price & Action Box */}
            <div className="glass rounded-3xl p-6 border border-white/10 space-y-4">
              {nft.isAuction && (
                <div className="flex items-center justify-between p-3 rounded-2xl bg-accent-500/10 border border-accent-400/20 text-xs">
                  <span className="text-accent-300 font-semibold flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" /> Auction Ending Soon
                  </span>
                  <span className="text-white font-mono font-bold">{nft.endTime || 'Dec 31, 2026'}</span>
                </div>
              )}

              <div>
                <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold block mb-1">
                  {nft.isAuction ? 'Current Highest Bid' : 'Direct Buy Price'}
                </span>
                <div className="flex items-baseline gap-2.5">
                  <span className="text-3xl sm:text-4xl font-extrabold text-white font-mono">
                    {priceNum.toFixed(2)}
                  </span>
                  <span className="text-lg font-bold text-brand-400">{nft.currency}</span>
                  <span className="text-xs text-gray-400 font-mono">
                    (≈ ${(priceNum * ethToUsd).toLocaleString()} USD)
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                {nft.isAuction ? (
                  <button
                    onClick={() => setBidModalNFT(nft)}
                    className="btn-glow flex-1 flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-accent-500 to-brand-500 hover:from-accent-400 hover:to-brand-400 text-white font-bold text-sm rounded-2xl shadow-xl transition-all cursor-pointer"
                  >
                    <Zap className="w-4 h-4" />
                    <span>Place Bid</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setBuyModalNFT(nft)}
                    disabled={isOwner}
                    className="btn-glow flex-1 flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-brand-500 to-accent-500 hover:from-brand-400 hover:to-accent-400 text-white font-bold text-sm rounded-2xl shadow-xl transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>{isOwner ? 'You Own This Artwork' : 'Buy Now'}</span>
                  </button>
                )}

                <button
                  onClick={() => setOfferModalNFT(nft)}
                  className="px-6 py-4 bg-surface-900 hover:bg-white/10 border border-white/10 hover:border-brand-500/30 text-white font-bold text-sm rounded-2xl transition-all cursor-pointer"
                >
                  Make Offer
                </button>
              </div>
            </div>

            {/* Tabs Selector */}
            <div className="flex gap-1.5 bg-surface-900 rounded-2xl p-1.5 border border-white/5">
              {(['details', 'history', 'bids'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                    activeTab === tab
                      ? 'bg-brand-500/20 text-brand-300 border border-brand-500/40 shadow-sm'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab Panels */}
            <div className="glass-light rounded-3xl p-6 border border-white/10">
              {activeTab === 'details' && (
                <div className="space-y-6 animate-fade-in">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">Description</h3>
                    <p className="text-gray-300 text-sm leading-relaxed">{nft.description}</p>
                  </div>

                  {/* Attributes Badges */}
                  {nft.attributes && nft.attributes.length > 0 && (
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-gray-300 mb-3">
                        On-Chain Traits & Attributes
                      </h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                        {nft.attributes.map((attr, i) => (
                          <div
                            key={i}
                            className="p-3 rounded-2xl bg-surface-900/90 border border-brand-500/20 text-center"
                          >
                            <span className="text-[10px] uppercase font-semibold text-brand-400 block truncate">
                              {attr.trait_type}
                            </span>
                            <span className="text-xs font-bold text-white block truncate mt-0.5">
                              {attr.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Smart Contract Specifications */}
                  <div className="pt-2 border-t border-white/10 grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-surface-900">
                      <span className="text-gray-500 block mb-0.5">Token ID</span>
                      <span className="text-white font-mono font-bold">#{nft.id.padStart(6, '0')}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-surface-900">
                      <span className="text-gray-500 block mb-0.5">Token Standard</span>
                      <span className="text-white font-bold">ERC-721</span>
                    </div>
                    <div className="p-3 rounded-xl bg-surface-900">
                      <span className="text-gray-500 block mb-0.5">Creator Royalty</span>
                      <span className="text-brand-400 font-bold">{nft.royalty || 10}%</span>
                    </div>
                    <div className="p-3 rounded-xl bg-surface-900">
                      <span className="text-gray-500 block mb-0.5">Contract</span>
                      <button
                        onClick={handleCopyContract}
                        className="text-accent-400 hover:underline font-mono flex items-center gap-1 cursor-pointer"
                      >
                        <span>0x71C...b41</span>
                        {copiedToken ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'history' && (
                <div className="space-y-3 animate-fade-in">
                  {nft.history.map((tx, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-surface-900 border border-white/5"
                    >
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                          tx.type === 'Minted'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : tx.type === 'Sold'
                            ? 'bg-brand-500/20 text-brand-400'
                            : tx.type === 'Listed'
                            ? 'bg-amber-500/20 text-amber-400'
                            : 'bg-accent-500/20 text-accent-400'
                        }`}
                      >
                        {tx.type === 'Minted' ? (
                          <Tag className="w-4 h-4" />
                        ) : tx.type === 'Sold' ? (
                          <RefreshCcw className="w-4 h-4" />
                        ) : tx.type === 'Listed' ? (
                          <Eye className="w-4 h-4" />
                        ) : (
                          <History className="w-4 h-4" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-white font-bold text-xs">{tx.type}</p>
                          {tx.txHash && (
                            <span className="text-[10px] text-gray-500 font-mono">({tx.txHash})</span>
                          )}
                        </div>
                        <p className="text-gray-400 text-[11px] truncate">
                          {tx.from} → {tx.to}
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        {tx.price && (
                          <p className="text-white font-mono font-bold text-xs">{tx.price} ETH</p>
                        )}
                        <p className="text-gray-500 text-[10px]">{tx.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'bids' && (
                <div className="space-y-3 animate-fade-in">
                  {nft.bids && nft.bids.length > 0 ? (
                    nft.bids.map((bid) => (
                      <div
                        key={bid.id}
                        className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-surface-900 border border-white/5"
                      >
                        <img
                          src={bid.bidderAvatar || 'https://api.dicebear.com/9.x/avataaars/svg?seed=bidder'}
                          alt={bid.bidder}
                          className="w-9 h-9 rounded-xl object-cover border border-white/10 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-bold text-xs truncate">{bid.bidder}</p>
                          <p className="text-gray-500 text-[10px]">{bid.date}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-accent-300 font-mono font-bold text-sm block">
                            {bid.amount} ETH
                          </span>
                          <span className="text-[10px] text-gray-500">
                            ≈ ${(parseFloat(bid.amount) * ethToUsd).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-8 text-center text-gray-400 text-xs">
                      {nft.isAuction ? (
                        <div>
                          <Clock className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                          <p>No bids submitted yet. Be the first to place a bid!</p>
                        </div>
                      ) : (
                        <p>This is a fixed-price listing. Place an offer using the button above.</p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Category NFTs (NOW FULLY WORKING WITH NAVIGATION!) */}
        {relatedNFTs.length > 0 && (
          <div className="mt-24 pt-12 border-t border-white/10">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-extrabold text-white">More from {nft.category}</h2>
              <button
                onClick={() => setCurrentPage('explore')}
                className="text-xs font-bold text-brand-400 hover:text-brand-300 transition-colors cursor-pointer"
              >
                View category →
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedNFTs.map((n) => (
                <div
                  key={n.id}
                  onClick={() => {
                    setSelectedNFT(n.id);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="nft-card gradient-border cursor-pointer group"
                >
                  <div className="p-3.5">
                    <div className="rounded-2xl overflow-hidden aspect-square mb-3 bg-surface-900">
                      <img
                        src={n.image}
                        alt={n.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>
                    <h3 className="text-white font-bold text-sm truncate mb-1 group-hover:text-brand-400 transition-colors">
                      {n.title}
                    </h3>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-400 truncate max-w-[120px]">{n.creator.name}</span>
                      <span className="text-brand-400 font-mono font-bold">{n.price} ETH</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
