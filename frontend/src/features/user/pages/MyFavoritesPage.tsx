import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useGetFavoritesQuery,
  useUnfavoritePostMutation,
} from '../../../store/services/api';
import { Post } from '../../../types/common';
import SideMenu from '../components/SideMenu';
import { useAuth } from '../../../hooks/useAuth';

const MyFavoritesPage: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [page, setPage] = useState(1);
  const [showUnfavoriteConfirm, setShowUnfavoriteConfirm] = useState<number | null>(null);

  const { data, isLoading } = useGetFavoritesQuery();
  const [unfavorite, { isLoading: unfavoriting }] = useUnfavoritePostMutation();

  const favorites = data?.items || [];

  const handleMenuClick = (item: string) => {
    switch (item) {
      case 'profile':
        navigate('/profile');
        break;
      case 'pets':
        navigate('/profile/pets');
        break;
      case 'posts':
        navigate('/profile/posts');
        break;
      case 'favorites':
        break;
      case 'settings':
        navigate('/profile/settings');
        break;
      case 'logout':
        logout();
        navigate('/auth/login');
        break;
      default:
        break;
    }
  };

  const handleUnfavorite = async (postId: number) => {
    try {
      await unfavorite(postId).unwrap();
      setShowUnfavoriteConfirm(null);
    } catch (err) {
      console.error('Failed to unfavorite:', err);
      alert('取消收藏失败，请稍后重试');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen">
        <SideMenu activeItem="favorites" onItemClick={handleMenuClick} />

        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="bg-white shadow-sm border-b border-gray-200 p-4">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-xl font-semibold text-gray-900">我的收藏</h1>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="max-w-4xl mx-auto p-6">
              {isLoading ? (
                <div className="flex justify-center py-20">
                  <div className="animate-spin rounded-full h-8 w-8 border-4 border-purple-500 border-t-transparent"></div>
                </div>
              ) : favorites.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-12 text-center">
                  <svg
                    className="w-16 h-16 mx-auto mb-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">还没有收藏</h2>
                  <p className="text-gray-500 mb-6">收藏喜欢的帖子，方便以后查看</p>
                  <button
                    onClick={() => navigate('/posts')}
                    className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 font-medium"
                  >
                    浏览帖子
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {favorites.map((post) => (
                    <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                      {post.coverUrl && (
                        <div
                          className="aspect-video overflow-hidden cursor-pointer"
                          onClick={() => navigate(`/posts/${post.id}`)}
                        >
                          <img
                            src={post.coverUrl}
                            alt={post.title}
                            className="w-full h-full object-cover hover:scale-105 transition-transform"
                          />
                        </div>
                      )}
                      <div className="p-4">
                        <h3
                          className="font-semibold text-gray-900 mb-1 line-clamp-1 cursor-pointer hover:text-purple-600"
                          onClick={() => navigate(`/posts/${post.id}`)}
                        >
                          {post.title}
                        </h3>
                        <p className="text-sm text-gray-500 mb-2">
                          {formatDate(post.createdAt)}
                        </p>
                        <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                          {post.content}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <img
                              src={post.user?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.user?.username || post.userId}`}
                              alt={post.user?.nickname}
                              className="w-6 h-6 rounded-full"
                            />
                            <span className="text-sm text-gray-600">
                              {post.user?.nickname || post.user?.username}
                            </span>
                          </div>
                          <button
                            onClick={() => setShowUnfavoriteConfirm(post.id)}
                            className="text-sm text-yellow-600 hover:text-yellow-700 flex items-center gap-1"
                          >
                            <svg className="w-4 h-4" fill="currentColor" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                            </svg>
                            取消收藏
                          </button>
                        </div>
                      </div>

                      {/* Unfavorite Confirm */}
                      {showUnfavoriteConfirm === post.id && (
                        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                          <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
                            <h3 className="font-semibold text-gray-900 mb-2">取消收藏</h3>
                            <p className="text-gray-600 mb-4">确定要取消收藏这篇帖子吗？</p>
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => setShowUnfavoriteConfirm(null)}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                              >
                                取消
                              </button>
                              <button
                                onClick={() => handleUnfavorite(post.id)}
                                disabled={unfavoriting}
                                className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:opacity-50"
                              >
                                {unfavoriting ? '处理中...' : '确定'}
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyFavoritesPage;
