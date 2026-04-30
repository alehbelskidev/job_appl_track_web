import { useAuthStore } from "@/store/auth-store"
import { getRouteApi } from "@tanstack/react-router"
import { LogoutButton } from "@/components/logout-button"

const routeApi = getRouteApi('/app')

export function AppRoute() {
	const { email } = useAuthStore()
	const data = routeApi.useLoaderData()

	return <div className="flex flex-col w-full min-h-screen">
		<header className="p-4 flex items-center justify-between">
			<h1>Welcome, {email}!</h1>
			<LogoutButton />
		</header>
		<code>{JSON.stringify(data)}</code>
	</div>
}
