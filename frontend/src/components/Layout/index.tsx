import React, { useEffect, useRef, useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

interface LayoutProps {
  children?: React.ReactNode;
}

const navItemClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
    isActive
      ? 'bg-[color:var(--ink-deep)] text-white'
      : 'text-[color:var(--ink-soft)] hover:text-[color:var(--ink-deep)]'
  }`;

const Layout: React.FC<LayoutProps> = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!profileMenuRef.current?.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
    setIsProfileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-transparent text-[color:var(--ink-deep)]">
      <header className="sticky top-0 z-50 border-b border-[color:var(--line-soft)] bg-[rgba(255,250,244,0.82)] backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-200 via-rose-200 to-sky-200 text-xl shadow-[0_10px_25px_rgba(255,180,120,0.28)]">🐾</div>
            <div>
              <div className="text-lg font-black tracking-[0.18em] text-[color:var(--ink-deep)]">PET FORUM</div>
              <div className="text-xs text-[color:var(--ink-soft)]">软绵绵的养宠日常社区</div>
            </div>
          </Link>

          <nav className="hidden items-center gap-2 rounded-full border border-white/70 bg-white/70 p-1 shadow-[0_12px_30px_rgba(112,92,140,0.08)] md:flex">
            <NavLink to="/" className={navItemClass}>首页</NavLink>
            <NavLink to="/posts" className={navItemClass}>帖子</NavLink>
            <NavLink to="/search" className={navItemClass}>搜索</NavLink>
          </nav>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="rounded-xl p-2 text-[color:var(--ink-soft)] hover:bg-white/80 md:hidden"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>

                <div className="hidden items-center space-x-4 md:flex">
                  <Link
                    to="/posts/create"
                    className="rounded-full bg-[color:var(--ink-deep)] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_16px_30px_rgba(78,56,120,0.22)] transition-transform hover:-translate-y-0.5"
                  >
                    发布帖子
                  </Link>

                  <div className="relative" ref={profileMenuRef}>
                    <button
                      type="button"
                      onClick={() => setIsProfileMenuOpen((open) => !open)}
                      className="flex items-center gap-2 rounded-full border border-white/80 bg-white/80 px-3 py-2 shadow-[0_12px_30px_rgba(112,92,140,0.08)]"
                    >
                      <img
                        src={user?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.id}`}
                        alt={user?.nickname || user?.username}
                        className="h-9 w-9 rounded-full border-2 border-amber-200 object-cover"
                      />
                      <span className="text-sm font-semibold text-[color:var(--ink-deep)]">{user?.nickname || user?.username}</span>
                      <svg className={`h-4 w-4 text-gray-400 transition-transform ${isProfileMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {isProfileMenuOpen && (
                      <div className="absolute right-0 z-50 mt-3 w-52 rounded-3xl border border-white/80 bg-white/95 p-2 shadow-[0_24px_50px_rgba(95,70,130,0.18)]">
                        <Link
                          to="/profile"
                          onClick={() => setIsProfileMenuOpen(false)}
                          className="block rounded-2xl px-4 py-3 text-sm font-medium text-[color:var(--ink-deep)] hover:bg-amber-50"
                        >
                          个人中心
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="block w-full rounded-2xl px-4 py-3 text-left text-sm font-medium text-rose-600 hover:bg-rose-50"
                        >
                          退出登录
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="rounded-xl p-2 text-[color:var(--ink-soft)] hover:bg-white/80 md:hidden"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                <div className="hidden space-x-3 md:flex">
                  <Link to="/auth/login" className="text-sm font-semibold text-[color:var(--ink-soft)] hover:text-[color:var(--ink-deep)]">登录</Link>
                  <Link
                    to="/auth/register"
                    className="rounded-full bg-[color:var(--ink-deep)] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_16px_30px_rgba(78,56,120,0.22)]"
                  >
                    注册
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="border-t border-[color:var(--line-soft)] bg-white/95 shadow-lg backdrop-blur-xl md:hidden">
            <div className="space-y-1 px-2 pt-2 pb-3">
              <Link to="/" className="block rounded-md px-3 py-2 text-base font-medium text-[color:var(--ink-deep)] hover:bg-purple-50" onClick={() => setIsMobileMenuOpen(false)}>首页</Link>
              <Link to="/posts" className="block rounded-md px-3 py-2 text-base font-medium text-[color:var(--ink-deep)] hover:bg-purple-50" onClick={() => setIsMobileMenuOpen(false)}>帖子</Link>
              <Link to="/search" className="block rounded-md px-3 py-2 text-base font-medium text-[color:var(--ink-deep)] hover:bg-purple-50" onClick={() => setIsMobileMenuOpen(false)}>搜索</Link>
              {isAuthenticated ? (
                <>
                  <Link to="/posts/create" className="block rounded-md bg-[color:var(--ink-deep)] px-3 py-2 text-base font-medium text-white" onClick={() => setIsMobileMenuOpen(false)}>发布帖子</Link>
                  <Link to="/profile" className="block rounded-md px-3 py-2 text-base font-medium text-[color:var(--ink-deep)] hover:bg-purple-50" onClick={() => setIsMobileMenuOpen(false)}>个人中心</Link>
                  <button onClick={handleLogout} className="block w-full rounded-md px-3 py-2 text-left text-base font-medium text-rose-600 hover:bg-rose-50">退出登录</button>
                </>
              ) : (
                <>
                  <Link to="/auth/login" className="block rounded-md px-3 py-2 text-base font-medium text-[color:var(--ink-deep)] hover:bg-purple-50" onClick={() => setIsMobileMenuOpen(false)}>登录</Link>
                  <Link to="/auth/register" className="block rounded-md bg-[color:var(--ink-deep)] px-3 py-2 text-base font-medium text-white" onClick={() => setIsMobileMenuOpen(false)}>注册</Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      <main className="flex-grow">
        <Outlet />
      </main>

      <footer className="mt-auto border-t border-[color:var(--line-soft)] bg-[rgba(255,255,255,0.72)] backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div>
              <h3 className="mb-4 text-lg font-black tracking-[0.12em] text-[color:var(--ink-deep)]">宠物论坛</h3>
              <p className="text-[color:var(--ink-soft)]">一个专注于宠物分享和交流的社区平台，让爱宠人士聚集在一起，分享美好时光。</p>
            </div>
            <div>
              <h4 className="mb-4 text-md font-semibold text-[color:var(--ink-deep)]">快速链接</h4>
              <ul className="space-y-2">
                <li><Link to="/about" className="text-[color:var(--ink-soft)] hover:text-[color:var(--ink-deep)]">关于我们</Link></li>
                <li><Link to="/contact" className="text-[color:var(--ink-soft)] hover:text-[color:var(--ink-deep)]">联系我们</Link></li>
                <li><Link to="/terms" className="text-[color:var(--ink-soft)] hover:text-[color:var(--ink-deep)]">服务条款</Link></li>
                <li><Link to="/privacy" className="text-[color:var(--ink-soft)] hover:text-[color:var(--ink-deep)]">隐私政策</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 text-md font-semibold text-[color:var(--ink-deep)]">关注我们</h4>
              <div className="flex space-x-4">
                <a href="https://github.com/yigebibi/animalProF" target="_blank" rel="noreferrer" aria-label="GitHub" className="rounded-2xl border border-white/80 bg-white/80 p-3 text-[color:var(--ink-soft)] shadow-[0_12px_30px_rgba(112,92,140,0.08)] transition-transform hover:-translate-y-1 hover:text-[color:var(--ink-deep)]">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" /></svg>
                </a>
                <a href="https://github.com/yigebibi/animalProF/issues" target="_blank" rel="noreferrer" aria-label="Issues" className="rounded-2xl border border-white/80 bg-white/80 p-3 text-[color:var(--ink-soft)] shadow-[0_12px_30px_rgba(112,92,140,0.08)] transition-transform hover:-translate-y-1 hover:text-[color:var(--ink-deep)]">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12.017 0c-6.627 0-12 5.373-12 12s5.373 12 12 12c6.628 0 12-5.373 12-12s-5.372-12-12-12zm6.983 9h-1.766v2.527h1.766v6.539h-3.613v-6.539h1.861l-.311-2.527h-1.55l.366 2.527h-1.812v-2.527h1.812l.367 2.527h1.548l-.368-2.527zm-6.828 0h1.555v8.109h-1.555v-8.109zm-2.021 0h1.55v8.109h-1.55v-8.109z" /></svg>
                </a>
                <Link to="/contact" aria-label="Contact" className="rounded-2xl border border-white/80 bg-white/80 p-3 text-[color:var(--ink-soft)] shadow-[0_12px_30px_rgba(112,92,140,0.08)] transition-transform hover:-translate-y-1 hover:text-[color:var(--ink-deep)]">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-8 border-t border-[color:var(--line-soft)] pt-6 text-center text-sm text-[color:var(--ink-soft)]">
            <p>&copy; {new Date().getFullYear()} 宠物论坛. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
