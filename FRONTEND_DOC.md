# 动物爱宠分享论坛 - 前端开发文档

## 概述

本项目前端包括PC端/H5移动端（React + TypeScript）和安卓APP（Flutter）两个版本，实现完整的宠物社区功能。

## 技术架构

### PC端/H5移动端（React + TypeScript）

#### 核心技术
- **框架**: React 18.x + TypeScript
- **构建工具**: Vite 5.x
- **UI组件库**: Ant Design 5.x（PC端） + Vant 4.x（移动端）
- **状态管理**: Redux Toolkit + RTK Query
- **路由**: React Router v6
- **样式**: Tailwind CSS 3.x
- **测试**: Jest + React Testing Library + Cypress

#### 项目结构

```
frontend/
├── src/
│   ├── main.tsx                     # 应用入口
│   ├── App.tsx                      # 根组件
│   ├── components/                  # 公共组件
│   │   ├── Common/                  # 通用组件
│   │   │   ├── Button/              # 按钮
│   │   │   ├── Input/               # 输入框
│   │   │   ├── Modal/               # 对话框
│   │   │   └── Loading/             # 加载组件
│   │   ├── Layout/                  # 布局组件
│   │   │   ├── Header/              # 头部
│   │   │   ├── Footer/              # 底部
│   │   │   └── Sidebar/             # 侧边栏
│   │   └── Business/                # 业务组件
│   │       ├── PostCard/            # 帖子卡片
│   │       ├── CommentList/         # 评论列表
│   │       └── PetProfile/          # 宠物档案
│   ├── features/                    # 业务功能
│   │   ├── auth/                    # 认证模块
│   │   │   ├── components/          # 组件
│   │   │   ├── hooks/               # 自定义Hooks
│   │   │   ├── services/            # API
│   │   │   └── types/               # 类型定义
│   │   ├── user/                    # 用户模块
│   │   ├── pet/                     # 宠物模块
│   │   ├── post/                    # 帖子模块
│   │   ├── comment/                 # 评论模块
│   │   └── notification/            # 通知模块
│   ├── hooks/                       # 全局Hooks
│   │   ├── useAuth.ts               # 认证Hook
│   │   └── useToast.ts              # 提示Hook
│   ├── services/                    # API接口
│   │   ├── api.ts                   # 基础配置
│   │   └── endpoints/               # 各模块接口
│   ├── store/                       # Redux存储
│   │   ├── store.ts                 # 存储配置
│   │   └── slices/                  # 各模块slice
│   ├── utils/                       # 工具函数
│   │   ├── request.ts               # 请求工具
│   │   ├── storage.ts               # 存储工具
│   │   └── validator.ts             # 验证工具
│   ├── styles/                      # 全局样式
│   │   ├── globals.css              # 全局样式
│   │   └── variables.css            # 样式变量
│   └── types/                       # TypeScript类型
│       ├── api.ts                   # API类型
│       ├── common.ts                # 通用类型
│       └── index.ts                 # 类型入口
├── public/                          # 静态资源
├── vite.config.ts                  # Vite配置
├── tsconfig.json                   # TypeScript配置
└── package.json                    # 依赖
```

## 页面设计与组件

### 1. 首页 (Home)

#### 功能描述
展示社区热门内容，包括轮播图、分类导航、热门帖子和最新动态。

#### 组件结构
```
HomePage/
├── components/
│   ├── Banner/                     # 轮播图
│   ├── CategoryNav/               # 分类导航
│   ├── HotPosts/                  # 热门帖子
│   └── LatestPosts/               # 最新帖子
├── hooks/
│   └── useHomeData.ts             # 获取首页数据
└── index.tsx                      # 页面入口
```

#### 关键功能
- 轮播图展示活动或推荐内容
- 分类导航快速跳转
- 热门帖子根据点赞数排序
- 最新帖子按时间倒序排列

### 2. 帖子列表页 (PostList)

#### 功能描述
展示帖子列表，支持分类筛选、搜索和排序功能。

