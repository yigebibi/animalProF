# 动物爱宠分享论坛 - 后端开发文档

## 概述

本项目后端使用 NestJS 10.x 框架，采用 TypeScript 语言开发，提供 RESTful API 接口，支持用户认证、内容管理、文件上传等功能。

## 技术架构

### 核心技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| NestJS | 10.x | 后端框架 |
| TypeScript | 5.x | 开发语言 |
| Prisma | 5.x | ORM |
| PostgreSQL | 14.x | 关系型数据库 |
| Redis | 7.x | 缓存/会话存储 |
| RabbitMQ | 3.x | 消息队列 |
| Socket.io | 4.x | 实时通信 |
| JWT | - | 身份认证 |
| Multer | - | 文件上传 |
| Swagger | - | API 文档 |

### 项目结构

```
backend/
├── src/
│   ├── main.ts                      # 应用入口
│   ├── app.module.ts                # 根模块
│   ├── common/                      # 公共模块
│   │   ├── decorators/              # 装饰器
│   │   │   ├── public.decorator.ts  # 公开接口装饰器
│   │   │   ├── roles.decorator.ts   # 角色装饰器
│   │   │   └── user.decorator.ts    # 用户装饰器
│   │   ├── filters/                 # 异常过滤器
│   │   │   └── http-exception.filter.ts
│   │   ├── guards/                  # 守卫
│   │   │   ├── auth.guard.ts        # 认证守卫
│   │   │   └── roles.guard.ts       # 角色守卫
│   │   ├── interceptors/            # 拦截器
│   │   │   ├── transform.interceptor.ts
│   │   │   └── logging.interceptor.ts
│   │   ├── pipes/                   # 管道
│   │   │   └── validation.pipe.ts   # 验证管道
│   │   ├── dto/                     # 公共 DTO
│   │   ├── exceptions/              # 自定义异常
│   │   └── utils/                   # 工具函数
│   ├── modules/                     # 业务模块
│   │   ├── auth/                    # 认证模块
│   │   │   ├── auth.module.ts
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── strategies/          # JWT策略
│   │   │   └── dto/                 # 数据传输对象
│   │   ├── user/                    # 用户模块
│   │   │   ├── user.module.ts
│   │   │   ├── user.controller.ts
│   │   │   ├── user.service.ts
│   │   │   └── dto/
│   │   ├── pet/                     # 宠物模块
│   │   │   ├── pet.module.ts
│   │   │   ├── pet.controller.ts
│   │   │   ├── pet.service.ts
│   │   │   └── dto/
│   │   ├── post/                    # 帖子模块
│   │   │   ├── post.module.ts
│   │   │   ├── post.controller.ts
│   │   │   ├── post.service.ts
│   │   │   └── dto/
│   │   ├── comment/                 # 评论模块
│   │   │   ├── comment.module.ts
│   │   │   ├── comment.controller.ts
│   │   │   ├── comment.service.ts
│   │   │   └── dto/
│   │   ├── file/                    # 文件模块
│   │   │   ├── file.module.ts
│   │   │   ├── file.controller.ts
│   │   │   ├── file.service.ts
│   │   │   └── dto/
│   │   ├── search/                  # 搜索模块
│   │   │   ├── search.module.ts
│   │   │   ├── search.controller.ts
│   │   │   └── search.service.ts
│   │   └── notification/            # 通知模块
│   │       ├── notification.module.ts
│   │       ├── notification.controller.ts
│   │       ├── notification.service.ts
│   │       └── gateways/            # Socket.io网关
│   ├── config/                      # 配置文件
│   │   ├── app.config.ts
│   │   ├── database.config.ts
│   │   └── redis.config.ts
│   ├── prisma/                      # Prisma 相关
│   │   ├── schema.prisma            # 数据模型
│   │   ├── seed.ts                  # 种子数据
│   │   └── migrations/              # 数据库迁移
│   └── database/                    # 数据库模块
│       └── prisma.service.ts
├── test/                            # 测试文件
│   ├── e2e/                         # 端到端测试
│   ├── unit/                        # 单元测试
│   └── jest-e2e.json
├── .env                             # 环境变量
├── .env.example
├── nest-cli.json                    # NestJS 配置
├── package.json                     # 依赖
├── tsconfig.json                    # TypeScript 配置
└── prisma/schema.prisma             # Prisma 模式
```

