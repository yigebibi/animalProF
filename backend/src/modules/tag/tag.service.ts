import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateTagDto, UpdateTagDto, TagQueryDto } from './dto';

@Injectable()
export class TagService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: TagQueryDto) {
    const { page = 1, limit = 20, search } = query;

    const where: any = {};
    if (search) {
      where.name = { contains: search };
    }

    const [tags, total] = await Promise.all([
      this.prisma.tag.findMany({
        where,
        orderBy: { postCount: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.tag.count({ where }),
    ]);

    return {
      data: tags,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number) {
    const tag = await this.prisma.tag.findUnique({
      where: { id },
    });

    if (!tag) {
      throw new NotFoundException('标签不存在');
    }

    return tag;
  }

  async create(createTagDto: CreateTagDto) {
    const existing = await this.prisma.tag.findUnique({
      where: { name: createTagDto.name },
    });

    if (existing) {
      throw new ConflictException('标签已存在');
    }

    return this.prisma.tag.create({
      data: createTagDto,
    });
  }

  async update(id: number, updateTagDto: UpdateTagDto) {
    const tag = await this.prisma.tag.findUnique({
      where: { id },
    });

    if (!tag) {
      throw new NotFoundException('标签不存在');
    }

    if (updateTagDto.name && updateTagDto.name !== tag.name) {
      const existing = await this.prisma.tag.findUnique({
        where: { name: updateTagDto.name },
      });
      if (existing) {
        throw new ConflictException('标签名称已存在');
      }
    }

    return this.prisma.tag.update({
      where: { id },
      data: updateTagDto,
    });
  }

  async remove(id: number) {
    const tag = await this.prisma.tag.findUnique({
      where: { id },
    });

    if (!tag) {
      throw new NotFoundException('标签不存在');
    }

    await this.prisma.tag.delete({
      where: { id },
    });

    return { message: '标签已删除' };
  }
}
