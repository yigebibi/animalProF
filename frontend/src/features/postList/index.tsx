import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useGetPostsQuery } from '../../store/services/api';
import { Post } from '../../types/common';
import { debounce } from '../../utils/debounce';
import { PostListSkeleton } from '../../components/Common/Skeleton';

const CATEGORIES = [
  { value: '', label: '全部分类' },
  { value: 'general', label: '综合' },
  { value: 'share', label: '分享' },
  { value: 'help', label: '求助' },
  { value: 'discussion', label: '讨论' },
];

const SORT_OPTIONS = [
  { value: 'createdAt-desc', label: '最新发布' },
  { value: 'likeCount-desc', label: '最多点赞' },
  { value: 'viewCount-desc', label: '最多浏览' },
  { value: 'commentCount-desc', label: '最多评论' },
];

const PostListPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const pageParam = Number(searchParams.get('page') || '1');
  const categoryParam = searchParams.get('category') || '';
  const tagParam = searchParams.get('tag') || '';
  const searchParam = searchParams.get('search') || '';
  const sortByParam = searchParams.get('sortBy') || 'createdAt';
  const sortOrderParam = searchParams.get('sortOrder') || 'desc';

  const [page, setPage] = useState(Number.isNaN(pageParam) || pageParam < 1 ? 1 : pageParam);
  const [limit] = useState(12);
  const [category, setCategory] = useState(categoryParam);
  const [tag, setTag] = useState(tagParam);
  const [search, setSearch] = useState(searchParam);
  const [sortBy, setSortBy] = useState(sortByParam);
  const [sortOrder, setSortOrder] = useState(sortOrderParam);

  const { data, isLoading, isError, error } = useGetPostsQuery({
    page,
    limit,
    category: category || undefined,
    tag: tag || undefined,
    search: search || undefined,
    sortBy: sortBy as any,
    sortOrder: sortOrder as any,
  });

  const [searchInput, setSearchInput] = useState(searchParam);

  const debouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        setSearch(value);
        setPage(1);
      }, 500),
    []
  );

  useEffect(() => {
    const nextPage = Number.isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;

    if (page !== nextPage) {
      setPage(nextPage);
    }
    if (category !== categoryParam) {
      setCategory(categoryParam);
    }
    if (tag !== tagParam) {
      setTag(tagParam);
    }
    if (search !== searchParam) {
      setSearch(searchParam);
    }
    if (searchInput !== searchParam) {
      setSearchInput(searchParam);
    }
    if (sortBy !== sortByParam) {
      setSortBy(sortByParam);
    }
    if (sortOrder !== sortOrderParam) {
      setSortOrder(sortOrderParam);
    }
  }, [category, categoryParam, page, pageParam, search, searchInput, searchParam, sortBy, sortByParam, sortOrder, sortOrderParam, tag, tagParam]);

  useEffect(() => {
    const nextParams = new URLSearchParams();

    if (page > 1) {
      nextParams.set('page', String(page));
    }
    if (category) {
      nextParams.set('category', category);
    }
    if (tag) {
      nextParams.set('tag', tag);
    }
    if (search) {
      nextParams.set('search', search);
    }
    if (sortBy !== 'createdAt') {
      nextParams.set('sortBy', sortBy);
    }
    if (sortOrder !== 'desc') {
      nextParams.set('sortOrder', sortOrder);
    }

    setSearchParams(nextParams, { replace: true });
  }, [category, page, search, setSearchParams, sortBy, sortOrder, tag]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
    debouncedSearch(e.target.value);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategory(e.target.value);
    setTag('');
    setPage(1);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [by, order] = e.target.value.split('-');
    setSortBy(by);
    setSortOrder(order);
    setPage(1);
  };

  const handleClearTag = () => {
    setTag('');
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formatDate = (dateString: string) => {
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

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 text-red-700 p-4 rounded-lg text-center">
            加载帖子失败，请稍后重试
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-6 rounded-[30px] border border-white/80 bg-white/80 p-6 shadow-[0_18px_40px_rgba(99,74,137,0.10)]">
            <div className="text-xs font-bold uppercase tracking-[0.22em] text-[color:var(--ink-soft)]">Explore</div>
            <h1 className="mt-2 text-4xl font-black text-[color:var(--ink-deep)]">帖子列表</h1>
            <p className="mt-3 max-w-2xl text-[color:var(--ink-soft)]">按分类、标签、关键词或热度寻找你今天最想看的内容，把每次浏览都变成一次轻松逛社区的体验。</p>
          </div>

          {/* Filters */}
          <div className="rounded-[28px] border border-white/80 bg-white/80 p-5 shadow-[0_18px_40px_rgba(99,74,137,0.10)]">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="搜索帖子..."
                  value={searchInput}
                  onChange={handleSearchChange}
                  className="w-full rounded-2xl border border-[color:var(--line-soft)] bg-white px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-purple-300"
                />
              </div>

              {/* Category */}
              <select
                value={category}
                onChange={handleCategoryChange}
                className="rounded-2xl border border-[color:var(--line-soft)] bg-white px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-purple-300"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>

              {/* Sort */}
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={handleSortChange}
                className="rounded-2xl border border-[color:var(--line-soft)] bg-white px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-purple-300"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>

              {/* Create button */}
              <Link
                to="/posts/create"
                className="whitespace-nowrap rounded-full bg-[color:var(--ink-deep)] px-6 py-3 text-sm font-semibold text-white shadow-[0_16px_30px_rgba(78,56,120,0.20)] transition-transform hover:-translate-y-0.5"
              >
                发布帖子
              </Link>
            </div>
            {tag && (
              <div className="mt-4 flex items-center gap-2 text-sm">
                <span className="text-[color:var(--ink-soft)]">当前标签：</span>
                <span className="inline-flex items-center rounded-full bg-rose-50 px-3 py-1 text-rose-600">
                  #{tag}
                  <button
                    type="button"
                    onClick={handleClearTag}
                    className="ml-2 text-purple-500 hover:text-purple-700"
                  >
                    ×
                  </button>
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Loading Skeleton */}
        {isLoading && (
          <PostListSkeleton count={12} />
        )}

        {/* Posts Grid */}
        {!isLoading && data && (
          <>
            {data.items.length === 0 ? (
               <div className="rounded-[28px] border border-white/80 bg-white/80 p-12 text-center shadow-[0_18px_40px_rgba(99,74,137,0.10)]">
                <svg
                  className="w-16 h-16 mx-auto mb-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
                   <h2 className="mb-2 text-xl font-bold text-[color:var(--ink-deep)]">暂无帖子</h2>
                 <p className="mb-6 text-[color:var(--ink-soft)]">还没有人发布帖子，成为第一个分享的人吧！</p>
                 <Link
                   to="/posts/create"
                   className="rounded-full bg-[color:var(--ink-deep)] px-6 py-2.5 text-sm font-semibold text-white shadow-[0_18px_35px_rgba(78,56,120,0.20)]"
                 >
                   发布帖子
                 </Link>
               </div>
             ) : (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {data.items.map((post: Post) => (
                   <div
                     key={post.id}
                     className="group cursor-pointer overflow-hidden rounded-[28px] border border-white/80 bg-white/85 shadow-[0_18px_40px_rgba(98,74,132,0.10)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_55px_rgba(98,74,132,0.16)]"
                     onClick={() => navigate(`/posts/${post.id}`)}
                   >
                     {post.coverUrl && (
                       <div className="aspect-video overflow-hidden bg-gradient-to-br from-amber-100 via-rose-50 to-sky-100">
                         <img
                           src={post.coverUrl}
                           alt={post.title}
                           className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                         />
                       </div>
                     )}
                     <div className="p-6">
                       <div className="mb-3 flex items-center justify-between text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--ink-soft)]">
                         <span>{formatDate(post.createdAt)}</span>
                         <span className="rounded-full bg-amber-50 px-3 py-1 text-[color:var(--ink-deep)]">{post.category}</span>
                       </div>
                       <h3 className="mb-2 line-clamp-2 text-xl font-bold text-[color:var(--ink-deep)] transition-colors group-hover:text-rose-500">
                         {post.title}
                       </h3>
                       <p className="mb-5 line-clamp-2 text-[color:var(--ink-soft)]">
                         {post.content}
                       </p>
                       <div className="mb-5 flex flex-wrap gap-2">
                         {(post.tags || []).slice(0, 3).map((tag, tagIndex) => (
                           <span
                             key={tagIndex}
                             className="rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-600"
                           >
                             #{tag}
                           </span>
                         ))}
                       </div>
                       <div className="flex items-center justify-between text-sm text-[color:var(--ink-soft)]">
                         <div className="flex items-center gap-2">
                           <img
                             src={post.user?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.user?.username || post.userId}`}
                             alt={post.user?.nickname}
                             className="h-8 w-8 rounded-full border border-amber-100 object-cover"
                           />
                           <span className="font-medium text-[color:var(--ink-deep)]">{post.user?.nickname || post.user?.username || '用户'}</span>
                         </div>
                         <div className="flex items-center gap-3">
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
                      </div>
                     </div>
                   </div>
                 ))}
               </div>
            )}

            {/* Pagination */}
            {data && Math.ceil(data.total / data.limit) > 1 && (
              <div className="mt-8 flex justify-center gap-2">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  上一页
                </button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, Math.ceil(data.total / data.limit)) }, (_, i) => {
                    const totalPages = Math.ceil(data.total / data.limit);
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (page <= 3) {
                      pageNum = i + 1;
                    } else if (page >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = page - 2 + i;
                    }
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`w-10 h-10 rounded-lg ${
                          page === pageNum
                            ? 'bg-purple-600 text-white'
                            : 'border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === Math.ceil(data.total / data.limit)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  下一页
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PostListPage;
