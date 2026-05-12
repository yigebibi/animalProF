# AGENTS.md

## 项目概述

宠物论坛 — 全栈 monorepo，两个独立包，无共享代码。

- `backend/` — NestJS 10 + Prisma + PostgreSQL + Redis
- `frontend/` — React 19 + Vite 8 + Redux Toolkit + Tailwind CSS + Ant Design 6

## 开发服务器启动顺序

1. 启动基础设施：`docker-compose up -d postgres redis`
2. 后端：`cd backend && npx prisma generate && npm run start:dev`（端口 3000）
3. 前端：`cd frontend && npm run dev`（端口 3001）

Postgres 或 Redis 不可达时后端无法启动。

## 关键命令

### 后端
```bash
cd backend
npm run start:dev          # 带热重载的开发服务器
npx prisma migrate dev     # 运行迁移（需要运行中的 Postgres）
npx prisma generate        # 修改 schema.prisma 后必须重新生成 Prisma Client
npm run prisma:seed        # 填充种子数据
npm run test               # 单元测试（Jest，匹配模式：*.spec.ts）
npm run test:e2e           # 端到端测试（需要运行中的数据库）
npm run lint               # ESLint
npm run format             # Prettier
```

### 前端
```bash
cd frontend
npm run dev                # Vite 开发服务器，端口 :3001
npm run build              # tsc -b && vite build → 输出到 build/（不是 dist/）
npm run lint               # ESLint
```

前端**未配置测试运行器** — `npm test` 会失败。

## 架构要点

- **API 前缀**：后端使用全局前缀 `api/v1`（在 `main.ts` 中设置）。完整端点示例：`http://localhost:3000/api/v1/auth/login`
- **Vite 代理**：前端将 `/api` 代理到 `http://localhost:3000` **并剥离 `/api` 前缀**（`vite.config.ts:19`）。因此前端请求 `/api/api/v1/auth/login` 到达后端时变为 `/api/v1/auth/login`。前端代码中使用完整路径 `/api/v1/...` — 代理只剥离第一个 `/api`
- **RabbitMQ**：在 `docker-compose.yml` 中定义但**未接入后端代码**，不要假设消息队列可用
- **路径别名**：两个包都使用 `@/*` 但解析到不同的根目录：
  - 后端：`@/*` → `src/*`（tsconfig.json）
  - 前端：`@/*` → `src/*`（vite.config.ts）
- **后端 TypeScript 非严格模式**：`strictNullChecks: false`、`noImplicitAny: false`，不要添加会破坏现有代码的严格类型
- **Prisma BigInt**：`File.fileSize` 是 `BigInt` 类型 — 需要处理 JSON 序列化

## 后端模块结构

所有业务逻辑在 `backend/src/modules/` 中，每个模块遵循 NestJS 约定：`*.module.ts`、`*.controller.ts`、`*.service.ts`、`dto/`。八个模块：`auth`、`user`、`pet`、`post`、`comment`、`file`、`search`、`notification`。

跨模块共享代码在 `backend/src/common/`：装饰器（`@Public`、`@User`、`@Roles`）、守卫（`JwtAuthGuard`、`RolesGuard`）、拦截器、过滤器、管道。

Prisma 服务在 `backend/src/database/`（不在 `src/modules/` 中）。

## 前端结构

- `src/store/` — Redux Toolkit store + RTK Query API 服务 + authSlice
- `src/features/` — 页面级组件（home、postList、postDetail、postCreate、search、profile）
- `src/router/` — 路由配置 + `ProtectedRoute`
- `src/hooks/` — 自定义 hooks（`useAuth`）
- `src/utils/` — storage、debounce、throttle、validator

## Docker

默认凭据（来自 `.env.example`）：
- Postgres：`petforum:petforum123@localhost:5432/petforum`
- Redis：`localhost:6379`（无密码）
- RabbitMQ 管理界面：`http://localhost:15672`（guest/guest）
- Swagger UI：`http://localhost:3000/api/docs`

## 提交前检查

1. `cd backend && npm run lint`
2. `cd frontend && npm run lint`
3. `cd backend && npm run build`（通过 `tsc` 类型检查）
4. `cd frontend && npm run build`（通过 `tsc -b` 类型检查）
