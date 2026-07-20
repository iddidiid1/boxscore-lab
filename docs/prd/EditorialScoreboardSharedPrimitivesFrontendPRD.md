# Editorial Scoreboard Shared Primitives Frontend PRD

## 1. 目标

将已经通过 Gate E2 并在 M0 正式化的 Editorial Scoreboard Foundation 与跨页面 Shared Primitives 实施到前端，使背景、排版、间距、圆角、边框、焦点、动效、表面、操作按钮、链接、表单控件、Badge/Tag、API Health、反馈状态与确认对话框由一致的语义 token、Mantine theme 和小型共享样式/组件控制，为后续 M2–M5 的 Data Display 与 Team、Player、Event、Match 业务 Pattern 迁移建立稳定基础。

本批次只改变已批准的视觉呈现与交互状态表现；保留业务逻辑、API 调用、路由、文案含义、组件放置、内容顺序和现有响应式功能。

## 2. 影响页面与范围

文档权威：

- `docs/DESIGN.md` 是颜色、字体、shape、surface、共享组件状态和已批准
  Product Pattern 视觉的唯一 SOT。
- 本 PRD 只拥有 M1 的实施范围、文件边界、接入方式和验收标准，不复制出
  第二套视觉值。
- `ActionLanguageConsistencyFrontendPRD.md` 继续拥有 action 文案和图标语义；
  本 PRD 拥有这些 action 的 M1 视觉处理。
- Team、Player、Event、Match Frontend PRD 继续拥有各自的功能、内容、路由、
  数据行为与交互流程；其中与当前 `docs/DESIGN.md` 冲突的历史视觉描述不再
  具有权威性。
- `UiRedesignReadinessFrontendPRD.md` 是已完成的历史准备工作，不是当前视觉
  迁移 SOT。
- `docs/PLAYER_AWARDS_COMPONENT_DESIGN.md` 只保留 Player Awards 的内容顺序、
  API ordering 和重复规则；视觉由 `docs/DESIGN.md` 的 Black Metal Plaque
  Pattern 负责，且不属于 M1 实施范围。

包含：

- 应用级 Foundation：
  - Neutral Ambient Canvas；
  - Anton、Space Grotesk、JetBrains Mono 字体角色；
  - `4/8/10/12px` shape hierarchy；
  - subtle/structural/hover borders；
  - 2px Brand focus-visible ring 与 3px offset；
  - `100/160/220ms` functional motion 和 Reduced Motion；
  - 已正式化的 spacing、control-height 与文本/状态 token。
- 共享 Surface primitive：
  - Editor 的 Editorial Outline；
  - Data/Summary 可消费的 edge-highlight Dark Glass 基础材料；
  - Open Well inset；
  - Overlay/Raised Dark Glass；
  - Team Identity Deep Light Glass 只提供受限 primitive，不在 M1 重构具体 Team Card。
- 共享 Action 与 Link primitive：
  - Large Primary、Cancel/Exit、Destructive、Related Workflow；
  - Medium Context、Small Edit、Small Destructive、Order Icon；
  - Detail Back Link 和 Inline Text Link；
  - Default、Hover、Focus-visible、Pressed、Disabled、Loading，以及真实存在时的 Selected。
- 共享 Form primitive：
  - TextInput、Textarea、Select、NumberInput、Checkbox、Rating Slider；
  - 40px regular、34px dense Number Input、18px Filled Checkbox、34px Slider；
  - label、helper、placeholder、validation、disabled 和 focus-visible；
  - 原生 Date/Time 行为保持不变，只对其外壳做兼容的共享视觉对齐。
- 共享 compact/status primitive：
  - Neutral Gradient Edge Plate 基础 Badge/Tag；
  - Open Marker 受限变体；
  - Online、Checking、Offline API Health 状态。
- 共享 feedback primitive：
  - Edge Signal Alert/Banner；
  - Open Content Empty State；
  - labeled Loading Indicator；
  - shape-preserving Skeleton 及静态 Reduced Motion；
  - Error/Retry；
  - Raised Dark Glass Confirmation Dialog 与 trailing action pair。
