# 动物爱宠分享论坛 - 数据库开发文档

## 概述

本项目使用 PostgreSQL 14.x 作为主要数据库，Redis 7.x 作为缓存和会话存储。文档详细描述了数据库设计、表结构、索引策略、查询优化等内容。

## 数据库架构

### 数据库选型

| 技术 | 版本 | 用途 |
|------|------|------|
| PostgreSQL | 14.x | 关系型数据库，存储主数据 |
| Redis | 7.x | 缓存、会话存储、消息队列 |

## 数据库命名规范

### 表命名规则
- 使用 **snake_case 命名法
- 表名使用 **复数形式**
- 前缀使用模块名（如 `users`、`posts`）
- 避免使用 SQL 保留字

### 字段命名规则
- 使用 **snake_case 命名法**
- `id` 作为主键自增
- `created_at` 和 `updated_at` 作为时间戳
- 外键使用 `表名_id` 格式
- 布尔值使用 `is_` 前缀
- 状态使用 `status` 字段

## 表结构设计

### 1. 用户表 (users)

用户基本信息表，存储用户的账户信息。

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password_hash VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    nickname VARCHAR(100),
    bio TEXT,
    gender SMALLINT DEFAULT 0,
    birthday DATE,
    city VARCHAR(100),
    role SMALLINT DEFAULT 0,
    status SMALLINT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 添加索引
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_created_at ON users(created_at);
```

### 2. 宠物表 (pets)

存储用户宠物的基本信息。

```sql
CREATE TABLE pets (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL,
    breed VARCHAR(100),
    gender SMALLINT DEFAULT 0,
    birthday DATE,
    avatar_url TEXT,
    bio TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 添加索引
CREATE INDEX idx_pets_user_id ON pets(user_id);
CREATE INDEX idx_pets_type ON pets(type);
CREATE INDEX idx_pets_is_active ON pets(is_active);
```

### 3. 帖子表 (posts)

存储用户发布的帖子内容。

```sql
CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    pet_id INTEGER REFERENCES pets(id) ON DELETE SET NULL,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    cover_url TEXT,
    tags VARCHAR(50)[],
    category VARCHAR(50) DEFAULT 'general',
    status SMALLINT DEFAULT 1,
    view_count INTEGER DEFAULT 0,
    like_count INTEGER DEFAULT 0,
    comment_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 添加索引
CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_pet_id ON posts(pet_id);
CREATE INDEX idx_posts_category ON posts(category);
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_posts_created_at ON posts(created_at);
CREATE INDEX idx_posts_view_count ON posts(view_count);
CREATE INDEX idx_posts_like_count ON posts(like_count);
CREATE INDEX idx_posts_tags ON posts USING GIN(tags);
```

### 4. 评论表 (comments)

存储帖子的评论信息。

```sql
CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    parent_id INTEGER REFERENCES comments(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    status SMALLINT DEFAULT 1,
    like_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 添加索引
CREATE INDEX idx_comments_user_id ON comments(user_id);
CREATE INDEX idx_comments_post_id ON comments(post_id);
CREATE INDEX idx_comments_parent_id ON comments(parent_id);
CREATE INDEX idx_comments_status ON comments(status);
CREATE INDEX idx_comments_created_at ON comments(created_at);
```

### 5. 点赞表 (likes)

记录用户对帖子或评论的点赞。

```sql
CREATE TABLE likes (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    target_type VARCHAR(20) NOT NULL,
    target_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, target_type, target_id)
);

-- 添加索引
CREATE INDEX idx_likes_user_id ON likes(user_id);
CREATE INDEX idx_likes_target ON likes(target_type, target_id);
```

### 6. 收藏表 (favorites)

记录用户收藏的帖子。

```sql
CREATE TABLE favorites (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, post_id)
);

