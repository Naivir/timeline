<!--
Sync Impact Report
- Version change: 1.1.1 -> 1.2.0
- Modified principles:
  - III. Test-First Verification -> III. Test-First Verification (adds mandatory screenshot sanity checks for UI work)
  - IV. Full-Stack Contract Integrity -> IV. Full-Stack Contract Integrity (clarified live browser/API verification)
- Added sections:
  - None
- Removed sections:
  - None
- Templates requiring updates:
  - ✅ updated: .specify/templates/plan-template.md
  - ✅ updated: .specify/templates/tasks-template.md
  - ✅ no change required: .specify/templates/spec-template.md
  - ⚠ pending: .specify/templates/commands/*.md (directory not present)
- Follow-up TODOs:
  - None
-->

# Timeline Constitution

## Core Principles

### I. Spec-First Planning
Every implementation change MUST start from an approved feature spec in
`specs/<###-feature-name>/spec.md` and a plan in
`specs/<###-feature-name>/plan.md`. Work MUST not begin from ad hoc tasks
without documented user scenarios, measurable outcomes, and constraints.
Rationale: this repository is process-centric, so predictable delivery depends on
explicit planning artifacts.

### II. Independently Valuable Slices
Specifications and tasks MUST organize work into independently testable user
stories ordered by priority (P1, P2, ...). Each story MUST deliver user-visible
value on its own and include an independent test definition before implementation
tasks are accepted. Rationale: independent slices preserve MVP delivery and reduce
cross-story coupling.

### III. Test-First Verification
Implementation tasks MUST be executed with tests written first for the affected
behavior. Tests MUST fail before code changes, and tasks MUST NOT be marked
complete until required tests pass. Dependency installation needed to run those
tests is part of implementation work and MUST be executed by the agent during the
task workflow, not deferred to the user. For frontend work, required tests MUST
include automated browser verification where user-visible behavior depends on
networked backend data. For every UI change, verification MUST include captured
screenshots for each changed screen or popup plus a manual visual sanity review.
Rationale: reliable delivery requires provable behavior change, executable
environments, and visual regression checks.

### IV. Full-Stack Contract Integrity
For web features with frontend and backend components, both layers MUST be treated
as first-class deliverables in planning and execution. API contracts, data models,
and UI integration behavior MUST remain aligned so frontend behavior is validated
against backend responses, including at least one live browser-to-backend
verification path. Rationale: split-stack delivery fails when either side is
treated as optional or implied.

### V. Traceable Governance
Constitution amendments MUST include a semantic version bump, a dated change
record, and explicit propagation notes for affected templates and guidance docs.
Pull requests MUST state how constitution gates were satisfied or why an exception
was approved. Rationale: governance is effective only when changes are auditable.

## Delivery Constraints

- Repository conventions in `AGENTS.md` are mandatory for file naming, script
  style, and validation commands.
- Generated specs and plans MUST use `###-short-description` feature directory
  naming.
- When a feature defines both frontend and backend scope, plans and tasks MUST
  include concrete work items for both directories and their integration path.
- Guidance and templates MUST prefer deterministic, machine-reviewable language
  (`MUST`, `SHOULD`, explicit paths, explicit commands).

## Workflow and Quality Gates

1. Run prerequisite checks before planning and task generation.
2. Confirm Constitution Check gates pass in `plan.md` before Phase 0 research.
3. Ensure `spec.md`, `plan.md`, and `tasks.md` remain mutually consistent for each
   feature branch.
4. Install required dependencies before running validation commands.
5. Execute tests first (red), then implement (green), and record outcomes.
6. For UI changes, capture and review screenshots for each changed screen/popup.
7. Record verification commands and outcomes in PR descriptions for changed
   scripts/templates.

## Governance
This constitution supersedes conflicting workflow guidance in repository docs.
Amendments require: (a) documented proposal, (b) approval in code review, and
(c) propagation updates to impacted templates and operational guidance.

Versioning policy:
- MAJOR: incompatible governance changes or removal/redefinition of a core
  principle.
- MINOR: new principle or materially expanded mandatory guidance.
- PATCH: clarifications, wording improvements, or non-semantic refinements.

Compliance review expectations:
- Every feature plan MUST include an explicit Constitution Check.
- Every implementation task list MUST include explicit dependency setup and
  test-first checkpoints.
- Frontend/backend features MUST include cross-layer contract verification tasks.
- Reviewers MUST block merges that do not satisfy mandatory gates or documented
  approved exceptions.

**Version**: 1.2.0 | **Ratified**: 2026-02-21 | **Last Amended**: 2026-02-22
