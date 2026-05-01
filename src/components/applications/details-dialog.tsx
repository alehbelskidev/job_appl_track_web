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
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{application.role}</DialogTitle>
					<DialogDescription>At {application.url ? (
						<a href={application.url}>{application.company}</a>
					) : (
						<span>{application.company}</span>
					)}</DialogDescription>
				</DialogHeader>

				{application.description && <p>{application.description}</p>}
				{application.notes && <p>{application.notes}</p>}
			</DialogContent>
		</Dialog>
	)
}
