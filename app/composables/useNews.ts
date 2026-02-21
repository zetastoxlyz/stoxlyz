import { newsArticles, type NewsArticle } from '~/data/news'

export const useNews = () => {
  const getNews = (): NewsArticle[] => {
    return [...newsArticles].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    )
  }

  const getNewsById = (id: string): NewsArticle | undefined => {
    return newsArticles.find((n) => n.id === id)
  }

  const getNewsByCategory = (category: string): NewsArticle[] => {
    return [...newsArticles]
      .filter((n) => n.category === category)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }

  const getFeaturedNews = (): NewsArticle | undefined => {
    return [...newsArticles].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    )[0]
  }

  const getNewsForStock = (ticker: string): NewsArticle[] => {
    return [...newsArticles]
      .filter((n) => n.relatedTickers.includes(ticker))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }

  return {
    getNews,
    getNewsById,
    getNewsByCategory,
    getFeaturedNews,
    getNewsForStock,
  }
}
