# 用户个人中心 - 开发计划 (User Module)

## 📋 基本信息

| 项目 | 内容 |
|------|------|
| 模块名称 | 用户个人中心 (User Module) |
| 文件位置 | `frontend/src/features/user/` |
| 预估工期 | 3 天 |
| 优先级 | 🟡 中 |
| 依赖模块 | Auth Module |

---

## 🎯 功能清单

### 核心功能
- [ ] 用户个人资料页面
- [ ] 用户信息编辑
- [ ] 头像上传功能
- [ ] 密码修改
- [ ] 用户设置页面
- [ ] 我的宠物入口
- [ ] 我的帖子入口
- [ ] 我的收藏入口

---

## 📁 目录结构

```
src/features/user/
├── components/
│   ├── UserAvatar.tsx           # 用户头像组件
│   ├── UserProfileCard.tsx      # 用户资料卡片
│   ├── EditProfileForm.tsx      # 编辑资料表单
│   ├── ChangePasswordForm.tsx   # 修改密码表单
│   └── SideMenu.tsx             # 侧边栏菜单
├── hooks/
│   ├── useUpdateProfile.ts       # 更新个人资料 Hook
│   ├── useChangePassword.ts      # 修改密码 Hook
│   └── useUploadAvatar.ts        # 上传头像 Hook
├── pages/
│   ├── ProfilePage.tsx           # 个人资料主页面
│   ├── EditProfilePage.tsx       # 编辑资料页面
│   ├── SettingsPage.tsx          # 设置页面
│   ├── MyPetsPage.tsx            # 我的宠物（链接到宠物模块）
│   ├── MyPostsPage.tsx           # 我的帖子（链接到帖子模块）
│   └── MyFavoritesPage.tsx       # 我的收藏（链接到收藏模块）
├── types/
│   └── user.types.ts             # 用户相关类型定义
└── index.tsx                     # 模块入口
```

---

## 📝 详细开发任务

### 任务1: 用户模块类型定义
**文件**: `src/features/user/types/user.types.ts`  
**预估时间**: 30分钟

**任务内容**:
```typescript
// 1. 定义更新资料请求类型
export interface UpdateProfileRequest {
  nickname?: string;
  bio?: string;
  gender?: number;
  birthday?: string;
  city?: string;
}

// 2. 定义修改密码请求类型
export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

// 3. 定义用户设置类型
export interface UserSettings {
  notificationEnabled: boolean;
  emailNotificationEnabled: boolean;
  publicProfile: boolean;
}
```

---

### 任务2: 用户个人资料页面
**文件**: `src/features/user/pages/ProfilePage.tsx`  
**预估时间**: 2小时

**功能要求**:
1. 页面布局
   - 左侧侧边栏导航
   - 右侧主内容区域
   - 响应式设计

2. 显示用户信息
   - 头像展示
   - 用户名和昵称
   - 个人简介
   - 性别、生日、城市
   - 注册时间

3. 快捷操作按钮
   - 编辑资料
   - 修改密码
   - 设置

4. 统计信息
   - 宠物数量
   - 帖子数量
   - 收藏数量
   - 获赞总数

**UI 设计参考**:
```
┌─────────────────────────────────────────────┐
│ 🧑 个人中心                          [登出] │
├─────────────────────────────────────────────┤
│ 导航  │    用户资料卡片                    │
│       │                                     │
│ 👤    │ [头像]                            │
│ 资料  │  昵称：测试用户                     │
│       │  简介：热爱宠物，分享生活            │
│ 🐾    │                                     │
│ 宠物  │ [ 编辑资料 ] [ 修改密码 ]           │
│       │                                     │
│ 📝    │ 统计信息                            │
│ 帖子  │  🐾 宠物: 2 | 📝 帖子: 15           │
│       │  ❤️ 获赞: 120 | ⭐ 收藏: 25        │
│ ⭐    │                                     │
│ 收藏  │                                     │
│ ⚙️    │                                     │
│ 设置  │                                     │
└─────────────────────────────────────────────┘
```

---

### 任务3: 编辑资料页面
**文件**: `src/features/user/pages/EditProfilePage.tsx`  
**预估时间**: 2小时

**功能要求**:
1. 可编辑字段
   - 昵称 (2-20字符)
   - 个人简介 (最多500字符)
   - 性别 (单选: 未知、男、女)
   - 生日 (日期选择器)
   - 城市 (输入框)

2. 头像上传
   - 当前头像预览
   - 上传新头像按钮
   - 图片裁剪功能
   - 预览调整

3. 表单验证
   - 昵称长度验证
   - 简介长度验证
   - 日期格式验证

