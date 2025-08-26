import React, { useState } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import Header from './components/Header';
import CoinList from './components/CoinList';
import CoinDetail from './components/CoinDetail';
import LandingPage from './components/LandingPage';

function App() {
  const [showLanding, setShowLanding] = useState(true);
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [selectedCurrency, setSelectedCurrency] = useState('usd');

  const handleBackToHome = () => {
    setShowLanding(true);
    setSelectedCoin(null); // Reset selected coin when going back to home
  };

  const handleGetStarted = () => {
    setShowLanding(false);
  };

  const handleCoinSelect = (coin) => {
    setSelectedCoin(coin);
  };

  const handleBackToList = () => {
    setSelectedCoin(null);
  };

  const handleCurrencyChange = (currency) => {
    setSelectedCurrency(currency);
  };

  return (
    <ThemeProvider>
      {showLanding ? (
        <LandingPage onGetStarted={handleGetStarted} />
      ) : (
        <div className="min-h-screen bg-light-bg dark:bg-dark-bg transition-colors">
          {!selectedCoin && <Header onHomeClick={handleBackToHome} />}
          
          <main className={selectedCoin ? '' : 'container mx-auto px-4 py-6'}>
            {selectedCoin ? (
              <CoinDetail
                coin={selectedCoin}
                onBack={handleBackToList}
                currency={selectedCurrency}
              />
            ) : (
              <div>
                <CoinList 
                  onCoinSelect={handleCoinSelect}
                  selectedCurrency={selectedCurrency}
                  onCurrencyChange={handleCurrencyChange}
                />
              </div>
            )}
          </main>
        </div>
      )}
    </ThemeProvider>
  );
}

export default App;
