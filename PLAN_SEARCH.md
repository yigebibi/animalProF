# 搜索系统 - 开发计划 (Search Module)

## 📋 基本信息

| 项目 | 内容 |
|------|------|
| 模块名称 | 搜索系统 (Search Module) |
| 文件位置 | `frontend/src/features/search/` |
| 预估工期 | 2 天 |
| 优先级 | 🟡 中 |
| 依赖模块 | Post Module, User Module |

---

## 🎯 功能清单

### 核心功能
- [ ] 全局搜索页面
- [ ] 搜索结果展示
- [ ] 搜索历史记录
- [ ] 热门搜索词
- [ ] 搜索建议功能

---

## 📁 目录结构

```
src/features/search/
├── components/
│   ├── SearchBar.tsx           # 搜索栏组件
│   ├── SearchResults.tsx       # 搜索结果组件
│   ├── SearchHistory.tsx       # 搜索历史组件
│   ├── HotSearch.tsx           # 热门搜索组件
│   └── SearchSuggestions.tsx   # 搜索建议组件
├── hooks/
│   ├── useSearch.ts            # 搜索 Hook
│   ├── useSearchHistory.ts     # 搜索历史 Hook
│   └── useHotSearch.ts         # 热门搜索 Hook
├── pages/
│   ├── SearchPage.tsx          # 搜索主页面
│   └── SearchResultsPage.tsx   # 搜索结果页面
├── types/
│   └── search.types.ts         # 搜索相关类型定义
└── index.tsx                   # 模块入口
```

---

## 📝 详细开发任务

### 任务1: 搜索模块类型定义
**文件**: `src/features/search/types/search.types.ts`  
**预估时间**: 30分钟

**任务内容**:
```typescript
// 1. 定义搜索请求类型
export interface SearchRequest {
  q: string;
  type?: 'post' | 'user' | 'tag' | 'all';
}

// 2. 定义搜索响应类型
export interface SearchResponse {
  posts: Post[];
  users: User[];
  tags: Tag[];
}

// 3. 定义搜索历史类型
export interface SearchHistoryItem {
  id: string;
  query: string;
  timestamp: string;
}

// 4. 定义热门搜索类型
export interface HotSearchItem {
  id: string;
  query: string;
  count: number;
  trend?: 'up' | 'down' | 'flat';
}

// 5. 定义搜索建议类型
export interface SearchSuggestion {
  query: string;
  type?: 'post' | 'user' | 'tag';
  count?: number;
}
```

---

### 任务2: 搜索栏组件
**文件**: `src/features/search/components/SearchBar.tsx`  
**预估时间**: 1小时

**功能要求**:
1. 搜索输入
   - 支持即时搜索
   - 支持回车搜索
   - 清除功能

2. 搜索建议
   - 输入时显示搜索建议
   - 支持点击建议

3. 快捷键支持
   - Ctrl/K 聚焦搜索

---

### 任务3: 搜索结果组件
**文件**: `src/features/search/components/SearchResults.tsx`  
**预估时间**: 1.5小时

**功能要求**:
1. 结果分类展示
   - 帖子结果
   - 用户结果  
   - 标签结果

2. 结果统计
   - 总结果数
   - 各分类结果数

3. 排序选项
   - 按相关度
   - 按时间
   - 按热度

---

### 任务4: 搜索历史组件
**文件**: `src/features/search/components/SearchHistory.tsx`  
**预估时间**: 45分钟

**功能要求**:
1. 本地存储管理
2. 搜索记录展示
3. 删除单条历史
4. 清除全部历史

---

### 任务5: 热门搜索组件
**文件**: `src/features/search/components/HotSearch.tsx`  
**预估时间**: 45分钟

**功能要求**:
1. 热门搜索词展示
2. 热度指示
3. 点击直接搜索

---

### 任务6: 搜索建议组件
**文件**: `src/features/search/components/SearchSuggestions.tsx`  
**预估时间**: 45分钟

**功能要求**:
1. 实时建议
2. 建议分类
3. 点击选择

---

### 任务7: 搜索主页面
**文件**: `src/features/search/pages/SearchPage.tsx`  
**预估时间**: 1.5小时

**功能要求**:
1. 搜索入口页面
2. 展示搜索历史和热门搜索
3. 提供搜索栏和建议

**UI 设计参考**:
```
┌─────────────────────────────────────┐
│              🔍 搜索                │
├─────────────────────────────────────┤
│                                     │
│ [搜索框... ⌨️]                       │
│                                     │
│ 🔍 搜索建议：                        │
│ - 宠物摄影                          │
│ - 金毛犬训练                        │
│                                     │
│ 📜 搜索历史：                        │
│ [ 宠物食品  × ] [ 猫咪用品  × ]      │
│ [ 狗狗训练  × ]                     │
│                                     │
│ 🔥 热门搜索：                        │
│ [ #宠物摄影 ] [ #猫咪 ] [ #狗狗 ]    │
└─────────────────────────────────────┘
```

---

### 任务8: 搜索结果页面
**文件**: `src/features/search/pages/SearchResultsPage.tsx`  
**预估时间**: 2小时

**功能要求**:
1. 搜索结果展示
2. 结果分页
3. 加载更多
4. 搜索条件显示

---

### 任务9: 搜索 Hook
**文件**: `src/features/search/hooks/useSearch.ts`  
**预估时间**: 1小时

**功能要求**:
1. 调用搜索 API
2. 搜索状态管理
3. 加载状态管理
4. 错误处理

---

### 任务10: 搜索历史 Hook
**文件**: `src/features/search/hooks/useSearchHistory.ts`  
**预估时间**: 45分钟

**功能要求**:
1. 本地存储管理
2. 历史记录增删查
3. 限制历史记录数量

---

### 任务11: 热门搜索 Hook
**文件**: `src/features/search/hooks/useHotSearch.ts`  
**预估时间**: 45分钟

**功能要求**:
1. 调用热门搜索 API
2. 数据缓存
3. 更新频率控制

---

### 任务12: 路由配置更新
**文件**: `src/router/index.tsx`  
**预估时间**: 30分钟

**任务内容**:
1. 添加搜索页面路由 `/search`
2. 添加搜索结果路由 `/search/results?q=`
3. 在导航栏添加搜索入口

---

## 🧪 测试用例

### 搜索功能测试
- [ ] 成功进行搜索
- [ ] 搜索结果分类展示
- [ ] 搜索历史正常工作
- [ ] 热门搜索正常显示
- [ ] 搜索建议正常工作

---

## ✅ 验收标准

### 功能验收
- [ ] 用户可以进行搜索
- [ ] 搜索结果正确分类展示
- [ ] 搜索历史记录正常管理
- [ ] 热门搜索词正常显示
- [ ] 搜索建议功能正常
- [ ] 搜索响应及时

---

## 📅 时间表

| 日期 | 任务 | 负责人 | 状态 |
|------|------|--------|------|
| Day1 | 类型定义 + 搜索页面 | Frontend | 🔄 进行中 |
| Day2 | 组件 + Hook + 路由 | Frontend | ⏳ 待开始 |

---

**文档版本**: v1.0  
**创建时间**: 2026-04-24  
**状态**: 🚀 准备开发
