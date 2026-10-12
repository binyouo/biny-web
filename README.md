# Biny Web

Biny 官网的独立私有仓库，包含产品首页、下载页、中文文档和交互演示。

```bash
cd website
pnpm install --frozen-lockfile --ignore-scripts
pnpm dev
```

需要 Node.js 22.12+ 和 pnpm 10.6.5。验证与构建：

```bash
pnpm test
pnpm build
```

构建目录为 `website/dist`，托管平台的项目根目录设置为 `website`。`pnpm build:pages` 另生成可直接访问的文档和下载路由文件，适用于不提供 SPA rewrite 的静态服务器。

源码和客户端演示依赖均保存在本仓库，不需要相邻的 Biny 工作区。维护说明见 [website/README.md](website/README.md)。仓库保持私有；网站发布只上传构建产物。
