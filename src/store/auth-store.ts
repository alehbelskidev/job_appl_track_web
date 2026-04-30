import { create } from "zustand"

type Nullable<T> = {
	[P in keyof T]: T[P] | null;
};


interface Tokens {
	accessToken: string | null
	refreshToken: string | null
}

interface Auth extends Tokens {
	email: string | null
	isAuthenticated: boolean
}

type AuthStore = Nullable<Auth> & {
	update: (auth: Auth) => void
	refresh: (tokens: Tokens) => void
	clear: () => void
}

const INITIAL_STATE = { email: null, accessToken: null, refreshToken: null }
const getIsAuthenticated = (auth: Pick<Auth, 'email' | 'accessToken' | 'refreshToken'>) => Boolean(auth.accessToken && auth.refreshToken && auth.email)

export const useAuthStore = create<AuthStore>((set, get) => ({
	email: null,
	accessToken: null,
	refreshToken: null,
	isAuthenticated: false,
	update: (auth) => {
		localStorage.setItem('auth', JSON.stringify(auth))
		set({ ...auth, isAuthenticated: getIsAuthenticated(auth) })
	},
	refresh: (tokens) => {
		const { email } = get()
		const auth = { email, ...tokens }
		localStorage.setItem('auth', JSON.stringify(auth))
		set({ ...auth, isAuthenticated: getIsAuthenticated(auth) })
	},
	clear: () => {
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
		useAuthStore.setState({ ...auth, isAuthenticated: getIsAuthenticated(auth) })
	})()

