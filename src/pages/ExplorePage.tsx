import { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, Grid3X3, LayoutList, X, RotateCcw, Sparkles, Filter } from 'lucide-react';
import NFTCard from '../components/NFTCard';
import { useMarketplace } from '../context/MarketplaceContext';
import { categories } from '../data/mockData';

interface ExplorePageProps {
  setCurrentPage: (page: string) => void;
  setSelectedNFT: (id: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export default function ExplorePage({
  setCurrentPage,
  setSelectedNFT,
  searchQuery,
  setSearchQuery,
}: ExplorePageProps) {
  const { nfts } = useMarketplace();

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState<'recent' | 'price-low' | 'price-high' | 'popular'>('recent');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 15]);
  const [saleType, setSaleType] = useState<'All' | 'Fixed Price' | 'Auction'>('All');
  const [verifiedOnly, setVerifiedOnly] = useState<boolean>(false);
  const [showFilters, setShowFilters] = useState(false);
  const [gridCols, setGridCols] = useState<3 | 4>(4);

  // Filtered and sorted NFTs
  const filteredNFTs = useMemo(() => {
    let result = [...nfts];

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.creator.name.toLowerCase().includes(q) ||
          n.category.toLowerCase().includes(q) ||
          (n.collectionName && n.collectionName.toLowerCase().includes(q))
      );
    }

    // Category
    if (selectedCategory !== 'All') {
      result = result.filter((n) => n.category.toLowerCase() === selectedCategory.toLowerCase());
    }

    // Sale Type
    if (saleType === 'Fixed Price') {
      result = result.filter((n) => !n.isAuction);
    } else if (saleType === 'Auction') {
      result = result.filter((n) => n.isAuction);
    }

    // Verified Creator Only
    if (verifiedOnly) {
      result = result.filter((n) => n.creator.verified);
    }

    // Price range
    result = result.filter((n) => {
      const p = parseFloat(n.price);
      return p >= priceRange[0] && p <= priceRange[1];
    });

