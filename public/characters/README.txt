角色图片投放说明 / Character Image Drop-in Guide
================================================

抽卡结果卡片会按以下路径加载角色立绘：

    public/characters/{slug}.png

例如：public/characters/jinhsi.png 显示今汐。

slug 对照表见 lib/dailyLuck.ts 中的 UP_FIVE_STAR_POOL /
OFF_BANNER_FIVE_STAR_POOL / FOUR_STAR_POOL（键为中文角色名，
值为文件名 slug）。

要求：
- 建议 240x320 以上的竖版 PNG，人物头部居中偏上
  （CSS 使用 object-cover object-top 裁切）
- 图片仅在本地渲染，不会上传到任何服务器
- 未提供图片时自动使用渐变占位头像（名字首字），不会报错

注意：请自行确认图片素材的使用许可（游戏美术版权归库洛游戏所有）。
