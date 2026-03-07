export default defineEventHandler(async (event) => {
	const { username, password } = await readBody(event);
	const baseUrl = process.env.STOXLYZ_BASE_URL ?? "http://127.0.0.1:8000";

	const data = await $fetch<{ access_token: string }>(`${baseUrl}/login`, {
		method: "POST",
		body: { username, password },
	});

	setCookie(event, "stoxlyz_token", data.access_token, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax",
		maxAge: 60 * 60 * 24, // 1 day
		path: "/",
	});

	const payloadB64 = data.access_token.split(".")[1]!;
	const decoded = JSON.parse(Buffer.from(payloadB64, "base64url").toString());

	return { response: true, user: { name: decoded.name, email: decoded.sub, role: decoded.role } };
});
