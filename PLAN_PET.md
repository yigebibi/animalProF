# 宠物管理系统 - 开发计划 (Pet Module)

## 📋 基本信息

| 项目 | 内容 |
|------|------|
| 模块名称 | 宠物管理系统 (Pet Module) |
| 文件位置 | `frontend/src/features/pet/` |
| 预估工期 | 3 天 |
| 优先级 | 🟡 中 |
| 依赖模块 | Auth Module |

---

## 🎯 功能清单

### 核心功能
- [ ] 我的宠物列表
- [ ] 添加宠物页面
- [ ] 编辑宠物信息
- [ ] 删除宠物功能
- [ ] 宠物详情页面
- [ ] 宠物分类展示

---

## 📁 目录结构

```
src/features/pet/
├── components/
│   ├── PetCard.tsx            # 宠物卡片组件
│   ├── PetList.tsx            # 宠物列表组件
│   ├── PetForm.tsx            # 宠物表单组件
│   └── PetDetail.tsx          # 宠物详情组件
├── hooks/
│   ├── useGetPets.ts          # 获取宠物列表 Hook
│   ├── useCreatePet.ts        # 添加宠物 Hook
│   ├── useUpdatePet.ts        # 更新宠物 Hook
│   └── useDeletePet.ts        # 删除宠物 Hook
├── pages/
│   ├── MyPetsPage.tsx         # 我的宠物页面
│   ├── AddPetPage.tsx         # 添加宠物页面
│   ├── EditPetPage.tsx        # 编辑宠物页面
│   └── PetDetailPage.tsx      # 宠物详情页面
├── types/
│   └── pet.types.ts           # 宠物相关类型定义
└── index.tsx                  # 模块入口
```

---

## 📝 详细开发任务

### 任务1: 宠物模块类型定义
**文件**: `src/features/pet/types/pet.types.ts`  
**预估时间**: 30分钟

**任务内容**:
```typescript
// 1. 定义宠物基本类型
export interface Pet {
  id: number;
  userId: number;
  name: string;
  type: string;
  breed?: string;
  gender?: number;
  birthday?: string;
  avatarUrl?: string;
  bio?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// 2. 定义创建宠物请求类型
export interface CreatePetRequest {
  name: string;
  type: string;
  breed?: string;
  gender?: number;
  birthday?: string;
  avatarUrl?: string;
  bio?: string;
}

// 3. 定义更新宠物请求类型
export interface UpdatePetRequest extends Partial<CreatePetRequest> {
  id: number;
}
```

---

### 任务2: 我的宠物页面
**文件**: `src/features/pet/pages/MyPetsPage.tsx`  
**预估时间**: 2小时

**功能要求**:
1. 页面布局
   - 顶部操作栏
   - 宠物列表区域
   - 响应式设计

2. 列表展示
   - 宠物卡片网格布局
   - 宠物基本信息
   - 状态指示（激活/禁用）

3. 操作按钮
   - 添加宠物按钮
   - 编辑按钮
   - 删除按钮
   - 查看详情按钮

4. 空状态
   - 未添加宠物时的提示
   - 引导用户添加宠物

**UI 设计参考**:
```
┌───────────────────────────────────────────┐
│ 我的宠物                        [添加宠物]│
├───────────────────────────────────────────┤
│ 宠物卡片网格                               │
│                                           │
│ [🐕 小白        ]  [🐱 小黑        ]        │
│ [类型: 狗]       [类型: 猫]             │
│ [品种: 金毛]      [品种: 橘猫]           │
│ [性别: 公]        [性别: 母]            │
│                                           │
│                                           │
│ [没有添加宠物?]                           │
│ 快来添加你的第一个宠物吧！                │
│                                           │
│ [ 添加我的第一个宠物 ]                    │
└───────────────────────────────────────────┘
```

---

### 任务3: 添加宠物页面
**文件**: `src/features/pet/pages/AddPetPage.tsx`  
**预估时间**: 2小时

**功能要求**:
1. 宠物基本信息
   - 名字 (必填, 1-100字符)
   - 类型 (必填, 下拉选择)
   - 品种 (可选)
   - 性别 (单选: 未知、公、母)

2. 详细信息
   - 生日 (日期选择)
   - 头像上传
   - 简介 (可选, 最多500字符)