#### 组件结构
```
PostListPage/
├── components/
│   ├── SearchBar/                 # 搜索栏
│   ├── FilterPanel/              # 筛选面板
│   └── PostList/                 # 帖子列表
├── hooks/
│   └── usePostList.ts            # 获取帖子列表
└── index.tsx                      # 页面入口
```

#### 关键功能
- 搜索功能（支持关键词搜索）
- 分类筛选（按宠物类型、话题等）
- 排序功能（时间、热度、评论数）
- 无限滚动加载更多

### 3. 帖子详情页 (PostDetail)

#### 功能描述
展示帖子内容、评论和相关推荐，支持互动操作。

#### 组件结构
```
PostDetailPage/
├── components/
│   ├── PostContent/              # 帖子内容
│   ├── CommentSection/           # 评论区域
│   ├── ActionBar/                # 操作栏（点赞/收藏/分享）
│   └── RelatedPosts/             # 相关推荐
├── hooks/
│   ├── usePostDetail.ts          # 获取帖子详情
│   ├── useComments.ts            # 获取评论
│   ├── useLike.ts                # 点赞功能
│   └── useFavorite.ts            # 收藏功能
└── index.tsx                      # 页面入口
```

#### 关键功能
- 展示帖子内容、图片、视频
- 评论列表和回复功能
- 点赞、收藏、分享操作
- 相关推荐（基于标签或内容相似度）

### 4. 发布帖子页 (PostCreate)

#### 功能描述
用户发布新帖子，支持图文混排和标签选择。

#### 组件结构
```
PostCreatePage/
├── components/
│   ├── PostForm/                 # 发布表单
│   ├── PetSelector/              # 宠物选择
│   ├── ImageUploader/            # 图片上传
│   └── TagSelector/              # 标签选择
├── hooks/
│   └── useCreatePost.ts          # 发布帖子
└── index.tsx                      # 页面入口
```

#### 关键功能
- 选择关联宠物
- 文本编辑器（支持Markdown）
- 图片/视频上传
- 标签选择（支持创建新标签）
- 预览功能

### 5. 搜索页面 (Search)

#### 功能描述
实现搜索功能，包括搜索历史、热门搜索和搜索结果。

#### 组件结构
```
SearchPage/
├── components/
│   ├── SearchHistory/            # 搜索历史
│   ├── HotSearch/                # 热门搜索
│   └── SearchResults/            # 搜索结果
├── hooks/
│   └── useSearch.ts              # 搜索功能
└── index.tsx                      # 页面入口
```

#### 关键功能
- 实时搜索建议
- 搜索历史记录
- 热门搜索词推荐
- 搜索结果分类展示

### 6. 用户中心 (Profile)

#### 功能描述
展示用户信息、管理个人资料、查看用户发布的帖子和收藏。

#### 组件结构
```
ProfilePage/
├── components/
│   ├── ProfileHeader/            # 用户头部信息
│   ├── ProfileMenu/              # 菜单导航
│   ├── MyPosts/                  # 我的帖子
│   ├── MyFavorites/              # 我的收藏
│   └── MyPets/                   # 我的宠物
├── hooks/
│   ├── useProfile.ts             # 获取用户信息
│   └── useUpdateProfile.ts       # 更新用户信息
└── index.tsx                      # 页面入口
```

#### 关键功能
- 个人资料展示（头像、昵称、简介等）
- 编辑个人资料
- 查看和管理宠物信息
- 查看发布的帖子和收藏的内容
- 设置功能（账号安全、通知设置等）

### 7. 登录/注册页面 (Auth)

#### 功能描述
用户登录和注册功能。

#### 组件结构
```
AuthPage/
├── components/
│   ├── LoginForm/                # 登录表单
│   └── RegisterForm/             # 注册表单
├── hooks/
│   ├── useLogin.ts               # 登录
│   └── useRegister.ts            # 注册
└── index.tsx                      # 页面入口
```

#### 关键功能
- 账号密码登录
- 邮箱注册
- 验证码发送和验证
- 忘记密码

## 响应式设计

### 适配策略

