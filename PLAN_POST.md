# 帖子管理系统 - 开发计划 (Post Module)

## 📋 基本信息

| 项目 | 内容 |
|------|------|
| 模块名称 | 帖子管理系统 (Post Module) |
| 文件位置 | `frontend/src/features/post/` |
| 预估工期 | 5 天 |
| 优先级 | 🔴 高 |
| 依赖模块 | Auth Module, Pet Module |

---

## 🎯 功能清单

### 核心功能
- [ ] 帖子列表页面
- [ ] 帖子详情页面
- [ ] 发布帖子页面
- [ ] 编辑帖子功能
- [ ] 删除帖子功能
- [ ] 帖子搜索功能
- [ ] 帖子分类筛选
- [ ] 帖子点赞功能
- [ ] 帖子收藏功能

---

## 📁 目录结构

```
src/features/post/
├── components/
│   ├── PostCard.tsx           # 帖子卡片组件
│   ├── PostList.tsx           # 帖子列表组件
│   ├── PostDetail.tsx         # 帖子详情组件
│   ├── PostForm.tsx           # 帖子表单组件
│   ├── PostFilters.tsx        # 筛选组件
│   ├── PostActions.tsx        # 操作按钮组件
│   └── PostTags.tsx           # 标签组件
├── hooks/
│   ├── useGetPosts.ts         # 获取帖子列表 Hook
│   ├── useGetPost.ts          # 获取帖子详情 Hook
│   ├── useCreatePost.ts       # 发布帖子 Hook
│   ├── useUpdatePost.ts       # 更新帖子 Hook
│   ├── useDeletePost.ts       # 删除帖子 Hook
│   ├── useLikePost.ts         # 点赞 Hook
│   └── useFavoritePost.ts     # 收藏 Hook
├── pages/
│   ├── PostListPage.tsx       # 帖子列表页面
│   ├── PostDetailPage.tsx     # 帖子详情页面
│   ├── CreatePostPage.tsx     # 发布帖子页面
│   └── EditPostPage.tsx       # 编辑帖子页面
├── types/
│   └── post.types.ts         # 帖子相关类型定义
└── index.tsx                 # 模块入口
```

---

## 📝 详细开发任务

### 任务1: 帖子模块类型定义
**文件**: `src/features/post/types/post.types.ts`  
**预估时间**: 45分钟

**任务内容**:
```typescript
// 1. 定义帖子基本类型
export interface Post {
  id: number;
  userId: number;
  petId?: number;
  title: string;
  content: string;
  coverUrl?: string;
  tags: string[];
  category: string;
  status: number;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  createdAt: string;
  updatedAt: string;
  user?: User;
  pet?: Pet;
}

// 2. 定义获取帖子列表请求类型
export interface GetPostsParams {
  page?: number;
  limit?: number;
  category?: string;
  tag?: string;
  search?: string;
  sortBy?: 'createdAt' | 'likeCount' | 'viewCount';
  sortOrder?: 'asc' | 'desc';
}

// 3. 定义创建帖子请求类型
export interface CreatePostRequest {
  title: string;
  content: string;
  petId?: number;
  tags?: string[];
  category?: string;
}

// 4. 定义更新帖子请求类型
export interface UpdatePostRequest extends Partial<CreatePostRequest> {
  id: number;
}
```

---

### 任务2: 帖子列表页面
**文件**: `src/features/post/pages/PostListPage.tsx`  
**预估时间**: 2小时

**功能要求**:
1. 顶部搜索栏
   - 搜索输入框
   - 分类筛选下拉
   - 标签筛选

2. 帖子列表
   - 瀑布流/卡片布局
   - 无限滚动加载
   - 加载更多提示

3. 排序选项
   - 最新发布
   - 最多点赞
   - 最多浏览

4. 筛选功能
   - 分类筛选
   - 标签筛选
   - 搜索筛选

**UI 设计参考**:
```
┌─────────────────────────────────────┐
│ 搜索框...  [筛选] [最新] [点赞]      │
├─────────────────────────────────────┤
│                                     │
│ [帖子卡片]  [帖子卡片]  [帖子卡片]    │
│                                     │
│ [帖子卡片]  [帖子卡片]  [帖子卡片]    │
│                                     │
│  [ 加载更多... ]                   │
└─────────────────────────────────────┘
```

---

### 任务3: 帖子详情页面
**文件**: `src/features/post/pages/PostDetailPage.tsx`  
**预估时间**: 2.5小时

**功能要求**:
1. 帖子详情展示
   - 作者信息卡片
   - 帖子标题和内容
   - 相关宠物信息
   - 标签展示
   - 发布时间和浏览量

2. 交互操作
   - 点赞按钮
   - 收藏按钮
   - 分享按钮
   - 评论入口

3. 帖子操作 (如果是自己的帖子)
   - 编辑按钮
   - 删除按钮

4. 评论区
   - 评论列表展示
   - 发表评论框
   - 评论分页

---

### 任务4: 发布帖子页面
**文件**: `src/features/post/pages/CreatePostPage.tsx`  
**预估时间**: 2.5小时

