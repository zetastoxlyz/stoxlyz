import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, onAuthStateChanged, type User } from "firebase/auth";

let firebaseApp: FirebaseApp | null = null;

export default defineNuxtPlugin(async () => {
	const config = useRuntimeConfig();
	const userStore = useUserStore();

	// Firebase client config from runtime config
	const firebaseConfig = {
		apiKey: config.public.firebaseApiKey as string,
		authDomain: config.public.firebaseAuthDomain as string,
		projectId: config.public.firebaseProjectId as string,
		storageBucket: config.public.firebaseStorageBucket as string,
		messagingSenderId: config.public.firebaseMessagingSenderId as string,
		appId: config.public.firebaseAppId as string,
	};

	console.log("[Firebase] Config loaded:", {
		apiKey: firebaseConfig.apiKey ? "✓" : "✗",
		authDomain: firebaseConfig.authDomain,
		projectId: firebaseConfig.projectId,
	});

	// Validate config
	if (
		!firebaseConfig.apiKey ||
		firebaseConfig.apiKey === "your_firebase_api_key"
	) {
		console.error(
			"[Firebase] API key not configured. Authentication will not work.",
		);
		userStore.authReady = true;
		return {
			provide: {
				firebaseApp: null,
				firebaseAuth: null,
			},
		};
	}

	// Initialize Firebase app (singleton)
	if (!getApps().length) {
		firebaseApp = initializeApp(firebaseConfig);
	} else {
		firebaseApp = getApps()[0];
	}

	const auth = getAuth(firebaseApp);

	// Wait for initial auth state
	await new Promise<void>((resolve) => {
		const unsubscribe = onAuthStateChanged(
			auth,
			async (user: User | null) => {
				await handleAuthStateChange(user, userStore);
				unsubscribe();
				resolve();
			},
			(error) => {
				console.error("[Firebase] Auth state error:", error);
				userStore.authReady = true;
				unsubscribe();
				resolve();
			},
		);
	});

	// Set up persistent listener for auth state changes
	onAuthStateChanged(auth, async (user) => {
		await handleAuthStateChange(user, userStore);
	});

	// Provide Firebase instances to the app
	return {
		provide: {
			firebaseApp,
			firebaseAuth: auth,
		},
	};
});

async function handleAuthStateChange(
	user: User | null,
	userStore: ReturnType<typeof useUserStore>,
) {
	if (user) {
		// Get ID token with claims
		const idTokenResult = await user.getIdTokenResult();
		const role =
			(idTokenResult.claims.role as "superadmin" | "admin" | "user") || "user";

		userStore.setFirebaseUser({
			uid: user.uid,
			email: user.email || "",
			displayName: user.displayName || "",
			photoURL: user.photoURL || undefined,
			role,
		});
	} else {
		userStore.clearFirebaseUser();
	}

	// Mark auth as ready after first check
	if (!userStore.authReady) {
		userStore.authReady = true;
	}
}

// Export for use in other parts of the app
export { firebaseApp };
