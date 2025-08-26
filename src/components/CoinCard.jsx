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
      className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.02] ${
        isFirst 
          ? 'border-blue-200 dark:border-blue-800 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950' 
          : 'border-light-border dark:border-dark-border bg-white dark:bg-dark-card hover:border-blue-300 dark:hover:border-blue-600'
      }`}
    >
      {isFirst && (
        <div className="mb-2 flex items-center justify-between">
          <span className="px-2 py-1 text-xs font-semibold bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
            VANRY/USDT - Featured
          </span>
        </div>
      )}
      
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <img 
            src={coin.image} 
            alt={coin.name}
            className="w-8 h-8 rounded-full"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/32x32/cccccc/ffffff?text=' + coin.symbol.charAt(0);
            }}
          />
          <div>
            <h3 className="font-semibold text-sm text-gray-900 dark:text-white">
              {coin.name}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">
              {coin.symbol}
            </p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            #{coin.market_cap_rank || 'N/A'}
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-gray-900 dark:text-white">
            {formatPrice(coin.current_price)}
          </span>
          <div className={`flex items-center space-x-1 px-2 py-1 rounded text-xs font-medium ${
            isPositive 
              ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' 
              : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
          }`}>
            {isPositive ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            <span>
              {isPositive ? '+' : ''}{priceChange.toFixed(2)}%
            </span>
          </div>
        </div>
        
        <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
          <span>Market Cap</span>
          <span className="font-medium">
            {coin.market_cap ? formatMarketCap(coin.market_cap) : 'N/A'}
          </span>
        </div>
        
        <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
          <span>24h Volume</span>
          <span className="font-medium">
            {coin.total_volume ? formatMarketCap(coin.total_volume) : 'N/A'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CoinCard;
