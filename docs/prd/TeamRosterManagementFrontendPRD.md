# Team Roster Management Frontend PRD

## 1. 目标

为 Team Management 域完成前端设计与实现规格，使现有四个页面从 mock/static 状态接入真实后端 API，并在保留当前页面结构的前提下完成一次轻量视觉打磨。

本 PRD 覆盖：
- Team 列表页 `/teams`
- Team 详情页 `/teams/:slug`
- Team 创建页 `/teams/new`
- Team 管理页 `/teams/:slug/manage`

核心目标：
- 使用 Backend PRD 定义的 API 读取 Division、Team 列表、Team 详情，并提交 Team 创建、更新、归档。
- Player 管理只存在于 Team 创建/编辑流程中，不新增独立 Player CRUD 页面。
- `overallRating` 是 Team 字段，数据库/API 使用数值存储，前端以星级方式展示与编辑。
- `profileRating` 默认随 Team 创建流程一起提交；后端在缺省时也会创建默认评分，因此新建 Team 不应出现 `profileRating = null`。详情页和编辑页仍必须支持旧数据或异常数据的 `null` 兜底展示。
- 保留现有 Mantine + CSS 架构，不引入新组件库，不重做整站设计。
- 视觉方向保持深色、高密度、sports-console / analytics 风格，优化层级、表单可读性、状态反馈和移动端表现。

## 2. 范围

### 2.1 In Scope

- 新增前端 API client：
  - `fetchDivisions()`
  - `fetchTeams()`
  - `fetchTeam(slug)`
  - `createTeam(data)`
  - `updateTeam(slug, data)`
  - `archiveTeam(slug)`
- 移除 Team Management 四页中的 mock 数据依赖。
- 为列表、详情、创建、编辑页面添加 loading / error / empty / not-found / archived 状态。
- 创建与编辑表单改为父页面可控状态，支持收集 Team 基础信息、profileRating 和 players。
- Division 下拉使用 `GET /api/divisions` 返回的真实 `divisionId`。
- Player 新增、编辑、软删除通过 Team POST/PATCH 的嵌套 `players` payload 完成。
- API validation error 映射到对应字段，非字段错误显示在页面级错误区域。
- Team 详情页展示后端返回的 `totalPoints`、`teamStats`、`players`、`profileRating`。
- 归档 Team 使用 `POST /api/teams/:slug/archive`，并在 UI 中明确这是不可撤销操作。
- 对现有页面做轻量视觉优化：统一卡片层级、按钮状态、表格密度、表单布局、错误样式和 responsive 行为。

### 2.2 Out Of Scope

- 不新增独立 Player 创建/编辑/详情管理流程。
- 不新增 Division 管理 UI。
- 不新增 archived Team 列表或恢复归档功能。
- 不实现认证、权限、审计日志。
- 不新增复杂筛选、搜索、排序配置。
- 前端实现不主动改变已批准的 Backend PRD 数据模型或 API 契约。
- 不更换 UI 库，不引入新的图表库。

## 3. 后端契约摘要

前端必须按 Backend PRD 使用以下接口：

| Action | Method + Path | 页面 |
|---|---|---|
| 读取 Division | `GET /api/divisions` | Create / Manage |
| 读取 Team 列表 | `GET /api/teams` | Teams |
| 读取 Team 详情 | `GET /api/teams/:slug` | Detail / Manage |
| 创建 Team | `POST /api/teams` | Create |
| 更新 Team | `PATCH /api/teams/:slug` | Manage |
| 归档 Team | `POST /api/teams/:slug/archive` | Manage |

前端不得传入或修改 `slug`。创建成功后使用响应中的 `slug` 跳转到详情页。

前端不得传入任何派生统计字段，例如 `totalPoints`、`teamStats`、player averages。它们只来自后端运行时计算结果。

## 4. 数据模型与 UI 映射

### 4.1 Team 列表项

API 来源：`GET /api/teams`

| API 字段 | UI 用途 |
|---|---|
| `divisionName` | Division 分组标题 |
| `teams[].slug` | 详情页链接 |
| `teams[].name` | Team 名称 |
| `teams[].logoUrl` | logo；为空时显示 initials fallback |
| `teams[].primaryColor` | logo fallback / accent，可选 |
| `teams[].overallRating` | 星级展示 |
| `teams[].totalPoints` | 积分展示 |