## 应用配置

### 主应用入口

```typescript
// src/main.ts
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // 启用 CORS
  app.enableCors({
    origin: ['http://localhost:3001', 'https://petforum.com'],
    credentials: true,
  });
  
  // 全局验证管道
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
  }));
  
  // 全局异常过滤器
  app.useGlobalFilters(new HttpExceptionFilter());
  
  // 全局拦截器
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalInterceptors(new LoggingInterceptor());
  
  // Swagger 配置
  const config = new DocumentBuilder()
    .setTitle('Pet Forum API')
    .setDescription('动物爱宠分享论坛 API 文档')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  
  // 全局前缀
  app.setGlobalPrefix('api/v1');
  
  const port = process.env.PORT || 3000;
  await app.listen(port);
  
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`Swagger docs: http://localhost:${port}/api/docs`);
}

bootstrap();
```

### 根模块

```typescript
// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './database/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { PetModule } from './modules/pet/pet.module';
import { PostModule } from './modules/post/post.module';
import { CommentModule } from './modules/comment/comment.module';
import { FileModule } from './modules/file/file.module';
import { SearchModule } from './modules/search/search.module';
import { NotificationModule } from './modules/notification/notification.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    PrismaModule,
    AuthModule,
    UserModule,
    PetModule,
    PostModule,
    CommentModule,
    FileModule,
    SearchModule,
    NotificationModule,
  ],
})
export class AppModule {}
```

## Prisma 数据库配置

```typescript
// src/database/prisma.service.ts
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect();
  }
  
  async onModuleDestroy() {
    await this.$disconnect();
  }
}
```

## 认证模块

### JWT 策略

```typescript
// src/modules/auth/strategies/jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }
  
  async validate(payload: any) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.userId },
    });
    if (!user) {
      throw new UnauthorizedException();
    }
    return { userId: user.id, role: user.role };
  }
}
```

### 认证服务

```typescript
// src/modules/auth/auth.service.ts
import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../database/prisma.service';
import { LoginDto, RegisterDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}
  
  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    
    if (!user) {
      throw new UnauthorizedException('用户不存在');
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    
    if (!isPasswordValid) {
      throw new UnauthorizedException('密码错误');
    }
    
    if (user.status !== 1) {
      throw new UnauthorizedException('账户已被禁用');
    }
    
    const payload = { userId: user.id, role: user.role };
    const token = this.jwtService.sign(payload);
    
    return {
      access_token: token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        avatarUrl: user.avatarUrl,
        nickname: user.nickname,
        role: user.role,
      },
    };
  }
  
  async register(registerDto: RegisterDto) {
    const { username, email, password } = registerDto;
    
    // 检查用户是否已存在
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });
    
    if (existingUser) {
      throw new ConflictException('用户名或邮箱已被使用');
    }
    
    // 加密密码
    const passwordHash = await bcrypt.hash(password, 10);
    
    // 创建用户
    const user = await this.prisma.user.create({
      data: {
        username,
        email,
        passwordHash,
        nickname: username,
      },
    });
    
    // 生成 Token
    const payload = { userId: user.id, role: user.role };
    const token = this.jwtService.sign(payload);
    
    return {
      access_token: token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        nickname: user.nickname,
        role: user.role,
      },
    };
  }
}
```

### 认证控制器

```typescript
// src/modules/auth/auth.controller.ts
import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  
  @Post('login')
  @HttpCode(200)
  @ApiOperation({ summary: '用户登录' })
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
  
  @Post('register')
  @ApiOperation({ summary: '用户注册' })
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }
}
```

## 认证守卫

```typescript
// src/common/guards/auth.guard.ts
import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }
  
  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    
    if (isPublic) {
      return true;
    }
    
    return super.canActivate(context);
  }
}
```

## 用户模块

### 用户服务

```typescript
// src/modules/user/user.service.ts
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { UpdateUserDto, ChangePasswordDto } from './dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
  
  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        email: true,
        avatarUrl: true,
        nickname: true,
        bio: true,
        gender: true,
        birthday: true,
        city: true,
        createdAt: true,
      },
    });
    
    if (!user) {
      throw new NotFoundException('用户不存在');
    }
    
    return user;
  }
  
  async findProfile(userId: number) {
    return this.findOne(userId);
  }
  
  async update(userId: number, updateUserDto: UpdateUserDto) {
    // 检查用户名是否重复
    if (updateUserDto.username) {
      const existing = await this.prisma.user.findFirst({
        where: {
          username: updateUserDto.username,
          NOT: { id: userId },
        },
      });
      if (existing) {
        throw new ConflictException('用户名已被使用');
      }
    }
    
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: updateUserDto,
      select: {
        id: true,
        username: true,
        email: true,
        avatarUrl: true,
        nickname: true,
        bio: true,
        gender: true,
        birthday: true,
        city: true,
        updatedAt: true,
      },
    });
    
    return user;
  }
  
  async changePassword(userId: number, changePasswordDto: ChangePasswordDto) {
    const { oldPassword, newPassword } = changePasswordDto;
    
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    
    if (!user) {
      throw new NotFoundException('用户不存在');
    }
    
    const isPasswordValid = await bcrypt.compare(oldPassword, user.passwordHash);
    
    if (!isPasswordValid) {
      throw new UnauthorizedException('旧密码错误');
    }
    
    const passwordHash = await bcrypt.hash(newPassword, 10);
    
    await this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    });
    
    return { message: '密码修改成功' };
  }
  
  async uploadAvatar(userId: number, avatarUrl: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { avatarUrl },
      select: {
        id: true,
        avatarUrl: true,
      },
    });
  }
}
```

## 帖子模块

### 帖子服务

```typescript
// src/modules/post/post.service.ts
import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreatePostDto, UpdatePostDto, PostsQueryDto } from './dto';

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) {}
  
  async findAll(query: PostsQueryDto) {
    const {
      page = 1,
      limit = 20,
      category,
      tag,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = query;
    
    const where: any = { status: 1 };
    
    if (category) {
      where.category = category;
    }
    
    if (tag) {
      where.tags = { has: tag };
    }
    
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { content: { contains: search } },
      ];
    }
    
    const [posts, total] = await Promise.all([
      this.prisma.post.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          user: {
            select: { id: true, username: true, nickname: true, avatarUrl: true },
          },
          pet: {
            select: { id: true, name: true, avatarUrl: true },
          },
        },
      }),
      this.prisma.post.count({ where }),
    ]);
    
    return {
      data: posts,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
  
  async findOne(id: number) {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, username: true, nickname: true, avatarUrl: true },
        },
        pet: true,
        comments: {
          include: {
            user: {
              select: { id: true, username: true, nickname: true, avatarUrl: true },
            },
          },
        },
      },
    });
    
    if (!post) {
      throw new NotFoundException('帖子不存在');
    }
    
    // 增加浏览数
    await this.prisma.post.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    });
    
    return post;
  }
  
  async create(userId: number, createPostDto: CreatePostDto) {
    const post = await this.prisma.post.create({
      data: {
        ...createPostDto,
        userId,
      },
      include: {
        user: {
          select: { id: true, username: true, nickname: true, avatarUrl: true },
        },
        pet: true,
      },
    });
    
    // 处理标签
    if (createPostDto.tags && createPostDto.tags.length > 0) {
      for (const tagName of createPostDto.tags) {
        await this.prisma.tag.upsert({
          where: { name: tagName },
          create: { name: tagName, postCount: 1 },
          update: { postCount: { increment: 1 } },
        });
      }
    }
    
    return post;
  }
  
  async update(userId: number, postId: number, updatePostDto: UpdatePostDto) {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
    });
    
    if (!post) {
      throw new NotFoundException('帖子不存在');
    }
    
    if (post.userId !== userId) {
      throw new ForbiddenException('无权修改此帖子');
    }
    
    return this.prisma.post.update({
      where: { id: postId },
      data: updatePostDto,
      include: {
        user: {
          select: { id: true, username: true, nickname: true, avatarUrl: true },
        },
        pet: true,
      },
    });
  }
  
  async remove(userId: number, postId: number) {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
    });
    
    if (!post) {
      throw new NotFoundException('帖子不存在');
    }
    
    if (post.userId !== userId) {
      throw new ForbiddenException('无权删除此帖子');
    }
    
    // 软删除
    return this.prisma.post.update({
      where: { id: postId },
      data: { status: -1 },
    });
  }
  
  async likePost(userId: number, postId: number) {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
    });
    
    if (!post) {
      throw new NotFoundException('帖子不存在');
    }
    
    // 检查是否已点赞
    const existingLike = await this.prisma.like.findUnique({
      where: {
        userId_targetType_targetId: {
          userId,
          targetType: 'post',
          targetId: postId,
        },
      },
    });
    
    if (existingLike) {
      return { message: '已经点赞过了', liked: true };
    }
    
    // 创建点赞
    await this.prisma.$transaction([
      this.prisma.like.create({
        data: {
          userId,
          targetType: 'post',
          targetId: postId,
        },
      }),
      this.prisma.post.update({
        where: { id: postId },
        data: { likeCount: { increment: 1 } },
      }),
      // 创建通知
      this.prisma.notification.create({
        data: {
          userId: post.userId,
          type: 'like',
          content: '有人点赞了你的帖子',
          relatedId: postId,
        },
      }),
    ]);
    
    return { message: '点赞成功', liked: true };
  }
  
  async unlikePost(userId: number, postId: number) {
    const existingLike = await this.prisma.like.findUnique({
      where: {
        userId_targetType_targetId: {
          userId,
          targetType: 'post',
          targetId: postId,
        },
      },
    });
    
    if (!existingLike) {
      return { message: '未点赞', liked: false };
    }
    
    await this.prisma.$transaction([
      this.prisma.like.delete({
        where: { id: existingLike.id },
      }),
      this.prisma.post.update({
        where: { id: postId },
        data: { likeCount: { decrement: 1 } },
      }),
    ]);
    
    return { message: '取消点赞', liked: false };
  }
  
  async favoritePost(userId: number, postId: number) {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
    });
    
    if (!post) {
      throw new NotFoundException('帖子不存在');
    }
    
    try {
      await this.prisma.favorite.create({
        data: {
          userId,
          postId,
        },
      });
    } catch (error) {
      return { message: '已收藏', favorited: true };
    }
    
    return { message: '收藏成功', favorited: true };
  }
  
  async unfavoritePost(userId: number, postId: number) {
    try {
      await this.prisma.favorite.deleteMany({
        where: {
          userId,
          postId,
        },
      });
    } catch (error) {
      // 忽略错误
    }
    
    return { message: '取消收藏', favorited: false };
  }
}
```

### 帖子控制器

```typescript
// src/modules/post/post.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PostService } from './post.service';
import { CreatePostDto, UpdatePostDto, PostsQueryDto } from './dto';
import { JwtAuthGuard } from '../../common/guards/auth.guard';
import { User } from '../../common/decorators/user.decorator';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('posts')
@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}
  
  @Get()
  @Public()
  @ApiOperation({ summary: '获取帖子列表' })
  findAll(@Query() query: PostsQueryDto) {
    return this.postService.findAll(query);
  }
  
  @Get(':id')
  @Public()
  @ApiOperation({ summary: '获取帖子详情' })
  findOne(@Param('id') id: string) {
    return this.postService.findOne(+id);
  }
  
  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '发布帖子' })
  create(@User('userId') userId: number, @Body() createPostDto: CreatePostDto) {
    return this.postService.create(userId, createPostDto);
  }
  
  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '更新帖子' })
  update(
    @User('userId') userId: number,
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.postService.update(userId, +id, updatePostDto);
  }
  
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '删除帖子' })
  remove(@User('userId') userId: number, @Param('id') id: string) {
    return this.postService.remove(userId, +id);
  }
  
  @Post(':id/like')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '点赞帖子' })
  likePost(@User('userId') userId: number, @Param('id') id: string) {
    return this.postService.likePost(userId, +id);
  }
  
  @Post(':id/unlike')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '取消点赞' })
  unlikePost(@User('userId') userId: number, @Param('id') id: string) {
    return this.postService.unlikePost(userId, +id);
  }
  
  @Post(':id/favorite')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '收藏帖子' })
  favoritePost(@User('userId') userId: number, @Param('id') id: string) {
    return this.postService.favoritePost(userId, +id);
  }
  
  @Post(':id/unfavorite')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '取消收藏' })
  unfavoritePost(@User('userId') userId: number, @Param('id') id: string) {
    return this.postService.unfavoritePost(userId, +id);
  }
}
```

## 文件模块

```typescript
// src/modules/file/file.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../database/prisma.service';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

