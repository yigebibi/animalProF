import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('开始种子数据...');

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

  const user2 = await prisma.user.upsert({
    where: { email: 'catlover@example.com' },
    update: {},
    create: {
      username: 'catlover',
      email: 'catlover@example.com',
      passwordHash: hashedPassword,
      nickname: '猫咪爱好者',
      bio: '爱猫人士，家有三只猫',
      role: 0,
      status: 1,
    },
  });

  console.log('创建用户:', user1, admin, user2);

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

  const pet3 = await prisma.pet.upsert({
    where: { id: 3 },
    update: {},
    create: {
      userId: user2.id,
      name: '咪咪',
      type: '猫',
      breed: '英短',
      gender: 2,
      bio: '英短蓝猫',
      isActive: true,
    },
  });

  console.log('创建宠物:', pet1, pet2, pet3);

  const post1 = await prisma.post.upsert({
    where: { id: 1 },
    update: {},
    create: {
      userId: user1.id,
      petId: pet1.id,
      title: '第一次带小白去公园',
      content: '今天天气很好，我带小白去了公园。它玩得非常开心，还认识了一些新朋友！金毛真的很亲人，看到每个人都要去摇尾巴。',
      tags: ['宠物', '金毛', '公园'],
      category: 'share',
      status: 1,
      viewCount: 42,
      likeCount: 5,
      commentCount: 2,
      favoriteCount: 3,
    },
  });

  const post2 = await prisma.post.upsert({
    where: { id: 2 },
    update: {},
    create: {
      userId: user1.id,
      petId: pet2.id,
      title: '橘子今天两岁了',
      content: '时间过得真快，橘子来我家已经两年了。今天给它买了生日蛋糕，它很喜欢！橘猫真的太可爱了，每天都能给我带来快乐。',
      tags: ['猫', '生日', '宠物'],
      category: 'share',
      status: 1,
      viewCount: 28,
      likeCount: 8,
      commentCount: 3,
      favoriteCount: 5,
    },
  });

  const post3 = await prisma.post.upsert({
    where: { id: 3 },
    update: {},
    create: {
      userId: user2.id,
      petId: pet3.id,
      title: '英短蓝猫的日常护理心得',
      content: '养英短蓝猫已经三年了，分享一些护理心得。英短的毛发需要定期梳理，饮食上要注意控制体重，它们比较容易发胖。定期体检也很重要哦！',
      tags: ['猫', '英短', '护理', '经验'],
      category: 'discussion',
      status: 1,
      viewCount: 15,
      likeCount: 3,
      commentCount: 1,
      favoriteCount: 2,
    },
  });

  console.log('创建帖子:', post1, post2, post3);

  // 创建评论
  const comment1 = await prisma.comment.upsert({
    where: { id: 1 },
    update: {},
    create: {
      userId: user2.id,
      postId: post1.id,
      content: '小白好可爱！金毛真的很温柔。',
      status: 1,
      likeCount: 2,
    },
  });

  const comment2 = await prisma.comment.upsert({
    where: { id: 2 },
    update: {},
    create: {
      userId: user1.id,
      postId: post1.id,
      parentId: comment1.id,
      content: '谢谢！它确实很温柔，经常跟陌生人撒娇。',
      status: 1,
      likeCount: 1,
    },
  });

  const comment3 = await prisma.comment.upsert({
    where: { id: 3 },
    update: {},
    create: {
      userId: user1.id,
      postId: post2.id,
      content: '祝橘子生日快乐！🎂',
      status: 1,
      likeCount: 3,
    },
  });

  const comment4 = await prisma.comment.upsert({
    where: { id: 4 },
    update: {},
    create: {
      userId: user2.id,
      postId: post3.id,
      content: '很实用的经验分享，谢谢！我家英短也胖了...',
      status: 1,
      likeCount: 1,
    },
  });

  console.log('创建评论:', comment1, comment2, comment3, comment4);

  // 创建点赞
  const like1 = await prisma.like.upsert({
    where: { userId_targetType_targetId: { userId: user2.id, targetType: 'post', targetId: post1.id } },
    update: {},
    create: { userId: user2.id, targetType: 'post', targetId: post1.id },
  });

  const like2 = await prisma.like.upsert({
    where: { userId_targetType_targetId: { userId: user1.id, targetType: 'comment', targetId: comment3.id } },
    update: {},
    create: { userId: user1.id, targetType: 'comment', targetId: comment3.id },
  });

  console.log('创建点赞:', like1, like2);

  // 创建收藏
  const favorite1 = await prisma.favorite.upsert({
    where: { userId_postId: { userId: user2.id, postId: post1.id } },
    update: {},
    create: { userId: user2.id, postId: post1.id },
  });

  const favorite2 = await prisma.favorite.upsert({
    where: { userId_postId: { userId: user1.id, postId: post3.id } },
    update: {},
    create: { userId: user1.id, postId: post3.id },
  });

  console.log('创建收藏:', favorite1, favorite2);

  // 创建标签
  const tags = [
    { name: '宠物', postCount: 3 },
    { name: '金毛', postCount: 1 },
    { name: '猫', postCount: 2 },
    { name: '生日', postCount: 1 },
    { name: '英短', postCount: 1 },
    { name: '公园', postCount: 1 },
    { name: '护理', postCount: 1 },
    { name: '经验', postCount: 1 },
  ];

  for (const tag of tags) {
    await prisma.tag.upsert({
      where: { name: tag.name },
      update: { postCount: tag.postCount },
      create: tag,
    });
  }

  console.log('创建标签:', tags.map((t) => t.name));

  // 创建通知
  await prisma.notification.createMany({
    data: [
      { userId: user1.id, type: 'like', content: '猫咪爱好者 点赞了你的帖子《第一次带小白去公园》', relatedId: post1.id },
      { userId: user1.id, type: 'comment', content: '猫咪爱好者 评论了你的帖子《第一次带小白去公园》', relatedId: comment1.id },
      { userId: user2.id, type: 'like', content: '测试用户 点赞了你的评论', relatedId: comment4.id },
    ],
    skipDuplicates: true,
  });

  console.log('创建通知');

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
