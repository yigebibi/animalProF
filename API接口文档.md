# 宠物论坛 API 接口文档

> **文档版本**: 1.0.0
> **最后更新**: 2026-04-24
> **API 版本**: v1
> **基础 URL**: `http://localhost:3000/api/v1`

---

## 📋 目录

1. [概述](#概述)
2. [认证说明](#认证说明)
3. [响应格式](#响应格式)
4. [错误码说明](#错误码说明)
5. [接口列表](#接口列表)
   - [认证模块](#认证模块)
   - [用户模块](#用户模块)
   - [宠物模块](#宠物模块)
   - [帖子模块](#帖子模块)
   - [评论模块](#评论模块)
   - [文件模块](#文件模块)
   - [搜索模块](#搜索模块)
   - [通知模块](#通知模块)
6. [变更日志](#变更日志)
7. [文档维护指南](#文档维护指南)

---

## 概述

本文档描述了宠物论坛后端 API 的所有接口，供前端开发人员参考使用。所有接口均遵循 RESTful 风格。

### 环境

- **开发环境**: `http://localhost:3000`
- **测试环境**: 根据实际部署配置
- **生产环境**: 根据实际部署配置

### 版本变更

当前 API 版本为 v1，所有接口路径均以 `/api/v1` 开头。

---

## 认证说明

### 认证方式

本 API 使用 JWT (JSON Web Token) 进行身份认证。

### 获取 Token

通过 **用户登录** 或 **用户注册** 接口获取 access_token。

### 使用 Token

在需要认证的接口中，需要在 HTTP Header 中添加：

```
Authorization: Bearer <access_token>
```

### Token 有效期

Token 默认有效期为 7 天，过期后需要重新登录获取。

---

## 响应格式

### 统一响应格式

所有接口的响应都遵循以下统一格式：

#### 成功响应

```json
{
  "code": 200,
  "message": "success",
  "data": { /* 具体数据 */ },
  "timestamp": "2026-04-24T10:30:00.000Z"
}
```

#### 分页响应

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "data": [/* 列表数据 */],
    "meta": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "totalPages": 5
    }
  },
  "timestamp": "2026-04-24T10:30:00.000Z"
}
```

#### 错误响应

```json
{
  "code": 400,
  "message": "错误描述",
  "timestamp": "2026-04-24T10:30:00.000Z",
  "path": "/api/v1/xxx"
}
```

### 字段说明

| 字段 | 类型 | 说明 |
|------|------|------|
| code | number | 状态码，200 表示成功 |
| message | string | 响应消息 |
| data | any | 响应数据，成功时返回 |
| timestamp | string | 响应时间戳 (ISO 8601) |
| path | string | 请求路径，仅错误时返回 |

---

## 错误码说明

| HTTP 状态码 | code | 说明 |
|------------|------|------|
| 200 | 200 | 请求成功 |
| 201 | 200 | 创建成功 |
| 400 | 400 | 请求参数错误 |
| 401 | 401 | 未登录 / Token 无效 / Token 过期 |
| 403 | 403 | 无权限访问 |
| 404 | 404 | 资源不存在 |
| 409 | 409 | 资源冲突（如用户已存在） |
| 500 | 500 | 服务器内部错误 |

---

## 接口列表

---

## 认证模块

### 1.1 用户登录

**接口地址**: `POST /auth/login`

**认证要求**: 无需认证

**接口说明**: 用户通过邮箱和密码登录，获取 access_token

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| email | string | 是 | 邮箱地址 |
| password | string | 是 | 密码（至少6位） |

**请求示例**:

```json
{
  "email": "test@example.com",
  "password": "password123"
}
```

**响应示例**:

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "username": "testuser",
      "email": "test@example.com",
      "avatarUrl": null,
      "nickname": "testuser",
      "role": 0
    }
  },
  "timestamp": "2026-04-24T10:30:00.000Z"
}
```

---

### 1.2 用户注册

**接口地址**: `POST /auth/register`

**认证要求**: 无需认证

**接口说明**: 新用户注册

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| username | string | 是 | 用户名（3-20个字符） |
| email | string | 是 | 邮箱地址 |
| password | string | 是 | 密码（至少6位） |

**请求示例**:

```json
{
  "username": "newuser",
  "email": "newuser@example.com",
  "password": "password123"
}
```

**响应示例**:

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 2,
      "username": "newuser",
      "email": "newuser@example.com",
      "nickname": "newuser",
      "role": 0
    }
  },
  "timestamp": "2026-04-24T10:30:00.000Z"
}
```

---

## 用户模块

### 2.1 获取当前用户信息

**接口地址**: `GET /users/profile`

**认证要求**: 需要认证（Bearer Token）

**接口说明**: 获取当前登录用户的详细信息

**请求参数**: 无

**响应示例**:

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": 1,
    "username": "testuser",
    "email": "test@example.com",
    "avatarUrl": "https://example.com/avatar.jpg",
    "nickname": "测试用户",
    "bio": "这是一个测试用户账户",
    "gender": 0,
    "birthday": "1990-01-01",
    "city": "北京",
    "createdAt": "2026-04-24T10:30:00.000Z"
  },
  "timestamp": "2026-04-24T10:30:00.000Z"
}
```

---

### 2.2 更新用户信息

**接口地址**: `PUT /users/profile`

**认证要求**: 需要认证（Bearer Token）

**接口说明**: 更新当前登录用户的信息

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| username | string | 否 | 用户名 |
| nickname | string | 否 | 昵称 |
| bio | string | 否 | 个人简介 |
| gender | number | 否 | 性别 (0:未知, 1:男, 2:女) |
| birthday | string | 否 | 生日 (YYYY-MM-DD) |
| city | string | 否 | 城市 |

**请求示例**:

```json
{
  "nickname": "新昵称",
  "bio": "这是我的个人简介",
  "city": "上海"
}
```

**响应示例**:

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": 1,
    "username": "testuser",
    "email": "test@example.com",
    "avatarUrl": null,
    "nickname": "新昵称",
    "bio": "这是我的个人简介",
    "city": "上海",
    "updatedAt": "2026-04-24T10:30:00.000Z"
  },
  "timestamp": "2026-04-24T10:30:00.000Z"
}
```

---

### 2.3 修改密码

**接口地址**: `POST /users/change-password`

**认证要求**: 需要认证（Bearer Token）

**接口说明**: 修改当前用户的密码

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| oldPassword | string | 是 | 旧密码 |
| newPassword | string | 是 | 新密码（至少6位） |

**请求示例**:

```json
{
  "oldPassword": "password123",
  "newPassword": "newpassword123"
}
```

**响应示例**:

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "message": "密码修改成功"
  },
  "timestamp": "2026-04-24T10:30:00.000Z"
}
```

---

### 2.4 上传头像

**接口地址**: `POST /users/upload-avatar`

**认证要求**: 需要认证（Bearer Token）

**接口说明**: 上传用户头像

**Content-Type**: `multipart/form-data`

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| file | file | 是 | 头像图片文件 |

**请求示例**:

```bash
curl -X POST http://localhost:3000/api/v1/users/upload-avatar \
  -H "Authorization: Bearer <token>" \
  -F "file=@/path/to/avatar.jpg"
```

---

### 2.5 获取用户详情

**接口地址**: `GET /users/:id`

**认证要求**: 无需认证

**接口说明**: 获取指定用户的公开信息

**路径参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | number | 是 | 用户ID |

**响应示例**:

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": 1,
    "username": "testuser",
    "avatarUrl": "https://example.com/avatar.jpg",
    "nickname": "测试用户",
    "bio": "这是一个测试用户账户",
    "gender": 0,
    "birthday": "1990-01-01",
    "city": "北京",
    "createdAt": "2026-04-24T10:30:00.000Z"
  },
  "timestamp": "2026-04-24T10:30:00.000Z"
}
```

---

## 宠物模块

### 3.1 获取当前用户的宠物列表

**接口地址**: `GET /pets`

**认证要求**: 需要认证（Bearer Token）

**接口说明**: 获取当前登录用户的所有宠物列表

**请求参数**: 无

**响应示例**:

```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "id": 1,
      "userId": 1,
      "name": "小白",
      "type": "狗",
      "breed": "金毛",
      "gender": 1,
      "avatarUrl": null,
      "bio": "温顺的金毛犬",
      "isActive": true,
      "createdAt": "2026-04-24T10:30:00.000Z",
      "updatedAt": "2026-04-24T10:30:00.000Z"
    }
  ],
  "timestamp": "2026-04-24T10:30:00.000Z"
}
```

---

### 3.2 获取宠物详情

**接口地址**: `GET /pets/:id`

**认证要求**: 无需认证

**接口说明**: 获取指定宠物的详细信息

**路径参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | number | 是 | 宠物ID |

**响应示例**:

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": 1,
    "userId": 1,
    "name": "小白",
    "type": "狗",
    "breed": "金毛",
    "gender": 1,
    "avatarUrl": null,
    "bio": "温顺的金毛犬",
    "isActive": true,
    "createdAt": "2026-04-24T10:30:00.000Z",
    "updatedAt": "2026-04-24T10:30:00.000Z",
    "user": {
      "id": 1,
      "username": "testuser",
      "nickname": "测试用户",
      "avatarUrl": null
    }
  },
  "timestamp": "2026-04-24T10:30:00.000Z"
}
```

---

### 3.3 添加宠物

**接口地址**: `POST /pets`

**认证要求**: 需要认证（Bearer Token）

**接口说明**: 添加新的宠物

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| name | string | 是 | 宠物名字 |
| type | string | 是 | 宠物类型（如：狗、猫） |
| breed | string | 否 | 品种 |
| gender | number | 否 | 性别 (0:未知, 1:公, 2:母) |
| birthday | string | 否 | 生日 (YYYY-MM-DD) |
| avatarUrl | string | 否 | 头像URL |
| bio | string | 否 | 简介 |

**请求示例**:

```json
{
  "name": "小黑",
  "type": "猫",
  "breed": "橘猫",
  "gender": 2,
  "bio": "可爱的橘猫"
}
```

**响应示例**:

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": 2,
    "userId": 1,
    "name": "小黑",
    "type": "猫",
    "breed": "橘猫",
    "gender": 2,
    "bio": "可爱的橘猫",
    "isActive": true,
    "createdAt": "2026-04-24T10:30:00.000Z",
    "updatedAt": "2026-04-24T10:30:00.000Z"
  },
  "timestamp": "2026-04-24T10:30:00.000Z"
}
```

---

### 3.4 更新宠物信息

**接口地址**: `PUT /pets/:id`

**认证要求**: 需要认证（Bearer Token）

**接口说明**: 更新宠物信息（只能更新自己的宠物）

**路径参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | number | 是 | 宠物ID |

**请求参数**:

同 [添加宠物](#33-添加宠物)

---

### 3.5 删除宠物

**接口地址**: `DELETE /pets/:id`

**认证要求**: 需要认证（Bearer Token）

**接口说明**: 删除宠物（只能删除自己的宠物）

**路径参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | number | 是 | 宠物ID |

---

## 帖子模块

### 4.1 获取帖子列表

**接口地址**: `GET /posts`

**认证要求**: 无需认证

**接口说明**: 获取帖子列表，支持分页、筛选、排序

**查询参数**:

| 参数名 | 类型 | 必填 | 默认值 | 说明 |
|--------|------|------|--------|------|
| page | number | 否 | 1 | 页码 |
| limit | number | 否 | 20 | 每页数量 (1-100) |
| category | string | 否 | - | 分类筛选 |
| tag | string | 否 | - | 标签筛选 |
| search | string | 否 | - | 搜索关键词 |
| sortBy | string | 否 | createdAt | 排序字段 |
| sortOrder | string | 否 | desc | 排序方向 (asc/desc) |

**响应示例**:

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "data": [
      {
        "id": 1,
        "userId": 1,
        "petId": 1,
        "title": "第一次带小白去公园",
        "content": "今天天气很好，我带小白去了公园...",
        "coverUrl": null,
        "tags": ["宠物", "金毛", "公园"],
        "category": "share",
        "status": 1,
        "viewCount": 100,
        "likeCount": 20,
        "commentCount": 5,
        "createdAt": "2026-04-24T10:30:00.000Z",
        "updatedAt": "2026-04-24T10:30:00.000Z",
        "user": {
          "id": 1,
          "username": "testuser",
          "nickname": "测试用户",
          "avatarUrl": null
        },
        "pet": {
          "id": 1,
          "name": "小白",
          "avatarUrl": null
        }
      }
    ],
    "meta": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "totalPages": 5
    }
  },
  "timestamp": "2026-04-24T10:30:00.000Z"
}
```

