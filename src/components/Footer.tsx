import { useState } from 'react';
import { Hexagon, Twitter, Github, MessageCircle, Globe, Send, Sparkles, CheckCircle2 } from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';

interface FooterProps {
  setCurrentPage: (page: string) => void;
}

export default function Footer({ setCurrentPage }: FooterProps) {
  const { addToast } = useMarketplace();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      addToast('Invalid Email', 'Please provide a valid email address', 'warning');
      return;
    }
    setSubscribed(true);
    addToast('Subscribed! ✨', 'You are now subscribed to PixelMint drops and news!', 'success');
  };

  return (
    <footer className="border-t border-white/10 bg-surface-950 relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-1 space-y-4">
            <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setCurrentPage('home')}>
              <Hexagon className="w-8 h-8 text-brand-500" fill="currentColor" />
              <span className="text-xl font-extrabold gradient-text">PixelMint</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              The premier decentralized marketplace for high-fidelity digital art, algorithmically generated collectibles, and Web3 virtual assets.
            </p>
            <div className="flex items-center gap-2.5 pt-2">
              {[
                { icon: Twitter, href: 'https://twitter.com', name: 'Twitter' },
                { icon: Github, href: 'https://github.com', name: 'GitHub' },
                { icon: MessageCircle, href: 'https://discord.com', name: 'Discord' },
                { icon: Globe, href: 'https://pixelmint.io', name: 'Web' },
              ].map((item, i) => (
                <a
                  key={i}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  title={item.name}
                  className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-brand-500/40 hover:bg-brand-500/10 transition-all cursor-pointer"
                >
                  <item.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Marketplace Navigation */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Marketplace</h4>
            <ul className="space-y-2.5">
              {[
                { name: 'Explore Artworks', page: 'explore' },
                { name: 'Top Collections', page: 'collections' },
                { name: 'Mint New NFT', page: 'create' },
                { name: 'User Profile & Portfolio', page: 'profile' },
              ].map((item) => (
                <li key={item.name}>
                  <button
                    onClick={() => {
                      setCurrentPage(item.page);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="text-gray-400 hover:text-brand-300 text-sm transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <span>{item.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Ecosystem / Web3 Resources */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Ecosystem</h4>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li className="hover:text-brand-300 transition-colors cursor-pointer">ERC-721 Token Standards</li>
              <li className="hover:text-brand-300 transition-colors cursor-pointer">Verified Smart Contracts</li>
              <li className="hover:text-brand-300 transition-colors cursor-pointer">IPFS Decentralized Storage</li>
              <li className="hover:text-brand-300 transition-colors cursor-pointer">Web3 Developer Docs</li>
              <li className="hover:text-brand-300 transition-colors cursor-pointer">Gas Optimization Specs</li>
            </ul>
          </div>

          {/* Newsletter Form */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-accent-400" /> Stay in the Loop
            </h4>
            <p className="text-gray-400 text-sm mb-4 leading-relaxed">
              Get notified about exclusive drops, curated genesis collections, and zero-fee auctions.
            </p>
            {subscribed ? (
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>You're on the whitelist! Check your inbox soon.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-surface-900 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-brand-500 transition-all pr-12"
                  />
                  <button
                    type="submit"
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-brand-500 hover:bg-brand-400 text-white transition-colors cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
                <span className="text-[11px] text-gray-500 block">No spam. Only high-value drops and protocol updates.</span>
              </form>
            )}
          </div>
        </div>

        <div className="mt-14 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} PixelMint Protocol. All digital rights verified on the blockchain.</p>
          <div className="flex gap-6">
            <span className="hover:text-gray-300 transition-colors cursor-pointer">Privacy Policy</span>
            <span className="hover:text-gray-300 transition-colors cursor-pointer">Terms of Service</span>
            <span className="hover:text-gray-300 transition-colors cursor-pointer">Smart Contract Audits</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
