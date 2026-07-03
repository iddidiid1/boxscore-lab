# Action Language Consistency Frontend PRD

## 1. 目标

统一前端中“创建、添加、保存、取消、返回、移除、归档、作废与恢复”等常用操作的英文文案、图标和语义用法，减少同类操作在不同页面中混用不同动词、文本加号或不一致图标的情况。调整后应提高界面可预期性和扫读效率，同时保留 Archive、Void 和 Remove 等不同业务动作的准确含义。

## 2. 影响页面

含：
- 盘点现有前端页面和直接业务组件中的用户可见 action buttons 与 action links。
- 为顶级实体创建、子项添加、编辑保存、取消、返回、移除、归档、比赛作废和恢复建立明确的 action copy 规则。
- 统一上述操作的 Lucide 图标映射、图标尺寸和“何时不使用图标”的规则。
- 移除文本形式的加号（例如 `+ Add Player`），改用统一的 Plus 图标和纯 action copy。
- 使同类创建入口、创建提交、编辑保存和取消操作在 Team、Player roster、Event 和 Match 相关界面中使用一致模式。
- 将 destructive confirmation 中模糊的 `Confirm` 替换为具体业务动作，例如 `Void Match` 或 `Archive Team`。
- 保留 Archive、Void、Remove 和 Restore 之间的业务语义差异，不将它们统一为模糊的 `Delete`。
- 保持现有按钮层级、位置、布局、响应式行为、loading/disabled 条件和点击后业务行为不变。
- 复用现有 Mantine Button/ActionIcon、Lucide React 和共享 action-button 样式，不引入新组件库。

不含：
- 任何后端、Prisma Schema、数据迁移、API、payload、错误码或业务规则变更。
- 新增、删除或改变按钮所触发的业务能力。
- 将 Archive、Void 或 Remove 改造为真正的数据库硬删除。
- 改变 confirmation modal 的流程、触发条件或危险操作保护。
- 重设计按钮颜色、形状、大小、位置或页面布局。
- 统一普通非操作文案、页面标题、帮助文本、错误信息或空状态文案。
- 新增通用图标封装或大型按钮组件抽象；只有现有重复用法证明有必要时，才允许小型、局部的共享处理。

## 3. 组件变更

仅修改以下文件，不新建文件：

| 文件 | 变更摘要 |
|------|---------|
| `apps/frontend/src/pages/ManageTeamPage/components/PlayerManagementSection.tsx` | `+ Add Player`（文字加号）→ `<Plus size={16}/>` 图标 + `Add Player`；补充 `Plus` import |
| `apps/frontend/src/pages/ManageTeamPage/ManageTeamPage.tsx` | 归档确认按钮 `Confirm Archive` → `Archive Team` |
| `apps/frontend/src/pages/MatchDetailPage/MatchDetailPage.tsx` | 触发按钮 `Void` → `Void Match`、`Restore` → `Restore Match`；Modal 确认按钮 `Confirm` → 动态 `Void Match` / `Restore Match` |
| `apps/frontend/src/features/events/components/EventForm.tsx` | 头部提交按钮 `Save`（含 Save 图标）→ create 模式 `Create Event`，edit 模式 `Save Changes`（两者均去除图标）；`Archive` → `Archive Event`；Plus size 15 → 14；Stage 区域 Trash2 size 15 → 14；移除 `Save` 图标 import |
| `apps/frontend/src/pages/EventOutcomesPage/EventOutcomesPage.tsx` | 返回链接从 Button（component="a"）改为 `<Anchor>`；保留文案 `← Back to Event` |
| `apps/frontend/src/pages/EventsPage/EventsPage.tsx` | Plus icon size 17 → 16 |
| `apps/frontend/src/pages/MatchesPage/components/matches/MatchesPageHeader.tsx` | Plus icon size 17 → 16 |
| `apps/frontend/src/pages/CreateMatchPage/components/MatchFormActions.tsx` | 新增 `mode: "create" \| "edit"` prop；`Save` → create 模式 `Create Match`，edit 模式 `Save Changes` |
| `apps/frontend/src/pages/CreateMatchPage/MatchFormPage.tsx` | 向 `MatchFormActions` 传入 `mode` prop |

## 4. API 调用

此变更仅涉及前端文案与图标，不引入任何新的 API 调用，现有调用时机和 payload 完全不变。

| Action | Method + Path | When |
|--------|--------------|------|
| （无变更）| — | — |

## 5. UI 规格

### 5.1 Action Copy 规则

所有页面必须遵守下表，不允许自行创造新写法：

| 操作类别 | 文案规则 | 当前不符合的实例 |
|---|---|---|
| 创建顶级实体（入口按钮 + create 模式表单提交）| `Create [Entity]` | EventForm create 模式 `Save` → `Create Event`；MatchFormActions create 模式 `Save` → `Create Match` |
| 编辑表单提交（edit 模式）| `Save Changes` | EventForm edit 模式 `Save` → `Save Changes`；MatchFormActions edit 模式 `Save` → `Save Changes` |
| 子项内联表单保存 | `Save [Item]` | `Save Player` ✓ 已正确 |
| 子项添加入口按钮 | `Add [Item]`（无文字加号前缀）| `+ Add Player` → `Add Player` |
| 取消 | `Cancel` | 全部 ✓ 已正确 |
| 返回导航链接 | `← Back to [Entity]` + `<Anchor>` 组件 | EventOutcomesPage 用 Button 而非 Anchor |
| 归档操作（触发按钮 + 确认按钮）| `Archive [Entity]` | `Confirm Archive` → `Archive Team`；`Archive` → `Archive Event` |
| 比赛作废（触发 + 确认）| `Void Match` | `Void` → `Void Match`；Modal `Confirm` → `Void Match` |
| 比赛恢复（触发 + 确认）| `Restore Match` | `Restore` → `Restore Match`；Modal `Confirm` → `Restore Match` |
| Outcomes 保存 | `Save Outcomes` | ✓ 已正确 |
| 状态推进 | 保持原文案不变 | `Start Event`、`Complete Event`、`Reopen Event` ✓ |
| 编辑/管理导航按钮 | `Edit [Entity]` / `Manage [Entity]` | `Edit Event`、`Edit Match`、`Manage Team` ✓ |

