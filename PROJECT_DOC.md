# 动物爱宠分享论坛项目开发文档

## 项目概述

### 项目背景
随着人们生活水平的提高，养宠物的人越来越多，宠物已经成为家庭的重要成员。宠物主人需要一个平台来分享宠物的照片、视频，交流养宠经验，寻求医疗建议，以及寻找宠物相关的产品和服务。

### 项目目标
打造一个专注于动物爱宠分享的社区平台，提供PC端、H5移动端和安卓APP三种访问方式，为用户提供优质的内容分享和交流体验。

### 核心功能
- 用户注册/登录/个人中心
- 宠物信息管理
- 帖子发布/浏览/搜索
- 评论/点赞/收藏
- 图片/视频上传
- 话题/标签系统
- 通知系统
- 管理员后台

## 技术架构

### 前端技术栈

#### PC端/H5移动端（React + TypeScript）
- **框架**: React 18.x + TypeScript
- **UI组件库**: Ant Design 5.x（PC端） + Vant 4.x（移动端）
- **状态管理**: Redux Toolkit + RTK Query
- **路由**: React Router v6
- **样式**: Tailwind CSS 3.x
- **图表**: ECharts 5.x
- **图片处理**: react-image-crop, react-uploady
- **构建工具**: Vite 5.x
- **测试**: Jest + React Testing Library + Cypress

#### 安卓APP（Flutter）
- **框架**: Flutter 3.x
- **语言**: Dart
- **UI组件**: Material Design + Cupertino
- **状态管理**: Riverpod 2.x
- **网络请求**: Dio
- **存储**: Hive (本地存储) + SharedPreferences
- **图片/视频**: image_picker, video_player, cached_network_image
- **权限**: permission_handler
- **支付**: flutter_pay, alipay, wechat_pay
- **测试**: Flutter Test + Integration Test

### 后端技术栈

#### 主要技术（Node.js + NestJS）
- **框架**: NestJS 10.x
- **语言**: TypeScript
- **ORM**: Prisma
- **数据库**: PostgreSQL 14.x + Redis 7.x
- **缓存**: Redis (用于会话管理、热点数据)
- **身份认证**: JWT + Passport.js
- **权限控制**: RBAC (基于角色的访问控制)
- **文件存储**: 阿里云OSS / 腾讯云COS
- **消息队列**: RabbitMQ (用于异步任务处理)
- **实时通信**: Socket.io (用于通知、聊天)
- **邮件服务**: Nodemailer (用于邮件验证、通知)
- **短信服务**: 阿里云短信 / 腾讯云短信
- **API文档**: Swagger / OpenAPI
- **测试**: Jest + Supertest + Testcontainers

## 数据库设计

### 主要数据表

#### 1. 用户表 (users)
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password_hash VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    nickname VARCHAR(100),
    bio TEXT,
    gender SMALLINT DEFAULT 0, -- 0:未知, 1:男, 2:女
    birthday DATE,
    city VARCHAR(100),
    role SMALLINT DEFAULT 0, -- 0:普通用户, 1:管理员
    status SMALLINT DEFAULT 1, -- 1:正常, 0:禁用
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 2. 宠物表 (pets)
```sql
CREATE TABLE pets (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL, -- 狗、猫、鸟、鱼等
    breed VARCHAR(100),
    gender SMALLINT DEFAULT 0, -- 0:未知, 1:公, 2:母
    birthday DATE,
    avatar_url TEXT,
    bio TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 3. 帖子表 (posts)
```sql
CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    pet_id INTEGER REFERENCES pets(id) ON DELETE SET NULL,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    cover_url TEXT,
    tags VARCHAR(50)[],
    category VARCHAR(50) DEFAULT 'general', -- general:普通, help:求助, share:分享, discussion:讨论
    status SMALLINT DEFAULT 1, -- 1:正常, 0:草稿, -1:禁用
    view_count INTEGER DEFAULT 0,
    like_count INTEGER DEFAULT 0,
    comment_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 4. 评论表 (comments)
