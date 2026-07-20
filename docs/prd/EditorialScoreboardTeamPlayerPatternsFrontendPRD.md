# Editorial Scoreboard Team Player Patterns Frontend PRD

> 阶段定义：本 PRD 属于 [Editorial Scoreboard 迁移 PRD 索引](./EditorialScoreboardMigrationIndex.md)
> 的 **M3 — Team and Player Patterns**。

## 1. 目标

实施 Editorial Scoreboard M3 Team and Player Patterns，在不改变现有内容、数据流、
路由、查询与业务交互的前提下，将 Team 与 Player 的核心身份和业务展示迁移为已批准的
产品 Pattern：Teams Overview 使用 Open Division Stacks 与 Score Ledger Team Cards，
Team Detail 使用 Unified Field，Team Create/Edit 使用 Identity Proof；Players Overview
使用 Frosted Depth Leader Cards，Player Detail 使用 Number Masthead、Segmented
Performance Profile 与 Honors Ledger。

## 2. 影响页面与范围

文档权威：

- `docs/DESIGN.md` 是 Open Division Stacks、Score Ledger、Unified Field、
  Identity Proof、Frosted Depth Leader Cards、Number Masthead、Segmented
  Performance Profile 与 Honors Ledger 的视觉 SOT。
- 本 PRD 只拥有 M3 的实施范围、接入边界和验收目标，不复制第二套 token 或视觉值。
- 本 PRD 补充而不取代 `TeamRosterManagementFrontendPRD.md` 与
  `PlayerStatisticsFrontendPRD.md`；现有 feature PRD 继续拥有内容要求、字段含义、
  路由、查询、排序、分页、归档、统计和业务交互。
- M1 Shared Primitives 与 M2 Data Display PRD 继续拥有共享 surface/action/form/
  feedback/motion、Data Bay、Ruled Grid、Pagination 与 Fractional Star Rating；
  M3 只组合和扩展已批准角色。

修改现有页面：

- Teams Overview `/teams`
  - 保留现有 active Team、division 顺序、空状态和完整 Team Card 导航。
  - division 采用 Open Division Stacks，不增加可见的通用外层 card。
  - Team Card 采用 Score Ledger，在 40% Team Identity Surface 上保留 logo、name、
    total points 与精确 fractional rating；points 为明确数值列，rating ledger 横跨
    card 底部。
  - loaded logo 使用 Open Artwork 与 `object-fit: contain`；missing/failed logo 使用
    Neutral Frame 与 derived initials。完整卡保留 hover、focus-visible 与 pressed。
- Team Detail `/teams/:slug`
  - 将现有 identity 与五轴 radar 合并为一个 Unified Field，共享 Team Identity
    surface，identity 在前、radar 在后并以结构 divider 分隔。
  - 五轴数值继续全部可见且可访问；无 profile 时保留既有 unavailable 区域。
  - archived notice 保持在 hero 外，Manage Team 对 archived Team 继续隐藏；back link、
    Team Summary 与 roster 的内容和行为不变。
- Team Create `/teams/new` 与 Team Edit `/teams/:slug/manage`
  - 将现有分散预览重组为 Editor 内 Open Well 中的只读 Identity Proof。
  - 预览实时反映 logo/fallback、Team name、division、team color 与 fractional rating；
    name 为空时使用 `New Team`，division 未选择或无法匹配时使用
    `No division selected`，零评分使用 initials fallback；Create 页面既有的首项
    division 自动预选行为保持不变。
  - failed logo 使用与 missing logo 相同几何；预览不获得 hover、pressed、导航、
    points 或 radar。
- Players Overview `/players`
  - 保留四张固定 leader cards 及既有 Crown/category label、value、Player、Team 层级。
  - 使用四种可通过颜色与文字共同区分的 Frosted Depth category treatment；
    hover 只增强局部 glow，不上浮、不缩放。
  - Leader Card 不是链接或按钮，不获得 click、focus、pressed、selected 或 pointer；
    `No eligible players` 等现有空候选语义不变。