#### 断点设计
```css
/* Tailwind CSS 断点 */
:root {
  --breakpoint-sm: 640px;    /* 移动端 */
  --breakpoint-md: 768px;    /* 平板 */
  --breakpoint-lg: 1024px;   /* 桌面 */
  --breakpoint-xl: 1280px;   /* 大屏幕 */
}
```

#### 布局适配
- **< 640px**: 移动端布局（单列）
- **640px - 1024px**: 平板布局（两列）
- **> 1024px**: 桌面布局（三列）

#### 组件适配

| 组件 | 移动端 | 桌面端 |
|------|--------|--------|
| 导航栏 | 底部导航 | 顶部导航 + 侧边栏 |
| 按钮 | 全屏宽度 | 自适应宽度 |
| 输入框 | 全屏宽度 | 固定宽度 |
| 图片 | 全屏宽度 | 最大宽度限制 |

## 状态管理

### Redux Toolkit 配置

```typescript
// src/store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import { api } from './services/api';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

### RTK Query API 配置

```typescript
// src/store/services/api.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../store';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Post', 'Comment', 'User', 'Pet'],
  endpoints: (builder) => ({
    // 用户相关
    login: builder.mutation({...}),
    register: builder.mutation({...}),
    getProfile: builder.query({...}),
    updateProfile: builder.mutation({...}),
    // 宠物相关
    getPets: builder.query({...}),
    addPet: builder.mutation({...}),
    updatePet: builder.mutation({...}),
    deletePet: builder.mutation({...}),
    // 帖子相关
    getPosts: builder.query({...}),
    createPost: builder.mutation({...}),
    updatePost: builder.mutation({...}),
    deletePost: builder.mutation({...}),
    // 评论相关
    getComments: builder.query({...}),
    createComment: builder.mutation({...}),
    updateComment: builder.mutation({...}),
    deleteComment: builder.mutation({...}),
  }),
});
```

## 路由配置

```typescript
// src/router/index.tsx
import { createBrowserRouter } from 'react-router-dom';
import Layout from '../components/Layout';
import HomePage from '../features/home';
import PostListPage from '../features/postList';
import PostDetailPage from '../features/postDetail';
import PostCreatePage from '../features/postCreate';
import SearchPage from '../features/search';
import ProfilePage from '../features/profile';
import AuthPage from '../features/auth';
import ProtectedRoute from './ProtectedRoute';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { path: '', element: <HomePage /> },
      { path: 'posts', element: <PostListPage /> },
      { path: 'posts/:id', element: <PostDetailPage /> },
      {
        path: 'posts/create',
        element: (
          <ProtectedRoute>
            <PostCreatePage />
          </ProtectedRoute>
        ),
      },
      { path: 'search', element: <SearchPage /> },
      {
        path: 'profile',
        element: (
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        ),
      },
    ],
  },
  { path: '/auth', element: <AuthPage /> },
]);
```

## 表单验证

### 使用 React Hook Form + Zod

```typescript
// src/utils/validator.ts
import { z } from 'zod';

// 登录表单验证
export const loginSchema = z.object({
  email: z.string().email('请输入有效的邮箱地址'),
  password: z.string().min(6, '密码至少6位'),
});

// 注册表单验证
export const registerSchema = z.object({
  username: z.string().min(2, '用户名至少2位').max(20, '用户名最多20位'),
  email: z.string().email('请输入有效的邮箱地址'),
  password: z.string().min(6, '密码至少6位'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "密码不匹配",
  path: ["confirmPassword"],
});

// 发布帖子表单验证
export const postSchema = z.object({
  title: z.string().min(1, '请输入标题').max(200, '标题最多200字'),
  content: z.string().min(10, '内容至少10字'),
  petId: z.number().optional(),
  tags: z.array(z.string()).optional(),
});
```

## 错误处理

### 全局错误拦截

```typescript
// src/utils/request.ts
import { fetchBaseQuery } from '@reduxjs/toolkit/query';
import { RootState } from '../store/store';

const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:3000/api/v1',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

export const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  
  if (result.error && result.error.status === 401) {
    // 处理未授权错误，清除token并跳转到登录页
    api.dispatch(logout());
  }
  
  return result;
};
```

### 页面级错误处理

```typescript
// src/features/postDetail/index.tsx
import { useGetPostByIdQuery } from '../../store/services/api';

