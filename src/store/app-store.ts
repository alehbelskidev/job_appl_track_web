import { create } from "zustand"
import type { ApplicationSchema } from "@/schemas"

interface AppStore {
	application: ApplicationSchema | null,
	setApplication: (application: ApplicationSchema | null) => void
}

export const useAppStore = create<AppStore>((set) => ({
	application: null,
	setApplication(application) {
		set({ application })
	}
}))