- Player Detail `/players/:slug`
  - profile hero 使用 Number Masthead：超大加粗 `#number` 位于 name 之前，不显示
    `Jersey` label；Team 与 Position 作为明确 facts，team color 只作为 restrained
    Outline Echo。
  - inactive Player 与 archived Team 状态独立显示；back link、filter、summary 与
    match history 的内容和行为不变。
  - Performance Profile 使用 PTS、REB、AST 三行十段 Segmented Meter，允许末段部分
    填充；直接使用 backend 的 `0–100` 整数，显示精确整数但不显示 `%`。
  - helper 与 accessible name 明确数值相对于当前 scope leader；零值显示全空，
    meter 只读且不重新计算数据。
  - Awards 使用只读 Honors Ledger：MVP 配 Trophy、First Team 配 Star、Second Team
    配 Medal；每行显示 award type、Event 与 award-time Team，可选 notes 为空时省略。
    行与文字不新增导航或 hover/press/select；空状态文案保持
    `No awards in this scope.`。

共同验收范围：

- loaded、dark、missing 与 failed Team logo；derived initials fallback。
- active/archived Team、active/inactive Player、current/historical Team 归属。
- `null`/zero/partial overall rating 与五颗可部分填充星。
- 四张 leader cards 的真实数据、无合格 Player、hover-only glow 与 touch/no-hover。
- Performance Profile 的 `0`、部分段与 `100`，以及 leader-relative accessible copy。
- Awards 三种已知类型、可选 notes、空集合及 award-time Team。
- desktop、560px、760px、980px 与长名称场景下的顺序、截断和纵向 stacking。
- keyboard focus、Reduced Motion、failed image recovery、loading、empty 与 error 状态；
  不改变 M1/M2 已批准的共享反馈与交互语义。
- 对真实重复使用提取最小共享 Team artwork/identity 或 Player pattern primitive；
  page CSS 只保留布局、断点和本地业务呈现。
- 执行 style literal check、typecheck、production build 和代表性浏览器 smoke test。

不包含：

- 新页面、新路由、API、query contract、数据模型、统计计算、排序或分页变化。
- Team logo 上传、裁切、重新着色、服务端 contrast 分析或嵌套 logo card。
- Team division、points、rating、profile、archive、roster 或 editor 业务流程变化。
- Leader Card 点击导航，或为纯 hover card 增加键盘交互伪语义。
- 前端重新计算 leader、Performance Profile 数值、Award 归属或历史 Team。
- Event Player Awards 选取功能重设计；该工作属于后续独立 functional PR。
- M2 Data Display 的重新设计，或 M4 Event、M5 Match product Pattern。
- Sidebar、Page Header、通用 background、Light mode 或未批准的 proposal/lab 方案。

## 3. 组件变更

### 3.1 实施原则与共享边界

M3 使用“一个共享 artwork primitive + 业务 Pattern 保持本地所有权”的结构：

- `apps/frontend/src/styles/variables.css` 继续是 semantic token canonical entry。
  仅在 Team artwork、Team trace、leader category glow 或 segmented meter 存在真实
  共享角色缺口时新增或修订 purpose-named token。
- `apps/frontend/src/styles/primitives.css` 只承载跨页面复用的 Team identity/artwork
  基础契约；Division、完整 Team Card、Radar、Leader Card、Number Masthead、
  Performance Profile 与 Honors Ledger 的专有构图留在对应页面 CSS。
- Mantine theme 与 token 保持一致，不在页面代码建立第二套 theme。
- 不创建接收任意 entity、metadata、actions 和 layout 的万能 Identity/Card 组件。
- 不修改 M1 action/form/feedback、M2 Data Bay/Ruled Grid/Pagination/Fractional Star
  Rating 的 DOM 职责；M3 仅组合它们。
- 页面 CSS 只拥有布局、断点、业务 Pattern 构图与 data-driven color placement；
  不硬编码新颜色、字体、圆角或重复阴影。

### 3.2 Shared Team Artwork

新增一个最小共享 Team artwork/fallback primitive，供 Teams Overview、Team Detail 与
Team Editor Identity Proof 使用。建议位于
`apps/frontend/src/shared/components/team-identity/TeamArtwork.tsx`，实际文件名可遵循
现有 shared component 命名，但职责必须保持以下边界：

