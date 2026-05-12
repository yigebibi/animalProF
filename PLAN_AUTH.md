# 用户认证系统 - 开发计划 (Auth Module)

## 📋 基本信息

| 项目 | 内容 |
|------|------|
| 模块名称 | 用户认证系统 (Auth Module) |
| 文件位置 | `frontend/src/features/auth/` |
| 预估工期 | 2 天 |
| 优先级 | 🔴 高 |
| 依赖模块 | 无 (基础模块) |

---

## 🎯 功能清单

### 核心功能
- [ ] 用户登录页面
- [ ] 用户注册页面
- [ ] 忘记密码功能
- [ ] 自动登录 (记住我)
- [ ] 用户登出功能
- [ ] Token 管理
- [ ] 路由权限守卫

---

## 📁 目录结构

```
src/features/auth/
├── components/
│   ├── LoginForm.tsx           # 登录表单
│   ├── RegisterForm.tsx        # 注册表单
│   ├── ForgotPasswordForm.tsx  # 忘记密码表单
│   └── SocialLoginButtons.tsx  # 第三方登录按钮
├── hooks/
│   ├── useLogin.ts             # 登录逻辑 Hook
│   ├── useRegister.ts          # 注册逻辑 Hook
│   └── useForgotPassword.ts    # 忘记密码 Hook
├── pages/
│   ├── LoginPage.tsx           # 登录页面
│   ├── RegisterPage.tsx        # 注册页面
│   └── ForgotPasswordPage.tsx  # 忘记密码页面
├── types/
│   └── auth.types.ts          # 认证相关类型定义
└── index.tsx                  # 模块入口
```

---

## 📝 详细开发任务

### 任务1: 认证模块类型定义
**文件**: `src/features/auth/types/auth.types.ts`  
**预估时间**: 30分钟

**任务内容**:
```typescript
// 1. 定义登录请求和响应类型
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  user: User;
}

// 2. 定义注册请求和响应类型
export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  access_token: string;
  user: User;
}

// 3. 定义验证规则
export interface ValidationRules {
  email: {
    required: string;
    pattern: RegExp;
    message: string;
  };
  password: {
    required: string;
    minLength: number;
    message: string;
  };
}
```

---

### 任务2: 创建登录页面
**文件**: `src/features/auth/pages/LoginPage.tsx`  
**预估时间**: 2小时

**功能要求**:
1. 页面布局
   - 居中卡片设计
   - 响应式适配移动端和桌面端
   - 品牌Logo展示

2. 表单组件
   - 邮箱输入框 (带验证)
   - 密码输入框 (带显示/隐藏切换)
   - 记住我复选框
   - 登录按钮
   - 跳转注册链接
   - 忘记密码链接

3. 表单验证
   - 邮箱格式验证
   - 密码长度验证 (至少6位)
   - 实时错误提示

4. 加载状态
   - 登录时显示加载动画
   - 按钮禁用状态

5. 错误处理
   - 显示后端返回的错误
   - 网络错误提示

**UI 设计参考**:
```
┌─────────────────────────────┐
│      🐾 宠物论坛登录        │
│                             │
│  [ 邮箱输入框 ]             │
│  [ 密码输入框 👁]           │
│  ☐ 记住我                   │
│  [ 登录按钮 ]               │
│                             │
│  没有账号？[ 立即注册 ]     │
│  [ 忘记密码？]              │
└─────────────────────────────┘
```

---

### 任务3: 创建注册页面
**文件**: `src/features/auth/pages/RegisterPage.tsx`  
**预估时间**: 2小时

**功能要求**:
1. 表单字段
   - 用户名 (3-20字符)
   - 邮箱地址
   - 密码 (至少6位)
   - 确认密码
   - 服务条款同意复选框

2. 表单验证
   - 用户名格式验证
   - 邮箱格式验证
   - 密码强度检查
   - 两次密码一致性检查

3. 用户体验
   - 实时验证反馈
   - 密码强度指示器
   - 注册成功跳转提示

**UI 设计参考**:
```
┌─────────────────────────────┐
│      🐾 宠物论坛注册        │
│                             │
│  [ 用户名 ]                 │
│  [ 邮箱地址 ]               │
│  [ 密码 ]                   │
│  密码强度: ⬛⬛⬛⬜⬜       │
│  [ 确认密码 ]               │
│  ☑ 我同意服务条款           │
│  [ 立即注册 ]               │
│                             │
│  已有账号？[ 去登录 ]       │
└─────────────────────────────┘
```

---

### 任务4: 创建忘记密码页面
**文件**: `src/features/auth/pages/ForgotPasswordPage.tsx`  
**预估时间**: 1.5小时

**功能要求**:
1. 输入邮箱地址
2. 发送重置链接按钮
3. 成功状态页面
4. 返回登录链接

---

### 任务5: 认证 Hook (useLogin)
**文件**: `src/features/auth/hooks/useLogin.ts`  
**预估时间**: 1小时

