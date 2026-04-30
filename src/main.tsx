import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from '@tanstack/react-router'
import { router } from "./router"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import { Toaster } from "@/components/ui/sonner"

const client = new QueryClient()

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<Toaster />
		<QueryClientProvider client={client}>
			<RouterProvider router={router} />
		</QueryClientProvider>
	</StrictMode>,
)