**功能要求**:
1. 标题输入
   - 字数限制 (1-200字符)
   - 实时计数

2. 内容编辑
   - 富文本编辑器
   - 支持图片插入
   - 字数统计

3. 宠物关联
   - 选择关联宠物 (可选项)
   - 宠物信息展示

4. 标签和分类
   - 标签输入/选择
   - 分类选择

5. 预览功能
   - 发布前预览
   - 内容展示

6. 操作按钮
   - 保存草稿
   - 立即发布
   - 取消

---

### 任务5: 编辑帖子页面
**文件**: `src/features/post/pages/EditPostPage.tsx`  
**预估时间**: 2小时

**功能要求**:
1. 预填充表单数据
2. 与发布页面类似的编辑功能
3. 删除帖子选项

---

### 任务6: 帖子卡片组件
**文件**: `src/features/post/components/PostCard.tsx`  
**预估时间**: 1.5小时

**功能要求**:
1. 卡片布局
   - 封面图展示
   - 标题展示
   - 内容预览
   - 标签展示

2. 信息展示
   - 作者信息
   - 发布时间
   - 点赞数
   - 评论数
   - 浏览数

3. 操作按钮
   - 点击进入详情

---

### 任务7: 获取帖子列表 Hook
**文件**: `src/features/post/hooks/useGetPosts.ts`  
**预估时间**: 1小时

**功能要求**:
1. 调用获取帖子列表 API
2. 支持分页
3. 支持筛选和搜索
4. 无限滚动支持
5. 数据缓存

---

### 任务8: 获取帖子详情 Hook
**文件**: `src/features/post/hooks/useGetPost.ts`  
**预估时间**: 45分钟

**功能要求**:
1. 调用获取帖子详情 API
2. 自动增加浏览计数
3. 错误处理
4. 加载状态

---

### 任务9: 发布帖子 Hook
**文件**: `src/features/post/hooks/useCreatePost.ts`  
**预估时间**: 1.5小时

**功能要求**:
1. 调用发布帖子 API
2. 成功后跳转详情页
3. 错误处理
4. 加载状态管理

---

### 任务10: 更新帖子 Hook
**文件**: `src/features/post/hooks/useUpdatePost.ts`  
**预估时间**: 1小时

**功能要求**:
1. 调用更新帖子 API
2. 更新缓存数据
3. 错误处理
4. 加载状态管理

---

### 任务11: 删除帖子 Hook
**文件**: `src/features/post/hooks/useDeletePost.ts`  
**预估时间**: 45分钟

**功能要求**:
1. 调用删除帖子 API
2. 二次确认提示
3. 成功后跳转列表页
4. 错误处理

---

### 任务12: 点赞帖子 Hook
**文件**: `src/features/post/hooks/useLikePost.ts`  
**预估时间**: 45分钟

**功能要求**:
1. 调用点赞/取消点赞 API
2. 更新点赞数量
3. 动画反馈
4. 错误处理

---

### 任务13: 收藏帖子 Hook
**文件**: `src/features/post/hooks/useFavoritePost.ts`  
**预估时间**: 45分钟

**功能要求**:
1. 调用收藏/取消收藏 API
2. 更新收藏状态
3. 动画反馈
4. 错误处理

---

### 任务14: 路由配置更新
**文件**: `src/router/index.tsx`  
**预估时间**: 30分钟

**任务内容**:
1. 添加帖子列表路由 `/posts`
2. 添加帖子详情路由 `/posts/:id`
3. 添加发布帖子路由 `/posts/create`
4. 添加编辑帖子路由 `/posts/:id/edit`
5. 在导航栏添加帖子入口

---

## 🧪 测试用例

### 帖子管理测试
- [ ] 帖子列表正常加载
- [ ] 搜索功能正常工作
- [ ] 筛选功能正常
- [ ] 发布帖子成功
- [ ] 编辑帖子成功
- [ ] 删除帖子成功
- [ ] 点赞功能正常
- [ ] 收藏功能正常

---

## ✅ 验收标准

### 功能验收
- [ ] 用户可以浏览帖子列表
- [ ] 用户可以搜索和筛选帖子
- [ ] 用户可以查看帖子详情
- [ ] 登录用户可以发布帖子
- [ ] 作者可以编辑和删除自己的帖子
- [ ] 用户可以点赞和收藏帖子
- [ ] 所有交互流畅自然

---

## 📅 时间表

| 日期 | 任务 | 负责人 | 状态 |
|------|------|--------|------|
| Day1 | 类型定义 + 列表页面 | Frontend | 🔄 进行中 |
| Day2 | 详情页面 + 表单页面 | Frontend | ⏳ 待开始 |
| Day3 | 组件 + Hook (上) | Frontend | ⏳ 待开始 |
| Day4 | 组件 + Hook (下) | Frontend | ⏳ 待开始 |
| Day5 | 路由 + 测试 | Frontend | ⏳ 待开始 |

---

**文档版本**: v1.0  
**创建时间**: 2026-04-24  
**状态**: 🚀 准备开发
