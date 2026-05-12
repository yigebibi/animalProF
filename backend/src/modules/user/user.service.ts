import { Injectable, NotFoundException, ConflictException, UnauthorizedException } from '@nestjs/common';
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
