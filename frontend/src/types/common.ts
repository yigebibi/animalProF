// 通用类型定义

export interface ApiSuccessResponse<T = any> {
  code: number;
  message: string;
  data: T;
  timestamp: number;
}

export interface ApiErrorResponse {
  code: number;
  message: string;
  error?: string;
  timestamp: number;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginationResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

export interface User {
  id: number;
  username: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  nickname?: string;
  bio?: string;
  gender: number; // 0:未知, 1:男, 2:女
  birthday?: string;
  city?: string;
  role: number; // 0:普通用户, 1:管理员
  status: number; // 1:正常, 0:禁用
  createdAt: string;
  updatedAt: string;
}

export interface Pet {
  id: number;
  userId: number;
  name: string;
  type: string;
  breed?: string;
  gender: number; // 0:未知, 1:公, 2:母
  birthday?: string;
  avatarUrl?: string;
  bio?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Post {
  id: number;
  userId: number;
  petId?: number;
  title: string;
  content: string;
  coverUrl?: string;
  tags: string[];
  category: string;
  status: number;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  createdAt: string;
  updatedAt: string;
  user?: User;
  pet?: Pet;
}

export interface Comment {
  id: number;
  userId: number;
  postId: number;
  parentId?: number;
  content: string;
  status: number;
  likeCount: number;
  createdAt: string;
  updatedAt: string;
  user?: User;
  replies?: Comment[];
}

export interface Like {
  id: number;
  userId: number;
  targetType: string;
  targetId: number;
  createdAt: string;
}

export interface Favorite {
  id: number;
  userId: number;
  postId: number;
  createdAt: string;
}

export interface Tag {
  id: number;
  name: string;
  description?: string;
  postCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: number;
  userId: number;
  type: string;
  content: string;
  relatedId?: number;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FileInfo {
  id: number;
  userId: number;
  originalName: string;
  fileName: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  fileType: string;
  status: number;
  createdAt: string;
}
