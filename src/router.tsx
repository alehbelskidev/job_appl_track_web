import {
	createRootRoute,
	createRoute,
	createRouter,
	redirect
} from '@tanstack/react-router'
import { useAuthStore } from './store/auth-store'

const rootRoute = createRootRoute()

const loginRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: '/login',
	beforeLoad: () => {
		if (useAuthStore.getState().isAuthenticated) {
			throw redirect({ to: '/app' })
		}
	},
	component: () => <div>Login Page</div>,
})

const registerRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: '/register',
	component: () => <div>Register Page</div>,
})

const appRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: '/app',
	beforeLoad: () => {
		if (!useAuthStore.getState().isAuthenticated) {
			throw redirect({ to: '/login' })
		}
	},
	component: () => <div>Welcome to the App!</div>,
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
