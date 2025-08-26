# CryptoTracker - Professional Cryptocurrency Price Tracker

A modern, responsive single-page application for tracking cryptocurrency prices with real-time data from CoinGecko API. Built with React, Vite, and Tailwind CSS.

## 🚀 Features

### Core Functionality
- **Real-time Cryptocurrency Prices**: Live market data for top cryptocurrencies
- **Vanry/USDT Featured Pair**: Prominently displays Vanry/USDT as the first cryptocurrency
- **Interactive Price Charts**: Multi-timeframe charts (1D, 7D, 30D, 3M, 1Y) using Recharts
- **Advanced Search & Filters**: Real-time search with category filters (All, Gainers, Losers, High Volume)
- **Detailed Coin Information**: Comprehensive coin details with market statistics

### Professional Design
- **Dark/Light Mode Toggle**: Seamless theme switching with system preference detection
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Professional UI**: Clean, modern interface with Tailwind CSS
- **Smooth Animations**: Hover effects, transitions, and loading states
- **Accessibility**: ARIA labels and keyboard navigation support

## 🛠️ Technology Stack

- **Frontend**: React 19.1.1
- **Build Tool**: Vite 7.1.2
- **Styling**: Tailwind CSS 4.1.12
- **Charts**: Recharts
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **API**: CoinGecko API v3

## 📦 Installation & Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start the development server**
   ```bash
   npm run dev
   ```

3. **Open your browser**
   Navigate to `http://localhost:5173/`

## 🔧 Build for Production

```bash
npm run build
npm run preview
```

## 🌟 Key Features

### Homepage
- Grid layout of cryptocurrency cards
- Vanry/USDT prominently featured
- Real-time price data and 24h changes
- Market statistics and responsive design

### Search & Filter
- Instant search with debouncing
- Filter by: All Coins, Top Gainers, Top Losers, High Volume
- Clean, intuitive interface

### Coin Details
- Full-screen detailed view with interactive charts
- Comprehensive market data and statistics
- Coin description and external links

### Theme Support
- Dark/light mode toggle with system preference detection
- Persistent storage and smooth transitions

## 📱 Responsive Design
- Desktop: Multi-column grid layout
- Tablet: Adapted grid and navigation  
- Mobile: Single-column, touch-optimized interface

## 🤖 AI Development Notes

This project was developed with significant AI assistance (GitHub Copilot). See `AI_DEVELOPMENT_DOCUMENTATION.md` for detailed documentation of AI contributions vs. manual adjustments.

---

**Built with ❤️ using React, Vite, and Tailwind CSS**+ Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
