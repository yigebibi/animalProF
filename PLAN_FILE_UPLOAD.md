# 文件上传系统 - 开发计划 (File Upload Module)

## 📋 基本信息

| 项目 | 内容 |
|------|------|
| 模块名称 | 文件上传系统 (File Upload Module) |
| 文件位置 | `frontend/src/features/file/` |
| 预估工期 | 2 天 |
| 优先级 | 🟡 中 |
| 依赖模块 | Auth Module |

---

## 🎯 功能清单

### 核心功能
- [ ] 图片上传功能
- [ ] 图片预览功能
- [ ] 文件大小限制
- [ ] 文件类型检查
- [ ] 进度条显示

---

## 📁 目录结构

```
src/features/file/
├── components/
│   ├── FileUploader.tsx         # 文件上传组件
│   ├── ImagePreview.tsx         # 图片预览组件
│   ├── FileDropzone.tsx         # 拖拽上传组件
│   ├── FileProgress.tsx         # 上传进度组件
│   └── ImageCrop.tsx            # 图片裁剪组件
├── hooks/
│   ├── useFileUpload.ts         # 文件上传 Hook
│   └── useImageUpload.ts        # 图片上传 Hook
├── pages/
│   └── FileUploadPage.tsx       # 文件上传页面 (组件化)
├── types/
│   └── file.types.ts            # 文件相关类型定义
└── index.tsx                    # 模块入口
```

---

## 📝 详细开发任务

### 任务1: 文件模块类型定义
**文件**: `src/features/file/types/file.types.ts`  
**预估时间**: 30分钟

**任务内容**:
```typescript
// 1. 定义文件信息类型
export interface FileInfo {
  id: number;
  userId: number;
  originalName: string;
  fileName: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  fileType: string; // image:图片, video:视频, file:文件
  status: number;
  createdAt: string;
}

// 2. 定义文件上传响应类型
export interface FileUploadResponse {
  id: string;
  url: string;
  fileName: string;
  fileSize: string;
}

// 3. 定义上传配置类型
export interface FileUploadConfig {
  maxSize: number;
  acceptedTypes: string[];
  fileType?: 'image' | 'video' | 'file';
}
```

---

### 任务2: 文件上传组件
**文件**: `src/features/file/components/FileUploader.tsx`  
**预估时间**: 2小时

**功能要求**:
1. 基础上传
   - 点击上传
   - 拖拽上传

2. 验证功能
   - 文件大小验证
   - 文件类型验证
   - 实时错误提示

3. 进度展示
   - 上传进度条
   - 百分比显示
   - 上传状态指示

4. 用户反馈
   - 上传成功提示
   - 上传失败重试
   - 取消上传

**文件限制配置**:
```typescript
// 默认配置
const DEFAULT_CONFIG = {
  image: {
    maxSize: 10 * 1024 * 1024, // 10MB
    acceptedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  },
  video: {
    maxSize: 100 * 1024 * 1024, // 100MB
    acceptedTypes: ['video/mp4', 'video/webm'],
  },
  file: {
    maxSize: 10 * 1024 * 1024, // 10MB
    acceptedTypes: ['*'],
  },
};
```

---

### 任务3: 图片预览组件
**文件**: `src/features/file/components/ImagePreview.tsx`  
**预估时间**: 1小时

**功能要求**:
1. 图片预览
2. 缩放功能
3. 旋转功能
4. 下载功能

---

### 任务4: 图片裁剪组件
**文件**: `src/features/file/components/ImageCrop.tsx`  
**预估时间**: 1.5小时

**功能要求**:
1. 裁剪区域选择
2. 宽高比例设置
3. 裁剪预览
4. 导出裁剪后的图片

---

### 任务5: 文件上传 Hook
**文件**: `src/features/file/hooks/useFileUpload.ts`  
**预估时间**: 1小时

**功能要求**:
1. 调用文件上传 API
2. 管理上传状态
3. 错误处理
4. 进度监听

---

### 任务6: 图片上传 Hook
**文件**: `src/features/file/hooks/useImageUpload.ts`  
**预估时间**: 45分钟

**功能要求**:
1. 图片上传和处理
2. 支持裁剪
3. 支持压缩
4. 错误处理

---

### 任务7: 在其他模块中集成
**文件**: 更新相关模块文件  
**预估时间**: 1小时

**任务内容**:
1. 在用户模块中集成头像上传
2. 在宠物模块中集成头像上传
3. 在帖子模块中集成图片上传
4. 在评论模块中集成图片上传

---

## 🧪 测试用例

### 文件上传测试
- [ ] 成功上传图片
- [ ] 文件大小限制正常
- [ ] 文件类型检查正常
- [ ] 进度条显示正常
- [ ] 错误处理正常

---

## ✅ 验收标准

### 功能验收
- [ ] 用户可以上传文件
- [ ] 文件验证功能正常
- [ ] 上传进度正确显示
- [ ] 图片预览和裁剪功能正常
- [ ] 上传后的文件可访问

---

## 📅 时间表

| 日期 | 任务 | 负责人 | 状态 |
|------|------|--------|------|
| Day1 | 类型定义 + 基础组件 | Frontend | 🔄 进行中 |
| Day2 | Hook + 集成测试 | Frontend | ⏳ 待开始 |

---

**文档版本**: v1.0  
**创建时间**: 2026-04-24  
**状态**: 🚀 准备开发
