import React, { createContext, useContext, useState, useEffect } from 'react';
import { NFT, Collection, UserProfile, UserActivity, ToastNotification, SupportedNetwork } from '../types';
import { nfts as defaultNFTs, collections as defaultCollections, defaultUserProfile, initialUserActivities } from '../data/mockData';

interface MarketplaceContextType {
  nfts: NFT[];
  collections: Collection[];
  user: UserProfile;
  walletConnected: boolean;
  connectedWalletName: string | null;
  activeNetwork: SupportedNetwork;
  likedIds: string[];
  userActivities: UserActivity[];
  toasts: ToastNotification[];
  
  // Modals
  walletModalOpen: boolean;
  setWalletModalOpen: (open: boolean) => void;
  buyModalNFT: NFT | null;
  setBuyModalNFT: (nft: NFT | null) => void;
  bidModalNFT: NFT | null;
  setBidModalNFT: (nft: NFT | null) => void;
  offerModalNFT: NFT | null;
  setOfferModalNFT: (nft: NFT | null) => void;
  editProfileOpen: boolean;
  setEditProfileOpen: (open: boolean) => void;

  // Actions
  toggleLike: (nftId: string) => void;
  connectWallet: (walletName?: string) => void;
  disconnectWallet: () => void;
  switchNetwork: (network: SupportedNetwork) => void;
  addFunds: (amount?: number) => void;
  buyNFT: (nftId: string) => boolean;
  placeBid: (nftId: string, amount: string) => boolean;
  makeOffer: (nftId: string, amount: string, duration?: string) => boolean;
  mintNFT: (data: {
    title: string;
    description: string;
    price: string;
    category: string;
    image: string;
    royalty: number;
    network: string;
    isAuction: boolean;
    auctionDurationDays?: number;
    attributes?: { trait_type: string; value: string }[];
  }) => string;
  updateProfile: (updated: Partial<UserProfile>) => void;
  addToast: (title: string, message: string, type?: ToastNotification['type'], duration?: number) => void;
  removeToast: (id: string) => void;
  resetAllDemoData: () => void;
}

const MarketplaceContext = createContext<MarketplaceContextType | undefined>(undefined);

