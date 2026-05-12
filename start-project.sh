#!/bin/bash

# 宠物论坛项目启动脚本

echo "===================================="
echo "      宠物论坛项目启动工具          "
echo "===================================="

# 检查 Docker 是否安装
if ! command -v docker &> /dev/null; then
    echo "❌ 错误: Docker 未安装。请先安装 Docker 后再运行此脚本。"
    exit 1
fi

# 检查 Docker Compose 是否安装
if ! command -v docker-compose &> /dev/null; then
    echo "❌ 错误: Docker Compose 未安装。请先安装 Docker Compose 后再运行此脚本。"
    exit 1
fi

# 检查 .env 文件是否存在
if [ ! -f "D:\selfProject\backend\.env" ]; then
    echo "⚠️  警告: .env 文件不存在，正在创建..."
    cp "D:\selfProject\backend\.env.example" "D:\selfProject\backend\.env"
fi

# 启动项目
echo ""
echo "🚀 正在启动项目服务..."
echo ""
cd "D:\selfProject"
docker-compose up -d

# 检查服务是否成功启动
if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 服务启动成功！"
    echo ""
    echo "📋 服务列表:"
    echo "  - PostgreSQL: 运行在端口 5432"
    echo "  - Redis: 运行在端口 6379"
    echo "  - API服务: 运行在端口 3000"
    echo ""
    echo "📚 访问信息:"
    echo "  - API文档: http://localhost:3000/api/docs"
    echo "  - Prisma Studio: 运行命令 'cd backend && npx prisma studio'"
    echo ""

    # 检查是否需要数据库迁移
    echo "🔄 检查数据库迁移..."
    echo "   运行以下命令进行数据库迁移和初始化:"
    echo "   docker-compose exec backend npx prisma migrate dev"
    echo "   docker-compose exec backend npm run prisma:seed"
    echo ""
    echo "💡 建议先运行数据库迁移命令!"
else
    echo ""
    echo "❌ 服务启动失败！"
fi