**功能要求**:
1. 调用登录 API
2. 处理成功响应 (存储 Token 和用户信息)
3. 处理错误响应
4. 管理加载状态
5. 记住我功能 (LocalStorage)

**代码结构**:
```typescript
export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (data: LoginRequest, rememberMe = false) => {
    // 1. 设置加载状态
    // 2. 调用 API
    // 3. 存储 Token 和用户信息
    // 4. 跳转到首页
  };

  return { loading, error, handleLogin };
};
```

---

### 任务6: 注册 Hook (useRegister)
**文件**: `src/features/auth/hooks/useRegister.ts`  
**预估时间**: 45分钟

**功能要求**:
1. 调用注册 API
2. 自动登录注册后的用户
3. 错误处理
4. 成功后跳转首页

---

### 任务7: 忘记密码 Hook (useForgotPassword)
**文件**: `src/features/auth/hooks/useForgotPassword.ts`  
**预估时间**: 30分钟

**功能要求**:
1. 发送重置邮箱请求
2. 显示成功状态
3. 错误处理

---

### 任务8: 登录表单组件 (LoginForm)
**文件**: `src/features/auth/components/LoginForm.tsx`  
**预估时间**: 1小时

**功能要求**:
1. 邮箱输入组件
2. 密码输入组件 (带显示/隐藏切换)
3. 记住我复选框
4. 使用 react-hook-form 管理表单
5. Zod 验证规则

---

### 任务9: 注册表单组件 (RegisterForm)
**文件**: `src/features/auth/components/RegisterForm.tsx`  
**预估时间**: 1.5小时

**功能要求**:
1. 所有输入字段
2. 密码强度指示器
3. 服务条款复选框
4. react-hook-form 集成
5. Zod 验证

---

### 任务10: 路由配置
**文件**: `src/router/index.tsx`  
**预估时间**: 30分钟

**任务内容**:
1. 添加登录页面路由 `/auth/login`
2. 添加注册页面路由 `/auth/register`
3. 添加忘记密码路由 `/auth/forgot-password`
4. 更新侧边栏导航链接

---

### 任务11: Redux 状态集成
**文件**: `src/store/slices/authSlice.ts`  
**预估时间**: 45分钟

**功能要求**:
1. 设置/清除 Token
2. 设置/清除用户信息
3. 检查认证状态
4. 登出功能

---

### 任务12: 路由守卫
**文件**: `src/router/ProtectedRoute.tsx`  
**预估时间**: 45分钟

**功能要求**:
1. 检查用户是否已登录
2. 未登录重定向到登录页面
3. 记住用户想访问的页面
4. 登录成功后跳转回原页面

---

## 🧪 测试用例

### 登录页面测试
- [ ] 空邮箱提交显示错误
- [ ] 无效邮箱格式显示错误
- [ ] 空密码显示错误
- [ ] 密码太短显示错误
- [ ] 登录成功后跳转到首页
- [ ] 记住我功能正常保存 Token
- [ ] 登出功能正常工作

### 注册页面测试
- [ ] 用户名太短显示错误
- [ ] 用户名太长显示错误
- [ ] 无效邮箱显示错误
- [ ] 密码不匹配显示错误
- [ ] 不勾选服务条款禁用注册按钮
- [ ] 注册成功后自动登录

---

## 📚 参考资源

- [React Hook Form 文档](https://react-hook-form.com/)
- [Zod 验证库文档](https://zod.dev/)
- [Ant Design Form 组件](https://ant.design/components/form/)
- [Tailwind CSS 文档](https://tailwindcss.com/)

---

## ✅ 验收标准

### 功能验收
- [ ] 用户可以正常登录
- [ ] 用户可以正常注册
- [ ] 忘记密码功能可用
- [ ] Token 正确保存和清除
- [ ] 路由守卫正常工作
- [ ] 登录状态正确同步

### UI/UX 验收
- [ ] 页面美观，响应式适配
- [ ] 加载状态正常显示
- [ ] 错误提示友好明确
- [ ] 表单验证反馈及时
- [ ] 整体流程流畅自然

### 代码质量验收
- [ ] TypeScript 类型安全
- [ ] 代码有必要的注释
- [ ] 遵循项目代码规范
- [ ] 组件可复用性良好

---

## 📅 时间表

| 日期 | 任务 | 负责人 | 状态 |
|------|------|--------|------|
| Day1 | 类型定义 + 页面布局 | Frontend | 🔄 进行中 |
| Day1 | 登录页面 + Hook | Frontend | ⏳ 待开始 |
| Day2 | 注册页面 + Hook | Frontend | ⏳ 待开始 |
| Day2 | 忘记密码 + 路由配置 | Frontend | ⏳ 待开始 |

---

**文档版本**: v1.0  
**创建时间**: 2026-04-24  
**状态**: 🚀 开始开发
