import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import SideMenu from '../components/SideMenu';
import UserProfileCard from '../components/UserProfileCard';
import { useAuth } from '../../../hooks/useAuth';
import { UserStats } from '../types/user.types';
import { useGetProfileActivitiesQuery, useGetProfileStatsQuery, useUploadAvatarMutation } from '../../../store/services/api';

const ProfilePage: React.FC = () => {
  const { user, logout, isLoading } = useAuth();
  const navigate = useNavigate();
  const [uploadAvatar] = useUploadAvatarMutation();
  const { data: statsData } = useGetProfileStatsQuery(undefined, {
    skip: !user,
  });
  const { data: activities = [] } = useGetProfileActivitiesQuery(undefined, {
    skip: !user,
  });

  const [stats, setStats] = useState<UserStats>({
    petCount: 0,
    postCount: 0,
    favoriteCount: 0,
    likeCount: 0,
  });

  useEffect(() => {
    if (statsData) {
      setStats(statsData);
    }
  }, [statsData]);

  const handleMenuClick = (item: string) => {
    switch (item) {
      case 'pets':
        navigate('/profile/pets');
        break;
      case 'posts':
        navigate('/profile/posts');
        break;
      case 'favorites':
        navigate('/profile/favorites');
        break;
      case 'settings':
        navigate('/profile/settings');
        break;
      case 'logout':
        handleLogout();
        break;
      default:
        // 已经在个人资料页面
        break;
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  const handleEditClick = () => {
    navigate('/profile/edit');
  };

  const handleChangePasswordClick = () => {
    navigate('/profile/change-password');
  };

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return '刚刚';
    if (diffMins < 60) return `${diffMins}分钟前`;
    if (diffHours < 24) return `${diffHours}小时前`;
    if (diffDays < 7) return `${diffDays}天前`;
    return date.toLocaleDateString('zh-CN');
  };

  const handleAvatarUpload = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      await uploadAvatar(formData).unwrap();
    } catch (err) {
      console.error('Failed to upload avatar:', err);
      alert('头像上传失败，请稍后重试');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-purple-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  return (
    <div className="min-h-screen bg-transparent">
      <div className="flex h-screen">
        {/* 侧边栏菜单 */}
        <SideMenu
          activeItem="profile"
          onItemClick={handleMenuClick}
        />

        {/* 主内容区域 */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* 页面标题 */}
          <div className="border-b border-white/80 bg-white/70 p-5 shadow-[0_14px_35px_rgba(99,74,137,0.08)] backdrop-blur-xl">
            <div className="max-w-4xl mx-auto">
              <div className="text-xs font-bold uppercase tracking-[0.22em] text-[color:var(--ink-soft)]">My Space</div>
              <h1 className="mt-2 text-3xl font-black text-[color:var(--ink-deep)]">个人中心</h1>
            </div>
          </div>

          {/* 内容区域 */}
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-4xl mx-auto p-6">
              {/* 用户资料卡片 */}
              <UserProfileCard
                user={{
                  id: user.id,
                  username: user.username,
                  nickname: user.nickname || user.username,
                  avatarUrl: user.avatarUrl || null,
                  bio: user.bio || null,
                  gender: user.gender,
                  birthday: user.birthday || null,
                  city: user.city || null,
                  createdAt: user.createdAt,
                }}
                stats={stats}
                onEditClick={handleEditClick}
                onChangePasswordClick={handleChangePasswordClick}
                onAvatarUpload={handleAvatarUpload}
              />

              {/* 最近活动 */}
               <div className="mb-6 rounded-[28px] border border-white/80 bg-white/80 p-6 shadow-[0_18px_40px_rgba(99,74,137,0.10)]">
                 <h2 className="mb-4 text-2xl font-black text-[color:var(--ink-deep)]">最近活动</h2>
                 <div className="space-y-4">
                  {activities.length === 0 ? (
                    <div className="text-sm text-gray-500">还没有最近活动</div>
                  ) : (
                    activities.map((activity) => (
                       <div key={activity.id} className="flex items-center rounded-[22px] border border-[color:var(--line-soft)] bg-white/70 p-4 hover:bg-white">
                        <div className="flex-shrink-0">
                          {activity.type === 'post' ? (
                            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          ) : activity.type === 'pet' ? (
                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                            </svg>
                          ) : activity.type === 'comment' ? (
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                          ) : activity.type === 'favorite' ? (
                            <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                            </svg>
                          ) : (
                            <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                          )}
                        </div>
                         <div className="ml-3">
                           <p className="text-sm text-[color:var(--ink-deep)]">
                            <span className="font-medium">您</span>
                            {activity.type === 'post'
                              ? ` 发布了新帖子《${activity.title}》`
                              : activity.type === 'pet'
                              ? ` 添加了宠物「${activity.title}」`
                              : activity.type === 'comment'
                              ? ` 评论了帖子《${activity.title}》`
                              : activity.type === 'favorite'
                              ? ` 收藏了帖子《${activity.title}》`
                              : activity.type === 'like-post'
                              ? ` 点赞了帖子《${activity.title}》`
                              : ` 点赞了帖子《${activity.title}》中的评论`}
                          </p>
                          {(activity.type === 'comment' || activity.type === 'like-comment') && activity.content && (
                            <p className="line-clamp-1 text-sm text-[color:var(--ink-soft)]">{activity.content}</p>
                          )}
                          <p className="text-sm text-[color:var(--ink-soft)]">{formatRelativeTime(activity.createdAt)}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* 快速操作 */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="rounded-[26px] border border-white/80 bg-white/80 p-6 shadow-[0_18px_40px_rgba(99,74,137,0.10)]">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-purple-100 p-3 rounded-full">
                      <svg
                        className="w-6 h-6 text-purple-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">设置</h3>
                      <p className="text-sm text-gray-500">管理账户设置和隐私</p>
                    </div>
                  </div>
                  <button onClick={() => navigate('/profile/settings')} className="mt-4 text-sm font-semibold text-rose-500 hover:text-rose-600">
                    前往设置 →
                  </button>
                </div>

                <div className="rounded-[26px] border border-white/80 bg-white/80 p-6 shadow-[0_18px_40px_rgba(99,74,137,0.10)]">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-green-100 p-3 rounded-full">
                      <svg
                        className="w-6 h-6 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                        />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">宠物管理</h3>
                      <p className="text-sm text-gray-500">添加、编辑和删除宠物信息</p>
                    </div>
                  </div>
                  <button onClick={() => navigate('/profile/pets')} className="mt-4 text-sm font-semibold text-rose-500 hover:text-rose-600">
                    管理宠物 →
                  </button>
                </div>

                <div className="rounded-[26px] border border-white/80 bg-white/80 p-6 shadow-[0_18px_40px_rgba(99,74,137,0.10)]">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-blue-100 p-3 rounded-full">
                      <svg
                        className="w-6 h-6 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">我的帖子</h3>
                      <p className="text-sm text-gray-500">查看和管理我的发帖记录</p>
                    </div>
                  </div>
                  <button onClick={() => navigate('/profile/posts')} className="mt-4 text-sm font-semibold text-rose-500 hover:text-rose-600">
                    查看帖子 →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
