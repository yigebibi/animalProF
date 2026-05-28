import { Injectable, NotFoundException, ConflictException, UnauthorizedException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import { UpdateUserDto, ChangePasswordDto, UpdateUserSettingsDto } from './dto';
import * as bcrypt from 'bcrypt';

const DEFAULT_NOTIFICATION_SETTINGS = {
  pushNotifications: true,
  emailNotifications: true,
  commentNotifications: true,
  likeNotifications: true,
  followNotifications: true,
};

const DEFAULT_PRIVACY_SETTINGS = {
  publicProfile: true,
  allowComments: true,
  allowLikes: true,
  allowFollows: true,
};

const DEFAULT_ACCOUNT_SECURITY_SETTINGS = {
  emailVerified: true,
  phoneVerified: false,
  twoFactorEnabled: false,
};

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

  async getProfileStats(userId: number) {
    const [petCount, postCount, favoriteCount, postLikes, commentLikes] = await Promise.all([
      this.prisma.pet.count({
        where: { userId, isActive: true },
      }),
      this.prisma.post.count({
        where: { userId, status: { not: -1 } },
      }),
      this.prisma.favorite.count({
        where: { userId },
      }),
      this.prisma.post.aggregate({
        where: { userId, status: { not: -1 } },
        _sum: { likeCount: true },
      }),
      this.prisma.comment.aggregate({
        where: { userId, status: 1 },
        _sum: { likeCount: true },
      }),
    ]);

    return {
      petCount,
      postCount,
      favoriteCount,
      likeCount: (postLikes._sum.likeCount || 0) + (commentLikes._sum.likeCount || 0),
    };
  }

  async getProfileActivities(userId: number) {
    const [posts, pets] = await Promise.all([
      this.prisma.post.findMany({
        where: { userId, status: { not: -1 } },
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          id: true,
          title: true,
          createdAt: true,
        },
      }),
      this.prisma.pet.findMany({
        where: { userId, isActive: true },
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          id: true,
          name: true,
          createdAt: true,
        },
      }),
    ]);

    return [
      ...posts.map((post) => ({
        id: `post-${post.id}`,
        type: 'post',
        title: post.title,
        createdAt: post.createdAt,
      })),
      ...pets.map((pet) => ({
        id: `pet-${pet.id}`,
        type: 'pet',
        title: pet.name,
        createdAt: pet.createdAt,
      })),
    ]
      .sort((first, second) => second.createdAt.getTime() - first.createdAt.getTime())
      .slice(0, 6);
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

  async getSettings(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        email: true,
        notificationSettings: true,
        privacySettings: true,
        accountSecuritySettings: true,
      },
    });

    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    return {
      notificationSettings: (user.notificationSettings as object) || DEFAULT_NOTIFICATION_SETTINGS,
      privacySettings: (user.privacySettings as object) || DEFAULT_PRIVACY_SETTINGS,
      accountSecurity:
        (user.accountSecuritySettings as object) || {
          ...DEFAULT_ACCOUNT_SECURITY_SETTINGS,
          emailVerified: !!user.email,
        },
    };
  }

  async updateSettings(userId: number, updateUserSettingsDto: UpdateUserSettingsDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true },
    });

    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    const settings = await this.prisma.user.update({
      where: { id: userId },
      data: {
        notificationSettings: updateUserSettingsDto.notificationSettings as unknown as Prisma.InputJsonValue,
        privacySettings: updateUserSettingsDto.privacySettings as unknown as Prisma.InputJsonValue,
        accountSecuritySettings: {
          ...updateUserSettingsDto.accountSecurity,
          emailVerified: !!user.email,
        } as Prisma.InputJsonValue,
      },
      select: {
        notificationSettings: true,
        privacySettings: true,
        accountSecuritySettings: true,
      },
    });

    return {
      notificationSettings: settings.notificationSettings,
      privacySettings: settings.privacySettings,
      accountSecurity: settings.accountSecuritySettings,
    };
  }

  async deleteAccount(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });

    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: { status: 0 },
    });

    return { message: '账户已删除' };
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