-- 添加索引
CREATE INDEX idx_favorites_user_id ON favorites(user_id);
CREATE INDEX idx_favorites_post_id ON favorites(post_id);
CREATE INDEX idx_favorites_created_at ON favorites(created_at);
```

### 7. 文件表 (files)

存储上传的文件信息。

```sql
CREATE TABLE files (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    original_name VARCHAR(255) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL,
    file_size BIGINT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    file_type VARCHAR(20) DEFAULT 'image',
    status SMALLINT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 添加索引
CREATE INDEX idx_files_user_id ON files(user_id);
CREATE INDEX idx_files_file_type ON files(file_type);
CREATE INDEX idx_files_status ON files(status);
CREATE INDEX idx_files_created_at ON files(created_at);
```

### 8. 标签表 (tags)

存储帖子标签信息。

```sql
CREATE TABLE tags (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    post_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 添加索引
CREATE INDEX idx_tags_name ON tags(name);
CREATE INDEX idx_tags_post_count ON tags(post_count);
```

### 9. 通知表 (notifications)

存储用户通知信息。

```sql
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    content TEXT NOT NULL,
    related_id INTEGER,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 添加索引
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_type ON notifications(type);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);
```

## Prisma 模式

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// 用户表
model User {
  id            Int           @id @default(autoincrement())
  username      String        @unique @db.VarChar(50)
  email         String        @unique @db.VarChar(100)
  phone         String?       @db.VarChar(20)
  passwordHash  String        @db.VarChar(255)
  avatarUrl     String?       @db.Text
  nickname      String?       @db.VarChar(100)
  bio           String?       @db.Text
  gender        Int           @default(0)
  birthday      DateTime?
  city          String?       @db.VarChar(100)
  role          Int           @default(0)
  status        Int           @default(1)
  createdAt     DateTime      @default(now()) @db.Timestamp(6)
  updatedAt     DateTime      @updatedAt @db.Timestamp(6)
  
  pets          Pet[]
  posts         Post[]
  comments      Comment[]
  likes         Like[]
  favorites     Favorite[]
  files         File[]
  notifications Notification[]
  
  @@index([email])
  @@index([username])
  @@index([status])
  @@index([createdAt])
  @@map("users")
}

// 宠物表
model Pet {
  id        Int       @id @default(autoincrement())
  userId    Int
  name      String    @db.VarChar(100)
  type      String    @db.VarChar(50)
  breed     String?   @db.VarChar(100)
  gender    Int       @default(0)
  birthday  DateTime?
  avatarUrl String?   @db.Text
  bio       String?   @db.Text
  isActive  Boolean   @default(true)
  createdAt DateTime  @default(now()) @db.Timestamp(6)
  updatedAt DateTime  @updatedAt @db.Timestamp(6)
  
  user      User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  posts     Post[]
  
  @@index([userId])
  @@index([type])
  @@index([isActive])
  @@map("pets")
}

// 帖子表
model Post {
  id           Int          @id @default(autoincrement())
  userId       Int
  petId        Int?
  title        String       @db.VarChar(200)
  content      String       @db.Text
  coverUrl     String?      @db.Text
  tags         String[]
  category     String       @default("general") @db.VarChar(50)
  status       Int          @default(1)
  viewCount    Int          @default(0)
  likeCount    Int          @default(0)
  commentCount Int          @default(0)
  createdAt    DateTime     @default(now()) @db.Timestamp(6)
  updatedAt    DateTime     @updatedAt @db.Timestamp(6)
  
  user         User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  pet          Pet?         @relation(fields: [petId], references: [id], onDelete: SetNull)
  comments     Comment[]
  likes        Like[]       @relation("PostLikes")
  favorites    Favorite[]
  
  @@index([userId])
  @@index([petId])
  @@index([category])
  @@index([status])
  @@index([createdAt])
  @@index([viewCount])
  @@index([likeCount])
  @@map("posts")
}

// 评论表
model Comment {
  id        Int       @id @default(autoincrement())
  userId    Int
  postId    Int
  parentId  Int?
  content   String    @db.Text
  status    Int       @default(1)
  likeCount Int       @default(0)
  createdAt DateTime  @default(now()) @db.Timestamp(6)
  updatedAt DateTime  @updatedAt @db.Timestamp(6)
  
  user      User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  post      Post      @relation(fields: [postId], references: [id], onDelete: Cascade)
  parent    Comment?  @relation("CommentReplies", fields: [parentId], references: [id], onDelete: Cascade)
  replies   Comment[] @relation("CommentReplies")
  likes     Like[]    @relation("CommentLikes")
  
  @@index([userId])
  @@index([postId])
  @@index([parentId])
  @@index([status])
  @@index([createdAt])
  @@map("comments")
}

// 点赞表
model Like {
  id         Int       @id @default(autoincrement())
  userId     Int
  targetType String    @db.VarChar(20)
  targetId   Int
  createdAt  DateTime  @default(now()) @db.Timestamp(6)
  
  user       User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@unique([userId, targetType, targetId])
  @@index([userId])
  @@index([targetType, targetId])
  @@map("likes")
}

// 收藏表
model Favorite {
  id        Int       @id @default(autoincrement())
  userId    Int
  postId    Int
  createdAt DateTime  @default(now()) @db.Timestamp(6)
  
  user      User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  post      Post      @relation(fields: [postId], references: [id], onDelete: Cascade)
  
  @@unique([userId, postId])
  @@index([userId])
  @@index([postId])
  @@index([createdAt])
  @@map("favorites")
}

// 文件表
model File {
  id           Int       @id @default(autoincrement())
  userId       Int
  originalName String    @db.VarChar(255)
  fileName     String    @db.VarChar(255)
  filePath     String    @db.Text
  fileSize     BigInt
  mimeType     String    @db.VarChar(100)
  fileType     String    @default("image") @db.VarChar(20)
  status       Int       @default(1)
  createdAt    DateTime  @default(now()) @db.Timestamp(6)
  
  user         User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@index([userId])
  @@index([fileType])
  @@index([status])
  @@index([createdAt])
  @@map("files")
}

// 标签表
model Tag {
  id          Int       @id @default(autoincrement())
  name        String    @unique @db.VarChar(50)
  description String?  @db.Text
  postCount   Int       @default(0)
  createdAt   DateTime  @default(now()) @db.Timestamp(6)
  updatedAt   DateTime  @updatedAt @db.Timestamp(6)
  
  @@index([name])
  @@index([postCount])
  @@map("tags")
}

// 通知表
model Notification {
  id        Int       @id @default(autoincrement())
  userId    Int
  type      String    @db.VarChar(50)
  content   String    @db.Text
  relatedId Int?
  isRead    Boolean   @default(false)
  createdAt DateTime  @default(now()) @db.Timestamp(6)
  updatedAt DateTime  @updatedAt @db.Timestamp(6)
  
  user      User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@index([userId])
  @@index([type])
  @@index([isRead])
  @@index([createdAt])
  @@map("notifications")
}
```

## 数据库迁移

### 迁移命令

```bash
# 创建迁移
npx prisma migrate dev --name init

# 部署迁移到生产环境
npx prisma migrate deploy

# 重置数据库（开发环境）
npx prisma migrate reset

# 生成 Prisma Client
npx prisma generate

# 查看数据（Studio）
npx prisma studio
```

### 种子数据

```typescript
// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // 创建管理员用户
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@petforum.com' },
    update: {},
    create: {
      username: 'admin',
      email: 'admin@petforum.com',
      passwordHash: adminPassword,
      nickname: '管理员',
      role: 1,
      status: 1,
    },
  });
  
  // 创建测试用户
  const userPassword = await bcrypt.hash('password123', 10);
  const testUser = await prisma.user.upsert({
    where: { email: 'test@petforum.com' },
    update: {},
    create: {
      username: 'testuser',
      email: 'test@petforum.com',
      passwordHash: userPassword,
      nickname: '测试用户',
      role: 0,
      status: 1,
    },
  });
  
  // 创建示例标签
  const tags = ['猫咪', '狗狗', '宠物美容', '宠物健康', '宠物训练'];
  for (const tagName of tags) {
    await prisma.tag.upsert({
      where: { name: tagName },
      update: {},
      create: {
        name: tagName,
        description: `关于${tagName}的内容',
      },
    });
  }
  
  // 创建示例宠物
  const cat = await prisma.pet.create({
    data: {
      userId: testUser.id,
      name: '咪咪',
      type: '猫',
      breed: '英国短毛猫',
      gender: 2,
      bio: '一只可爱的小猫咪',
      isActive: true,
    },
  });
  
  // 创建示例帖子
  const post = await prisma.post.create({
    data: {
      userId: testUser.id,
      petId: cat.id,
      title: '我家的小猫咪',
      content: '这是我家的小猫咪，它非常可爱！',
      tags: ['猫咪'],
      category: 'share',
      status: 1,
    },
  });
  
  console.log('Seed data created successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  }
  .finally(async () => {
    await prisma.$disconnect();
  });
```

## 查询优化

### 常见查询

```sql
-- 查询帖子列表（分页）
SELECT 
    p.*,
    u.username,
    u.nickname,
    u.avatar_url,
    p2.name as pet_name,
    p2.avatar_url as pet_avatar
FROM posts p
LEFT JOIN users u ON p.user_id = u.id
LEFT JOIN pets p2 ON p.pet_id = p2.id
WHERE p.status = 1
ORDER BY p.created_at DESC
LIMIT 20 OFFSET 0;

-- 查询帖子详情
SELECT 
    p.*,
    u.username,
    u.nickname,
    u.avatar_url,
    p2.*
FROM posts p
LEFT JOIN users u ON p.user_id = u.id
LEFT JOIN pets p2 ON p.pet_id = p2.id
WHERE p.id = 1;

-- 查询帖子的评论
SELECT 
    c.*,
    u.username,
    u.nickname,
    u.avatar_url
FROM comments c
LEFT JOIN users u ON c.user_id = u.id
WHERE c.post_id = 1 AND c.status = 1
ORDER BY c.created_at ASC;

-- 查询用户的帖子
SELECT 
    p.*,
    p2.name as pet_name
FROM posts p
LEFT JOIN pets p2 ON p.pet_id = p2.id
WHERE p.user_id = 1 AND p.status = 1
ORDER BY p.created_at DESC;

-- 查询用户收藏的帖子
SELECT 
    p.*,
    u.username,
    u.nickname,
    u.avatar_url
FROM favorites f
LEFT JOIN posts p ON f.post_id = p.id
LEFT JOIN users u ON p.user_id = u.id
WHERE f.user_id = 1 AND p.status = 1
ORDER BY f.created_at DESC;

-- 搜索帖子（标题和内容
SELECT 
    p.*,
    u.username,
    u.nickname,
    u.avatar_url
FROM posts p
LEFT JOIN users u ON p.user_id = u.id
WHERE p.status = 1 AND (
    p.title LIKE '%关键词%' OR
    p.content LIKE '%关键词%'
)
ORDER BY p.created_at DESC
LIMIT 20;

-- 按标签搜索帖子
SELECT 
    p.*,
    u.username,
    u.nickname,
    u.avatar_url
FROM posts p
LEFT JOIN users u ON p.user_id = u.id
WHERE p.status = 1 AND '猫咪' = ANY(p.tags)
ORDER BY p.created_at DESC
LIMIT 20;

-- 查询热门标签
SELECT *
FROM tags
WHERE post_count > 0
ORDER BY post_count DESC
LIMIT 10;

-- 查询用户未读通知数量
SELECT COUNT(*) as unread_count
FROM notifications
WHERE user_id = 1 AND is_read = false;

-- 查询热门帖子（按点赞数排序）
SELECT 
    p.*,
    u.username,
    u.nickname,
    u.avatar_url
FROM posts p
LEFT JOIN users u ON p.user_id = u.id
WHERE p.status = 1
ORDER BY p.like_count DESC
LIMIT 10;
```

## 触发器与存储过程

### 更新时间戳触发器

```sql
-- 创建更新时间戳的函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 为所有表添加更新时间戳触发器
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pets_updated_at BEFORE UPDATE ON pets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON comments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tags_updated_at BEFORE UPDATE ON tags
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notifications_updated_at BEFORE UPDATE ON notifications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### 评论数量更新触发器

```sql
-- 帖子评论数更新函数
CREATE OR REPLACE FUNCTION update_post_comment_count()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        UPDATE posts SET comment_count = comment_count + 1 WHERE id = NEW.post_id;
    ELSIF (TG_OP = 'DELETE') THEN
        UPDATE posts SET comment_count = comment_count - 1 WHERE id = OLD.post_id;
    END IF;
    RETURN NULL;
END;
$$ language 'plpgsql';

-- 创建触发器
CREATE TRIGGER trigger_post_comment_count
AFTER INSERT OR DELETE ON comments
    FOR EACH ROW EXECUTE FUNCTION update_post_comment_count();
```

## 视图

```sql
-- 创建帖子详情视图
CREATE OR REPLACE VIEW post_details AS
SELECT 
    p.id,
    p.title,
    p.content,
    p.cover_url,
    p.tags,
    p.category,
    p.view_count,
    p.like_count,
    p.comment_count,
    p.created_at,
    p.user_id,
    u.username,
    u.nickname,
    u.avatar_url,
    p.pet_id,
    p2.name as pet_name,
    p2.avatar_url as pet_avatar
FROM posts p
LEFT JOIN users u ON p.user_id = u.id
LEFT JOIN pets p2 ON p.pet_id = p2.id
WHERE p.status = 1;

-- 创建用户统计视图
CREATE OR REPLACE VIEW user_stats AS
SELECT 
    u.id,
    u.username,
    u.nickname,
    u.avatar_url,
    COUNT(DISTINCT p.id) as post_count,
    COUNT(DISTINCT c.id) as comment_count,
    COUNT(DISTINCT f.id) as favorite_count,
    COUNT(DISTINCT pet.id) as pet_count
FROM users u
LEFT JOIN posts p ON u.id = p.user_id AND p.status = 1
LEFT JOIN comments c ON u.id = c.user_id AND c.status = 1
LEFT JOIN favorites f ON u.id = f.user_id
LEFT JOIN pets pet ON u.id = pet.user_id AND pet.is_active = true
WHERE u.status = 1
GROUP BY u.id, u.username, u.nickname, u.avatar_url;
```

## Redis 设计

### 缓存键设计

```typescript
// 用户会话
session:{userId} -> JWT

// 用户信息缓存
user:{userId} -> 用户信息 JSON

// 帖子详情缓存
post:{postId} -> 帖子详情 JSON

// 热门帖子列表（缓存1小时）
hot_posts:{page}:{limit} -> 帖子列表 JSON

// 帖子点赞状态
like:post:{postId}:{userId} -> boolean

// 帖子收藏状态
favorite:post:{postId}:{userId} -> boolean

// 用户未读通知数量
unread_count:{userId} -> number

// 限流
rate_limit:{ip} -> count
```

### Redis 操作示例

```typescript
// 缓存帖子列表
async function cachePosts(posts: Post[], ttl = 3600) {
  await redis.setex('hot_posts:1:20', ttl, JSON.stringify(posts));
}

// 获取缓存帖子列表
async function getCachedPosts() {
  const data = await redis.get('hot_posts:1:20');
  return data ? JSON.parse(data) : null;
}

// 检查用户是否点赞了帖子
async function hasLikedPost(userId: number, postId: number) {
  const key = `like:post:${postId}:${userId}';
  const result = await redis.get(key);
  return result === '1';
}

