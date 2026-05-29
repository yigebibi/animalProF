import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreatePetDto, UpdatePetDto } from './dto';

@Injectable()
export class PetService {
  constructor(private prisma: PrismaService) {}

  async findAllByUserId(userId: number) {
    return this.prisma.pet.findMany({
      where: { userId, isActive: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    const pet = await this.prisma.pet.findUnique({
      where: { id },
      include: { user: { select: { id: true, username: true, nickname: true, avatarUrl: true } } },
    });

    if (!pet) {
      throw new NotFoundException('宠物不存在');
    }

    return pet;
  }

  async findPetPosts(petId: number, page: number = 1, limit: number = 20) {
    const pet = await this.prisma.pet.findUnique({
      where: { id: petId },
    });

    if (!pet) {
      throw new NotFoundException('宠物不存在');
    }

    const [posts, total] = await Promise.all([
      this.prisma.post.findMany({
        where: { petId, status: 1 },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          user: {
            select: { id: true, username: true, nickname: true, avatarUrl: true },
          },
        },
      }),
      this.prisma.post.count({ where: { petId, status: 1 } }),
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

  async create(userId: number, createPetDto: CreatePetDto) {
    return this.prisma.pet.create({
      data: {
        ...createPetDto,
        userId,
      },
    });
  }

  async update(userId: number, petId: number, updatePetDto: UpdatePetDto) {
    const pet = await this.prisma.pet.findUnique({
      where: { id: petId },
    });

    if (!pet) {
      throw new NotFoundException('宠物不存在');
    }

    if (pet.userId !== userId) {
      throw new ForbiddenException('无权修改此宠物');
    }

    return this.prisma.pet.update({
      where: { id: petId },
      data: updatePetDto,
    });
  }

  async remove(userId: number, petId: number) {
    const pet = await this.prisma.pet.findUnique({
      where: { id: petId },
    });

    if (!pet) {
      throw new NotFoundException('宠物不存在');
    }

    if (pet.userId !== userId) {
      throw new ForbiddenException('无权删除此宠物');
    }

    return this.prisma.pet.update({
      where: { id: petId },
      data: { isActive: false },
    });
  }
}
