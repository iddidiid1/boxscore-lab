# Editorial Scoreboard Match Patterns Backend PRD

> 阶段定义：本 PRD 属于 [Editorial Scoreboard 迁移 PRD 索引](./EditorialScoreboardMigrationIndex.md)
> 的 **M5 — Match Patterns**。

## 1. 目标

确认 Editorial Scoreboard M5 Match Patterns 是建立在现有 Match Management 数据、
API 与业务规则之上的前端视觉和组件迁移，不修改后端、Prisma Schema、数据库、API
契约或业务行为。通过独立 Backend PRD 锁定边界，防止 Scoreline Rail、Arena
Scoreline、Match Detail Data Bays 与 Match Editor 视觉组合的实施无意引入存储型比分、
展示状态、额外统计或新的 Match 生命周期规则。

## 2. 范围

文档权威：

- 本 PRD 只负责确认 M5 没有 Backend 实施范围。
- 本 PRD 补充而不取代 `MatchManagementBackendPRD.md`；后者继续作为 Match
  实体、统计快照、比分计算、筛选、表单选项、Void/Restore、验证和错误行为的 SOT。
- `MatchManagementFrontendPRD.md` 继续拥有现有页面能力、数据录入语义、请求状态、
  路由与交互流程。
- `docs/DESIGN.md` 拥有 M5 Match Patterns 的视觉意图，不改变 Backend contract。
- M1 Shared Primitives 与 M2 Data Display PRD 拥有共享 action、form、feedback、
  Data Bay、table、row state 与 pagination 契约；M5 只组合这些已批准角色。

包含：

- 继续使用现有 Match list、form-options、detail、create、update、void 与 restore API，
  不改变请求时机、参数或响应结构。
- Scoreline Rail 直接使用 list 响应已有的 Event、可选 Stage、比赛时间、HOME/AWAY
  Team identity、Team color、logo URL 与 API 计算比分。
- Arena Scoreline 直接使用 detail 响应已有的 Event、可选 Stage、比赛时间、
  HOME/AWAY Team、比分、Match voided state 与 Event availability。
- Match Detail 两个 Team Data Bays 继续使用 API 返回的 Player stats、Other stats、
  百分比、rating 与后端既定 Player 顺序。
- Match Create/Edit 继续使用现有 eligible Events、Stage Tags、participant Teams、
  active roster 与历史 inactive Player 数据；Team score 继续由当前 Player points 与
  Other points 在前端即时预览。
- HOME/AWAY 胜负、只用于防御性渲染的相同比分、缺少 Stage、loaded/missing/failed
  logo、Void/Restore、archived/deleted Event 与 dense table overflow 均只影响前端呈现。
- 若批准的视觉状态无法由现有 response、props 或 request state 可靠推导，应暂停该状态
  并重新进入需求确认，不在 M5 隐式增加字段、sentinel、mock 或业务推断。

不包含：

- Prisma Schema、migration、seed、数据库字段、关系、回填或清理。
- 新增、删除或修改 Match API、payload、response、query、validation 或 error code。
- 存储比分、胜者、百分比、aggregate、logo fallback、视觉状态或响应式布局结果。
- 修改 Match list 可见性、Event/Team/Stage 筛选、分页、排序或 form-options eligibility。
- 修改 HOME/AWAY、Player appeared、Other stats、统计输入、比分计算、平局限制、
  Void/Restore、历史只读或 archived Team roster 规则。
- 比赛节次、加时、实时比分、赛程、比赛时钟、Result Tags、awards 或其他新 Match 能力。
- 新页面、新路由，或 Team、Player、Event 管理逻辑变更。
- M1–M4 已验收 Pattern 的重新设计，或 M6 全局一致性清理。

## 3. 业务规则

M5 不新增或修改业务规则。实施期间必须保持：

1. Match 继续只保存最终原始记录；最终比分、命中率、均值、总计和排行榜均按现有
   Backend PRD 派生，不增加持久化字段。
