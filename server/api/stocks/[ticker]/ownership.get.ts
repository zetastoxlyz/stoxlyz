export default defineEventHandler(async (event) => {
	const raw = getRouterParam(event, "ticker")!.toUpperCase();
	const ticker = raw.endsWith(".JK") ? raw.slice(0, -3) : raw;

	const access_token = getCookie(event, "stoxlyz_token");
	if (!access_token) {
		throw createError({ statusCode: 401, message: "Unauthorized" });
	}

	const baseUrl = process.env.STOXLYZ_BASE_URL ?? "http://127.0.0.1:8000";

	try {
		const res = await $fetch<{
			share_code: string;
			count: number;
			records: {
				share_code: string;
				investor_code: string;
				percentage: number;
				confidence: number;
				notes: string | null;
			}[];
		}>(`${baseUrl}/ownership/${ticker}`, {
			headers: { Authorization: `Bearer ${access_token}` },
		});
		return res?.records ?? [];
	} catch {
		return [];
	}
});
