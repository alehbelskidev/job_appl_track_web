import { type LoginSchema, loginSchema, authResponseSchema } from "@/schemas"
import { useMutation } from "@tanstack/react-query"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import {
	Field,
	FieldDescription,
	FieldGroup,
	FieldLabel,
	FieldError,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { api } from '@/lib/api'
import { toast } from "sonner"
import { HTTPError } from "ky"
import { useAuthStore } from "@/store/auth-store"
import { useNavigate } from "@tanstack/react-router"


const useLoginMutation = () => {
	const navigate = useNavigate()
	const { update } = useAuthStore()
	return useMutation({
		mutationKey: ['login'],
		mutationFn: (data: LoginSchema) => api.post('/auth/login', data, authResponseSchema),
		onError: (err) => {
			if (err instanceof HTTPError) {
				const status = err.response.status

				if (status === 401) {
					toast.error(err.data)
					return
				}
			}
			toast.error(err.message)
		},
		onSuccess: (data) => {
			update({
				email: data.email,
				accessToken: data.tokens.access_token,
				refreshToken: data.tokens.refresh_token,
				isAuthenticated: true,
			})
			navigate({ to: '/app' })
		},
	})
}

export function LoginRoute() {
	const { mutate } = useLoginMutation()
	const form = useForm<LoginSchema>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: "",
			password: "",
		}
	})

	const onSubmit = (data: LoginSchema) => {
		mutate(data)
	}

	return (
		<div className="min-h-screen w-full flex flex-col items-center justify-center">
			<Card className="w-full sm:w-sm">
				<CardHeader>
					<CardTitle>Login to your account</CardTitle>
					<CardDescription>
						Enter your email below to login to your account
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form id="login-form" onSubmit={form.handleSubmit(onSubmit)}>
						<FieldGroup>
							<Controller
								name="email"
								control={form.control}
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel htmlFor={field.name}>Email</FieldLabel>
										<Input
											{...field}
											id={field.name}
											type="email"
											placeholder="m@example.com"
											aria-invalid={fieldState.invalid}
											required
										/>
										{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
									</Field>
								)}
							/>
							<Controller
								name="password"
								control={form.control}
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel htmlFor={field.name}>Password</FieldLabel>
										<Input {...field} id={field.name} type="password" required data-invalid={fieldState.invalid} />
										{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
									</Field>
								)}
							/>
						</FieldGroup>
					</form>
				</CardContent>
				<CardFooter>
					<Field>
						<Button type="submit" form="login-form">Login</Button>
						<FieldDescription className="text-center">
							Don&apos;t have an account? <a href="/register">Sign up</a>
						</FieldDescription>
					</Field>
				</CardFooter>
			</Card>
		</div>
	)
}

