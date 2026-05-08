import { Outlet } from "@tanstack/react-router"
import { UserMenu } from "@/components/user/menu"
import { Link } from "@tanstack/react-router"

export function AppRoute() {
	return (
		<div className="flex flex-col w-full min-h-screen">
			<header className="w-full flex items-center justify-between p-4">
				<Link to="/app/dashboard">Dashboard</Link>
				<UserMenu />
			</header>
			<main>
				<Outlet />
			</main>
		</div>
	)
}
