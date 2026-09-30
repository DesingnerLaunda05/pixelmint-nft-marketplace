import { useState, useEffect } from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { X, Gavel, Plus, ArrowRight, Clock } from 'lucide-react';

export default function BidModal() {
  const { bidModalNFT, setBidModalNFT, user, walletConnected, setWalletModalOpen, placeBid, addFunds } = useMarketplace();
  const [bidAmount, setBidAmount] = useState('');
  const [error, setError] = useState('');

  const currentHighest = bidModalNFT
    ? parseFloat(bidModalNFT.highestBid || bidModalNFT.price)
    : 0;

  useEffect(() => {
    if (bidModalNFT) {
      const minNext = (parseFloat(bidModalNFT.highestBid || bidModalNFT.price) + 0.1).toFixed(2);
      setBidAmount(minNext);
      setError('');
    }
  }, [bidModalNFT]);

  if (!bidModalNFT) return null;

  const handleIncrement = (amount: number) => {
    const current = parseFloat(bidAmount) || currentHighest;
    setBidAmount((current + amount).toFixed(2));
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!walletConnected) {
      setWalletModalOpen(true);
      return;
    }

    const val = parseFloat(bidAmount);
    if (isNaN(val) || val <= currentHighest) {
      setError(`Bid must be higher than ${currentHighest.toFixed(2)} ETH`);
      return;
    }

    if (user.balance < val) {
      setError(`Insufficient balance (${user.balance.toFixed(3)} ETH)`);
      return;
    }

    const success = placeBid(bidModalNFT.id, bidAmount);
    if (success) {
      setBidModalNFT(null);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setBidModalNFT(null)} />

      <div className="relative w-full max-w-md glass rounded-3xl border border-white/10 p-6 sm:p-7 shadow-2xl overflow-hidden animate-slide-up">
        {/* Glow */}
        <div className="absolute -top-20 -right-20 w-52 h-52 bg-accent-400/20 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-5 border-b border-white/10 relative z-10">
          <div className="flex items-center gap-2">
            <Gavel className="w-5 h-5 text-accent-400" />
            <h3 className="text-lg font-bold text-white">Place a Bid</h3>
          </div>
          <button
            onClick={() => setBidModalNFT(null)}
            className="p-1.5 rounded-xl hover:bg-white/10 text-gray-400 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-5 relative z-10">
          {/* NFT Card Preview */}
          <div className="flex items-center gap-4 p-3.5 rounded-2xl bg-surface-800/80 border border-white/5">
            <img
              src={bidModalNFT.image}
              alt={bidModalNFT.title}
              className="w-14 h-14 rounded-xl object-cover shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h4 className="text-white font-bold text-sm truncate">{bidModalNFT.title}</h4>
              <p className="text-gray-400 text-xs">by {bidModalNFT.creator.name}</p>
              {bidModalNFT.endTime && (
                <div className="flex items-center gap-1 text-[11px] text-accent-400 mt-1">
                  <Clock className="w-3 h-3" />
                  <span>Ends: {bidModalNFT.endTime}</span>
                </div>
              )}
            </div>
            <div className="text-right">
              <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Current Bid</span>
              <span className="text-white font-bold text-base">{currentHighest.toFixed(2)} ETH</span>
            </div>
          </div>

          {/* Bid Input */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-gray-300">Your Bid (ETH)</label>
            <div className="relative">
              <input
                type="number"
                step="0.01"
                min={currentHighest + 0.01}
                value={bidAmount}
                onChange={(e) => {
                  setBidAmount(e.target.value);
                  setError('');
                }}
                className="w-full px-4 py-3.5 bg-surface-900 border border-white/10 rounded-xl text-white font-mono text-lg focus:outline-none focus:border-accent-400 transition-all"
                placeholder="0.00"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold text-sm">ETH</span>
            </div>
            {error && <p className="text-rose-400 text-xs">{error}</p>}
          </div>

          {/* Quick Increments */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">Quick add:</span>
            {[0.1, 0.5, 1.0].map((inc) => (
              <button
                type="button"
                key={inc}
                onClick={() => handleIncrement(inc)}
                className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-gray-300 hover:text-white font-mono transition-all cursor-pointer"
              >
                +{inc} ETH
              </button>
            ))}
          </div>

          {/* Balance */}
          {walletConnected ? (
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-surface-900/60 border border-white/5 text-xs">
              <span className="text-gray-400">Available Balance:</span>
              <div className="flex items-center gap-2">
                <span className="text-white font-bold">{user.balance.toFixed(3)} ETH</span>
                {user.balance < parseFloat(bidAmount || '0') && (
                  <button
                    type="button"
                    onClick={() => addFunds(5.0)}
                    className="flex items-center gap-1 text-accent-400 hover:text-accent-300 font-semibold cursor-pointer"
                  >
                    <Plus className="w-3 h-3" /> Faucet
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex justify-between items-center">
              <span>Connect wallet to bid</span>
              <button
                type="button"
                onClick={() => setWalletModalOpen(true)}
                className="font-bold underline cursor-pointer"
              >
                Connect Now
              </button>
            </div>
          )}

          {/* Submit */}
          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={() => setBidModalNFT(null)}
              className="flex-1 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 font-semibold text-sm transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-glow flex-[2] flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-accent-500 to-brand-500 hover:from-accent-400 hover:to-brand-400 text-white font-bold text-sm rounded-xl transition-all cursor-pointer"
            >
              Confirm Bid
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
