import axios from 'axios';

const API_BASE_URL = 'https://api.coingecko.com/api/v3';
const API_KEY = 'CG-eiBzXNBLGHTEiX88vQGg9zRf';

// Professional data management system
let dataCache = {
  coins: null,
  vanryRate: null,
  lastFetch: null,
  dataSource: 'none', // 'real', 'mock', 'cached'
  isRealDataAvailable: false,
  isFirstLoad: true // Track if this is the first load
};

// Cache duration settings - more aggressive for first load
const CACHE_DURATION = 15 * 1000; // 15 seconds (shorter cache)
const VANRY_RATE_CACHE_DURATION = 2 * 60 * 1000; // 2 minutes (shorter for better updates)
const API_RETRY_DELAY = 30 * 1000; // 30 seconds before retrying real API

// Track API failures professionally
let apiFailureCount = 0;
let lastApiFailure = null;
const MAX_API_FAILURES = 1; // More aggressive - try real API more often

// Professional cache management
const isCacheValid = (timestamp, duration = CACHE_DURATION) => {
  return timestamp && Date.now() - timestamp < duration;
};

const shouldTryRealAPI = () => {
  // ALWAYS try real API on first load or page refresh
  if (dataCache.isFirstLoad) {
    console.log('🚀 First load - forcing real API attempt');
    return true;
  }
  
  // Always try real API if we have established real data connection
  if (dataCache.isRealDataAvailable) return true;
  
  // If API failed, wait before retrying
  if (lastApiFailure && Date.now() - lastApiFailure < API_RETRY_DELAY) {
    return false;
  }
  
  // Retry if not too many failures
  return apiFailureCount < MAX_API_FAILURES;
};

const updateCacheStatus = (source, isReal = false) => {
  dataCache.dataSource = source;
  dataCache.isRealDataAvailable = isReal;
  dataCache.lastFetch = Date.now();
  dataCache.isFirstLoad = false; // Mark that we've made our first attempt
  
  if (isReal) {
    apiFailureCount = 0;
    lastApiFailure = null;
    console.log('✅ Real API connection established');
  } else {
    console.log('⚠️ Using fallback data');
  }
};

// Clear cache when currency changes
export const clearCurrencyCache = () => {
  console.log('🗑️ Clearing currency cache...');
  dataCache.coins = null;
  dataCache.isFirstLoad = true; // Reset first load flag to force real API
  // Keep chart cache but mark for refresh
  Object.keys(dataCache).forEach(key => {
    if (key.includes('_')) { // Chart cache keys contain underscores
      delete dataCache[key];
    }
  });
};

// Reset cache completely (for page refresh)
export const resetDataCache = () => {
  console.log('🔄 Resetting all cache for fresh start');
  const oldVanryRate = dataCache.vanryRate; // Keep VANRY rate if still valid
  dataCache = {
    coins: null,
    vanryRate: oldVanryRate,
    lastFetch: null,
    dataSource: 'none',
    isRealDataAvailable: false,
    isFirstLoad: true
  };
  apiFailureCount = 0;
  lastApiFailure = null;
};

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
  timeout: 15000
});

