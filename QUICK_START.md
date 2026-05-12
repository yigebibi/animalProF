# 动物爱宠分享论坛项目 - 快速启动指南

## 项目简介

这是一个专注于动物爱宠分享的社区平台，提供PC端、H5移动端和安卓APP三种访问方式。项目采用现代化的技术架构，确保高性能、可扩展性和良好的用户体验。

## 技术栈

### 前端
- **PC/H5**: React 18.x + TypeScript + Vite
- **UI组件**: Ant Design 5.x (PC) + Vant 4.x (移动端)
- **状态管理**: Redux Toolkit + RTK Query
- **样式**: Tailwind CSS 3.x

### 后端
- **框架**: NestJS 10.x + TypeScript
- **ORM**: Prisma
- **数据库**: PostgreSQL 14.x + Redis 7.x
- **消息队列**: RabbitMQ

### 部署
- **容器化**: Docker + Kubernetes
- **CI/CD**: GitHub Actions
- **监控**: Prometheus + Grafana

## 快速启动

### 环境要求
- **Docker**: 20.10+
- **Docker Compose**: 2.0+
- **Node.js**: 18.x
- **npm**: 8.x+

### 1. 克隆项目
```bash
git clone <项目地址>
cd petforum
```

### 2. 一键启动开发环境

#### 使用启动脚本 (推荐)
```bash
# 给脚本添加执行权限
chmod +x scripts/start-dev.sh

# 运行启动脚本
./scripts/start-dev.sh
```

#### 或使用 Makefile
```bash
# 创建 .env 文件
cp .env.example .env

# 启动开发环境
make start

# 安装依赖
make install
```

### 3. 手动启动 (可选)

#### 启动数据库和缓存服务
```bash
docker-compose up -d postgres redis rabbitmq
```

#### 启动后端服务
```bash
cd backend
npm install
npx prisma generate
npx prisma migrate deploy
npm run start:dev
```

#### 启动前端服务
```bash
cd frontend
npm install
npm run dev
```

### 4. 访问应用

#### 前端应用
- **PC端**: http://localhost:3001
- **移动端**: 访问 http://localhost:3001 (在移动设备上查看或使用浏览器开发者工具)

#### 后端API
- **API文档**: http://localhost:3000/api/docs (Swagger UI)
- **基础URL**: http://localhost:3000/api/v1

#### 管理工具
- **数据库**: 使用 Prisma Studio 访问 `npx prisma studio`
- **PostgreSQL**: localhost:5432 (user: petforum, pwd: petforum123, db: petforum)
- **Redis**: localhost:6379
- **RabbitMQ**: http://localhost:15672 (guest/guest)

### 5. 开发流程

#### 创建分支
```bash
git checkout -b feature/your-feature-name
```

#### 开发
```bash
# 开发代码
# 运行测试
make test

# 格式化代码
cd backend && npm run format
cd frontend && npm run format
```

#### 提交代码
```bash
git add .
git commit -m "feat: 添加功能描述"
git push origin feature/your-feature-name
```

#### 创建 Pull Request
1. 访问 GitHub 仓库
2. 点击 "Compare & pull request"
3. 填写 PR 信息
4. 等待代码审查

## 项目架构

### 项目结构
```
petforum/
├── backend/                    # 后端项目
│   ├── src/
│   │   ├── main.ts             # 入口文件
│   │   ├── app.module.ts       # 根模块
│   │   ├── common/            # 公共模块 (装饰器、过滤器、守卫)
│   │   ├── modules/           # 业务模块 (auth, user, pet, post, etc.)
│   │   └── config/            # 配置文件
│   ├── prisma/               # Prisma 相关
│   └── package.json
├── frontend/                   # 前端项目
│   ├── src/
│   │   ├── main.tsx           # 入口文件
│   │   ├── App.tsx           # 根组件
│   │   ├── components/       # 公共组件
│   │   ├── features/         # 业务功能
│   │   ├── store/            # Redux 存储
│   │   └── utils/            # 工具函数
│   └── package.json
├── scripts/                   # 脚本文件
├── .github/                   # GitHub 配置
├── docker-compose.yml         # Docker 配置
├── Makefile                   # 项目管理工具
└── README.md
```

## 常用命令

### Make 命令
```bash
make help                # 显示帮助信息
make start              # 启动开发环境
make stop               # 停止开发环境
make install            # 安装依赖
make dev                # 启动开发服务器
make test               # 运行所有测试
make logs               # 查看服务日志
make db-migrate         # 运行数据库迁移
make db-studio          # 打开 Prisma Studio
```

### 开发命令
```bash
# 前端
npm run dev              # 启动开发服务器
npm run build            # 构建生产版本
npm run test             # 运行测试
npm run lint             # 代码检查

# 后端
npm run start:dev       # 启动开发服务器 (带热重载)
npm run build           # 构建生产版本
npm run test            # 运行测试
npx prisma studio       # 打开 Prisma Studio
```

## 数据库操作

### 创建迁移
```bash
cd backend
npx prisma migrate dev --name migration-name
```

### 应用迁移到生产环境
```bash
cd backend
npx prisma migrate deploy
```

### 查看数据库状态
```bash
cd backend
npx prisma db pull
npx prisma db push
```

## 常见问题

### 1. 端口占用
如果端口被占用，可以修改 `.env` 文件中的端口配置：
```env
API_PORT=3000          # 后端端口
WEB_PORT=3001          # 前端端口
DB_PORT=5432           # 数据库端口
REDIS_PORT=6379        # Redis 端口
```

### 2. 数据库连接失败
- 检查 Docker 容器是否正常运行：`docker-compose ps`
- 检查环境变量配置：`cat .env`
- 重启服务：`make restart`

### 3. 依赖安装失败
- 删除 `node_modules` 目录和 `package-lock.json` 文件
- 重新安装：`make install`

### 4. 数据库迁移失败
- 检查数据库连接
- 查看迁移文件：`backend/prisma/migrations/`
- 手动执行 SQL 文件

## 测试与部署

### 运行测试
```bash
make test              # 运行所有测试
make test-backend      # 运行后端测试
make test-frontend     # 运行前端测试
```

### 部署到生产环境
```bash
# 确保已配置生产环境变量
cp .env.example .env.production
# 修改配置
# 部署
make deploy
```

## 相关文档

- [项目管理框架](PROJECT_MANAGEMENT_FRAMEWORK.md)
- [后端开发文档](BACKEND_DOC.md)
- [前端开发文档](FRONTEND_DOC.md)
- [数据库设计文档](DATABASE_DOC.md)

## 支持

如果遇到问题，请查看：
1. [项目WIKI](https://github.com/your-repo/wiki)
2. [常见问题解答](https://github.com/your-repo/wiki/FAQ)
3. [提交 Issue](https://github.com/your-repo/issues)

## 许可证

本项目采用 [MIT License](LICENSE)。
