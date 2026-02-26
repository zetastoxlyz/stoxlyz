import { DUMMY_STOCKS } from '../../../utils/dummy'

export default defineEventHandler((event) => {
  const raw = getRouterParam(event, 'ticker')!.toUpperCase()
  const ticker = raw.endsWith('.JK') ? raw : `${raw}.JK`
  const stock = DUMMY_STOCKS[ticker]

  if (!stock) {
    throw createError({ statusCode: 404, statusMessage: `Stock ${ticker} not found` })
  }

  return stock
})
