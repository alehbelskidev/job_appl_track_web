import type { ColumnDef } from "@tanstack/react-table"
import type { ApplicationSchema } from "@/schemas"
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { type UpdateApplicationSchema, applicationResponseSchema } from "@/schemas"
import { api } from "@/lib/api"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { useRouter } from "@tanstack/react-router"
import { format } from "date-fns"

const CELL_STATUS = ['Applied', 'Ghosted', 'Rejected', 'Connected', 'Failed']

export const useColumns = (): ColumnDef<ApplicationSchema>[] => {
	const router = useRouter()
	const { mutate } = useMutation({
		mutationKey: ['update-application'],
		mutationFn: (data: UpdateApplicationSchema & { id: string }) => api.patch(
			`/api/applications/${data.id}/status`,
			{ status: data.status },
			applicationResponseSchema,
		),
		onError: (e) => toast.error(e.message),
		onSuccess: ({ data }) => {
			toast.success(`Application to ${data.company} has been updated`)
			router.invalidate()
		}
	})

	const updateApplication = (id: string, value: string) => {
		const status = CELL_STATUS.indexOf(value.charAt(0).toUpperCase() + value.slice(1))

		mutate({ id, status })
	}

	return [
		{
			id: 'company',
			accessorKey: 'company',
			header: 'Company',
		},
		{
			id: 'role',
			accessorKey: 'role',
			header: 'Role',
		},
		{
			id: 'description',
			accessorKey: 'description',
			header: 'Description',
		},
		{
			id: 'url',
			accessorKey: 'url',
			header: 'Url',
		},
		{
			id: 'notes',
			accessorKey: 'notes',
			header: 'Notes',
		},
		{
			id: 'status',
			accessorKey: 'status',
			header: 'Status',
			cell: ({ getValue, row: { original } }) => {
				const cellValue = Number(getValue()) ?? 0
				const value = CELL_STATUS[cellValue].toLocaleLowerCase()

				return (
					<Select value={value} onValueChange={value => updateApplication(original.id, value)}>
						<SelectTrigger className="w-full max-w-48">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectGroup>
								<SelectLabel>Application Status</SelectLabel>
								{CELL_STATUS.map(item => <SelectItem key={item} value={item.toLocaleLowerCase()}>{item}</SelectItem>)}
							</SelectGroup>
						</SelectContent>
					</Select>
				)
			}
		},
		{
			id: 'date_applied',
			accessorKey: 'date_applied',
			header: 'Applied',
			sortingFn: 'datetime',
			cell: ({ getValue }) => format(getValue() as string, 'dd MMM yyyy HH:mm')
		},
		{
			id: 'date_updated',
			accessorKey: 'date_updated',
			header: 'Last Updated',
			sortingFn: 'datetime',
			sortUndefined: 'last',
			cell: ({ getValue }) => {
				const value = getValue()

				if (!value) {
					return "N/A"
				}

				return format(value as string, 'dd MMM yyyy HH:mm')
			}
		},
	]
} 
