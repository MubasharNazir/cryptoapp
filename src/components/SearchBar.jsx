import React, { useState, useEffect } from 'react';
import { Search, X, DollarSign } from 'lucide-react';

const SearchBar = ({ onSearch, onFilter, onCurrencyChange, selectedCurrency = 'usd', className = '' }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const filters = [
    { value: 'all', label: 'All Coins' },
    { value: 'gainers', label: 'Top Gainers' },
    { value: 'losers', label: 'Top Losers' },
    { value: 'volume', label: 'High Volume' },
  ];

  const currencies = [
    { value: 'usd', label: 'USDT', symbol: '$', icon: '💵' },
    { value: 'vanry', label: 'VANRY', symbol: 'V', icon: '🔶' },
  ];

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      onSearch(searchTerm);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, onSearch]);

  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);
    onFilter(filter);
  };

  const handleCurrencyChange = (currency) => {
    if (onCurrencyChange) {
      onCurrencyChange(currency);
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    onSearch('');
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search and Currency - Simple Row */}
      <div className="flex gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search cryptocurrencies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-9 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {searchTerm && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Simple Currency Toggle */}
        <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
          {currencies.map((currency) => (
            <button
              key={currency.value}
              onClick={() => handleCurrencyChange(currency.value)}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                selectedCurrency === currency.value
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {currency.label}
            </button>
          ))}
        </div>
      </div>

      {/* Simple Filter Buttons */}
      <div className="flex gap-2">
        {filters.map((filter) => (
          <button
            key={filter.value}
            onClick={() => handleFilterChange(filter.value)}
            className={`px-3 py-1 rounded text-sm transition-colors ${
              selectedFilter === filter.value
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SearchBar;
