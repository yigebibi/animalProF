// API 类型定义
import { User, Pet, Post, Comment, Tag, Notification, PaginationParams, PaginationResponse } from './common';

// 通用 API 响应类型
export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
  timestamp: string;
}

// 通用分页数据类型
export interface PaginatedData<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Auth
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponseData {
  access_token: string;
  user: User;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface RegisterResponseData {
  access_token: string;
  user: User;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
  confirmPassword: string;
}

// User
export interface UpdateProfileRequest {
  nickname?: string;
  bio?: string;
  gender?: number;
  birthday?: string;
  city?: string;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

export interface NotificationSettings {
  pushNotifications: boolean;
  emailNotifications: boolean;
  commentNotifications: boolean;
  likeNotifications: boolean;
  followNotifications: boolean;
}

export interface PrivacySettings {
  publicProfile: boolean;
  allowComments: boolean;
  allowLikes: boolean;
  allowFollows: boolean;
}

export interface AccountSecuritySettings {
  emailVerified: boolean;
  phoneVerified: boolean;
  twoFactorEnabled: boolean;
}

export interface UserSettingsResponse {
  notificationSettings: NotificationSettings;
  privacySettings: PrivacySettings;
  accountSecurity: AccountSecuritySettings;
}

export interface UpdateUserSettingsRequest extends UserSettingsResponse {}

export interface UserStatsResponse {
  petCount: number;
  postCount: number;
  favoriteCount: number;
  likeCount: number;
}

export interface UserActivityResponse {
  id: string;
  type: 'post' | 'pet' | 'comment' | 'favorite' | 'like-post' | 'like-comment';
  title: string;
  content?: string;
  createdAt: string;
}

// Pet
export interface CreatePetRequest {
  name: string;
  type: string;
  breed?: string;
  gender?: number;
  birthday?: string;
  avatarUrl?: string;
  bio?: string;
}

export interface UpdatePetRequest extends Partial<CreatePetRequest> {
  id: number;
}

// Post
export interface GetPostsParams extends PaginationParams {
  category?: string;
  tag?: string;
  search?: string;
  sortBy?: 'createdAt' | 'likeCount' | 'viewCount' | 'commentCount';
  sortOrder?: 'asc' | 'desc';
}

export interface CreatePostRequest {
  title: string;
  content: string;
  petId?: number;
  tags?: string[];
  category?: string;
  coverUrl?: string;
}

export interface UpdatePostRequest extends Partial<CreatePostRequest> {
  id: number;
}

// Comment
export interface GetCommentsParams extends PaginationParams {
  postId: number;
  parentId?: number;
}

export interface CreateCommentRequest {
  postId: number;
  parentId?: number;
  content: string;
}

export interface UpdateCommentRequest {
  id: number;
  content: string;
}

// Search
export interface SearchRequest {
  q: string;
  type?: 'post' | 'user' | 'tag' | 'posts' | 'users' | 'tags' | 'all';
}

export interface SearchResponse {
  posts: Post[];
  users: User[];
  tags: Tag[];
}

// Notification
export interface MarkAsReadRequest {
  id: number;
}