// Add request interceptor to conditionally add API key
api.interceptors.request.use((config) => {
  // Try without API key first to avoid rate limits
  if (config.addApiKey === true) {
    config.headers['x-cg-demo-api-key'] = API_KEY;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Enhanced retry function for API calls
const makeApiCallWithRetry = async (apiCall, retries = 1) => {
  for (let i = 0; i <= retries; i++) {
    try {
      const result = await apiCall(false); // Try without API key first
      console.log('✅ Real API call successful');
      return { success: true, data: result };
    } catch (error) {
      console.log(`API attempt ${i + 1} failed:`, error.response?.status || error.message);
      
      // Try with API key on rate limit
      if (error.response?.status === 429 && i === 0) {
        try {
          console.log('Trying with API key...');
          const result = await apiCall(true);
          return { success: true, data: result };
        } catch (keyError) {
          console.log('API key attempt failed:', keyError.response?.status || keyError.message);
        }
      }
      
      // Wait between retries
      if (i < retries) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
  }
  
  return { success: false, error: 'All API attempts failed' };
};

// Get and cache VANRY conversion rate professionally
const getVanryRate = async () => {
  // Return cached rate if valid
  if (dataCache.vanryRate && isCacheValid(dataCache.vanryRate.timestamp, VANRY_RATE_CACHE_DURATION)) {
    console.log('Using cached VANRY rate:', dataCache.vanryRate.rate);
    return dataCache.vanryRate.rate;
  }
  
  try {
    console.log('Fetching fresh VANRY conversion rate...');
    const result = await makeApiCallWithRetry(async (useApiKey) => {
      return await api.get('/simple/price', {
        params: {
          ids: 'vanar-chain',
          vs_currencies: 'usd'
        },
        addApiKey: useApiKey
      });
    });
    
    if (result.success) {
      const rate = result.data.data['vanar-chain']?.usd || 0.124;
      dataCache.vanryRate = {
        rate: rate,
        timestamp: Date.now()
      };
      console.log('✅ Fresh VANRY rate cached:', rate);
      return rate;
    }
  } catch (error) {
    console.log('VANRY rate fetch failed, using fallback');
  }
  
  // Use fallback rate
  const fallbackRate = 0.124;
  if (!dataCache.vanryRate) {
    dataCache.vanryRate = {
      rate: fallbackRate,
      timestamp: Date.now()
    };
  }
  
  return dataCache.vanryRate.rate;
};

// Professional currency conversion
const convertToVanry = async (coinData) => {
  const vanryRate = await getVanryRate();
  
  return coinData.map(coin => ({
    ...coin,
    current_price: parseFloat((coin.current_price / vanryRate).toFixed(8)),
    high_24h: coin.high_24h ? parseFloat((coin.high_24h / vanryRate).toFixed(8)) : null,
    low_24h: coin.low_24h ? parseFloat((coin.low_24h / vanryRate).toFixed(8)) : null,
    price_change_24h: coin.price_change_24h ? parseFloat((coin.price_change_24h / vanryRate).toFixed(8)) : null,
    market_cap: coin.market_cap ? parseFloat((coin.market_cap / vanryRate).toFixed(2)) : null,
    total_volume: coin.total_volume ? parseFloat((coin.total_volume / vanryRate).toFixed(2)) : null,
  }));
};

// Get list of cryptocurrencies with professional data management
export const getCryptocurrencies = async (vs_currency = 'usd', per_page = 50, page = 1) => {
  console.log(`📊 Fetching crypto data - Currency: ${vs_currency}, Source: ${dataCache.dataSource}, First Load: ${dataCache.isFirstLoad}`);
  
  // On first load or currency change, always try real API first
  if (dataCache.isFirstLoad || !dataCache.coins || dataCache.coins.currency !== vs_currency) {
    console.log('🔥 Fresh load detected - bypassing cache, trying real API');
    // Don't use cache on first load or currency change
  } else if (dataCache.coins && 
             isCacheValid(dataCache.lastFetch) && 
             dataCache.coins.currency === vs_currency) {
    console.log('✅ Using cached data (still fresh)');
    return dataCache.coins.data;
  }
  
  let coinsData = null;
  let isRealData = false;
  
  // Try to fetch real data if conditions are met
  if (shouldTryRealAPI()) {
    console.log('🔄 Attempting real API fetch...');
    
    const apiResult = await makeApiCallWithRetry(async (useApiKey) => {
      return await api.get('/coins/markets', {
        params: {
          vs_currency: vs_currency === 'vanry' ? 'usd' : vs_currency,
          order: 'market_cap_desc',
          per_page,
          page,
          sparkline: false,
          price_change_percentage: '24h'
        },
        addApiKey: useApiKey
      });
    });
    
    if (apiResult.success) {
      coinsData = apiResult.data.data;
      isRealData = true;
      console.log('✅ Real API data obtained:', coinsData.length, 'coins');
    } else {
      apiFailureCount++;
      lastApiFailure = Date.now();
      console.log('❌ Real API failed, failure count:', apiFailureCount);
    }
  }
  
  // Use cached data if real API failed but we have valid cache (but not on first load)
  if (!coinsData && !dataCache.isFirstLoad && dataCache.coins && dataCache.coins.currency === vs_currency) {
    console.log('📋 Using cached data (API failed but cache available)');
    return dataCache.coins.data;
  }
  
  // Fall back to mock data if no real data and no valid cache
  if (!coinsData) {
    console.log('🔄 Using mock data (no real data available)');
    coinsData = getMockData();
    isRealData = false;
  }
  
  // Apply currency conversion if needed
  if (vs_currency === 'vanry') {
    console.log('💱 Converting to VANRY currency...');
    coinsData = await convertToVanry(coinsData);
  }
  
  // Cache the processed data
  dataCache.coins = {
    data: coinsData,
    currency: vs_currency,
    timestamp: Date.now()
  };
  
  updateCacheStatus(isRealData ? 'real' : 'mock', isRealData);
  
  console.log(`✅ Data prepared - Source: ${dataCache.dataSource}, Currency: ${vs_currency}, Count: ${coinsData.length}`);
  return coinsData;
};

// Get specific coin data
export const getCoinData = async (coinId, vs_currency = 'usd') => {
  try {
    console.log(`Fetching coin data for ${coinId}`);
    const response = await api.get(`/coins/${coinId}`, {
      params: {
        localization: false,
        tickers: false,
        market_data: true,
        community_data: false,
        developer_data: false,
        sparkline: false
      },
      addApiKey: false // Try without API key first
    });
    console.log(`Coin data received for ${coinId}:`, response.data.name);
    return response.data;
  } catch (error) {
    console.error(`Error fetching coin data for ${coinId}:`, error);
    console.error('Error details:', error.response?.data || error.message);
    
    // If API fails, create mock detailed coin data
    if (error.response?.status === 429 || error.code === 'ECONNABORTED' || error.code === 'ERR_NETWORK') {
      console.log(`Using mock coin data for ${coinId}`);
      return generateMockCoinData(coinId);
    }
    
    throw error;
  }
};

// Generate mock detailed coin data
const generateMockCoinData = (coinId) => {
  const coinNames = {
    'bitcoin': 'Bitcoin',
    'ethereum': 'Ethereum', 
    'binancecoin': 'BNB',
    'solana': 'Solana',
    'ripple': 'XRP',
    'tether': 'Tether',
    'vanar-chain': 'Vanar Chain',
    'vanry': 'Vanar Chain'
  };
  
  const symbols = {
    'bitcoin': 'BTC',
    'ethereum': 'ETH',
    'binancecoin': 'BNB',
    'solana': 'SOL',
    'ripple': 'XRP',
    'tether': 'USDT',
    'vanar-chain': 'VANRY',
    'vanry': 'VANRY'
  };
  
  const basePrices = {
    'bitcoin': 65000,
    'ethereum': 2600,
    'binancecoin': 550,
    'solana': 145,
    'ripple': 2.9,
    'tether': 1.0,
    'vanar-chain': 0.124,
    'vanry': 0.124
  };
  
  const name = coinNames[coinId] || 'Unknown Coin';
  const symbol = symbols[coinId] || 'UNK';
  const currentPrice = basePrices[coinId] || Math.random() * 1000;
  
  return {
    id: coinId,
    name: name,
    symbol: symbol.toLowerCase(),
    image: {
      large: `https://via.placeholder.com/64x64/cccccc/ffffff?text=${symbol}`,
      small: `https://via.placeholder.com/32x32/cccccc/ffffff?text=${symbol}`
    },
    market_cap_rank: Math.floor(Math.random() * 100) + 1,
    market_data: {
      current_price: { usd: currentPrice },
      market_cap: { usd: currentPrice * 1000000 },
      total_volume: { usd: currentPrice * 100000 },
      high_24h: { usd: currentPrice * 1.05 },
      low_24h: { usd: currentPrice * 0.95 },
      price_change_percentage_24h: (Math.random() - 0.5) * 10
    },
    description: {
      en: `${name} is a cryptocurrency that offers innovative blockchain solutions. This is mock data for demonstration purposes.`
    },
    links: {
      homepage: ['https://example.com']
    }
  };
};

// Get coin price history for chart
// Get historical price data with professional caching
export const getCoinHistory = async (coinId, days = 7, vs_currency = 'usd') => {
  const cacheKey = `${coinId}_${days}_${vs_currency}`;
  
  // Check if we have cached chart data
  if (dataCache[cacheKey] && isCacheValid(dataCache[cacheKey].timestamp)) {
    console.log(`📈 Using cached chart data for ${coinId}`);
    return dataCache[cacheKey].data;
  }
  
  let chartData = null;
  
  if (shouldTryRealAPI()) {
    console.log(`🔄 Fetching real chart data for ${coinId}...`);
    
    const apiResult = await makeApiCallWithRetry(async (useApiKey) => {
      return await api.get(`/coins/${coinId}/market_chart`, {
        params: {
          vs_currency: vs_currency === 'vanry' ? 'usd' : vs_currency,
          days,
          interval: days <= 1 ? 'hourly' : 'daily'
        },
        addApiKey: useApiKey
      });
    });
    
    if (apiResult.success) {
      chartData = {
        prices: apiResult.data.data.prices || [],
        market_caps: apiResult.data.data.market_caps || [],
        total_volumes: apiResult.data.data.total_volumes || []
      };
      console.log(`✅ Real chart data for ${coinId}:`, chartData.prices.length, 'points');
    }
  }
  
  // Fall back to mock data if real API failed
  if (!chartData) {
    console.log(`🔄 Using mock chart data for ${coinId}`);
    chartData = generateMockChartData(coinId, days);
  }
  
  // Convert to VANRY if needed
  if (vs_currency === 'vanry') {
    const vanryRate = await getVanryRate();
    chartData.prices = chartData.prices.map(([timestamp, price]) => [
      timestamp,
      parseFloat((price / vanryRate).toFixed(8))
    ]);
  }
  
  // Cache the chart data
  dataCache[cacheKey] = {
    data: chartData,
    timestamp: Date.now()
  };
  
  return chartData;
};

// Generate mock chart data that varies per coin
const generateMockChartData = (coinId, days = 7) => {
  const mockPrices = [];
  
  // Base prices for different coins to make charts look different
  const basePrices = {
    'bitcoin': 65000,
    'ethereum': 2600,
    'binancecoin': 550,
    'solana': 145,
    'ripple': 2.9,
    'tether': 1.0,
    'vanar-chain': 0.124,
    'vanry': 0.124
  };
  
  const basePrice = basePrices[coinId] || Math.random() * 1000 + 10;
  const volatility = coinId === 'tether' ? 0.001 : 0.05; // USDT has very low volatility
  
  const now = Date.now();
  const interval = days <= 1 ? 3600000 : 86400000; // 1 hour or 1 day in ms
  const dataPoints = days <= 1 ? 24 : days;
  
  for (let i = 0; i < dataPoints; i++) {
    const timestamp = now - ((dataPoints - 1 - i) * interval);
    
    // Create realistic price movement with some trend
    const trend = (Math.sin(i * 0.3) * 0.02); // Small trend component
    const randomChange = (Math.random() - 0.5) * volatility * 2;
    const price = basePrice * (1 + trend + randomChange);
    
    mockPrices.push([timestamp, Math.max(price, 0.000001)]); // Ensure positive prices
  }
  
  return { prices: mockPrices };
};

// Get trending cryptocurrencies
export const getTrendingCoins = async () => {
  try {
    const response = await api.get('/search/trending');
    return response.data.coins;
  } catch (error) {
    console.error('Error fetching trending coins:', error);
    throw error;
  }
};

// Search for cryptocurrencies
export const searchCoins = async (query) => {
  try {
    const response = await api.get('/search', {
      params: { query }
    });
    return response.data.coins;
  } catch (error) {
    console.error('Error searching coins:', error);
    throw error;
  }
};

export default api;

// Mock data for demonstration purposes
const getMockData = () => [
  {
    id: 'vanar-chain',
    symbol: 'vanry',
    name: 'Vanar Chain',
    image: 'https://assets.coingecko.com/coins/images/32691/large/vanry_200x200.png',
    current_price: 0.12450,
    market_cap: 124500000,
    market_cap_rank: 120,
    fully_diluted_valuation: 245000000,
    total_volume: 15600000,
    high_24h: 0.13200,
    low_24h: 0.11800,
    price_change_24h: 0.00234,
    price_change_percentage_24h: 1.92,
    market_cap_change_24h: 2340000,
    market_cap_change_percentage_24h: 1.92,
    circulating_supply: 1000000000,
    total_supply: 2000000000,
    max_supply: 2000000000,
    ath: 0.24500,
    ath_change_percentage: -49.18,
    ath_date: '2024-03-15T00:00:00.000Z',
    atl: 0.08900,
    atl_change_percentage: 39.89,
    atl_date: '2024-01-10T00:00:00.000Z',
    last_updated: '2025-08-26T07:00:00.000Z'
  },
  {
    id: 'bitcoin',
    symbol: 'btc',
    name: 'Bitcoin',
    image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
    current_price: 64850.00 + (Math.random() - 0.5) * 1000, // Add some variation
    market_cap: 1270000000000,
    market_cap_rank: 1,
    total_volume: 28000000000,
    high_24h: 65200.00,
    low_24h: 63800.00,
    price_change_24h: 450.00,
    price_change_percentage_24h: 0.70
  },
  {
    id: 'ethereum',
    symbol: 'eth',
    name: 'Ethereum',
    image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
    current_price: 2650.00,
    market_cap: 318000000000,
    market_cap_rank: 2,
    total_volume: 15000000000,
    high_24h: 2680.00,
    low_24h: 2620.00,
    price_change_24h: 18.50,
    price_change_percentage_24h: 0.70
  },
  {
    id: 'tether',
    symbol: 'usdt',
    name: 'Tether',
    image: 'https://assets.coingecko.com/coins/images/325/large/Tether.png',
    current_price: 1.000,
    market_cap: 118000000000,
    market_cap_rank: 3,
    total_volume: 45000000000,
    high_24h: 1.001,
    low_24h: 0.999,
    price_change_24h: 0.0001,
    price_change_percentage_24h: 0.01
  },
  {
    id: 'binancecoin',
    symbol: 'bnb',
    name: 'BNB',
    image: 'https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png',
    current_price: 550.00,
    market_cap: 82000000000,
    market_cap_rank: 4,
    total_volume: 1800000000,
    high_24h: 560.00,
    low_24h: 540.00,
    price_change_24h: 8.50,
    price_change_percentage_24h: 1.57
  },
  {
    id: 'solana',
    symbol: 'sol',
    name: 'Solana',
    image: 'https://assets.coingecko.com/coins/images/4128/large/solana.png',
    current_price: 145.00,
    market_cap: 67000000000,
    market_cap_rank: 5,
    total_volume: 3200000000,
    high_24h: 148.00,
    low_24h: 142.00,
    price_change_24h: 2.80,
    price_change_percentage_24h: 1.97
  }
];
