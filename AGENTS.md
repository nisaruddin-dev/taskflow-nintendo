# AGENTS.md

## Project overview

This repository is a browser-based task manager called TaskFlow. It is intentionally lightweight and built with plain HTML, CSS, and JavaScript rather than a framework or build pipeline.

Primary files:
- `index.html` — structure and app layout
- `style.css` — visual system, theme variables, layout, and component styling
- `script.js` — state management, rendering, localStorage, filters, modal editing, and UI behavior
- `DESIGN.md` — design reference and product intent

## Working conventions for coding agents

- Keep changes minimal and focused. This project favors direct, readable browser code over abstraction.
- Preserve the existing vanilla JavaScript structure: DOM references at the top of the script, initialization on `DOMContentLoaded`, state variables like `tasks`, `currentFilter`, `currentSearch`, and `currentSort`, and rendering/update functions organized by responsibility.
- Prefer existing naming patterns and variable conventions already present in `script.js` rather than introducing new terminology for the same concepts.
- Treat `localStorage` as the persistence layer for task data. When adding features, keep state changes consistent with the current `taskflowTasks` pattern unless a clear requirement demands otherwise.
- Follow the established dark UI system in `style.css` using CSS custom properties such as `--bg-primary`, `--accent`, and `--text-primary`. Avoid ad hoc colors or layout values that do not fit the current theme.
- Maintain accessibility: use semantic HTML, keep controls keyboard accessible, preserve visible focus states, and provide labels or text for actions.
- Match the app’s browser-first approach. Do not introduce a framework, bundler, TypeScript, or dependency-heavy architecture unless the request explicitly requires it.
- When implementing new features, prefer the same patterns already used in the app: render from state, update statistics after state changes, and keep UI logic separate from data logic.

## Expected workflow

- For UI updates, inspect the relevant section in `index.html` and align with the current layout patterns before editing styles.
- For logic changes, keep behavior centered on the task state object and update derived UI values from that state rather than mutating the DOM in scattered places.
- Validate with a browser by opening `index.html` or serving the folder via a static local server. Check the console for JavaScript errors after interactive changes.
- If a feature touches task behavior, verify the basic flows still work: add task, complete task, filter, search, sort, edit, delete, export/import, and theme toggle.

## Design reference

Use `DESIGN.md` as the authoritative source for product intent and visual direction. It describes the intended aesthetic and should be treated as a guide when making style or interaction changes.

## Code quality guidance

- Favor clarity and maintainability over cleverness.
- Keep functions single-purpose and readable.
- Do not rewrite the app architecture for minor changes.
- Prefer preserving existing behavior unless the task explicitly asks for a redesign.
- If a feature requires a new UI pattern, fit it into the current styles and structure rather than creating a separate system.

## Helpful prompts for Copilot

When asked to change this codebase, prefer tasks and instructions like:
- "Improve the task filtering logic while preserving localStorage behavior."
- "Add a small accessibility improvement to the task form and modal controls."
- "Adjust theme styles to match the existing design language in `DESIGN.md`."
- "Refactor the task rendering logic without changing the app’s behavior."

These prompts align with the project’s current architecture and keep work within the expected scope.