const PostDetailPage = ({ id }: { id: string }) => {
  const { data, error, isLoading } = useGetPostByIdQuery(id);
  
  if (isLoading) {
    return <Loading />;
  }
  
  if (error) {
    return (
      <div className="error-container">
        <Icon icon="error" />
        <div>加载失败：{error.data?.message || error.error}</div>
        <Button onClick={() => window.location.reload()}>重试</Button>
      </div>
    );
  }
  
  return <PostDetail data={data} />;
};
```

## 性能优化

### 1. 图片懒加载

```typescript
// src/components/Common/Image/Image.tsx
import { useState, useEffect, useRef } from 'react';

interface ImageProps {
  src: string;
  alt: string;
  className?: string;
}

const LazyImage = ({ src, alt, className }: ImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsInView(true);
          observer.unobserve(imgRef.current!);
        }
      },
      { rootMargin: '100px' }
    );
    
    if (imgRef.current) {
      observer.observe(imgRef.current);
    }
    
    return () => {
      if (imgRef.current) {
        observer.unobserve(imgRef.current);
      }
    };
  }, []);
  
  return (
    <div className={`lazy-image ${className}`}>
      {!isLoaded && <Skeleton className="image-skeleton" />}
      <img
        ref={imgRef}
        src={isInView ? src : ''}
        alt={alt}
        onLoad={() => setIsLoaded(true)}
        className={`image ${isLoaded ? 'loaded' : 'loading'}`}
      />
    </div>
  );
};

export default LazyImage;
```

### 2. 防抖和节流

```typescript
// src/utils/debounce.ts
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

// src/utils/throttle.ts
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let lastTime = 0;
  
  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastTime >= delay) {
      lastTime = now;
      func(...args);
    }
  };
}
```

## 测试策略

### 单元测试

```typescript
// src/components/Common/Button/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import Button from './index';

describe('Button component', () => {
  test('renders button with text', () => {
    render(<Button>Click Me</Button>);
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });
  
  test('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click Me</Button>);
    fireEvent.click(screen.getByText('Click Me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
  
  test('renders disabled button', () => {
    render(<Button disabled>Click Me</Button>);
    expect(screen.getByText('Click Me')).toBeDisabled();
  });
});
```

### 端到端测试

```typescript
// cypress/e2e/post.spec.cy.ts
describe('Post management', () => {
  before(() => {
    cy.login('test@example.com', 'password123');
  });
  
  it('should create a new post', () => {
    cy.visit('/posts/create');
    cy.get('[name="title"]').type('My Cute Cat');
    cy.get('[name="content"]').type('This is my cute cat!');
    cy.get('button[type="submit"]').click();
    cy.contains('Post created successfully');
  });
  
  it('should view post detail', () => {
    cy.visit('/posts');
    cy.contains('My Cute Cat').click();
    cy.url().should('include', '/posts/');
    cy.contains('My Cute Cat').should('be.visible');
  });
  
  it('should search posts', () => {
    cy.visit('/');
    cy.get('[placeholder="Search posts"]').type('cat');
    cy.get('.search-button').click();
    cy.url().should('include', '/search?q=cat');
    cy.contains('My Cute Cat').should('be.visible');
  });
});
```

## 构建与部署

### Vite 配置

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3001,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  build: {
    outDir: 'build',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['antd', 'vant'],
          charts: ['echarts'],
        },
      },
    },
  },
});
```

### 环境变量

```env
# .env.development
VITE_API_URL=http://localhost:3000/api/v1
VITE_ENV=development
VITE_APP_TITLE=宠物论坛 - 开发环境

# .env.production
VITE_API_URL=https://api.petforum.com/api/v1
VITE_ENV=production
VITE_APP_TITLE=宠物论坛
```

---

**文档版本**: 1.0  
**创建时间**: 2026-04-24  
**最后更新**: 2026-04-24  
**作者**: Claude AI