import { Button } from "@/components/ui/button"
import { HugeiconsIcon } from "@hugeicons/react"
import { Download01Icon } from "@hugeicons/core-free-icons"
import type { ApplicationSchema } from "@/schemas"

interface DownloadDataBtnProps {
	data: ApplicationSchema[]
}

export function DownloadDataBtn({ data }: DownloadDataBtnProps) {
	const download = () => {
		const now = new Date().toISOString()
		const dataJson = JSON.stringify({
			ver: 'v1',
			date: now,
			data: data
		})

		const blob = new Blob([dataJson], { type: "application/json" })
		const url = URL.createObjectURL(blob)

		const dlink = document.createElement('a')
		dlink.href = url
		dlink.download = `apps_at_${now}`

		document.body.appendChild(dlink);
		dlink.click();

		document.body.removeChild(dlink);
		URL.revokeObjectURL(url);
	}

	return <Button variant="outline" onClick={download}>
		<HugeiconsIcon icon={Download01Icon} />
		Download
	</Button>
}
