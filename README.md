# StocksX 📈

A modern, full-featured Indonesian stock market information platform built for retail investors. Explore real-time market data, track your favorite stocks, analyze broker activities, and stay informed with the latest financial news.

> **⚠️ Demo Project** — This is a demonstration application with static/mock data for educational purposes only. Not affiliated with any licensed broker or financial institution.

![Nuxt](https://img.shields.io/badge/Nuxt-4.3-00DC82?logo=nuxt.js)
![Vue](https://img.shields.io/badge/Vue-3-42b883?logo=vue.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38B2AC?logo=tailwind-css)

## ✨ Key Features

### 📊 Market Analysis
- **Live Stock Data** — Real-time price tracking with interactive charts
- **Technical Indicators** — RSI, MACD, Bollinger Bands, and more
- **Broker Activity** — Track institutional buying and selling patterns
- **Foreign vs Domestic** — Monitor capital flow between foreign and local investors
- **Market Heatmap** — Visualize sector performance at a glance
- **Order Book** — Real-time bid/ask depth analysis

### 📰 News & Information
- **News Feed** — Curated financial news categorized by Market, Stocks, Economy, and Education
- **Economic Indicators** — Indonesian macro data (inflation, GDP, interest rates, etc.)
- **Sector Analysis** — Industry-specific performance metrics

### 🔐 User Features
- **Watchlist** — Save and track your favorite stocks with localStorage persistence
- **Price Alerts** — Set custom price notifications for stocks
- **User Authentication** — JWT-based login/register system
- **Role-based Access** — User, Admin, and Super Admin roles
- **Profile Management** — Customizable user profiles

### 🎨 User Experience
- **Responsive Design** — Mobile-first approach with adaptive layouts
- **Dark/Light Mode** — System-aware theme switching
- **Internationalization** — Bahasa Indonesia and English support
- **Search** — Quick command palette for finding stocks
- **Accessibility** — WCAG 2.1 compliant components

## 🛠️ Tech Stack

| Category | Technologies |
|----------|-------------|
| **Framework** | Nuxt 4.3, Vue 3, TypeScript |
| **Styling** | Tailwind CSS v3, shadcn-vue (New York / zinc) |
| **State Management** | Pinia, localStorage |
| **Charts** | Chart.js, vue-chartjs |
| **Icons** | Lucide Vue Next |
| **Date Handling** | v-calendar |
| **Internationalization** | @nuxtjs/i18n |
| **Code Quality** | Biome (formatter + linter), Vitest |
| **Deployment** | GitHub Pages (static generation) |

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ or 20+
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/stocksX.git
cd stocksX

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:3000`

### Available Scripts

```bash
npm run dev          # Start dev server with hot reload
npm run build        # Build for production
npm run generate     # Generate static site → .output/public/
npm run preview      # Preview production build
npm run lint         # Run Biome linter
npm run format       # Format code with Biome
npm test             # Run Vitest tests
```

## 📁 Project Structure

```
stocksX/
├── app/
│   ├── pages/                   # File-based routing
│   │   ├── index.vue            # Home / Dashboard
│   │   ├── watchlist.vue        # User watchlist
│   │   ├── indicators.vue       # Economic indicators
│   │   ├── settings.vue         # App settings
│   │   ├── stocks/
│   │   │   └── [ticker]/        # Stock detail pages
│   │   │       └── index.vue    # Stock overview, charts, broker activity
│   │   ├── news/
│   │   │   ├── index.vue        # News feed
│   │   │   └── [id].vue         # Article detail
│   │   ├── auth/
│   │   │   ├── login.vue        # Login page
│   │   │   └── register.vue     # Registration page
│   │   ├── profile.vue          # User profile
│   │   └── admin/
│   │       └── index.vue        # Admin dashboard (role-protected)
│   │
│   ├── components/              # Auto-imported components
│   │   ├── home/                # Dashboard widgets
│   │   │   ├── MarketOverview.vue
│   │   │   ├── TopMovers.vue
│   │   │   ├── SectorHeatmap.vue
│   │   │   └── TrendingStocks.vue
│   │   ├── stock/               # Stock detail components
│   │   │   ├── Chart.vue
│   │   │   ├── ChartPro.vue     # Advanced TradingView-style chart
│   │   │   ├── BrokerActivity.vue
│   │   │   ├── BrokerSummary.vue
│   │   │   ├── ForeignDomestic.vue
│   │   │   ├── Orderbook.vue
│   │   │   ├── TradeBook.vue
│   │   │   ├── HistoricalData.vue
│   │   │   └── PriceAlert.vue
│   │   ├── watchlist/
│   │   ├── news/
│   │   ├── indicators/
│   │   ├── layout/              # Layout components
│   │   │   ├── AppHeader.vue
│   │   │   ├── AppSidebar.vue
│   │   │   └── AppBottomNav.vue
│   │   ├── shared/              # Reusable components
│   │   │   ├── SearchCommand.vue
│   │   │   ├── PriceChange.vue
│   │   │   └── StockTicker.vue
│   │   └── ui/                  # shadcn-vue primitives
│   │
│   ├── composables/             # Composition API utilities
│   │   ├── useStocks.ts
│   │   ├── useNews.ts
│   │   ├── useIndicators.ts
│   │   ├── useAuth.ts
│   │   └── useSearch.ts
│   │
│   ├── stores/                  # Pinia stores
│   │   ├── watchlist.ts         # Watchlist state management
│   │   └── user.ts              # User authentication state
│   │
│   ├── data/                    # Static mock data
│   │   ├── stocks.ts
│   │   ├── stockHistory.ts
│   │   ├── brokerActivity.ts
│   │   ├── news.ts
│   │   ├── indicators.ts
│   │   └── sectors.ts
│   │
│   ├── lib/                     # Utility functions
│   │   └── jwt.ts               # JWT token handling
│   │
│   ├── middleware/              # Route middleware
│   │   ├── auth.ts              # Authentication guard
│   │   └── admin.ts             # Admin role guard
│   │
│   └── layouts/                 # Layout templates
│       ├── default.vue
│       └── blank.vue
│
├── i18n/                        # Internationalization
│   └── locales/
│       ├── id.json              # Bahasa Indonesia (default)
│       └── en.json              # English
│
├── public/                      # Static assets
├── nuxt.config.ts               # Nuxt configuration
├── tailwind.config.js           # Tailwind CSS configuration
└── components.json              # shadcn-vue configuration
```

## 🔐 Authentication & Authorization

The app uses **Firebase Authentication** with a hybrid JWT approach:

### Authentication Flow
1. User signs in via Firebase (Email/Password or Google OAuth)
2. Firebase ID token is sent to backend for verification
3. Backend exchanges Firebase token for app JWT
4. App JWT is stored in localStorage for session management
5. Protected routes check JWT validity

### User Roles
- **User** — Access to all public features (home, watchlist, news, stock details, profile)
- **Admin** — User privileges + access to `/admin` panel
- **Super Admin** — Admin privileges with elevated permissions

### Firebase Setup

#### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing
3. Enable **Authentication** in the Firebase console

#### 2. Enable Authentication Providers

**Email/Password:**
- Go to Authentication → Sign-in method
- Enable "Email/Password"

**Google Sign-In:**
- Enable "Google" provider
- Configure OAuth consent screen in Google Cloud Console
- Add authorized domains (localhost for development, your domain for production)

#### 3. Get Firebase Config

1. Go to Project Settings → General
2. Scroll to "Your apps" → SDK setup and configuration
3. Select "CDN" tab or "npm" for config values
4. Copy the configuration values

#### 4. Configure Environment Variables

Create or update `.env` file in the project root:

```env
# Firebase Auth Configuration
NUXT_PUBLIC_FIREBASE_API_KEY="your_api_key_here"
NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your_project.firebaseapp.com"
NUXT_PUBLIC_FIREBASE_PROJECT_ID="your_project_id"
NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your_project.appspot.com"
NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your_sender_id"
NUXT_PUBLIC_FIREBASE_APP_ID="your_app_id"
```

#### 5. Backend Firebase Setup

The backend (`backend-data-stocks/`) uses Firebase Admin SDK:

1. Install dependencies:
   ```bash
   pip install firebase-admin python-jose[cryptography]
   ```

2. Set up Firebase Admin credentials:
   - Download service account key from Firebase Console → Project Settings → Service Accounts
   - Set environment variable: `GOOGLE_APPLICATION_CREDENTIALS=/path/to/serviceAccountKey.json`
   - Or use Application Default Credentials in production

3. Configure backend `.env`:
   ```env
   DATA_URL=your_data_url
   JWT_SECRET=your-secret-key-change-in-production
   JWT_EXPIRE_MINUTES=1440
   GOOGLE_APPLICATION_CREDENTIALS=/path/to/serviceAccountKey.json
   ```

### API Endpoints

- `POST /auth/firebase-login` — Login with Firebase ID token
- `POST /auth/firebase-register` — Register new user with Firebase ID token
- `POST /token` — OAuth2-compatible endpoint (username/password)

### Migration from Legacy Auth

If you're migrating from the previous JWT-only auth system:

1. **Update user credentials** - Users need to create Firebase accounts
2. **Update login pages** - Already done in this version
3. **Test authentication flow** - Verify login/register/logout works
4. **Update backend** - Deploy new Firebase-enabled backend
5. **Monitor migration** - Check for auth errors in logs

---

## 🌐 Internationalization

The app supports multiple languages using `@nuxtjs/i18n`:

- **Bahasa Indonesia** (id) — Default language
- **English** (en)

Language can be switched from the settings page or app header.

## 🎨 Theming

Three theme modes are available:
- **Light Mode** — High contrast for daylight viewing
- **Dark Mode** — Reduced eye strain for low-light environments
- **System Mode** — Automatically matches OS preference

Theme preference is persisted in localStorage.

## 📱 Responsive Design

The application is fully responsive with:
- **Mobile** (< 768px) — Bottom navigation, stacked layouts
- **Tablet** (768px - 1024px) — Adaptive grid layouts
- **Desktop** (> 1024px) — Sidebar navigation, multi-column layouts

## 🚢 Deployment

The project is configured for automated deployment to GitHub Pages:

1. Every push to `master` triggers a GitHub Actions workflow
2. The workflow runs `npm run generate` to create a static site
3. Generated files from `.output/public/` are deployed to `gh-pages` branch
4. Site is available at: `https://yourusername.github.io/stocksX/`

### Manual Deployment

```bash
# Generate static site
npm run generate

# Deploy to GitHub Pages (requires gh-pages package)
npx gh-pages -d .output/public
```

## 🧪 Testing

```bash
# Run unit tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- Use Biome for linting and formatting
- Follow Vue 3 Composition API best practices
- Write TypeScript with strict type checking
- Add tests for new features

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## ⚠️ Legal Disclaimer

**StocksX is a demonstration application for educational purposes only.**

- All stock prices, charts, and financial data are **mock data**
- **Not affiliated** with OJK (Otoritas Jasa Keuangan), IDX (Indonesia Stock Exchange), or any licensed financial institution
- **Not a licensed broker** or financial advisor
- **Do not use** for actual investment decisions
- **No warranty** provided for accuracy or reliability of any information

Always consult with licensed financial advisors and conduct your own research before making investment decisions.

## 📧 Contact

For questions or feedback, please open an issue on GitHub.

---

Made with ❤️ using Nuxt and Vue