### 5.2 图标规则

| 场景 | 图标 | 尺寸 | 位置 |
|---|---|---|---|
| 顶级创建入口按钮（standard / sm size）| `Plus` | 16 | leftSection |
| 子项添加按钮（size="xs"）| `Plus` | 14 | leftSection |
| 编辑 / 管理导航按钮 | `Pencil` | 16 | leftSection |
| 结果 & 奖项导航按钮（View/Manage Results & Awards）| `Trophy` | 16 | leftSection |
| `Save Outcomes` 按钮 | `Save` | 16 | leftSection |
| 所有其他按钮（Create [Entity]、Save Changes、Cancel、Archive [Entity]、Void Match、Restore Match 等）| **无图标** | — | — |
| ActionIcon 内联删除（Trash2）| `Trash2` | 14 | — |
| ActionIcon 排序（ArrowUp / ArrowDown）| `ArrowUp` / `ArrowDown` | 14 | — |

### 5.3 返回导航规则

- 返回导航**统一使用 Mantine `<Anchor>` 组件**，不用 `<Button component="a">`
- 文案格式：`← Back to [Entity]`（← 为 Unicode U+2190 字符，直接写入 JSX，不用 `←` 转义）
- 样式类名：`[page]-back-link`，与同类页面保持一致（如 `event-outcomes-back-link`）

当前所有返回导航汇总：

| 页面 | 文案 | 目标路径 | 当前状态 |
|---|---|---|---|
| TeamDetailPage | `← Back to Teams` | `/teams` | ✓ Anchor |
| EventDetailPage | `← Back to Events` | `/events` | ✓ Anchor |
| MatchDetailPage | `← Back to Matches` | `/matches` | ✓ Anchor |
| PlayerDetailPage | `← Back to Players` | `/players` | ✓ Anchor |
| EventOutcomesPage | `← Back to Event` | `/events/:slug` | ✗ Button → 改为 Anchor |

### 5.4 Destructive Confirmation 规则

二次确认时，确认按钮文案必须与触发按钮**完全相同**，禁止使用泛化的 `Confirm` 或 `Confirm [Action]`。

| 操作 | 触发按钮文案 | 确认按钮文案（当前）| 确认按钮文案（目标）|
|---|---|---|---|
| 归档队伍（ManageTeamPage）| `Archive Team` ✓ | `Confirm Archive` ✗ | `Archive Team` |
| 归档赛事（EventForm）| `Archive Event` | 无内联确认（window.confirm）| — |
| 比赛作废（MatchDetailPage Modal）| `Void Match` | `Confirm` ✗ | `Void Match` |
| 比赛恢复（MatchDetailPage Modal）| `Restore Match` | `Confirm` ✗ | `Restore Match` |

### 5.5 逐文件变更清单

#### PlayerManagementSection.tsx
- 在 lucide-react import 中补充 `Plus`
- 入口按钮：移除文案中的 `+ ` 前缀，添加 `leftSection={<Plus size={16} />}`

#### ManageTeamPage.tsx
- 归档确认状态按钮文案：`Confirm Archive` → `Archive Team`

#### MatchDetailPage.tsx
- 主区域触发按钮：`Void` → `Void Match`；`Restore` → `Restore Match`
- Modal 确认按钮：`Confirm` → `{confirmAction === "void" ? "Void Match" : "Restore Match"}`

#### EventForm.tsx
- lucide-react import：移除 `Save`
- 头部提交按钮：移除 `leftSection={<Save size={16}/>}`；文案改为 `{mode === "create" ? "Create Event" : "Save Changes"}`
- Match Stage Tags 区域 Add 按钮：Plus size `15` → `14`
- Match Stage Tags 区域 Trash2 ActionIcon：size `15` → `14`
- Result Tags 区域 Add 按钮：Plus size `15` → `14`
- Event Status 区域 Archive 按钮：`Archive` → `Archive Event`

#### EventOutcomesPage.tsx
- 将 `<Button className="app-action-button app-action-button--secondary" component="a" href={...} size="sm" variant="outline">← Back to Event</Button>` 替换为 `<Anchor className="event-outcomes-back-link" href={`/events/${event.slug}`}>← Back to Event</Anchor>`
- 从 Mantine import 中移除 `Button`（若仅用于此处）；添加 `Anchor` import

#### EventsPage.tsx
- Create Event 按钮：Plus size `17` → `16`

#### MatchesPageHeader.tsx
- Create Match 按钮：Plus size `17` → `16`

#### MatchFormActions.tsx
- 组件 props 增加 `mode: "create" | "edit"`
- Save 按钮文案：`{mode === "create" ? "Create Match" : "Save Changes"}`

#### MatchFormPage.tsx
- `<MatchFormActions ... />` 调用处增加 `mode={mode}` prop

## 6. 与 Backend 的接口约定

此变更不涉及任何 Backend API，无接口约定变更。所有按钮的点击行为、触发的 API 调用、请求 payload 和响应处理均保持不变。
