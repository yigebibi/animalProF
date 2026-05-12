# 通知系统 - 开发计划 (Notification Module)

## 📋 基本信息

| 项目 | 内容 |
|------|------|
| 模块名称 | 通知系统 (Notification Module) |
| 文件位置 | `frontend/src/features/notification/` |
| 预估工期 | 2 天 |
| 优先级 | 🟢 低 |
| 依赖模块 | Auth Module |

---

## 🎯 功能清单

### 核心功能
- [ ] 通知列表页面
- [ ] 通知详情页面
- [ ] 标记已读功能
- [ ] 删除通知功能
- [ ] 通知数量显示

---

## 📁 目录结构

```
src/features/notification/
├── components/
│   ├── NotificationBadge.tsx     # 通知徽章组件
│   ├── NotificationItem.tsx      # 通知项组件
│   ├── NotificationList.tsx      # 通知列表组件
│   └── NotificationDetail.tsx    # 通知详情组件
├── hooks/
│   ├── useGetNotifications.ts    # 获取通知列表 Hook
│   ├── useMarkAsRead.ts          # 标记已读 Hook
│   ├── useDeleteNotification.ts  # 删除通知 Hook
│   └── useMarkAllAsRead.ts       # 标记全部已读 Hook
├── pages/
│   ├── NotificationPage.tsx      # 通知列表页面
│   └── NotificationDetailPage.tsx # 通知详情页面
├── types/
│   └── notification.types.ts     # 通知相关类型定义
└── index.tsx                     # 模块入口
```

---

## 📝 详细开发任务

### 任务1: 通知模块类型定义
**文件**: `src/features/notification/types/notification.types.ts`  
**预估时间**: 30分钟

**任务内容**:
```typescript
// 1. 定义通知类型
export interface Notification {
  id: number;
  userId: number;
  type: string; // like:点赞, comment:评论, follow:关注, system:系统
  content: string;
  relatedId?: number;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

// 2. 定义获取通知请求类型
export interface GetNotificationsRequest {
  page?: number;
  limit?: number;
  unread?: boolean;
}

// 3. 定义通知响应类型
export interface GetNotificationsResponse {
  items: Notification[];
  unreadCount: number;
  total: number;
  page: number;
  limit: number;
}
```

---

### 任务2: 通知徽章组件
**文件**: `src/features/notification/components/NotificationBadge.tsx`  
**预估时间**: 45分钟

**功能要求**:
1. 显示未读通知数量
2. 位置可配置 (右上角)
3. 点击跳转通知页面
4. 动画效果

**使用示例**:
```tsx
<NotificationBadge 
  unreadCount={5} 
  onClick={() => navigate('/notifications')}
/>
```

---

### 任务3: 通知项组件
**文件**: `src/features/notification/components/NotificationItem.tsx`  
**预估时间**: 1小时

**功能要求**:
1. 通知内容展示
2. 通知类型图标
3. 是否已读状态
4. 点击跳转
5. 时间显示

**通知类型处理**:
- 点赞: ❤️ 有人点赞了你的帖子
- 评论: 💬 有人评论了你的帖子
- 回复: 💬 有人回复了你的评论
- 关注: 👤 有人关注了你
- 系统: 📢 系统通知

---

### 任务4: 通知列表组件
**文件**: `src/features/notification/components/NotificationList.tsx`  
**预估时间**: 1.5小时

**功能要求**:
1. 通知列表展示
2. 支持分页加载
3. 未读/已读筛选
4. 加载状态管理

---

### 任务5: 获取通知列表 Hook
**文件**: `src/features/notification/hooks/useGetNotifications.ts`  
**预估时间**: 45分钟

**功能要求**:
1. 调用获取通知列表 API
2. 支持分页和筛选
3. 加载状态管理
4. 错误处理

---

### 任务6: 标记已读 Hook
**文件**: `src/features/notification/hooks/useMarkAsRead.ts`  
**预估时间**: 30分钟

**功能要求**:
1. 调用标记已读 API
2. 更新通知状态
3. 错误处理

---

### 任务7: 标记全部已读 Hook
**文件**: `src/features/notification/hooks/useMarkAllAsRead.ts`  
**预估时间**: 30分钟

**功能要求**:
1. 调用标记全部已读 API
2. 更新所有通知状态
3. 错误处理

---

### 任务8: 删除通知 Hook
**文件**: `src/features/notification/hooks/useDeleteNotification.ts`  
**预估时间**: 30分钟

**功能要求**:
1. 调用删除通知 API
2. 更新通知列表
3. 错误处理

---

### 任务9: 通知列表页面
**文件**: `src/features/notification/pages/NotificationPage.tsx`  
**预估时间**: 1.5小时

**功能要求**:
1. 通知列表展示
2. 未读/已读筛选
3. 标记全部已读按钮
4. 加载状态显示

**UI 设计参考**:
```
┌─────────────────────────────────────┐
│ 通知                       [全部已读]│
├─────────────────────────────────────┤
│                                     │
│ [未读] [全部] [点赞] [评论] [系统]   │
│                                     │
│ 📢 [系统] 欢迎来到宠物论坛            │
│    2026-04-24 10:30                │
│                                     │
│ ❤️ [点赞] 有人点赞了你的帖子         │
│    2026-04-24 09:15                │
│                                     │
│ 💬 [评论] 有人评论了你的帖子         │
│    2026-04-24 08:45                │
│                                     │
│  [ 加载更多... ]                   │
└─────────────────────────────────────┘
```

---

### 任务10: 通知详情页面
**文件**: `src/features/notification/pages/NotificationDetailPage.tsx`  
**预估时间**: 1小时

**功能要求**:
1. 通知详情展示
2. 相关内容跳转
3. 删除通知按钮

---

### 任务11: 路由配置更新
**文件**: `src/router/index.tsx`  
**预估时间**: 30分钟

**任务内容**:
1. 添加通知列表路由 `/notifications`
2. 添加通知详情路由 `/notifications/:id`
3. 在用户中心导航中添加通知入口

---

## 🧪 测试用例

### 通知功能测试
- [ ] 成功获取通知列表
- [ ] 成功标记已读
- [ ] 成功标记全部已读
- [ ] 成功删除通知
- [ ] 未读数量正确显示

---

## ✅ 验收标准

### 功能验收
- [ ] 用户可以查看通知列表
- [ ] 用户可以查看通知详情
- [ ] 用户可以标记通知已读
- [ ] 用户可以删除通知
- [ ] 通知数量正确显示

### UI/UX 验收
- [ ] 通知徽章显示正确
- [ ] 通知列表布局美观
- [ ] 通知类型图标明确
- [ ] 操作反馈及时

---

## 📅 时间表

| 日期 | 任务 | 负责人 | 状态 |
|------|------|--------|------|
| Day1 | 类型定义 + 徽章组件 | Frontend | 🔄 进行中 |
| Day2 | 列表页面 + Hook + 路由 | Frontend | ⏳ 待开始 |

---

**文档版本**: v1.0  
**创建时间**: 2026-04-24  
**状态**: 🚀 准备开发
