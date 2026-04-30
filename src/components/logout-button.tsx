import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/store/auth-store"
import { useNavigate } from "@tanstack/react-router"
import { HugeiconsIcon } from "@hugeicons/react"
import { LogoutSquare01Icon } from "@hugeicons/core-free-icons"

export function LogoutButton() {
	const navigate = useNavigate()
	const { clear } = useAuthStore()

	const logout = () => {
		clear()
		navigate({ to: '/login' })
	}

	return <Button onClick={logout}>
		<HugeiconsIcon icon={LogoutSquare01Icon} />
		Logout
	</Button>
}
