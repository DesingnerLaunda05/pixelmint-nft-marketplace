import { useState } from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { X, Tag, ArrowRight } from 'lucide-react';

export default function MakeOfferModal() {
  const { offerModalNFT, setOfferModalNFT, walletConnected, setWalletModalOpen, makeOffer } = useMarketplace();
  const [offerAmount, setOfferAmount] = useState('');
  const [duration, setDuration] = useState('3 days');
  const [error, setError] = useState('');

  if (!offerModalNFT) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!walletConnected) {
      setWalletModalOpen(true);
      return;
    }

    const val = parseFloat(offerAmount);
    if (isNaN(val) || val <= 0) {
      setError('Please enter a valid offer amount');
      return;
    }

    const success = makeOffer(offerModalNFT.id, offerAmount, duration);
    if (success) {
      setOfferModalNFT(null);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setOfferModalNFT(null)} />

      <div className="relative w-full max-w-md glass rounded-3xl border border-white/10 p-6 sm:p-7 shadow-2xl overflow-hidden animate-slide-up">
        {/* Glow */}
        <div className="absolute -top-20 -left-20 w-52 h-52 bg-brand-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-5 border-b border-white/10 relative z-10">
          <div className="flex items-center gap-2">
            <Tag className="w-5 h-5 text-brand-400" />
            <h3 className="text-lg font-bold text-white">Make an Offer</h3>
          </div>
          <button
            onClick={() => setOfferModalNFT(null)}
            className="p-1.5 rounded-xl hover:bg-white/10 text-gray-400 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-5 relative z-10">
          <div className="flex items-center gap-4 p-3.5 rounded-2xl bg-surface-800/80 border border-white/5">
            <img
              src={offerModalNFT.image}
              alt={offerModalNFT.title}
              className="w-14 h-14 rounded-xl object-cover shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h4 className="text-white font-bold text-sm truncate">{offerModalNFT.title}</h4>
              <p className="text-gray-400 text-xs">Owner: {offerModalNFT.owner.name}</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-gray-400 uppercase tracking-wider block">List Price</span>
              <span className="text-white font-bold text-base">{offerModalNFT.price} ETH</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold text-gray-300">Offer Amount (ETH)</label>
            <div className="relative">
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={offerAmount}
                onChange={(e) => {
                  setOfferAmount(e.target.value);
                  setError('');
                }}
                className="w-full px-4 py-3.5 bg-surface-900 border border-white/10 rounded-xl text-white font-mono text-lg focus:outline-none focus:border-brand-500 transition-all"
                placeholder="e.g. 2.0"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold text-sm">ETH</span>
            </div>
            {error && <p className="text-rose-400 text-xs">{error}</p>}
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold text-gray-300">Offer Expiration</label>
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full px-4 py-3 bg-surface-900 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-brand-500 cursor-pointer"
            >
              <option value="1 day">1 Day</option>
              <option value="3 days">3 Days</option>
              <option value="7 days">7 Days</option>
              <option value="30 days">30 Days</option>
            </select>
          </div>

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={() => setOfferModalNFT(null)}
              className="flex-1 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 font-semibold text-sm transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-glow flex-[2] flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-400 hover:to-brand-500 text-white font-bold text-sm rounded-xl transition-all cursor-pointer"
            >
              Submit Offer
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
