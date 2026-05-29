import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useGetPostsQuery,
  useDeletePostMutation,
} from '../../../store/services/api';
import SideMenu from '../components/SideMenu';
import { useAuth } from '../../../hooks/useAuth';

const MyPostsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [page, setPage] = useState(1);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);

  const { data, isLoading } = useGetPostsQuery({ page, limit: 10, userId: user?.id });
  const [deletePost, { isLoading: deleting }] = useDeletePostMutation();

  const myPosts = data?.items || [];

  const handleMenuClick = (item: string) => {
    switch (item) {
      case 'profile':
        navigate('/profile');
        break;
      case 'pets':
        navigate('/profile/pets');
        break;
      case 'posts':
        break;
      case 'favorites':
        navigate('/profile/favorites');
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

  const handleDelete = async (postId: number) => {
    try {
      await deletePost(postId).unwrap();
      setShowDeleteConfirm(null);
    } catch (err) {
      console.error('Failed to delete post:', err);
      alert('删除失败，请稍后重试');
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
    <div className="min-h-screen bg-transparent">
      <div className="flex h-screen">
        <SideMenu activeItem="posts" onItemClick={handleMenuClick} />

        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="border-b border-white/80 bg-white/70 p-5 shadow-[0_14px_35px_rgba(99,74,137,0.08)] backdrop-blur-xl">
            <div className="max-w-4xl mx-auto flex justify-between items-center">
              <div>
                <div className="text-xs font-bold uppercase tracking-[0.22em] text-[color:var(--ink-soft)]">My Notes</div>
                <h1 className="mt-2 text-3xl font-black text-[color:var(--ink-deep)]">我的帖子</h1>
              </div>
              <button
                onClick={() => navigate('/posts/create')}
                className="rounded-full bg-[color:var(--ink-deep)] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_18px_35px_rgba(78,56,120,0.20)]"
              >
                发布帖子
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="max-w-4xl mx-auto p-6">
              {isLoading ? (
                <div className="flex justify-center py-20">
                  <div className="animate-spin rounded-full h-8 w-8 border-4 border-purple-500 border-t-transparent"></div>
                </div>
              ) : myPosts.length === 0 ? (
                <div className="rounded-[28px] border border-white/80 bg-white/85 p-12 text-center shadow-[0_18px_40px_rgba(99,74,137,0.10)]">
                  <svg
                    className="w-16 h-16 mx-auto mb-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  <h2 className="mb-2 text-lg font-bold text-[color:var(--ink-deep)]">还没有发布帖子</h2>
                  <p className="mb-6 text-[color:var(--ink-soft)]">发布你的第一个帖子吧！</p>
                  <button
                    onClick={() => navigate('/posts/create')}
                    className="rounded-full bg-[color:var(--ink-deep)] px-6 py-2.5 text-sm font-semibold text-white shadow-[0_18px_35px_rgba(78,56,120,0.20)]"
                  >
                    发布帖子
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {myPosts.map((post) => (
                    <div key={post.id} className="flex gap-4 rounded-[28px] border border-white/80 bg-white/85 p-5 shadow-[0_18px_40px_rgba(99,74,137,0.10)]">
                      {post.coverUrl && (
                        <img
                          src={post.coverUrl}
                          alt={post.title}
                          className="w-24 h-24 rounded-lg object-cover flex-shrink-0 cursor-pointer"
                          onClick={() => navigate(`/posts/${post.id}`)}
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <div
                            className="cursor-pointer"
                            onClick={() => navigate(`/posts/${post.id}`)}
                          >
                            <h3 className="font-semibold text-gray-900 hover:text-purple-600 line-clamp-1">
                              {post.title}
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">
                              {formatDate(post.createdAt)}
                            </p>
                          </div>
                           <span className={`flex-shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                             post.status === 1 ? 'bg-green-100 text-green-700' :
                             post.status === 0 ? 'bg-yellow-100 text-yellow-700' :
                             'bg-red-100 text-red-700'
                           }`}>
                            {post.status === 1 ? '已发布' : post.status === 0 ? '草稿' : '已禁用'}
                          </span>
                        </div>
                        <p className="text-gray-600 mt-2 line-clamp-2">{post.content}</p>
                         <div className="mt-3 flex items-center gap-3 text-sm text-[color:var(--ink-soft)]">
                           <span className="flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                            {post.likeCount}
                          </span>
                           <span className="flex items-center gap-1 rounded-full bg-sky-50 px-2.5 py-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            {post.commentCount}
                          </span>
                           <span className="flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            {post.viewCount}
                          </span>
                        </div>
                         <div className="mt-4 flex gap-3">
                          <button
                            onClick={() => navigate(`/posts/${post.id}`)}
                             className="text-sm font-semibold text-rose-500 hover:text-rose-600"
                          >
                            查看
                          </button>
                          <button
                            onClick={() => navigate(`/posts/${post.id}/edit`)}
                             className="text-sm font-semibold text-[color:var(--ink-soft)] hover:text-[color:var(--ink-deep)]"
                          >
                            编辑
                          </button>
                          <button
                            onClick={() => setShowDeleteConfirm(post.id)}
                             className="text-sm font-semibold text-red-600 hover:text-red-700"
                          >
                            删除
                          </button>
                        </div>
                      </div>

                      {/* Delete Confirm */}
                      {showDeleteConfirm === post.id && (
                        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                          <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
                            <h3 className="font-semibold text-gray-900 mb-2">确认删除</h3>
                            <p className="text-gray-600 mb-4">确定要删除这篇帖子吗？此操作不可撤销。</p>
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => setShowDeleteConfirm(null)}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                              >
                                取消
                              </button>
                              <button
                                onClick={() => handleDelete(post.id)}
                                disabled={deleting}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                              >
                                {deleting ? '删除中...' : '删除'}
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Pagination */}
                  {data && Math.ceil(data.total / data.limit) > 1 && (
                    <div className="flex justify-center gap-2 mt-6">
                      <button
                        onClick={() => setPage(page - 1)}
                        disabled={page === 1}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                      >
                        上一页
                      </button>
                      <span className="px-4 py-2">
                        {page} / {Math.ceil(data.total / data.limit)}
                      </span>
                      <button
                        onClick={() => setPage(page + 1)}
                        disabled={page === Math.ceil(data.total / data.limit)}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                      >
                        下一页
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPostsPage;
