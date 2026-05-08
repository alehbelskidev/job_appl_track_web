import { ApplicationsTable } from "@/components/applications/table"
import { CreateApplicationSheet } from "@/components/applications/create-sheet"
import { CreateApplicationAISheet } from "@/components/applications/create-ai-sheet"
import { ApplicationDetailsDialog } from "@/components/applications/details-dialog"
import { DownloadDataBtn } from "@/components/applications/download-data-btn"
import { ImportDataBtn } from "@/components/applications/import-data-btn"
import { getRouteApi } from "@tanstack/react-router"

const routeApi = getRouteApi('/app/dashboard')

export function DashboardRoute() {
	const { data } = routeApi.useLoaderData()

	return (
		<>
			<div className="flex items-center gap-4 p-4">
				<ImportDataBtn />
				<DownloadDataBtn data={data} />
				<CreateApplicationAISheet />
				<CreateApplicationSheet />
			</div>
			<div className="flex-1 p-4">
				<div className="overflow-hidden rounded-md border">
					<ApplicationsTable data={data} />
				</div>
			</div>
			<ApplicationDetailsDialog />
		</>
	)
}
