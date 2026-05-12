// 表单验证
import { z } from 'zod';

// 登录表单验证
export const loginSchema = z.object({
  email: z.string().email('请输入有效的邮箱地址'),
  password: z.string().min(6, '密码至少6位'),
});

// 注册表单验证
export const registerSchema = z.object({
  username: z.string().min(2, '用户名至少2位').max(20, '用户名最多20位'),
  email: z.string().email('请输入有效的邮箱地址'),
  password: z.string().min(6, '密码至少6位'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "密码不匹配",
  path: ["confirmPassword"],
});

// 发布帖子表单验证
export const postSchema = z.object({
  title: z.string().min(1, '请输入标题').max(200, '标题最多200字'),
  content: z.string().min(10, '内容至少10字'),
  petId: z.number().optional(),
  tags: z.array(z.string()).optional(),
  category: z.string().optional(),
});

// 宠物信息验证
export const petSchema = z.object({
  name: z.string().min(1, '请输入宠物名字').max(100, '名字最多100字'),
  type: z.string().min(1, '请选择宠物类型'),
  breed: z.string().optional(),
  gender: z.number().optional(),
  birthday: z.string().optional(),
  bio: z.string().max(500, '简介最多500字').optional(),
});

// 更新用户信息验证
export const updateProfileSchema = z.object({
  nickname: z.string().min(1, '请输入昵称').max(20, '昵称最多20字').optional(),
  bio: z.string().max(500, '简介最多500字').optional(),
  gender: z.number().optional(),
  birthday: z.string().optional(),
  city: z.string().optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type PostFormData = z.infer<typeof postSchema>;
export type PetFormData = z.infer<typeof petSchema>;
export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;
