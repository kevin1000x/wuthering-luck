# AGENTS.md

鸣潮运势检测器（Wuthering Waves Fortune Detector）— 纯前端趣味应用：输入游戏 UID，生成确定性的每日运势、模拟三十连抽卡与趋势图。线上部署于 Vercel（wuthering-luck.vercel.app）。

## 技术栈与命令

Next.js 14（App Router）+ React 18 + TypeScript + Tailwind CSS 3.4。图表用 Recharts，图标用 lucide-react，截图分享用 html2canvas。

```bash
npm run dev      # 开发服务器 localhost:3000
npm run build    # 生产构建
npm run lint     # ESLint（extends next/core-web-vitals + next/typescript）
npx tsc --noEmit # 类型检查（没有独立的 typecheck script）
```

无测试框架；不要虚构 test 命令。

## ⚠️ 关键坑点（务必先读）

1. **`next.config.js` 同时忽略了构建期的 TypeScript 错误和 ESLint 错误**。因此 `npm run build` 通过不代表代码正确——改完代码必须手动跑 `npx tsc --noEmit` 和 `npm run lint`。
2. **确定性 RNG 契约**：`lib/dailyLuck.ts` 用 djb2 变体哈希把 `${userId}_${date}_${salt}` 转为种子，再经 LCG 驱动运势分数与抽卡模拟。改哈希函数、salt 字符串、LCG 参数或抽卡常量（保底/概率）都会改变所有老 UID 的历史结果，需确认是否有意为之。
3. **日期统一用本地时区**：全站经 `lib/dailyLuck.ts` 的 `getLocalDateStr()` 生成 YYYY-MM-DD；不要再直接用 `toISOString()` 取日期（那是 UTC，东八区要到早上 8 点才换日）。2026-08-27 由 UTC 改为本地时区，此后种子才按当地日期翻转。
4. **背景图是 `public/bg.webp`（约 120KB）**。原始 7.3MB PNG 已移除（git 历史可寻）；今后新增任何二进制素材必须先压缩再入库。
5. `.next/` 曾被误提交过，现已在 `.gitignore` 中——不要再把构建产物加回版本库。

## 架构边界

```
app/page.tsx        唯一页面，整块 'use client'：UID 输入 + 结果仪表盘 + html2canvas 截图
app/layout.tsx      根布局、字体（Inter/Rajdhani）、SEO metadata
app/globals.css     全局样式：鸣潮深色主题、玻璃拟态、金色光效动画、body 背景（bg.webp）
components/         7 个展示组件，全部 'use client'，从 page.tsx 接 props
lib/dailyLuck.ts    核心纯逻辑：本地日期工具、种子哈希、SeededRNG(LCG)、保底抽卡模拟器、卡池
```

- 所有计算都在浏览器端完成；**默认零后端、不上传数据**。可选的 Supabase 云端同步（魔法链接登录 + watchlist 收藏表，`lib/supabase.ts`/`lib/account.ts`/`components/CloudSync.tsx`，建表脚本 `supabase/schema.sql`）仅在配置了 `NEXT_PUBLIC_SUPABASE_*` 环境变量后启用，未配置时 UI 自动隐藏、行为与纯客户端一致——新增云端功能必须保持这一降级约定。
- 历史运势不落库：`getFortuneForDate` 可按日期确定性推演，任何"历史规律"类需求优先纯计算实现（见 `components/HistoryHeatmap.tsx`）。
- 引入新组件时沿用现有模式：顶部 `'use client'` + 命名导出类型从 `@/lib/dailyLuck` 取。
- 路径别名 `@/*` 映射到仓库根目录。

## 约定

- 文档、UI 文案、代码注释均以简体中文为主；组件文案带游戏化风格和 emoji（如 🌟 大吉）。
- 视觉规范：深色主题、玻璃拟态卡片、金色发光强调色；全局样式集中在 `globals.css`，Tailwind 类内联使用。改配色/布局前先读 `.impeccable.md`（设计上下文与五条设计原则）；运势语义色只用 `ww-gold/ww-mint/ww-amber/ww-danger` 四档，不要引入裸 emerald/orange/red。2026-09-06 重设计后新增 HUD 设计层（`globals.css` 底部）：`hud-panel/corner-brackets/panel/section-head/reveal-in/scanline`——卡内子面板用平色 `.panel` 而非玻璃，玻璃只做顶层容器；金色以"线"而非"面"出现。
- 音频/敏感日志约定不存在；不要往生产代码里加 console.log（仅 ShareCard 有一个 error 日志）。
- **角色名与立绘**：模拟抽卡每日 `DAILY_PULL_COUNT = 70` 抽；角色名来自 `lib/dailyLuck.ts` 的三张卡池（UP 五星 / 常驻五星 / 四星），由独立于保底主随机流的辅助 RNG 分配——调整卡池内容不会改变出货序列。头像按 `public/characters/{slug}.png` 槽位加载（slug 对照表在同文件池定义中），缺图时 UI 自动用稀有度渐变占位，不会破图。

## 下一步方向（2026-08-27 更新）

上一轮工程清理已完成：bg.webp 替代 7MB PNG、构建期 TS/ESLint 把关恢复、日期切本地时区、参考文件与过时文档已删（git 历史可查）、补齐 LICENSE。

产品向待办：
- ~~社交传播最小闭环~~ ✅ 2026-09-07 已完成：URL 分享链接（`?uid=`自动检测、`?compare=`对比）、文字战绩复制、最近 UID 本地记忆（`lib/record.ts`）。
- 历史运势日历热力图（30 天），回答"我这周欧不欧"。
- 英文界面 i18n（鸣潮有全球服受众）。

## 参考资料

抽卡参数（概率/保底/抽数）集中在 `lib/dailyLuck.ts` 常量区，卡池与立绘 slug 同文件；项目背景见 `README.md`。旧版多卡池完整参考实现已于 2026-08-27 删除，需要时从 git 历史（`75fd4f7~1` 之前）找回 `lib/WutheringWavesGacha.reference.ts`。
