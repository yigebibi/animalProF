.PHONY: help start stop restart build clean install dev test deploy

# 项目名称
PROJECT_NAME := petforum

# 颜色定义
RED := \033[0;31m
GREEN := \033[0;32m
YELLOW := \033[1;33m
BLUE := \033[0;34m
NC := \033[0m # No Color

help: ## 显示帮助信息
	@echo "======================================"
	@echo "  动物爱宠分享论坛项目管理工具"
	@echo "======================================"
	@echo ""
	@echo "可用命令:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(GREEN)%-15s$(NC) %s\n", $$1, $$2}'
	@echo ""

start: ## 启动开发环境 (Docker Compose)
	@echo "$(BLUE)正在启动开发环境...$(NC)"
	@docker-compose up -d
	@echo "$(GREEN)开发环境已启动!$(NC)"

stop: ## 停止开发环境
	@echo "$(BLUE)正在停止开发环境...$(NC)"
	@docker-compose down
	@echo "$(GREEN)开发环境已停止$(NC)"

restart: ## 重启开发环境
	@echo "$(BLUE)正在重启开发环境...$(NC)"
	@docker-compose restart
	@echo "$(GREEN)开发环境已重启$(NC)"

logs: ## 查看服务日志
	@docker-compose logs -f

build: ## 构建 Docker 镜像
	@echo "$(BLUE)正在构建 Docker 镜像...$(NC)"
	@docker-compose build
	@echo "$(GREEN)镜像构建完成$(NC)"

clean: ## 清理所有资源 (停止并删除容器、镜像、卷)
	@echo "$(YELLOW)警告: 这将删除所有容器、镜像和卷!$(NC)"
	@read -p "确认继续? (y/N): " confirm; \
	if [ "$$confirm" = "y" ] || [ "$$confirm" = "Y" ]; then \
		echo "$(BLUE)正在清理...$(NC)"; \
		docker-compose down -v --rmi all; \
		echo "$(GREEN)清理完成$(NC)"; \
	else \
		echo "$(YELLOW)操作已取消$(NC)"; \
	fi

install: ## 安装所有依赖
	@echo "$(BLUE)正在安装后端依赖...$(NC)"
	@cd backend && npm install
	@echo "$(BLUE)正在安装前端依赖...$(NC)"
	@cd frontend && npm install
	@echo "$(GREEN)依赖安装完成$(NC)"

dev-backend: ## 启动后端开发服务器
	@echo "$(BLUE)正在启动后端服务...$(NC)"
	@cd backend && npm run start:dev

dev-frontend: ## 启动前端开发服务器
	@echo "$(BLUE)正在启动前端服务...$(NC)"
	@cd frontend && npm run dev

dev: ## 启动前后端开发服务器 (并行)
	@echo "$(BLUE)正在启动开发服务器...$(NC)"
	@make -j2 dev-backend dev-frontend

test: ## 运行所有测试
	@echo "$(BLUE)正在运行后端测试...$(NC)"
	@cd backend && npm run test
	@echo "$(BLUE)正在运行前端测试...$(NC)"
	@cd frontend && npm run test

test-backend: ## 运行后端测试
	@cd backend && npm run test

test-frontend: ## 运行前端测试
	@cd frontend && npm run test

db-migrate: ## 运行数据库迁移
	@echo "$(BLUE)正在运行数据库迁移...$(NC)"
	@cd backend && npx prisma migrate deploy
	@echo "$(GREEN)迁移完成$(NC)"

db-seed: ## 运行数据库种子数据
	@echo "$(BLUE)正在添加种子数据...$(NC)"
	@cd backend && npx prisma db seed
	@echo "$(GREEN)种子数据添加完成$(NC)"

db-studio: ## 打开 Prisma Studio (数据库可视化工具)
	@cd backend && npx prisma studio

deploy: ## 部署到生产环境
	@echo "$(BLUE)正在部署...$(NC)"
	@echo "$(YELLOW)请确保已配置好生产环境变量$(NC)"
	@docker-compose -f docker-compose.prod.yml up -d
	@echo "$(GREEN)部署完成$(NC)"

status: ## 查看服务状态
	@echo "$(BLUE)服务状态:$(NC)"
	@docker-compose ps
