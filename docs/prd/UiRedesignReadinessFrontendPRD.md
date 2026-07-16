# UI Redesign Readiness Frontend PRD

## 1. 目标

按 `docs/UI_REDESIGN_READINESS_CHECKLIST.md` 增量收敛前端视觉样式，使颜色、字体、圆角、边框、阴影与常用控件主要由语义 token、Mantine 主题和小型共享视觉原语控制，从而降低未来视觉重设计的改动范围。迁移期间保持当前外观、布局、DOM 结构、响应式行为和业务逻辑不变。

## 2. 影响页面

含：
- 完成检查表 Phase 2 剩余的 Mantine 语义样式绕过检查。
- 完成 Phase 3：收敛操作按钮、表格和状态 badge/chip 的已有重复视觉样式，只在存在真实复用时提取。
- 按 Phase 4 增量迁移现有页面与共享组件。批次边界以完整用户界面和共享依赖为单位，不仅以单个 CSS 文件或路由命名。
- 完成 Phase 5 的防回归检查，为新增硬编码颜色、字体和圆角建立窄范围检查与必要 allowlist。
- 每批执行前端类型检查、测试、构建及桌面/移动端视觉验证。
- 在迁移过程中同步更新 `docs/UI_REDESIGN_READINESS_CHECKLIST.md` 的完成状态。

不含：
- 改变当前视觉设计，包括新的色板、字体、圆角风格或组件造型。
- 改变页面布局、组件位置、导航、用户流程、DOM 结构或响应式断点。
- 修改业务逻辑或 API 调用。
- 引入新组件库、全面设计系统包或文档站。
- 新增深色/浅色主题切换。
- 解决用户对当前 UI 视觉方向的具体不满；该内容属于准备工作完成后的独立重设计任务。

## 3. 组件变更

### 3.1 语义 token 与 Mantine 主题

- `apps/frontend/src/styles/variables.css` 继续作为项目 CSS 语义 token 的唯一入口。
- `apps/frontend/src/app/theme.ts` 仅承担 Mantine 需要的库级默认值，并与 CSS token 保持语义一致。
- 检查 Mantine `color`、`radius`、`c`、`bg` 和 `styles` 等 props。通用视觉值应转为主题、token 或共享 variant；确属页面语义或动态数据的值保留并注明原因。
- 不建立第二套页面级主题，不为完全共享 CSS/TypeScript 值而增加构建系统复杂度。

### 3.2 共享视觉原语

- `apps/frontend/src/styles/primitives.css` 拥有小型、跨页复用的 panel、form control 和 table 基础样式。
- `apps/frontend/src/shared/components/action-buttons.css` 拥有 primary、secondary、quiet 和 danger 操作按钮的唯一视觉实现。
- 表格原语只收敛已重复的表头、单元格、分隔线、hover 和横向滚动容器样式；列宽、对齐和页面特有密度仍属于页面 CSS。
- status badge/chip 按 primary、success、warning、danger 和 neutral 语义状态收敛，不以具体页面或色名命名。
- 仅在至少两处实际用法共享相同视觉模式时提取新原语；单次用法保留为局部样式。

### 3.3 增量迁移批次

#### Batch 1 - Team Editor

- 页面：`/teams/new`、`/teams/:slug/manage`。
- 文件边界：`CreateTeamPage`、`ManageTeamPage`、`TeamEditorForm`、`PlayerManagementSection`、`ManageTeamPage.css` 及它们直接使用的共享 token/原语。
- 特殊检查：Create/Save/Cancel/Add/Edit/Remove/Archive 操作、roster 表格、loading、validation、disabled、archive confirmation 和动态团队主色预览。

#### Batch 2 - Player Statistics

- 页面：`/players`、`/players/:slug`。
- 文件边界：`PlayersPage`、`PlayerDetailPage` 及其直接组件和样式。
- 特殊检查：统计 accent、leader cards、排序表格、performance bars、无数据状态与密集数值对齐。

#### Batch 3 - Match History and Entry

- 页面：`/matches`、`/matches/new`、`/matches/:id`、`/matches/:id/edit`。
- 文件边界：`MatchesPage`、`CreateMatchPage`、`EditMatchPage`、`MatchDetailPage` 及其直接组件和样式。
- 特殊检查：Create/Save/Cancel 操作、filter controls、box score 密集表格、横向溢出、void/destructive 状态和无比赛状态。