---

### 4.2 获取帖子详情

**接口地址**: `GET /posts/:id`

**认证要求**: 无需认证

**接口说明**: 获取帖子详情，会增加浏览次数

**路径参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | number | 是 | 帖子ID |

**响应示例**:

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": 1,
    "userId": 1,
    "petId": 1,
    "title": "第一次带小白去公园",
    "content": "今天天气很好，我带小白去了公园...",
    "tags": ["宠物", "金毛", "公园"],
    "category": "share",
    "viewCount": 101,
    "likeCount": 20,
    "commentCount": 5,
    "user": {
      "id": 1,
      "username": "testuser",
      "nickname": "测试用户",
      "avatarUrl": null
    },
    "pet": { /* 宠物信息 */ },
    "comments": [/* 评论列表 */]
  },
  "timestamp": "2026-04-24T10:30:00.000Z"
}
```

---

### 4.3 发布帖子

**接口地址**: `POST /posts`

**认证要求**: 需要认证（Bearer Token）

**接口说明**: 发布新帖子

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| title | string | 是 | 标题（1-200字符） |
| content | string | 是 | 内容（至少1字符） |
| coverUrl | string | 否 | 封面URL |
| tags | string[] | 否 | 标签数组 |
| category | string | 否 | 分类 |

**请求示例**:

```json
{
  "title": "分享我的宠物日常",
  "content": "今天我家的宝贝...",
  "tags": ["宠物", "日常"],
  "category": "share"
}
```

---

### 4.4 更新帖子

**接口地址**: `PUT /posts/:id`

**认证要求**: 需要认证（Bearer Token）

**接口说明**: 更新帖子（只能更新自己的帖子）

**路径参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | number | 是 | 帖子ID |

**请求参数**:

同 [发布帖子](#43-发布帖子)

---

### 4.5 删除帖子

**接口地址**: `DELETE /posts/:id`

**认证要求**: 需要认证（Bearer Token）

**接口说明**: 删除帖子（只能删除自己的帖子）

**路径参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | number | 是 | 帖子ID |

---

## 评论模块

### 5.1 获取帖子评论列表

**接口地址**: `GET /comments/post/:postId`

**认证要求**: 无需认证

**接口说明**: 获取指定帖子的所有评论

**路径参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| postId | number | 是 | 帖子ID |

**响应示例**:

```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "id": 1,
      "userId": 2,
      "postId": 1,
      "parentId": null,
      "content": "好可爱！",
      "likeCount": 5,
      "createdAt": "2026-04-24T10:30:00.000Z",
      "user": {
        "id": 2,
        "username": "user2",
        "nickname": "用户2",
        "avatarUrl": null
      },
      "replies": [/* 回复列表 */]
    }
  ],
  "timestamp": "2026-04-24T10:30:00.000Z"
}
```

---

### 5.2 获取评论详情

**接口地址**: `GET /comments/:id`

**认证要求**: 无需认证

**接口说明**: 获取指定评论的详情

**路径参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | number | 是 | 评论ID |

---

### 5.3 发表评论

**接口地址**: `POST /comments`

**认证要求**: 需要认证（Bearer Token）

**接口说明**: 发表新评论或回复评论

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| postId | number | 是 | 帖子ID |
| content | string | 是 | 评论内容 |
| parentId | number | 否 | 父评论ID（回复时使用） |

**请求示例**:

```json
{
  "postId": 1,
  "content": "好可爱的宠物！"
}
```

---

### 5.4 更新评论

**接口地址**: `PUT /comments/:id`

**认证要求**: 需要认证（Bearer Token）

**接口说明**: 更新评论（只能更新自己的评论）

**路径参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | number | 是 | 评论ID |

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| content | string | 是 | 评论内容 |

---

### 5.5 删除评论

**接口地址**: `DELETE /comments/:id`

**认证要求**: 需要认证（Bearer Token）

**接口说明**: 删除评论（只能删除自己的评论）

**路径参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | number | 是 | 评论ID |

---

## 文件模块

### 6.1 上传文件

**接口地址**: `POST /files/upload`

**认证要求**: 需要认证（Bearer Token）

**接口说明**: 上传文件（图片、视频等）

**Content-Type**: `multipart/form-data`

**请求参数**:

| 参数名 | 类型 | 必填 | 默认值 | 说明 |
|--------|------|------|--------|------|
| file | file | 是 | - | 文件 |
| fileType | string | 否 | image | 文件类型 (image/video/file) |

**文件限制**:
- **图片**: 最大 10MB，支持 jpg, png, gif, webp
- **视频**: 最大 100MB，支持 mp4, webm
- **其他文件**: 最大 10MB

**响应示例**:

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": 1,
    "url": "http://localhost:3000/uploads/2026-04-24/xxx.jpg",
    "fileName": "photo.jpg",
    "fileSize": "102400"
  },
  "timestamp": "2026-04-24T10:30:00.000Z"
}
```

