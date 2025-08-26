import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getCoinHistory } from '../services/api';
import LoadingSpinner from './LoadingSpinner';

const CoinChart = ({ coinId, coinName, currency = 'usd' }) => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeframe, setTimeframe] = useState('7');
  const [lastUpdate, setLastUpdate] = useState(null);

  const timeframes = [
    { value: '1', label: '1D' },
    { value: '7', label: '7D' },
    { value: '30', label: '30D' },
    { value: '90', label: '3M' },
    { value: '365', label: '1Y' },
  ];

  useEffect(() => {
    if (coinId) {
      fetchChartData();
    }
  }, [coinId, timeframe]);

  // Auto-refresh chart data every 30 seconds
  useEffect(() => {
    if (!coinId) return;
    
    const interval = setInterval(() => {
      fetchChartData(true); // Pass true to indicate it's an auto-refresh
    }, 30000);

    return () => clearInterval(interval);
  }, [coinId, timeframe]);

  const fetchChartData = async (isAutoRefresh = false) => {
    try {
      if (!isAutoRefresh) {
        setLoading(true);
      }
      setError(null);
      console.log(`Fetching chart data for ${coinId} with timeframe ${timeframe}`);
      const data = await getCoinHistory(coinId, parseInt(timeframe));
      
      const formattedData = data.prices.map(([timestamp, price]) => {
        const date = new Date(timestamp);
        return {
          date: date.toLocaleDateString(),
          time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          price: price,
          timestamp: timestamp,
          fullDate: date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            hour: timeframe === '1' ? '2-digit' : undefined,
            minute: timeframe === '1' ? '2-digit' : undefined
          })
        };
      });
      
      console.log(`Chart data formatted for ${coinName}:`, formattedData.length, 'data points');
      setChartData(formattedData);
      setLastUpdate(new Date());
    } catch (err) {
      if (!isAutoRefresh) {
        setError('Failed to load chart data');
      }
      console.error('Error fetching chart data:', err);
    } finally {
      if (!isAutoRefresh) {
        setLoading(false);
      }
    }
  };

  const formatPrice = (price) => {
    const symbol = currency === 'vanry' ? 'V' : '$';
    if (price < 0.01) {
      return `${symbol}${price.toFixed(6)}`;
    } else if (price < 1) {
      return `${symbol}${price.toFixed(4)}`;
    } else {
      return `${symbol}${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-dark-card border border-light-border dark:border-dark-border rounded-lg p-3 shadow-lg">
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            {timeframe === '1' ? `${data.fullDate}` : data.fullDate}
          </p>
          <p className="font-semibold text-gray-900 dark:text-white">
            {formatPrice(payload[0].value)}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {coinName}
          </p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-dark-card rounded-xl border border-light-border dark:border-dark-border p-6">
        <LoadingSpinner size="medium" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-dark-card rounded-xl border border-light-border dark:border-dark-border p-6 text-center">
        <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
        <button
          onClick={fetchChartData}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  const isPositive = chartData.length > 1 && 
    chartData[chartData.length - 1].price > chartData[0].price;

  return (
    <div className="bg-white dark:bg-dark-card rounded-xl border border-light-border dark:border-dark-border p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {coinName} Price Chart
          </h3>
          {lastUpdate && (
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              Last updated: {lastUpdate.toLocaleTimeString()} • Auto-refresh: 30s
            </p>
          )}
        </div>
        <div className="flex space-x-2">
          {timeframes.map((tf) => (
            <button
              key={tf.value}
              onClick={() => setTimeframe(tf.value)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                timeframe === tf.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
              disabled={loading}
            >
              {tf.label}
            </button>
          ))}
        </div>
      </div>

      {/* Show data points info */}
      {!loading && chartData.length > 0 && (
        <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
          Showing {chartData.length} data points for the last {timeframe} {timeframe === '1' ? 'day' : 'days'}
        </div>
      )}

      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="#e5e7eb" 
              className="dark:stroke-gray-700"
            />
            <XAxis
              dataKey="fullDate"
              stroke="#9ca3af"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              stroke="#9ca3af"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={formatPrice}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="price"
              stroke={isPositive ? "#10b981" : "#ef4444"}
              strokeWidth={2}
              dot={false}
              activeDot={{
                r: 4,
                fill: isPositive ? "#10b981" : "#ef4444"
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CoinChart;
