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
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { type UpdateApplicationSchema, applicationResponseSchema, deleteApplicationResponseSchema } from "@/schemas"
import { api } from "@/lib/api"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { useRouter } from "@tanstack/react-router"
import { format } from "date-fns"
import { HugeiconsIcon } from "@hugeicons/react"
import { RowDeleteIcon, EditTableIcon } from "@hugeicons/core-free-icons"
import { useAppStore } from "@/store/app-store"

const CELL_STATUS = ['Applied', 'Ghosted', 'Rejected', 'Connected', 'Failed']
const STATUS_COLORS: Record<string, string> = {
	applied: "text-blue-500",
	ghosted: "text-slate-400",
	rejected: "text-red-500",
	connected: "text-emerald-500",
	failed: "text-orange-500",
};

export const useColumns = (): ColumnDef<ApplicationSchema>[] => {
	const { setApplication } = useAppStore()
	const router = useRouter()
	const { mutate: mutateUpdate } = useMutation({
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

	const { mutate: mutateDelete } = useMutation({
		mutationKey: ['delete-application'],
		mutationFn: (data: { id: string }) => api.delete(
			`/api/applications/${data.id}`,
			deleteApplicationResponseSchema,
		),
		onError: (e) => toast.error(e.message),
		onSuccess: ({ data }) => {
			if (data) {
				toast.success(`Application has been deleted`)
				router.invalidate()
			} else {
				toast.error("Something went wrong!")
			}
		}
	})

	const updateApplication = (id: string, value: string) => {
		const status = CELL_STATUS.indexOf(value.charAt(0).toUpperCase() + value.slice(1))

		mutateUpdate({ id, status })
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
		// FYI: Can't decide ATM whether I need that in table
		// {
		// 	id: 'description',
		// 	accessorKey: 'description',
		// 	header: 'Description',
		// },
		// {
		// 	id: 'notes',
		// 	accessorKey: 'notes',
		// 	header: 'Notes',
		// },
		{
			id: 'url',
			accessorKey: 'url',
			header: 'Url',
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
							<div className="flex items-center gap-2">
								<div className={`h-2 w-2 rounded-full fill-current ${STATUS_COLORS[value] || "bg-gray-400"}`}
									style={{ backgroundColor: 'currentColor' }}
								/>
								<SelectValue />
							</div>
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
		{
			id: 'actions',
			header: 'Actions',
			cell: ({ row }) => {
				return (
					<>
						<Button
							size="icon"
							onClick={() => setApplication(row.original)}
							variant="ghost"
						>
							<HugeiconsIcon icon={EditTableIcon} />
						</Button>
						<AlertDialog>
							<AlertDialogTrigger asChild>
								<Button
									className="ml-2"
									variant="destructive"
									size="icon"
								>
									<HugeiconsIcon icon={RowDeleteIcon} />
								</Button>
							</AlertDialogTrigger>
							<AlertDialogContent>
								<AlertDialogHeader>
									<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
									<AlertDialogDescription>
										This action cannot be undone. This will permanently delete your
										application from our servers.
									</AlertDialogDescription>
								</AlertDialogHeader>
								<AlertDialogFooter>
									<AlertDialogCancel>Cancel</AlertDialogCancel>
									<AlertDialogAction
										asChild
									>
										<Button
											className="text-red-500"
											variant="destructive"
											onClick={() => mutateDelete({ id: row.original.id })}
										>
											Delete
										</Button>
									</AlertDialogAction>
								</AlertDialogFooter>
							</AlertDialogContent>
						</AlertDialog>
					</>
				)
			}
		},
	]
} 