---

### 6.2 删除文件

**接口地址**: `DELETE /files/:id`

**认证要求**: 需要认证（Bearer Token）

**接口说明**: 删除自己上传的文件

**路径参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | number | 是 | 文件ID |

---

## 搜索模块

### 7.1 搜索

**接口地址**: `GET /search`

**认证要求**: 无需认证

**接口说明**: 全局搜索，支持搜索帖子、用户、标签

**查询参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| q | string | 是 | 搜索关键词 |
| type | string | 否 | 搜索类型 (posts/users/tags)，不指定则搜索全部 |

**响应示例**:

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "posts": [/* 帖子列表 */],
    "users": [/* 用户列表 */],
    "tags": [/* 标签列表 */]
  },
  "timestamp": "2026-04-24T10:30:00.000Z"
}
```

---

## 通知模块

### 8.1 获取通知列表

**接口地址**: `GET /notifications`

**认证要求**: 需要认证（Bearer Token）

**接口说明**: 获取当前用户的通知列表

**查询参数**:

| 参数名 | 类型 | 必填 | 默认值 | 说明 |
|--------|------|------|--------|------|
| page | number | 否 | 1 | 页码 |
| limit | number | 否 | 20 | 每页数量 |

**响应示例**:

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "data": [
      {
        "id": 1,
        "userId": 1,
        "type": "like",
        "content": "有人点赞了你的帖子",
        "relatedId": 1,
        "isRead": false,
        "createdAt": "2026-04-24T10:30:00.000Z",
        "updatedAt": "2026-04-24T10:30:00.000Z"
      }
    ],
    "unreadCount": 5,
    "meta": {
      "page": 1,
      "limit": 20,
      "total": 10,
      "totalPages": 1
    }
  },
  "timestamp": "2026-04-24T10:30:00.000Z"
}
```