@Injectable()
export class FileService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}
  
  async uploadFile(
    userId: number,
    file: Express.Multer.File,
    fileType: 'image' | 'video' | 'file' = 'image',
  ) {
    if (!file) {
      throw new BadRequestException('请选择文件');
    }
    
    // 验证文件大小
    const maxSize = fileType === 'video' ? 100 * 1024 * 1024 : 10 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new BadRequestException(`文件大小不能超过 ${maxSize / 1024 / 1024}MB`);
    }
    
    // 验证文件类型
    const allowedTypes = {
      image: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
      video: ['video/mp4', 'video/webm'],
      file: ['application/pdf', 'text/plain'],
    };
    
    if (!allowedTypes[fileType].includes(file.mimetype)) {
      throw new BadRequestException('不支持的文件类型');
    }
    
    // 生成文件名
    const extension = path.extname(file.originalname);
    const fileName = `${Date.now()}-${crypto.randomBytes(16).toString('hex')}${extension}`;
    
    // 保存文件
    const uploadDir = this.configService.get<string>('UPLOAD_DIR') || './uploads';
    const datePath = new Date().toISOString().split('T')[0];
    const filePath = path.join(uploadDir, datePath);
    
    if (!fs.existsSync(filePath)) {
      fs.mkdirSync(filePath, { recursive: true });
    }
    
    const fullPath = path.join(filePath, fileName);
    fs.writeFileSync(fullPath, file.buffer);
    
    // 保存文件记录
    const fileRecord = await this.prisma.file.create({
      data: {
        userId,
        originalName: file.originalname,
        fileName,
        filePath: `/${datePath}/${fileName}`,
        fileSize: file.size,
        mimeType: file.mimetype,
        fileType,
      },
    });
    
    const baseUrl = this.configService.get<string>('BASE_URL') || 'http://localhost:3000';
    
    return {
      id: fileRecord.id,
      url: `${baseUrl}/uploads${fileRecord.filePath}`,
      fileName: fileRecord.originalName,
      fileSize: fileRecord.fileSize,
    };
  }
  
  async deleteFile(userId: number, fileId: number) {
    const file = await this.prisma.file.findUnique({
      where: { id: fileId },
    });
    
    if (!file) {
      throw new BadRequestException('文件不存在');
    }
    
    if (file.userId !== userId) {
      throw new BadRequestException('无权删除此文件');
    }
    
    // 删除文件记录
    await this.prisma.file.update({
      where: { id: fileId },
      data: { status: 0 },
    });
    
    // 删除物理文件（异步处理）
    const uploadDir = this.configService.get<string>('UPLOAD_DIR') || './uploads';
    const fullPath = path.join(uploadDir, file.filePath.substring(1));
    
    setTimeout(() => {
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
    }, 1000);
    
    return { message: '文件已删除' };
  }
}
```

## 异常处理

```typescript
// src/common/filters/http-exception.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();
    
    const message =
      typeof exceptionResponse === 'string'
        ? exceptionResponse
        : (exceptionResponse as any).message || exception.message;
    
    response.status(status).json({
      code: status,
      message: message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
```

## 响应格式转换

```typescript
// src/common/interceptors/transform.interceptor.ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => ({
        code: 200,
        message: 'success',
        data: data,
        timestamp: new Date().toISOString(),
      })),
    );
  }
}
```

## 测试策略

### 单元测试

```typescript
// test/unit/user.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../../src/modules/user/user.service';
import { PrismaService } from '../../src/database/prisma.service';

