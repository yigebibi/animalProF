// 用户模块类型定义

// 更新个人资料请求类型
export interface UpdateProfileRequest {
  nickname?: string;
  bio?: string;
  gender?: number;
  birthday?: string;
  city?: string;
}

// 修改密码请求类型
export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

// 用户设置类型
export interface UserSettings {
  notificationEnabled: boolean;
  emailNotificationEnabled: boolean;
  publicProfile: boolean;
}

// 用户个人资料类型
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

// 用户统计信息类型
export interface UserStats {
  petCount: number;
  postCount: number;
  favoriteCount: number;
  likeCount: number;
}

// 性别常量
export const Gender = {
  UNKNOWN: 0,
  MALE: 1,
  FEMALE: 2,
};

// 性别类型
export type Gender = typeof Gender[keyof typeof Gender];

// 通知设置类型
export interface NotificationSettings {
  pushNotifications: boolean;
  emailNotifications: boolean;
  commentNotifications: boolean;
  likeNotifications: boolean;
  followNotifications: boolean;
}

// 隐私设置类型
export interface PrivacySettings {
  publicProfile: boolean;
  allowComments: boolean;
  allowLikes: boolean;
  allowFollows: boolean;
}

// 账户安全设置类型
export interface AccountSecuritySettings {
  emailVerified: boolean;
  phoneVerified: boolean;
  twoFactorEnabled: boolean;
}