- 对现有页面中上述 primitive 的真实用法进行必要接入，范围覆盖 Teams、Players、Events、Matches 的 Overview、Detail 与 Create/Edit 页面，但只修改共享视觉接入，不重组页面内容。
- 更新 `docs/UI_REDESIGN_READINESS_CHECKLIST.md` 中与本批实际完成内容相符的项目。
- 运行 style literal check、typecheck、production build，并验证键盘焦点、Reduced Motion、touch/no-hover 以及 560/760/980px 边界下的共享 primitive。

不包含：

- M2 Data Display：
  - Data Bay 表格完整视觉迁移；
  - sortable header、row hover、local overflow；
  - Pagination；
  - Operational Neutral Other row；
  - Championship Gold Winner row；
  - Ruled Grid Summary、Stat Value、fractional Star Rating；
  - Filter Bar 组合布局。
- M3 Team/Player Pattern：
  - Open Division Stacks、Score Ledger Team Cards、Unified Field、Identity Proof；
  - Frosted Depth Leader Cards、Number Masthead、Segmented Performance Profile、Honors Ledger。
- M4 Event Pattern：
  - Tournament Insignia、Insignia Rail、Participants/Tags 页面构图、Black Metal Plaque。
- M5 Match Pattern：
  - Scoreline Rail、Arena Scoreline、Match Editor 页面构图。
- Sidebar Shell、Sidebar Brand Header或 Main Content Shell 的结构重设计；只允许其既有控件消费 M1 token/state。
- 改变页面布局、组件位置、内容顺序、路由、导航结构或业务文案含义。
- 改变 DOM 语义或交互流程；为接入可访问状态所需的非行为性 attribute/className 除外。
- 改变 API、数据模型、业务规则、统计计算或持久化。
- Event Player Awards 选取功能重设计。
- 新增组件库、建立独立设计系统 package 或文档站。
- Light mode。

## 3. 组件变更

### 3.1 实施原则与所有权

M1 采用“语义 token + Mantine theme + 小型共享 primitive + 真实用法接入”的方式，
不创建新的组件库或第二套主题。

- `apps/frontend/src/styles/variables.css`
  继续是 CSS token 的 canonical entry point；仅在现有语义角色确实缺失时补 token。
- `apps/frontend/src/app/theme.ts`
  负责 Mantine 的字体、基础 shape、control state 和可稳定统一的 component defaults，
  并与 CSS token 保持同一含义。
- `apps/frontend/src/styles/global.css`
  负责应用 canvas、全局排版、共享焦点/动效、基础链接和既有 Sidebar 控件的 token 接入；
  不改变 App Shell、Sidebar 或 Main Content 的 DOM 与布局结构。
- `apps/frontend/src/styles/primitives.css`
  负责 surface、form、compact status 和 feedback 的共享样式。现有 `.app-panel`
  暂时保留为兼容基底，不把所有消费场景强制改成同一种 card。
- `apps/frontend/src/shared/components/action-buttons.css`
  负责完整 action family 和状态矩阵。
- 页面/feature CSS 只保留布局、间距、响应式和真正局部的 Pattern 表现；
  不复制按钮、表单、surface、状态色或 focus ring 的完整视觉处理。

迁移应优先给现有 Mantine 组件添加语义 `className`/`classNames` 或共享 modifier。
只有在两个以上真实用法需要一致的 DOM/行为时才提取 React wrapper，禁止为未来场景
预建 speculative abstraction。

### 3.2 Surface primitive

在共享样式中提供可组合的语义 surface：

| Primitive | 用途 | M1 接入边界 |
|---|---|---|
| Editor / Editorial Outline | Create/Edit 表单的主要编辑区域 | 接入现有 editor 外层；不重排字段 |
| Data / Dark Glass | 后续 Data Bay 的材料基础 | 提供 modifier；M1 不改表格构图 |
| Summary / Dark Glass | 后续 Summary Pattern 的材料基础 | 提供 modifier；M1 不改业务 summary |
| Inset / Open Well | editor 或 overlay 内的次级输入区域 | 只替换真实 inset 用法，不制造嵌套 card |
| Overlay / Raised Dark Glass | Confirmation Dialog 等真实浮层 | 接入共享确认框 |
| Team Identity / Deep Light Glass | 含潜在深色 logo 的 Team identity 场景 | 只提供受限 modifier；M3 才迁移 Team Card |

