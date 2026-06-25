# Development Workflow

This document defines the end-to-end development process for this project. All AI sessions must follow this workflow. Decision points marked **[USER APPROVAL REQUIRED]** mean AI must stop and wait for explicit user confirmation before continuing.

---

## The Five Phases

```
需求确认 → 设计文档 → 后端实施 → 前端实施 → 测试
```

---

## Phase 1 — 需求确认 (Requirements)

**Goal**: Agree on exact scope and write it into the PRD files before any technical design begins.

**AI actions**:
1. Ask clarifying questions about the feature (data model impact, edge cases, deletion behavior, whether computed stats are involved).
2. Create `docs/prd/[FeatureName]BackendPRD.md` and `docs/prd/[FeatureName]FrontendPRD.md` with only **§1 目标** and **§2 范围** filled in. Leave all other sections as empty headings.
3. Present the two scope sections to the user for confirmation.

**Output**: PRD files exist on disk with §1 + §2 completed. All remaining sections are placeholders.

**Decision point** — **[USER APPROVAL REQUIRED]**: User confirms §1 + §2 are correct before AI moves to Phase 2. This is the canonical record of agreed scope — not the conversation.

**Key questions to always ask**:
- Does this touch the Prisma schema?
- Does this introduce any stored aggregate or computed field? (Forbidden — see CLAUDE.md)
- Does this affect existing pages, or add new ones?
- What are the deletion/archival rules for new entities?

---

## Phase 2 — 设计文档 (Design Documents)

**Goal**: Complete the PRD files with full technical detail. These files are the single source of truth for implementation.

**AI actions**:
1. Fill in all remaining sections of `docs/prd/[FeatureName]BackendPRD.md` (§3 业务规则 through §7 错误码).
2. Fill in all remaining sections of `docs/prd/[FeatureName]FrontendPRD.md` (§3 组件变更 through §6 接口约定).
3. Present the completed PRDs to the user.

**Decision point** — **[USER APPROVAL REQUIRED]**: User reviews and approves both completed PRDs (including any Schema changes in Backend PRD §4). AI must not write implementation code until approval is given.

**Naming convention**: Use PascalCase feature name, e.g. `MatchEntryBackendPRD.md`, `MatchEntryFrontendPRD.md`.

---

### Backend PRD Template

```markdown
# [Feature] Backend PRD

## 1. 目标
One paragraph describing what this feature accomplishes.

## 2. 范围
含 (in scope):
- ...

不含 (out of scope):
- ...

## 3. 业务规则
Numbered list. Reference existing rules in CLAUDE.md where applicable.

## 4. Schema 变更
### 4.1 新增 / 修改字段
| Model | Field | Type | Notes |
|-------|-------|------|-------|

### 4.2 迁移说明
Describe what `pnpm db:migrate` will do. Note any data loss risk.

## 5. API 规范
### 5.x [Endpoint Name]
- **Method + Path**: `POST /api/...`
- **Request body**:
  ```json
  { ... }
  ```
- **Response (200)**:
  ```json
  { ... }
  ```
- **Errors**: list of error codes from §7

## 6. 验证规则
Numbered list of field-level validation rules. All errors must be collected (no short-circuit).

## 7. 错误码
| Code | HTTP | Condition |
|------|------|-----------|

Standard error shape: `{ "statusCode": 422, "error": "CODE", "message": "...", "details": [] }`
```

---

### Frontend PRD Template

```markdown
# [Feature] Frontend PRD

## 1. 目标
One paragraph.

## 2. 影响页面
List pages that will be created or modified, with routes.

## 3. 组件变更
List components that will be created or modified.

## 4. API 调用
| Action | Method + Path | When |
|--------|--------------|------|

## 5. UI 规格
### 5.x [Page or Component Name]
- **Route**: `/...`
- **Layout**: describe layout (reference DESIGN.md tokens)
- **Fields / Controls**: list of inputs, their types, validation feedback
- **States**: loading / empty / error / success states
- **Interactions**: what happens on submit, on change, on error

## 6. 与 Backend PRD 的接口约定
Call out any contract assumptions between frontend and backend (field names, error code handling).
```

---

## Phase 3 — 后端实施 (Backend Implementation)

**AI executes autonomously** — no approval needed at each step.

**Order of operations**:
1. Apply Prisma schema changes → `pnpm db:migrate` → `pnpm db:generate`
2. Implement route handlers in `apps/backend/`
3. Implement validation logic (collect all errors before responding)
4. Implement business logic per Backend PRD §3

**Reference during implementation**:
- Approved Backend PRD
- `prisma/schema.prisma` — single source of truth for data model
- `docs/DELETION_RULES.md` — for any delete/archive behavior
- `docs/TEAM_POINTS_RULES.md` — if points or rankings are touched
- `CLAUDE.md §Error Response Shape` — for error format

**Do not**: store computed stats, expose slug modification, assign `rankingOrder` from request body.

---

## Phase 4 — 前端实施 (Frontend Implementation)

**AI executes autonomously** — no approval needed at each step.

**Order of operations**:
1. **Gap analysis**: Read existing frontend pages and components. Identify what is missing vs. what exists and needs connecting.
2. Report gap analysis findings briefly in conversation.
3. Fill gaps and wire up to backend API per Frontend PRD.

**Reference during implementation**:
- Approved Frontend PRD
- `docs/DESIGN.md` — all visual tokens (colors, fonts, spacing, border-radius)
- `CLAUDE.md §Design System` — quick reference for key design rules

**Do not**: introduce new component libraries, redesign existing layout patterns, send `slug` from frontend.

---

## Phase 5 — 测试 (Testing)

**Goal**: Confirm the feature works end-to-end in the running app.

**AI actions**:
1. Run `pnpm dev` (or confirm it is already running).
2. Exercise the golden path as described in the PRDs.
3. Test edge cases (empty state, validation errors, deletion/archive behavior).
4. Report findings: what passed, what failed, what needs fixing.

**Scope for this MVP**: Manual smoke testing only. No unit tests, no CI pipeline. If a bug is found, fix it and retest before marking the phase complete.

**Decision point** — **[USER APPROVAL REQUIRED]**: User reviews the test report and confirms the feature is accepted (or requests fixes).

---

## Decision Point Summary

| After Phase | What user approves | AI blocked until? |
|-------------|-------------------|-------------------|
| 1 — 需求确认 | Scope and feature list | Explicit "confirmed" or equivalent |
| 2 — 设计文档 | Both PRD files (incl. Schema) | Explicit PRD approval |
| 5 — 测试 | Test report / acceptance | User signs off |

---

## PRD File Conventions

- Location: `docs/prd/`
- Naming: `[FeatureName]BackendPRD.md` and `[FeatureName]FrontendPRD.md`
- Once approved, PRDs are the authoritative spec — do not deviate without user discussion
- PRDs are not deleted after implementation; they serve as historical record

---

## What This Workflow Does NOT Cover

- Authentication / authorization (not in MVP scope)
- Automated testing (CI, unit tests, integration tests)
- Deployment
- Auto-scheduling, auto-ranking features
