import { yf } from '../../utils/yf'
import { mapYfQuote } from '../../utils/yfMapper'
import { getAllStocks } from '../../utils/dummy'
import { TICKERS } from '../../../app/data/stocks'

type MoverType = 'gainers' | 'losers' | 'volume' | 'frequency'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const type = (query.type as MoverType) ?? 'gainers'
  const limit = Number(query.limit ?? 5)

  let all: Awaited<ReturnType<typeof getAllStocks>>

  try {
    const results = await Promise.allSettled(
      TICKERS.map((ticker) =>
        yf.quoteSummary(ticker, { modules: ['price', 'summaryDetail', 'defaultKeyStatistics'] })
          .then((data) => {
            const q = {
              ...(data.price ?? {}),
              ...(data.summaryDetail ?? {}),
              ...(data.defaultKeyStatistics ?? {}),
            }
            return mapYfQuote(ticker, q)
          })
      )
    )

    all = results
      .map((r, i) => {
        if (r.status === 'fulfilled') return r.value
        return null
      })
      .filter(Boolean) as ReturnType<typeof getAllStocks>

    if (all.length === 0) all = getAllStocks()
  }
  catch {
    all = getAllStocks()
  }

  if (type === 'gainers') {
    return all
      .filter((s) => s.changePercent > 0)
      .sort((a, b) => b.changePercent - a.changePercent)
      .slice(0, limit)
  }
  if (type === 'losers') {
    return all
      .filter((s) => s.changePercent < 0)
      .sort((a, b) => a.changePercent - b.changePercent)
      .slice(0, limit)
  }
  if (type === 'frequency') {
    return all
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, limit)
  }
  // volume
  return all
    .sort((a, b) => b.volume - a.volume)
    .slice(0, limit)
})
