# StoxLyz

Indonesian stock market information platform for retail investors. A modern, responsive web app built with Nuxt 4 and Vue 3.

> **Demo only** — all data is static/mock. Not a licensed broker or financial advisor.

## Features

- **Watchlist** — Save and sort favorite stocks, persisted in localStorage
- **News Feed** — Articles categorized by Market, Stocks, Economy, Education
- **Economic Indicators** — Indonesian macro data in grid and table views
- **Authentication** — Dummy login/register flow with JWT (HS256, client-side) and role-based access
- **Role-based routes** — Admin panel restricted to `admin` and `superadmin` roles via named middleware
- **Theming** — Light, dark, and system modes
- **i18n** — Bahasa Indonesia (default) and English
- **Mobile-first** — Bottom nav on mobile, sidebar on desktop

## Tech Stack

| Layer | Library |
|-------|---------|
| Framework | Nuxt 4.3 + Vue 3 + TypeScript |
| Styling | Tailwind CSS v3 + shadcn-vue (New York / zinc) |
| State | Pinia + localStorage |
| Icons | Lucide Vue Next |
| i18n | @nuxtjs/i18n |
| Deployment | GitHub Pages (static generation) |

## Getting Started

```bash
npm install
npm run dev       # http://localhost:3000
```

Other commands:

```bash
npm run build     # Production build
npm run generate  # Static site → .output/public/
npm run preview   # Preview production build locally
```

## Project Structure

```
app/
├── pages/          # File-based routes
│   ├── index.vue
│   ├── watchlist.vue
│   ├── indicators.vue
│   ├── settings.vue
│   ├── stocks/[ticker].vue
│   ├── news/index.vue
│   ├── news/[id].vue
│   ├── auth/{login,register}.vue
│   ├── profile.vue
│   └── admin/index.vue   # Admin panel — requires Admin or Super Admin role
├── components/     # Auto-imported components
│   ├── home/       # Dashboard widgets
│   ├── stock/      # Stock detail sections
│   ├── watchlist/
│   ├── news/
│   ├── indicators/
│   ├── layout/     # AppHeader, AppSidebar, AppBottomNav
│   ├── shared/     # Reusable cross-page components
│   └── ui/         # shadcn-vue primitives
├── composables/    # useStocks, useNews, useIndicators, useAuth, useSearch
├── stores/         # watchlist.ts, user.ts
├── data/           # Static mock data (stocks, news, indicators, sectors)
└── lib/            # Utility helpers
i18n/locales/
├── id.json         # Bahasa Indonesia (default)
└── en.json         # English
```

Role-based access:

- **User** — access to all public pages (home, watchlist, news, indicators, stocks, profile, settings)
- **Admin** — same as User + `/admin` panel
- **Super Admin** — same as Admin (currently identical in the UI)

> The admin panel is at `/admin`, not `/superadmin`.

## Deployment

Automatically deployed to GitHub Pages on every push to `master` via GitHub Actions. The workflow runs `npm run generate` and publishes `.output/public/` to the `gh-pages` environment.

Live URL: `https://<username>.github.io/stocksX/`

## Disclaimer

StoxLyz is a demonstration application. All stock data, prices, and financial figures are **mock data for development purposes only**. This application is **not affiliated with OJK**, IDX, or any licensed financial institution. Do not make investment decisions based on this app.
