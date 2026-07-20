# Editorial Scoreboard Event Patterns Backend PRD

## 1. 目标

确认 Editorial Scoreboard M4 Event Patterns 是建立在现有 Event Management
数据、API 与业务规则之上的前端视觉和组件迁移，不修改后端、Prisma Schema、
数据库、API 契约或业务行为。通过独立 Backend PRD 锁定边界，避免 Tournament
Insignia、Insignia Rail Event Card、Event Detail 信息层级、Black Metal Plaque
以及 Event 编辑器视觉壳层的实现无意扩展到数据层；Player Awards 选取流程重设计
继续留给后续独立功能 PR。

## 2. 范围

文档权威：

- 本 PRD 只负责确认 M4 没有 Backend 实施范围。
- 本 PRD 补充而不取代 `EventManagementBackendPRD.md`；后者继续作为 Event
  实体、生命周期、参与队伍、Stage/Result Tags、最终结果、Player Awards、
  归档、验证和错误行为的单一事实来源。
- `docs/DESIGN.md` 拥有 M4 Event Patterns 的视觉意图，不改变 Backend contract。
- `EventManagementFrontendPRD.md` 继续拥有现有页面内容、交互流程以及 Player
  Awards 选取行为。

包含（in scope）：

- 继续使用现有 Event list/detail/create/update/archive/outcomes API 和响应结构。
- 继续使用现有 Event Tier `S`、`A`、`B`、`C`，仅在前端映射 Tournament
  Insignia 的视觉语义；不存储颜色、材质、轨道、徽章几何或发光强度。
- 继续由现有 list 响应提供 Event 名称、description、status、参与队伍数与
  Champion summary；现有 detail 响应继续提供 Participants、Stage Tags、
  Result Tags、Final Team Results 和 Player Awards，不新增重复的 Champion
  summary。
- 保留 `PREPARING`、`ONGOING`、`COMPLETED` 生命周期以及 `archivedAt`
  归档语义、现有可编辑/只读边界和历史数据保留规则。
- 保留 Final Team Results 的 API 顺序和 Winner/ResultTag 数据语义。
- 保留 Player Awards 的 API 顺序、奖项类型、award-time Team、Player Position、
  inactive 历史标记、MVP 重复显示规则与空数据行为。
- 保留 Event Outcomes 当前 Player Awards 候选集合、Team 筛选、选择上限、
  互斥约束、inactive 历史数据、校验和提交行为。

不包含（out of scope）：

- Prisma Schema、migration、seed、数据库字段或关系变更。
- 新增、删除或修改 Event API、payload、response、query、validation 或 error code。
- 新增存储型 aggregate、排名、视觉状态、Tier 样式或任何派生统计字段。
- 修改 Event lifecycle、归档/恢复、ResultTag 排序、Champion 推导或 award
  eligibility 规则。
- Player Awards 选取流程重设计，包括 candidate matrix、分阶段流程、新候选池、
  新限制模型、键盘交互模型或新的 frontend state contract。
- Match Patterns、Match Entry、standings、leaderboards 或其他非 Event 功能。

若前端实施发现已批准视觉所需数据不在现有 contract 中，应停止对应实现并返回
需求确认，不得以新增 Backend 字段、mock、sentinel 或隐式推导补齐。

## 3. 业务规则

1. M4 是纯前端视觉迁移；所有 Event 数据和行为继续遵循
   `EventManagementBackendPRD.md`，本 PRD 不引入新的业务能力。
2. Event Tier 仍只允许 `S`、`A`、`B`、`C`。Tournament Insignia 的字母、
   subtitle、颜色、轨道、切面、光效与 scale 均为前端映射，不进入数据库或 API。
3. Event lifecycle 仍只使用 `PREPARING`、`ONGOING`、`COMPLETED`；
   `archivedAt !== null` 独立表示归档，不得新增 `ARCHIVED` status。
4. `/events` 继续只返回现有 active list 集合；M4 不改变 archived Event 的列表
   可见性、排序或筛选规则。
5. list response 的 `champion` 继续由现有 ResultTag/Team Result 规则产生。
   前端只在 Event Summary Card 中于该字段非空时显示 Champion strip；Event
   Detail 通过 Final Team Results Winner row 查阅胜者，不新增或推导 hero
   Champion。
6. Participants、Stage Tags、Result Tags、Team Results 和 Player Awards 的
   集合、顺序与 eligibility 继续由现有响应决定；视觉 reflow 不代表重新排序。
7. Final Team Results 的 Winner 语义继续由 ResultTag `isWinnerTag` 决定；
   Championship Gold 只是该语义的视觉表达。
