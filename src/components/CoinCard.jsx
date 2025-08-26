import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const CoinCard = ({ coin, onClick, isFirst = false, currency = 'usd' }) => {
  const priceChange = coin.price_change_percentage_24h || 0;
  const isPositive = priceChange >= 0;

  const getCurrencySymbol = (curr) => {
    switch (curr) {
      case 'vanry': return 'V';
      case 'usd': default: return '$';
    }
  };

  const formatPrice = (price) => {
    const symbol = getCurrencySymbol(currency);
    if (price < 0.01) {
      return `${symbol}${price.toFixed(6)}`;
    } else if (price < 1) {
      return `${symbol}${price.toFixed(4)}`;
    } else {
      return `${symbol}${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
  };

  const formatMarketCap = (marketCap) => {
    const symbol = getCurrencySymbol(currency);
    if (marketCap >= 1e12) {
      return `${symbol}${(marketCap / 1e12).toFixed(2)}T`;
    } else if (marketCap >= 1e9) {
      return `${symbol}${(marketCap / 1e9).toFixed(2)}B`;
    } else if (marketCap >= 1e6) {
      return `${symbol}${(marketCap / 1e6).toFixed(2)}M`;
    } else {
      return `${symbol}${marketCap.toLocaleString()}`;
    }
  };

  return (
    <div
      onClick={() => onClick(coin)}
      className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
        isFirst 
          ? 'border-blue-200 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20' 
          : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
      }`}
    >
      {isFirst && (
        <div className="mb-2">
          <span className="px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded">
            Featured
          </span>
        </div>
      )}
      
      <div className="flex items-center space-x-3 mb-3">
        <img 
          src={coin.image} 
          alt={coin.name}
          className="w-8 h-8 rounded-full"
        />
        <div className="flex-1">
          <h3 className="font-medium text-gray-900 dark:text-white text-sm">
            {coin.name}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">
            {coin.symbol}
          </p>
        </div>
        <div className="text-xs text-gray-500">
          #{coin.market_cap_rank || '-'}
        </div>
      </div>

      <div className="flex items-center justify-between mb-2">
        <span className="font-semibold text-gray-900 dark:text-white">
          {formatPrice(coin.current_price)}
        </span>
        <div className={`text-xs font-medium ${
          isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
        }`}>
          {isPositive ? '+' : ''}{priceChange.toFixed(2)}%
        </div>
      </div>
      
      <div className="text-xs text-gray-500 dark:text-gray-400">
        <div className="flex justify-between">
          <span>Volume: {coin.total_volume ? formatMarketCap(coin.total_volume) : 'N/A'}</span>
        </div>
      </div>
    </div>
  );
};

export default CoinCard;
