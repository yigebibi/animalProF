# 宠物论坛后端

基于 NestJS + TypeScript + Prisma + PostgreSQL 的宠物论坛后端 API。

## 技术栈

- **框架**: NestJS 10.x
- **语言**: TypeScript 5.x
- **ORM**: Prisma 5.x
- **数据库**: PostgreSQL 14.x
- **缓存**: Redis 7.x
- **认证**: JWT + Passport
- **文档**: Swagger/OpenAPI
- **文件上传**: Multer

## 功能模块

- **认证模块**: 用户注册/登录、JWT 认证
- **用户模块**: 用户信息管理、头像上传、密码修改
- **宠物模块**: 宠物信息管理
- **帖子模块**: 帖子发布/编辑/删除、浏览
- **评论模块**: 评论发表/编辑/删除
- **文件模块**: 文件上传/删除
- **搜索模块**: 全局搜索功能
- **通知模块**: 消息通知

## 快速开始

### 使用 Docker 启动 (推荐)

1. 克隆项目到本地

2. 启动所有服务：
```bash
cd /path/to/project
docker-compose up -d
```

3. 等待服务启动完成后，进行数据库迁移：
```bash
docker-compose exec backend npx prisma migrate deploy
```

4. 访问 API 文档：http://localhost:3000/api/docs

### 本地开发

1. 确保已安装 Node.js 18+ 和 npm

2. 安装依赖：
```bash
cd backend
npm install
```

3. 配置环境变量，复制 `.env.example` 为 `.env` 并配置正确的值

4. 启动 PostgreSQL 和 Redis (可以使用 Docker)

5. 运行数据库迁移：
```bash
npx prisma migrate dev
```

6. 启动开发服务器：
```bash
npm run start:dev
```

7. 访问 API 文档：http://localhost:3000/api/docs

## API 接口

所有 API 接口都以 `/api/v1` 为前缀。

主要接口：

- `POST /api/v1/auth/register` - 用户注册
- `POST /api/v1/auth/login` - 用户登录
- `GET /api/v1/users/profile` - 获取当前用户信息
- `GET /api/v1/posts` - 获取帖子列表
- `POST /api/v1/posts` - 发布帖子
- `GET /api/v1/posts/:id` - 获取帖子详情
- `POST /api/v1/files/upload` - 上传文件

详细接口文档请访问 Swagger UI。

## 项目结构

```
backend/
├── src/
│   ├── main.ts                 # 应用入口
│   ├── app.module.ts           # 根模块
│   ├── common/                 # 公共模块
│   │   ├── decorators/         # 装饰器
│   │   ├── guards/             # 守卫
│   │   ├── interceptors/       # 拦截器
│   │   └── filters/            # 过滤器
│   ├── modules/                # 业务模块
│   │   ├── auth/               # 认证模块
│   │   ├── user/               # 用户模块
│   │   ├── pet/                # 宠物模块
│   │   ├── post/               # 帖子模块
│   │   ├── comment/            # 评论模块
│   │   ├── file/               # 文件模块
│   │   ├── search/             # 搜索模块
│   │   └── notification/       # 通知模块
│   ├── database/               # 数据库模块
│   └── config/                 # 配置文件
├── prisma/
│   └── schema.prisma           # Prisma 数据模型
├── test/                       # 测试文件
├── .env                        # 环境变量
├── docker-compose.yml          # Docker 配置
└── package.json
```

## 开发命令

```bash
# 开发模式
npm run start:dev

# 构建
npm run build

# 生产模式
npm run start:prod

# 代码检查
npm run lint

# 代码格式化
npm run format

# Prisma 相关命令
npx prisma generate           # 生成 Prisma Client
npx prisma migrate dev        # 创建并应用迁移
npx prisma studio             # 打开 Prisma Studio
```

## License

MIT