---

### 8.2 标记通知已读

**接口地址**: `PUT /notifications/:id/read`

**认证要求**: 需要认证（Bearer Token）

**接口说明**: 标记指定通知为已读

**路径参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | number | 是 | 通知ID |

---

### 8.3 标记所有通知已读

**接口地址**: `PUT /notifications/read-all`

**认证要求**: 需要认证（Bearer Token）

**接口说明**: 标记当前用户的所有通知为已读

**响应示例**:

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "message": "全部已读"
  },
  "timestamp": "2026-04-24T10:30:00.000Z"
}
```

---

## 变更日志

### v1.0.0 (2026-04-24)

- 初始版本发布
- 实现认证模块（登录、注册）
- 实现用户模块
- 实现宠物模块
- 实现帖子模块
- 实现评论模块
- 实现文件模块
- 实现搜索模块
- 实现通知模块

---

## 文档维护指南

### 更新文档步骤

1. **修改代码后**: 当你修改或新增接口时，请同步更新本文档
2. **更新版本号**: 每次重大更新都应更新文档顶部的版本号
3. **记录变更**: 在变更日志中记录本次更新的内容
4. **通知团队**: 更新后通知前端团队文档已更新

### 使用 Swagger 作为补充

除了本文档，你还可以通过以下方式获取最新的 API 信息：

- 启动服务后访问: `http://localhost:3000/api/docs` (Swagger UI)
- Swagger 会根据代码注解自动生成最新的接口文档

### 文档维护脚本

运行以下命令检查文档是否需要更新：

```bash
cd backend
npm run docs:check
```

### 联系方式

如有接口疑问，请联系后端开发团队。

---

**文档维护者**: 后端开发团队