列表页只显示后端返回的 Active Team。前端不维护 `includeArchived` 参数。

### 4.2 Team 详情

API 来源：`GET /api/teams/:slug`

| API 字段 | UI 用途 |
|---|---|
| `name` | 页面主标题 |
| `logoUrl` | logo |
| `divisionName` | Team 所属 Division |
| `overallRating` | 星级展示 |
| `totalPoints` | 积分 |
| `description` | 简介 |
| `archivedAt` | 顶部 archived banner |
| `profileRating` | radar / rating module |
| `teamStats` | Team Summary 数据卡 |
| `players` | Roster table |

`profileRating = null` 时，详情页保留该模块位置，显示空状态文案，不隐藏整个模块。

### 4.3 Overall Rating 星级规则

`overallRating` 是 Team 字段。

后端字段类型为 number，允许 `0-10`。前端展示为 5 星视觉：
- `0` 或 `null`：显示 5 个空星，并辅以 muted 状态。
- `1-10`：映射到 0.5 星粒度，例如 `8.0 / 10` 显示为 4 颗星。
- 编辑控件优先使用 5 星选择器或 0.5 星 step 的 rating 控件；提交时转换回 `0-10` 数值。
- UI 中不以普通数字作为主要呈现，但可在辅助文本中显示 `8.0 / 10` 以避免歧义。

若 Mantine 当前版本没有合适 Rating 组件，可以用现有按钮/图标实现，但不得引入新组件库。

### 4.4 Profile Rating 规则

`profileRating` 包含：
- `defense`
- `offense`
- `consistency`
- `cohesion`
- `depth`

创建页默认初始化五个字段，建议默认值为 `5`，提交时默认包含完整 `profileRating` 对象。

创建流程中：
- payload 默认包含完整 `profileRating`；即使未来前端遗漏该字段，后端也会创建默认五项 `5` 的 TeamProfileRating。
- MVP 不提供“跳过 profile rating”的主流程按钮。
- MVP 不提供清空 profile rating 的入口，前端不得主动发送 `profileRating: null`。
- 若未来需要允许清空，应作为明确的 destructive/advanced 操作，并先修改 Backend PRD 的 API 语义；不在本次范围内实现。

编辑流程中：
- 如果后端返回 `profileRating` 对象，表单预填。
- 如果后端返回 `profileRating = null`，表单显示默认五项 `5`，并展示轻量提示：保存后会为该 Team 创建 profile rating。
- PATCH 时如果用户没有编辑 profileRating，但当前后端数据为 `null`，保存仍可提交默认完整对象，以修复缺失状态。

详情页中：
- `profileRating` 有值：展示 radar / profile module。
- `profileRating = null`：显示 “No profile ratings recorded” 风格的空状态，不阻断页面。

## 5. 页面规格

### 5.1 TeamsPage `/teams`

职责：
- 读取 `GET /api/teams`。
- 按后端返回的 Division 分组展示 Team。
- 展示 Team logo/name/points/overallRating。
- 提供 “Create Team” 入口。

状态：
- Loading：显示与 Division card 尺寸接近的 skeleton 或 compact loading rows。
- Error：显示页面级错误模块和 Retry 按钮。
- Empty：当 `divisions` 为空时显示空状态和创建入口。
- Normal：展示后端分组结果。

视觉要求：
- 保留当前 2-column division board，窄屏降为 1-column。
- Team card 保持紧凑，高度稳定，长名称使用省略或换行规则避免溢出。
- points 使用 monospaced font。
- rating 使用星级，不用裸数字作为主视觉。

### 5.2 TeamDetailPage `/teams/:slug`

职责：
- 从 URL 读取 `slug`。
- 调用 `GET /api/teams/:slug`。
- 展示 Team summary、profile rating、team stats、roster。
- 提供 “Manage Team” 入口。

状态：
- Loading：整页骨架屏。
- Not Found：404 `TEAM_NOT_FOUND` 时显示 Team 不存在，并提供返回 `/teams` 链接。
- Archived：`archivedAt != null` 时顶部显示 archived banner，内容仍正常展示；Manage 入口隐藏或 disabled。
- Normal：完整展示 Team 数据。

