import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuthStore } from "@/store/auth-store"
import { useNavigate, Link } from "@tanstack/react-router"
import { HugeiconsIcon } from "@hugeicons/react"
import { Logout01Icon, UserIcon, ArrowDown01Icon, Settings01Icon } from "@hugeicons/core-free-icons"

export function UserMenu() {
	const navigate = useNavigate()
	const { email, clear } = useAuthStore()

	const logout = () => {
		clear()
		navigate({ to: '/login' })
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger className="flex items-center gap-2">
				<HugeiconsIcon icon={UserIcon} />
				{email}
				<HugeiconsIcon icon={ArrowDown01Icon} />
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuGroup>
					<DropdownMenuLabel>My Account</DropdownMenuLabel>
					<DropdownMenuItem asChild>
						<Link to="/app/settings">
							<HugeiconsIcon icon={Settings01Icon} /> Settings
						</Link>
					</DropdownMenuItem>
					<DropdownMenuItem onClick={logout}>
						<HugeiconsIcon icon={Logout01Icon} /> Logout
					</DropdownMenuItem>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	)
} 