describe('UserService', () => {
  let service: UserService;
  let prisma: PrismaService;
  
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
              update: jest.fn(),
            },
          },
        },
      ],
    }).compile();
    
    service = module.get<UserService>(UserService);
    prisma = module.get<PrismaService>(PrismaService);
  });
  
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  
  describe('findOne', () => {
    it('should return user by id', async () => {
      const mockUser = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
      };
      
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      
      const result = await service.findOne(1);
      expect(result).toEqual(mockUser);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        select: expect.any(Object),
      });
    });
    
    it('should throw NotFoundException when user not found', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
      
      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });
});
```

### 端到端测试

```typescript
// test/e2e/auth.e2e-spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';

describe('Auth (e2e)', () => {
  let app: INestApplication;
  let authToken: string;
  
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    
    app = moduleFixture.createNestApplication();
    await app.init();
  });
  
  afterAll(async () => {
    await app.close();
  });
  
  describe('POST /auth/register', () => {
    it('should register a new user', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          username: 'testuser',
          email: 'test@example.com',
          password: 'password123',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.data).toHaveProperty('access_token');
          expect(res.body.data).toHaveProperty('user');
        });
    });
  });
  
  describe('POST /auth/login', () => {
    it('should login with valid credentials', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123',
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.data).toHaveProperty('access_token');
          authToken = res.body.data.access_token;
        });
    });
    
    it('should return 401 with invalid credentials', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword',
        })
        .expect(401);
    });
  });
});
```

## 环境变量配置

```env
# .env
PORT=3000
NODE_ENV=development
BASE_URL=http://localhost:3000

