export interface NFT {
  id: string;
  title: string;
  image: string;
  price: string;
  currency: string;
  creator: Creator;
  owner: Creator;
  likes: number;
  category: string;
  listed: boolean;
  description: string;
  history: Transaction[];
  endTime?: string;
  highestBid?: string;
  isAuction?: boolean;
  collectionId?: string;
  collectionName?: string;
  attributes?: Attribute[];
  bids?: Bid[];
  network?: string;
  royalty?: number;
}

export interface Attribute {
  trait_type: string;
  value: string;
}

export interface Bid {
  id: string;
  bidder: string;
  bidderAddress?: string;
  bidderAvatar?: string;
  amount: string;
  date: string;
}

export interface Creator {
  name: string;
  avatar: string;
  verified: boolean;
  address: string;
  bio?: string;
}

export interface Collection {
  id: string;
  name: string;
  image: string;
  banner: string;
  creator: Creator;
  items: number;
  floorPrice: string;
  volume: string;
  change: number;
  description?: string;
  category?: string;
}

export interface Transaction {
  id?: string;
  type: 'Minted' | 'Listed' | 'Sold' | 'Transfer' | 'Bid' | 'Offer';
  from: string;
  to: string;
  price?: string;
  date: string;
  txHash?: string;
}

export interface UserProfile {
  name: string;
  handle: string;
  avatar: string;
  banner: string;
  address: string;
  bio: string;
  balance: number; // in ETH
  email?: string;
  verified: boolean;
  joinedDate: string;
}

export interface UserActivity {
  id: string;
  type: 'Purchased' | 'Minted' | 'Listed' | 'Sold' | 'Bid Placed' | 'Transferred' | 'Offer Made';
  item: string;
  itemId?: string;
  price?: string;
  time: string;
  txHash: string;
}

export interface ToastNotification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
  duration?: number;
}

export type SupportedNetwork = 'Ethereum' | 'Polygon' | 'Arbitrum' | 'Solana';
