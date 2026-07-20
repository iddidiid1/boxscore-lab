# Editorial Scoreboard Shared Primitives Backend PRD

## 1. 目标

确认 Editorial Scoreboard M1 Foundation and Shared Primitives 是纯前端视觉系统迁移，不需要后端、Prisma Schema、数据库、API 契约、业务规则或错误响应发生任何变化；通过独立 Backend PRD 明确该边界，防止视觉实现过程中无意扩大到数据或业务层。

## 2. 范围

文档权威：

- 本 PRD 只负责确认 M1 没有 Backend 实施范围。
- 既有 Team、Player、Event、Match Backend PRD 继续分别作为其业务规则、
  API、验证与错误行为的 SOT。
- 本 PRD 不覆盖或重述既有 Backend feature contract。

包含：

- 记录本批次不需要后端实施。
- 保持所有现有 API endpoint、请求 payload、响应结构、错误码和请求时机不变。
- 保持所有 Team、Player、Event、Match、统计计算、归档、作废与恢复规则不变。
- 若前端迁移发现现有数据不足以支持某个新状态，停止该状态的实现并另行进入需求确认流程。

不包含：

- Prisma Schema 或数据库迁移。
- 新增、删除或修改 API endpoint。
- 修改验证、错误响应、序列化或业务逻辑。
- 新增存储字段、聚合字段或计算统计。
- 为视觉效果新增后端配置或持久化状态。
- Event Player Awards 选取逻辑重设计。

## 3. 业务规则

## 4. Schema 变更

## 5. API 规范

## 6. 验证规则

## 7. 错误码