export const MarketplaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // NFTs State with localStorage persistence
  const [nfts, setNfts] = useState<NFT[]>(() => {
    try {
      const saved = localStorage.getItem('pixelmint_nfts');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load NFTs from localStorage', e);
    }
    return defaultNFTs;
  });

  // Collections State
  const [collections, setCollections] = useState<Collection[]>(() => {
    try {
      const saved = localStorage.getItem('pixelmint_collections');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load collections from localStorage', e);
    }
    return defaultCollections;
  });

  // User Profile
  const [user, setUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('pixelmint_user');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load user from localStorage', e);
    }
    return defaultUserProfile;
  });

  // Wallet State
  const [walletConnected, setWalletConnected] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('pixelmint_wallet_connected');
      return saved === 'true';
    } catch (e) {
      return false;
    }
  });

  const [connectedWalletName, setConnectedWalletName] = useState<string | null>(() => {
    return localStorage.getItem('pixelmint_wallet_name') || 'MetaMask';
  });

  const [activeNetwork, setActiveNetwork] = useState<SupportedNetwork>('Ethereum');

  // Liked NFTs
  const [likedIds, setLikedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('pixelmint_liked');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load liked NFTs from localStorage', e);
    }
    return ['5', '7']; // Default liked
  });

  // User Activities
  const [userActivities, setUserActivities] = useState<UserActivity[]>(() => {
    try {
      const saved = localStorage.getItem('pixelmint_activities');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load activities', e);
    }
    return initialUserActivities;
  });

  // Toasts
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  // Modals
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const [buyModalNFT, setBuyModalNFT] = useState<NFT | null>(null);
  const [bidModalNFT, setBidModalNFT] = useState<NFT | null>(null);
  const [offerModalNFT, setOfferModalNFT] = useState<NFT | null>(null);
  const [editProfileOpen, setEditProfileOpen] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('pixelmint_nfts', JSON.stringify(nfts));
    } catch (e) {
      console.error(e);
    }
  }, [nfts]);

  useEffect(() => {
    try {
      localStorage.setItem('pixelmint_collections', JSON.stringify(collections));
    } catch (e) {
      console.error(e);
    }
  }, [collections]);

  useEffect(() => {
    try {
      localStorage.setItem('pixelmint_user', JSON.stringify(user));
    } catch (e) {
      console.error(e);
    }
  }, [user]);

  useEffect(() => {
    try {
      localStorage.setItem('pixelmint_wallet_connected', walletConnected ? 'true' : 'false');
      if (connectedWalletName) {
        localStorage.setItem('pixelmint_wallet_name', connectedWalletName);
      }
    } catch (e) {
      console.error(e);
    }
  }, [walletConnected, connectedWalletName]);

  useEffect(() => {
    try {
      localStorage.setItem('pixelmint_liked', JSON.stringify(likedIds));
    } catch (e) {
      console.error(e);
    }
  }, [likedIds]);

  useEffect(() => {
    try {
      localStorage.setItem('pixelmint_activities', JSON.stringify(userActivities));
    } catch (e) {
      console.error(e);
    }
  }, [userActivities]);

  // Toast Helper
  const addToast = (
    title: string,
    message: string,
    type: ToastNotification['type'] = 'info',
    duration: number = 4000
  ) => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 6);
    const newToast: ToastNotification = { id, title, message, type, duration };
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      removeToast(id);
    }, duration);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Toggle Like
  const toggleLike = (nftId: string) => {
    const isLiked = likedIds.includes(nftId);
    let newLikedIds: string[];
    if (isLiked) {
      newLikedIds = likedIds.filter((id) => id !== nftId);
    } else {
      newLikedIds = [...likedIds, nftId];
    }
    setLikedIds(newLikedIds);

    setNfts((prev) =>
      prev.map((nft) => {
        if (nft.id === nftId) {
          return {
            ...nft,
            likes: isLiked ? Math.max(0, nft.likes - 1) : nft.likes + 1,
          };
        }
        return nft;
      })
    );
  };

  // Connect Wallet
  const connectWallet = (walletName = 'MetaMask') => {
    setWalletConnected(true);
    setConnectedWalletName(walletName);
    setWalletModalOpen(false);
    addToast('Wallet Connected', `Connected to ${walletName} (${user.address.slice(0, 6)}...${user.address.slice(-4)})`, 'success');
  };

  // Disconnect Wallet
  const disconnectWallet = () => {
    setWalletConnected(false);
    addToast('Wallet Disconnected', 'Your wallet has been safely disconnected', 'info');
  };

  // Switch Network
  const switchNetwork = (network: SupportedNetwork) => {
    setActiveNetwork(network);
    addToast('Network Changed', `Switched active blockchain to ${network}`, 'info');
  };

  // Add Funds (Faucet)
  const addFunds = (amount = 5.0) => {
    setUser((prev) => ({
      ...prev,
      balance: parseFloat((prev.balance + amount).toFixed(4)),
    }));
    addToast('Faucet Funds Added', `Successfully credited +${amount} ETH to your test wallet!`, 'success');
  };

  // Buy NFT
  const buyNFT = (nftId: string): boolean => {
    const nft = nfts.find((n) => n.id === nftId);
    if (!nft) {
      addToast('Error', 'NFT not found', 'error');
      return false;
    }

    if (!walletConnected) {
      setWalletModalOpen(true);
      return false;
    }

    const price = parseFloat(nft.price);
    const gasFee = 0.0035;
    const totalCost = price + gasFee;

    if (user.balance < totalCost) {
      addToast('Insufficient Funds', `You need ${totalCost.toFixed(3)} ETH (including ~0.004 ETH gas). Current balance: ${user.balance.toFixed(3)} ETH.`, 'error');
      return false;
    }

    // Deduct balance
    setUser((prev) => ({
      ...prev,
      balance: parseFloat((prev.balance - totalCost).toFixed(4)),
    }));

    const txHash = '0x' + Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    const nowStr = new Date().toISOString().split('T')[0];

    // Transfer ownership
    setNfts((prev) =>
      prev.map((n) => {
        if (n.id === nftId) {
          return {
            ...n,
            owner: {
              name: user.name,
              avatar: user.avatar,
              verified: user.verified,
              address: user.address,
            },
            history: [
              {
                type: 'Sold',
                from: n.owner.name,
                to: user.name,
                price: n.price,
                date: nowStr,
                txHash,
              },
              ...n.history,
            ],
          };
        }
        return n;
      })
    );

    // Record activity
    const newActivity: UserActivity = {
      id: 'act-' + Date.now(),
      type: 'Purchased',
      item: nft.title,
      itemId: nft.id,
      price: `${nft.price} ETH`,
      time: 'Just now',
      txHash: txHash.slice(0, 6) + '...' + txHash.slice(-4),
    };
    setUserActivities((prev) => [newActivity, ...prev]);

    // Close modal if open
    setBuyModalNFT(null);
    addToast('Purchase Successful! 🎉', `You now own "${nft.title}"! Transferred ${nft.price} ETH.`, 'success');
    return true;
  };

  // Place Bid
  const placeBid = (nftId: string, amount: string): boolean => {
    const nft = nfts.find((n) => n.id === nftId);
    if (!nft) return false;

    if (!walletConnected) {
      setWalletModalOpen(true);
      return false;
    }

    const bidNum = parseFloat(amount);
    const currentHigh = parseFloat(nft.highestBid || nft.price);

    if (isNaN(bidNum) || bidNum <= currentHigh) {
      addToast('Invalid Bid', `Your bid must be higher than current bid of ${currentHigh} ETH`, 'warning');
      return false;
    }

    if (user.balance < bidNum) {
      addToast('Insufficient Funds', `Your balance is ${user.balance} ETH, but bid is ${bidNum} ETH`, 'error');
      return false;
    }

    const txHash = '0x' + Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    const nowStr = new Date().toISOString().split('T')[0];

    const newBid = {
      id: 'bid-' + Date.now(),
      bidder: user.name,
      bidderAvatar: user.avatar,
      bidderAddress: user.address,
      amount: bidNum.toFixed(2),
      date: 'Just now',
    };

    setNfts((prev) =>
      prev.map((n) => {
        if (n.id === nftId) {
          return {
            ...n,
            highestBid: bidNum.toFixed(2),
            bids: [newBid, ...(n.bids || [])],
            history: [
              {
                type: 'Bid',
                from: user.name,
                to: 'Marketplace',
                price: bidNum.toFixed(2),
                date: nowStr,
                txHash,
              },
              ...n.history,
            ],
          };
        }
        return n;
      })
    );

    // Record activity
    const newActivity: UserActivity = {
      id: 'act-' + Date.now(),
      type: 'Bid Placed',
      item: nft.title,
      itemId: nft.id,
      price: `${bidNum.toFixed(2)} ETH`,
      time: 'Just now',
      txHash: txHash.slice(0, 6) + '...' + txHash.slice(-4),
    };
    setUserActivities((prev) => [newActivity, ...prev]);

    setBidModalNFT(null);
    addToast('Bid Placed Successfully! ⚡', `Your bid of ${bidNum.toFixed(2)} ETH is now the highest bid!`, 'success');
    return true;
  };

  // Make Offer
  const makeOffer = (nftId: string, amount: string, duration = '3 days'): boolean => {
    const nft = nfts.find((n) => n.id === nftId);
    if (!nft) return false;

    if (!walletConnected) {
      setWalletModalOpen(true);
      return false;
    }

    const offerNum = parseFloat(amount);
    if (isNaN(offerNum) || offerNum <= 0) {
      addToast('Invalid Offer', 'Please enter a valid offer amount', 'warning');
      return false;
    }

    const txHash = '0x' + Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join('');

    const newActivity: UserActivity = {
      id: 'act-' + Date.now(),
      type: 'Offer Made',
      item: nft.title,
      itemId: nft.id,
      price: `${offerNum.toFixed(2)} ETH`,
      time: 'Just now',
      txHash: txHash.slice(0, 6) + '...' + txHash.slice(-4),
    };
    setUserActivities((prev) => [newActivity, ...prev]);

    setOfferModalNFT(null);
    addToast('Offer Submitted! 🤝', `Your offer of ${offerNum.toFixed(2)} ETH (${duration}) has been sent to the owner!`, 'success');
    return true;
  };

  // Mint NFT
  const mintNFT = (data: {
    title: string;
    description: string;
    price: string;
    category: string;
    image: string;
    royalty: number;
    network: string;
    isAuction: boolean;
    auctionDurationDays?: number;
    attributes?: { trait_type: string; value: string }[];
  }): string => {
    const gasCost = 0.012;
    if (user.balance < gasCost) {
      addToast('Insufficient Gas', `Minting requires ~${gasCost} ETH gas. Please add demo funds to your wallet!`, 'error');
      return '';
    }

    // Deduct gas
    setUser((prev) => ({
      ...prev,
      balance: parseFloat((prev.balance - gasCost).toFixed(4)),
    }));

    const newId = (nfts.length + 1).toString();
    const txHash = '0x' + Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    const nowStr = new Date().toISOString().split('T')[0];

    const currentCreator = {
      name: user.name,
      avatar: user.avatar,
      verified: user.verified,
      address: user.address,
      bio: user.bio,
    };

    let endTime: string | undefined;
    if (data.isAuction) {
      const days = data.auctionDurationDays || 3;
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() + days);
      endTime = targetDate.toISOString().split('T')[0];
    }

    const newNFT: NFT = {
      id: newId,
      title: data.title,
      description: data.description,
      image: data.image,
      price: data.price,
      currency: 'ETH',
      creator: currentCreator,
      owner: currentCreator,
      likes: 1,
      category: data.category,
      listed: true,
      network: data.network || 'Ethereum',
      royalty: data.royalty || 10,
      isAuction: data.isAuction,
      highestBid: data.isAuction ? data.price : undefined,
      endTime,
      attributes: data.attributes || [
        { trait_type: 'Originality', value: '1 of 1 Edition' },
        { trait_type: 'Minted Via', value: 'PixelMint Studio' }
      ],
      bids: [],
      history: [
        {
          type: 'Minted',
          from: 'Genesis Contract',
          to: user.name,
          date: nowStr,
          txHash,
        },
        {
          type: 'Listed',
          from: user.name,
          to: 'PixelMint Marketplace',
          price: data.price,
          date: nowStr,
          txHash,
        }
      ],
    };

    setNfts((prev) => [newNFT, ...prev]);

    // Record activity
    const newActivity: UserActivity = {
      id: 'act-' + Date.now(),
      type: 'Minted',
      item: data.title,
      itemId: newId,
      price: `${data.price} ETH`,
      time: 'Just now',
      txHash: txHash.slice(0, 6) + '...' + txHash.slice(-4),
    };
    setUserActivities((prev) => [newActivity, ...prev]);

    addToast('NFT Minted On-Chain! 🚀', `"${data.title}" was successfully created and listed on ${data.network || 'Ethereum'}!`, 'success');
    return newId;
  };

  // Update Profile
  const updateProfile = (updated: Partial<UserProfile>) => {
    setUser((prev) => ({
      ...prev,
      ...updated,
    }));
    setEditProfileOpen(false);
    addToast('Profile Updated', 'Your profile details were saved successfully!', 'success');
  };

  // Reset demo data
  const resetAllDemoData = () => {
    localStorage.removeItem('pixelmint_nfts');
    localStorage.removeItem('pixelmint_collections');
    localStorage.removeItem('pixelmint_user');
    localStorage.removeItem('pixelmint_liked');
    localStorage.removeItem('pixelmint_activities');
    setNfts(defaultNFTs);
    setCollections(defaultCollections);
    setUser(defaultUserProfile);
    setLikedIds(['5', '7']);
    setUserActivities(initialUserActivities);
    addToast('Data Reset', 'Restored marketplace demo data to default states', 'info');
  };

  return (
    <MarketplaceContext.Provider
      value={{
        nfts,
        collections,
        user,
        walletConnected,
        connectedWalletName,
        activeNetwork,
        likedIds,
        userActivities,
        toasts,
        walletModalOpen,
        setWalletModalOpen,
        buyModalNFT,
        setBuyModalNFT,
        bidModalNFT,
        setBidModalNFT,
        offerModalNFT,
        setOfferModalNFT,
        editProfileOpen,
        setEditProfileOpen,
        toggleLike,
        connectWallet,
        disconnectWallet,
        switchNetwork,
        addFunds,
        buyNFT,
        placeBid,
        makeOffer,
        mintNFT,
        updateProfile,
        addToast,
        removeToast,
        resetAllDemoData,
      }}
    >
      {children}
    </MarketplaceContext.Provider>
  );
};

export const useMarketplace = () => {
  const context = useContext(MarketplaceContext);
  if (!context) {
    throw new Error('useMarketplace must be used within a MarketplaceProvider');
  }
  return context;
};