建议采用显式语义 modifier（例如 editor、data、summary、inset、overlay、identity），
而不是通过页面名或当前色值命名。`.app-panel` 在 M1 不能被整体替换成 Dark Glass，
因为其当前同时承载 M2/M3 尚未批准实施的表格与业务 Pattern。

### 3.3 Action 与 Link 接入

现有 `primary`、`secondary`、`danger`、`quiet` 是不充分的视觉分类。M1 应将真实用法
映射到批准的语义角色，并在本批结束前消除页面对含糊角色的新增依赖：

| 语义角色 | 典型真实用法 | 高度/密度 |
|---|---|---|
| Large Primary | Create、Save Changes、Save Outcomes、整页 Edit/Manage | 42px |
| Cancel/Exit | Create/Edit 页 Cancel、确认框 Cancel | 40px |
| Destructive | Archive、Void、Delete、Remove | 40px；危险语义 |
| Related Workflow | Manage Results & Awards | 40px；Brand outline，不新增语义色 |
| Medium Context | Add Player、Add Tag、section-level action | 30px |
| Small Edit | roster/tag/item 的 Edit | 28px |
| Small Destructive | roster/tag/item 的 Remove/Delete | 28px |
| Order Icon | Result Tag 上移/下移 | 28px 方形 icon control |

- legacy class 可以在同一迁移批次内作为短期 alias，但验收前真实调用应改用语义角色。
- 所有 action 必须覆盖 Default、Hover、Focus-visible、Pressed、Disabled；
  发起异步操作的 action 还必须覆盖 Loading。
- Selected 只用于分页当前页、当前筛选等真实持久选择，不给普通 command button
  添加伪 selected 状态。
- `ActionLanguageConsistencyFrontendPRD.md` 中尚未落地的批准文案与图标规则在本次
  action 接入时同步收敛，包括 `Save Outcomes`、具体 destructive confirm label
  和标准 Detail Back Link；这属于既有 SOT 一致性修正，不改变业务含义。
- Detail Back Link 使用可访问的链接语义、Brand directional icon 和 neutral text；
  Inline Text Link 始终保留低对比 underline，不能只靠颜色或 hover 表示可点击。

### 3.4 Form primitive

统一现有 `TextInput`、`Textarea`、`Select`、`NumberInput`、`Checkbox` 和 `Slider`
的 Mantine 接入；Event 表单、Event Outcomes、Team editor、Match editor 和各筛选区
必须消费同一基础 primitive。

- regular control 为 40px；数据录入表内 NumberInput 使用 34px dense variant。
- Checkbox 为 18px Filled control，checked 使用 solid Brand，同时保留 check glyph。
- Slider 使用 34px control area、solid thumb，并保持键盘操作与现有数值逻辑。
- NumberInput 保留可见上下 stepper；不得以视觉迁移为由改变 min/max/step。
- native Date/Time 的输入、选择器和提交值保持原生；只统一外层视觉与焦点状态。
- label、required、description/helper、placeholder、validation message、disabled
  必须由共享状态负责。错误不能只靠边框颜色表达。
- Filter Select 与 Editor Select 共用 control primitive；Filter Bar 的整体容器和布局
  属于 M2，不在本批重构。

优先通过 Mantine `classNames`/theme bridge 统一稳定部位；dense、danger、inset 等
上下文差异使用显式 modifier，不能用脆弱的 DOM 层级选择器推断业务语义。

### 3.5 Feedback、状态与确认框

- `ListEmptyState` 从嵌套 boxed card 改为 owning module 内的 Open Content；
  保留原有 title 与 description API，具体 action 继续由 owning module 提供。
- `PagePlaceholder`、Loader、Skeleton、Alert 和真实 error state 接入共享反馈语言；
  不为没有 retry handler 的页面伪造 Retry。
- Skeleton 必须保持目标内容形状；Reduced Motion 下静止，不 pulse。
- API Health 继续显示 Online、Checking、Offline 明文。Checking 可使用 spinner form，
  但 Reduced Motion 下静止；组件应提供适当的 `role="status"`/live semantics，
  不改变 polling 与判定逻辑。
- `ConfirmModal` 接入 Raised Dark Glass、内部错误位置和 trailing action pair。
  提交期间 cancel 与 confirm 均 disabled；Archive/Void/Delete/Discard 使用 Danger，
  Restore 使用普通重要 action 和高对比 return icon。
