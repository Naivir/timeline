# Repository Guidelines

## Project Structure & Module Organization
- Core workflow assets live in `.specify/`.
- Automation scripts are in `.specify/scripts/bash/` (feature creation, plan setup, prerequisite checks, agent context updates).
- Document templates are in `.specify/templates/` (`spec-template.md`, `plan-template.md`, `tasks-template.md`, etc.).
- Prompt helpers are in `.codex/prompts/`.
- Feature work is generated under `specs/<###-feature-name>/` and typically includes `spec.md`, `plan.md`, `tasks.md`, and optional research/contracts docs.

## Build, Test, and Development Commands
- `bash .specify/scripts/bash/create-new-feature.sh "Add export timeline"`
Creates a numbered feature branch and `specs/<branch>/spec.md`.
- `bash .specify/scripts/bash/setup-plan.sh`
Creates or refreshes `plan.md` for the current feature.
- `bash .specify/scripts/bash/check-prerequisites.sh --json`
Validates required docs and prints machine-readable status.
- `bash .specify/scripts/bash/update-agent-context.sh codex`
Updates agent instruction files from the active plan.
- `bash -n .specify/scripts/bash/*.sh`
Syntax-check Bash scripts before opening a PR.

## Coding Style & Naming Conventions
- Language in this repo is primarily Bash and Markdown; follow existing shell style and keep scripts POSIX-friendly where practical.
- Use 4-space indentation in shell blocks; keep functions small and explicit.
- Name scripts/files in lowercase kebab-case (for example, `check-prerequisites.sh`).
- Feature branches and spec directories must use `###-short-description` (example: `003-add-export-command`).

## Testing Guidelines
- No dedicated automated test suite is committed yet.
- Minimum validation for changes:
  - Run `bash -n .specify/scripts/bash/*.sh`.
  - Run affected scripts with `--help` and one realistic invocation.
  - For workflow changes, verify files are created in the expected `specs/<feature>/` path.

## Commit & Pull Request Guidelines
- Keep commit messages short, imperative, and scoped (example: `Add JSON output to prerequisites check`).
- Group related script/template changes in one commit; avoid mixing unrelated refactors.
- PRs should include:
  - Purpose and impacted workflow step(s).
  - Example command(s) run and observed result.
  - Linked issue/spec directory when applicable.

## Active Technologies
- Python 3.12 (backend), TypeScript 5.x + Node.js 22 LTS (frontend) + FastAPI, Uvicorn, Pydantic, React, Vite, Tailwind CSS, shadcn/ui (001-setup-timeline-stack)
- In-memory timeline payload for this phase (persistent storage deferred) (001-setup-timeline-stack)
- Python 3.12 (backend), TypeScript 5.x + Node.js 22 LTS (frontend) + FastAPI, Uvicorn, Pydantic, uv, React, Vite, Tailwind CSS, shadcn/ui (001-setup-timeline-stack)

## Recent Changes
- 001-setup-timeline-stack: Added Python 3.12 (backend), TypeScript 5.x + Node.js 22 LTS (frontend) + FastAPI, Uvicorn, Pydantic, React, Vite, Tailwind CSS, shadcn/ui