| Prop / state | 行为 |
|---|---|
| `name` | 生成最多两个大写 initials，并提供 fallback 语义来源 |
| `logoUrl` | 非空时尝试渲染 artwork；为空时直接 fallback |
| loaded | `img` 使用 `object-fit: contain`，不裁切、不重新着色、不附加 glow/outline |
| failed | 当前 src 的 `onError` 切换至与 missing 相同的 Neutral Frame + initials |
| context/size | 只控制批准的 compact/detail/preview 几何，不改变数据或视觉语义 |
| decorative | 在相邻可见文字已提供 Team name 时使用空 `alt`；不得重复朗读 Team name |

具体要求：

- loaded artwork 是 Open Artwork，不额外包裹方形 logo card；较亮的 40% Team Identity
  parent surface 负责兼容 NBA 等包含黑色字样的 logo。
- fallback 使用 Neutral Frame 与 initials only，不显示 Shield 或其他伪 logo。
- failed state 必须在 `logoUrl` 变化时重置并重新尝试新图片，避免旧 URL 的失败状态
  污染新的草稿或响应。
- 不基于像素亮度、Team primary color 或 URL 字符串猜测图片是否“深色”。
- Team color 只用于批准的 trace/cutline，不作为 fallback 背景或文字对比计算依据。

### 3.3 Teams Overview

保留 `DivisionCard` 与 `TeamCard` 的业务所有权：

- `DivisionCard`
  - 保持现有 division label + horizontal rule + responsive Team grid DOM。
  - 移除任何残余通用 panel/card surface；Division 间距和 grid 可本地调整。
  - division 无 Team 时遵循现有页面 empty behavior，不虚构占位 Team。
- `TeamCard`
  - 根节点继续是唯一 `<a href="/teams/:slug">`，accessible name 保持明确。
  - 上部 identity ledger 包含 TeamArtwork、可截断 Team name 和稳定的 points column。
  - points 保留 `toLocaleString()` 与 `pts` 单位；列在同一 grid 中右对齐，长名称不得
    挤走或覆盖数值。
  - rating ledger 位于结构 divider 之后并横跨整卡，复用 compact
    `FractionalStarRating`；`null` 与 `0` 保持 M2 语义。
  - root 使用 `app-surface--identity` 或等价 shared identity contract；不回退到普通
    `app-panel`。
  - hover 增强 edge/trace，pressed 提供克制的 surface 反馈，focus-visible 使用
    shared focus ring；不 lift、不 scale、不全局 glow pulse。
  - data-driven Team color 通过安全的 CSS custom property 传入局部 cutline/trace；
    缺失或无效颜色使用 neutral token，不把颜色写进共享 token。

### 3.4 Team Detail Unified Field

保留 `TeamProfileSummary` 与 `TeamRadarCard` 的职责，在 `TeamDetailPage` 组合为一个
共享 field：

- `team-detail-hero` 是唯一 Team Identity Surface 与 field boundary。
- `TeamProfileSummary` 不再拥有独立 surface；按 logo、name、division、points、
  fractional rating、description 的既有内容顺序组成 leading region。
- `TeamRadarCard` 不再是独立 `app-panel`；它成为 trailing region，并以结构 divider
  与 identity 分隔。
- Radar 保留五轴 SVG，不改为 summary grid。DEF、OFF、CON、COH、DEP 的可见 label
  与精确数值保持；`svg` 必须提供可访问的五项值描述，而不只使用泛化 chart label。
- `profileRating = null` 时 trailing region 仍存在，显示
  `No profile ratings recorded.`，不渲染假数据 polygon。
- Back link、Manage Team 和 archived Alert 均保持 Unified Field 外部现有位置；
  archived Team 继续隐藏 Manage Team。
- `980px` 及以下按 identity 后 radar 的顺序纵向堆叠，并把横向 divider 转为纵向层级
  所需的顶部 divider；`560px` 下 logo、长名称和 description 不产生横向 overflow。

### 3.5 Team Editor Identity Proof

重构 `TeamEditorForm` Basic Info 的右侧预览：

- 表单字段、label、validation、change handler 与 submit payload 完全不变。
- 删除 `Logo Preview`、`Team Preview`、`Rating Preview`、`Selected Division`
  四段 field-by-field inspector；改为一个 Open Well 中的完整 Identity Proof。
- Identity Proof 组合 TeamArtwork、preview name、division label、
  FractionalStarRating 与 data-driven Team-color trace。
