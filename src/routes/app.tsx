import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/store/auth-store"
import { useNavigate } from "@tanstack/react-router"

export function AppRoute() {
	const navigate = useNavigate()
	const { clear, email } = useAuthStore()

	const logout = () => {
		clear()
		navigate({ to: '/login' })
	}

	return <div className="flex flex-col w-full min-h-screen">
		<h1>Welcome, {email}!</h1>
		<Button onClick={logout}>Logout</Button>
	</div>
}