- 若当前调用方没有 modal 内错误数据，本批只为既有错误提供可显示位置，
  不重写 mutation/error flow。

### 3.6 预计修改文件

核心共享文件：

- `apps/frontend/src/styles/variables.css`
- `apps/frontend/src/styles/global.css`
- `apps/frontend/src/styles/primitives.css`
- `apps/frontend/src/app/theme.ts`
- `apps/frontend/src/shared/components/action-buttons.css`
- `apps/frontend/src/shared/components/ConfirmModal.tsx` 及其共享样式
- `apps/frontend/src/shared/components/ListEmptyState.tsx`
- `apps/frontend/src/shared/components/ListEmptyState.css`
- `apps/frontend/src/shared/components/PagePlaceholder.tsx`
- `apps/frontend/src/shared/components/navigation/ApiHealthCheckBox.tsx`

Teams、Players、Events、Matches 下的页面与 feature 文件，只在以下情况修改：

- 将现有 action 映射到明确语义角色；
- 给真实表单/反馈/surface 用法添加共享 class 或 Mantine bridge；
- 移除被共享 primitive 取代的重复视觉声明；
- 落地已批准的 action copy/icon consistency；
- 添加 focus、status 或 validation 所需的非行为性可访问属性。

不得借此重排页面、改造业务卡片、实现 M2–M5 Pattern，或清理与本批无关的代码。

## 4. API 调用

无 API 调用变更。

- endpoint、method、payload、response shape、query key 和 mutation flow 保持不变。
- 不增加仅用于视觉呈现的请求。
- API Health 保持现有请求、polling、初始 checking 和 online/offline 判定方式。
- Loading、Disabled、Error、Retry 只能绑定现有请求状态或现有 handler。
- M1 不改变 refresh failure 时缓存数据的生命周期；共享反馈样式只呈现既有状态。

## 5. UI 规格

### 5.1 Foundation

- Canvas、文字、Brand、status、border、surface、shadow、spacing、radius、font 和 motion
  均消费 `variables.css` 的语义 token；不得在新增/修改的 page CSS 内硬编码同类值。
- 应用背景使用 Neutral Ambient；不得引入 Light mode 或大面积 Brand glow。
- Display、UI、Data 字体角色分别遵守 `docs/DESIGN.md`，不按页面自行指定字体。
- shape hierarchy 固定为 `4/8/10/12px` 对应 approved role；action 与 form 以 precise
  4px 为主，不回到通用 pill 或过度圆角。
- 普通 surface 不使用 generic card drop shadow；只有真实 overlay 可消费 overlay shadow。

### 5.2 Border、focus 与 motion

- structural border 与 hover edge 必须具有可见但克制的层级；Dark Glass 采用
  edge highlight，不使用完整发亮描边。
- 所有键盘可交互元素使用 2px Brand focus-visible ring 与 3px offset。
  Focus 必须强于 hover，且不能被父容器裁切。
- Hover 与 Pressed 不得造成布局位移；touch/no-hover 设备不能依赖 hover 才能发现操作。
- 功能动效只使用已批准的 100/160/220ms 与共享 easing。
- `prefers-reduced-motion: reduce` 下移除非必要 transition、checking rotation、
  skeleton pulse 和其他连续动效，但立即显示最终状态；不得通过隐藏焦点或状态变化实现。

### 5.3 Action 状态矩阵

| 状态 | 验收要求 |
|---|---|
| Default | 角色、层级和可点击范围清楚；Medium/Small 不得被通用 padding 放大 |
| Hover | edge/fill/text 有克制反馈，不位移、不把 outline 变成新颜色体系 |
| Focus-visible | 共享 Brand ring，不能只复用 hover |
| Pressed | 比 hover 更明确且即时；使用 `:active`/真实 pressed state |
| Disabled | 文字、边框、fill 一并降级，保持可读且不可误认成 loading |
| Loading | 保留按钮宽度和业务 label 上下文；阻止重复提交 |
| Selected | 仅真实 selection；除颜色外还需 rail、fill、文字或其他稳定信号 |

Danger 在近黑背景上必须保持图标和文字可判别；Restore 不能消费 Danger。
Related Workflow 只使用 Brand-derived outline，不新增 Manage Results 专属色。

