import { getRouteApi } from "@tanstack/react-router"
import { ApplicationsTable } from "@/components/applications/table"
import { CreateApplicationSheet } from "@/components/applications/create-sheet"
import { CreateApplicationAISheet } from "@/components/applications/create-ai-sheet"
import { ApplicationDetailsDialog } from "@/components/applications/details-dialog"
import { DownloadDataBtn } from "@/components/applications/download-data-btn"
import { ImportDataBtn } from "@/components/applications/import-data-btn"
import { UserMenu } from "@/components/user/menu"

const routeApi = getRouteApi('/app')

export function AppRoute() {
	const { data } = routeApi.useLoaderData()

	return (
		<div className="flex flex-col w-full min-h-screen">
			<header className="p-4 flex items-center justify-between">
				<h1 className="text-lg font-semibold">Application tracker</h1>
				<UserMenu />
			</header>
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
		</div>
	)
}