8. Player Awards 继续只使用 `EVENT_MVP`、`ALL_EVENT_FIRST_TEAM`、
   `ALL_EVENT_SECOND_TEAM`。Black Metal Plaque 不引入新的 award type、rank、
   placement 或 persisted display group。
9. Event Detail Awards 按 API 顺序保留 First/Second Team roster；MVP 可在 roster
   中重复展示，重复时只增加前端 Gold MVP marker，不去重或产生新记录。
10. Award 的 Team 必须是 award-time Team；不得用 Player 当前 Team 覆盖。
    `playerIsActive = false` 的历史 award 必须继续可读。
11. Event Outcomes 当前候选集合、Team filter、每类数量上限、First/Second Team
    互斥、inactive retained award 与提交 payload 均保持不变。
12. `COMPLETED` 与 archived Event 的只读边界保持不变；M4 不通过隐藏样式绕过
    后端状态约束，也不增加新的修正路径。
13. Event Create/Edit 的 `slug`、`rankingOrder` 仍由后端管理，前端不得提交或
    改写；M4 不增加任何存储型 aggregate 或派生统计字段。
14. 缺少可选 description、list Champion、Tags、Results、Second Team 或全部
    Awards 只影响前端区域是否显示，不改变后端 null/空集合 contract。
15. 若实施需要现有响应以外的数据，应先回到 PRD 审批；不得在前端根据名称、
    颜色、DOM 顺序或 placeholder 推导新的业务事实。

## 4. Schema 变更

### 4.1 新增 / 修改字段

无。

| Model | Field | Type | Notes |
|---|---|---|---|
| — | — | — | M4 不修改 Prisma Schema |

### 4.2 迁移说明

- 不创建 Prisma migration。
- 不运行数据 backfill、重排或清理。
- 不存在数据丢失风险。
- 不修改 seed；视觉验证使用现有数据或前端测试 fixture，不写入生产型视觉字段。

## 5. API 规范

本批次不新增或修改 endpoint。Frontend 必须继续调用现有接口：

| 页面 / 动作 | 现有接口 | M4 约定 |
|---|---|---|
| Events Overview load | `GET /api/events` | 保持 active list、排序、loading/error contract |
| Event Detail load | `GET /api/events/:slug` | 直接消费现有完整 EventDetail |
| Event Create submit | `POST /api/events` | payload 与响应不变 |
| Event Edit load/save/status | `GET/PATCH /api/events/:slug` | 配置和 lifecycle 行为不变 |
| Event archive | `POST /api/events/:slug/archive` | 归档语义和响应不变 |
| Results & Awards load | `GET /api/events/:slug` | 继续从同一详情响应初始化 results/awards |
| Results & Awards save | `PATCH /api/events/:slug/outcomes` | payload、validation 与响应不变 |
| Event form Team options | 现有 Team list API | active Team 集合和 retained participant 合并逻辑不变 |

请求约束：

1. 不新增 `tierStyle`、`tierSubtitle`、`insigniaScale`、`championTone`、
   `plaqueMaterial`、`displayRank`、`awardGroup` 或其他视觉字段。
2. 不为卡片 hover、Reduced Motion、responsive layout、skeleton 或 Awards
   plaque 增加请求。
3. Events Overview 不补请求 Event Detail；卡片必须只使用 `EventListItem`。
4. Event Detail 不为 Participants、Tags、Results 或 Awards 拆分额外请求。
5. Event Outcomes 不改变初始化、dirty tracking、save 成功导航或失败保留输入。
6. Abort、retry、404、validation details 与标准错误 shape 继续遵循现有实现和
   Event feature PRD。

## 6. 验证规则

1. M4 不新增后端字段级 validation。
2. Event create/update/outcomes 的所有验证继续由
   `EventManagementBackendPRD.md` 定义，并保持一次收集全部字段错误的行为。
3. Tier、status、participant eligibility、Tag uniqueness/order、Winner Tag、
   lifecycle transition、Result assignment、award eligibility/limit/mutual
   exclusion 和归档限制不得因视觉迁移而改变。
4. 前端视觉层的空值处理不得把缺少可选内容转换成新的请求字段或 sentinel。
5. 实施验证不得通过修改数据库真实规则制造仅供样式使用的状态；需要的场景应
   使用现有合法 fixture 或测试数据。

## 7. 错误码

M4 不新增、删除或修改错误码。所有接口继续返回现有 Event/Team API 错误以及
统一结构：

```json
{
  "statusCode": 422,
  "error": "EXISTING_EVENT_ERROR_CODE",
  "message": "...",
  "details": []
}
```

Frontend 只迁移错误反馈的视觉呈现，不依据 message 文案产生新的业务分支，也不
吞掉现有 field details、not-found、conflict、read-only 或 validation 错误。
