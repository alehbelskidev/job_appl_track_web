import { useState } from "react"
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet"
import {
	Field,
	FieldLabel,
	FieldError,
} from "@/components/ui/field"
import { buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { HugeiconsIcon } from "@hugeicons/react"
import { NoteAddIcon, Tick02Icon } from "@hugeicons/core-free-icons"
import { api } from '@/lib/api'
import { toast } from "sonner"
import { applicationResponseSchema, type CreateApplicationSchema, createApplicationSchema } from "@/schemas"
import { useMutation } from "@tanstack/react-query"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "@tanstack/react-router"
import { cn } from "@/lib/utils"

export function CreateApplicationSheet() {
	const [open, setOpen] = useState(false)
	const router = useRouter()
	const form = useForm<CreateApplicationSchema>({
		resolver: zodResolver(createApplicationSchema),
		defaultValues: {
			company: "",
			role: "",
			description: "",
			url: "",
			notes: "",
		}
	})

	const { mutate } = useMutation({
		mutationKey: ['create-application'],
		mutationFn: (data: CreateApplicationSchema) => api.post('/api/applications', data, applicationResponseSchema),
		onError: (err) => {
			toast.error(err.message)
		},
		onSuccess: ({ data }) => {
			router.invalidate()
			setOpen(false)
			toast.success(`Application for ${data.role} in ${data.company} has been created!`)
		},
	})

	const onSubmit = (data: CreateApplicationSchema) => {
		mutate(data)
	}

	return (
		<Sheet open={open} onOpenChange={o => setOpen(o)}>
			<SheetTrigger onClick={() => setOpen(true)} className={cn("flex items-center gap-2", buttonVariants({ variant: "outline" }))}><HugeiconsIcon icon={NoteAddIcon} /> Application</SheetTrigger>
			<SheetContent>
				<SheetHeader>
					<SheetTitle>Are you absolutely sure?</SheetTitle>
					<SheetDescription>This action cannot be undone.</SheetDescription>
				</SheetHeader>

				<form id="create-application" onSubmit={form.handleSubmit(onSubmit)} className="p-4 flex flex-col gap-4">
					<Controller
						name="company"
						control={form.control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel htmlFor={field.name}>Company*</FieldLabel>
								<Input
									{...field}
									id={field.name}
									type="text"
									aria-invalid={fieldState.invalid}
									required
								/>
								{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
							</Field>
						)}
					/>
					<Controller
						name="role"
						control={form.control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel htmlFor={field.name}>Role*</FieldLabel>
								<Input
									{...field}
									id={field.name}
									type="text"
									aria-invalid={fieldState.invalid}
									required
								/>
								{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
							</Field>
						)}
					/>
					<Controller
						name="description"
						control={form.control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel htmlFor={field.name}>Description</FieldLabel>
								<Textarea
									{...field}
									id={field.name}
									aria-invalid={fieldState.invalid}
								/>
								{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
							</Field>
						)}
					/>
					<Controller
						name="url"
						control={form.control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel htmlFor={field.name}>URL</FieldLabel>
								<Input
									{...field}
									id={field.name}
									type="text"
									aria-invalid={fieldState.invalid}
									required
								/>
								{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
							</Field>
						)}
					/>
					<Controller
						name="notes"
						control={form.control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel htmlFor={field.name}>Notes</FieldLabel>
								<Textarea
									{...field}
									id={field.name}
									aria-invalid={fieldState.invalid}
								/>
								{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
							</Field>
						)}
					/>
				</form>

				<SheetFooter>
					<Button form="create-application">
						<HugeiconsIcon icon={Tick02Icon} />

						Save</Button>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	)
}
