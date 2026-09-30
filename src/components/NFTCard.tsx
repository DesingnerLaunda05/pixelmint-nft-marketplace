import { Heart, Clock, BadgeCheck, Sparkles, Zap } from 'lucide-react';
import { NFT } from '../types';
import { useMarketplace } from '../context/MarketplaceContext';

interface NFTCardProps {
  nft: NFT;
  onClick: () => void;
}

export default function NFTCard({ nft, onClick }: NFTCardProps) {
  const { likedIds, toggleLike, setBuyModalNFT, setBidModalNFT } = useMarketplace();
  const isLiked = likedIds.includes(nft.id);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleLike(nft.id);
  };

  const handleAction = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (nft.isAuction) {
      setBidModalNFT(nft);
    } else {
      setBuyModalNFT(nft);
    }
  };

  return (
    <div
      onClick={onClick}
      className="nft-card gradient-border cursor-pointer group flex flex-col h-full overflow-hidden"
    >
      <div className="p-3.5 flex flex-col h-full">
        {/* Artwork Image Container */}
        <div className="relative overflow-hidden rounded-2xl aspect-square mb-3 bg-surface-900">
          <img
            src={nft.image}
            alt={nft.title}
            className="nft-image w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            loading="lazy"
            onError={(e) => {
              // Graceful fallback image if external link is slow
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80';
            }}
          />
          {/* Subtle gradient vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-surface-950/80 via-transparent to-black/20 opacity-40 group-hover:opacity-60 transition-opacity duration-300" />
          
          {/* Network / Category Pill */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[11px] font-semibold text-white">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-400 animate-pulse" />
            {nft.category}
          </div>

          {/* Like Button */}
          <button
            onClick={handleLike}
            aria-label="Favorite NFT"
            className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-xs transition-all hover:bg-black/80 hover:scale-105 active:scale-95 cursor-pointer z-10"
          >
            <Heart className={`w-3.5 h-3.5 transition-colors ${isLiked ? 'text-rose-500 fill-rose-500' : 'text-gray-300'}`} />
            <span className="text-white font-medium text-[11px]">{nft.likes}</span>
          </button>

          {/* Auction Badge */}
          {nft.isAuction && (
            <div className="absolute bottom-14 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent-500/25 backdrop-blur-md border border-accent-400/40 text-[11px] font-bold text-accent-300">
              <Clock className="w-3 h-3 animate-spin-slow" />
              <span>Live Auction</span>
            </div>
          )}

          {/* Quick Action Button on Hover */}
          <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-3 group-hover:translate-y-0 z-10">
            <button
              onClick={handleAction}
              className="w-full py-2.5 bg-gradient-to-r from-brand-500 to-accent-500 hover:from-brand-400 hover:to-accent-400 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-brand-500/30 cursor-pointer flex items-center justify-center gap-1.5 active:scale-[0.98]"
            >
              {nft.isAuction ? (
                <>
                  <Zap className="w-3.5 h-3.5" /> Place Bid
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" /> Buy Now
                </>
              )}
            </button>
          </div>
        </div>

        {/* NFT Metadata */}
        <div className="flex-1 flex flex-col justify-between px-1">
          <div>
            <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
              <span className="text-[11px] font-mono text-gray-400 truncate max-w-[120px]">
                {nft.collectionName || 'Single Edition'}
              </span>
              <span className="text-[10px] uppercase font-bold text-brand-400 tracking-wider">
                {nft.network || 'ETH'}
              </span>
            </div>

            <h3 className="text-white font-bold text-base truncate mb-2 group-hover:text-brand-400 transition-colors">
              {nft.title}
            </h3>

            {/* Creator / Owner */}
            <div className="flex items-center gap-2 mb-3">
              <img
                src={nft.creator.avatar}
                alt={nft.creator.name}
                className="w-5 h-5 rounded-full border border-white/20 bg-surface-800 shrink-0"
              />
              <span className="text-gray-300 text-xs truncate">{nft.creator.name}</span>
              {nft.creator.verified && <BadgeCheck className="w-3.5 h-3.5 text-accent-400 shrink-0" />}
            </div>
          </div>

          {/* Pricing Row */}
          <div className="pt-2.5 border-t border-white/5 flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-[10px] uppercase tracking-wider font-semibold">
                {nft.isAuction ? 'Current Bid' : 'Price'}
              </p>
              <p className="text-white font-extrabold text-sm font-mono">
                {nft.isAuction ? nft.highestBid : nft.price} <span className="text-brand-400 font-sans font-semibold text-xs">{nft.currency}</span>
              </p>
            </div>

            <div className="text-right">
              <span className="text-[11px] px-2 py-0.5 rounded-md bg-white/5 text-gray-400 border border-white/5 font-mono">
                #{nft.id.padStart(4, '0')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