    // Sorting
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        break;
      case 'price-high':
        result.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
        break;
      case 'popular':
        result.sort((a, b) => b.likes - a.likes);
        break;
      case 'recent':
      default:
        // Newest items first (higher ID or position in array)
        result.sort((a, b) => parseInt(b.id) - parseInt(a.id));
        break;
    }

    return result;
  }, [nfts, searchQuery, selectedCategory, saleType, verifiedOnly, priceRange, sortBy]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSaleType('All');
    setVerifiedOnly(false);
    setPriceRange([0, 15]);
    setSortBy('recent');
  };

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    selectedCategory !== 'All' ||
    saleType !== 'All' ||
    verifiedOnly ||
    priceRange[0] !== 0 ||
    priceRange[1] !== 15 ||
    sortBy !== 'recent';

  return (
    <div className="min-h-screen pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Banner */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-xs font-semibold text-brand-300 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-accent-400" />
            <span>Decentralized Catalog</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Explore <span className="gradient-text">Marketplace</span>
          </h1>
          <p className="text-gray-400 text-sm sm:text-base mt-2 max-w-xl">
            Discover, filter, and collect verified digital artworks, generative algorithms, and metaverse collectibles.
          </p>
        </div>

        {/* Top Search & Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by title, creator, or collection..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-10 py-3.5 bg-surface-900 border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-brand-500 transition-all text-sm shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/10 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort & Quick Controls */}
          <div className="flex items-center gap-3 shrink-0 flex-wrap sm:flex-nowrap">
            {/* Sort Select */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="px-4 py-3.5 bg-surface-900 border border-white/10 rounded-2xl text-white text-xs sm:text-sm font-semibold focus:outline-none focus:border-brand-500 cursor-pointer transition-all min-w-[150px]"
            >
              <option value="recent">Recently Added</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="popular">Most Popular</option>
            </select>

            {/* Filter Toggle Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-3.5 rounded-2xl border text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                showFilters || hasActiveFilters
                  ? 'bg-brand-500/20 border-brand-500/40 text-brand-300'
                  : 'bg-surface-900 border-white/10 text-gray-300 hover:text-white hover:border-white/20'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filters</span>
              {hasActiveFilters && (
                <span className="w-2 h-2 rounded-full bg-accent-400" />
              )}
            </button>

            {/* Grid Layout Toggle (Desktop) */}
            <div className="hidden md:flex items-center gap-1 bg-surface-900 border border-white/10 rounded-2xl p-1">
              <button
                onClick={() => setGridCols(4)}
                title="4 Column Grid"
                className={`p-2 rounded-xl transition-all cursor-pointer ${
                  gridCols === 4 ? 'bg-brand-500/20 text-brand-400' : 'text-gray-500 hover:text-white'
                }`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setGridCols(3)}
                title="3 Column Grid"
                className={`p-2 rounded-xl transition-all cursor-pointer ${
                  gridCols === 3 ? 'bg-brand-500/20 text-brand-400' : 'text-gray-500 hover:text-white'
                }`}
              >
                <LayoutList className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Category Horizontal Filter Pills */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4.5 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-brand-500 to-accent-500 text-white shadow-lg shadow-brand-500/30'
                  : 'bg-surface-900/80 border border-white/10 text-gray-400 hover:text-white hover:border-white/25'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Expandable Advanced Filters Drawer */}
        {showFilters && (
          <div className="glass rounded-3xl p-6 sm:p-7 mb-8 border border-white/10 animate-slide-up space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-brand-400" />
                <h3 className="text-white font-bold text-sm">Advanced Parameters</h3>
              </div>
              {hasActiveFilters && (
                <button
                  onClick={handleResetFilters}
                  className="flex items-center gap-1.5 text-xs text-brand-400 hover:text-brand-300 font-semibold cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset All</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Price Range Slider */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-gray-300">Max Price:</span>
                  <span className="text-brand-400 font-mono">{priceRange[1]} ETH</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="15"
                  step="0.5"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseFloat(e.target.value)])}
                  className="w-full h-2 bg-surface-700 rounded-lg appearance-none cursor-pointer accent-brand-500"
                />
                <div className="flex justify-between text-[11px] text-gray-500 font-mono">
                  <span>0 ETH</span>
                  <span>15+ ETH</span>
                </div>
              </div>

              {/* Sale Type (Now Fully Working!) */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-gray-300 block">Sale Type</span>
                <div className="flex gap-2">
                  {(['All', 'Fixed Price', 'Auction'] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setSaleType(type)}
                      className={`flex-1 py-2 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                        saleType === type
                          ? 'bg-brand-500/20 border-brand-500/50 text-brand-300'
                          : 'bg-surface-800/80 border-white/10 text-gray-400 hover:text-white'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Verified Artists (Now Fully Working!) */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-gray-300 block">Creator Verification</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setVerifiedOnly(false)}
                    className={`flex-1 py-2 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                      !verifiedOnly
                        ? 'bg-brand-500/20 border-brand-500/50 text-brand-300'
                        : 'bg-surface-800/80 border-white/10 text-gray-400 hover:text-white'
                    }`}
                  >
                    All Creators
                  </button>
                  <button
                    type="button"
                    onClick={() => setVerifiedOnly(true)}
                    className={`flex-1 py-2 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                      verifiedOnly
                        ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                        : 'bg-surface-800/80 border-white/10 text-gray-400 hover:text-white'
                    }`}
                  >
                    Verified Only
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results Metadata Bar */}
        <div className="flex items-center justify-between mb-6 text-xs text-gray-400 font-mono">
          <p>
            Showing <strong className="text-white font-bold">{filteredNFTs.length}</strong> {filteredNFTs.length === 1 ? 'artwork' : 'artworks'}
          </p>
          {hasActiveFilters && (
            <button
              onClick={handleResetFilters}
              className="text-brand-400 hover:underline cursor-pointer"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* NFT Results Grid */}
        {filteredNFTs.length > 0 ? (
          <div
            className={`grid grid-cols-1 sm:grid-cols-2 ${
              gridCols === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'
            } gap-6`}
          >
            {filteredNFTs.map((nft) => (
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
          <div className="glass rounded-3xl p-16 text-center max-w-lg mx-auto border border-white/10 my-10 animate-fade-in">
            <div className="w-20 h-20 rounded-2xl bg-surface-900 border border-white/10 flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-500" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No Matching Artworks</h3>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
              We couldn't find any NFTs matching your search criteria or price thresholds.
            </p>
            <button
              onClick={handleResetFilters}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-brand-500 to-accent-500 text-white font-bold text-sm shadow-lg hover:from-brand-400 hover:to-accent-400 transition-all cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