3. 表单验证
   - 名字长度验证
   - 类型必填验证
   - 日期格式验证

4. 操作按钮
   - 保存按钮
   - 取消按钮
   - 保存成功提示

---

### 任务4: 编辑宠物页面
**文件**: `src/features/pet/pages/EditPetPage.tsx`  
**预估时间**: 1.5小时

**功能要求**:
1. 预填充表单数据
2. 与添加页面类似的表单
3. 支持修改所有字段
4. 删除宠物按钮 (危险操作)

---

### 任务5: 宠物详情页面
**文件**: `src/features/pet/pages/PetDetailPage.tsx`  
**预估时间**: 2小时

**功能要求**:
1. 宠物信息展示
   - 头像展示
   - 基本信息卡片
   - 详细信息展示

2. 相关信息
   - 该宠物的所有帖子
   - 该宠物的评论

3. 操作按钮
   - 编辑按钮
   - 分享按钮

---

### 任务6: 宠物卡片组件
**文件**: `src/features/pet/components/PetCard.tsx`  
**预估时间**: 1小时

**功能要求**:
1. 显示宠物头像
2. 显示宠物基本信息
3. 提供操作按钮
4. 支持不同尺寸

---

### 任务7: 宠物表单组件
**文件**: `src/features/pet/components/PetForm.tsx`  
**预估时间**: 2小时

**功能要求**:
1. 完整的表单实现
2. 支持创建和编辑模式
3. 表单验证
4. 头像上传和预览

---

### 任务8: 获取宠物列表 Hook
**文件**: `src/features/pet/hooks/useGetPets.ts`  
**预估时间**: 45分钟

**功能要求**:
1. 调用获取宠物列表 API
2. 管理加载状态
3. 错误处理
4. 数据缓存

---

### 任务9: 添加宠物 Hook
**文件**: `src/features/pet/hooks/useCreatePet.ts`  
**预估时间**: 45分钟

**功能要求**:
1. 调用添加宠物 API
2. 成功后更新列表
3. 错误处理
4. 加载状态管理

---

### 任务10: 更新宠物 Hook
**文件**: `src/features/pet/hooks/useUpdatePet.ts`  
**预估时间**: 45分钟

**功能要求**:
1. 调用更新宠物 API
2. 成功后更新列表
3. 错误处理
4. 加载状态管理

---

### 任务11: 删除宠物 Hook
**文件**: `src/features/pet/hooks/useDeletePet.ts`  
**预估时间**: 30分钟

**功能要求**:
1. 调用删除宠物 API
2. 成功后移除列表项
3. 错误处理
4. 二次确认提示

---

### 任务12: 路由配置更新
**文件**: `src/router/index.tsx`  
**预估时间**: 30分钟

**任务内容**:
1. 添加宠物列表路由 `/pets`
2. 添加宠物详情路由 `/pets/:id`
3. 添加添加宠物路由 `/pets/add`
4. 添加编辑宠物路由 `/pets/:id/edit`
5. 在用户中心导航中添加宠物入口

---

## 🧪 测试用例

### 宠物管理测试
- [ ] 成功获取宠物列表
- [ ] 成功添加新宠物
- [ ] 成功编辑宠物信息
- [ ] 成功删除宠物
- [ ] 表单验证正常工作
- [ ] 宠物详情页面正常显示

---

## ✅ 验收标准

### 功能验收
- [ ] 用户可以查看所有宠物
- [ ] 用户可以添加新宠物
- [ ] 用户可以编辑宠物信息
- [ ] 用户可以删除宠物
- [ ] 用户可以查看宠物详情

### UI/UX 验收
- [ ] 页面布局美观响应式
- [ ] 表单验证反馈友好
- [ ] 加载和错误状态正确
- [ ] 操作流程顺畅

---

## 📅 时间表

| 日期 | 任务 | 负责人 | 状态 |
|------|------|--------|------|
| Day1 | 类型定义 + 页面布局 | Frontend | 🔄 进行中 |
| Day2 | 表单组件 + Hook | Frontend | ⏳ 待开始 |
| Day3 | 详情页面 + 路由 | Frontend | ⏳ 待开始 |

---

**文档版本**: v1.0  
**创建时间**: 2026-04-24  
**状态**: 🚀 准备开发
