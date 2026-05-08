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
import { SettingsRoute } from './routes/settings'
import { DashboardRoute } from './routes/dashboard'
import { api } from './lib/api'
import { applicationsResponseSchema } from './schemas'

const rootRoute = createRootRoute()

const loginRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: '/login',
	beforeLoad: () => {
		if (useAuthStore.getState().isAuthenticated) {
			throw redirect({ to: '/app/dashboard' })
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
	component: AppRoute,
})

const dashboardRoute = createRoute({
	getParentRoute: () => appRoute,
	path: 'dashboard',
	loader: () => api.get('/api/applications', applicationsResponseSchema),
	component: DashboardRoute,
})

const settingsRoute = createRoute({
	getParentRoute: () => appRoute,
	path: 'settings',
	component: SettingsRoute,
})


const indexRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: '/',
	beforeLoad: () => {
		const auth = useAuthStore.getState().isAuthenticated
		throw redirect({ to: auth ? '/app/dashboard' : '/login' })
	},
})

const routeTree = rootRoute.addChildren([
	indexRoute,
	loginRoute,
	registerRoute,
	appRoute,
	dashboardRoute,
	settingsRoute,
])

export const router = createRouter({
	routeTree,
	defaultPreload: 'intent'
})
