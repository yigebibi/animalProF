import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSearchQuery } from '../../store/services/api';
import { debounce } from '../../utils/debounce';
import { Post, User } from '../../types/common';

type SearchType = 'all' | 'post' | 'user' | 'tag';

const SearchPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const [inputValue, setInputValue] = useState(initialQuery);
  const [searchType, setSearchType] = useState<SearchType>('all');
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);

  const { data, isLoading, isError } = useSearchQuery(
    { q: debouncedQuery, type: searchType === 'all' ? undefined : searchType },
    { skip: !debouncedQuery.trim() }
  );

  const debouncedSetQuery = useCallback(
    debounce((value: string) => {
      setDebouncedQuery(value);
    }, 300),
    []
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    debouncedSetQuery(value);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setDebouncedQuery(inputValue);
  };

  const handleClear = () => {
    setInputValue('');
    setQuery('');
    setDebouncedQuery('');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / 86400000);
    if (diffDays < 1) return '今天';
    if (diffDays < 7) return `${diffDays}天前`;
    return date.toLocaleDateString('zh-CN');
  };

  const SearchResultCard: React.FC<{ post: Post }> = ({ post }) => (
    <div
      className="bg-white rounded-lg shadow-sm p-4 cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => navigate(`/posts/${post.id}`)}
    >
      {post.coverUrl && (
        <img
          src={post.coverUrl}
          alt={post.title}
          className="w-full h-40 object-cover rounded-lg mb-3"
        />
      )}
      <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1 hover:text-purple-600">
        {post.title}
      </h3>
      <p className="text-gray-600 text-sm line-clamp-2 mb-2">{post.content}</p>
      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center gap-2">
          <img
            src={post.user?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.user?.username || post.userId}`}
            alt={post.user?.nickname}
            className="w-5 h-5 rounded-full"
          />
          <span>{post.user?.nickname || post.user?.username}</span>
        </div>
        <span>{formatDate(post.createdAt)}</span>
      </div>
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {post.tags.slice(0, 3).map((tag, i) => (
            <span key={i} className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full">
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );

  const UserCard: React.FC<{ user: User }> = ({ user }) => (
    <div
      className="bg-white rounded-lg shadow-sm p-4 cursor-pointer hover:shadow-md transition-shadow flex items-center gap-4"
      onClick={() => navigate(`/users/${user.id}`)}
    >
      <img
        src={user.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`}
        alt={user.nickname}
        className="w-16 h-16 rounded-full"
      />
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gray-900">
          {user.nickname || user.username}
        </h3>
        <p className="text-gray-500 text-sm">@{user.username}</p>
        {user.bio && (
          <p className="text-gray-600 text-sm mt-1 line-clamp-1">{user.bio}</p>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">搜索</h1>

          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="flex-1 relative">
              <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                placeholder="搜索帖子、用户、标签..."
                className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <svg
                className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {inputValue && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            <button
              type="submit"
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 font-medium"
            >
              搜索
            </button>
          </form>

          {/* Search Type Tabs */}
          <div className="flex gap-2 mt-4">
            {(['all', 'post', 'user', 'tag'] as SearchType[]).map((type) => (
              <button
                key={type}
                onClick={() => setSearchType(type)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  searchType === type
                    ? 'bg-purple-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                {type === 'all' ? '全部' : type === 'post' ? '帖子' : type === 'user' ? '用户' : '标签'}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        {isLoading && (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-purple-500 border-t-transparent"></div>
          </div>
        )}

        {isError && (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg text-center">
            搜索失败，请稍后重试
          </div>
        )}

        {!isLoading && !debouncedQuery.trim() && (
          <div className="text-center py-12 text-gray-500">
            <svg
              className="w-16 h-16 mx-auto mb-4 text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <p>输入关键词开始搜索</p>
          </div>
        )}

        {!isLoading && debouncedQuery.trim() && data && (
          <>
            {/* Posts Results */}
            {data.posts && data.posts.length > 0 && (searchType === 'all' || searchType === 'post') && (
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  帖子 ({data.posts.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {data.posts.slice(0, 6).map((post) => (
                    <SearchResultCard key={post.id} post={post} />
                  ))}
                </div>
                {data.posts.length > 6 && searchType === 'post' && (
                  <button
                    onClick={() => navigate(`/posts?search=${encodeURIComponent(debouncedQuery)}`)}
                    className="mt-4 text-purple-600 hover:text-purple-700 font-medium"
                  >
                    查看更多帖子 →
                  </button>
                )}
              </div>
            )}

            {/* Users Results */}
            {data.users && data.users.length > 0 && (searchType === 'all' || searchType === 'user') && (
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  用户 ({data.users.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {data.users.slice(0, 4).map((user) => (
                    <UserCard key={user.id} user={user} />
                  ))}
                </div>
              </div>
            )}

            {/* Tags Results */}
            {data.tags && data.tags.length > 0 && (searchType === 'all' || searchType === 'tag') && (
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  标签 ({data.tags.length})
                </h2>
                <div className="flex flex-wrap gap-2">
                  {data.tags.map((tag) => (
                    <button
                      key={tag.id}
                      onClick={() => navigate(`/posts?tag=${encodeURIComponent(tag.name)}`)}
                      className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full hover:bg-purple-200"
                    >
                      #{tag.name} ({tag.postCount})
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* No Results */}
            {(!data.posts || data.posts.length === 0) &&
             (!data.users || data.users.length === 0) &&
             (!data.tags || data.tags.length === 0) && (
              <div className="text-center py-12 text-gray-500">
                <svg
                  className="w-16 h-16 mx-auto mb-4 text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-lg">没有找到相关结果</p>
                <p className="text-sm mt-1">试试其他关键词</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
