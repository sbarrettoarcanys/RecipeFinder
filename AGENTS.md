# AGENTS.md

## Project overview

- This repository is a Vite + React app for browsing recipe ideas.
- The main UI is composed from components under [src/App](src/App), styles under [src/Styles](src/Styles), and shared logic under [src/Hooks](src/Hooks).
- The app entry point is [src/main.jsx](src/main.jsx), and the current screen composition is rendered there.

## Working conventions

- Prefer functional React components and keep stateful logic close to the component that uses it.
- Use the existing alias `@` for imports from [src](src) (for example, `@/Styles/HomePage.css`).
- Keep UI changes aligned with the current styling approach: import the matching stylesheet next to the component and reuse existing class names where possible.
- Follow the existing code style: double quotes, semicolons, and camelCase for variables/functions.
- If you add or change data fetching, prefer keeping API logic in [src/Hooks/ApiCalls.js](src/Hooks/ApiCalls.js) and debounce behavior in [src/Hooks/Debounce.js](src/Hooks/Debounce.js).

## Commands

- Start the app locally: `npm run dev`
- Build for production: `npm run build`
- Lint the project: `npm run lint`
- Preview the production build: `npm run preview`

## Notes for agents

- There is no dedicated test runner configured in this project, so validation is primarily through `npm run build` and `npm run lint`.
- Keep edits small and focused; this codebase is lightweight and benefits from minimal, targeted changes.
- When updating UI, prefer preserving the existing layout and visual language unless the request explicitly calls for a redesign.

## Git / Commit Conventions

- use the format `<type>/<ticket-id>-<short-description>` for branch naming, e.g `feat/PROJ-123-oauth-login`
- Conventional Commits: `<type>(<scope>): <subject>`. Types: feat, fix, chore, docs, refactor, test. e.g. `fix(orders): correct discount rounding` or `feat(payments): add refund endpoint`
- PRs must include: Summary, Test Plan, linked issue.
- Keep the summary line under ~72 characters; add a body only when the "why" isn't obvious from the diff.\
