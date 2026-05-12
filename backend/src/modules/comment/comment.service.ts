import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateCommentDto, UpdateCommentDto } from './dto';
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class CommentService {
  constructor(
    private prisma: PrismaService,
    private notificationService: NotificationService,
  ) {}

  async findAllByPostId(postId: number) {
    return this.prisma.comment.findMany({
      where: {
        postId,
        status: 1,
        parentId: null
      },
      include: {
        user: {
          select: { id: true, username: true, nickname: true, avatarUrl: true }
        },
        replies: {
          include: {
            user: {
              select: { id: true, username: true, nickname: true, avatarUrl: true }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async findOne(id: number) {
    const comment = await this.prisma.comment.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, username: true, nickname: true, avatarUrl: true }
        }
      }
    });

    if (!comment) {
      throw new NotFoundException('评论不存在');
    }

    return comment;
  }

  async create(userId: number, postId: number, createCommentDto: CreateCommentDto) {
    // 检查 post 是否存在
    const post = await this.prisma.post.findUnique({
      where: { id: postId }
    });

    if (!post) {
      throw new NotFoundException('帖子不存在');
    }

    return this.prisma.$transaction(async (prisma) => {
      const comment = await prisma.comment.create({
        data: {
          content: createCommentDto.content,
          userId,
          postId,
          parentId: createCommentDto.parentId
        },
        include: {
          user: {
            select: { id: true, username: true, nickname: true, avatarUrl: true }
          }
        }
      });

      // 更新帖子评论数
      await prisma.post.update({
        where: { id: postId },
        data: { commentCount: { increment: 1 } }
      });

      // 创建通知（如果不是自己评论）
      if (post.userId !== userId) {
        await this.notificationService.create(
          post.userId,
          'comment',
          '有人评论了你的帖子',
          postId
        );
      }

      return comment;
    });
  }

  async update(userId: number, commentId: number, updateCommentDto: UpdateCommentDto) {
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId }
    });

    if (!comment) {
      throw new NotFoundException('评论不存在');
    }

    if (comment.userId !== userId) {
      throw new ForbiddenException('无权修改此评论');
    }

    return this.prisma.comment.update({
      where: { id: commentId },
      data: updateCommentDto,
      include: {
        user: {
          select: { id: true, username: true, nickname: true, avatarUrl: true }
        }
      }
    });
  }

  async remove(userId: number, commentId: number) {
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId }
    });

    if (!comment) {
      throw new NotFoundException('评论不存在');
    }

    if (comment.userId !== userId) {
      throw new ForbiddenException('无权删除此评论');
    }

    return this.prisma.$transaction(async (prisma) => {
      // 软删除
      await prisma.comment.update({
        where: { id: commentId },
        data: { status: -1 }
      });

      // 更新帖子评论数
      await prisma.post.update({
        where: { id: comment.postId },
        data: { commentCount: { decrement: 1 } }
      });

      return { message: '删除成功' };
    });
  }

  async likeComment(userId: number, commentId: number) {
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      throw new NotFoundException('评论不存在');
    }

    // 检查是否已经点赞
    const existingLike = await this.prisma.like.findUnique({
      where: {
        userId_targetType_targetId: {
          userId,
          targetType: 'comment',
          targetId: commentId,
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
        targetType: 'comment',
        targetId: commentId,
      },
    });

    // 更新点赞数
    const updatedComment = await this.prisma.comment.update({
      where: { id: commentId },
      data: { likeCount: { increment: 1 } },
    });

    // 发送通知（如果不是自己点赞）
    if (comment.userId !== userId) {
      await this.notificationService.create(
        comment.userId,
        'like',
        '有人点赞了你的评论',
        commentId,
      );
    }

    return updatedComment;
  }

  async unlikeComment(userId: number, commentId: number) {
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      throw new NotFoundException('评论不存在');
    }

    // 检查是否已经点赞
    const existingLike = await this.prisma.like.findUnique({
      where: {
        userId_targetType_targetId: {
          userId,
          targetType: 'comment',
          targetId: commentId,
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
          targetType: 'comment',
          targetId: commentId,
        },
      },
    });

    // 更新点赞数
    return this.prisma.comment.update({
      where: { id: commentId },
      data: { likeCount: { decrement: 1 } },
    });
  }

  async checkCommentLikeStatus(userId: number, commentId: number) {
    const like = await this.prisma.like.findUnique({
      where: {
        userId_targetType_targetId: {
          userId,
          targetType: 'comment',
          targetId: commentId,
        },
      },
    });
    return { isLiked: !!like };
  }
}