4. 保存功能
   - 保存按钮
   - 取消按钮
   - 保存成功提示
   - 保存失败处理

---

### 任务4: 修改密码页面
**文件**: `src/features/user/pages/ChangePasswordPage.tsx`  
**预估时间**: 1.5小时

**功能要求**:
1. 表单字段
   - 旧密码 (必填)
   - 新密码 (最少6位)
   - 确认新密码 (必填)

2. 验证功能
   - 旧密码正确性验证
   - 新密码强度提示
   - 两次密码一致性检查

3. 成功处理
   - 修改成功提示
   - 自动清除旧 Token
   - 跳转重新登录

---

### 任务5: 用户设置页面
**文件**: `src/features/user/pages/SettingsPage.tsx`  
**预估时间**: 1.5小时

**功能要求**:
1. 通知设置
   - 开启/关闭推送通知
   - 开启/关闭邮件通知

2. 隐私设置
   - 公开个人资料
   - 允许评论
   - 允许点赞

3. 账户设置
   - 绑定邮箱
   - 绑定手机号
   - 注销账号 (危险操作，二次确认)

---

### 任务6: 用户头像组件
**文件**: `src/features/user/components/UserAvatar.tsx`  
**预估时间**: 45分钟

**功能要求**:
1. 显示用户头像
   - 支持图片 URL
   - 支持默认头像 (DiceBear)
   - 支持不同尺寸 (xs, sm, md, lg, xl)

2. 支持头像上传
   - 点击上传
   - 拖拽上传
   - 图片裁剪

---

### 任务7: 侧边栏菜单组件
**文件**: `src/features/user/components/SideMenu.tsx`  
**预估时间**: 1小时

**功能要求**:
1. 菜单项
   - 个人资料
   - 我的宠物
   - 我的帖子
   - 我的收藏
   - 账户设置

2. 交互效果
   - 当前高亮
   - 点击跳转
   - 悬停效果

---

### 任务8: 更新个人资料 Hook
**文件**: `src/features/user/hooks/useUpdateProfile.ts`  
**预估时间**: 1小时

**功能要求**:
1. 调用更新资料 API
2. 更新 Redux 中的用户信息
3. 错误处理
4. 成功提示
5. 加载状态管理

---

### 任务9: 修改密码 Hook
**文件**: `src/features/user/hooks/useChangePassword.ts`  
**预估时间**: 45分钟

**功能要求**:
1. 调用修改密码 API
2. 成功后清除本地 Token
3. 跳转到登录页面
4. 错误处理
5. 加载状态管理

---

### 任务10: 上传头像 Hook
**文件**: `src/features/user/hooks/useUploadAvatar.ts`  
**预估时间**: 1小时

**功能要求**:
1. 调用文件上传 API
2. 上传进度显示
3. 成功后更新用户信息
4. 错误处理
5. 支持图片裁剪

---

### 任务11: 路由配置更新
**文件**: `src/router/index.tsx`  
**预估时间**: 30分钟

**任务内容**:
1. 添加个人资料路由 `/profile`
2. 添加编辑资料路由 `/profile/edit`
3. 添加修改密码路由 `/profile/change-password`
4. 添加设置页面路由 `/profile/settings`
5. 添加我的宠物路由 `/profile/pets`
6. 添加我的帖子路由 `/profile/posts`
7. 添加我的收藏路由 `/profile/favorites`

---

## 🧪 测试用例

### 个人资料测试
- [ ] 用户信息正确显示
- [ ] 编辑资料功能正常
- [ ] 头像上传功能正常
- [ ] 修改密码功能正常

### 设置页面测试
- [ ] 通知开关正常工作
- [ ] 隐私设置正常保存
- [ ] 注销账号有二次确认

---

## ✅ 验收标准

### 功能验收
- [ ] 用户可以查看个人资料
- [ ] 用户可以编辑个人资料
- [ ] 用户可以上传头像
- [ ] 用户可以修改密码
- [ ] 用户可以调整设置
- [ ] 所有数据正确同步

### UI/UX 验收
- [ ] 页面美观，响应式适配
- [ ] 操作流程顺畅自然
- [ ] 表单验证友好提示
- [ ] 加载状态正确显示
- [ ] 错误处理完善友好

---

## 📅 时间表

| 日期 | 任务 | 负责人 | 状态 |
|------|------|--------|------|
| Day1 | 类型定义 + 资料页面 | Frontend | 🔄 进行中 |
| Day2 | 编辑资料 + 修改密码 | Frontend | ⏳ 待开始 |
| Day3 | 设置页面 + Hook | Frontend | ⏳ 待开始 |

---

**文档版本**: v1.0  
**创建时间**: 2026-04-24  
**状态**: 🚀 准备开发
