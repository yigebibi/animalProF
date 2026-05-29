import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGetPostsQuery } from '../../store/services/api';
import { Post } from '../../types/common';
import { HomePostsSkeleton } from '../../components/Common/Skeleton';

const CATEGORIES = [
  { name: '暖绒日常', icon: '🧶', note: '轻松晒宠', color: 'from-amber-300 via-orange-300 to-rose-300', category: 'general' },
  { name: '漂亮分享', icon: '📸', note: '高光瞬间', color: 'from-rose-300 via-pink-300 to-fuchsia-300', category: 'share' },
  { name: '在线求助', icon: '🩺', note: '一起出主意', color: 'from-sky-300 via-cyan-300 to-blue-300', category: 'help' },
  { name: '热闹讨论', icon: '💬', note: '经验交流', color: 'from-emerald-300 via-teal-300 to-cyan-300', category: 'discussion' },
];

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { data: latestData, isLoading: latestLoading } = useGetPostsQuery({ page: 1, limit: 6, sortBy: 'createdAt', sortOrder: 'desc' });
  const { data: hotData, isLoading: hotLoading } = useGetPostsQuery({ page: 1, limit: 3, sortBy: 'likeCount', sortOrder: 'desc' });
  const { data: generalData } = useGetPostsQuery({ page: 1, limit: 1, category: 'general' });
  const { data: shareData } = useGetPostsQuery({ page: 1, limit: 1, category: 'share' });
  const { data: helpData } = useGetPostsQuery({ page: 1, limit: 1, category: 'help' });
  const { data: discussionData } = useGetPostsQuery({ page: 1, limit: 1, category: 'discussion' });

  const categoryCounts: Record<string, number> = {
    general: generalData?.total || 0,
    share: shareData?.total || 0,
    help: helpData?.total || 0,
    discussion: discussionData?.total || 0,
  };

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
      className="group cursor-pointer overflow-hidden rounded-[28px] border border-white/80 bg-white/85 shadow-[0_18px_40px_rgba(98,74,132,0.10)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_55px_rgba(98,74,132,0.16)]"
      onClick={() => navigate(`/posts/${post.id}`)}
    >
      {post.coverUrl && (
        <div className="aspect-video overflow-hidden bg-gradient-to-br from-amber-100 via-rose-50 to-sky-100">
          <img src={post.coverUrl} alt={post.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        </div>
      )}
      <div className="p-6">
        <div className="mb-3 flex items-center justify-between text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--ink-soft)]">
          <span>{formatRelativeDate(post.createdAt)}</span>
          <span className="rounded-full bg-amber-50 px-3 py-1 text-[color:var(--ink-deep)]">{post.category}</span>
        </div>
        <h3 className="mb-2 line-clamp-2 text-xl font-bold text-[color:var(--ink-deep)] transition-colors group-hover:text-rose-500">{post.title}</h3>
        <p className="mb-5 line-clamp-2 text-[color:var(--ink-soft)]">{post.content}</p>
        <div className="mb-5 flex flex-wrap gap-2">
          {(post.tags || []).slice(0, 3).map((tag, tagIndex) => (
            <span key={tagIndex} className="rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-600">#{tag}</span>
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
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
              {post.likeCount}
            </span>
            <span className="flex items-center gap-1 rounded-full bg-sky-50 px-2.5 py-1">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
              {post.commentCount}
            </span>
            <span className="flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
              {post.viewCount}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen overflow-hidden bg-transparent">
      <div className="relative px-4 pb-6 pt-8 sm:px-6 lg:px-8">
        <div className="absolute left-0 top-0 h-48 w-48 rounded-full bg-[rgba(255,188,152,0.45)] blur-3xl"></div>
        <div className="absolute right-0 top-16 h-56 w-56 rounded-full bg-[rgba(171,221,255,0.42)] blur-3xl"></div>
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[40px] border border-white/70 bg-[linear-gradient(135deg,rgba(255,232,219,0.92),rgba(255,255,255,0.82),rgba(221,244,255,0.9))] px-6 py-10 shadow-[0_28px_70px_rgba(99,74,137,0.14)] sm:px-10 lg:px-14 lg:py-14">
          <div className="grid gap-10 lg:grid-cols-[1.25fr_0.75fr] lg:items-center">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/70 px-4 py-2 text-sm font-semibold text-[color:var(--ink-soft)] shadow-[0_12px_25px_rgba(99,74,137,0.08)]">
                <span className="text-lg">🐶</span>
                让毛孩子的日常变成值得收藏的故事
              </div>
              <h1 className="max-w-3xl text-4xl font-black leading-tight text-[color:var(--ink-deep)] md:text-5xl lg:text-6xl">
                软乎乎、亮晶晶，
                <span className="block text-rose-500">把宠物社区做得更可爱一点。</span>
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-[color:var(--ink-soft)] md:text-xl">
                在这里分享治愈瞬间、求助养宠难题、记录每一只小爪印。页面更轻盈，内容更温柔，互动也更顺手。
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link to="/posts/create" className="rounded-full bg-[color:var(--ink-deep)] px-8 py-3 text-sm font-semibold text-white shadow-[0_18px_35px_rgba(78,56,120,0.25)] transition-transform hover:-translate-y-0.5">发布毛孩子日记</Link>
                <Link to="/posts" className="rounded-full border border-[color:var(--line-soft)] bg-white/80 px-8 py-3 text-sm font-semibold text-[color:var(--ink-deep)] transition-transform hover:-translate-y-0.5">去逛最新帖子</Link>
              </div>
              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <div className="rounded-[24px] border border-white/80 bg-white/75 p-4 shadow-[0_10px_25px_rgba(99,74,137,0.08)]">
                  <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--ink-soft)]">最新动态</div>
                  <div className="mt-2 text-2xl font-black text-[color:var(--ink-deep)]">{latestData?.total || 0}+</div>
                  <div className="mt-1 text-sm text-[color:var(--ink-soft)]">社区正在持续更新</div>
                </div>
                <div className="rounded-[24px] border border-white/80 bg-white/75 p-4 shadow-[0_10px_25px_rgba(99,74,137,0.08)]">
                  <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--ink-soft)]">活跃主题</div>
                  <div className="mt-2 text-2xl font-black text-[color:var(--ink-deep)]">4</div>
                  <div className="mt-1 text-sm text-[color:var(--ink-soft)]">分享、求助、讨论、日常</div>
                </div>
                <div className="rounded-[24px] border border-white/80 bg-white/75 p-4 shadow-[0_10px_25px_rgba(99,74,137,0.08)]">
                  <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--ink-soft)]">今日氛围</div>
                  <div className="mt-2 text-2xl font-black text-[color:var(--ink-deep)]">治愈中</div>
                  <div className="mt-1 text-sm text-[color:var(--ink-soft)]">欢迎来晒图、吸猫、求支招</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="relative rounded-[32px] border border-white/80 bg-white/85 p-5 shadow-[0_25px_60px_rgba(99,74,137,0.14)]">
                <div className="flex items-center justify-between rounded-[24px] bg-[linear-gradient(135deg,#fff2e5,#fff9f4)] p-4">
                  <div>
                    <div className="text-sm font-semibold text-[color:var(--ink-soft)]">今日热门</div>
                    <div className="mt-1 text-xl font-black text-[color:var(--ink-deep)]">{hotData?.items[0]?.title || '等你来发布第一篇高光内容'}</div>
                  </div>
                  <div className="text-4xl">🐕</div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  {CATEGORIES.map((category) => (
                    <button key={category.category} onClick={() => navigate(`/posts?category=${category.category}`)} className={`rounded-[24px] bg-gradient-to-br ${category.color} p-4 text-left text-white shadow-[0_14px_30px_rgba(99,74,137,0.12)] transition-transform hover:-translate-y-1`}>
                      <div className="text-2xl">{category.icon}</div>
                      <div className="mt-3 text-lg font-bold">{category.name}</div>
                      <div className="text-sm text-white/85">{category.note}</div>
                      <div className="mt-3 text-xs font-semibold uppercase tracking-[0.18em] text-white/85">{categoryCounts[category.category]} 篇帖子</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-12 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[32px] border border-white/80 bg-white/80 p-7 shadow-[0_18px_45px_rgba(99,74,137,0.10)]">
            <div className="mb-4 inline-flex rounded-full bg-amber-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-amber-700">社区向导</div>
            <h2 className="text-3xl font-black text-[color:var(--ink-deep)]">不只是发帖，更像一座宠物生活记录馆。</h2>
            <p className="mt-4 max-w-2xl leading-7 text-[color:var(--ink-soft)]">你可以把日常晒图、成长记录、求助问题和经验笔记都整理在这里。每一条内容都更像一张卡片、一篇小日记，而不是冷冰冰的数据流。</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[28px] border border-white/80 bg-[rgba(255,241,230,0.9)] p-5 shadow-[0_16px_35px_rgba(99,74,137,0.08)]">
              <div className="text-3xl">🎀</div>
              <h3 className="mt-3 text-lg font-bold text-[color:var(--ink-deep)]">晒图更有氛围</h3>
              <p className="mt-2 text-sm leading-6 text-[color:var(--ink-soft)]">封面、标签、头像和卡片层次更柔和，适合记录毛孩子的小高光。</p>
            </div>
            <div className="rounded-[28px] border border-white/80 bg-[rgba(228,246,255,0.9)] p-5 shadow-[0_16px_35px_rgba(99,74,137,0.08)]">
              <div className="text-3xl">🫶</div>
              <h3 className="mt-3 text-lg font-bold text-[color:var(--ink-deep)]">求助更直观</h3>
              <p className="mt-2 text-sm leading-6 text-[color:var(--ink-soft)]">分类、搜索、标签和排序都能直接在链接里保留，分享求助链接更方便。</p>
            </div>
          </div>
        </div>

        <div className="mb-12">
          <div className="mb-6">
            <div className="text-xs font-bold uppercase tracking-[0.24em] text-[color:var(--ink-soft)]">四种氛围</div>
            <h2 className="mt-2 text-3xl font-black text-[color:var(--ink-deep)]">挑一个适合今天心情的版块</h2>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
            {CATEGORIES.map((category, index) => (
              <div key={index} className={`cursor-pointer rounded-[30px] bg-gradient-to-br ${category.color} p-6 text-white shadow-[0_20px_40px_rgba(99,74,137,0.12)] transition-all hover:-translate-y-1.5`} onClick={() => navigate(`/posts?category=${category.category}`)}>
                <div className="text-4xl">{category.icon}</div>
                <div className="mt-5 text-2xl font-black">{category.name}</div>
                <div className="mt-2 text-white/85">{category.note}</div>
                <div className="mt-6 inline-flex rounded-full bg-white/20 px-3 py-1 text-sm font-semibold">{categoryCounts[category.category]} 篇帖子</div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-12">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.22em] text-[color:var(--ink-soft)]">最受欢迎</div>
              <h2 className="mt-2 text-3xl font-black text-[color:var(--ink-deep)]">热门帖子</h2>
            </div>
            <Link to="/posts?sortBy=likeCount" className="rounded-full border border-[color:var(--line-soft)] bg-white/80 px-4 py-2 text-sm font-semibold text-[color:var(--ink-deep)] shadow-[0_10px_25px_rgba(99,74,137,0.08)]">查看更多 →</Link>
          </div>
          {hotLoading ? (
            <HomePostsSkeleton count={3} />
          ) : hotData && hotData.items.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {hotData.items.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="rounded-[28px] border border-white/80 bg-white/80 p-8 text-center text-[color:var(--ink-soft)] shadow-[0_18px_40px_rgba(99,74,137,0.10)]">暂无热门帖子</div>
          )}
        </div>

        <div>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.22em] text-[color:var(--ink-soft)]">刚刚发生</div>
              <h2 className="mt-2 text-3xl font-black text-[color:var(--ink-deep)]">最新帖子</h2>
            </div>
            <Link to="/posts" className="rounded-full border border-[color:var(--line-soft)] bg-white/80 px-4 py-2 text-sm font-semibold text-[color:var(--ink-deep)] shadow-[0_10px_25px_rgba(99,74,137,0.08)]">查看更多 →</Link>
          </div>
          {latestLoading ? (
            <HomePostsSkeleton count={3} />
          ) : latestData && latestData.items.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {latestData.items.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="rounded-[28px] border border-white/80 bg-white/80 p-8 text-center text-[color:var(--ink-soft)] shadow-[0_18px_40px_rgba(99,74,137,0.10)]">
              <p className="mb-4">还没有帖子，成为第一个分享的人吧！</p>
              <Link to="/posts/create" className="inline-block rounded-full bg-[color:var(--ink-deep)] px-6 py-2.5 text-sm font-semibold text-white shadow-[0_18px_35px_rgba(78,56,120,0.25)]">发布帖子</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
