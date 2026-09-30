import { useState } from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { X, ShieldCheck, Zap, Plus, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';

export default function BuyModal() {
  const { buyModalNFT, setBuyModalNFT, user, walletConnected, setWalletModalOpen, buyNFT, addFunds } = useMarketplace();
  const [step, setStep] = useState<'checkout' | 'processing' | 'confirmed'>('checkout');

  if (!buyModalNFT) return null;

  const priceNum = parseFloat(buyModalNFT.price);
  const gasFee = 0.0035;
  const totalCost = priceNum + gasFee;
  const ethToUsd = 3450;
  const isInsufficient = walletConnected && user.balance < totalCost;

  const handleConfirmPurchase = async () => {
    if (!walletConnected) {
      setWalletModalOpen(true);
      return;
    }

    if (isInsufficient) return;

    setStep('processing');
    
    // Simulate realistic blockchain transaction stages
    setTimeout(() => {
      const success = buyNFT(buyModalNFT.id);
      if (success) {
        setStep('confirmed');
        setTimeout(() => {
          setBuyModalNFT(null);
          setStep('checkout');
        }, 1800);
      } else {
        setStep('checkout');
      }
    }, 1200);
  };

  const handleClose = () => {
    if (step === 'processing') return;
    setBuyModalNFT(null);
    setStep('checkout');
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity" onClick={handleClose} />

      <div className="relative w-full max-w-lg glass rounded-3xl border border-white/10 p-6 sm:p-7 shadow-2xl overflow-hidden animate-slide-up">
        {/* Glow backdrop */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-brand-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-accent-400/20 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-5 border-b border-white/10 relative z-10">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-brand-400" />
            <h3 className="text-lg font-bold text-white">Instant Checkout</h3>
          </div>
          <button
            onClick={handleClose}
            disabled={step === 'processing'}
            className="p-1.5 rounded-xl hover:bg-white/10 text-gray-400 hover:text-white transition-all cursor-pointer disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {step === 'checkout' && (
          <div className="mt-5 space-y-5 relative z-10">
            {/* NFT Card Preview */}
            <div className="flex items-center gap-4 p-3.5 rounded-2xl bg-surface-800/80 border border-white/5">
              <img
                src={buyModalNFT.image}
                alt={buyModalNFT.title}
                className="w-16 h-16 rounded-xl object-cover shrink-0"
              />
              <div className="flex-1 min-w-0">
                <span className="text-xs font-semibold text-brand-400 uppercase tracking-wider">{buyModalNFT.category}</span>
                <h4 className="text-white font-bold text-base truncate">{buyModalNFT.title}</h4>
                <p className="text-gray-400 text-xs truncate">by {buyModalNFT.creator.name}</p>
              </div>
              <div className="text-right">
                <p className="text-white font-bold text-base">{buyModalNFT.price} ETH</p>
                <p className="text-gray-400 text-xs">≈ ${(priceNum * ethToUsd).toLocaleString()}</p>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="space-y-2.5 p-4 rounded-2xl bg-surface-900/60 border border-white/5 text-sm">
              <div className="flex justify-between text-gray-400">
                <span>NFT Price</span>
                <span className="text-white font-medium">{buyModalNFT.price} ETH</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span className="flex items-center gap-1">
                  Estimated Gas Fee
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-gray-400">Fast</span>
                </span>
                <span className="text-white font-medium">~{gasFee} ETH</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Creator Royalty</span>
                <span className="text-brand-400 font-medium">{buyModalNFT.royalty || 10}%</span>
              </div>
              <div className="pt-2 border-t border-white/10 flex justify-between items-baseline">
                <span className="text-white font-semibold">Total Cost</span>
                <div className="text-right">
                  <span className="text-xl font-extrabold text-white">{totalCost.toFixed(4)} ETH</span>
                  <p className="text-xs text-gray-400">≈ ${(totalCost * ethToUsd).toFixed(2)} USD</p>
                </div>
              </div>
            </div>

            {/* Wallet Balance Status */}
            {walletConnected ? (
              <div className={`p-4 rounded-2xl border ${isInsufficient ? 'bg-rose-500/10 border-rose-500/30' : 'bg-emerald-500/10 border-emerald-500/20'} flex items-center justify-between`}>
                <div>
                  <p className="text-xs text-gray-400">Your Wallet Balance</p>
                  <p className={`text-sm font-bold ${isInsufficient ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {user.balance.toFixed(4)} ETH
                  </p>
                </div>
                {isInsufficient && (
                  <button
                    onClick={() => addFunds(5.0)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-500/30 hover:bg-brand-500/50 text-brand-300 text-xs font-semibold transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Faucet (+5 ETH)
                  </button>
                )}
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
                <p className="text-xs text-amber-300">Connect wallet to complete transaction</p>
                <button
                  onClick={() => setWalletModalOpen(true)}
                  className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold rounded-xl cursor-pointer transition-all"
                >
                  Connect
                </button>
              </div>
            )}

            {/* Actions */}
            <div className="pt-2 flex gap-3">
              <button
                onClick={handleClose}
                className="flex-1 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 font-semibold text-sm transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmPurchase}
                disabled={isInsufficient}
                className="btn-glow flex-[2] flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-400 hover:to-brand-500 text-white font-bold text-sm rounded-xl transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirm Purchase
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {step === 'processing' && (
          <div className="py-12 text-center space-y-4 relative z-10 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-brand-500/20 border border-brand-500/40 flex items-center justify-center mx-auto animate-pulse">
              <Loader2 className="w-8 h-8 text-brand-400 animate-spin" />
            </div>
            <h4 className="text-xl font-bold text-white">Confirming on Blockchain</h4>
            <p className="text-gray-400 text-sm max-w-xs mx-auto">
              Please wait while your smart contract purchase order is verified on the network...
            </p>
            <div className="flex items-center justify-center gap-2 text-xs text-brand-400 font-mono">
              <Zap className="w-3.5 h-3.5 animate-bounce" />
              Gas price: 24 Gwei
            </div>
          </div>
        )}

        {step === 'confirmed' && (
          <div className="py-10 text-center space-y-4 relative z-10 animate-slide-up">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-9 h-9 text-emerald-400" />
            </div>
            <h4 className="text-xl font-bold text-white">Purchase Confirmed!</h4>
            <p className="text-gray-400 text-sm max-w-xs mx-auto">
              "{buyModalNFT.title}" has been transferred to your wallet inventory.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