### 5.4 Form 状态矩阵

| 状态 | 验收要求 |
|---|---|
| Default | near-black field、清楚的 label、可读 placeholder |
| Hover | neutral edge 增强，不改变尺寸 |
| Focus-visible | 共享 focus ring；label 与输入关联 |
| Filled/Checked | 值、check glyph 或 thumb 清楚，不能只靠 Brand 色 |
| Validation | associated message + semantic icon/文本；必要时设置 `aria-invalid` |
| Disabled | label、value、control 和 stepper 一致降级，仍可读 |
| Read-only（真实存在时） | 与 disabled 可区分，不暗示可编辑 |

Select dropdown、NumberInput stepper、Checkbox glyph 和 Slider thumb 在键盘、
鼠标与触控下都必须保持 Mantine 既有交互能力。

### 5.5 Surface、compact status 与 feedback

- Editor、Data/Summary、Inset、Overlay、Team Identity 必须通过显式语义 modifier
  选择；禁止根据背景色猜测角色。
- Neutral Gradient Edge Plate 与 Open Marker 只提供 M1 基础，不在本批替换
  Event/Match 的业务 Tag composition。
- API Health 的状态同时通过文字与 marker 表达；Offline 不能只显示低对比红点。
- Alert 使用 leading edge、语义 icon、title/body 和可选批准 action。
- Empty State 不放入新的 dashed/nested card。
- Loading 必须有可理解的 label；Skeleton 只用于能够保持目标几何的加载场景。
- Error/Retry 保持原模块位置；有旧成功内容时不得因为视觉迁移主动清空。
- Confirmation Dialog 的 heading、body、error 和 action pair 在 560px 下仍按阅读顺序
  可用，焦点管理与 Escape/close 行为保持 Mantine 既有语义。

### 5.6 Responsive 与可访问性

- 在 `≤560px`、`≤760px`、`≤980px` 检查共享 primitive；本批只允许必要的 reflow、
  wrap 和 action stacking，不改变现有页面信息架构。
- 760px 以下 Functional Page Header 的既有堆叠行为保持；Sidebar 响应式结构不重做。
- 最小触控目标不能因视觉上缩小 Medium/Small button 而丢失可操作性；必要时使用
  外部 hit area，但可见几何仍遵守批准密度。
- 颜色不是唯一语义；status、selection、validation、winner/danger 均需要文字、
  icon、shape 或稳定结构信号。
- 所有 icon-only control 有可访问名称；decorative icon 对辅助技术隐藏。
- Detail Back Link、Inline Text Link 和 button 保持正确原生语义，不用点击 `div`
  模拟交互。

### 5.7 验收与验证

实现完成后至少执行：

1. frontend style literal check；
2. frontend typecheck；
3. frontend production build；
4. 键盘巡检：Tab 顺序、focus-visible、Select/Checkbox/Slider/NumberInput、Modal；
5. 状态巡检：Hover、Pressed、Disabled、Loading、真实 Selected、validation、API Health；
6. `prefers-reduced-motion: reduce` 巡检；
7. touch/no-hover 与 560/760/980px 边界巡检；
8. 对比迁移前后，确认业务逻辑、API 请求、路由、字段顺序、内容顺序和页面布局未改变；
9. 更新 `docs/UI_REDESIGN_READINESS_CHECKLIST.md`，只勾选实际验证通过的项目。

M1 完成的判定是共享 primitive 已真实接入且状态完整，不是所有业务页面已经呈现
M2–M5 的最终视觉。任何超出本 PRD 的 Pattern 仍留在后续 milestone。

## 6. 与 Backend PRD 的接口约定

- 本 PRD 与 `EditorialScoreboardSharedPrimitivesBackendPRD.md` 共同确认 M1 为
  frontend-only migration。
- 前端不得要求新增字段来区分 surface、button variant、motion preference 或反馈状态。
- 所有业务数据与错误继续遵守对应 Team、Player、Event、Match Backend PRD。
- API Health 的三态来自既有请求生命周期；Reduced Motion 只影响动画，不影响判定。
- 若实现中发现现有 contract 无法支持批准状态，必须停止该项并开启新的需求/PRD，
  不得在 M1 内隐式修改后端。
