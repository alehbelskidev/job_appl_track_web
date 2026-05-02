# Job Application Tracker — Web

React SPA for tracking job applications. Connects to the [Go API](https://github.com/alehbelskidev/job_appl_track).

## Stack

- **React 19** + TypeScript
- **TanStack Router** — file-based routing with type-safe params
- **TanStack Query** — server state management
- **React Hook Form** + **Zod** — forms and validation
- **ky** — HTTP client with JWT interceptor and auto-refresh
- **shadcn/ui** + **Tailwind CSS** — UI components
- **Zustand** — auth state

## Local Development

Requires the API running on `localhost:3001`.

```bash
cp .env.example .env.local
pnpm install
pnpm dev
```

## Environment Variables

| Variable | Description |
|---|---|
| `VITE_API_URL` | API base URL (e.g. `http://localhost:3001`). Leave empty in production — requests use relative paths via Ingress. |

## Production Build

```bash
pnpm build
```

Or via Docker:
```bash
docker build -f Dockerfile.prod -t job-tracker-web:latest .
```

Static files are served by nginx. All routes fall back to `index.html` for client-side routing.