- draft 映射：
  - trimmed name 为空：`New Team`；
  - `divisionId` 未命中当前 divisions：`No division selected`；Create 页面加载后若按
    现有业务逻辑自动选中首个 division，则如实显示该 division；
  - logo 为空或失败：由 preview name 生成 initials；
  - overall rating：直接使用草稿数值，空初始草稿为 `0`；
  - primary color 仅在现有 hex 校验通过时进入 trace，否则使用 neutral trace。
- preview 是带有明确 accessible label 的非交互输出区域；不使用 `aria-live`，避免
  slider 连续变化造成过度播报。
- preview 不包含 points、description、radar、Manage、navigation、hover、focus、
  pressed 或 selected。
- `900px` 以下 preview 移到字段之后；窄屏中 artwork 在文字之前，不并排压缩内容。

### 3.6 Players Overview Leader Cards

保留 `StatisticLeaderCards` 的现有数据映射和内容层级，只迁移 surface/state：

- 固定四项继续是 Points、Rebounds、Assists、Rating，并按 API/页面现有顺序渲染。
- 每张卡保持 Crown + category label、large value、Player name、Team name。
- 四张卡共享 Frosted Depth geometry，但使用独立 category token family；颜色不是唯一
  区分方式，label 和内容始终可见。
- default 使用 category wash、ambient light 与 Crown glow；hover 只增强本地 wash、
  edge highlight 和 glow，且不得改变布局几何。
- root 使用不可交互的 `div`/Mantine `Box`：无 `tabIndex`、role button/link、click
  handler、focus style、pressed/selected、pointer cursor 或 navigation。
- Reduced Motion 下 transition 归零，但 default/hover 的静态颜色对比可保留；触屏或
  `hover: none` 不依赖 hover 才能区分类别。
- 保持宽屏四列、中间两列、`760px` 以下一列。所有卡在同一 breakpoint 等高，Player
  与 Team 长名称截断不得改变 card geometry；完整名称由现有文本或 `title`/
  accessible label 保持可得。
- 无合格 Player 时继续渲染四张卡、值 `0.0` 与 `No eligible players`，不渲染虚假 Team。

### 3.7 Player Number Masthead

重构 `PlayerProfileHeader`，不改变 `PlayerDetailPage` 的请求或 page composition：

- `#number` 使用 display font 并成为首要视觉锚点；数字内容仍是可读文本，不以
  pseudo-element 单独承载。
- restrained Outline Echo 使用 Team primary color 的局部 CSS custom property；
  它不得降低实体数字对比度，也不得形成全局 glow。
- name 紧随 number；Team 与 Position 使用 label-first compact facts，不再合并为
  `#number · Team · Position` 一行。
- 移除 `Jersey` label；保留明确的 Team 与 Position label。
- inactive Player 与 archived Team 各自使用有文字/图标语义的 compact status，
  可以同时出现且不只依赖颜色。
- Back link 保持 Masthead 外部。Awards 仍与 identity 同属 Player profile owning
  region，但不嵌套为可交互 card。
- `560px` 下遵循 number first、identity content second、facts/status afterward；
  超长 name/Team 可换行且不覆盖 number。

### 3.8 Segmented Performance Profile

保留 `PlayerPerformanceBars` 的 props/data source，可在不影响调用方的情况下重命名
内部 CSS class；不引入通用 Slider：

- 顺序保持 API 提供的 PTS、REB、AST 三项。
- 每行包含 label、精确 integer value 和十个等宽 segments。
- 将 clamp 后的值 `v` 映射为十个视觉区间：
  - segment `i`（零起始）的 fill 比例为 `clamp(v - i * 10, 0, 10) / 10`；
  - `0` 时全部为空；
  - 十的整数倍填满对应数量，不额外点亮下一段；
  - `100` 时十段全满。
- partial final fill 通过 segment 内部 fill layer 表达，不使用十一个节点、不舍入到
  最近十位。
- 视觉数值显示 clamp 后整数且不带 `%`；不把百分号隐藏在可见文案后又保留错误语义。
- helper 保持“Relative to the leader in the current statistics scope.”含义。
  每行 accessible name 使用例如 `Points: 73 out of 100 relative to the current
  scope leader`，不得只说 percent。