数据展示：
- Summary：logo、name、divisionName、totalPoints、overallRating stars、description。
- Profile：profileRating radar；`null` 时显示空状态。
- Team Summary：至少展示 PTS、REB、AST、FG、3P。FG 和 3P 可展示 made/attempted 或 percentage；若展示 percentage，前端根据 made/attempted 计算，仅作为展示派生值，不提交后端。
- Roster：只展示后端返回的 active players。

Roster table 默认按 jersey number 升序，可点击列头排序。

### 5.3 CreateTeamPage `/teams/new`

职责：
- 加载 `GET /api/divisions`。
- 维护 TeamEditorForm 和 PlayerManagementSection 的受控状态。
- 提交 `POST /api/teams`。

表单字段：
- `name` 必填。
- `divisionId` 必填，来自真实 Division 下拉。
- `logoUrl` 可选。
- `primaryColor` 可选，hex color。
- `overallRating` 可选，UI 星级，payload 为 `0-10` number。
- `description` 可选。
- `profileRating` 默认完整对象。
- `players` 可选数组。

提交流程：
1. 点击 Create Team。
2. 前端执行轻量本地校验，主要用于即时反馈，不替代后端校验。
3. 发送 `POST /api/teams`。
4. 成功 `201`：跳转 `/teams/:slug`。
5. `VALIDATION_ERROR`：按 `details[].field` 映射字段错误。
6. 其他错误：显示页面级错误。

本地校验：
- 必填字段：name、divisionId。
- Player 新增行：number、position、name、isActive。
- 当前可见 active player number 不允许重复。
- URL/hex/rating 范围做基础校验。

### 5.4 ManageTeamPage `/teams/:slug/manage`

职责：
- 从 URL 读取 `slug`。
- 并行加载 `GET /api/teams/:slug` 和 `GET /api/divisions`。
- 用 Team 详情预填表单。
- 保存时调用 `PATCH /api/teams/:slug`。
- 归档时调用 `POST /api/teams/:slug/archive`。

状态：
- Loading：表单骨架屏。
- Not Found：跳转或显示 not-found 状态。
- Archived：如果加载到 archived Team，显示只读提示，不允许保存；提供返回详情页链接。
- Error：页面级错误 + retry。

保存流程：
1. 点击 Save Changes。
2. 收集受控表单状态。
3. 生成 PATCH payload。
4. 发送 `PATCH /api/teams/:slug`。
5. 成功 `200`：跳转 `/teams/:slug`。
6. 失败：映射字段错误或显示页面级错误。

PATCH payload 规则：
- 前端可以发送完整可编辑字段，也可以只发送变化字段；MVP 优先选择实现简单、可读的方式。
- 不传 `slug`。
- `divisionId` 使用 number。
- `profileRating` 发送完整对象，不发送部分对象。
- Player：
  - 新增：不含 `id`，含 `name`、`number`、`position`、`isActive: true`。
  - 编辑：含 `id` 和更新字段。
  - 移除：含 `{ id, isActive: false }`。
  - 未变化且不在 payload 中的旧 player 由后端保持不变。

归档流程：
1. 点击 Archive Team。
2. 展开 inline confirmation，不使用 modal。
3. 文案明确：归档不可撤销，Team 会从默认列表移除，历史数据保留。
4. 确认后调用 `POST /api/teams/:slug/archive`。
5. 成功后跳转 `/teams`。

Player 软删除：
- 点击 Remove 后，player 从当前可见列表移除。
- 若 player 有后端 `id`，本地记录为 pending removal。
- 保存时将 pending removal 以 `{ id, isActive: false }` 放入 `players` payload。
- Cancel 放弃所有本地变更，返回详情页或恢复加载时状态。

## 6. 组件规格

### 6.1 TeamEditorForm

从内部非受控状态改为受控组件。

Props：
- `value`
- `onChange`
- `divisions`
- `errors`
- `disabled`

职责：
- 编辑 Team 基础字段。
- 编辑 overallRating 星级。
- 编辑 profileRating 五项。
- 显示 logo / initials preview。
- 显示字段级错误。

不得在组件内部决定提交 payload；payload 由页面层组装。

### 6.2 PlayerManagementSection

从内部 mock 状态改为受控或半受控组件，页面层必须能读取最终 players 变化。

Props：
- `value`
- `onChange`
- `errors`
- `disabled`

职责：
- 展示当前 active roster。
- 新增 player。
- 编辑 player。
- remove player 并记录 pending removal。
- 显示 player 字段错误，例如 `players[1].number`。

