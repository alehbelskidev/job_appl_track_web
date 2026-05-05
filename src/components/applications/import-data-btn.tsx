import { buttonVariants } from "@/components/ui/button"
import { HugeiconsIcon } from "@hugeicons/react"
import { Upload01Icon } from "@hugeicons/core-free-icons"
import { importApplicationSchema, applicationsResponseSchema, type ImportApplicationSchema } from "@/schemas"
import { cn } from "@/lib/utils"
import type { ChangeEventHandler } from "react"
import { toast } from "sonner"
import { useMutation } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { useRouter } from "@tanstack/react-router"

export function ImportDataBtn() {
	const router = useRouter()

	const { mutate } = useMutation({
		mutationKey: ['import-applications'],
		mutationFn: (data: ImportApplicationSchema[]) => api.post('/api/applications/import', data, applicationsResponseSchema),
		onError: (err) => {
			toast.error(err.message)
		},
		onSuccess: ({ data }) => {
			router.invalidate()
			toast.success(`${data.length} Applications where successfully imported!`)
		},
	})

	const onUpload: ChangeEventHandler<HTMLInputElement> = (e) => {
		const file = e.target.files?.[0]
		if (!file) return

		const reader = new FileReader()

		reader.onload = (event) => {
			try {
				const jsonString = event.target?.result as string
				const data = JSON.parse(jsonString)

				const applications = importApplicationSchema.array().parse(data.data)
				mutate(applications)
			} catch (err) {
				toast.error("Failed to read provided json file.")
				console.error("Invalid JSON file", err)
			} finally {
				e.target.value = ""
			}
		}

		reader.readAsText(file)
	}

	return (
		<label htmlFor="upload-input" className={cn("cursor-pointer", buttonVariants({ variant: 'outline' }))}>
			<HugeiconsIcon icon={Upload01Icon} />
			Upload
			<input id="upload-input" multiple={false} type="file" accept="json" hidden onChange={onUpload} />
		</label>
	)
}
