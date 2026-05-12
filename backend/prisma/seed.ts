import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('开始种子数据...');

  // 创建测试用户
  const hashedPassword = await bcrypt.hash('password123', 10);

  const user1 = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      username: 'testuser',
      email: 'test@example.com',
      passwordHash: hashedPassword,
      nickname: '测试用户',
      bio: '这是一个测试用户账户',
      role: 0,
      status: 1,
    },
  });

  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      username: 'admin',
      email: 'admin@example.com',
      passwordHash: hashedPassword,
      nickname: '管理员',
      bio: '管理员账户',
      role: 1,
      status: 1,
    },
  });

  console.log('创建用户:', user1, admin);

  // 创建测试宠物
  const pet1 = await prisma.pet.upsert({
    where: { id: 1 },
    update: {},
    create: {
      userId: user1.id,
      name: '小白',
      type: '狗',
      breed: '金毛',
      gender: 1,
      bio: '温顺的金毛犬',
      isActive: true,
    },
  });

  const pet2 = await prisma.pet.upsert({
    where: { id: 2 },
    update: {},
    create: {
      userId: user1.id,
      name: '橘子',
      type: '猫',
      breed: '橘猫',
      gender: 2,
      bio: '可爱的小橘猫',
      isActive: true,
    },
  });

  console.log('创建宠物:', pet1, pet2);

  // 创建测试帖子
  const post1 = await prisma.post.upsert({
    where: { id: 1 },
    update: {},
    create: {
      userId: user1.id,
      petId: pet1.id,
      title: '第一次带小白去公园',
      content: '今天天气很好，我带小白去了公园。它玩得非常开心，还认识了一些新朋友！',
      tags: ['宠物', '金毛', '公园'],
      category: 'share',
      status: 1,
    },
  });

  const post2 = await prisma.post.upsert({
    where: { id: 2 },
    update: {},
    create: {
      userId: user1.id,
      petId: pet2.id,
      title: '橘子今天两岁了',
      content: '时间过得真快，橘子来我家已经两年了。今天给它买了生日蛋糕，它很喜欢！',
      tags: ['猫', '生日', '宠物'],
      category: 'share',
      status: 1,
    },
  });

  console.log('创建帖子:', post1, post2);

  // 创建测试标签
  await prisma.tag.upsert({
    where: { name: '宠物' },
    update: { postCount: 2 },
    create: { name: '宠物', postCount: 2 },
  });

  await prisma.tag.upsert({
    where: { name: '狗' },
    update: {},
    create: { name: '狗', postCount: 1 },
  });

  await prisma.tag.upsert({
    where: { name: '猫' },
    update: {},
    create: { name: '猫', postCount: 1 },
  });

  console.log('种子数据完成！');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
