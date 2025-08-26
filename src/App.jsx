import React, { useState } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import Header from './components/Header';
import CoinList from './components/CoinList';
import CoinDetail from './components/CoinDetail';

function App() {
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [selectedCurrency, setSelectedCurrency] = useState('usd');

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
      <div className="min-h-screen bg-light-bg dark:bg-dark-bg transition-colors">
        {!selectedCoin && <Header />}
        
        <main className={selectedCoin ? '' : 'container mx-auto px-4 py-6'}>
          {selectedCoin ? (
            <CoinDetail
              coin={selectedCoin}
              onBack={handleBackToList}
              currency={selectedCurrency}
            />
          ) : (
            <div>
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Cryptocurrency Market
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Track real-time prices and market data for top cryptocurrencies
                </p>
              </div>
              
              <CoinList 
                onCoinSelect={handleCoinSelect}
                selectedCurrency={selectedCurrency}
                onCurrencyChange={handleCurrencyChange}
              />
            </div>
          )}
        </main>
      </div>
    </ThemeProvider>
  );
}

export default App;
