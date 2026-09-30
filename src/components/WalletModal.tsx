import { useState } from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { X, Shield, Zap, ChevronRight, Loader2 } from 'lucide-react';

const wallets = [
  { name: 'MetaMask', icon: '🦊', description: 'Connect using browser extension or mobile app', popular: true },
  { name: 'WalletConnect', icon: '🔗', description: 'Scan QR code with any mobile Web3 wallet', popular: true },
  { name: 'Coinbase Wallet', icon: '🔵', description: 'Connect using Coinbase self-custody wallet', popular: false },
  { name: 'Phantom', icon: '👻', description: 'Connect Phantom multi-chain wallet', popular: false },
  { name: 'Rainbow', icon: '🌈', description: 'Ethereum wallet crafted for digital assets', popular: false },
];

export default function WalletModal() {
  const { walletModalOpen, setWalletModalOpen, connectWallet } = useMarketplace();
  const [connectingWallet, setConnectingWallet] = useState<string | null>(null);

  if (!walletModalOpen) return null;

  const handleSelectWallet = (name: string) => {
    setConnectingWallet(name);
    setTimeout(() => {
      connectWallet(name);
      setConnectingWallet(null);
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => !connectingWallet && setWalletModalOpen(false)} />
      
      {/* Modal */}
      <div className="relative w-full max-w-md glass rounded-3xl border border-white/10 p-6 sm:p-7 shadow-2xl overflow-hidden animate-slide-up">
        {/* Glow */}
        <div className="absolute -top-20 -right-20 w-48 h-48 bg-brand-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-5 border-b border-white/10 relative z-10">
          <div>
            <h2 className="text-xl font-extrabold text-white">Connect Wallet</h2>
            <p className="text-xs text-gray-400 mt-0.5">Select your preferred Web3 provider</p>
          </div>
          <button
            onClick={() => setWalletModalOpen(false)}
            disabled={!!connectingWallet}
            className="p-1.5 rounded-xl hover:bg-white/10 text-gray-400 hover:text-white transition-all cursor-pointer disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="py-5 space-y-2.5 relative z-10">
          {wallets.map((wallet) => {
            const isThisConnecting = connectingWallet === wallet.name;
            return (
              <button
                key={wallet.name}
                onClick={() => handleSelectWallet(wallet.name)}
                disabled={!!connectingWallet}
                className={`w-full flex items-center gap-4 p-3.5 rounded-2xl border transition-all group cursor-pointer text-left ${
                  isThisConnecting
                    ? 'bg-brand-500/20 border-brand-500/50'
                    : 'bg-surface-900/60 hover:bg-white/5 border-white/5 hover:border-brand-500/30'
                }`}
              >
                <div className="w-11 h-11 rounded-xl bg-white/5 flex items-center justify-center text-2xl shrink-0 group-hover:scale-105 transition-transform">
                  {wallet.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-white font-semibold text-sm">{wallet.name}</span>
                    {wallet.popular && (
                      <span className="px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-300 text-[10px] font-bold tracking-wide">
                        POPULAR
                      </span>
                    )}
                  </div>
                  <span className="text-gray-400 text-xs block truncate mt-0.5">{wallet.description}</span>
                </div>
                <div className="shrink-0">
                  {isThisConnecting ? (
                    <Loader2 className="w-5 h-5 text-brand-400 animate-spin" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-brand-400 group-hover:translate-x-0.5 transition-all" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-white/10 relative z-10 flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>End-to-End Encrypted</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Gas-Optimized</span>
          </div>
        </div>
      </div>
    </div>
  );
}
