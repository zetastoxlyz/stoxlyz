import {
	getAuth,
	signInWithEmailAndPassword,
	createUserWithEmailAndPassword,
	signInWithPopup,
	GoogleAuthProvider,
	signOut,
	sendPasswordResetEmail,
	updateProfile,
	type UserCredential,
} from "firebase/auth";

export interface AuthError {
	code: string;
	message: string;
}

const errorMessages: Record<string, string> = {
	"auth/invalid-email": "Invalid email address format.",
	"auth/user-disabled": "This account has been disabled.",
	"auth/user-not-found": "No account found with this email.",
	"auth/wrong-password": "Incorrect password.",
	"auth/invalid-credential": "Invalid email or password.",
	"auth/email-already-in-use": "An account with this email already exists.",
	"auth/weak-password": "Password should be at least 6 characters.",
	"auth/too-many-requests": "Too many failed attempts. Please try again later.",
	"auth/network-request-failed": "Network error. Please check your connection.",
	"auth/popup-closed-by-user": "Sign-in was cancelled.",
	"auth/popup-blocked": "Popup was blocked. Please allow popups for this site.",
	"auth/unauthorized-domain": "This domain is not authorized for OAuth.",
	"auth/operation-not-allowed": "This sign-in method is not enabled.",
};

function getErrorMessage(error: { code?: string; message?: string }): string {
	if (error.code && errorMessages[error.code]) {
		return errorMessages[error.code];
	}
	return error.message || "An unexpected error occurred. Please try again.";
}

export function useFirebaseAuth() {
	const { $firebaseAuth } = useNuxtApp();
	const auth = $firebaseAuth as ReturnType<typeof getAuth>;
	const loading = ref(false);
	const error = ref<string | null>(null);

	/**
	 * Sign in with email and password
	 */
	async function loginWithEmail(
		email: string,
		password: string,
	): Promise<UserCredential | null> {
		loading.value = true;
		error.value = null;

		try {
			const result = await signInWithEmailAndPassword(auth, email, password);
			return result;
		} catch (err) {
			error.value = getErrorMessage(err as { code?: string; message?: string });
			return null;
		} finally {
			loading.value = false;
		}
	}

	/**
	 * Sign in with Google OAuth
	 */
	async function loginWithGoogle(): Promise<UserCredential | null> {
		loading.value = true;
		error.value = null;

		try {
			const provider = new GoogleAuthProvider();
			// Add scopes if needed
			provider.addScope("https://www.googleapis.com/auth/userinfo.email");
			provider.addScope("https://www.googleapis.com/auth/userinfo.profile");

			// Set custom parameters
			provider.setCustomParameters({
				prompt: "select_account",
			});

			const result = await signInWithPopup(auth, provider);
			return result;
		} catch (err) {
			error.value = getErrorMessage(err as { code?: string; message?: string });
			return null;
		} finally {
			loading.value = false;
		}
	}

	/**
	 * Register a new user with email and password
	 */
	async function register(
		email: string,
		password: string,
		displayName?: string,
	): Promise<UserCredential | null> {
		loading.value = true;
		error.value = null;

		try {
			const result = await createUserWithEmailAndPassword(
				auth,
				email,
				password,
			);

			// Update profile with display name if provided
			if (displayName && result.user) {
				await updateProfile(result.user, { displayName });
				// Reload user to get updated profile
				await result.user.reload();
			}

			return result;
		} catch (err) {
			error.value = getErrorMessage(err as { code?: string; message?: string });
			return null;
		} finally {
			loading.value = false;
		}
	}

	/**
	 * Sign out the current user
	 */
	async function logout(): Promise<void> {
		loading.value = true;
		error.value = null;

		try {
			await signOut(auth);
		} catch (err) {
			error.value = getErrorMessage(err as { code?: string; message?: string });
			throw err;
		} finally {
			loading.value = false;
		}
	}

	/**
	 * Send password reset email
	 */
	async function resetPassword(email: string): Promise<boolean> {
		loading.value = true;
		error.value = null;

		try {
			await sendPasswordResetEmail(auth, email);
			return true;
		} catch (err) {
			error.value = getErrorMessage(err as { code?: string; message?: string });
			return false;
		} finally {
			loading.value = false;
		}
	}

	/**
	 * Get the current ID token (useful for API calls)
	 */
	async function getIdToken(forceRefresh = false): Promise<string | null> {
		const user = auth.currentUser;
		if (!user) return null;

		try {
			return await user.getIdToken(forceRefresh);
		} catch (err) {
			console.error("[FirebaseAuth] Failed to get ID token:", err);
			return null;
		}
	}

	/**
	 * Clear any auth errors
	 */
	function clearError() {
		error.value = null;
	}

	return {
		// State
		loading: readonly(loading),
		error: readonly(error),
		isAuthenticated: computed(() => !!auth.currentUser),
		currentUser: computed(() => auth.currentUser),

		// Methods
		loginWithEmail,
		loginWithGoogle,
		register,
		logout,
		resetPassword,
		getIdToken,
		clearError,
	};
}