// 设置用户点赞帖子
async function setLikedPost(userId: number, postId: number) {
  const key = `like:post:${postId}:${userId}';
  await redis.setex(key, 86400, '1'); // 24小时过期
}

// 获取用户未读通知数
async function getUnreadCount(userId: number) {
  const key = `unread_count:${userId}';
  const count = await redis.get(key);
  return count ? parseInt(count) : 0;
}

// 更新用户未读通知数
async function setUnreadCount(userId: number, count: number) {
  const key = `unread_count:${userId}';
  await redis.setex(key, 3600, count.toString());
}
```

## 备份策略

### 每日备份脚本

```bash
#!/bin/bash
# backup.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/var/backups/postgres
DATABASE="petforum"

mkdir -p $BACKUP_DIR

# 备份数据库
pg_dump -U postgres $DATABASE | gzip > $BACKUP_DIR/${DATABASE}_${DATE}.sql.gz

# 删除7天前的备份
find $BACKUP_DIR -name "${DATABASE}_*.sql.gz -mtime +7 -delete

echo "Backup completed: ${BACKUP_DIR}/${DATABASE}_${DATE}.sql.gz"
```

### 恢复脚本

```bash
#!/bin/bash
# restore.sh

BACKUP_FILE=$1

if [ -z "$BACKUP_FILE" ]; then
  echo "Usage: $0 <backup_file>"
  exit 1
fi

# 恢复数据库
gunzip -c $BACKUP_FILE | psql -U postgres petforum

echo "Restore completed from $BACKUP_FILE"
```

## 性能监控

### 慢查询日志

```sql
-- 开启慢查询日志
SET log_min_duration_statement = 1000;  -- 记录超过1秒的查询

-- 查询运行时间最长的查询
SELECT
    queryid,
    query,
    calls,
    mean_time,
    total_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;

-- 查询调用次数最多的查询
SELECT
    queryid,
    query,
    calls,
    mean_time,
    total_time
FROM pg_stat_statements
ORDER BY calls DESC
LIMIT 10;
```

### 表大小统计

```sql
-- 查询表大小
SELECT
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename)) DESC;

-- 查询索引大小
SELECT
    schemaname,
    tablename,
    indexname,
    pg_size_pretty(pg_relation_size(schemaname||'.'||indexname)) AS size
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY pg_relation_size(schemaname||'.'||indexname)) DESC;
```

## 安全配置

### PostgreSQL 配置

```ini
# postgresql.conf

# 连接设置
max_connections = 100
listen_addresses = '*'

# 内存设置
shared_buffers = 1GB
work_mem = 16MB
maintenance_work_mem = 256MB

# 检查点设置
checkpoint_completion_target = 0.9
max_wal_size = 2GB
min_wal_size = 512MB

# 查询优化
effective_cache_size = 3GB
random_page_cost = 1.1

# 日志设置
log_destination = 'stderr'
logging_collector = on
log_directory = 'log'
log_filename = 'postgresql-%Y-%m-%d.log'
log_min_duration_statement = 1000
```

### 数据库用户权限

```sql
-- 创建应用用户
CREATE USER petforum WITH PASSWORD 'secure_password';

-- 创建数据库
CREATE DATABASE petforum OWNER petforum;

-- 授予权限
GRANT ALL PRIVILEGES ON DATABASE petforum TO petforum;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO petforum;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO petforum;

-- 只读用户
CREATE USER petforum_read WITH PASSWORD 'read_password';
GRANT CONNECT ON DATABASE petforum TO petforum_read;
GRANT USAGE ON SCHEMA public TO petforum_read;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO petforum_read;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO petforum_read;
```

---

**文档版本**: 1.0  
**创建时间**: 2026-04-24  
**最后更新**: 2026-04-24  
**作者**: Claude AI