import React from 'react';
import UserAvatar from './UserAvatar';
import { UserProfile, UserStats } from '../types/user.types';

interface UserProfileCardProps {
  user: UserProfile;
  stats?: UserStats;
  onEditClick?: () => void;
  onChangePasswordClick?: () => void;
  onAvatarUpload?: (file: File) => void;
}

const UserProfileCard: React.FC<UserProfileCardProps> = ({
  user,
  stats,
  onEditClick,
  onChangePasswordClick,
  onAvatarUpload,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getGenderText = (gender: number) => {
    switch (gender) {
      case 1:
        return '男';
      case 2:
        return '女';
      default:
        return '未知';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* 头像部分 */}
        <div className="flex-shrink-0">
          <UserAvatar
            avatarUrl={user.avatarUrl}
            size="xl"
            username={user.username}
            userId={user.id}
            editable={!!onAvatarUpload}
            onUpload={onAvatarUpload}
            className="mx-auto md:mx-0"
          />
        </div>

        {/* 用户信息 */}
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {user.nickname || user.username}
          </h1>
          <p className="text-gray-600 mb-4">{user.username}</p>

          {user.bio && (
            <p className="text-gray-700 mb-4">{user.bio}</p>
          )}

          {/* 详细信息 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {user.gender !== undefined && (
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 text-gray-500 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
                <span className="text-gray-700">性别: {getGenderText(user.gender)}</span>
              </div>
            )}

            {user.birthday && (
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 text-gray-500 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span className="text-gray-700">生日: {formatDate(user.birthday)}</span>
              </div>
            )}

            {user.city && (
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 text-gray-500 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span className="text-gray-700">城市: {user.city}</span>
              </div>
            )}

            <div className="flex items-center">
              <svg
                className="w-5 h-5 text-gray-500 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-gray-700">注册时间: {formatDate(user.createdAt)}</span>
            </div>
          </div>

          {/* 统计信息 */}
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <div className="text-lg font-semibold text-gray-900">
                  {stats.petCount}
                </div>
                <div className="text-sm text-gray-600">宠物</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <div className="text-lg font-semibold text-gray-900">
                  {stats.postCount}
                </div>
                <div className="text-sm text-gray-600">帖子</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <div className="text-lg font-semibold text-gray-900">
                  {stats.favoriteCount}
                </div>
                <div className="text-sm text-gray-600">收藏</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <div className="text-lg font-semibold text-gray-900">
                  {stats.likeCount}
                </div>
                <div className="text-sm text-gray-600">获赞</div>
              </div>
            </div>
          )}

          {/* 操作按钮 */}
          <div className="flex flex-wrap gap-3">
            {onEditClick && (
              <button
                onClick={onEditClick}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 font-medium transition-colors"
              >
                编辑资料
              </button>
            )}
            {onChangePasswordClick && (
              <button
                onClick={onChangePasswordClick}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 font-medium transition-colors"
              >
                修改密码
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileCard;