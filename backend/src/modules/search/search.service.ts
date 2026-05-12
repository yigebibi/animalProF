import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class SearchService {
  constructor(private prisma: PrismaService) {}

  async search(query: string, type?: 'posts' | 'users' | 'tags') {
    const results = {
      posts: [] as any[],
      users: [] as any[],
      tags: [] as any[],
    };

    if (!type || type === 'posts') {
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

    if (!type || type === 'users') {
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

    if (!type || type === 'tags') {
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