- meter 是只读 visualization，可使用 `role="meter"` 及 `aria-valuemin="0"`、
  `aria-valuemax="100"`、`aria-valuenow`；无键盘、drag、hover fill 或 focus。
- segment gap、empty/fill、category-neutral glow 只使用 semantic token；不得复用
  editable Rating Slider 的 thumb/track 状态。

### 3.9 Player Honors Ledger

重构 `PlayerAwards`，继续使用现有 `awards` array：

- owning section 使用 Open Content/ruled ledger，不新增 nested generic card。
- award icon/type 映射：

| `awardType` | 可见名称 | Icon | 语义 |
|---|---|---|---|
| `EVENT_MVP` | Event MVP | Trophy | Championship Gold |
| `ALL_EVENT_FIRST_TEAM` | All-Event First Team | Star | strong honor |
| `ALL_EVENT_SECOND_TEAM` | All-Event Second Team | Medal | neutral honor |

- 每行首部为 icon + readable award name，随后为 Event 与 award-time Team 的
  label-first context；不使用异常分隔字符。
- notes 非空时作为下一行 supporting copy；`null` 或空白时完全省略 notes region。
- 未知 award type 使用去下划线后的可读文字和 neutral Medal/icon fallback，不丢弃。
- row、Event、Team 均为 plain text，无 link、click、hover、focus、pressed 或 selected。
- 空集合只显示准确文案 `No awards in this scope.`，不渲染空 ruled rows。
- 不复用 Event Detail Black Metal Plaque、MVP card 或 All-Event roster；两者的信息规模
  和产品语义不同。

### 3.10 清理与文档同步

- 删除 TeamCard、TeamProfileSummary、TeamEditorForm 中重复的 initials、Shield
  fallback、hard-coded fallback color 与独立 artwork geometry。
- 删除已被 M3 Pattern 取代的普通 card surface、continuous performance fill、
  Player vertical accent rail 和旧 award row declarations。
- 保留 M2 table/filter/summary/star CSS contract，不借 M3 重写已验收 Data Display。
- 更新 `docs/UI_REDESIGN_READINESS_CHECKLIST.md` 中实际完成并验证的 M3 项目。
- 若实施中需要改变已批准 pattern 或 feature behavior，先回到 PRD 审批，不把 proposal
  lab 直接当作实现 SOT。

## 4. API 调用

本批次不新增或修改 API 调用。

| 页面 / 动作 | 现有调用 | M3 约定 |
|---|---|---|
| Teams Overview load | 现有 Team list API | 保持 division groups、active-only 与 loading/error 行为 |
| Team Detail load | 现有 Team detail API | 直接消费 identity、archive、profile、summary、roster |
| Team Create submit | 现有 Team create API | Identity Proof 不发请求；submit payload 不变 |
| Team Edit load/save/archive/restore | 现有 Team detail/mutation API | preview、surface 与 artwork fallback 不改变请求 |
| Players Overview load/filter/sort/page | 现有 Player list API | leaders 与 rankings 仍由同一响应提供，query 行为不变 |
| Player Detail load/filter/page/retry | 现有 Player detail API | identity、performance、awards、summary、history 同步更新 |

请求约束：

- 不增加 logo probe、image proxy、contrast analysis、preview 或 initials endpoint。
- 不为 Team color、leader hover、Reduced Motion 或 meter segments 增加 query。
- 不改变 Player Detail “最新请求生效”、AbortController、retained content、
  page 归一化或 URL history 行为。
- image `onError` 仅更新 component-local state，不调用 API，不改变 page error。

## 5. UI 规格

### 5.1 Teams Overview

- **Route**：`/teams`。
- **Layout**：保留现有页面 header；下方为纵向 Open Division Stacks，每个 division
  自己拥有 label/rule 与 responsive Team grid。
- **Content**：Team logo/fallback、name、total points、fractional rating。
- **Interactions**：整张 Team Card 导航至 `/teams/:slug`；hover、focus-visible、
  pressed 均由同一 anchor 拥有。
- **States**：
  - loading/页面 error/无 Team 继续使用现有 M1 feedback；
  - logo missing/failed 使用 initials；
  - dark artwork 依靠 Team Identity Surface 提供对比；
  - rating `null` 与 `0` 使用 M2 FractionalStarRating 既有语义；
  - long name 截断但 points 和 rating 不丢失。
