import type { ColumnDef } from "@tanstack/react-table"
import type { ApplicationSchema } from "@/schemas"

export const columns: ColumnDef<ApplicationSchema>[] = [
	{
		accessorKey: 'company',
		header: 'Company',
	},
	{
		accessorKey: 'role',
		header: 'Role',
	},
	{
		accessorKey: 'description',
		header: 'Description',
	},
	{
		accessorKey: 'url',
		header: 'Url',
	},
	{
		accessorKey: 'notes',
		header: 'Notes',
	},
	{
		accessorKey: 'status',
		header: 'Status',
	},
	{
		accessorKey: 'date_applied',
		header: 'Applied',
	},
	{
		accessorKey: 'date_updated',
		header: 'Last Updated',
	},
]
