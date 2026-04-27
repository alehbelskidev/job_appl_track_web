import { create } from "zustand"

type Nullable<T> = {
	[P in keyof T]: T[P] | null;
};


interface Tokens {
	accessToken: string
	refreshToken: string
}

interface Auth extends Tokens {
	email: string
	isAuthenticated: boolean
}

type AuthStore = Nullable<Auth> & {
	update: (auth: Auth) => void
}

const INITIAL_STATE = { email: null, accessToken: null, refreshToken: null }

export const useAuthStore = create<AuthStore>((set) => ({
	email: null,
	accessToken: null,
	refreshToken: null,
	isAuthenticated: false,
	update: (auth) => {
		localStorage.setItem('auth', JSON.stringify(auth))
		set({ ...auth, isAuthenticated: Boolean(auth.accessToken && auth.refreshToken && auth.email) })
	},
	logout: () => {
		localStorage.setItem('auth', JSON.stringify(INITIAL_STATE))
		set({ ...INITIAL_STATE, isAuthenticated: false })
	}
}))

	; (() => {
		let authDataMaybeStr = localStorage.getItem('auth')
		if (!authDataMaybeStr) {
			authDataMaybeStr = JSON.stringify(INITIAL_STATE)
			localStorage.setItem('auth', authDataMaybeStr)
		}

		const auth: Auth = JSON.parse(authDataMaybeStr)
		useAuthStore.setState({ ...auth, isAuthenticated: Boolean(auth.accessToken && auth.refreshToken && auth.email) })
	})()

