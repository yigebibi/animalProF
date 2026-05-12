#!/bin/bash

# 动物爱宠分享论坛项目 - 开发环境启动脚本

echo "======================================"
echo "动物爱宠分享论坛项目开发环境启动脚本"
echo "======================================"

# 检查 Docker 是否安装
if ! command -v docker &> /dev/null; then
    echo "错误: Docker 未安装，请先安装 Docker"
    exit 1
fi

# 检查 Docker Compose 是否安装
if ! command -v docker-compose &> /dev/null; then
    echo "错误: Docker Compose 未安装，请先安装 Docker Compose"
    exit 1
fi

# 创建 .env 文件
if [ ! -f .env ]; then
    echo "正在创建 .env 文件..."
    cp .env.example .env
    echo "✅ .env 文件已创建，请根据需要修改配置"
else
    echo ".env 文件已存在"
fi

# 创建上传目录
if [ ! -d "uploads" ]; then
    echo "正在创建上传目录..."
    mkdir -p uploads
    echo "✅ 上传目录已创建"
fi

echo "======================================"
echo "正在启动开发环境..."
echo "======================================"

# 启动 Docker 容器
docker-compose up -d

# 等待数据库启动
echo "正在等待数据库服务启动..."
sleep 10

# 检查数据库连接
echo "正在检查数据库连接..."
if docker exec petforum-db pg_isready -U petforum -d petforum; then
    echo "✅ 数据库连接成功"
else
    echo "错误: 数据库连接失败"
    exit 1
fi

# 检查 Redis 连接
echo "正在检查 Redis 连接..."
if docker exec petforum-redis redis-cli ping; then
    echo "✅ Redis 连接成功"
else
    echo "错误: Redis 连接失败"
    exit 1
fi

# 启动后端服务
echo "======================================"
echo "正在启动后端服务..."
echo "======================================"

cd backend
npm install

if [ $? -ne 0 ]; then
    echo "错误: 后端依赖安装失败"
    exit 1
fi

npx prisma generate

if [ $? -ne 0 ]; then
    echo "错误: Prisma 生成失败"
    exit 1
fi

npx prisma migrate deploy

if [ $? -ne 0 ]; then
    echo "错误: 数据库迁移失败"
    exit 1
fi

echo "✅ 后端服务初始化成功"
cd ..

# 启动前端服务
echo "======================================"
echo "正在启动前端服务..."
echo "======================================"

cd frontend
npm install

if [ $? -ne 0 ]; then
    echo "错误: 前端依赖安装失败"
    exit 1
fi

echo "✅ 前端服务初始化成功"
cd ..

echo "======================================"
echo "开发环境启动完成!"
echo "======================================"

echo "📊 服务状态："
echo "  - 数据库: http://localhost:5432"
echo "  - Redis: http://localhost:6379"
echo "  - RabbitMQ: http://localhost:15672 (guest/guest)"
echo "  - 后端API: http://localhost:3000"
echo "  - API文档: http://localhost:3000/api/docs"
echo "  - 前端: http://localhost:3001"

echo "🚀 下一步操作："
echo "  1. 启动后端服务: cd backend && npm run start:dev"
echo "  2. 启动前端服务: cd frontend && npm run dev"
echo "  3. 查看服务日志: docker-compose logs -f"
