import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useGetUserByIdQuery, useGetPostsQuery } from '../../../store/services/api';

const UserDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const userId = Number(id);
  const [page, setPage] = useState(1);
  const { data: user, isLoading, isError } = useGetUserByIdQuery(userId, {
    skip: !userId,
  });
  const { data: postsData, isLoading: postsLoading } = useGetPostsQuery({ page, limit: 5, userId }, {
    skip: !userId,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-purple-500 border-t-transparent"></div>
      </div>
    );
  }

  if (isError || !user) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white rounded-xl shadow-md p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-3">用户不存在</h1>
            <Link to="/search" className="text-purple-600 hover:text-purple-700 font-medium">返回搜索</Link>
          </div>
        </div>
      </div>
    );
  }

  const posts = postsData?.items || [];
  const totalPages = postsData ? Math.ceil(postsData.total / 5) : 0;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="bg-white rounded-xl shadow-md p-8">
          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
            <img
              src={user.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`}
              alt={user.nickname || user.username}
              className="w-28 h-28 rounded-full object-cover border-4 border-purple-100"
            />
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-900">{user.nickname || user.username}</h1>
              <p className="text-gray-500 mt-1">@{user.username}</p>
              {user.bio && <p className="text-gray-700 mt-4 leading-7">{user.bio}</p>}
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600">
                <div>性别: {user.gender === 1 ? '男' : user.gender === 2 ? '女' : '未知'}</div>
                <div>城市: {user.city || '未填写'}</div>
                <div>注册时间: {new Date(user.createdAt).toLocaleDateString('zh-CN')}</div>
                <div>生日: {user.birthday ? new Date(user.birthday).toLocaleDateString('zh-CN') : '未填写'}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">帖子</h2>
          {postsLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-4 border-purple-500 border-t-transparent"></div>
            </div>
          ) : posts.length === 0 ? (
            <p className="text-gray-500 text-center py-8">暂无帖子</p>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  to={`/posts/${post.id}`}
                  className="block rounded-lg border border-gray-100 p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 hover:text-purple-600 line-clamp-1">
                        {post.title}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">{post.content}</p>
                    </div>
                    {post.coverUrl && (
                      <img
                        src={post.coverUrl}
                        alt={post.title}
                        className="ml-4 w-16 h-16 rounded-lg object-cover flex-shrink-0"
                      />
                    )}
                  </div>
                  <div className="mt-2 flex items-center gap-3 text-xs text-gray-400">
                    <span>{new Date(post.createdAt).toLocaleDateString('zh-CN')}</span>
                    <span>❤️ {post.likeCount}</span>
                    <span>💬 {post.commentCount}</span>
                    <span>👁 {post.viewCount}</span>
                  </div>
                </Link>
              ))}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-4">
                  <button
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 text-sm"
                  >
                    上一页
                  </button>
                  <span className="px-4 py-2 text-sm">
                    {page} / {totalPages}
                  </span>
                  <button
                    onClick={() => setPage(page + 1)}
                    disabled={page === totalPages}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 text-sm"
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
  );
};

export default UserDetailPage;
