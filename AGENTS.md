# Premium Travel Website

React + Vite + Tailwind CSS project for luxury pilgrimage and cultural tours in India.

## Development Server

A Vite development server runs on `$PORT` (default 8443).

- Run locally: `npm run dev`
- Build for production: `npm run build`
- Hot reload: Changes to source files are reflected immediately

## Project Structure

This is the canonical project structure. Start with task-relevant files below:

- `src/main.tsx` - React entrypoint; imports `src/index.css` and mounts `src/App.tsx` into the `#root` element
- `src/App.tsx` - Primary application component and the usual starting point for UI work
- `src/index.css` - Global CSS entrypoint and Tailwind CSS v4 import
- `src/routes.tsx` - Route definitions for public tours, destinations, gallery, and admin portal
- `src/components/` - Shared UI components (PublicLayout, TourCard, EnquiryForm, Itinerary, etc.)
- `src/pages/` - Public site pages (Home, Tours, TourDetail, Destinations, Gallery, Static)
- `src/admin/` - Admin portal pages (Dashboard, Tours editor, Enquiries, Settings)
- `src/lib/` - Seed data, types, pricing calculator, and reactive state stores
- `index.html` - Vite HTML shell containing the `#root` element and metadata
- `package.json` - Project dependencies and scripts
- `vite.config.ts` - Vite configuration with React, Tailwind CSS v4, and `@` alias for `src`
- `.mise.toml` - Toolchain versions for Node.js and pnpm

## Dependencies

- Runtime: React 19 and React DOM 19
- Routing: React Router
- Icons: Lucide React
- Styling: Tailwind CSS v4 with the `@tailwindcss/vite` plugin
- Build tooling: Vite 8, TypeScript 5.7, and `@vitejs/plugin-react`
- Formatting: oxfmt

## Styling

This project uses **Tailwind CSS v4** through the `@tailwindcss/vite` plugin configured in `vite.config.ts`. `src/index.css` imports Tailwind with `@import 'tailwindcss';`. Use Tailwind utility classes directly in JSX and put global CSS or Tailwind v4 theme customization in `src/index.css`. This scaffold does not need a Tailwind config file or PostCSS config.

`src/main.tsx` imports `src/index.css`, so global font wiring belongs in `src/index.css`. Keep CSS `@import` statements first, then add any `@font-face` rules and font-family defaults there.

Tailwind emits utility classes in `@layer utilities`, and CSS outside any cascade layer overrides every layer regardless of specificity. Put global element styles, such as resets and defaults for `body`, headings, `button`, or `input`, inside `@layer base { ... }` so utility classes on those elements still apply.
