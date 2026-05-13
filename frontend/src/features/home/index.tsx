import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGetPostsQuery } from '../../store/services/api';
import { Post } from '../../types/common';
import { HomePostsSkeleton } from '../../components/Common/Skeleton';

const CATEGORIES = [
  { name: '🐶 狗狗', count: 1234, color: 'from-amber-500', category: 'dog' },
  { name: '🐱 猫咪', count: 987, color: 'from-purple-500', category: 'cat' },
  { name: '🐦 鸟类', count: 456, color: 'from-blue-500', category: 'bird' },
  { name: '🐠 水族', count: 321, color: 'from-teal-500', category: 'fish' },
];

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { data: latestData, isLoading: latestLoading } = useGetPostsQuery({ page: 1, limit: 6, sortBy: 'createdAt', sortOrder: 'desc' });
  const { data: hotData, isLoading: hotLoading } = useGetPostsQuery({ page: 1, limit: 3, sortBy: 'likeCount', sortOrder: 'desc' });

  const formatRelativeDate = (dateString: string) => {
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

  const PostCard: React.FC<{ post: Post }> = ({ post }) => (
    <div
      className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1"
      onClick={() => navigate(`/posts/${post.id}`)}
    >
      {post.coverUrl && (
        <div className="aspect-video overflow-hidden">
          <img
            src={post.coverUrl}
            alt={post.title}
            className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
          />
        </div>
      )}
      <div className="p-5">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-purple-600">
          {post.title}
        </h3>
        <p className="text-gray-600 mb-4 line-clamp-2">
          {post.content}
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
          {(post.tags || []).slice(0, 3).map((tag, tagIndex) => (
            <span
              key={tagIndex}
              className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="flex justify-between items-center text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <img
              src={post.user?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.user?.username || post.userId}`}
              alt={post.user?.nickname}
              className="w-6 h-6 rounded-full"
            />
            <span>{post.user?.nickname || post.user?.username || '用户'}</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {post.likeCount}
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              {post.commentCount}
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {post.viewCount}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">欢迎来到宠物论坛 🐾</h1>
            <p className="text-xl md:text-2xl mb-8 opacity-95">
              分享宠物的美好时光，交流养宠经验
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/posts/create"
                className="bg-white text-purple-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
              >
                发布帖子
              </Link>
              <Link
                to="/posts"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-medium hover:bg-white/10 transition-colors"
              >
                浏览帖子
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Categories */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">热门分类</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {CATEGORIES.map((category, index) => (
              <div
                key={index}
                className={`bg-gradient-to-br ${category.color} to-purple-600 rounded-xl p-6 text-white cursor-pointer hover:shadow-lg transition-all hover:scale-105`}
                onClick={() => navigate(`/posts?category=${category.category}`)}
              >
                <div className="text-2xl font-bold">{category.name}</div>
                <div className="text-white/80 mt-2">{category.count} 篇帖子</div>
              </div>
            ))}
          </div>
        </div>

        {/* Hot Posts */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">热门帖子</h2>
            <Link to="/posts?sortBy=likeCount" className="text-purple-600 hover:text-purple-700 font-medium">
              查看更多 →
            </Link>
          </div>
          {hotLoading ? (
            <HomePostsSkeleton count={3} />
          ) : hotData && hotData.items.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {hotData.items.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-500">
              暂无热门帖子
            </div>
          )}
        </div>

        {/* Latest Posts */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">最新帖子</h2>
            <Link to="/posts" className="text-purple-600 hover:text-purple-700 font-medium">
              查看更多 →
            </Link>
          </div>
          {latestLoading ? (
            <HomePostsSkeleton count={3} />
          ) : latestData && latestData.items.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {latestData.items.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-500">
              <p className="mb-4">还没有帖子，成为第一个分享的人吧！</p>
              <Link
                to="/posts/create"
                className="inline-block bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700"
              >
                发布帖子
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