2. 每个 Match 继续恰好包含 `HOME` 与 `AWAY` 两个 Team。Scoreline Rail 与 Arena
   Scoreline 的左右位置只映射该 role，不根据胜负、名称或颜色交换顺序。
3. Team score 继续等于该 Team 全部 `MatchPlayerStat.points` 加
   `MatchTeamOtherStat.points`。list/detail 使用 API score；editor 的即时 score 只是
   同一公式的前端预览，不提交独立 score。
4. 两队最终比分不得相同。若历史、并发或异常响应出现相同比分，前端允许稳定展示双方
   同级状态，但这不改变 create/update 的 `MATCH_SCORE_TIED` 规则。
5. Scoreline Rail 的 Winner 只通过比较 list 响应的两个 score 得出，不增加
   `winnerTeamId`、`winnerRole` 或 persisted Match status。
6. `stageTagId` 继续可为 `null`；非空时必须属于 Match Event。列表省略缺失 Stage、
   详情显示 `—` 都只是呈现差异。
7. Match list 继续只包含 `voidedAt = null` 且 Event 未归档、未删除的记录，并按
   `playedAt DESC, id DESC` 排序；M5 不增加历史或作废筛选入口。
8. list filter options、Event/Team/Stage 联动、服务器分页与 query validation 均保持
   `MatchManagementBackendPRD.md` 的现有契约。
9. Match detail 继续可按 ID 读取 voided Match 以及 archived/deleted Event 下的历史
   Match；是否可编辑、作废或恢复由现有 Match 与 Event 状态共同决定。
10. Void 继续只写入 `voidedAt` 并从所有统计中排除该 Match；Restore 继续重新验证
    Event、participants 与 StageTag，不因 Team 仅 archived 或历史 Player inactive
    自动失败。
11. detail 中 `teams` 始终按 `HOME`、`AWAY` 返回；Player stats 继续使用既定 position、
    jersey number、name 与 id 稳定顺序，前端不得因 table 视觉重排二次排序。
12. Other stats 继续是每队必需的完整原始统计；Operational Neutral 只表达特殊录入行，
    不代表 warning、error、selected、winner 或新的数据类型。
13. create/edit 继续要求每队至少一名 Player stat，且 Player、Team、Event、StageTag
    关联、数值范围、made/attempted、playedAt 与 archived Team roster 规则不变。
14. Team logo URL、primary color、derived initials、artwork load failure 与 Team-color
    trace 只用于前端显示，不写回 Match、Team 或任何视觉配置字段。
15. Match 不新增比赛节次、加时、赛程、实时状态、Result Tags、awards、重复检测或
    idempotency 语义。

## 4. Schema 变更

### 4.1 新增 / 修改字段

无。

| Model | Field | Type | Notes |
|---|---|---|---|
| — | — | — | M5 不修改 Prisma Schema |

### 4.2 迁移说明

- 不创建 Prisma migration，不执行数据 backfill、重排、清理或 seed 变更。
- 不修改既有 `Match.voidedAt`、`MatchPlayerStat.rating`、Match/Team/Player 关系或索引。
- 不存储 score、winner、percentage、display order、artwork fallback、surface、
  responsive state 或其他视觉派生值。
- 视觉验证使用现有合法数据或前端 fixture，不通过修改数据库规则制造仅供样式使用的状态。

## 5. API 规范

M5 不新增或修改 endpoint。Frontend 继续调用：

| 页面 / 动作 | 现有接口 | M5 保持约定 |
|---|---|---|
| Matches Overview load | `GET /api/matches?page=&pageSize=&eventId=&teamId=&stageTagId=` | 保持 items、filter options、pagination、active-only 范围和排序 |
| Match form Event options | `GET /api/matches/form-options` | 保持 eligible Event 集合 |
| Selected Event options | `GET /api/matches/form-options?eventId=:id` | 保持 participants、Stage Tags 与 active rosters |
| Match Detail / Edit load | `GET /api/matches/:id` | 保持 direct-read、HOME/AWAY、score、stats、voided 与 Event availability 字段 |
| Match Create | `POST /api/matches` | payload、validation、transaction 与 response 不变 |
| Match Edit | `PATCH /api/matches/:id` | 完整统计快照、Team/role immutable 与 response 不变 |
| Match Void | `POST /api/matches/:id/void` | 无 body；只更新 `voidedAt` |
| Match Restore | `POST /api/matches/:id/restore` | 无 body；现有恢复校验与 details 不变 |

