import {
	initializeApp,
	getApps,
	cert,
	type ServiceAccount,
	type App,
} from "firebase-admin/app";
import { getAuth, type DecodedIdToken } from "firebase-admin/auth";

let adminApp: App | null = null;

/**
 * Load service account from file
 */
async function loadServiceAccountFromFile(): Promise<
	ServiceAccount | undefined
> {
	if (!process.env.FIREBASE_SERVICE_ACCOUNT_PATH) return undefined;

	try {
		const fs = await import("fs");
		const path = await import("path");
		const serviceAccountPath = path.resolve(
			process.env.FIREBASE_SERVICE_ACCOUNT_PATH,
		);

		if (fs.existsSync(serviceAccountPath)) {
			const fileContent = fs.readFileSync(serviceAccountPath, "utf-8");
			return JSON.parse(fileContent) as ServiceAccount;
		}
	} catch (err) {
		console.error(
			"[FirebaseAdmin] Failed to load service account from file:",
			err,
		);
	}
	return undefined;
}

/**
 * Initialize Firebase Admin SDK
 * Supports both file path and base64 encoded service account
 */
export async function initializeFirebaseAdmin(): Promise<App> {
	if (adminApp) return adminApp;

	// Check if already initialized
	const existingApp = getApps()[0];
	if (existingApp) {
		adminApp = existingApp;
		return adminApp;
	}

	let serviceAccount: ServiceAccount | undefined;

	// Try to load from base64 encoded env var (for production/deployment)
	const base64ServiceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;
	if (base64ServiceAccount) {
		try {
			const decoded = Buffer.from(base64ServiceAccount, "base64").toString(
				"utf-8",
			);
			serviceAccount = JSON.parse(decoded) as ServiceAccount;
		} catch (err) {
			console.error(
				"[FirebaseAdmin] Failed to parse base64 service account:",
				err,
			);
		}
	}

	// Try to load from file path
	if (!serviceAccount && process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
		serviceAccount = await loadServiceAccountFromFile();
	}

	// Initialize with service account or without (for emulator or default credentials)
	if (serviceAccount) {
		adminApp = initializeApp({
			credential: cert(serviceAccount),
		});
		console.log("[FirebaseAdmin] Initialized with service account");
	} else if (process.env.FIREBASE_AUTH_EMULATOR_HOST) {
		// Use emulator (no credentials needed)
		adminApp = initializeApp({
			projectId: process.env.FIREBASE_PROJECT_ID || "demo-project",
		});
		console.log("[FirebaseAdmin] Initialized for emulator");
	} else {
		// Try to use default credentials (GCP environment)
		try {
			adminApp = initializeApp();
			console.log("[FirebaseAdmin] Initialized with default credentials");
		} catch (err) {
			console.warn(
				"[FirebaseAdmin] Failed to initialize. Authentication will not work on server side.",
				err instanceof Error ? err.message : err,
			);
			// Create a dummy app that will throw on auth operations
			throw createError({
				statusCode: 500,
				statusMessage: "Firebase Admin not configured",
			});
		}
	}

	return adminApp;
}

/**
 * Get Firebase Auth instance
 */
export async function getFirebaseAuth() {
	const app = await initializeFirebaseAdmin();
	return getAuth(app);
}

/**
 * Verify Firebase ID token
 * @param token - The ID token to verify
 * @returns Decoded token or null if invalid
 */
export async function verifyIdToken(
	token: string,
): Promise<DecodedIdToken | null> {
	try {
		const auth = await getFirebaseAuth();
		return await auth.verifyIdToken(token, true); // Check revoked
	} catch (err) {
		console.warn(
			"[FirebaseAdmin] Token verification failed:",
			err instanceof Error ? err.message : err,
		);
		return null;
	}
}

/**
 * Get user by UID
 */
export async function getUserByUid(uid: string) {
	try {
		const auth = await getFirebaseAuth();
		return await auth.getUser(uid);
	} catch (err) {
		console.warn(
			"[FirebaseAdmin] Failed to get user:",
			err instanceof Error ? err.message : err,
		);
		return null;
	}
}

/**
 * Set custom claims for a user (admin use)
 */
export async function setCustomUserClaims(
	uid: string,
	claims: Record<string, unknown>,
): Promise<boolean> {
	try {
		const auth = await getFirebaseAuth();
		await auth.setCustomUserClaims(uid, claims);
		return true;
	} catch (err) {
		console.error(
			"[FirebaseAdmin] Failed to set custom claims:",
			err instanceof Error ? err.message : err,
		);
		return false;
	}
}

/**
 * Create a new user (admin use)
 */
export async function createUser(userData: {
	email: string;
	password: string;
	displayName?: string;
	role?: string;
}) {
	try {
		const auth = await getFirebaseAuth();
		const user = await auth.createUser({
			email: userData.email,
			password: userData.password,
			displayName: userData.displayName,
			emailVerified: false,
		});

		// Set custom claims for role
		if (userData.role) {
			await auth.setCustomUserClaims(user.uid, { role: userData.role });
		}

		return user;
	} catch (err) {
		console.error(
			"[FirebaseAdmin] Failed to create user:",
			err instanceof Error ? err.message : err,
		);
		throw err;
	}
}
