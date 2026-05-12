# 评论系统 - 开发计划 (Comment Module)

## 📋 基本信息

| 项目 | 内容 |
|------|------|
| 模块名称 | 评论系统 (Comment Module) |
| 文件位置 | `frontend/src/features/comment/` |
| 预估工期 | 3 天 |
| 优先级 | 🟡 中 |
| 依赖模块 | Auth Module, Post Module |

---

## 🎯 功能清单

### 核心功能
- [ ] 评论列表展示
- [ ] 添加评论功能
- [ ] 删除评论功能
- [ ] 回复评论功能
- [ ] 评论点赞功能

---

## 📁 目录结构

```
src/features/comment/
├── components/
│   ├── CommentCard.tsx         # 评论卡片组件
│   ├── CommentList.tsx         # 评论列表组件
│   ├── CommentForm.tsx         # 评论表单组件
│   ├── CommentReplies.tsx      # 评论回复组件
│   └── CommentActions.tsx      # 评论操作组件
├── hooks/
│   ├── useGetComments.ts       # 获取评论列表 Hook
│   ├── useCreateComment.ts     # 发表评论 Hook
│   ├── useUpdateComment.ts     # 更新评论 Hook
│   ├── useDeleteComment.ts     # 删除评论 Hook
│   └── useLikeComment.ts       # 点赞评论 Hook
├── pages/
│   ├── CommentSection.tsx      # 评论区域 (组件化)
│   └── CommentListPage.tsx     # 评论列表页面
├── types/
│   └── comment.types.ts        # 评论相关类型定义
└── index.tsx                   # 模块入口
```

---

## 📝 详细开发任务

### 任务1: 评论模块类型定义
**文件**: `src/features/comment/types/comment.types.ts`  
**预估时间**: 30分钟

**任务内容**:
```typescript
// 1. 定义评论基本类型
export interface Comment {
  id: number;
  userId: number;
  postId: number;
  parentId?: number;
  content: string;
  status: number;
  likeCount: number;
  createdAt: string;
  updatedAt: string;
  user?: User;
  replies?: Comment[];
}

// 2. 定义创建评论请求类型
export interface CreateCommentRequest {
  postId: number;
  content: string;
  parentId?: number;
}

// 3. 定义更新评论请求类型
export interface UpdateCommentRequest extends Partial<CreateCommentRequest> {
  id: number;
}
```

---

### 任务2: 评论卡片组件
**文件**: `src/features/comment/components/CommentCard.tsx`  
**预估时间**: 1小时

**功能要求**:
1. 评论内容展示
   - 用户头像
   - 用户昵称
   - 评论内容
   - 发布时间
   - 点赞数

2. 评论操作
   - 点赞按钮
   - 回复按钮
   - 删除按钮 (如果是自己的评论)

3. 回复展示
   - 回复展开/收起
   - 回复内容展示

---

### 任务3: 评论列表组件
**文件**: `src/features/comment/components/CommentList.tsx`  
**预估时间**: 1.5小时

**功能要求**:
1. 评论列表展示
   - 支持分页加载
   - 支持无限滚动

2. 回复层级
   - 支持多级回复
   - 回复缩进效果

3. 加载状态
   - 加载更多提示
   - 加载失败处理

---

### 任务4: 评论表单组件
**文件**: `src/features/comment/components/CommentForm.tsx`  
**预估时间**: 1小时

**功能要求**:
1. 评论输入框
   - 支持多行输入
   - 字符数限制和计数

2. 发送按钮
   - 输入时激活
   - 发送中状态

3. 表单验证
   - 内容不能为空
   - 字符数限制

---

### 任务5: 获取评论列表 Hook
**文件**: `src/features/comment/hooks/useGetComments.ts`  
**预估时间**: 45分钟

**功能要求**:
1. 调用获取评论列表 API
2. 支持分页和加载更多
3. 加载状态管理
4. 错误处理

---

### 任务6: 发表评论 Hook
**文件**: `src/features/comment/hooks/useCreateComment.ts`  
**预估时间**: 45分钟

**功能要求**:
1. 调用发表评论 API
2. 成功后更新列表
3. 错误处理
4. 加载状态管理

---

### 任务7: 删除评论 Hook
**文件**: `src/features/comment/hooks/useDeleteComment.ts`  
**预估时间**: 30分钟

**功能要求**:
1. 调用删除评论 API
2. 成功后更新列表
3. 错误处理

---

### 任务8: 评论点赞 Hook
**文件**: `src/features/comment/hooks/useLikeComment.ts`  
**预估时间**: 30分钟

**功能要求**:
1. 调用点赞/取消点赞 API
2. 更新点赞计数
3. 错误处理

---

### 任务9: 评论区域组件
**文件**: `src/features/comment/pages/CommentSection.tsx`  
**预估时间**: 1.5小时

**功能要求**:
1. 集成所有评论组件
2. 支持嵌套评论展示
3. 支持评论操作
4. 可用于帖子详情页面

**使用示例**:
```tsx
<CommentSection 
  postId={postId}
  currentUserId={currentUser?.id}
  initialComments={post?.comments}
/>
```

---

### 任务10: 评论列表页面
**文件**: `src/features/comment/pages/CommentListPage.tsx`  
**预估时间**: 1小时

**功能要求**:
1. 独立的评论列表页面
2. 支持搜索和筛选
3. 支持排序

---

## 🧪 测试用例

### 评论管理测试
- [ ] 成功获取评论列表
- [ ] 成功发表评论
- [ ] 成功删除评论
- [ ] 成功回复评论
- [ ] 成功点赞评论
- [ ] 评论层级显示正确

---

## ✅ 验收标准

### 功能验收
- [ ] 用户可以查看评论列表
- [ ] 登录用户可以发表评论
- [ ] 用户可以回复评论
- [ ] 用户可以删除自己的评论
- [ ] 用户可以点赞评论
- [ ] 评论按照层级正确显示

### UI/UX 验收
- [ ] 评论卡片布局美观
- [ ] 回复层级缩进清晰
- [ ] 操作反馈及时
- [ ] 加载和错误状态正确处理

---

## 📅 时间表

| 日期 | 任务 | 负责人 | 状态 |
|------|------|--------|------|
| Day1 | 类型定义 + 组件基础 | Frontend | 🔄 进行中 |
| Day2 | Hook + 列表页面 | Frontend | ⏳ 待开始 |
| Day3 | 测试 + 优化 | Frontend | ⏳ 待开始 |

---

**文档版本**: v1.0  
**创建时间**: 2026-04-24  
**状态**: 🚀 准备开发
