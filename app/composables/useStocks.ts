import { stocks, type Stock } from '@/data/stocks'

export const useStocks = () => {
  const getStocks = (): Stock[] => {
    return stocks
  }

  const getStock = (ticker: string): Stock | undefined => {
    return stocks.find((s) => s.ticker === ticker)
  }

  const getTopGainers = (limit: number = 10): Stock[] => {
    return [...stocks]
      .filter((s) => s.changePercent > 0)
      .sort((a, b) => b.changePercent - a.changePercent)
      .slice(0, limit)
  }

  const getTopLosers = (limit: number = 10): Stock[] => {
    return [...stocks]
      .filter((s) => s.changePercent < 0)
      .sort((a, b) => a.changePercent - b.changePercent)
      .slice(0, limit)
  }

  const getMostActive = (limit: number = 10): Stock[] => {
    return [...stocks]
      .sort((a, b) => b.volume - a.volume)
      .slice(0, limit)
  }

  const getStocksBySector = (sector: string): Stock[] => {
    return stocks.filter((s) => s.sector === sector)
  }

  const getTrendingStocks = (): Stock[] => {
    const shuffled = [...stocks].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, 8)
  }

  return {
    getStocks,
    getStock,
    getTopGainers,
    getTopLosers,
    getMostActive,
    getStocksBySector,
    getTrendingStocks,
  }
}