请求与响应边界：

1. 不新增 `winner`、`winnerTeamId`、`displayStatus`、`scoreTone`、`artworkState`、
   `stagePlaceholder`、`teamTrace`、`periods` 或其他视觉/未来功能字段。
2. list card 只能使用 `MatchListItem` 已有数据，不为 artwork、hover、skeleton 或
   Winner marker 补请求 detail。
3. Match Detail 的 Arena Scoreline 与两个 box-score bays 使用同一次 detail response，
   不拆分额外 score、Team、stats 或 status 请求。
4. Create/Edit 的实时比分、percentage 与 row state 不触发请求；只在现有保存动作提交
   完整 payload。
5. retained-data refresh feedback 只改变前端已有数据的呈现，不修改缓存 header、
   pagination response、retry endpoint 或服务器错误语义。
6. 所有日期继续以 ISO 8601 UTC 传输；列表与详情的本地化格式以及 editor 原生控件值
   只在前端转换。
7. Abort、retry、not-found、validation details 与标准错误 shape 继续遵守现有实现和
   Match feature PRD。

## 6. 验证规则

1. M5 不新增后端字段级、关联级或业务级 validation。
2. list query 的正整数 id、Stage 依赖 Event、page/pageSize 与 filter 归属规则保持不变。
3. create/update 的已知字段、完整 HOME/AWAY snapshot、每队非空 Player stats、
   Other stats、数值范围、rating precision、made/attempted 与 Player 唯一性保持不变。
4. `playedAt` 继续要求明确时区、可解析且不得晚于服务端收请求时间。
5. Event availability、participant Team、StageTag 归属、Player roster、archived Team
   edit 限制、Team/role immutable 与 Void/Restore validation 保持不变。
6. 两队计算 score 相同继续返回 `MATCH_SCORE_TIED`；前端的 equal-score 防御性样式
   不得被用作放宽验证的依据。
7. Logo 缺失/失败、Stage 缺失、长文字、窄屏、table overflow、hover 或 Reduced
   Motion 不进入后端 validation。
8. 若视觉实施发现 contract 缺少必要业务数据，应先回到 PRD 审批，不得用 response
   message、DOM 顺序、Team name/color 或 placeholder 猜测业务事实。

## 7. 错误码

M5 不新增、删除、重命名或重新分类错误码。所有接口继续返回统一结构：

```json
{
  "statusCode": 422,
  "error": "EXISTING_MATCH_ERROR_CODE",
  "message": "...",
  "details": [
    {
      "field": "form",
      "message": "..."
    }
  ]
}
```

必须保留的主要错误路径：

| 场景 | 现有错误 |
|---|---|
| 请求结构、id、query、数值或日期非法 | `VALIDATION_ERROR` |
| Match 不存在 | `MATCH_NOT_FOUND` |
| Event/Team/StageTag/Player 不存在、不可用或归属不符 | 现有对应 feature error |
| PATCH 更换 Team 或 role | `MATCH_TEAM_IMMUTABLE` |
| 两队最终比分相同 | `MATCH_SCORE_TIED` |
| 编辑已作废 Match | `MATCH_VOIDED` |
| 重复作废 / 恢复未作废 Match | `MATCH_ALREADY_VOIDED` / `MATCH_NOT_VOIDED` |
| Restore 条件不满足 | `MATCH_RESTORE_NOT_ALLOWED` |

Frontend 只迁移这些错误的视觉呈现，不根据 `message` 文案创造新的状态分支，不吞掉
`details`，也不把 Restore 的 `event`、`teams[n].teamId` 或 `stageTagId` details
伪装成详情页可编辑字段。
