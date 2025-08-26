import React from 'react';
import { TrendingUp, BarChart3, Zap, Shield, Globe, ArrowRight, Bitcoin, DollarSign } from 'lucide-react';

const LandingPage = ({ onGetStarted }) => {
  const features = [
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Real-Time Tracking",
      description: "Monitor cryptocurrency prices with live updates every 5 seconds"
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Interactive Charts",
      description: "Analyze price movements with professional trading charts"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Lightning Fast",
      description: "Optimized performance with intelligent caching system"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Reliable Data",
      description: "Powered by CoinGecko API with professional error handling"
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Multi-Currency",
      description: "Switch between USDT and VANRY with instant conversion"
    },
    {
      icon: <DollarSign className="w-8 h-8" />,
      title: "Market Insights",
      description: "Track market cap, volume, and 24h price changes"
    }
  ];

  const cryptoIcons = [
    { name: "Bitcoin", symbol: "₿", color: "text-orange-500" },
    { name: "Ethereum", symbol: "Ξ", color: "text-blue-500" },
    { name: "Vanry", symbol: "V", color: "text-purple-500" },
    { name: "BNB", symbol: "B", color: "text-yellow-500" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-200 dark:bg-purple-900 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-200 dark:bg-blue-900 rounded-full opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-800 dark:to-purple-800 rounded-full opacity-10 animate-spin" style={{ animationDuration: '20s' }}></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="container mx-auto px-4 py-6">
          <nav className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Bitcoin className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                CryptoTracker Pro
              </span>
            </div>
            <button
              onClick={onGetStarted}
              className="hidden md:flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </nav>
        </header>

        {/* Hero Section */}
        <section className="container mx-auto px-4 py-20 text-center">
          <div className="max-w-4xl mx-auto">
            {/* Floating Crypto Icons */}
            <div className="flex justify-center space-x-8 mb-8">
              {cryptoIcons.map((crypto, index) => (
                <div
                  key={crypto.name}
                  className={`w-16 h-16 ${crypto.color} bg-white dark:bg-gray-800 rounded-full flex items-center justify-center text-2xl font-bold shadow-lg animate-bounce`}
                  style={{ animationDelay: `${index * 0.2}s`, animationDuration: '2s' }}
                >
                  {crypto.symbol}
                </div>
              ))}
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              Track Crypto
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent block">
                Like a Pro
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              Experience the ultimate cryptocurrency tracking platform with real-time data,
              <br className="hidden md:block" />
              professional charts, and lightning-fast performance.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <button
                onClick={onGetStarted}
                className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg font-semibold rounded-xl hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center space-x-3"
              >
                <span>Check Live Prices</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Live data updates every 5 seconds</span>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">100+</div>
                <div className="text-gray-600 dark:text-gray-400">Cryptocurrencies</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">5s</div>
                <div className="text-gray-600 dark:text-gray-400">Update Interval</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">24/7</div>
                <div className="text-gray-600 dark:text-gray-400">Market Monitoring</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-4 py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose CryptoTracker Pro?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Built with cutting-edge technology to provide you with the most accurate and 
              up-to-date cryptocurrency market information.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-gray-100 dark:border-gray-700"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400 mb-6 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-white">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Start Trading?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of traders who trust CryptoTracker Pro for their market analysis.
              Get started now and never miss a market opportunity again.
            </p>
            <button
              onClick={onGetStarted}
              className="group px-8 py-4 bg-white text-blue-600 text-lg font-semibold rounded-xl hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center space-x-3 mx-auto"
            >
              <span>Start Tracking Now</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </section>

        {/* Footer */}
        <footer className="container mx-auto px-4 py-8 border-t border-gray-200 dark:border-gray-700">
          <div className="text-center text-gray-600 dark:text-gray-400">
            <p className="mb-2">© 2025 CryptoTracker Pro. Built with React & Tailwind CSS.</p>
            <p className="text-sm">Powered by CoinGecko API for reliable market data.</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;
