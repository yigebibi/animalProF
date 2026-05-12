# 动物爱宠分享论坛 - 前端

宠物论坛的 React + TypeScript 前端项目，包含 PC 端和 H5 移动端，使用 Vite 作为构建工具。

## 技术栈

- **框架**: React 19.x + TypeScript
- **UI 组件库**: Ant Design 5.x（PC 端） + Vant 4.x（移动端）
- **状态管理**: Redux Toolkit + RTK Query
- **路由**: React Router v6
- **样式**: Tailwind CSS 3.x
- **图表**: ECharts 5.x
- **构建工具**: Vite 5.x
- **测试**: Jest + React Testing Library + Cypress

## 项目结构

```
frontend/
├── src/
│   ├── main.tsx                 # 应用入口
│   ├── App.tsx                  # 根组件
│   ├── components/              # 公共组件
│   │   ├── Common/              # 通用组件
│   │   │   ├── Button/          # 按钮
│   │   │   ├── Input/           # 输入框
│   │   │   ├── Modal/           # 对话框
│   │   │   └── Loading/         # 加载组件
│   │   ├── Layout/              # 布局组件
│   │   │   ├── Header/          # 头部
│   │   │   ├── Footer/          # 底部
│   │   │   └── Sidebar/         # 侧边栏
│   │   └── Business/            # 业务组件
│   │       ├── PostCard/        # 帖子卡片
│   │       ├── CommentList/     # 评论列表
│   │       └── PetProfile/      # 宠物档案
│   ├── features/                # 业务功能
│   │   ├── auth/                # 认证
│   │   ├── user/                # 用户
│   │   ├── pet/                 # 宠物
│   │   ├── post/                # 帖子
│   │   ├── comment/             # 评论
│   │   └── notification/        # 通知
│   ├── hooks/                   # 自定义 Hooks
│   ├── services/                # API 接口
│   ├── store/                   # Redux 存储
│   ├── utils/                   # 工具函数
│   ├── styles/                  # 全局样式
│   └── types/                   # TypeScript 类型
├── public/                      # 静态资源
├── vite.config.ts              # Vite 配置
├── tsconfig.json               # TypeScript 配置
└── package.json                # 依赖
```

## 快速开始

### 安装依赖

```bash
cd frontend
npm install
```

### 启动开发服务器

```bash
npm run dev
```

服务器将在 http://localhost:3001 启动（如果端口被占用，会自动选择其他端口）。

### 构建生产版本

```bash
npm run build
```

构建产物将生成在 `build/` 目录下。

### 预览生产版本

```bash
npm run preview
```

## 主要功能

### 用户相关

- 用户注册/登录
- 个人资料管理
- 我的宠物管理
- 我的帖子/收藏
- 用户通知

### 社区功能

- 帖子发布/编辑/删除
- 帖子分类与搜索
- 评论/回复
- 点赞/收藏/分享
- 话题/标签系统

### 内容管理

- 图片/视频上传
- 文件管理
- 内容审核（待实现）

## 响应式设计

- **移动端 (< 640px)**: 单列布局，底部导航
- **平板 (640px - 1024px)**: 双列布局
- **桌面端 (> 1024px)**: 三列布局，侧边栏导航

## 开发规范

### 组件命名规范

- 文件名: PascalCase
- 目录名: PascalCase 或 kebab-case

### 代码规范

- 使用 TypeScript 严格模式
- 使用 Tailwind CSS 进行样式开发
- 组件化开发，遵循单一职责原则
- 使用 RTK Query 进行数据获取和状态管理
- 统一错误处理和加载状态

### 提交规范

- feat: 新功能
- fix: 修复 bug
- refactor: 代码重构
- docs: 文档更新
- style: 样式修改
- test: 测试代码

## 部署说明

### 环境变量

**开发环境** (.env.development):
```env
VITE_API_URL=http://localhost:3000/api/v1
VITE_ENV=development
VITE_APP_TITLE=宠物论坛 - 开发环境
```

**生产环境** (.env.production):
```env
VITE_API_URL=https://api.petforum.com/api/v1
VITE_ENV=production
VITE_APP_TITLE=宠物论坛
```

### 部署脚本

```bash
# 构建
npm run build

# 预览
npm run preview
```

## 相关文档

- [后端 API 文档](./docs/API.md)
- [数据库设计](./docs/DATABASE.md)
- [UI 设计稿](./docs/UI_DESIGN.md)

## License

MIT
