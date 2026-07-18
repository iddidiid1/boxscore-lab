# design-proposals/

存放 UI 重设计的**候选方案**，供预览和比较后决策。

这里的内容**不是项目的实际规范**，不影响任何已实施的代码。正式设计规范在 `docs/DESIGN.md`。

---

## 当前状态（2026-07-17）

项目 UI 已完成 token 化准备工作（见 `docs/UI_REDESIGN_READINESS_CHECKLIST.md`），
现行实现为近黑底、薄荷绿主品牌色的 Verge Dark。当前正在
`editorial-scoreboard/` 中进行更大规模的 UI System Lab 实验；在候选系统完整确认前，
实验不会写回正式设计规范或应用代码。

---

## 目录结构

每套方案放在独立子目录下，文件名统一为 `DESIGN.md`（规范）+ `preview.html`（预览）。

```
design-proposals/
  README.md
  editorial-scoreboard/  ← 当前 UI System Lab 候选方向
    README.md         ← 实验工作流与治理规则
    DESIGN.md         ← 候选设计规范
    UI_INVENTORY.md   ← MVP UI 清单与评审状态
    DECISION_LOG.md   ← 逐项确认记录
    color-system-lab.html ← 系统整体颜色探索
    card-ui-preview.html ← 初始 Card UI 探索
  verge-dark-current/  ← 现行基线 playground（见下）
    DESIGN.md      ← docs/DESIGN.md 的当前拷贝
    preview.html   ← 忠实镜像 variables.css 的实时 token
  verge-dark/
    DESIGN.md      ← 方案规范（暗色极）
    preview.html   ← 静态预览，浏览器直接打开
  verge-light/
    DESIGN.md      ← 方案规范（亮色极）
    preview.html   ← 静态预览，浏览器直接打开
```

### editorial-scoreboard/  ← UI System Lab

基于现行 Verge Dark 的候选演进方向：降低统一圆角盒子的存在感，以
**Sports Editorial + Scoreboard + Swiss Data Grid** 建立不同的信息表达语法。
Teams、Events、Matches、数据面板与 Feature Card 不再强制共享同一种卡片结构。

该目录同时记录本轮大规模 UI 重构实验的工作流、UI inventory 和逐项决策。
它仍然是候选方案，不会自动修改 `docs/DESIGN.md`、`variables.css` 或现有页面。
完整候选系统经用户明确批准后，才进入正式设计规范和 PRD 实施流程。

### verge-dark-current/  ← 当前工作区

**现行已实施设计的基线拷贝**，作为逐个重估 token 的 playground。与旧的 `verge-dark/`（早期蓝色主色提案，已过时）不同，这里的 `DESIGN.md` 是 `docs/DESIGN.md` 的当前拷贝，`preview.html` 的 `:root` **逐字镜像** `apps/frontend/src/styles/variables.css`——改这里的一个 token 值即 1:1 对应 app 效果。

预览额外含 **Event Summary Card** 与 **Event Tier Crest（S/A/B/C）** 两个专区，并在底部列出 **7 个待重估的 legacy pre-mint 字面量**（事件卡渐变/分隔线 + tier crest 外壳的 border/sheen/base/shadow）。tier 的 4 个 accent 已对齐薄荷体系，标注为 ✓ KEEP。

### verge-dark/

Verge 2024 风格的**暗色模式**适配。主要特征：近黑画布 `#131313`、薄荷绿 `#3cffd0` 作为发光主色、大圆角（卡片 16px、按钮 24px pill）、Anton 展示字体。气质：**大气夜间模式 / 科技感**。

### verge-light/

Verge 2024 风格的**亮色模式**适配，更接近 The Verge 网站实际呈现。主要特征：白色画布 `#ffffff`、浅灰卡片 `#f5f5f5`、黑色文字、薄荷绿作为点缀色。三种按钮：薄荷底色 pill（主 CTA）、黑色底色 pill（次级操作）、黑底薄荷字 badge（状态标签）。气质：**编辑型运动杂志 / 干净现代**。

`preview.html` 包含与 verge-dark 相同的组件场景，token 对比表额外列出与 verge-dark 的差异。

---

## 工作流程

1. **看预览** — 在浏览器中打开 `preview.html`，检视各组件在新设计下的效果。
2. **做决定** — 对比当前实际运行的 app，决定哪些元素采用、哪些放弃或调整。
3. **新增方案** — 如需对比另一套方案，复制 `preview.html` 为 `preview-v2.html`，修改顶部 `:root` CSS 变量即可（结构无需改动，改动成本低）。
4. **方案确认后** — 将决定写入 `docs/DESIGN.md`，然后按 `docs/WORKFLOW.md` 走需求确认 → PRD → 实施流程。

---

## 与项目其他文档的关系

- `docs/DESIGN.md` — **当前实施中**的 Verge Dark 设计规范（近黑底、薄荷绿主品牌色）
- `docs/UI_REDESIGN_READINESS_CHECKLIST.md` — token 化迁移进度，重设计前置工作
- `docs/WORKFLOW.md` — 功能开发流程，重设计确认后按此执行
