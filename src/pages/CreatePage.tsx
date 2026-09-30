import { useState, useRef } from 'react';
import {
  Upload,
  DollarSign,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Clock,
  Zap,
  Shield,
  ArrowRight,
} from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';
import { sampleArtworks, categories } from '../data/mockData';
import { SupportedNetwork } from '../types';

interface CreatePageProps {
  setCurrentPage: (page: string) => void;
  setSelectedNFT: (id: string) => void;
}

export default function CreatePage({ setCurrentPage, setSelectedNFT }: CreatePageProps) {
  const { walletConnected, setWalletModalOpen, user, mintNFT, addFunds } = useMarketplace();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Art');
  const [royalty, setRoyalty] = useState(10);
  const [blockchain, setBlockchain] = useState<SupportedNetwork>('Ethereum');
  const [isAuction, setIsAuction] = useState(false);
  const [auctionDuration, setAuctionDuration] = useState(3);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [attributes, setAttributes] = useState<{ trait_type: string; value: string }[]>([
    { trait_type: 'Rarity', value: 'Legendary' },
    { trait_type: 'Edition', value: 'Genesis 1 of 1' },
  ]);
  const [mintedId, setMintedId] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!walletConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20 pb-16 px-4">
        <div className="glass rounded-3xl p-8 sm:p-12 text-center max-w-md w-full border border-white/10 shadow-2xl animate-slide-up">
          <div className="w-20 h-20 rounded-2xl bg-brand-500/20 border border-brand-500/30 flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-10 h-10 text-brand-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Connect Your Web3 Wallet</h2>
          <p className="text-gray-400 text-sm mb-8 leading-relaxed">
            Minting digital assets requires cryptographic verification on the blockchain. Connect your wallet to access the creator studio.
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

  // Handle actual file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreviewImage(event.target?.result as string);
        setErrors((prev) => ({ ...prev, image: '' }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Drag and drop handlers
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreviewImage(event.target?.result as string);
        setErrors((prev) => ({ ...prev, image: '' }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddAttribute = () => {
    setAttributes([...attributes, { trait_type: '', value: '' }]);
  };

  const handleRemoveAttribute = (index: number) => {
    setAttributes(attributes.filter((_, i) => i !== index));
  };

  const handleAttributeChange = (index: number, field: 'trait_type' | 'value', val: string) => {
    const updated = [...attributes];
    updated[index][field] = val;
    setAttributes(updated);
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = 'NFT title is required';
    if (!description.trim()) newErrors.description = 'Artwork description is required';
    if (!price || parseFloat(price) <= 0) newErrors.price = 'Valid price greater than 0 is required';
    if (!previewImage) newErrors.image = 'Please upload artwork or choose a preset';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const validAttributes = attributes.filter((a) => a.trait_type.trim() && a.value.trim());

      const newId = mintNFT({
        title: name,
        description,
        price,
        category,
        image: previewImage!,
        royalty,
        network: blockchain,
        isAuction,
        auctionDurationDays: isAuction ? auctionDuration : undefined,
        attributes: validAttributes.length > 0 ? validAttributes : undefined,
      });

      setIsSubmitting(false);
      if (newId) {
        setMintedId(newId);
      }
    }, 800);
  };

  // Success view
  if (mintedId) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24 pb-16 px-4">
        <div className="glass rounded-3xl p-8 sm:p-12 text-center max-w-lg w-full border border-white/10 shadow-2xl animate-slide-up">
          <div className="w-20 h-20 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-emerald-400" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
            NFT Minted Successfully! 🎉
          </h2>
          <p className="text-gray-300 text-sm mb-6 leading-relaxed">
            Your unique digital asset <span className="text-brand-300 font-bold">"{name}"</span> has been deployed to the {blockchain} blockchain and listed on PixelMint.
          </p>

          <div className="p-4 rounded-2xl bg-surface-900 border border-white/5 mb-8 flex items-center gap-4 text-left">
            <img src={previewImage!} alt={name} className="w-16 h-16 rounded-xl object-cover shrink-0" />
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-accent-400">{category}</span>
              <h4 className="text-white font-bold text-sm truncate">{name}</h4>
              <p className="text-brand-400 font-mono text-xs font-bold">{price} ETH</p>
            </div>
            <div className="text-right">
              <span className="text-[11px] font-mono text-emerald-400 font-semibold">Active Listing</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => {
                setSelectedNFT(mintedId);
                setCurrentPage('nft-detail');
              }}
              className="btn-glow flex-1 py-3.5 bg-gradient-to-r from-brand-500 to-accent-500 text-white font-bold text-sm rounded-xl cursor-pointer"
            >
              View NFT Details
            </button>
            <button
              onClick={() => {
                setMintedId(null);
                setName('');
                setDescription('');
                setPrice('');
                setPreviewImage(null);
              }}
              className="flex-1 py-3.5 bg-white/5 hover:bg-white/10 text-gray-300 font-bold text-sm rounded-xl border border-white/10 cursor-pointer"
            >
              Mint Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-xs font-semibold text-brand-300 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-accent-400" />
            <span>Studio Minting Protocol</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Create <span className="gradient-text">New NFT</span>
          </h1>
          <p className="text-gray-400 text-sm sm:text-base mt-2 max-w-xl">
            Upload your artwork, configure on-chain metadata, set creator royalties, and deploy directly to decentralized storage.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            {/* Left Upload Section */}
            <div className="lg:col-span-5 space-y-6">
              <div className="glass rounded-3xl p-6 border border-white/10">
                <label className="block text-sm font-bold text-white mb-3 flex items-center justify-between">
                  <span>Upload Artwork *</span>
                  <span className="text-xs text-gray-400 font-normal">PNG, JPG, GIF, WebP</span>
                </label>

                {/* Upload Drop Zone */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />

                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  className={`relative border-2 border-dashed rounded-2xl aspect-square flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden ${
                    isDragging
                      ? 'border-accent-400 bg-accent-400/10 scale-[1.02]'
                      : errors.image
                      ? 'border-rose-500/60 bg-rose-500/5'
                      : previewImage
                      ? 'border-brand-500/40 bg-surface-900'
                      : 'border-white/15 hover:border-white/30 bg-surface-900/60 hover:bg-white/[0.02]'
                  }`}
                >
                  {previewImage ? (
                    <>
                      <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white">
                        <Upload className="w-8 h-8 mb-2" />
                        <span className="text-xs font-bold">Click to change artwork</span>
                      </div>
                    </>
                  ) : (
                    <div className="text-center p-6 space-y-2">
                      <div className="w-14 h-14 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center mx-auto text-brand-400 mb-2">
                        <Upload className="w-6 h-6" />
                      </div>
                      <p className="text-white text-sm font-bold">Drag & drop your file here</p>
                      <p className="text-gray-400 text-xs">or browse from your device</p>
                      <span className="inline-block mt-3 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] text-gray-400">
                        Max file size: 50MB
                      </span>
                    </div>
                  )}
                </div>
                {errors.image && <p className="text-rose-400 text-xs mt-2">{errors.image}</p>}

                {/* Sample Art Presets Picker */}
                <div className="mt-5 pt-5 border-t border-white/10">
                  <label className="block text-xs font-semibold text-gray-400 mb-2.5">
                    Or select a curated generative artwork sample:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {sampleArtworks.map((sample) => (
                      <button
                        type="button"
                        key={sample.name}
                        onClick={() => {
                          setPreviewImage(sample.url);
                          setErrors((prev) => ({ ...prev, image: '' }));
                        }}
                        className={`relative rounded-xl overflow-hidden aspect-square border transition-all cursor-pointer ${
                          previewImage === sample.url
                            ? 'border-brand-400 ring-2 ring-brand-400/40 scale-105'
                            : 'border-white/10 hover:border-white/30 opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img src={sample.url} alt={sample.name} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Creator Card */}
              <div className="glass rounded-3xl p-5 border border-white/10 flex items-center gap-3">
                <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-xl object-cover border border-white/20" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-400">Minting as Creator</p>
                  <h4 className="text-white font-bold text-sm truncate">{user.name}</h4>
                  <p className="text-gray-500 font-mono text-[11px] truncate">{user.address}</p>
                </div>
              </div>
            </div>

            {/* Right Form Parameters */}
            <div className="lg:col-span-7 space-y-6">
              <div className="glass rounded-3xl p-6 sm:p-7 border border-white/10 space-y-5">
                {/* Title */}
                <div>
                  <label className="block text-xs font-bold text-gray-200 uppercase tracking-wider mb-2">
                    NFT Title *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Neon Dimension #01"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setErrors((prev) => ({ ...prev, name: '' }));
                    }}
                    className={`w-full px-4 py-3 bg-surface-900 border rounded-xl text-white text-sm focus:outline-none transition-all ${
                      errors.name ? 'border-rose-500' : 'border-white/10 focus:border-brand-500'
                    }`}
                  />
                  {errors.name && <p className="text-rose-400 text-xs mt-1">{errors.name}</p>}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-bold text-gray-200 uppercase tracking-wider mb-2">
                    Description *
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Describe the story, vision, and algorithmic process behind this creation..."
                    value={description}
                    onChange={(e) => {
                      setDescription(e.target.value);
                      setErrors((prev) => ({ ...prev, description: '' }));
                    }}
                    className={`w-full px-4 py-3 bg-surface-900 border rounded-xl text-white text-sm focus:outline-none transition-all resize-none ${
                      errors.description ? 'border-rose-500' : 'border-white/10 focus:border-brand-500'
                    }`}
                  />
                  {errors.description && <p className="text-rose-400 text-xs mt-1">{errors.description}</p>}
                </div>

                {/* Category & Blockchain */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-200 uppercase tracking-wider mb-2">
                      Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-4 py-3 bg-surface-900 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-brand-500 cursor-pointer"
                    >
                      {categories.filter((c) => c !== 'All').map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-200 uppercase tracking-wider mb-2">
                      Target Blockchain
                    </label>
                    <select
                      value={blockchain}
                      onChange={(e) => setBlockchain(e.target.value as SupportedNetwork)}
                      className="w-full px-4 py-3 bg-surface-900 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-brand-500 cursor-pointer"
                    >
                      <option value="Ethereum">Ethereum (Mainnet)</option>
                      <option value="Polygon">Polygon (PoS)</option>
                      <option value="Arbitrum">Arbitrum One</option>
                      <option value="Solana">Solana</option>
                    </select>
                  </div>
                </div>

                {/* Sale Mechanism Toggle */}
                <div>
                  <label className="block text-xs font-bold text-gray-200 uppercase tracking-wider mb-2">
                    Listing Format
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setIsAuction(false)}
                      className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                        !isAuction
                          ? 'bg-brand-500/20 border-brand-500/50'
                          : 'bg-surface-900 border-white/10 text-gray-400 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <DollarSign className="w-4 h-4 text-brand-400" />
                        <span className="text-white font-bold text-sm">Fixed Price</span>
                      </div>
                      <p className="text-gray-400 text-xs">Buyers can purchase immediately</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsAuction(true)}
                      className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                        isAuction
                          ? 'bg-accent-500/20 border-accent-500/50'
                          : 'bg-surface-900 border-white/10 text-gray-400 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Clock className="w-4 h-4 text-accent-400" />
                        <span className="text-white font-bold text-sm">Timed Auction</span>
                      </div>
                      <p className="text-gray-400 text-xs">Bidders compete until time expires</p>
                    </button>
                  </div>
                </div>

                {/* Price or Starting Bid */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-200 uppercase tracking-wider mb-2">
                      {isAuction ? 'Starting Bid (ETH) *' : 'Listing Price (ETH) *'}
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.01"
                        min="0.001"
                        placeholder="e.g. 1.5"
                        value={price}
                        onChange={(e) => {
                          setPrice(e.target.value);
                          setErrors((prev) => ({ ...prev, price: '' }));
                        }}
                        className={`w-full pl-4 pr-12 py-3 bg-surface-900 border rounded-xl text-white font-mono text-sm focus:outline-none transition-all ${
                          errors.price ? 'border-rose-500' : 'border-white/10 focus:border-brand-500'
                        }`}
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold text-xs">
                        ETH
                      </span>
                    </div>
                    {errors.price && <p className="text-rose-400 text-xs mt-1">{errors.price}</p>}
                  </div>

                  {/* Auction Duration or Royalty */}
                  {isAuction ? (
                    <div>
                      <label className="block text-xs font-bold text-gray-200 uppercase tracking-wider mb-2">
                        Auction Duration
                      </label>
                      <select
                        value={auctionDuration}
                        onChange={(e) => setAuctionDuration(parseInt(e.target.value))}
                        className="w-full px-4 py-3 bg-surface-900 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-brand-500 cursor-pointer"
                      >
                        <option value={1}>1 Day (24 Hours)</option>
                        <option value={3}>3 Days</option>
                        <option value={7}>7 Days (1 Week)</option>
                        <option value={14}>14 Days (2 Weeks)</option>
                      </select>
                    </div>
                  ) : (
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-xs font-bold text-gray-200 uppercase tracking-wider">
                          Creator Royalty
                        </label>
                        <span className="text-brand-400 font-mono text-xs font-bold">{royalty}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="20"
                        step="1"
                        value={royalty}
                        onChange={(e) => setRoyalty(parseInt(e.target.value))}
                        className="w-full h-2 bg-surface-700 rounded-lg appearance-none cursor-pointer accent-brand-500 mt-2"
                      />
                      <div className="flex justify-between text-[10px] text-gray-500 mt-1">
                        <span>0%</span>
                        <span>10%</span>
                        <span>20%</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Attributes / Traits Builder */}
                <div className="pt-2">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-xs font-bold text-gray-200 uppercase tracking-wider">
                      On-Chain Attributes & Traits
                    </label>
                    <button
                      type="button"
                      onClick={handleAddAttribute}
                      className="flex items-center gap-1 text-xs text-brand-400 hover:text-brand-300 font-bold cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Trait</span>
                    </button>
                  </div>

                  <div className="space-y-2">
                    {attributes.map((attr, idx) => (
                      <div key={idx} className="flex gap-2 items-center">
                        <input
                          type="text"
                          placeholder="Trait (e.g. Element)"
                          value={attr.trait_type}
                          onChange={(e) => handleAttributeChange(idx, 'trait_type', e.target.value)}
                          className="flex-1 px-3 py-2 bg-surface-900 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-brand-500"
                        />
                        <input
                          type="text"
                          placeholder="Value (e.g. Cyber)"
                          value={attr.value}
                          onChange={(e) => handleAttributeChange(idx, 'value', e.target.value)}
                          className="flex-1 px-3 py-2 bg-surface-900 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-brand-500"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveAttribute(idx)}
                          className="p-2 rounded-xl text-gray-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Gas Estimate & Network Summary */}
                <div className="p-4 rounded-2xl bg-surface-900/80 border border-white/5 space-y-2 text-xs">
                  <div className="flex justify-between text-gray-400">
                    <span className="flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-amber-400" />
                      Estimated Network Gas
                    </span>
                    <span className="text-white font-mono font-semibold">~0.012 ETH</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span className="flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5 text-emerald-400" />
                      Smart Contract
                    </span>
                    <span className="text-gray-300 font-mono">PixelMintERC721.sol</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Available Balance</span>
                    <div className="flex items-center gap-2">
                      <span className="text-white font-mono font-bold">{user.balance.toFixed(3)} ETH</span>
                      {user.balance < 0.012 && (
                        <button
                          type="button"
                          onClick={() => addFunds(5.0)}
                          className="text-brand-400 font-bold underline cursor-pointer"
                        >
                          +5 ETH Faucet
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Submit Action Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-glow w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-brand-500 via-brand-600 to-accent-500 hover:from-brand-400 hover:to-accent-400 text-white font-bold text-sm rounded-2xl shadow-xl shadow-brand-500/25 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Sparkles className="w-4 h-4 animate-spin" />
                      <span>Minting to Blockchain...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Deploy & Mint NFT</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
