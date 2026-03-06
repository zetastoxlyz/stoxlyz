export default defineEventHandler(async (event) => {
	const raw = getRouterParam(event, "ticker")!.toUpperCase();
	const ticker = raw.endsWith(".JK") ? raw.slice(0, -3) : raw;

	try {
		const res = await $fetch<{
			share_code: string;
			count: number;
			records: { share_code: string; investor_code: string; percentage: number; confidence: number; notes: string | null }[];
		}>(`https://api.stoxlyz.com/ownership/${ticker}`);
		return res?.records ?? [];
	} catch {
		return [];
	}
});