- **Responsive**：grid 按可用宽度收敛，窄屏一列；division membership 始终明确。

### 5.2 Team Detail

- **Route**：`/teams/:slug`。
- **Layout**：Back/Manage actions、archived Alert、Unified Field、Team Summary、
  Roster Data Bay 的既有页面顺序不变。
- **Unified Field**：一个 40% Team Identity Surface；leading identity 与 trailing
  five-axis radar 在桌面并列，窄屏按该顺序堆叠。
- **States**：
  - active：Manage Team 可见；
  - archived：Alert 位于 field 外，Manage Team 隐藏；
  - no profile：保留 radar region 并显示明确 copy；
  - missing/failed logo：initials fallback；
  - not found/error/loading：保持现有页面行为和 M1 feedback。
- **Accessibility**：Team name 是页面 `h1`；logo decorative；rating 使用 10 分制
  accessible name；Radar 提供五个 label/value。

### 5.3 Team Create/Edit

- **Routes**：`/teams/new`、`/teams/:slug/manage`。
- **Layout**：Page Header、Editor sections、form controls、Player Management 与 actions
  不变；Identity Proof 位于 Basic Info Editor 的 preview column/Open Well。
- **Interactions**：字段变化实时更新 preview；preview 不可点击、不可聚焦且不提交。
- **States**：empty/partial/complete draft、invalid primary color、missing/failed/new logo、
  zero/partial/full rating、division loading/selection 均保持可读。
- **Validation**：field errors 继续贴近原 control；preview 不隐藏、不替换 error。
- **Responsive**：`900px` 以下字段在前、preview 在后；`560px` 下单列。

### 5.4 Players Overview Leader Cards

- **Route**：`/players`。
- **Layout**：Page Header、四张 Leader Cards、M2 Filter Bar、Rankings Data Bay 与
  Pagination 顺序不变。
- **Content**：四张卡固定 category、value、Player、Team；保持既有格式化。
- **Interactions**：只允许 hover visual feedback；无点击、导航、pressed 或 focus。
- **States**：populated、no eligible、loading continuity、long Player/Team name、
  hover-capable、touch/no-hover、Reduced Motion。
- **Responsive**：wide 四列、intermediate 两列、`760px` 以下一列。

### 5.5 Player Detail

- **Route**：`/players/:slug`。
- **Layout**：Back Link；Number Masthead + Honors Ledger 与 Segmented Performance
  Profile 的 hero；M2 Event Filter、availability Alert、Stat Summary、Match History。
- **Identity states**：active、inactive、current Team active、current Team archived，
  状态可组合且不依赖颜色。
- **Performance states**：0、1–9 partial first segment、ten-boundary、mixed、100；
  `scope.available = false` 时仍按 API 返回值和现有 unavailable page behavior 呈现，
  不自动替换 Overall。
- **Award states**：MVP、First Team、Second Team、多个 Event、notes 有/无、empty、
  historical award-time Team 与未知类型 fallback。
- **Request states**：initial loading、retained-content refresh、refresh error、404、
  retry、event switch、page correction 均保持 Player feature PRD 现状。
- **Responsive**：`980px` 以下 hero 单列；`560px` 下 Number Masthead number first，
  ledger rows 和 facts 可换行，meter 不横向溢出。

### 5.6 Interaction、Motion 与可访问性

- 所有真实 anchor 保留 shared focus-visible；非交互 Leader Card、Identity Proof、
  Radar、Meter 与 Ledger 不伪造 focus/pressed。
- `prefers-reduced-motion: reduce` 下禁用非必要 transition；内容、颜色、边界和静态
  category 区分保持完整。
- hover effect 仅放入 `@media (hover: hover) and (pointer: fine)` 或提供等价保护；
  touch device 不出现 sticky hover。
- Team Card pressed 不使用明显 scale；Leader Card 永远没有 pressed。
- 状态不只依赖颜色：fallback 有 initials，leader 有 category label，Player status
  有文字，Award 有 icon+type，Meter 有 label+value，rating 有精确值。
- supplied logo 不需要被 screen reader 重复朗读；Team name 在相邻内容或 anchor
  accessible name 中提供。
