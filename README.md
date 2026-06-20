# 周浩洋个人博客

基于 Astro + React Three Fiber + Tailwind CSS 构建的个人数字花园。

## 技术栈

- **框架**: Astro 6（SSG，Islands 架构）
- **3D**: React Three Fiber + Three.js
- **动画**: Framer Motion + GSAP（预留）
- **样式**: Tailwind CSS v4
- **字体**: Inter + Noto Sans SC
- **内容**: MDX
- **测试**: Vitest + @testing-library/react + Playwright（预留）
- **部署**: GitHub Pages + GitHub Actions

## 快速开始

```bash
npm install
npm run dev
```

访问 http://localhost:4321/myblog/

## 常用命令

```bash
npm run dev          # 开发服务器
npm run build        # 静态构建
npm run lint         # ESLint + Prettier
npm run type-check   # Astro + TypeScript 类型检查
npm run test         # 单元/组件测试
npm run test:coverage # 测试覆盖率
npm run check:file-size # 文件行数检查
npm run migrate:posts   # 迁移 AIInsights 文章
npm run prepare:songs   # 准备音乐资源
npm run new:post -- --title "标题" --category ai-infra --lang zh
```

## 内容增长

新增文章只需两步：

1. 在 `src/content/posts/zh/` 或 `src/content/posts/en/` 创建 `.mdx` 文件
2. 图片放入 `public/assets/posts/[slug]/`

或使用脚本：

```bash
npm run new:post -- --title "新的思考" --category ai-infra --lang zh
```

## 工程纪律

- 文件 ≤250 行（组件/工具/hooks），最多 3 个例外文件且 ≤600 行
- 测试覆盖率目标 >95%（当前为阶段性阈值，持续向目标提升）
- 无 review 无进步，无 test 无质量

## 页面

- `/` — 首页：R3F 文章星系
- `/posts` — 文章列表
- `/posts/[lang]/[slug]` — 文章详情（零 3D，专注阅读）
- `/music` — 音乐播放器
- `/about` — 关于我 + 3D 分类柱状图
