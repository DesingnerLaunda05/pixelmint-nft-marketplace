# 💎 PixelMint — Premier Web3 NFT Marketplace & Digital Assets

![PixelMint](https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80)

PixelMint is a decentralized, high-fidelity Web3 NFT marketplace built for discovering, collecting, minting, and trading digital artworks and generative assets on the blockchain.

---

## Features

- **Instant Checkout & Web3 Gas Estimation**: Complete purchase flow with simulated atomic smart contract settlement, gas price calculation, and balance checking.
- **Timed Auctions & Live Bidding**: Real-time bid increments (+0.1, +0.5, +1.0 ETH), countdown timers, and bidder activity logs.
- **Creator Studio & Minting Protocol**: Upload custom digital artworks (PNG, JPG, WebP) with drag-and-drop or select from generative sample presets. Configure creator royalty splits (up to 20%), target blockchain, listing format, and custom ERC-721 metadata attributes.
- **Advanced Discovery & Filtering**: Real-time search by title, artist, or collection. Dynamic filters for Sale Type (*Fixed Price* vs *Auction*), *Verified Only* creators, and an interactive ETH price range slider.
- **Multi-Wallet Web3 Support**: Simulated connection interface for MetaMask, Coinbase Wallet, Phantom, WalletConnect, and Rainbow with multi-chain switching (*Ethereum*, *Polygon*, *Arbitrum*, *Solana*).
- **Integrated Test Faucet**: 1-click test faucet (`+5 ETH`) to easily test buying and bidding flows.
- **Collector Profile & Portfolio Analytics**: Real-time portfolio valuation, collected items, created artworks, favorited items, and on-chain activity timeline.
- **Persistent State**: All actions (minting, buying, bidding, favoriting, profile edits) automatically persist to `localStorage`.

---

## Tech Stack

- **Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Bundler & Tooling**: [Vite 7](https://vite.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with modern Glassmorphism, neon accents, and responsive layout
- **Icons**: [Lucide React](https://lucide.dev/)
- **Typography**: Plus Jakarta Sans & JetBrains Mono

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18.0.0 or higher)
- [npm](https://www.npmjs.com/) or [pnpm](https://pnpm.io/)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/pixelmint-nft-marketplace.git
   cd pixelmint-nft-marketplace
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Build for production**:
   ```bash
   npm run build
   ```

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
