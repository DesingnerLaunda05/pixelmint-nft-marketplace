import { useState, useEffect } from 'react';
import { MarketplaceProvider } from './context/MarketplaceContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WalletModal from './components/WalletModal';
import BuyModal from './components/BuyModal';
import BidModal from './components/BidModal';
import MakeOfferModal from './components/MakeOfferModal';
import EditProfileModal from './components/EditProfileModal';
import ToastContainer from './components/ToastContainer';
import HomePage from './pages/HomePage';
import ExplorePage from './pages/ExplorePage';
import CreatePage from './pages/CreatePage';
import NFTDetailPage from './pages/NFTDetailPage';
import ProfilePage from './pages/ProfilePage';
import CollectionsPage from './pages/CollectionsPage';

function AppContent() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedNFT, setSelectedNFT] = useState('1');
  const [searchQuery, setSearchQuery] = useState('');

  // Scroll to top smoothly when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <HomePage
            setCurrentPage={setCurrentPage}
            setSelectedNFT={setSelectedNFT}
          />
        );
      case 'explore':
        return (
          <ExplorePage
            setCurrentPage={setCurrentPage}
            setSelectedNFT={setSelectedNFT}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        );
      case 'collections':
        return (
          <CollectionsPage
            setCurrentPage={setCurrentPage}
            setSearchQuery={setSearchQuery}
          />
        );
      case 'create':
        return (
          <CreatePage
            setCurrentPage={setCurrentPage}
            setSelectedNFT={setSelectedNFT}
          />
        );
      case 'nft-detail':
        return (
          <NFTDetailPage
            nftId={selectedNFT}
            setCurrentPage={setCurrentPage}
            setSelectedNFT={setSelectedNFT}
          />
        );
      case 'profile':
        return (
          <ProfilePage
            setCurrentPage={setCurrentPage}
            setSelectedNFT={setSelectedNFT}
          />
        );
      default:
        return (
          <HomePage
            setCurrentPage={setCurrentPage}
            setSelectedNFT={setSelectedNFT}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-surface-950 text-surface-200 flex flex-col font-sans selection:bg-brand-500/30 selection:text-white relative">
      <Navbar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setSelectedNFT={setSelectedNFT}
      />

      <main className="flex-1">
        {renderPage()}
      </main>

      <Footer setCurrentPage={setCurrentPage} />

      {/* Global Interactive Modals */}
      <WalletModal />
      <BuyModal />
      <BidModal />
      <MakeOfferModal />
      <EditProfileModal />

      {/* Global Toast System */}
      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <MarketplaceProvider>
      <AppContent />
    </MarketplaceProvider>
  );
}
