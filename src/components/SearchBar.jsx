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
    <div className={`space-y-3 ${className}`}>
      {/* Top Row: Search and Currency Selector */}
      <div className="flex gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search cryptocurrencies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-9 py-2.5 rounded-lg border border-light-border dark:border-dark-border bg-white dark:bg-dark-card text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-sm"
          />
          {searchTerm && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Currency Selector */}
        <div className="relative">
          <select
            value={selectedCurrency}
            onChange={(e) => handleCurrencyChange(e.target.value)}
            className="appearance-none bg-white dark:bg-dark-card border border-light-border dark:border-dark-border rounded-lg px-4 py-2.5 text-sm font-medium text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 cursor-pointer min-w-[100px]"
          >
            {currencies.map((currency) => (
              <option key={currency.value} value={currency.value}>
                {currency.icon} {currency.label}
              </option>
            ))}
          </select>
          <DollarSign className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" />
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <button
            key={filter.value}
            onClick={() => handleFilterChange(filter.value)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              selectedFilter === filter.value
                ? 'bg-blue-600 text-white dark:bg-blue-500'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {filter.label}
          </button>
        ))}
        
        {/* Currency Info Badge */}
        <div className="flex items-center px-3 py-1.5 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-lg text-xs font-medium">
          <span className="mr-1">
            {currencies.find(c => c.value === selectedCurrency)?.icon}
          </span>
          Prices in {currencies.find(c => c.value === selectedCurrency)?.label}
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
