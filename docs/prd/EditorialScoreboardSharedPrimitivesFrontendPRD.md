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

## 4. API 调用

## 5. UI 规格

## 6. 与 Backend PRD 的接口约定
