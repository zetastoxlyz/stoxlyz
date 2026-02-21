import { stocks, type Stock } from '~/data/stocks'

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
    // Fisher-Yates shuffle for unbiased random ordering
    const arr = [...stocks]
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[arr[i], arr[j]] = [arr[j], arr[i]]
    }
    return arr.slice(0, 8)
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
