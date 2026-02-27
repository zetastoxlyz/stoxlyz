export type NewsArticle = {
	title: string;
	link: string;
	contentSnippet: string;
	isoDate: string;
	image?: { small?: string; large?: string };
	source: string;
};

type ApiResponse = {
	data: Omit<NewsArticle, "source">[];
};

const SOURCES = [
	{
		url: "https://berita-indo-api.vercel.app/v1/cnn-news/ekonomi",
		source: "CNN Indonesia",
	},
	{
		url: "https://berita-indo-api.vercel.app/v1/cnbc-news/market",
		source: "CNBC Indonesia",
	},
	{
		url: "https://berita-indo-api.vercel.app/v1/cnbc-news/investment",
		source: "CNBC Indonesia",
	},
	{
		url: "https://berita-indo-api.vercel.app/v1/republika-news/ekonomi",
		source: "Republika",
	},
	{
		url: "https://berita-indo-api.vercel.app/v1/tempo-news/bisnis",
		source: "Tempo",
	},
	{
		url: "https://berita-indo-api.vercel.app/v1/antara-news/ekonomi",
		source: "Antara",
	},
	{
		url: "https://berita-indo-api.vercel.app/v1/okezone-news/economy",
		source: "Okezone",
	},
	{
		url: "https://berita-indo-api.vercel.app/v1/suara/bisnis",
		source: "Suara",
	},
];

export const useNews = () => {
	const articles = useState<NewsArticle[]>("news-articles", () => []);
	const pending = useState("news-pending", () => false);
	const error = useState<string | null>("news-error", () => null);

	async function fetchAll() {
		if (articles.value.length) return;

		pending.value = true;
		error.value = null;

		try {
			const ECON_KEYWORDS = [
				"saham",
				"ihsg",
				"bursa",
				"investasi",
				"pasar modal",
				"rupiah",
				"inflasi",
				"suku bunga",
				"bi rate",
				"gdp",
				"ekonomi",
				"bisnis",
				"keuangan",
				"bank",
				"laba",
				"pendapatan",
				"emiten",
				"ipo",
				"obligasi",
				"reksa dana",
				"devisa",
				"ekspor",
				"impor",
				"neraca",
				"anggaran",
				"apbn",
				"pajak",
				"bumn",
				"pdb",
				"manufaktur",
				"komoditas",
				"minyak",
				"emas",
				"nikel",
				"batu bara",
				"kripto",
				"fintech",
				"startup",
				"merger",
				"akuisisi",
				"dividen",
			];

			const isEconomics = (a: NewsArticle) => {
				const text = (a.title + " " + a.contentSnippet).toLowerCase();
				return ECON_KEYWORDS.some((kw) => text.includes(kw));
			};

			const results = await Promise.allSettled(
				SOURCES.map(({ url, source }) =>
					$fetch<ApiResponse>(url).then((res) =>
						(res.data ?? []).map((a) => ({ ...a, source })),
					),
				),
			);

			const merged: NewsArticle[] = [];
			for (const r of results) {
				if (r.status === "fulfilled")
					merged.push(...r.value.filter(isEconomics));
			}

			// Sort newest first
			merged.sort(
				(a, b) => new Date(b.isoDate).getTime() - new Date(a.isoDate).getTime(),
			);
			articles.value = merged;
		} catch (e: any) {
			error.value = e?.message ?? "Failed to load news";
		} finally {
			pending.value = false;
		}
	}

	return { articles, pending, error, fetchAll };
};
