// 用户模块类型定义

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

export interface UserProfile {
  id: number;
  username: string;
  nickname: string;
  avatarUrl: string | null;
  bio: string | null;
  gender: number;
  birthday: string | null;
  city: string | null;
  createdAt: string;
}

export interface UserStats {
  petCount: number;
  postCount: number;
  favoriteCount: number;
  likeCount: number;
}

export const Gender = {
  UNKNOWN: 0,
  MALE: 1,
  FEMALE: 2,
};

export type Gender = typeof Gender[keyof typeof Gender];