```sql
CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
    parent_id INTEGER REFERENCES comments(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    status SMALLINT DEFAULT 1, -- 1:正常, -1:禁用
    like_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 5. 点赞表 (likes)
```sql
CREATE TABLE likes (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    target_type VARCHAR(20) NOT NULL, -- post:帖子, comment:评论
    target_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, target_type, target_id)
);
```

#### 6. 收藏表 (favorites)
```sql
CREATE TABLE favorites (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, post_id)
);
```

#### 7. 文件表 (files)
```sql
CREATE TABLE files (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    original_name VARCHAR(255) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL,
    file_size BIGINT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    file_type VARCHAR(20) DEFAULT 'image', -- image:图片, video:视频, file:文件
    status SMALLINT DEFAULT 1, -- 1:正常, 0:删除
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 8. 话题/标签表 (tags)
```sql
CREATE TABLE tags (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    post_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 9. 通知表 (notifications)
```sql
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- like:点赞, comment:评论, follow:关注, system:系统
    content TEXT NOT NULL,
    related_id INTEGER,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## API接口设计

### 接口基础信息

- **基础URL**: `https://api.petforum.com`
- **版本号**: `/v1`
- **请求格式**: JSON
- **响应格式**: JSON
- **字符编码**: UTF-8
- **认证方式**: Bearer Token (JWT)

### 统一响应格式

```typescript
// 成功响应
interface ApiSuccessResponse<T = any> {
  code: number; // 200
  message: string; // 'success'
  data: T;
  timestamp: number;
}

// 错误响应
interface ApiErrorResponse {
  code: number; // 4xx/5xx
  message: string;
  error?: string;
  timestamp: number;
}
```

### 接口分类

#### 1. 用户接口 (/api/v1/users)

| 方法 | 路径 | 描述 | 认证 |
|------|------|------|------|
| POST | `/register` | 用户注册 | 否 |
| POST | `/login` | 用户登录 | 否 |
| GET | `/profile` | 获取用户信息 | 是 |
| PUT | `/profile` | 更新用户信息 | 是 |
| POST | `/upload-avatar` | 上传头像 | 是 |
| POST | `/change-password` | 修改密码 | 是 |
| GET | `/:id` | 获取用户详情 | 否 |

#### 2. 宠物接口 (/api/v1/pets)

| 方法 | 路径 | 描述 | 认证 |
|------|------|------|------|
| GET | `/` | 获取用户宠物列表 | 是 |
| POST | `/` | 添加宠物信息 | 是 |
| GET | `/:id` | 获取宠物详情 | 否 |
| PUT | `/:id` | 更新宠物信息 | 是 |
| DELETE | `/:id` | 删除宠物信息 | 是 |

#### 3. 帖子接口 (/api/v1/posts)

| 方法 | 路径 | 描述 | 认证 |
|------|------|------|------|
| GET | `/` | 获取帖子列表 | 否 |
| POST | `/` | 发布帖子 | 是 |
| GET | `/:id` | 获取帖子详情 | 否 |
| PUT | `/:id` | 更新帖子 | 是 |
| DELETE | `/:id` | 删除帖子 | 是 |
| POST | `/:id/like` | 点赞帖子 | 是 |
| POST | `/:id/unlike` | 取消点赞 | 是 |
| POST | `/:id/favorite` | 收藏帖子 | 是 |
| POST | `/:id/unfavorite` | 取消收藏 | 是 |

#### 4. 评论接口 (/api/v1/comments)

| 方法 | 路径 | 描述 | 认证 |
|------|------|------|------|
| GET | `/` | 获取评论列表 | 否 |
| POST | `/` | 发表评论 | 是 |
| PUT | `/:id` | 更新评论 | 是 |
| DELETE | `/:id` | 删除评论 | 是 |
| POST | `/:id/like` | 点赞评论 | 是 |
| POST | `/:id/unlike` | 取消点赞 | 是 |

#### 5. 文件接口 (/api/v1/files)

| 方法 | 路径 | 描述 | 认证 |
|------|------|------|------|
| POST | `/upload` | 上传文件 | 是 |
| DELETE | `/:id` | 删除文件 | 是 |

#### 6. 搜索接口 (/api/v1/search)

| 方法 | 路径 | 描述 | 认证 |
|------|------|------|------|
| GET | `/` | 搜索帖子/用户/标签 | 否 |

#### 7. 通知接口 (/api/v1/notifications)

| 方法 | 路径 | 描述 | 认证 |
|------|------|------|------|
| GET | `/` | 获取通知列表 | 是 |
| PUT | `/:id/read` | 标记已读 | 是 |
| PUT | `/read-all` | 标记全部已读 | 是 |

## 前端设计

### 页面结构

#### PC端页面
- **首页**: 顶部导航、轮播图、热门帖子、最新帖子、话题推荐、侧边栏
- **帖子列表页**: 搜索栏、分类筛选、帖子列表、侧边栏（热门标签、最新用户）
- **帖子详情页**: 帖子内容、评论区、侧边栏（作者信息、相关推荐）
- **发布页面**: 标题输入、内容编辑器、图片/视频上传、标签选择、分类选择
- **用户中心**: 个人资料、我的宠物、我的帖子、我的收藏、通知、设置
- **登录/注册**: 登录表单、注册表单、忘记密码

#### H5移动端页面
- **首页**: 顶部搜索、轮播图、分类导航、帖子列表（瀑布流）、底部导航
- **分类页面**: 分类筛选、帖子列表
- **搜索页面**: 搜索历史、热门搜索、搜索结果
- **帖子详情**: 帖子内容、评论区、操作栏（点赞/收藏/分享）
- **发布页面**: 分步表单（选择宠物、输入内容、上传图片）
- **个人中心**: 个人资料、我的帖子、我的收藏、我的宠物、设置

#### APP页面（Flutter）
- **首页**: 底部导航、轮播图、分类导航、帖子列表
- **发现**: 热门话题、推荐内容、附近用户
- **发布**: 相机/相册选择、图片编辑、内容发布
- **通知**: 消息通知、系统通知
- **我的**: 个人资料、我的宠物、我的帖子、收藏、设置

## 项目结构

### 后端项目结构

```
backend/
├── src/
│   ├── main.ts              # 应用入口文件
│   ├── app.module.ts        # 根模块
│   ├── common/              # 公共模块
│   │   ├── decorators/      # 装饰器
│   │   ├── filters/         # 异常过滤器
│   │   ├── guards/          # 守卫
│   │   ├── interceptors/    # 拦截器
│   │   └── utils/           # 工具函数
│   ├── modules/             # 业务模块
│   │   ├── auth/            # 认证模块
│   │   ├── user/            # 用户模块
│   │   ├── pet/             # 宠物模块
│   │   ├── post/            # 帖子模块
│   │   ├── comment/         # 评论模块
│   │   ├── file/            # 文件模块
│   │   ├── search/          # 搜索模块
│   │   └── notification/    # 通知模块
│   ├── config/              # 配置文件
│   └── prisma/              # Prisma相关
├── test/                    # 测试文件
├── .env                     # 环境变量
├── nest-cli.json            # NestJS配置
├── package.json             # 依赖
└── tsconfig.json            # TypeScript配置
```

### 前端项目结构

```
frontend/
├── src/
│   ├── main.tsx             # 应用入口
│   ├── App.tsx              # 根组件
│   ├── components/          # 公共组件
│   │   ├── Common/          # 通用组件
│   │   ├── Layout/          # 布局组件
│   │   └── Business/        # 业务组件
│   ├── features/            # 业务功能
│   │   ├── auth/            # 认证
│   │   ├── user/            # 用户
│   │   ├── pet/             # 宠物
│   │   ├── post/            # 帖子
│   │   ├── comment/         # 评论
│   │   └── notification/    # 通知
│   ├── hooks/               # 自定义Hooks
│   ├── services/            # API接口
│   ├── store/               # Redux存储
│   ├── utils/               # 工具函数
│   ├── styles/              # 全局样式
│   └── types/               # TypeScript类型
├── public/                  # 静态资源
├── vite.config.ts          # Vite配置
├── tsconfig.json           # TypeScript配置
└── package.json            # 依赖
```

### APP项目结构

```
app/
├── lib/
│   ├── src/
│   │   ├── main.dart          # 应用入口
│   │   ├── app.dart           # 根组件
│   │   ├── constants/         # 常量
│   │   ├── components/        # 公共组件
│   │   ├── features/          # 业务功能
│   │   │   ├── auth/          # 认证
│   │   │   ├── user/          # 用户
│   │   │   ├── pet/           # 宠物
│   │   │   ├── post/          # 帖子
│   │   │   ├── comment/       # 评论
│   │   │   └── notification/  # 通知
│   │   ├── services/          # API接口
│   │   ├── providers/         # Riverpod providers
│   │   ├── utils/             # 工具函数
│   │   └── theme/             # 主题配置
│   └── pubspec.yaml           # 依赖
├── android/                   # 安卓配置
├── ios/                       # iOS配置
├── test/                      # 测试
└── integration_test/          # 集成测试
```

## 部署方案

### 服务器架构

#### 生产环境
- **负载均衡**: Nginx
- **应用服务器**: Node.js (PM2进程管理)
- **数据库**: PostgreSQL 14.x (主从复制)
- **缓存**: Redis 7.x (集群)
- **文件存储**: 阿里云OSS
- **消息队列**: RabbitMQ (集群)
- **监控**: Prometheus + Grafana
- **日志**: ELK Stack (Elasticsearch + Logstash + Kibana)
- **CI/CD**: GitHub Actions / GitLab CI

#### 测试环境
- Docker Compose 部署所有服务
- 测试数据库与生产数据库分离
- 单独的文件存储和缓存服务器

### 部署流程

1. 代码提交到Git仓库
2. CI/CD自动构建
3. 运行自动化测试
4. 构建Docker镜像
5. 推送到容器仓库
6. 部署到Kubernetes集群
7. 健康检查与滚动更新

## 开发计划

### 第一阶段：基础架构
- 搭建项目框架
- 配置开发环境
- 创建数据库
- 实现基础用户认证

### 第二阶段：核心功能
- 实现用户管理
- 实现宠物管理
- 实现帖子管理
- 实现评论系统
- 实现文件上传

### 第三阶段：社区功能
- 实现点赞/收藏
- 实现搜索功能
- 实现通知系统
- 实现话题标签
- 实现社交功能

### 第四阶段：用户体验优化
- 实现响应式设计
- 优化页面加载速度
- 添加图片/视频压缩
- 实现离线缓存
- 添加错误处理

### 第五阶段：测试与部署
- 编写单元测试
- 编写集成测试
- 编写端到端测试
- 部署到生产环境
- 性能优化与监控

## 风险评估

### 技术风险
- **兼容性问题**: 多端适配（PC/H5/APP）
- **性能问题**: 图片/视频加载与存储
- **安全问题**: 用户数据保护、防止XSS/CSRF攻击

### 业务风险
- **用户活跃度**: 社区冷启动问题
- **内容质量**: 需要有效的内容审核机制
- **合规风险**: 宠物相关内容的法规要求

### 应对措施
- 建立完整的测试流程，覆盖各平台
- 使用CDN加速静态资源
- 建立用户举报和内容审核机制
- 遵守相关法律法规，定期合规检查

---

**文档版本**: 1.0  
**创建时间**: 2026-04-24  
**最后更新**: 2026-04-24  
**作者**: Claude AI