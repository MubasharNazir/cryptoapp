import React, { useState, useEffect } from 'react';
import { getCryptocurrencies, clearCurrencyCache, resetDataCache } from '../services/api';
import CoinCard from './CoinCard';
import SearchBar from './SearchBar';
import LoadingSpinner from './LoadingSpinner';

const CoinList = ({ onCoinSelect, selectedCurrency = 'usd', onCurrencyChange }) => {
  const [coins, setCoins] = useState([]);
  const [filteredCoins, setFilteredCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [lastUpdate, setLastUpdate] = useState(null);
  const [isAutoRefreshing, setIsAutoRefreshing] = useState(true);
  const [dataSource, setDataSource] = useState('loading'); // 'real', 'mock', 'cached', 'loading'

  useEffect(() => {
    // Reset cache on component mount (fresh page load)
    resetDataCache();
    fetchCoins();
  }, []);

  // Auto-refresh every 5 seconds (exactly as requested)
  useEffect(() => {
    if (!isAutoRefreshing) return;
    
    console.log('⏰ Setting up 5-second auto-refresh interval');
    const interval = setInterval(() => {
      console.log('🔄 Auto-refresh triggered (5s interval)');
      fetchCoins(true); // Pass true to indicate it's an auto-refresh
    }, 5000); // Exactly 5 seconds

    return () => {
      console.log('⏹️ Clearing auto-refresh interval');
      clearInterval(interval);
    };
  }, [isAutoRefreshing, selectedCurrency]); // Re-setup interval when currency changes

  useEffect(() => {
    applyFilters();
  }, [coins, searchTerm, filter]);

  // Refetch when currency changes
  useEffect(() => {
    console.log('Currency changed to:', selectedCurrency);
    clearCurrencyCache(); // Clear cache when currency changes
    fetchCoins();
  }, [selectedCurrency]);

  const fetchCoins = async (isAutoRefresh = false) => {
    try {
      if (!isAutoRefresh) {
        setLoading(true);
      }
      setError(null);
      
      const data = await getCryptocurrencies(selectedCurrency, 100);
      
      // Find Vanry and move it to the front
      const vanryIndex = data.findIndex(coin => 
        coin.symbol.toLowerCase() === 'vanry' || 
        coin.id.toLowerCase() === 'vanar-chain'
      );
      
      if (vanryIndex > -1) {
        const vanry = data.splice(vanryIndex, 1)[0];
        data.unshift(vanry);
      }
      
      setCoins(data);
      setLastUpdate(new Date());
      setError(null);
      
      // Set data source based on console logs or data characteristics
      if (data && data.length > 0) {
        // Check if it looks like real data (more than 5 coins, realistic prices)
        const hasRealisticPrices = data.some(coin => 
          coin.current_price > 100 || coin.market_cap > 1000000000
        );
        setDataSource(hasRealisticPrices ? 'real' : 'mock');
      }
    } catch (err) {
      console.error('Error fetching coins:', err);
      if (!isAutoRefresh) {
        setError('Failed to fetch cryptocurrency data. Please try again later.');
        setCoins([]); // Set empty array to prevent undefined errors
      }
    } finally {
      if (!isAutoRefresh) {
        setLoading(false);
      }
    }
  };

  const applyFilters = () => {
    let filtered = [...coins];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(coin =>
        coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply category filter
    switch (filter) {
      case 'gainers':
        filtered = filtered
          .filter(coin => coin.price_change_percentage_24h > 0)
          .sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h);
        break;
      case 'losers':
        filtered = filtered
          .filter(coin => coin.price_change_percentage_24h < 0)
          .sort((a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h);
        break;
      case 'volume':
        filtered = filtered.sort((a, b) => b.total_volume - a.total_volume);
        break;
      default:
        // Keep original order (market cap desc with Vanry first)
        break;
    }

    setFilteredCoins(filtered);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleFilter = (filterType) => {
    setFilter(filterType);
  };

  const handleCurrencyChange = (currency) => {
    if (onCurrencyChange) {
      onCurrencyChange(currency);
    }
  };

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 dark:text-red-400 mb-4">
          <p className="text-lg font-medium">{error}</p>
        </div>
        <button
          onClick={fetchCoins}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Simple Status Bar */}
      <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${isAutoRefreshing ? 'bg-green-500' : 'bg-gray-400'}`}></div>
          <span>Updates every 5s</span>
          {lastUpdate && (
            <span className="text-xs">
              • {lastUpdate.toLocaleTimeString()}
            </span>
          )}
        </div>
      </div>

      <SearchBar
        onSearch={handleSearch}
        onFilter={handleFilter}
        onCurrencyChange={handleCurrencyChange}
        selectedCurrency={selectedCurrency}
      />
      
      {filteredCoins.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">
            No cryptocurrencies found matching your criteria.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredCoins.map((coin, index) => (
            <CoinCard
              key={coin.id}
              coin={coin}
              onClick={onCoinSelect}
              isFirst={index === 0 && !searchTerm && filter === 'all'}
              currency={selectedCurrency}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CoinList;
