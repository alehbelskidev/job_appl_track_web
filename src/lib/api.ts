import ky, { type KyInstance, type Options, SchemaValidationError } from 'ky'
import { type ZodType } from 'zod'
import { useAuthStore } from '@/store/auth-store'

interface TokensDTO {
	access_token: string
	refresh_token: string
}

let refreshPromise: Promise<string> | null = null

const BASE_URL = 'http://localhost:3001'

async function refreshAccessToken(): Promise<string> {
	if (refreshPromise) return refreshPromise
	const authStore = useAuthStore.getState()

	refreshPromise = (async () => {
		const refreshToken = authStore.refreshToken
		if (!refreshToken) throw new Error('No refresh token')

		const res = await ky.post('/auth/refresh', {
			prefix: BASE_URL,
			json: { refresh_token: refreshToken },
		}).json<TokensDTO>()

		authStore.refresh({ accessToken: res.access_token, refreshToken: res.refresh_token })
		return res.access_token
	})()
		.catch((err) => {
			authStore.clear()
			throw err
		})
		.finally(() => {
			refreshPromise = null
		})

	return refreshPromise
}

function createApiClient(): KyInstance {
	return ky.create({
		prefix: BASE_URL,
		hooks: {
			beforeRequest: [
				(state) => {
					if (state.request.url.includes('/api/')) {
						const authStore = useAuthStore.getState()
						if (authStore.accessToken) {
							state.request.headers.set('Authorization', `Bearer ${authStore.accessToken}`)
						}
					}
				},
			],
			afterResponse: [
				async (state) => {
					if (state.response.status !== 401) return state.response
					if (!state.request.url.includes('/api/')) return state.response

					try {
						const newToken = await refreshAccessToken()
						state.request.headers.set('Authorization', `Bearer ${newToken}`)
						return ky(state.request)
					} catch {
						return state.response
					}
				},
			],
		},
	})
}

export const apiClient = createApiClient()

export const api = {
	get: <T>(url: string, schema: ZodType<T>, options?: Options) =>
		apiClient.get(url, options).json(schema),

	post: <T>(url: string, json: unknown, schema: ZodType<T>, options?: Options) =>
		apiClient.post(url, { ...options, json }).json(schema),

	patch: <T>(url: string, json: unknown, schema: ZodType<T>, options?: Options) =>
		apiClient.patch(url, { ...options, json }).json(schema),

	delete: <T>(url: string, schema: ZodType<T>, options?: Options) =>
		apiClient.delete(url, options).json(schema),
}

export { SchemaValidationError }
