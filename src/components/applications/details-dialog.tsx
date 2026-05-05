import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog"
import { useAppStore } from "@/store/app-store"

export function ApplicationDetailsDialog() {
	const { application, setApplication } = useAppStore()

	if (!application) {
		return null
	}

	return (
		<Dialog open={true} onOpenChange={o => !o && setApplication(null)}>
			<DialogContent className="min-w-full sm:min-w-2/3">
				<DialogHeader>
					<DialogTitle>{application.role}</DialogTitle>
					<DialogDescription>At {application.url ? (
						<a href={application.url}>{application.company}</a>
					) : (
						<span>{application.company}</span>
					)}</DialogDescription>
				</DialogHeader>

				<article>
					<h3 className="font-semibold">Description</h3>
					{application.description ? <p dangerouslySetInnerHTML={{ __html: application.description }}></p> : 'N/A'}
				</article>

				<article>
					<h3 className="font-semibold">Notes</h3>
					{application.notes ? <p>{application.notes}</p> : 'N/A'}
				</article>
			</DialogContent>
		</Dialog>
	)
}
