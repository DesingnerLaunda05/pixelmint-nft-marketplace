import {
  ArrowRight,
  Sparkles,
  Shield,
  Layers,
  Zap,
  TrendingUp,
  Users,
  ImageIcon,
  DollarSign,
  BadgeCheck,
  ChevronRight,
  Flame,
} from 'lucide-react';
import NFTCard from '../components/NFTCard';
import { useMarketplace } from '../context/MarketplaceContext';

interface HomePageProps {
  setCurrentPage: (page: string) => void;
  setSelectedNFT: (id: string) => void;
}

export default function HomePage({ setCurrentPage, setSelectedNFT }: HomePageProps) {
  const { nfts, collections, walletConnected, setWalletModalOpen, setBuyModalNFT } = useMarketplace();

  const featuredNFTs = nfts.slice(0, 4);
  const trendingNFTs = nfts.slice(4, 8);
  const topCollections = collections.slice(0, 6);

  const heroNFT = nfts[2] || nfts[0];
  const sideNFT1 = nfts[4] || nfts[1];
  const sideNFT2 = nfts[0] || nfts[2];

  const totalMarketVolume = collections
    .reduce((acc, c) => acc + parseFloat(c.volume.replace(',', '')), 0)
    .toFixed(1);

  const stats = [
    { icon: ImageIcon, label: 'Curated NFTs', value: `${nfts.length} Assets`, color: 'text-brand-400' },
    { icon: Users, label: 'Verified Artists', value: '4,850+', color: 'text-accent-400' },
    { icon: DollarSign, label: 'Total Volume', value: `${totalMarketVolume} ETH`, color: 'text-emerald-400' },
    { icon: TrendingUp, label: 'Smart Contracts', value: '100% Audited', color: 'text-amber-400' },
  ];

  const howItWorks = [
    {
      icon: Layers,
      title: '1. Connect Web3 Wallet',
      description: 'Link MetaMask, Coinbase, or Phantom with a single click. Zero setup friction.',
    },
    {
      icon: Sparkles,
      title: '2. Create & Mint on Chain',
      description: 'Upload your high-res digital art, set royalty splits up to 20%, and mint ERC-721 tokens.',
    },
    {
      icon: Shield,
      title: '3. Instant Buy & Auctions',
      description: 'Participate in live timed auctions or execute atomic buys backed by smart contracts.',
    },
    {
      icon: Zap,
      title: '4. Collect & Earn Royalties',
      description: 'Earn automated secondary sale royalties every time your work changes hands on-chain.',
    },
  ];

  return (
    <div className="overflow-hidden">
      {/* Live Market Ticker Banner */}
      <div className="pt-20 bg-surface-900/80 border-b border-white/5 py-2.5 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-6 text-xs text-gray-400 whitespace-nowrap overflow-x-auto scrollbar-hide">
          <div className="flex items-center gap-1.5 text-accent-400 font-bold shrink-0">
            <Flame className="w-3.5 h-3.5 fill-current animate-bounce" />
            <span>MARKET PULSE:</span>
          </div>
          <span className="flex items-center gap-1">
            ETH Gas: <strong className="text-white font-mono">18 Gwei</strong>
          </span>
          <span className="text-gray-600">•</span>
          <span className="flex items-center gap-1">
            24h Volume: <strong className="text-white font-mono">2,481 ETH</strong>
          </span>
          <span className="text-gray-600">•</span>
          <span className="flex items-center gap-1">
            Top Gainer: <strong className="text-emerald-400 font-mono">Abstract Realm (+28.7%)</strong>
          </span>
          <span className="text-gray-600">•</span>
          <span className="flex items-center gap-1">
            Active Collectors: <strong className="text-white font-mono">18,429</strong>
          </span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden py-16">
        {/* Glow Spheres */}
        <div className="hero-glow bg-brand-500/25 top-10 -left-40" />
        <div className="hero-glow bg-accent-400/20 bottom-10 -right-40" />

        {/* Ambient Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 animate-slide-up space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/30">
                <Sparkles className="w-4 h-4 text-accent-400 animate-spin-slow" />
                <span className="text-xs sm:text-sm text-brand-300 font-semibold tracking-wide">
                  Next-Gen Web3 Digital Marketplace
                </span>
              </div>

              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.08] tracking-tight">
                <span className="text-white">Discover & Own</span>
                <br />
                <span className="gradient-text">Extraordinary</span>
                <br />
                <span className="text-white">Digital Masterpieces.</span>
              </h1>

              <p className="text-gray-300 text-base sm:text-lg max-w-xl leading-relaxed">
                Mint, collect, and trade provably unique digital art on the blockchain. Verified creators, zero counterparty risk, and seamless multi-chain execution.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => setCurrentPage('explore')}
                  className="btn-glow flex items-center gap-2.5 px-8 py-4 bg-gradient-to-r from-brand-500 via-brand-600 to-accent-500 hover:from-brand-400 hover:to-accent-400 text-white font-bold text-sm sm:text-base rounded-2xl shadow-xl shadow-brand-500/25 transition-all cursor-pointer"
                >
                  <span>Explore Marketplace</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => (walletConnected ? setCurrentPage('create') : setWalletModalOpen(true))}
                  className="flex items-center gap-2 px-7 py-4 bg-surface-900 hover:bg-white/10 border border-white/10 hover:border-brand-500/40 text-white font-semibold text-sm sm:text-base rounded-2xl transition-all cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-accent-400" />
                  <span>Mint Artwork</span>
                </button>
              </div>

              {/* Live Metric Badges */}
              <div className="pt-6 border-t border-white/10 grid grid-cols-3 gap-6">
                <div>
                  <p className="text-2xl sm:text-3xl font-extrabold text-white font-mono">12.5K+</p>
                  <p className="text-xs text-gray-400 uppercase tracking-wider mt-0.5">Artworks Minted</p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-extrabold gradient-text font-mono">48K+</p>
                  <p className="text-xs text-gray-400 uppercase tracking-wider mt-0.5">Global Collectors</p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-extrabold text-accent-400 font-mono">245K</p>
                  <p className="text-xs text-gray-400 uppercase tracking-wider mt-0.5">ETH Traded</p>
                </div>
              </div>
            </div>

            {/* Right Interactive Card Showcase */}
            <div className="lg:col-span-5 relative hidden lg:block">
              <div className="relative mx-auto max-w-md">
                {/* Main Hero Showcase Card */}
                {heroNFT && (
                  <div
                    onClick={() => {
                      setSelectedNFT(heroNFT.id);
                      setCurrentPage('nft-detail');
                    }}
                    className="relative z-20 gradient-border animate-float cursor-pointer group shadow-2xl"
                  >
                    <div className="p-4">
                      <div className="rounded-2xl overflow-hidden aspect-square mb-4 relative">
                        <img
                          src={heroNFT.image}
                          alt={heroNFT.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-xs font-bold text-accent-400 border border-white/10">
                          {heroNFT.isAuction ? '⚡ Live Auction' : 'Featured Drop'}
                        </div>
                      </div>

                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="text-white font-bold text-lg group-hover:text-brand-400 transition-colors">
                            {heroNFT.title}
                          </h3>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <img src={heroNFT.creator.avatar} alt="" className="w-4 h-4 rounded-full" />
                            <span className="text-xs text-gray-400">{heroNFT.creator.name}</span>
                            <BadgeCheck className="w-3.5 h-3.5 text-accent-400" />
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold block">
                            {heroNFT.isAuction ? 'Current Bid' : 'Price'}
                          </span>
                          <span className="text-white font-extrabold font-mono text-base text-accent-300">
                            {heroNFT.isAuction ? heroNFT.highestBid : heroNFT.price} ETH
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setBuyModalNFT(heroNFT);
                        }}
                        className="w-full py-2.5 bg-gradient-to-r from-brand-500 to-accent-500 hover:from-brand-400 hover:to-accent-400 text-white font-bold text-xs rounded-xl shadow-lg transition-all"
                      >
                        Instant Buy ({heroNFT.price} ETH)
                      </button>
                    </div>
                  </div>
                )}

                {/* Floating Preview Card 1 */}
                {sideNFT1 && (
                  <div
                    onClick={() => {
                      setSelectedNFT(sideNFT1.id);
                      setCurrentPage('nft-detail');
                    }}
                    className="absolute -top-10 -right-8 w-44 gradient-border animate-float-delayed z-10 opacity-85 hover:opacity-100 transition-all cursor-pointer shadow-xl hidden xl:block"
                  >
                    <div className="p-2.5">
                      <div className="rounded-xl overflow-hidden aspect-square mb-2">
                        <img src={sideNFT1.image} alt="" className="w-full h-full object-cover" />
                      </div>
                      <p className="text-white text-xs font-bold truncate">{sideNFT1.title}</p>
                      <p className="text-brand-400 text-xs font-mono font-bold">{sideNFT1.price} ETH</p>
                    </div>
                  </div>
                )}

                {/* Floating Preview Card 2 */}
                {sideNFT2 && (
                  <div
                    onClick={() => {
                      setSelectedNFT(sideNFT2.id);
                      setCurrentPage('nft-detail');
                    }}
                    className="absolute -bottom-8 -left-8 w-44 gradient-border animate-float z-30 opacity-90 hover:opacity-100 transition-all cursor-pointer shadow-xl hidden xl:block"
                    style={{ animationDelay: '3.5s' }}
                  >
                    <div className="p-2.5">
                      <div className="rounded-xl overflow-hidden aspect-square mb-2">
                        <img src={sideNFT2.image} alt="" className="w-full h-full object-cover" />
                      </div>
                      <p className="text-white text-xs font-bold truncate">{sideNFT2.title}</p>
                      <p className="text-accent-400 text-xs font-mono font-bold">{sideNFT2.price} ETH</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Counter Section */}
      <section className="py-14 relative bg-surface-900/40 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="glass-light rounded-2xl p-6 text-center hover:bg-white/5 transition-all group border border-white/5"
              >
                <stat.icon
                  className={`w-8 h-8 ${stat.color} mx-auto mb-3 group-hover:scale-110 transition-transform`}
                />
                <p className="text-2xl md:text-3xl font-extrabold text-white mb-1 font-mono tracking-tight">
                  {stat.value}
                </p>
                <p className="text-gray-400 text-xs uppercase tracking-wider font-semibold">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured NFTs Section */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-accent-400 uppercase tracking-widest mb-1">
                <Sparkles className="w-3.5 h-3.5" /> Curated Drops
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white">
                Featured <span className="gradient-text">Artworks</span>
              </h2>
            </div>
            <button
              onClick={() => setCurrentPage('explore')}
              className="flex items-center gap-2 text-sm font-bold text-brand-400 hover:text-brand-300 transition-colors cursor-pointer"
            >
              <span>Explore All ({nfts.length})</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredNFTs.map((nft) => (
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
        </div>
      </section>

      {/* Top Collections Leaderboard */}
      <section className="py-20 relative bg-surface-900/60 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-400 uppercase tracking-widest mb-1">
                <TrendingUp className="w-3.5 h-3.5" /> On-Chain Volume
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white">
                Top <span className="gradient-text">Collections</span>
              </h2>
            </div>
            <button
              onClick={() => setCurrentPage('collections')}
              className="flex items-center gap-2 text-sm font-bold text-brand-400 hover:text-brand-300 transition-colors cursor-pointer"
            >
              <span>View Leaderboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topCollections.map((col, i) => (
              <div
                key={col.id}
                onClick={() => setCurrentPage('explore')}
                className="gradient-border cursor-pointer group nft-card p-4 flex flex-col justify-between"
              >
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-xl font-mono font-bold text-gray-500 w-6 text-center">#{i + 1}</span>
                  <img
                    src={col.image}
                    alt={col.name}
                    className="w-14 h-14 rounded-2xl object-cover border border-white/10 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-white font-bold text-base truncate group-hover:text-brand-400 transition-colors">
                        {col.name}
                      </h3>
                      {col.creator.verified && <BadgeCheck className="w-4 h-4 text-accent-400 shrink-0" />}
                    </div>
                    <p className="text-gray-400 text-xs truncate">by {col.creator.name}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/10 text-center">
                  <div>
                    <p className="text-gray-500 text-[10px] uppercase font-semibold">Floor</p>
                    <p className="text-white font-mono font-bold text-sm">{col.floorPrice} ETH</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-[10px] uppercase font-semibold">Volume</p>
                    <p className="text-white font-mono font-bold text-sm">{col.volume} ETH</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-[10px] uppercase font-semibold">24h</p>
                    <p className={`font-mono font-bold text-sm ${col.change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {col.change >= 0 ? '+' : ''}{col.change}%
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Now */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-widest mb-1">
                <Flame className="w-3.5 h-3.5 fill-current" /> High Demand
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white">
                Trending <span className="gradient-text">Now</span>
              </h2>
            </div>
            <button
              onClick={() => setCurrentPage('explore')}
              className="flex items-center gap-2 text-sm font-bold text-brand-400 hover:text-brand-300 transition-colors cursor-pointer"
            >
              <span>Explore Marketplace</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trendingNFTs.map((nft) => (
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
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 relative bg-surface-900/60 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-400 mb-2 block">
              Decentralized Architecture
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-3">
              How <span className="gradient-text">PixelMint</span> Operates
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              Every creation, bid, and trade happens transparently through cryptographic verification and peer-to-peer settlement.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {howItWorks.map((step) => (
              <div
                key={step.title}
                className="relative glass-light rounded-2xl p-6 group hover:bg-white/5 transition-all border border-white/5 flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400 mb-4 group-hover:scale-110 group-hover:bg-brand-500/20 transition-all">
                    <step.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-white font-bold text-base mb-2">{step.title}</h3>
                  <p className="text-gray-400 text-xs leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="hero-glow bg-brand-500/20 top-0 left-1/3" />
        <div className="hero-glow bg-accent-400/20 bottom-0 right-1/3" />
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white leading-tight">
            Start Your <span className="gradient-text">Web3 Art Journey</span> Today
          </h2>
          <p className="text-gray-300 text-base max-w-xl mx-auto leading-relaxed">
            Mint and trade one-of-a-kind digital creations with over 48,000 collectors worldwide. No gatekeepers, full ownership.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <button
              onClick={() => setCurrentPage('explore')}
              className="btn-glow flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-brand-500 to-accent-500 hover:from-brand-400 hover:to-accent-400 text-white font-bold text-sm sm:text-base rounded-2xl shadow-xl transition-all cursor-pointer"
            >
              <span>Explore Marketplace</span>
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => (walletConnected ? setCurrentPage('create') : setWalletModalOpen(true))}
              className="flex items-center justify-center gap-2 px-8 py-4 bg-surface-900 hover:bg-white/10 border border-white/10 text-white font-bold text-sm sm:text-base rounded-2xl transition-all cursor-pointer"
            >
              <span>Mint Your First NFT</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
