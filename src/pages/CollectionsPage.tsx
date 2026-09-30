import { useState, useMemo } from 'react';
import { BadgeCheck, TrendingUp, TrendingDown, Search, Sparkles } from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';

interface CollectionsPageProps {
  setCurrentPage: (page: string) => void;
  setSearchQuery?: (q: string) => void;
}

export default function CollectionsPage({ setCurrentPage, setSearchQuery }: CollectionsPageProps) {
  const { collections } = useMarketplace();
  const [search, setSearch] = useState('');
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d' | 'All'>('7d');

  const filtered = useMemo(() => {
    return collections.filter((c) => {
      return (
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.creator.name.toLowerCase().includes(search.toLowerCase())
      );
    });
  }, [collections, search]);

  const handleCollectionClick = (collectionName: string) => {
    if (setSearchQuery) {
      setSearchQuery(collectionName);
    }
    setCurrentPage('explore');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-xs font-semibold text-brand-300 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-accent-400" />
            <span>Volume Rankings</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Top <span className="gradient-text">Collections</span>
          </h1>
          <p className="text-gray-400 text-sm sm:text-base mt-2 max-w-xl">
            The leading decentralized collections ranked by real-time secondary volume, floor price stability, and item liquidity.
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search collections or creators..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 bg-surface-900 border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-brand-500 transition-all text-sm"
            />
          </div>

          <div className="flex items-center gap-2">
            {(['24h', '7d', '30d', 'All'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  timeRange === range
                    ? 'bg-brand-500/20 text-brand-300 border border-brand-500/40 shadow-lg shadow-brand-500/20'
                    : 'bg-surface-900 border border-white/10 text-gray-400 hover:text-white'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        {/* Collections Table Container */}
        <div className="glass rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
          {/* Table Header */}
          <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 border-b border-white/10 text-gray-400 text-xs font-bold uppercase tracking-wider bg-surface-900/60">
            <div className="col-span-1">#</div>
            <div className="col-span-4">Collection</div>
            <div className="col-span-2 text-right">Floor Price</div>
            <div className="col-span-2 text-right">Volume ({timeRange})</div>
            <div className="col-span-1 text-right">Items</div>
            <div className="col-span-2 text-right">24h Change</div>
          </div>

          {/* Table Body */}
          {filtered.map((col, i) => {
            // Adjust volume dynamically by timeRange multiplier
            const multiplier = timeRange === '24h' ? 0.15 : timeRange === '7d' ? 1 : timeRange === '30d' ? 3.8 : 12;
            const volumeVal = (parseFloat(col.volume.replace(',', '')) * multiplier).toFixed(1);

            return (
              <div
                key={col.id}
                onClick={() => handleCollectionClick(col.name)}
                className="grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-5 border-b border-white/5 hover:bg-white/[0.04] transition-all cursor-pointer items-center group"
              >
                {/* Rank */}
                <div className="hidden md:block col-span-1 font-mono font-bold text-gray-500 group-hover:text-brand-400 transition-colors">
                  {i + 1}
                </div>

                {/* Collection Meta */}
                <div className="col-span-4 flex items-center gap-4">
                  <span className="md:hidden font-mono font-bold text-gray-500 text-base mr-1">{i + 1}</span>
                  <img
                    src={col.image}
                    alt={col.name}
                    className="w-14 h-14 rounded-2xl object-cover border border-white/10 shrink-0 group-hover:scale-105 transition-transform"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-white font-bold text-base truncate group-hover:text-brand-400 transition-colors">
                        {col.name}
                      </h3>
                      {col.creator.verified && <BadgeCheck className="w-4 h-4 text-accent-400 shrink-0" />}
                    </div>
                    <p className="text-gray-400 text-xs truncate">by {col.creator.name}</p>
                  </div>
                </div>

                {/* Floor Price */}
                <div className="md:col-span-2 md:text-right flex md:block items-center justify-between">
                  <span className="md:hidden text-gray-400 text-xs">Floor:</span>
                  <div>
                    <p className="text-white font-mono font-bold text-sm">{col.floorPrice} ETH</p>
                    <p className="text-gray-500 text-[10px] hidden md:block">
                      ≈ ${(parseFloat(col.floorPrice) * 3450).toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Volume */}
                <div className="md:col-span-2 md:text-right flex md:block items-center justify-between">
                  <span className="md:hidden text-gray-400 text-xs">Volume:</span>
                  <p className="text-white font-mono font-bold text-sm">{volumeVal} ETH</p>
                </div>

                {/* Items */}
                <div className="md:col-span-1 md:text-right flex md:block items-center justify-between">
                  <span className="md:hidden text-gray-400 text-xs">Items:</span>
                  <p className="text-gray-300 font-mono text-sm">{col.items.toLocaleString()}</p>
                </div>

                {/* Change */}
                <div className="md:col-span-2 md:text-right flex md:block items-center justify-between">
                  <span className="md:hidden text-gray-400 text-xs">24h Change:</span>
                  <div
                    className={`inline-flex items-center gap-1 font-mono font-bold text-sm ${
                      col.change >= 0 ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {col.change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    <span>
                      {col.change >= 0 ? '+' : ''}
                      {col.change}%
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <Search className="w-10 h-10 text-gray-600 mx-auto mb-4" />
            <h3 className="text-white text-lg font-bold mb-1">No Collections Found</h3>
            <p className="text-gray-400 text-sm">Try searching for a different collection name or creator.</p>
          </div>
        )}
      </div>
    </div>
  );
}
