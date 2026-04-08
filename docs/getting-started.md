# Getting Started

## Prerequisites

- **Node.js** 18+ 
- **npm** 9+
- A **Supabase** project (existing one is already configured)

## Local Setup

1. **Clone the repository**

   ```bash
   git clone <repo-url>
   cd "SYM Slideshow"
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment**

   The `.env` file is already in the repo with Supabase credentials:

   ```env
   VITE_SUPABASE_URL=https://fyiwpqnbiutuzuxjdeot.supabase.co
   VITE_SUPABASE_ANON_KEY=<anon-key>
   SUPABASE_SERVICE_KEY=<service-key>   # Server-only, not used in client
   ```

   The `VITE_` prefixed vars are exposed to the browser (this is expected for Supabase anon keys). The `SUPABASE_SERVICE_KEY` is only used by maintenance scripts and should never be exposed client-side.

4. **Start the dev server**

   ```bash
   npm run dev
   ```

   Opens at `http://localhost:5173` by default. Override with `--port`:

   ```bash
   npx vite --port 3000
   ```

5. **Open the app**

   - Slideshow: http://localhost:5173
   - Editor: http://localhost:5173/editor
   - Admin: http://localhost:5173/admin

## Build for Production

```bash
npm run build      # Outputs to dist/
npm run preview    # Preview the production build locally
```

## Database Setup

If starting with a fresh Supabase project, see [database.md](./database.md) for the schema and storage bucket setup.

## Dependencies

| Package | Purpose |
|---------|---------|
| `react`, `react-dom` | UI rendering |
| `framer-motion` | Animations (spring physics, stagger, transitions) |
| `@supabase/supabase-js` | Database client, real-time subscriptions, storage |
| `classnames` | Conditional CSS class joining |
| `dotenv` | Environment variable loading |
| `vite` | Build tool and dev server |
| `@vitejs/plugin-react` | React support for Vite (JSX, fast refresh) |
| `tailwindcss` | Utility-first CSS framework |
| `postcss`, `autoprefixer` | CSS processing and browser prefixes |