### 6.3 Team Detail Components

- `TeamProfileSummary`：接收 API 映射后的 Team summary props，rating 使用星级。
- `TeamRadarCard`：支持 `profileRating = null` 空状态。
- `TeamSummaryCard`：展示 teamStats。
- `RosterTable`：接收 API player stats 映射结果，支持空 roster。

## 7. 错误处理

统一 API error shape：

```json
{
  "statusCode": 422,
  "error": "ERROR_CODE",
  "message": "Human-readable description.",
  "details": []
}
```

错误映射：

| Error Code | 前端处理 |
|---|---|
| `VALIDATION_ERROR` | 遍历 `details`，按 `field` 显示字段错误 |
| `DIVISION_NOT_FOUND` | 页面级错误：选择的分区不存在，请重新选择 |
| `ACTIVE_TEAM_REQUIRES_DIVISION` | 显示在 Division 字段 |
| `PLAYER_NUMBER_CONFLICT` | 若响应 `details` 含 `players[n].number`，显示在对应 player 的 number 字段；无法定位或 `details` 为空时显示 roster 顶部错误 |
| `PLAYER_NOT_FOUND` | 页面级错误：球员数据已变化，请刷新后重试 |
| `TEAM_NOT_FOUND` | 详情页显示 not-found；编辑页返回 `/teams` 或显示 not-found |
| `TEAM_ARCHIVED` | 编辑页显示只读 archived 提示 |
| `TEAM_ALREADY_ARCHIVED` | 归档区域显示防御性错误 |
| `SLUG_CONFLICT` | 创建页页面级错误，提示重试 |

字段错误路径沿用后端：
- `name`
- `divisionId`
- `profileRating.defense`
- `players[0].number`

## 8. 视觉设计要求

本次包含轻量视觉打磨，但不做重设计。

设计方向：
- 深色 analytics theme。
- 高信息密度。
- 4-6px radius。
- 1px low-contrast border。
- primary action 使用蓝色。
- dangerous action 使用 muted red。
- stats 使用 JetBrains Mono。

具体要求：
- 卡片层级统一：列表 card、详情 module、表单 section 使用一致边框和背景。
- 表单控件保持紧凑，label 与 error spacing 稳定。
- 页面级错误、字段错误、空状态、loading 状态风格统一。
- 按钮 hover/focus/disabled 状态完整。
- Team logo fallback 与 primaryColor 有轻量关联，但不能造成低对比度。
- 移动端不出现文字重叠、按钮溢出、表格挤压；表格可横向滚动。
- 不使用大面积渐变、装饰性 orb、营销式 hero。

## 9. 验收标准

### 9.1 TeamsPage

- 页面不再使用 mock Team 或硬编码 Division A-D。
- 加载成功时按 API 返回分组展示 active teams。
- 空列表显示 empty state。
- API 失败时显示 error + retry。
- Team card 点击进入 `/teams/:slug`。
- overallRating 以星级显示。

### 9.2 TeamDetailPage

- 页面使用 URL slug 请求真实 Team。
- 404 显示 not-found。
- archived Team 显示 archived banner，历史数据仍可看。
- totalPoints、teamStats、players 来自 API。
- profileRating 为 null 时显示空状态。
- overallRating 以星级显示。

### 9.3 CreateTeamPage

- Division 下拉来自 `GET /api/divisions`。
- 默认 profileRating 完整存在。
- 创建成功后跳转新 Team 详情页。
- 字段级错误正确显示。
- Player number 本地重复可即时提示，后端 `PLAYER_NUMBER_CONFLICT` 也能正确展示。
- 请求体不包含 slug 或派生统计字段。

### 9.4 ManageTeamPage

- 加载真实 Team 和 Division 数据预填。
- 保存调用 PATCH 并成功跳转详情页。
- Remove player 后保存会发送 `{ id, isActive: false }`。
- archived Team 不可编辑。
- 归档需要 inline confirm，成功后返回 `/teams`。
- Cancel 放弃本地变更。

### 9.5 视觉与响应式

- 四个页面风格统一，符合 `docs/DESIGN.md`。
- loading/error/empty/disabled 状态完整。
- 桌面和移动端无明显布局溢出或文字重叠。
- 不引入新的 UI component library。