- CSS `color-mix()` 或 data-driven custom property 必须有 semantic fallback；无效 color
  不得导致整块 declaration 失效或文字不可读。

### 5.7 验证矩阵

实施完成后至少验证：

1. style literal check、frontend typecheck、现有 tests（若有）与 production build。
2. `/teams`：多 division、长 Team name、大/深色/透明 logo、broken URL、无 logo、
   `null`/0/partial/10 rating、hover/focus/pressed、560/760/980px。
3. `/teams/:slug`：active、archived、full/no profile、五轴 minimum/mixed/maximum、
   long description、broken logo、narrow identity-before-radar。
4. `/teams/new` 与 manage：空草稿、逐字段编辑、division 切换、invalid/valid color、
   logo URL 从 failed 改为 valid、rating slider、save/cancel/validation 不回归。
5. `/players`：四个真实 leaders、无合格 Player、长名称、四/二/一列、hover-only、
   touch/no-hover 与 Reduced Motion。
6. `/players/:slug`：active/inactive、Team active/archived、0/partial/boundary/100 meter、
   三种 award、notes、empty、historical Team、event switch、refresh error 与 pagination。
7. keyboard-only：Team Card、back/action/filter/table/pagination focus 顺序正常，所有
   display-only Pattern 不进入 tab order。
8. 浏览器 console 无 React、image state、ARIA 或 CSS 错误；页面不产生 whole-page
   horizontal overflow。

## 6. 与 Backend PRD 的接口约定

1. M3 不要求 Backend、Schema、migration、API、validation 或 error code 变更。
2. Team Card 直接使用 list response 的 `slug`、`name`、`logoUrl`、`primaryColor`、
   `overallRating`、`totalPoints`；不补请求 Team detail。
3. Teams Overview 的 division grouping/order 与 active-only 集合完全服从 API；前端
   不重新加入 archived Team。
4. Team Detail 的 archived state 只由 `archivedAt !== null` 决定；不根据颜色、名称、
   roster 或请求失败猜测状态。
5. Radar 只在 `profileRating !== null` 时使用 defense、offense、consistency、
   cohesion、depth；null 显示 unavailable copy，不替换默认数值。
6. Team artwork 使用 `logoUrl`；missing/failed fallback 与 initials 是 local display
   state。`primaryColor` 只驱动局部 trace，不修改图片。
7. Team Editor Identity Proof 只消费当前 `TeamEditorValues` 与已经加载的 divisions；
   preview 不改变 mutation payload，也不新增请求。
8. FractionalStarRating 继续按 M2 直接映射十点制 `overallRating`；`null` 与 `0`
   不合并。
9. Players Overview 直接消费 Backend 固定顺序的四项 `leaders`；前端不重排、补齐
   真实 identity 或计算 leader。
10. `leader.player = null`/`leader.team = null` 使用 feature PRD 的 no-eligible copy；
    不尝试从 rankings 当前页寻找替代者。
11. Player Number Masthead 直接消费 `player.number`、`name`、`position`、
    `team.name`、`team.primaryColor`、`isActive` 和 `team.archivedAt`。
12. Performance Profile 直接消费 `performanceBars[].label/value`，只 clamp 到视觉
    安全范围并生成 segments；不依据 stats 或当前分页重新归一化。
13. Performance value 的业务语义是“relative to current statistics scope leader”；
    可见值不带 `%`，但数据仍是 `0–100` 比例尺度。
14. Honors Ledger 必须使用 `awards[].event` 与 `awards[].team`。后者表示 award-time
    Team，不得用 `player.team` 或 match history Team 覆盖。
15. Awards 使用 API 顺序；前端只做已知 type 的 display/icon mapping，不重排 MVP/
    First/Second，不推导 placement。
16. `notes = null` 或空白只省略 supporting copy；Event/Team identity 不得省略。
17. Player Detail 的 `scope.available`、event options、URL query、latest-request-wins、
    page normalization、retained-content loading 和 error/retry 继续以
    `PlayerStatisticsFrontendPRD.md` 为权威。
18. 若 API 返回现有 contract 之外的状态或 M3 需要新数据，停止对应实施并回到需求确认，
    不在页面代码加入 mock/sentinel 或隐式业务规则。
