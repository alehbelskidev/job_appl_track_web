import {
	createRootRoute,
	createRoute,
	createRouter,
	redirect
} from '@tanstack/react-router'
import { useAuthStore } from './store/auth-store'
import { LoginRoute } from './routes/login'
import { RegisterRoute } from './routes/register'
import { AppRoute } from './routes/app'
import { api } from './lib/api'
import { applicationsResponseSchema } from './schemas'

const rootRoute = createRootRoute()

const loginRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: '/login',
	beforeLoad: () => {
		if (useAuthStore.getState().isAuthenticated) {
			throw redirect({ to: '/app' })
		}
	},
	component: LoginRoute,
})

const registerRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: '/register',
	component: RegisterRoute,
})

const appRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: '/app',
	beforeLoad: () => {
		if (!useAuthStore.getState().isAuthenticated) {
			throw redirect({ to: '/login' })
		}
	},
	loader: () => api.get('/api/applications', applicationsResponseSchema),
	component: AppRoute,
})

const indexRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: '/',
	beforeLoad: () => {
		const auth = useAuthStore.getState().isAuthenticated
		throw redirect({ to: auth ? '/app' : '/login' })
	},
})

const routeTree = rootRoute.addChildren([
	indexRoute,
	loginRoute,
	registerRoute,
	appRoute
])

export const router = createRouter({
	routeTree,
	defaultPreload: 'intent'
})