#### Batch 4 - Team Browsing

- 页面：`/teams`、`/teams/:slug`。
- 文件边界：`TeamsPage`、`TeamDetailPage` 及其直接组件和样式。
- 特殊检查：Create/Edit 操作、division/team cards、roster table、rating/profile 展示、archived 状态和空列表。

#### Batch 5 - Event Workflow

- 页面：Event 列表、创建、编辑、详情和 outcomes 页面。
- 文件边界：Event 页面、`features/events/components` 下的直接组件与相关样式。
- 特殊检查：status/tier badge、stage/result tags、participant controls、outcome tables、archive/destructive 操作和 read-only 状态。

#### Batch 6 - Shared Cleanup and Regression Guard

- 收敛前五批中已证明可复用的按钮、panel、form control、table 和 status badge/chip 样式。
- 迁移其余共享组件样式，删除无引用 selector，完成 Phase 2 绕过检查和 Phase 5 防回归脚本。

所有批次遵循同一套迁移规则，因此不为每个页面重复编写通用处理方式。每批只修改该批页面、它们直接使用的组件/共享样式、必要 token 和检查表，并在完成后删除已无引用的 selector。

### 3.4 批次执行与完成边界

- 批次是实施和回归定位边界，不是额外的用户审批点。完整 PRD 批准后，默认按 Batch 1 至 Batch 6 连续执行。
- 只有发现需要改变视觉方向、布局、DOM、业务逻辑或 PRD 范围，或客观环境阻止必要验证时，才暂停并向用户说明。
- 一个批次只有在其所有页面和直接依赖都完成迁移，且通过 §5.3 验证后才算完成；不得以某个 CSS 文件已处理代替整批完成。
- `docs/UI_REDESIGN_READINESS_CHECKLIST.md` 是实施进度的权威记录；PRD 定义边界和完成标准，不在此处记录瞬时完成状态。

### 3.5 防回归检查

- 使用不引入新依赖的项目脚本，检查 `apps/frontend/src` 内新增的 hex/rgb/hsl、`font-family` 和 `border-radius` 字面量。
- 允许 token/主题文件中的定义，以及经明确列入 allowlist 的动态数据颜色、可视化颜色或第三方集成值。
- allowlist 必须窄化到文件和用途，不允许全目录或全规则跳过。
- 将检查暴露为 frontend package script，使本地和后续 CI 可调用；本项工作不新建 CI 平台配置。

## 4. API 调用

无新增、删除或修改的 API 调用。所有现有请求时机、payload、响应处理与错误处理保持不变。

## 5. UI 规格

### 5.1 视觉保真原则

- 迁移本身不是重设计；改动前后的默认视觉效果应保持等价。
- 不改变页面布局、组件放置、DOM 结构、文案、交互、路由或响应式断点。
- 页面 CSS 主要保留布局、间距、响应式行为与真正局部的视觉例外。
- 确需保留的一次性字面量必须在使用处写明原因。团队主色预览等来自业务数据的动态值不强制 token 化。

### 5.2 首批：Team Editor

- **Route**: `/teams/new`、`/teams/:slug/manage`。
- **布局**: 保留两个页面现有页头、基本信息双列布局、profile rating 列表、roster 表格，以及 Manage Team 的 archive panel 和 `900px`/`560px` 断点。
- **控件**: 表单控件继续使用共享 control 样式；Create、Save、Cancel、roster actions 和 archive actions 映射到正确的共享按钮 variant。
- **表格**: roster 表格复用共享表头、单元格、分隔线和 hover 样式，保留本页列宽、操作对齐和 `min-width` 规则。
- **状态**: 两个页面的 loading、error、disabled、validation 和动态 primary-color preview，以及 Manage Team 的 archived/archive confirmation 行为与可见状态保持不变。

### 5.3 每批验证

