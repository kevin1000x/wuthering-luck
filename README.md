# 🌊 鸣潮运势检测器 | Wuthering Waves Fortune Detector

[English](#english) | [中文](#中文)

<div id="中文"></div>

## 📖 项目简介

鸣潮运势检测器是一个基于 Next.js 开发的趣味应用，为《鸣潮》游戏玩家提供每日运势预测、模拟抽卡和数据分析功能。通过输入游戏 UID，系统会生成确定性的每日运势报告，包括运势分数、幸运属性、模拟抽卡结果以及未来运势趋势预测。

🌐 **在线演示**: [https://wuthering-luck.vercel.app](https://wuthering-luck.vercel.app)

## ✨ 功能特性

### 🎯 核心功能
- **每日运势检测**: 基于 UID 和日期生成确定性运势分数（0-100）
- **幸运属性推荐**: 为每日推荐最幸运的元素属性（热熔、衍射、气动、冷凝、导电、湮灭）
- **模拟抽卡**: 30 连抽卡模拟，展示可能的抽卡结果（不消耗真实资源）
- **运势趋势图**: 显示过去 2 天、今天和未来 4 天的运势走势
- **ROI 分析**: 根据运势分数评估今日抽卡的投资回报率建议

### 🎨 界面特色
- 深色主题配合游戏《鸣潮》风格
- 玻璃拟态设计 (Glassmorphism)
- 流畅的动画效果和金色发光特效
- 响应式设计，支持移动端和桌面端
- 支持截图分享功能

### 🔬 技术实现
- **确定性随机数生成**: 使用 LCG（线性同余生成器）算法确保同一 UID 同一天的结果完全一致
- **哈希种子**: 使用 djb2 变体哈希算法将 UID+日期转换为数字种子
- **精确抽卡模拟**: 完整模拟鸣潮抽卡机制，包括软保底、硬保底和大保底系统

## 🛠️ 技术栈

- **框架**: [Next.js 14](https://nextjs.org/) (App Router)
- **语言**: [TypeScript](https://www.typescriptlang.org/)
- **样式**: [Tailwind CSS](https://tailwindcss.com/)
- **图表**: [Recharts](https://recharts.org/)
- **图标**: [Lucide React](https://lucide.dev/)
- **截图**: [html2canvas](https://html2canvas.hertzen.com/)
- **部署**: [Vercel](https://vercel.com/)

## 📦 本地开发

### 环境要求
- Node.js 18.17 或更高版本
- npm 或 yarn 包管理器

### 安装步骤

1. **克隆仓库**
   ```bash
   git clone https://github.com/kevin1000x/wuthering-luck.git
   cd wuthering-luck
   ```

2. **安装依赖**
   ```bash
   npm install
   # 或
   yarn install
   ```

3. **启动开发服务器**
   ```bash
   npm run dev
   # 或
   yarn dev
   ```

4. **打开浏览器**
   
   访问 [http://localhost:3000](http://localhost:3000) 查看应用

### 可用命令

```bash
npm run dev      # 启动开发服务器
npm run build    # 构建生产版本
npm run start    # 启动生产服务器
npm run lint     # 运行 ESLint 代码检查
```

## 📁 项目结构

```
wuthering-luck/
├── app/                      # Next.js App Router 页面
│   ├── globals.css          # 全局样式
│   ├── layout.tsx           # 根布局
│   └── page.tsx             # 主页面
├── components/              # React 组件
│   ├── ScoreDisplay.tsx     # 运势分数显示
│   ├── TrendChart.tsx       # 趋势图表
│   ├── PullResults.tsx      # 抽卡结果显示
│   ├── ROIAnalysis.tsx      # ROI 分析
│   ├── ShareCard.tsx        # 分享卡片
│   └── WaveDecoration.tsx   # 波浪装饰
├── lib/                     # 工具库
│   ├── dailyLuck.ts         # 每日运势核心逻辑
│   └── WutheringWavesGacha.reference.ts  # 抽卡机制参考实现
├── public/                  # 静态资源
│   └── bg.png              # 背景图片
├── next.config.js          # Next.js 配置
├── tailwind.config.ts      # Tailwind CSS 配置
├── tsconfig.json           # TypeScript 配置
└── package.json            # 项目依赖
```

## 🎮 使用说明

1. **输入 UID**: 在首页输入您的鸣潮游戏 UID（9位数字）
2. **可选昵称**: 可以输入游戏昵称用于个性化显示
3. **查看运势**: 点击"开始检测"按钮生成今日运势报告
4. **查看分析**: 浏览运势分数、模拟抽卡结果、趋势图和 ROI 分析
5. **分享结果**: 点击截图按钮保存并分享您的运势结果

## 🔐 隐私说明

本应用完全在浏览器端运行，不会收集或存储任何用户数据。输入的 UID 和昵称仅用于本地计算，不会发送到任何服务器。

## 📄 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件

## 🙏 致谢

- 游戏《鸣潮》及其开发团队
- Next.js 和 React 社区
- 所有开源依赖库的贡献者

## 📞 联系方式

- GitHub: [@kevin1000x](https://github.com/kevin1000x)
- 项目主页: [https://github.com/kevin1000x/wuthering-luck](https://github.com/kevin1000x/wuthering-luck)
- 在线演示: [https://wuthering-luck.vercel.app](https://wuthering-luck.vercel.app)

---

<div id="english"></div>

## 📖 Project Overview

Wuthering Waves Fortune Detector is a fun web application built with Next.js that provides daily fortune predictions, gacha simulation, and data analysis for Wuthering Waves game players. By entering your game UID, the system generates deterministic daily fortune reports including luck scores, lucky elements, simulated pull results, and future trend predictions.

🌐 **Live Demo**: [https://wuthering-luck.vercel.app](https://wuthering-luck.vercel.app)

## ✨ Features

### 🎯 Core Features
- **Daily Fortune Detection**: Generate deterministic fortune scores (0-100) based on UID and date
- **Lucky Element Recommendation**: Daily lucky element recommendation (Fusion, Spectro, Aero, Glacio, Electro, Havoc)
- **Gacha Simulation**: 30-pull gacha simulation showing potential results (no real resources consumed)
- **Trend Chart**: Display fortune trends for past 2 days, today, and next 4 days
- **ROI Analysis**: Investment return recommendations based on daily fortune scores

### 🎨 UI Highlights
- Dark theme matching Wuthering Waves game style
- Glassmorphism design
- Smooth animations with golden glow effects
- Responsive design for mobile and desktop
- Screenshot sharing functionality

### 🔬 Technical Implementation
- **Deterministic RNG**: Uses LCG (Linear Congruential Generator) algorithm ensuring consistent results for same UID on same day
- **Hash Seeding**: Uses djb2 variant hash algorithm to convert UID+date into numeric seed
- **Accurate Gacha Simulation**: Complete simulation of Wuthering Waves gacha mechanics including soft pity, hard pity, and guaranteed systems

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Charts**: [Recharts](https://recharts.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Screenshot**: [html2canvas](https://html2canvas.hertzen.com/)
- **Deployment**: [Vercel](https://vercel.com/)

## 📦 Local Development

### Prerequisites
- Node.js 18.17 or higher
- npm or yarn package manager

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/kevin1000x/wuthering-luck.git
   cd wuthering-luck
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open browser**
   
   Visit [http://localhost:3000](http://localhost:3000) to view the application

### Available Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint code check
```

## 📁 Project Structure

```
wuthering-luck/
├── app/                      # Next.js App Router pages
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Main page
├── components/              # React components
│   ├── ScoreDisplay.tsx     # Fortune score display
│   ├── TrendChart.tsx       # Trend chart
│   ├── PullResults.tsx      # Pull results display
│   ├── ROIAnalysis.tsx      # ROI analysis
│   ├── ShareCard.tsx        # Share card
│   └── WaveDecoration.tsx   # Wave decoration
├── lib/                     # Utility libraries
│   ├── dailyLuck.ts         # Daily fortune core logic
│   └── WutheringWavesGacha.reference.ts  # Gacha mechanism reference
├── public/                  # Static assets
│   └── bg.png              # Background image
├── next.config.js          # Next.js configuration
├── tailwind.config.ts      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Project dependencies
```

## 🎮 How to Use

1. **Enter UID**: Input your Wuthering Waves game UID (9 digits) on the homepage
2. **Optional Nickname**: Optionally enter your game nickname for personalized display
3. **Check Fortune**: Click "Start Detection" button to generate today's fortune report
4. **View Analysis**: Browse fortune scores, simulated pull results, trend charts, and ROI analysis
5. **Share Results**: Click screenshot button to save and share your fortune results

## 🔐 Privacy Notice

This application runs entirely in the browser and does not collect or store any user data. The entered UID and nickname are only used for local calculations and are not sent to any server.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

## 🙏 Acknowledgments

- Wuthering Waves game and its development team
- Next.js and React community
- All open-source library contributors

## 📞 Contact

- GitHub: [@kevin1000x](https://github.com/kevin1000x)
- Project Homepage: [https://github.com/kevin1000x/wuthering-luck](https://github.com/kevin1000x/wuthering-luck)
- Live Demo: [https://wuthering-luck.vercel.app](https://wuthering-luck.vercel.app)

---

**Disclaimer**: This is a fan-made project and is not officially affiliated with Wuthering Waves or Kuro Games. All game-related content and trademarks belong to their respective owners.
