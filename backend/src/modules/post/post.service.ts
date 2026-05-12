import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreatePostDto, UpdatePostDto, PostsQueryDto } from './dto';
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class PostService {
  constructor(
    private prisma: PrismaService,
    private notificationService: NotificationService,
  ) {}

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

    // 检查是否已经点赞
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
      throw new ForbiddenException('已经点赞过了');
    }

    // 创建点赞
    await this.prisma.like.create({
      data: {
        userId,
        targetType: 'post',
        targetId: postId,
      },
    });

    // 更新点赞数
    const updatedPost = await this.prisma.post.update({
      where: { id: postId },
      data: { likeCount: { increment: 1 } },
    });

    // 发送通知（如果不是自己点赞）
    if (post.userId !== userId) {
      await this.notificationService.create(
        post.userId,
        'like',
        `用户点赞了你的帖子`,
        postId,
      );
    }

    return updatedPost;
  }

  async unlikePost(userId: number, postId: number) {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundException('帖子不存在');
    }

    // 检查是否已经点赞
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
      throw new ForbiddenException('还没有点赞');
    }

    // 删除点赞
    await this.prisma.like.delete({
      where: {
        userId_targetType_targetId: {
          userId,
          targetType: 'post',
          targetId: postId,
        },
      },
    });

    // 更新点赞数
    return this.prisma.post.update({
      where: { id: postId },
      data: { likeCount: { decrement: 1 } },
    });
  }

  async favoritePost(userId: number, postId: number) {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundException('帖子不存在');
    }

    // 检查是否已经收藏
    const existingFavorite = await this.prisma.favorite.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    if (existingFavorite) {
      throw new ForbiddenException('已经收藏过了');
    }

    // 创建收藏
    await this.prisma.favorite.create({
      data: {
        userId,
        postId,
      },
    });

    return post;
  }

  async unfavoritePost(userId: number, postId: number) {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundException('帖子不存在');
    }

    // 检查是否已经收藏
    const existingFavorite = await this.prisma.favorite.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    if (!existingFavorite) {
      throw new ForbiddenException('还没有收藏');
    }

    // 删除收藏
    await this.prisma.favorite.delete({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    return post;
  }

  async getFavorites(userId: number, page: number = 1, limit: number = 20) {
    const [favorites, total] = await Promise.all([
      this.prisma.favorite.findMany({
        where: { userId },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          post: {
            include: {
              user: {
                select: { id: true, username: true, nickname: true, avatarUrl: true },
              },
              pet: true,
            },
          },
        },
      }),
      this.prisma.favorite.count({ where: { userId } }),
    ]);

    return {
      data: favorites.map(f => f.post),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async checkLikeStatus(userId: number, postId: number) {
    const like = await this.prisma.like.findUnique({
      where: {
        userId_targetType_targetId: {
          userId,
          targetType: 'post',
          targetId: postId,
        },
      },
    });
    return { isLiked: !!like };
  }

  async checkFavoriteStatus(userId: number, postId: number) {
    const favorite = await this.prisma.favorite.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });
    return { isFavorited: !!favorite };
  }
}