1. 运行 frontend typecheck 和 build。
2. 运行项目已有的 frontend 测试；当前 frontend package 没有 test script，因此本项不引入新测试框架，测试项记录为“无可用自动化测试”。
3. 在实际运行的应用中比较受影响页面的 desktop 与 mobile 宽度。
4. 检查 default、hover、focus-visible、active、disabled、loading、validation 和 destructive 状态（仅限页面实际具有的状态）。
5. 检查表格溢出、密集数据展示、文字对比度和键盘焦点可见性。
6. 核对 Git diff，确认没有无关文件、业务逻辑或行为变更。
7. 只在对应验证完成后勾选 `docs/UI_REDESIGN_READINESS_CHECKLIST.md` 中的项目。

## 6. 与 Backend PRD 的接口约定

- 本项工作不要求任何后端或 Schema 变更。
- 前端不得为了样式迁移改变 API payload、响应类型、错误码映射或请求时机。
- 如果迁移过程发现需要后端数据才能完成的新视觉状态，该需求不在本 PRD 范围内，必须单独进入需求确认流程。

## 7. 实施决策记录

### 7.1 2026-07-02 - Player leader card 渐变属于有意保留的局部特效

**背景**：`PlayersPage` 的 statistic leader cards 与普通 panel 共享大方框的表面、边框和圆角语言，但各统计类别的低透明度渐变是有意设计的局部视觉效果，不应在样式迁移中删除或全局化。

**决策**：
- leader card 继续使用 `.app-panel` 作为共享外壳，由其控制底色、边框、圆角和共享 elevation。
- 渐变作为 `.stat-leader-card` 的局部 overlay，优先通过 `::before` 伪元素实现，不使用 `background` shorthand 覆盖共享 panel 的完整背景定义。
- overlay 使用 `border-radius: inherit`、`pointer-events: none` 和正确层级，使它自动跟随全局 panel 圆角且不影响交互。
- Points、Assists、Rebounds 和 Rating 只设置各自的 `--stat-accent` / `--stat-accent-soft` 统计语义 token。
- 未来整体调整 panel 底色、边框、圆角或 elevation 时，leader card 必须自动跟随；局部渐变仍保留，除非后续重设计明确要求移除。

**范围影响**：该决策是 Batch 2 - Player Statistics 的视觉保真要求，不将渐变提升为所有 panel 的共享默认效果。

### 7.2 2026-07-16 - Event 卡与获奖高亮改为 token 化，取代 Batch 5 的字面量保留决策

**背景**：Batch 5 曾将 `EventsPage.css` 的 Event summary 渐变、获奖（winner）高亮与 `EventTierBadge.css` 的 tier crest 渐变一并记为“有意的数据可视化字面量”，并写入 `check-style-literals.mjs` 的 `visualizationAllowlist`。后续复核发现，`EventsPage.css` 中的获奖金色实为早期版本遗留：当主题切换到薄荷绿+近黑后，作者未同步调整 design token，而是硬编码了一个与全站 `--color-warning`（`#ffb95f`）不一致的旧金色（`#FBBF24` = `rgba(251,191,36,…)`），并混入旧 slate 残留（卡片渐变 `rgba(15,23,42,…)`、页脚分隔线 `rgba(51,65,85,…)`）。这些属于 token 化欠债，而非有意特效。

**决策**：
- `EventsPage.css` 全量去字面量：获奖金色接入既有专属 token 家族 `--color-event-winner-border` / `--color-event-winner-surface`（以 `#ffb95f` 为准，`#FBBF24` 弃用）；卡片渐变与页脚分隔线新增 `--color-event-card-gradient-top` / `--color-event-card-gradient-bottom` / `--color-event-card-divider`，**保留精确当前值**以维持视觉保真。
- 渐变结构与布局完全不变，仅将颜色搬入 `variables.css`，使其可追溯、可在后续重设计中一处改值。
- 将 `EventsPage.css` 从 `check-style-literals.mjs` 的 `visualizationAllowlist` 中移除；`EventTierBadge.css` 仍保留在 allowlist（tier crest 的 token 化另行决策，本次不动）。
- 金色与薄荷绿的配色和谐问题**不在本次范围**，留待后续独立的 design token 重设计；本次仅统一到既有 token 值、消除硬编码欠债。

