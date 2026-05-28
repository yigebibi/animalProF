import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class SearchService {
  constructor(private prisma: PrismaService) {}

  async search(query: string, type?: 'post' | 'user' | 'tag' | 'posts' | 'users' | 'tags') {
    const normalizedType =
      type === 'post' ? 'posts' : type === 'user' ? 'users' : type === 'tag' ? 'tags' : type;

    const results = {
      posts: [] as any[],
      users: [] as any[],
      tags: [] as any[],
    };

    if (!normalizedType || normalizedType === 'posts') {
      results.posts = await this.prisma.post.findMany({
        where: {
          status: 1,
          OR: [
            { title: { contains: query } },
            { content: { contains: query } },
          ],
        },
        include: {
          user: {
            select: { id: true, username: true, nickname: true, avatarUrl: true },
          },
        },
        take: 20,
      });
    }

    if (!normalizedType || normalizedType === 'users') {
      results.users = await this.prisma.user.findMany({
        where: {
          status: 1,
          OR: [
            { username: { contains: query } },
            { nickname: { contains: query } },
          ],
        },
        select: {
          id: true,
          username: true,
          nickname: true,
          avatarUrl: true,
          bio: true,
        },
        take: 20,
      });
    }

    if (!normalizedType || normalizedType === 'tags') {
      results.tags = await this.prisma.tag.findMany({
        where: {
          name: { contains: query },
        },
        take: 20,
      });
    }

    return results;
  }
}
