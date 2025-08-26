import React, { useState, useEffect } from 'react';
import { ArrowLeft, TrendingUp, TrendingDown, Globe, ExternalLink } from 'lucide-react';
import { getCoinData } from '../services/api';
import CoinChart from './CoinChart';
import LoadingSpinner from './LoadingSpinner';

const CoinDetail = ({ coin, onBack, currency = 'usd' }) => {
  const [coinDetails, setCoinDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (coin?.id) {
      fetchCoinDetails();
    }
  }, [coin?.id]);

  const fetchCoinDetails = async () => {
    try {
      setLoading(true);
      const data = await getCoinData(coin.id);
      setCoinDetails(data);
      setError(null);
    } catch (err) {
      setError('Failed to load coin details');
      console.error('Error fetching coin details:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    const symbol = currency === 'vanry' ? 'V' : '$';
    if (price < 0.01) {
      return `${symbol}${price.toFixed(8)}`;
    } else if (price < 1) {
      return `${symbol}${price.toFixed(6)}`;
    } else {
      return `${symbol}${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 8 })}`;
    }
  };

  const formatLargeNumber = (num) => {
    const symbol = currency === 'vanry' ? 'V' : '$';
    if (num >= 1e12) {
      return `${symbol}${(num / 1e12).toFixed(2)}T`;
    } else if (num >= 1e9) {
      return `${symbol}${(num / 1e9).toFixed(2)}B`;
    } else if (num >= 1e6) {
      return `${symbol}${(num / 1e6).toFixed(2)}M`;
    } else {
      return `${symbol}${num.toLocaleString()}`;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-light-bg dark:bg-dark-bg">
        <div className="container mx-auto px-4 py-8">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 mb-6 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to list</span>
          </button>
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (error || !coinDetails) {
    return (
      <div className="min-h-screen bg-light-bg dark:bg-dark-bg">
        <div className="container mx-auto px-4 py-8">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 mb-6 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to list</span>
          </button>
          <div className="text-center py-12">
            <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
            <button
              onClick={fetchCoinDetails}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const priceChange24h = coinDetails.market_data?.price_change_percentage_24h || 0;
  const isPositive = priceChange24h >= 0;
  const currentPrice = coinDetails.market_data?.current_price?.usd || 0;

  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg">
      <div className="container mx-auto px-4 py-6">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="flex items-center space-x-2 mb-4 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm">Back to list</span>
        </button>

        {/* Coin Header */}
        <div className="bg-white dark:bg-dark-card rounded-xl border border-light-border dark:border-dark-border p-4 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <img
                src={coinDetails.image?.large || coinDetails.image?.small}
                alt={coinDetails.name}
                className="w-12 h-12 rounded-full"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/48x48/cccccc/ffffff?text=' + coinDetails.symbol.charAt(0);
                }}
              />
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {coinDetails.name}
                </h1>
                <p className="text-lg text-gray-500 dark:text-gray-400 uppercase">
                  {coinDetails.symbol}
                </p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded text-xs">
                    Rank #{coinDetails.market_cap_rank || 'N/A'}
                  </span>
                  {coinDetails.links?.homepage?.[0] && (
                    <a
                      href={coinDetails.links.homepage[0]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      <Globe className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {formatPrice(currentPrice)}
              </div>
              <div className={`flex items-center justify-end space-x-1 px-2 py-1 rounded text-sm font-medium ${
                isPositive 
                  ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' 
                  : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
              }`}>
                {isPositive ? (
                  <TrendingUp className="h-4 w-4" />
                ) : (
                  <TrendingDown className="h-4 w-4" />
                )}
                <span>
                  {isPositive ? '+' : ''}{priceChange24h.toFixed(2)}%
                </span>
              </div>
            </div>
          </div>

          {/* Price Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Market Cap</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {coinDetails.market_data?.market_cap?.usd 
                  ? formatLargeNumber(coinDetails.market_data.market_cap.usd)
                  : 'N/A'
                }
              </p>
            </div>
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">24h Volume</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {coinDetails.market_data?.total_volume?.usd 
                  ? formatLargeNumber(coinDetails.market_data.total_volume.usd)
                  : 'N/A'
                }
              </p>
            </div>
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">24h High</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {coinDetails.market_data?.high_24h?.usd 
                  ? formatPrice(coinDetails.market_data.high_24h.usd)
                  : 'N/A'
                }
              </p>
            </div>
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">24h Low</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {coinDetails.market_data?.low_24h?.usd 
                  ? formatPrice(coinDetails.market_data.low_24h.usd)
                  : 'N/A'
                }
              </p>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="mb-6">
          <CoinChart 
            coinId={coinDetails.id} 
            coinName={coinDetails.name} 
            currency={currency}
          />
        </div>

        {/* Description */}
        {coinDetails.description?.en && (
          <div className="bg-white dark:bg-dark-card rounded-xl border border-light-border dark:border-dark-border p-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              About {coinDetails.name}
            </h2>
            <div 
              className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: coinDetails.description.en.replace(/<a/g, '<a target="_blank" rel="noopener noreferrer"')
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CoinDetail;