# 数据库
DATABASE_URL="postgresql://user:password@localhost:5432/petforum?schema=public"

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# JWT
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=7d

# 文件上传
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760

# 阿里云 OSS
OSS_ACCESS_KEY_ID=your-access-key
OSS_ACCESS_KEY_SECRET=your-access-secret
OSS_BUCKET=petforum
OSS_REGION=oss-cn-hangzhou

# 邮件
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-email
SMTP_PASS=your-password
```

## Docker 部署

```dockerfile
# Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:18-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package.json ./

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
```

```yaml
# docker-compose.yml
version: '3.8'

services:
  postgres:
    image: postgres:14-alpine
    container_name: petforum-db
    environment:
      POSTGRES_USER: petforum
      POSTGRES_PASSWORD: petforum123
      POSTGRES_DB: petforum
    ports:
      - "5432:5432"
    volumes:
      - postgres-data:/var/lib/postgresql/data
  
  redis:
    image: redis:7-alpine
    container_name: petforum-redis
    ports:
      - "6379:6379"
  
  app:
    build: .
    container_name: petforum-api
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: "postgresql://petforum:petforum123@postgres:5432/petforum?schema=public"
      REDIS_HOST: redis
    depends_on:
      - postgres
      - redis
    volumes:
      - ./uploads:/app/uploads

volumes:
  postgres-data:
```

---

**文档版本**: 1.0  
**创建时间**: 2026-04-24  
**最后更新**: 2026-04-24  
**作者**: Claude AI