**范围影响**：本决策取代 §7.1 之后 Batch 5 中“Event summary/winner 渐变作为字面量保留”的部分，仅限 `EventsPage.css`。`docs/UI_REDESIGN_READINESS_CHECKLIST.md` 的 Batch 5 相应条目同步更新。不改变任何页面布局、DOM、响应式断点或业务逻辑。

### 7.3 2026-07-16 - `check-style-literals.mjs` 扩展至 `.tsx` 与动态值 allowlist

**背景**：防回归脚本原先只扫描 `.css`，导致 `.tsx` 内联样式中的颜色字面量（如 `TeamCard.tsx` 的动态对比色、`primaryColor` 数据默认值）不受守护。

**决策**：
- 扫描范围扩展到 `.css` 与 `.tsx`。`.tsx` 的 `fontFamily` / `borderRadius` 为驼峰写法，不触发 font-family / border-radius 规则，故仅颜色规则实际生效，无误报风险。
- 新增窄范围 `dynamicValueAllowlist`（按文件+用途注明）：`TeamCard.tsx`（运行时按团队主色计算的兜底/对比色）、`CreateTeamPage.tsx` 与 `ManageTeamPage.tsx`（团队主色数据默认值）、`TeamEditorForm.tsx`（仅在 placeholder/校验文案中作为示例文本出现的 hex）。
- allowlist 保持窄化到文件与用途，不做全目录或全规则跳过。

**范围影响**：属 Phase 5 防回归收敛。团队主色等业务数据动态值不强制 token 化，符合 §5.1；未来若这些默认值需跟随主题，另行进入需求确认流程。

### 7.4 2026-07-16 - Event Tier Crest 文档化为可视化例外并 token 化

**背景**：`EventTierBadge.css` 的四档（S/A/B/C）配色是半迁移状态：结构（圆角/字体）已 token 化，但每档的边框与渐变洗色仍为旧 slate/蓝主题的裸值，且与各档实色 token 不一致（S 字母用 `--color-warning` #ffb95f 却配 #FBBF24 洗色，B 字母用 `--color-success` #3cffd0 却配 #4EDEA3，A 档更是 `#60a5fa` 蓝——薄荷体系无对应 token 的化石色）。CLAUDE.md 新增「design-token 变更先改 DESIGN.md 再镜像 variables.css」的规则后，此改动须先在 DESIGN.md 立意图。同时 DESIGN.md 明确「避免渐变、mint 稀用」，而 tier crest 本质是多彩渐变纹章，需要一个合法身份。

**决策**：
- 在 `docs/DESIGN.md` 新增 “Event Tier Crest — data-visualization exception” 小节，将 tier crest 明文登记为**受认可的可视化例外**（与 Stat Leader Card 渐变同类），并定义 tier accent 色阶：S=`warning`、A=`uv`(#a07aff)、B=`success`、C=`text-soft`。
- **A 档由旧电蓝 #60a5fa 改为 uv 紫 #a07aff**（用户决策），与 S 金/B 绿拉开区分，且不再引入薄荷体系外的离群蓝。
- `variables.css` 镜像新增 `--color-tier-{s,a,b,c}-accent`（空格/逗号分隔 RGB 通道，使单一 accent 同时派生实色与 alpha 洗色）与共享 `--color-tier-crest-*` chrome token（保留旧 slate 值以维持视觉保真，留待重设计再定值）。
- `EventTierBadge.css` 全部裸值改为 token 引用；各档实色与洗色统一到同一 accent，根除「一档两色」。S/B/C 视觉仅极轻微色相位移，A 档按决策改紫。
- `EventTierBadge.css` **保留在** `check-style-literals.mjs` 的 `visualizationAllowlist`：它现已 token 驱动，但仍用 `rgba(var(--tier-accent), α)` 组合透明度渐变，属登记在案的可视化例外，非未迁移裸值。

**范围影响**：本决策把 tier crest 从「Batch 5 allowlist 里的未说明字面量」升级为「DESIGN.md 登记的正式可视化例外」。执行顺序遵循 CLAUDE.md 新规则：DESIGN.md → variables.css → 组件 CSS。同时补记 §7.2 的 `--color-event-card-*` / `--color-event-winner-*` token 进 DESIGN.md，消除新规则下的文档-实现同步缺口。不改变布局、DOM、响应式或业务逻辑。
